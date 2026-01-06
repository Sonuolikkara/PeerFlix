interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export function Logo({ size = 'md', variant = 'light' }: LogoProps) {
  const sizes = {
    sm: { width: 140, height: 45 },
    md: { width: 180, height: 58 },
    lg: { width: 240, height: 75 },
  };

  const { width, height } = sizes[size];
  const textColor = variant === 'light' ? '#ffffff' : '#1a1a1a';
  const accentColor = '#3b82f6'; // Blue accent for the play icon

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Main stylized shape with integrated play button */}
      <g transform="translate(0, 12)">
        {/* The stylized S shape */}
        <path
          d="M8 8C8 4 12 0 20 0C28 0 34 4 34 10C34 14 32 17 28 19L16 26C12 28 10 31 10 35C10 41 14 46 22 46C30 46 34 42 34 38"
          stroke={textColor}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Play button triangle */}
        <polygon
          points="18,18 18,32 30,25"
          fill={accentColor}
        />
        
        {/* Stream lines (wifi-like) */}
        <path
          d="M22 12C26 12 29 14 29 17"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M22 7C30 7 34 11 34 16"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* "Peer" text - smaller, positioned to the left of Flix */}
      <text
        x="42"
        y="28"
        fontSize="16"
        fontWeight="600"
        fontFamily="'Space Grotesk', sans-serif"
        fill={textColor}
        opacity="0.95"
      >
        Peer
      </text>

      {/* "Flix" text - main body, large and bold */}
      <text
        x="42"
        y="55"
        fontSize="38"
        fontWeight="900"
        fontFamily="'Space Grotesk', sans-serif"
        fill={textColor}
        letterSpacing="-2"
      >
        Flix
      </text>

      {/* Texture overlay effect - small dots for vintage look */}
      <defs>
        <pattern id="noise" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill={textColor} opacity="0.08" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="240" height="75" fill="url(#noise)" opacity="0.25" />
    </svg>
  );
}

// Alternative compact logo for favicon/small spaces
export function LogoIcon({ size = 40, variant = 'light' }: { size?: number; variant?: 'light' | 'dark' }) {
  const bgColor = variant === 'light' ? '#1a1a1a' : '#ffffff';
  const iconColor = variant === 'light' ? '#ffffff' : '#1a1a1a';
  const accentColor = '#3b82f6';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background rounded square */}
      <rect width="100" height="100" rx="20" fill={bgColor} />
      
      {/* Stylized P with play button */}
      <path
        d="M25 20V80M25 20H55C67 20 75 28 75 40C75 52 67 60 55 60H25"
        stroke={iconColor}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Play triangle inside P */}
      <polygon
        points="40,35 40,55 58,45"
        fill={accentColor}
      />
      
      {/* Stream lines */}
      <path d="M62 30C70 34 74 40 74 45" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
      <path d="M62 24C76 30 82 40 82 48" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
