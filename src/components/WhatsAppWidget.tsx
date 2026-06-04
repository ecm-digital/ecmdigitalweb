"use client";

import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
  const [isHovered, setIsHovered] = useState(false);
  
  // Update with correct user number
  const phoneNumber = "48517303400";
  const defaultMessage = "Cześć! Piszę ze strony ECM Digital.";
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start" style={{ zIndex: 9999 }}>
      {/* Tooltip */}
      <div 
        className={`mb-3 ml-2 px-4 py-2 bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-2xl text-sm font-medium text-white shadow-xl transition-all duration-300 transform origin-bottom ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-2 pointer-events-none'}`}
      >
        Napisz do nas na WhatsApp
      </div>

      {/* Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group p-4 rounded-full flex items-center justify-center transition-all duration-300"
      >
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#128C7E] to-[#25D366] rounded-full scale-90 group-hover:scale-100 transition-transform duration-300" />
        
        {/* Inner Button (Glassmorphism) */}
        <div className="relative inline-flex items-center justify-center w-12 h-12 bg-[#25D366]/20 backdrop-blur-xl border border-white/30 rounded-full shadow-2xl overflow-hidden group-hover:bg-[#25D366]/40 transition-colors duration-300">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full border-2 border-[#25D366]/50 animate-ping" style={{ animationDuration: '3s' }} />
      </a>
    </div>
  );
}
