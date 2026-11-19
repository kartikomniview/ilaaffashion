"use client";

import { useId } from "react";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";

const topics = ["A product", "Sizing & fit", "Visiting the showroom", "Something else"];

const fieldClass =
  "focus-ring mt-1.5 w-full border border-border bg-surface px-4 py-3 text-base text-ink sm:text-[0.95rem] placeholder:text-muted/60 transition-colors hover:border-gold/70 focus:border-gold";
const labelClass = "text-[0.65rem] uppercase tracking-[0.3em] text-ink";

/**
 * No backend needed: the form turns what's typed into a WhatsApp message and opens the chat.
 * To send enquiries by email instead later, swap onSubmit for a Server Action.
 */
export function ContactForm() {
  const id = useId();

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const get = (k: string) => String(data.get(k) ?? "").trim();
        const text = [
          `Hi ${site.name}! I have a question about: ${get("topic")}`,
          "",
          get("message"),
          "",
          `— ${get("name")}${get("phone") ? ` (${get("phone")})` : ""}`,
        ].join("\n");
        window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={labelClass}>
            Your name
          </label>
          <input id={`${id}-name`} name="name" required autoComplete="name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className={labelClass}>
            Phone <span className="normal-case tracking-normal text-muted">(optional)</span>
          </label>
          <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-topic`} className={labelClass}>
          It&apos;s about
        </label>
        <select id={`${id}-topic`} name="topic" className={fieldClass} defaultValue={topics[0]}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={labelClass}>
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={5}
          placeholder="e.g. Is the Maroon Zari Anarkali available in size L?"
          className={`${fieldClass} resize-y`}
        />
      </div>

      <Button type="submit" variant="whatsapp" className="w-full sm:w-auto">
        <WhatsAppIcon className="size-4" /> Send on WhatsApp
      </Button>
      <p className="text-xs text-muted">This opens WhatsApp with your message ready to send.</p>
    </form>
  );
}
