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
    <div className="premium-marquee-wrapper" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '50px 0', background: 'rgba(5, 5, 7, 0.4)', backdropFilter: 'blur(10px)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '250px', background: 'linear-gradient(to right, rgba(5,5,7,1) 0%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '250px', background: 'linear-gradient(to left, rgba(5,5,7,1) 0%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }} />

      <div className="premium-marquee-animated">
        {[...Array(6)].map((_, i) => (
          <React.Fragment key={i}>
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
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
