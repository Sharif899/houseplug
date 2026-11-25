"use client";
import Script from "next/script";
import { useEffect } from "react";

// ── Load AdSense script (place in <head> via root layout) ──
export function GoogleAdsense({ clientId }: { clientId?: string }) {
  if (!clientId) return null;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

// ── Individual ad unit ─────────────────────────────────────
interface AdUnitProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  label?: string;
}

export function AdUnit({ slot, format = "auto", className = "", label = "Advertisement" }: AdUnitProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (typeof window !== "undefined" && clientId) {
      try { (window as any).adsbygoogle = (window as any).adsbygoogle || []; (window as any).adsbygoogle.push({}); }
      catch {}
    }
  }, []);

  if (!clientId) {
    return (
      <div className={`ad-slot ${className}`} role="presentation" aria-label="Ad placeholder">
        <span>Advertisement</span>
        <span className="ad-slot-label">{label} · {format}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-[10px] text-center text-[#B8720A] font-bold uppercase tracking-wider mb-1">{label}</p>
      <ins className="adsbygoogle block" style={{display:"block"}}
        data-ad-client={clientId} data-ad-slot={slot}
        data-ad-format={format} data-full-width-responsive="true" />
    </div>
  );
}

// ── Preset variants ────────────────────────────────────────

/** 728×90 horizontal banner */
export function AdBanner({ className }: { className?: string }) {
  return <AdUnit slot="1234567890" format="horizontal" className={`my-6 ${className ?? ""}`} label="Advertisement" />;
}

/** 300×250 sidebar rectangle */
export function AdSidebar({ className }: { className?: string }) {
  return <AdUnit slot="0987654321" format="rectangle" className={className} label="Advertisement" />;
}

/** Responsive in-feed / in-article */
export function AdInFeed({ className }: { className?: string }) {
  return <AdUnit slot="1122334455" format="auto" className={`col-span-full ${className ?? ""}`} label="Sponsored" />;
}

/** In-article (highest RPM) */
export function AdInArticle({ className }: { className?: string }) {
  return <AdUnit slot="5544332211" format="auto" className={`my-8 ${className ?? ""}`} label="Advertisement" />;
}
