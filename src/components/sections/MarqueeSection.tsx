'use client';

import React from "react";
import Image from "next/image";

const LOGOS = [
  { src: '/assets/images/partners/aws-transparent.svg', alt: 'AWS', height: 48, style: { filter: 'brightness(0) invert(1)' } },
  { src: '/assets/images/partners/google logo.svg', alt: 'Google Cloud', height: 48, style: { filter: 'brightness(0) invert(1)' } },
  { src: '/assets/images/partners/shopify-transparent.svg', alt: 'Shopify', height: 48, style: { filter: 'brightness(0) invert(1)' } },
  { src: '/assets/images/partners/Cloudwise Logo.png', alt: 'Cloudwise', height: 26, style: {} },
];

export default function MarqueeSection() {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '40px 0', background: 'rgba(5, 5, 7, 0.4)', backdropFilter: 'blur(10px)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(40px, 8vw, 80px)', flexWrap: 'wrap' }}>
        {LOGOS.map((logo) => (
          <Image
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            className="marquee-logo"
            width={120}
            height={logo.height}
            style={{ width: 'auto', height: `${logo.height}px`, ...logo.style }}
          />
        ))}
      </div>
    </div>
  );
}
