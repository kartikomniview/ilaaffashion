"use client";

import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import { cropStyle, photoHref, scaleSizes, type ProductView } from "@/lib/product-views";
import { cx } from "@/lib/style";

const MAX_ZOOM = 4;
const TAP_ZOOM = 2.5; // double-tap / double-click
const STEP_ZOOM = 1.5; // + and - buttons and keys
const DRAG_START_PX = 8; // movement before a press counts as a drag rather than a tap
const SWIPE_MIN_PX = 50; // drag distance that moves to the next view
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_PX = 30;
const FRAME_ASPECT = 3 / 4; // cropped views keep the gallery's 3:4 frame

/** Scale and offset (px, from the stage's centre) of the current view. */
type Zoom = { s: number; x: number; y: number };
type Point = { x: number; y: number };
/** Stage size, and the size the current view's content is drawn at before zooming. */
type Box = { left: number; top: number; w: number; h: number; cw: number; ch: number };
type Gesture =
  | { kind: "pending"; start: Point } // one pointer down, not yet moved far enough to tell what it is
  | { kind: "swipe"; start: Point }
  | { kind: "pan"; start: Point; from: Zoom }
  | { kind: "pinch"; dist: number; mid: Point; from: Zoom }
  | { kind: "ignore" }; // e.g. a vertical drag while not zoomed

const NO_ZOOM: Zoom = { s: 1, x: 0, y: 0 };
const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/** Keeps the scale in range and stops the content being dragged off the stage. */
function fit({ s, x, y }: Zoom, box: Box): Zoom {
  const scale = clamp(s, 1, MAX_ZOOM);
  const maxX = Math.max(0, (box.cw * scale - box.w) / 2);
  const maxY = Math.max(0, (box.ch * scale - box.h) / 2);
  return { s: scale, x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
}

/** Changes the scale to `s` while the content under point `p` (relative to the stage's centre) stays put. */
function zoomAround(z: Zoom, s: number, p: Point): Zoom {
  const k = s / z.s;
  return { s, x: p.x - (p.x - z.x) * k, y: p.y - (p.y - z.y) * k };
}

/**
 * Full-screen product photos at /products/[slug]/photos/[n]. Swipe or use the arrows to move
 * between views; pinch, double-tap, scroll or use +/- to zoom, and drag to look around when zoomed.
 *
 * `modal`: opened from the product page, so it sits in a <dialog> over it and closing goes back in
 * history (as do the Back button and gesture). Otherwise the page was opened directly, there may be
 * no product page to go back to, and closing goes to it, replacing this entry.
 * Moving between views replaces the URL rather than adding history entries, so Back always closes.
 */
export function PhotoViewer({
  slug,
  productName,
  views,
  start,
  modal,
}: {
  slug: string;
  productName: string;
  views: ProductView[];
  start: number;
  modal: boolean;
}) {
  const router = useRouter();
  const closing = useRef(false);
  const productHref = `/products/${slug}`;
  const label = `${productName}: photos`;

  // Once only: a double-tap on Close (or Esc then Close) must not go back two pages.
  function goBack() {
    if (closing.current) return;
    closing.current = true;
    router.back();
  }

  if (!modal) {
    return (
      <main aria-label={label}>
        <Viewer
          slug={slug}
          productName={productName}
          views={views}
          start={start}
          closeControl={
            <Link href={productHref} replace aria-label="Close" className={iconButton}>
              <X className="size-5" strokeWidth={1.75} />
            </Link>
          }
          onEscape={() => router.replace(productHref)}
        />
      </main>
    );
  }

  return (
    <ModalShell label={label} onClose={goBack}>
      <Viewer
        slug={slug}
        productName={productName}
        views={views}
        start={start}
        closeControl={
          // First focusable element, so the dialog focuses it on opening.
          <button type="button" onClick={goBack} aria-label="Close" className={iconButton}>
            <X className="size-5" strokeWidth={1.75} />
          </button>
        }
      />
    </ModalShell>
  );
}

// Without `display`, so callers can hide it: `hidden pointer-fine:inline-flex`.
const iconButtonBase =
  "focus-ring size-10 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-surface/90 text-ink transition-colors hover:border-primary hover:bg-primary hover:text-light disabled:pointer-events-none disabled:opacity-35";
const iconButton = `${iconButtonBase} inline-flex`;

/** A modal <dialog> over the current page: traps focus, hides the page from screen readers and locks its scroll. */
function ModalShell({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const mounted = useRef(false);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    mounted.current = true;
    if (!dialog.open) dialog.showModal();
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      mounted.current = false;
      root.style.overflow = overflow;
      // Closed while still in the page, so the browser returns focus to the link that opened it.
      dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault(); // Esc: leave the dialog open until the route changes
        onClose();
      }}
      // Some browsers close it themselves without a cancellable `cancel` (Android's Back gesture does).
      // Ignore the late `close` event from our own cleanup: after unmounting, or once the dialog has
      // been reopened (Strict Mode runs the effect twice).
      onClose={(e: SyntheticEvent<HTMLDialogElement>) => {
        if (mounted.current && !e.currentTarget.open) onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-background p-0 text-ink backdrop:bg-ink/40"
    >
      {children}
    </dialog>
  );
}

function Viewer({
  slug,
  productName,
  views,
  start,
  closeControl,
  onEscape,
}: {
  slug: string;
  productName: string;
  views: ProductView[];
  start: number;
  closeControl: ReactNode;
  /** Only outside the dialog, which handles Esc itself. */
  onEscape?: () => void;
}) {
  const count = views.length;
  const [index, setIndex] = useState(start);
  const [zoom, setZoom] = useState<Zoom>(NO_ZOOM);
  const [animateZoom, setAnimateZoom] = useState(false); // for buttons and double-tap, not for gestures
  const [dragX, setDragX] = useState<number | null>(null);
  const [panning, setPanning] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const aspects = useRef<Record<number, number>>({}); // natural width / height of each uncropped photo
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture | null>(null);
  const lastTap = useRef<{ time: number; at: Point } | null>(null);

  const view = views[index];
  const zoomed = zoom.s > 1;

  function measure(): Box | null {
    const stage = stageRef.current;
    if (!stage) return null;
    const { left, top, width: w, height: h } = stage.getBoundingClientRect();
    const aspect = view.crop ? FRAME_ASPECT : (aspects.current[index] ?? FRAME_ASPECT);
    const cw = Math.min(w, h * aspect);
    return { left, top, w, h, cw, ch: cw / aspect };
  }

  const fromCentre = (p: Point, box: Box): Point => ({ x: p.x - box.left - box.w / 2, y: p.y - box.top - box.h / 2 });

  function go(i: number) {
    const next = clamp(i, 0, count - 1);
    if (next === index) return;
    setIndex(next);
    setZoom(NO_ZOOM);
    setAnimateZoom(false);
    window.history.replaceState(null, "", photoHref(slug, next));
  }

  /** Zoom by `factor` around a point (client coordinates), or the stage's centre. */
  function zoomBy(factor: number, at?: Point) {
    const box = measure();
    if (!box) return;
    const p = at ? fromCentre(at, box) : { x: 0, y: 0 };
    setZoom((z) => fit(zoomAround(z, clamp(z.s * factor, 1, MAX_ZOOM), p), box));
  }

  function onTap(at: Point) {
    const last = lastTap.current;
    const now = performance.now();
    if (last && now - last.time < DOUBLE_TAP_MS && distance(at, last.at) < DOUBLE_TAP_PX) {
      lastTap.current = null;
      setAnimateZoom(true);
      if (zoomed) setZoom(NO_ZOOM);
      else zoomBy(TAP_ZOOM, at);
    } else {
      lastTap.current = { time: now, at };
    }
  }

  function startPinch() {
    const [a, b] = [...pointers.current.values()];
    const box = measure();
    if (!box) return;
    setDragX(null); // a swipe that turns into a pinch springs back
    gesture.current = { kind: "pinch", dist: distance(a, b) || 1, mid: fromCentre(midpoint(a, b), box), from: zoom };
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as Element).closest("button, a")) return; // the arrows over the stage
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setAnimateZoom(false);
    if (pointers.current.size === 2) startPinch();
    else if (pointers.current.size === 1) gesture.current = { kind: "pending", start: { x: e.clientX, y: e.clientY } };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    const box = measure();
    if (!g || !box) return;

    if (g.kind === "pinch") {
      const [a, b] = [...pointers.current.values()];
      if (!b) return;
      const s = clamp((g.from.s * distance(a, b)) / g.dist, 1, MAX_ZOOM);
      // Scale around where the fingers started, then follow them as they move together.
      const z = zoomAround(g.from, s, g.mid);
      const mid = fromCentre(midpoint(a, b), box);
      setZoom(fit({ s, x: z.x + mid.x - g.mid.x, y: z.y + mid.y - g.mid.y }, box));
      return;
    }

    if (g.kind === "ignore") return;
    const dx = e.clientX - g.start.x;
    const dy = e.clientY - g.start.y;
    let current: Gesture = g;
    if (g.kind === "pending") {
      if (Math.hypot(dx, dy) < DRAG_START_PX) return;
      if (zoomed) current = { kind: "pan", start: g.start, from: zoom };
      else if (count > 1 && Math.abs(dx) > Math.abs(dy)) current = { kind: "swipe", start: g.start };
      else current = { kind: "ignore" };
      gesture.current = current;
      if (current.kind === "pan") setPanning(true);
    }

    if (current.kind === "pan") {
      setZoom(fit({ ...current.from, x: current.from.x + dx, y: current.from.y + dy }, box));
    } else if (current.kind === "swipe") {
      const pastEnd = (index === 0 && dx > 0) || (index === count - 1 && dx < 0);
      setDragX(pastEnd ? dx / 3 : dx);
    }
  }

  function onPointerEnd(e: PointerEvent<HTMLDivElement>, cancelled: boolean) {
    if (!pointers.current.delete(e.pointerId)) return;
    const g = gesture.current;

    if (g?.kind === "pinch") {
      // Lifting one finger of a pinch carries on as a drag with the other.
      const rest = [...pointers.current.values()][0];
      gesture.current = rest ? { kind: "pan", start: rest, from: zoom } : null;
      return;
    }
    if (pointers.current.size > 0) return;

    gesture.current = null;
    setPanning(false);
    if (g?.kind === "swipe") {
      const dx = e.clientX - g.start.x;
      setDragX(null);
      if (!cancelled && Math.abs(dx) > SWIPE_MIN_PX) go(index + (dx < 0 ? 1 : -1));
    } else if (g?.kind === "pending" && !cancelled) {
      onTap({ x: e.clientX, y: e.clientY });
    }
  }

  // Wheel and trackpad-pinch zoom. Registered by hand because React's wheel listener is passive and
  // can't stop the browser zooming the whole page on Ctrl+wheel.
  const onWheel = useEffectEvent((e: WheelEvent) => {
    e.preventDefault();
    setAnimateZoom(false);
    zoomBy(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), { x: e.clientX, y: e.clientY });
  });
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const listener = (e: WheelEvent) => onWheel(e);
    stage.addEventListener("wheel", listener, { passive: false });
    return () => stage.removeEventListener("wheel", listener);
  }, []);

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => go(index - 1),
      ArrowRight: () => go(index + 1),
      "+": () => zoomBy(STEP_ZOOM),
      "=": () => zoomBy(STEP_ZOOM),
      "-": () => zoomBy(1 / STEP_ZOOM),
      "0": () => setZoom(NO_ZOOM),
      ...(onEscape && { Escape: onEscape }),
    };
    const action = actions[e.key];
    if (!action) return;
    e.preventDefault();
    setAnimateZoom(true);
    action();
  });
  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-ink">
      <div className="flex items-center gap-3 border-b border-gold/30 px-4 py-2.5 sm:px-6">
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg leading-tight text-ink sm:text-xl">{productName}</p>
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-muted" aria-live="polite">
            <span className="tabular-nums">
              {index + 1} / {count}
            </span>
            <span className="sr-only">: {view.label}</span>
          </p>
        </div>
        {closeControl}
      </div>

      <div
        ref={stageRef}
        className={cx(
          "relative min-h-0 flex-1 touch-none select-none overflow-hidden",
          zoomed ? (panning ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => onPointerEnd(e, false)}
        onPointerCancel={(e) => onPointerEnd(e, true)}
      >
        <div
          className={cx(
            "flex h-full",
            dragX === null && "transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none"
          )}
          style={{ transform: `translate3d(calc(${-index * 100}% + ${dragX ?? 0}px), 0, 0)` }}
        >
          {views.map((v, i) => (
            <div
              key={i}
              aria-hidden={i !== index}
              className="relative h-full w-full shrink-0 overflow-hidden [container-type:size]"
            >
              <div
                className={cx(
                  "absolute inset-0 grid place-items-center",
                  animateZoom && "transition-transform duration-300 ease-out motion-reduce:transition-none"
                )}
                style={i === index ? { transform: `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.s})` } : undefined}
              >
                {v.crop ? (
                  // Same 3:4 frame as the gallery, as large as fits.
                  <div className="relative aspect-[3/4] w-[min(100cqw,75cqh)] overflow-hidden">
                    <Image
                      src={v.src}
                      alt={v.alt}
                      fill
                      sizes={scaleSizes("100vw", v.crop.zoom)}
                      loading="eager"
                      fetchPriority={i === start ? "high" : "auto"}
                      draggable={false}
                      className="object-cover"
                      style={cropStyle(v.crop)}
                    />
                  </div>
                ) : (
                  <Image
                    src={v.src}
                    alt={v.alt}
                    fill
                    sizes="100vw"
                    loading="eager"
                    fetchPriority={i === start ? "high" : "auto"}
                    draggable={false}
                    className="object-contain"
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      aspects.current[i] = img.naturalWidth / img.naturalHeight;
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Previous photo"
              className={cx(iconButtonBase, "absolute left-3 top-1/2 hidden -translate-y-1/2 pointer-fine:inline-flex sm:left-6")}
            >
              <ChevronLeft className="size-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === count - 1}
              aria-label="Next photo"
              className={cx(iconButtonBase, "absolute right-3 top-1/2 hidden -translate-y-1/2 pointer-fine:inline-flex sm:right-6")}
            >
              <ChevronRight className="size-5" strokeWidth={1.75} />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-gold/30 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:px-6">
        <p className="min-w-0 flex-1 text-xs leading-snug text-muted">
          <span className="text-ink">{view.label}</span>
          <span aria-hidden className="pointer-fine:hidden"> · Pinch or double-tap to zoom</span>
          <span aria-hidden className="hidden pointer-fine:inline"> · Scroll or double-click to zoom</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setAnimateZoom(true);
            zoomBy(1 / STEP_ZOOM);
          }}
          disabled={!zoomed}
          aria-label="Zoom out"
          className={iconButton}
        >
          <Minus className="size-4" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => {
            setAnimateZoom(true);
            zoomBy(STEP_ZOOM);
          }}
          disabled={zoom.s >= MAX_ZOOM}
          aria-label="Zoom in"
          className={iconButton}
        >
          <Plus className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
