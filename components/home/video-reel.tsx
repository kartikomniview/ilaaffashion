"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { StyleVideo } from "@/lib/types";
import { cx } from "@/lib/style";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ControlButton, ReelViewer } from "@/components/home/reel-viewer";

/** A clip ready to show: its files, plus the name and shop link of the category it shows. */
export type ReelClip = Omit<StyleVideo, "category"> & { name: string; href: string };

// How much of a tile must be on screen before its clip plays. At half, the sliver of the next tile
// peeking in at the edge of a phone's row stays still.
const IN_VIEW = 0.5;

/**
 * Portrait clips in a row: swipeable on phones and tablets, all side by side from lg. Tapping one opens
 * it full screen in the viewer, where you can swipe through them all with sound.
 *
 * Opening adds a history entry, so the Back button or gesture closes the viewer instead of leaving the
 * page; closing it any other way goes back over that entry.
 */
export function VideoReel({ clips }: { clips: ReelClip[] }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const closing = useRef(false);
  const isOpen = openAt !== null;

  function open(i: number) {
    window.history.pushState({ reel: true }, "");
    closing.current = false;
    // Mounted right away, inside the tap, so the viewer can start the clip with sound.
    flushSync(() => setOpenAt(i));
  }

  function close() {
    // Once only: a double tap on Close must not go back past the page.
    if (closing.current) return;
    closing.current = true;
    window.history.back(); // the popstate listener below then closes the viewer
  }

  useEffect(() => {
    if (!isOpen) return;
    const onPopState = () => setOpenAt(null);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isOpen]);

  return (
    <>
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0">
        {clips.map((clip, i) => (
          <li key={clip.id} className="w-[44vw] max-w-60 shrink-0 snap-start sm:w-[30vw] lg:w-auto lg:max-w-none">
            <ClipTile clip={clip} suspended={isOpen} onOpen={() => open(i)} />
          </li>
        ))}
      </ul>
      {isOpen && <ReelViewer clips={clips} start={openAt} onClose={close} />}
    </>
  );
}

/**
 * One clip over its cover image. It plays, muted and looping, while at least half of the tile is on
 * screen and pauses when scrolled away or while the viewer is open (`suspended`); with
 * preload="none" nothing downloads before it first plays. People whose device asks for reduced motion
 * see the cover until they press play. The button in the corner pauses or plays it; tapping anywhere
 * else opens the viewer.
 */
function ClipTile({ clip, suspended, onOpen }: { clip: ReelClip; suspended: boolean; onOpen: () => void }) {
  const tileRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  // What the visitor last chose with the play button. Until they choose, the clip plays by itself
  // unless their device asks for reduced motion.
  const [choice, setChoice] = useState<"play" | "pause" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false); // the clip has a frame up, so it can fade in over the cover

  const wantsPlay = choice ? choice === "play" : !reducedMotion;

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= IN_VIEW), {
      threshold: IN_VIEW,
    });
    observer.observe(tile);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Set on the element itself so it's sure to be muted before play(): browsers only start video by
    // themselves when it's muted.
    video.muted = true;
    // If the browser refuses (an iPhone in Low Power Mode won't autoplay), the cover stays up with a play button.
    if (inView && wantsPlay && !suspended) video.play().catch(() => {});
    else video.pause();
  }, [inView, wantsPlay, suspended]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setChoice("play");
      video.play().catch(() => {});
    } else {
      setChoice("pause");
      video.pause();
    }
  }

  return (
    <div ref={tileRef} className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-primary ring-1 ring-gold/50">
      <Image
        src={clip.poster}
        alt="" // the button over the tile names the clip
        fill
        sizes="(min-width: 1024px) 230px, (min-width: 640px) 30vw, 44vw"
        className="object-cover"
      />
      <video
        ref={videoRef}
        src={clip.src}
        loop
        playsInline
        preload="none"
        disableRemotePlayback // stops Chrome on Android laying a cast button over the clip
        aria-hidden
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onPlaying={() => setShown(true)}
        className={cx(
          "absolute inset-0 size-full object-cover transition-opacity duration-700",
          shown ? "opacity-100" : "opacity-0"
        )}
      />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#2a1414]/90 via-[#2a1414]/35 to-transparent" />

      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="absolute inset-0 flex flex-col items-start justify-end rounded-2xl p-3 text-left text-light focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold sm:p-4"
      >
        <span className="font-serif text-lg font-medium leading-tight sm:text-xl">{clip.name}</span>
        <span className="mt-1.5 inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-gold">
          Watch <Play aria-hidden className="size-3 fill-current transition-transform group-hover:scale-125" />
        </span>
      </button>

      {/* After the button, so it sits on top of it. */}
      <ControlButton
        label={`${playing ? "Pause" : "Play"} ${clip.name} video`}
        onClick={togglePlay}
        className="absolute right-2 top-2 size-9 sm:right-3 sm:top-3"
      >
        {playing ? (
          <Pause aria-hidden className="size-3.5 fill-current" />
        ) : (
          <Play aria-hidden className="size-3.5 translate-x-px fill-current" />
        )}
      </ControlButton>
    </div>
  );
}
