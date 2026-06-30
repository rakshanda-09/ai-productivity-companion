/**
 * Original, hand-built SVG illustration for the homepage hero.
 * Depicts an abstract "task radar" — a checklist orbited by a priority ring
 * and floating status chips — entirely in the app's own navy/violet palette.
 * No external imagery, no copyrighted assets.
 */
export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 480 420"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="Illustration of an AI task radar surrounded by prioritized checklist cards"
    >
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--color-brand))" stopOpacity="0.18" />
          <stop offset="100%" stopColor="rgb(var(--color-violet))" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="hero-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--color-surface-raised))" />
          <stop offset="100%" stopColor="rgb(var(--color-surface))" />
        </linearGradient>
        <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(var(--color-brand))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(var(--color-brand))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* backdrop */}
      <rect width="480" height="420" rx="28" fill="url(#hero-bg)" />
      <circle cx="240" cy="210" r="150" fill="url(#hero-glow)" />

      {/* orbit rings */}
      <circle cx="240" cy="210" r="120" fill="none" stroke="rgb(var(--color-border))" strokeWidth="1.5" strokeDasharray="3 6" />
      <circle cx="240" cy="210" r="84" fill="none" stroke="rgb(var(--color-brand))" strokeOpacity="0.4" strokeWidth="1.5" />

      {/* central radar core */}
      <circle cx="240" cy="210" r="46" fill="url(#hero-card)" stroke="rgb(var(--color-brand))" strokeWidth="2" />
      <path d="M240 210 L240 178" stroke="rgb(var(--color-brand))" strokeWidth="3" strokeLinecap="round" />
      <path d="M240 210 L264 222" stroke="rgb(var(--color-brand-glow))" strokeWidth="3" strokeLinecap="round" />
      <circle cx="240" cy="210" r="5" fill="rgb(var(--color-brand))" />

      {/* CRITICAL task card */}
      <g transform="translate(48,56)">
        <rect width="148" height="64" rx="14" fill="url(#hero-card)" stroke="rgb(var(--color-border))" />
        <circle cx="22" cy="22" r="5" fill="#FF4D6A" />
        <rect x="38" y="16" width="86" height="8" rx="4" fill="rgb(var(--color-text-primary))" opacity="0.85" />
        <rect x="38" y="32" width="56" height="6" rx="3" fill="rgb(var(--color-text-tertiary))" />
        <rect x="14" y="44" width="58" height="14" rx="7" fill="#FF4D6A" fillOpacity="0.15" />
        <text x="22" y="54" fontSize="8" fontFamily="monospace" fontWeight="700" fill="#FF4D6A">CRITICAL</text>
      </g>

      {/* HIGH task card */}
      <g transform="translate(284,40)">
        <rect width="148" height="64" rx="14" fill="url(#hero-card)" stroke="rgb(var(--color-border))" />
        <circle cx="22" cy="22" r="5" fill="#FFA53D" />
        <rect x="38" y="16" width="78" height="8" rx="4" fill="rgb(var(--color-text-primary))" opacity="0.85" />
        <rect x="38" y="32" width="50" height="6" rx="3" fill="rgb(var(--color-text-tertiary))" />
        <rect x="14" y="44" width="40" height="14" rx="7" fill="#FFA53D" fillOpacity="0.15" />
        <text x="22" y="54" fontSize="8" fontFamily="monospace" fontWeight="700" fill="#FFA53D">HIGH</text>
      </g>

      {/* Schedule block card */}
      <g transform="translate(280,300)">
        <rect width="158" height="68" rx="14" fill="url(#hero-card)" stroke="rgb(var(--color-border))" />
        <rect x="16" y="14" width="3" height="40" rx="1.5" fill="rgb(var(--color-brand))" />
        <text x="30" y="28" fontSize="10" fontFamily="monospace" fontWeight="700" fill="rgb(var(--color-text-primary))">09:00 — 10:30</text>
        <rect x="30" y="36" width="92" height="7" rx="3.5" fill="rgb(var(--color-text-secondary))" />
        <rect x="30" y="48" width="60" height="6" rx="3" fill="rgb(var(--color-text-tertiary))" />
      </g>

      {/* Coach chip */}
      <g transform="translate(40,300)">
        <rect width="170" height="60" rx="14" fill="url(#hero-card)" stroke="rgb(var(--color-border))" />
        <circle cx="24" cy="30" r="11" fill="rgb(var(--color-brand))" fillOpacity="0.18" />
        <path d="M19 30 l4 4 l8 -9" stroke="rgb(var(--color-brand))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="44" y="18" width="108" height="7" rx="3.5" fill="rgb(var(--color-text-primary))" opacity="0.85" />
        <rect x="44" y="32" width="80" height="6" rx="3" fill="rgb(var(--color-text-tertiary))" />
      </g>

      {/* connecting lines from core to cards */}
      <path d="M210 188 L130 100" stroke="rgb(var(--color-border))" strokeWidth="1.2" />
      <path d="M276 192 L320 90" stroke="rgb(var(--color-border))" strokeWidth="1.2" />
      <path d="M258 244 L340 300" stroke="rgb(var(--color-border))" strokeWidth="1.2" />
      <path d="M212 240 L130 300" stroke="rgb(var(--color-border))" strokeWidth="1.2" />
    </svg>
  );
}
