import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  showText?: boolean;
  className?: string;
}

export default function Logo({ showText = true, className = 'w-auto h-12', ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 540 450"
      className={`select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        {/* Soft 3D lighting shadow under the play button */}
        <filter id="shadowFilter" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="3" dy="12" stdDeviation="8" floodColor="#000000" floodOpacity="0.32" />
        </filter>

        {/* Dynamic sky gradient (royal and dark blue mix) */}
        <linearGradient id="skyGradient" x1="200" y1="40" x2="200" y2="235" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>

        {/* Bottom soft white/gray gradient */}
        <linearGradient id="whiteGradient" x1="200" y1="235" x2="200" y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>

        {/* 3D bezel chrome outline stroke */}
        <linearGradient id="bezelGradient" x1="75" y1="40" x2="440" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0.9" />
        </linearGradient>

        <clipPath id="playClip">
          <path d="M 120,40 C 95,20 75,35 75,70 L 75,370 C 75,405 95,420 120,400 L 440,240 C 465,225 465,195 440,180 Z" />
        </clipPath>
      </defs>

      {/* Main Play Button with drop shadow */}
      <g filter="url(#shadowFilter)">
        {/* Sky gradient background segment (above division) */}
        <rect x="0" y="0" width="600" height="235" fill="url(#skyGradient)" clipPath="url(#playClip)" />

        {/* White bottom segment (below division) */}
        <rect x="0" y="235" width="600" height="250" fill="url(#whiteGradient)" clipPath="url(#playClip)" />

        {/* Dynamic Pernambuco Rainbow Arc */}
        <circle cx="165" cy="235" r="145" stroke="#ef4444" strokeWidth="10" fill="none" clipPath="url(#playClip)" />
        <circle cx="165" cy="235" r="135" stroke="#facc15" strokeWidth="10" fill="none" clipPath="url(#playClip)" />
        <circle cx="165" cy="235" r="125" stroke="#22c55e" strokeWidth="10" fill="none" clipPath="url(#playClip)" />

        {/* Gold Star at top left of sky */}
        <path
          d="M 215,80 L 219.5,89.5 L 229.5,90.7 L 222,97.4 L 224,107.5 L 215,102.4 L 206,107.5 L 208,97.4 L 200.5,90.7 L 210.5,89.5 Z"
          fill="#fbbf24"
          clipPath="url(#playClip)"
        />

        {/* Golden Sun below the rainbow */}
        <circle cx="230" cy="180" r="13" fill="#facc15" clipPath="url(#playClip)" />

        {/* Red Medical Cross in the center bottom */}
        <g transform="translate(240, 312)" clipPath="url(#playClip)">
          <rect x="-8.5" y="-25" width="17" height="50" rx="3.5" fill="#dc2626" />
          <rect x="-25" y="-8.5" width="50" height="17" rx="3.5" fill="#dc2626" />
        </g>

        {/* Premium chrome shiny border bevel */}
        <path
          d="M 120,40 C 95,20 75,35 75,70 L 75,370 C 75,405 95,420 120,400 L 440,240 C 465,225 465,195 440,180 Z"
          stroke="url(#bezelGradient)"
          strokeWidth="8"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Floating Sparkles & Ornaments on the left side */}
      {/* 1. Large Gold Sparkle */}
      <path
        d="M 40,90 L 43,105 L 58,108 L 43,111 L 40,126 L 37,111 L 22,108 L 37,105 Z"
        fill="#facc15"
      />
      {/* 2. Slim Red Sparkle */}
      <path
        d="M 105,215 L 107,224 L 116,226 L 107,228 L 105,237 L 103,228 L 94,226 L 103,224 Z"
        fill="#f87171"
      />
      {/* 3. Small Blue Sparkle */}
      <path
        d="M 115,60 L 117,67 L 124,69 L 117,71 L 115,78 L 113,71 L 106,69 L 113,67 Z"
        fill="#60a5fa"
      />
      {/* 4. Tiny Accent Dot */}
      <circle cx="48" cy="180" r="3" fill="#facc15" />

      {/* HORIZONTAL TEXT BRAND OVERLAY "AGHUsePLAY" */}
      {showText && (
        <g>
          {/* Layer 1: Extremely thick dark drop stroke to ensure clean contrast & depth */}
          <text
            x="270"
            y="255"
            textAnchor="middle"
            fontFamily="'Inter', 'Arial Black', -apple-system, sans-serif"
            fontWeight="900"
            fontSize="80"
            letterSpacing="-1"
          >
            <tspan fill="#ffffff" stroke="#166534" strokeWidth="22" strokeLinejoin="round" paintOrder="stroke fill">AGHU</tspan>
            <tspan fill="#86efac" stroke="#14532d" strokeWidth="22" strokeLinejoin="round" paintOrder="stroke fill">sePLAY</tspan>
          </text>

          {/* Layer 2: Medium vivid green stroke for AGHU and dark shadow stroke for sePLAY */}
          <text
            x="270"
            y="255"
            textAnchor="middle"
            fontFamily="'Inter', 'Arial Black', -apple-system, sans-serif"
            fontWeight="900"
            fontSize="80"
            letterSpacing="-1"
          >
            <tspan fill="#ffffff" stroke="#22c55e" strokeWidth="10" strokeLinejoin="round" paintOrder="stroke fill">AGHU</tspan>
            <tspan fill="#a3e635" stroke="#15803d" strokeWidth="10" strokeLinejoin="round" paintOrder="stroke fill">sePLAY</tspan>
          </text>

          {/* Layer 3: Main crisp faces */}
          <text
            x="270"
            y="255"
            textAnchor="middle"
            fontFamily="'Inter', 'Arial Black', -apple-system, sans-serif"
            fontWeight="900"
            fontSize="80"
            letterSpacing="-1"
          >
            <tspan fill="#ffffff">AGHU</tspan>
            <tspan fill="#a3e635">sePLAY</tspan>
          </text>
        </g>
      )}
    </svg>
  );
}
