import React from "react";

export function TraditionalLogoEmblem({ className = "w-10 h-10 text-gold-dark" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="2" />
      
      {/* Traditional Square & Swirl Central Emblem */}
      <rect x="34" y="34" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M50 20V80M20 50H80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      
      {/* 4 Corner Swirl Ornaments */}
      <circle cx="50" cy="50" r="6" fill="currentColor" />
      <circle cx="34" cy="34" r="3" fill="currentColor" />
      <circle cx="66" cy="34" r="3" fill="currentColor" />
      <circle cx="34" cy="66" r="3" fill="currentColor" />
      <circle cx="66" cy="66" r="3" fill="currentColor" />
    </svg>
  );
}

export function SectionHeaderGold({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 my-8">
      {/* Left Scroll Ornament */}
      <svg className="w-12 sm:w-20 h-5 text-gold" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10H70M70 10C75 10 80 5 85 5C90 5 95 10 100 10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" />
        <circle cx="40" cy="10" r="2.5" fill="currentColor" />
        <circle cx="70" cy="10" r="3" fill="currentColor" />
        <path d="M85 5C82 5 80 8 80 10C80 12 82 15 85 15C88 15 90 12 90 10" stroke="currentColor" strokeWidth="1" />
      </svg>

      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-bronze-deep tracking-wider uppercase text-center">
        {title}
      </h2>

      {/* Right Scroll Ornament (Mirrored) */}
      <svg className="w-12 sm:w-20 h-5 text-gold scale-x-[-1]" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10H70M70 10C75 10 80 5 85 5C90 5 95 10 100 10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" />
        <circle cx="40" cy="10" r="2.5" fill="currentColor" />
        <circle cx="70" cy="10" r="3" fill="currentColor" />
        <path d="M85 5C82 5 80 8 80 10C80 12 82 15 85 15C88 15 90 12 90 10" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function ArtisanMedallion({ className = "w-24 h-24 text-gold-dark" }: { className?: string }) {
  return (
    <div className={`relative rounded-full border-2 border-gold-border p-1 bg-parchment-card shadow-inner flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gold-dark">
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" />
        <path d="M30 65C30 55 35 48 45 48C48 48 52 50 55 53L65 42M65 42L72 50M65 42L58 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="45" cy="40" r="6" stroke="currentColor" strokeWidth="2" />
        <path d="M25 75H75M35 75V65M65 75V55" stroke="currentColor" strokeWidth="2" />
        <circle cx="68" cy="62" r="5" fill="currentColor" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

export function BronzeCorner({ className = "w-8 h-8 text-gold" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2 38V6C6 6 10 2 10 2H38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 34V10C10 10 14 6 14 6H34" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7" />
      <circle cx="6" cy="6" r="2.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

export function BronzeDivider({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center my-8 px-4">
      {subtitle && (
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-dark mb-2 block">
          {subtitle}
        </span>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-bronze-deep text-center mb-4">
          {title}
        </h2>
      )}
      <div className="flex items-center justify-center gap-3 w-full max-w-md">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/60 to-gold"></div>
        <div className="w-3 h-3 rotate-45 border border-gold bg-parchment flex items-center justify-center">
          <div className="w-1 h-1 bg-gold"></div>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gold/60 to-gold"></div>
      </div>
    </div>
  );
}

export function TrongDongIcon({ className = "w-12 h-12 text-gold" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="50"
          y1="50"
          x2={50 + 14 * Math.cos((deg * Math.PI) / 180)}
          y2={50 + 14 * Math.sin((deg * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}