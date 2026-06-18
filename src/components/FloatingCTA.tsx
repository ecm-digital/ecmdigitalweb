'use client';

import React, { useState, useEffect } from 'react';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount in case the page is already scrolled
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`floating-cta ${isVisible ? 'visible' : ''}`}
      title="Bezpłatna konsultacja"
      aria-label="Skontaktuj się z nami"
    >
      <span className="floating-cta-icon">📞</span>
      <span className="floating-cta-text">Konsultacja</span>
    </button>
  );
}
