export function HeroLandscape() {
  return (
    <svg
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d2417" />
          <stop offset="55%" stopColor="#123420" />
          <stop offset="100%" stopColor="#17472b" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f7ead0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#dba63f" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="800" fill="url(#sky)" />
      <circle cx="1160" cy="230" r="220" fill="url(#sun)" />
      <circle cx="1160" cy="230" r="70" fill="#f2e0b8" opacity="0.85" />

      {/* distant ridge */}
      <path
        d="M0 460 Q 220 400 440 445 T 880 430 T 1440 450 V 800 H 0 Z"
        fill="#1f5c38"
        opacity="0.55"
      />

      {/* rice terrace bands — the site's signature motif */}
      {[
        { y: 520, fill: "#17472b" },
        { y: 580, fill: "#1f5c38" },
        { y: 640, fill: "#297048" },
        { y: 700, fill: "#3c8a5c" },
        { y: 760, fill: "#63a97e" },
      ].map((band, i) => (
        <path
          key={band.y}
          d={`M0 ${band.y} Q 180 ${band.y - 34} 360 ${band.y - 6} T 720 ${band.y - 10} T 1080 ${band.y - 4} T 1440 ${band.y - 14} V 800 H 0 Z`}
          fill={band.fill}
          opacity={0.92 - i * 0.03}
        />
      ))}

      {/* terrace contour strokes for texture */}
      {[540, 600, 660, 720].map((y) => (
        <path
          key={y}
          d={`M0 ${y} Q 180 ${y - 30} 360 ${y - 4} T 720 ${y - 8} T 1080 ${y - 2} T 1440 ${y - 12}`}
          fill="none"
          stroke="#f7ead0"
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
