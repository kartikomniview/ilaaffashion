"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type TransitionEvent,
} from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import type { BannerSlide } from "@/lib/types";
import { cx } from "@/lib/style";

const SLIDE_MS = 5000;
const DRAG_START_PX = 8; // movement before a press counts as a drag rather than a tap
const SWIPE_MIN_PX = 50; // drag distance that moves to the next slide
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
// Tailwind's `sm` breakpoint. Below it, slides that have a `mobileSrc` show that version instead, so
// a frame for such banners should switch its aspect ratio at the same width (`sm:aspect-…`).
const WIDE_SCREEN = "(min-width: 40rem)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

interface BannerSliderProps {
  slides: BannerSlide[];
  /** Name of the carousel for screen readers, e.g. "Featured collections". */
  label: string;
  /**
   * Shape of the visible area: an aspect ratio that matches the banner files exactly (so the frame is
   * as tall as the image and nothing is cropped), plus any corners, border or background.
   */
  frameClassName: string;
  /** Layout of the whole carousel, frame and dots together, e.g. a width limit. */
  className?: string;
  /** How wide the banner is drawn, so the browser picks the right file (the image `sizes` attribute). */
  sizes: string;
  /** The first banner is the page's main image (the hero), so fetch it before anything else. */
  priority?: boolean;
}

/**
 * Banner carousel: swiped by touch or mouse, moved with the arrow keys once focused, or picked with
 * the dots. Each banner links to its `href`.
 *
 * The track is [last, ...slides, first]: sliding onto a copy at either end and then jumping (without
 * animation) to the real slide makes it loop seamlessly both ways. Slides advance every 5s; the timer
 * restarts after any manual change. Rotation pauses while dragging, while a keyboard user is inside
 * it and in a background tab, and stays off for people who prefer reduced motion.
 */
export function BannerSlider({
  slides,
  label,
  frameClassName,
  className,
  sizes,
  priority = false,
}: BannerSliderProps) {
  const count = slides.length;
  const loops = count > 1;
  const track = loops ? [slides[count - 1], ...slides, slides[0]] : slides;

  const [pos, setPos] = useState(loops ? 1 : 0); // index into `track`
  const [animate, setAnimate] = useState(true);
  const [dragX, setDragX] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  // The server snapshot says "reduced", so autoplay only starts once the browser confirms motion is fine.
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true
  );
  const tabHidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false);
  const hintId = useId();
  const drag = useRef<{ x: number; y: number; started: boolean } | null>(null);
  const suppressClick = useRef(false);

  const active = loops ? (pos - 1 + count) % count : 0;
  const dragging = dragX !== null;
  const running = loops && !reducedMotion && !focused && !dragging && !tabHidden;

  // Keyed on `active`, so hopping from an end copy to its real slide doesn't restart the wait.
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setAnimate(true);
      setPos((p) => Math.min(p + 1, count + 1));
    }, SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [running, active, count]);

  // Never past the copies at either end; onTransitionEnd then hops back onto the real slide.
  const step = (direction: 1 | -1) => {
    setAnimate(true);
    setPos((p) => Math.min(Math.max(p + direction, 0), count + 1));
  };
  const toRealSlide = (p: number) => (p === 0 ? count : p === count + 1 ? 1 : p);
  const showSlide = (index: number) => {
    setAnimate(true);
    setPos(index + 1);
  };

  function onTransitionEnd(e: TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget || !loops) return;
    if (pos === 0 || pos === count + 1) {
      setAnimate(false);
      setPos(toRealSlide(pos));
    }
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    suppressClick.current = false;
    if (!loops || !e.isPrimary || e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, started: false };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.started) {
      // Mostly vertical: it's a page scroll, not a swipe.
      if (Math.abs(dy) > DRAG_START_PX && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        return;
      }
      if (Math.abs(dx) < DRAG_START_PX) return;
      d.started = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setPos(toRealSlide); // if grabbed while resting on a copy, swap to its identical real slide
    }
    setDragX(dx);
  }

  function endDrag(e: PointerEvent<HTMLDivElement>, cancelled: boolean) {
    const d = drag.current;
    drag.current = null;
    if (!d?.started) return;
    const dx = e.clientX - d.x;
    suppressClick.current = true;
    setDragX(null);
    setAnimate(true);
    if (!cancelled && Math.abs(dx) > SWIPE_MIN_PX) step(dx < 0 ? 1 : -1);
  }

  // A drag ends in a click; don't let it open the banner underneath.
  function onClickCapture(e: MouseEvent) {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!loops || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    e.preventDefault();
    // A focused slide link is about to go inert, which would drop focus; keep it on the carousel.
    // (Focus on a dot can stay where it is.)
    if (e.target instanceof HTMLAnchorElement) e.currentTarget.focus();
    step(e.key === "ArrowRight" ? 1 : -1);
  }

  // Only keyboard focus pauses: clicking the banner also focuses it, and that shouldn't stop the rotation.
  function onFocus(e: FocusEvent<HTMLDivElement>) {
    if (e.target.matches(":focus-visible")) setFocused(true);
  }

  function onBlur(e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      aria-describedby={loops ? hintId : undefined}
      tabIndex={loops ? 0 : undefined}
      className={cx(
        "relative focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary",
        className
      )}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div
        className={cx("relative touch-pan-y select-none overflow-hidden", frameClassName, dragging && "cursor-grabbing")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e, false)}
        onPointerCancel={(e) => endDrag(e, true)}
        onClickCapture={onClickCapture}
      >
        <div
          aria-live={running ? "off" : "polite"}
          className={cx(
            "flex h-full",
            animate && !dragging && "transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          )}
          style={{ transform: `translate3d(calc(${-pos * 100}% + ${dragX ?? 0}px), 0, 0)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {track.map((slide, i) => {
            const isCopy = loops && (i === 0 || i === count + 1);
            const index = loops ? (i - 1 + count) % count : i;
            const isFirst = !isCopy && index === 0;
            return (
              <div
                key={isCopy ? `${slide.id}-copy-${i}` : slide.id}
                {...(isCopy
                  ? { "aria-hidden": true }
                  : { role: "group", "aria-roledescription": "slide", "aria-label": `${index + 1} of ${count}: ${slide.title}` })}
                inert={i !== pos}
                className="relative h-full w-full shrink-0"
              >
                <Link
                  href={slide.href}
                  draggable={false}
                  className="relative block size-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary"
                >
                  {/* The hero's first banner is fetched first; banners further down the page wait their turn. */}
                  <SlideImage slide={slide} sizes={sizes} fetchPriority={!priority ? "low" : isFirst ? "high" : undefined} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {loops && (
        <>
          {/* Plain white dots over the bottom middle of the banner, all the same size; the current one is
              solid. The shadow keeps them visible over light or busy areas. Each button is a 24px tap
              target around the small dot. The gap below scales with the slider's height, which keeps
              the dots under the text on the thin offer banners and off the edge of the tall hero. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[2%] flex justify-center">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show slide ${i + 1}: ${slide.title}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => showSlide(i)}
                className="group pointer-events-auto rounded-full p-2 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-white"
              >
                <span
                  className={cx(
                    "block size-2 rounded-full shadow-[0_0_4px_rgb(0_0_0/0.55)] transition-colors duration-300 motion-reduce:transition-none",
                    i === active ? "bg-white" : "bg-white/45 group-hover:bg-white/80"
                  )}
                />
              </button>
            ))}
          </div>
          <p id={hintId} className="sr-only">
            Use the left and right arrow keys to change slides.
          </p>
        </>
      )}
    </div>
  );
}

/**
 * One banner image. With a `mobileSrc`, phones get that version instead (art direction via <picture>,
 * which downloads only the version that matches the screen).
 */
function SlideImage({
  slide,
  sizes,
  fetchPriority,
}: {
  slide: BannerSlide;
  sizes: string;
  fetchPriority: "high" | "low" | undefined;
}) {
  // Off-screen slides must already be loaded when they're swiped in, so nothing is lazy.
  const common = { alt: slide.alt, fill: true, draggable: false, sizes, className: "object-cover" };
  if (!slide.mobileSrc) {
    return <Image {...common} src={slide.src} alt={slide.alt} loading="eager" fetchPriority={fetchPriority} />;
  }

  const { props: wide } = getImageProps({ ...common, src: slide.src });
  const { props: narrow } = getImageProps({ ...common, src: slide.mobileSrc, loading: "eager", fetchPriority });
  return (
    <picture>
      <source media={WIDE_SCREEN} srcSet={wide.srcSet} sizes={wide.sizes} />
      <img {...narrow} alt={slide.alt} />
    </picture>
  );
}
