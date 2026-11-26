"use client";

import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState, type ComponentProps, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Volume2, VolumeX, X } from "lucide-react";
import type { ReelClip } from "@/components/home/video-reel";
import { buttonClass } from "@/components/ui/button";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { cx } from "@/lib/style";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** play() was refused because the clip has sound (or the device allows no autoplay at all), not cut short by a pause. */
const isBlocked = (error: unknown) => error instanceof DOMException && error.name === "NotAllowedError";

/**
 * The "Moments in Style" clips, full screen. Swipe to move between them (one clip per swipe), or use
 * the arrow buttons, arrow keys or a trackpad. The clip on screen plays with sound and the others wait,
 * paused; tap the clip to pause it. Tapping outside the clip, ✕ or Esc calls `onClose`.
 *
 * The track is a native scroll-snap row of full-width slides, so swiping feels like the rest of the
 * phone. Which slide is on screen comes from how far it's scrolled.
 *
 * Mount it from a tap, inside flushSync: it starts the first clip while mounting, and browsers only let
 * video play with sound from a tap. If one still refuses, the clip plays muted and the sound button
 * says so.
 */
export function ReelViewer({ clips, start, onClose }: { clips: ReelClip[]; start: number; onClose: () => void }) {
  const count = clips.length;
  const trackRef = useRef<HTMLUListElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(start);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false); // the clip on screen is paused (by a tap, or because it couldn't start)

  // Open on the clip that was tapped. This runs after the dialog has been shown (a child's effects run
  // first), which matters: a closed dialog isn't laid out, so it can't be scrolled.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollLeft = start * track.clientWidth;
    closeRef.current?.focus();
  }, [start]);

  // Only the clip on screen plays. A layout effect, so that on opening it runs inside the tap.
  useLayoutEffect(() => {
    videos.current.forEach((video, i) => {
      if (video && i !== active) video.pause();
    });
    const video = videos.current[active];
    if (!video) return;
    video.muted = muted;
    if (paused) {
      video.pause();
      return;
    }
    video.play().catch((error) => {
      if (!isBlocked(error)) return;
      // No autoplay at all (an iPhone in Low Power Mode): show the play button and wait for a tap.
      if (video.muted) return setPaused(true);
      // Sound needs a fresh tap: play muted for now.
      video.muted = true;
      setMuted(true);
      video.play().catch((retryError) => isBlocked(retryError) && setPaused(true));
    });
  }, [active, muted, paused]);

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.min(Math.max(Math.round(track.scrollLeft / track.clientWidth), 0), count - 1);
    if (i === active) return;
    setActive(i);
    setPaused(false);
  }

  function go(i: number) {
    const track = trackRef.current;
    if (!track || i < 0 || i >= count) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: reducedMotion ? "instant" : "smooth" });
  }

  function togglePlay() {
    const video = videos.current[active];
    if (!video) return;
    if (video.paused) {
      setPaused(false);
      video.play().catch(() => {});
    } else {
      setPaused(true);
      video.pause();
    }
  }

  function toggleSound() {
    const video = videos.current[active];
    const next = !muted;
    setMuted(next);
    if (!video) return;
    // Unmuted here, during the tap, because browsers only let sound start from one.
    video.muted = next;
    if (video.paused && !paused) video.play().catch(() => {});
  }

  // Tapping the dark space around the clip closes the viewer.
  function closeOutside(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    go(active + (e.key === "ArrowRight" ? 1 : -1));
  });
  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <ModalDialog label="Moments in Style videos" onClose={onClose} className="bg-[#1a0c0c] text-light backdrop:bg-black/70">
      <div className="flex h-dvh flex-col">
        <div className="flex items-center gap-2 px-3 py-2.5 sm:px-6 sm:py-4">
          <p aria-live="polite" className="min-w-0 flex-1 text-[0.65rem] uppercase tracking-[0.3em] text-light/70">
            <span className="tabular-nums">
              {active + 1} / {count}
            </span>
            <span className="sr-only">: {clips[active].name}</span>
          </p>
          <ControlButton label={muted ? "Unmute" : "Mute"} onClick={toggleSound} className="size-10">
            {muted ? (
              <VolumeX aria-hidden className="size-4.5" strokeWidth={1.75} />
            ) : (
              <Volume2 aria-hidden className="size-4.5" strokeWidth={1.75} />
            )}
          </ControlButton>
          <ControlButton ref={closeRef} label="Close" onClick={onClose} className="size-10">
            <X aria-hidden className="size-5" strokeWidth={1.75} />
          </ControlButton>
        </div>

        {/* The clip is as large as fits: the full height here, or the full width less a small margin. */}
        <div className="relative min-h-0 flex-1 pb-3 sm:pb-6">
          <div className="size-full [container-type:size]">
            <ul
              ref={trackRef}
              onScroll={onScroll}
              className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
            >
              {clips.map((clip, i) => (
                <li
                  key={clip.id}
                  inert={i !== active}
                  onClick={closeOutside}
                  className="grid h-full w-full shrink-0 snap-center snap-always place-items-center"
                >
                  <div className="relative aspect-[9/16] w-[min(100cqh*9/16,100cqw_-_1.5rem)] overflow-hidden rounded-2xl bg-[#2a1414] ring-1 ring-gold/40">
                    <video
                      ref={(el) => {
                        videos.current[i] = el;
                      }}
                      src={clip.src}
                      poster={clip.poster}
                      loop
                      playsInline
                      preload="none"
                      disableRemotePlayback
                      aria-hidden
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={`${paused ? "Play" : "Pause"} ${clip.name} video`}
                      className="absolute inset-0 grid place-items-center rounded-2xl focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold"
                    >
                      {paused && (
                        <span className="grid size-16 place-items-center rounded-full bg-[#2a1414]/55 ring-1 ring-white/30 backdrop-blur-sm">
                          <Play aria-hidden className="size-6 translate-x-0.5 fill-current" />
                        </span>
                      )}
                    </button>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-[#1a0c0c]/90 via-[#1a0c0c]/40 to-transparent p-4 pt-20 sm:p-5 sm:pt-24">
                      <p className="font-serif text-2xl font-medium leading-tight sm:text-3xl">{clip.name}</p>
                      {/* Replaces the viewer's history entry, so Back from the shop goes straight to the home page. */}
                      <Link href={clip.href} replace className={buttonClass("gold", "sm", "pointer-events-auto mt-3")}>
                        Shop {clip.name} <ArrowRight aria-hidden className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <ControlButton
            label="Previous video"
            onClick={() => go(active - 1)}
            disabled={active === 0}
            touchHidden
            className="absolute left-4 top-1/2 size-11 -translate-y-1/2 sm:left-8"
          >
            <ChevronLeft aria-hidden className="size-5" strokeWidth={1.75} />
          </ControlButton>
          <ControlButton
            label="Next video"
            onClick={() => go(active + 1)}
            disabled={active === count - 1}
            touchHidden
            className="absolute right-4 top-1/2 size-11 -translate-y-1/2 sm:right-8"
          >
            <ChevronRight aria-hidden className="size-5" strokeWidth={1.75} />
          </ControlButton>
        </div>
      </div>
    </ModalDialog>
  );
}

/**
 * A round, see-through button for laying over video. Give it a size in `className`. `touchHidden`
 * leaves it out on touch screens, where swiping does the job.
 */
export function ControlButton({
  label,
  touchHidden,
  className,
  ...props
}: Omit<ComponentProps<"button">, "aria-label" | "type"> & { label: string; touchHidden?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(
        touchHidden ? "hidden pointer-fine:grid" : "grid",
        "shrink-0 place-items-center rounded-full bg-[#2a1414]/50 text-light ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-[#2a1414]/75 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-35",
        className
      )}
      {...props}
    />
  );
}
