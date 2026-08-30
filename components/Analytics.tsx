"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GA_MEASUREMENT_ID, events, track } from "@/lib/analytics";
import { CONSENT_EVENT, readConsent, type Consent } from "@/lib/consent";

/**
 * The tag, and the two things worth measuring on this site.
 *
 * It renders nothing until statistics have been accepted. That is stricter
 * than Consent Mode's "load the tag with everything denied": even a cookieless
 * ping sends the visitor's IP to Google, and in Denmark that is the part the
 * supervisory authority has taken issue with. No consent, no request.
 *
 * page_view is sent by hand rather than by the tag, because the site navigates
 * client-side: gtag would count the first page and then nothing else. Passing
 * send_page_view:false to config and sending one per pathname is the way to
 * get exactly one event per page and no duplicate on the first.
 */
export default function Analytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);

  /* Read the stored answer after hydration: localStorage does not exist on the
     server, and a mismatch here would be a hydration error. */
  useEffect(() => {
    setConsent(readConsent());
    const onChange = (e: Event) => setConsent((e as CustomEvent).detail ?? null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  /* One page_view per page, including the first one after the tag loads. */
  useEffect(() => {
    if (consent !== "granted" || !ready) return;
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, consent, ready]);

  /*
   * One delegated listener instead of an onClick in six components.
   *
   * Outbound links, scroll depth and file downloads are already covered by
   * Enhanced Measurement in the property, so they are deliberately not sent
   * from here — the same click counted twice is worse than not counted.
   */
  useEffect(() => {
    if (consent !== "granted") return;

    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";

      if (href.startsWith("mailto:")) {
        track(events.emailClick, { link_location: pathname });
        return;
      }
      if (href.startsWith("tel:")) {
        track(events.phoneClick, { link_location: pathname });
        return;
      }
      /* The primary action: the quote page and the fleet enquiry, in both
         languages. The label says which of the CTAs was clicked; it is our own
         copy, never anything the visitor typed. */
      if (/^\/(en\/)?tilbud(\?|$)/.test(href)) {
        track(events.quoteCta, {
          link_location: pathname,
          link_text: (link.textContent ?? "").trim().slice(0, 60),
        });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [consent, pathname]);

  if (consent !== "granted") return null;

  return (
    <>
      {/* The queue first, the library second — the order of Google's own
          snippet. Anything sent before gtag.js finishes loading lands in
          dataLayer and is processed when it does, so no event is lost. */}
      <Script id="ga4-config" strategy="afterInteractive" onReady={() => setReady(true)}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted',
            functionality_storage: 'granted',
            security_storage: 'granted'
          });
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
