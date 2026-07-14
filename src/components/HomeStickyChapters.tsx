"use client";

import { DeviceMock } from "@/components/DeviceMock";
import { StickyChapter } from "@/components/StickyChapter";
import { productMedia, pitchClips } from "@/lib/productMedia";

/** Below-fold home chapters — separate chunk from the hero shell. */
export function HomeStickyChapters() {
  return (
    <>
      <StickyChapter
        eyebrow="01 · Till"
        title="Orders that keep pace with the room."
        body="Open tabs, split bills, modifiers, and payments without slowing the floor. Built for busy service — not demo day."
        visual={
          <DeviceMock
            title="Hostora Till"
            src={pitchClips.till.poster}
            alt={productMedia.till.alt}
            video={pitchClips.till.video}
            priority
          />
        }
      />

      <StickyChapter
        eyebrow="02 · Kitchen"
        title="Every station sees what matters."
        body="Kitchen display, bar tickets, and thermal printing routed by station — so food, drinks, and specialty stations stay in sync."
        visual={
          <DeviceMock
            title="Kitchen display"
            src={pitchClips.kitchen.poster}
            alt={productMedia.kds.alt}
            video={pitchClips.kitchen.video}
          />
        }
      />

      <StickyChapter
        eyebrow="03 · Guests"
        title="Guests order. You prepare."
        body="Table QR ordering, seating invites, and reservation flows that connect guests to service — without a patchwork of widgets."
        visual={
          <DeviceMock
            title="Guest QR & seating"
            src={pitchClips.guests.poster}
            alt={productMedia.guestQr.alt}
            video={pitchClips.guests.video}
          />
        }
      />

      <StickyChapter
        eyebrow="04 · Control"
        title="Supervisors see the floor live."
        body="Attendance, deletion audits, and admin visibility when service gets loud — so event nights and peak hours stay intentional."
        visual={
          <DeviceMock
            title="Supervisor & control"
            src={pitchClips.control.poster}
            alt={productMedia.supervisor.alt}
            video={pitchClips.control.video}
          />
        }
      />
    </>
  );
}
