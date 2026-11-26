"use client";

import { useLayoutEffect, useRef, type ReactNode, type SyntheticEvent } from "react";
import { cx } from "@/lib/style";

/**
 * A full-screen modal <dialog> over the current page: traps focus, hides the page from screen readers
 * and locks its scroll. It opens when mounted and closes when unmounted, so Esc (and the Back gesture
 * on browsers that close dialogs themselves) only call `onClose`, which should end with it unmounting.
 * Colours come from `className`.
 */
export function ModalDialog({
  label,
  onClose,
  className,
  children,
}: {
  label: string;
  onClose: () => void;
  className?: string;
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
      // Closed while still in the page, so the browser returns focus to whatever opened it.
      dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault(); // Esc: leave the dialog open until it unmounts
        onClose();
      }}
      // Some browsers close it themselves without a cancellable `cancel` (Android's Back gesture does).
      // Ignore the late `close` event from our own cleanup: after unmounting, or once the dialog has
      // been reopened (Strict Mode runs the effect twice).
      onClose={(e: SyntheticEvent<HTMLDialogElement>) => {
        if (mounted.current && !e.currentTarget.open) onClose();
      }}
      className={cx("fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 p-0", className)}
    >
      {children}
    </dialog>
  );
}
