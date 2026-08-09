'use client';

interface JaaliOverlayProps {
  className?: string;
  opacity?: number;
}

export default function JaaliOverlay({ className = '', opacity = 0.03 }: JaaliOverlayProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="jaali" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            {/* Central diamond */}
            <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brass" />
            {/* Inner diamond */}
            <polygon points="20,8 32,20 20,32 8,20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-brass" />
            {/* Corner dots */}
            <circle cx="0" cy="0" r="1.5" fill="currentColor" className="text-brass" />
            <circle cx="40" cy="0" r="1.5" fill="currentColor" className="text-brass" />
            <circle cx="0" cy="40" r="1.5" fill="currentColor" className="text-brass" />
            <circle cx="40" cy="40" r="1.5" fill="currentColor" className="text-brass" />
            {/* Center dot */}
            <circle cx="20" cy="20" r="1" fill="currentColor" className="text-brass" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#jaali)" />
      </svg>
    </div>
  );
}
