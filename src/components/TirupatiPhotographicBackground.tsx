import React, { useState, useEffect } from 'react';
import { getTirupatiPhotographicImage } from '../services/tirupatiLandscape';

interface TirupatiPhotographicBackgroundProps {
  /**
   * 'hero': Most visible around lower/middle portion of hero section (~12% opacity)
   * 'dashboard': Further reduced visibility for data-heavy dashboard (~8% opacity)
   */
  variant?: 'hero' | 'dashboard' | 'subtle';
  className?: string;
  opacity?: number;
}

export const TirupatiPhotographicBackground: React.FC<TirupatiPhotographicBackgroundProps> = ({
  variant = 'dashboard',
  className = '',
  opacity
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>('');

  useEffect(() => {
    // Generate or retrieve the photographic Tirupati Seven Hills landscape
    const url = getTirupatiPhotographicImage();
    setPhotoUrl(url);
  }, []);

  // Strict 8%–15% opacity constraint as requested
  const defaultOpacity = variant === 'hero' ? 0.12 : variant === 'dashboard' ? 0.08 : 0.06;
  const activeOpacity = opacity !== undefined ? opacity : defaultOpacity;

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Photographic View of the Tirupati Seven Hills */}
      {photoUrl && (
        <div 
          className="relative w-full h-full"
          style={{
            opacity: activeOpacity,
            // Natural gradient mask: most visible in lower/middle, fading naturally toward the top
            maskImage: variant === 'hero' 
              ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0) 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 90%)',
            WebkitMaskImage: variant === 'hero' 
              ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0) 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 90%)'
          }}
        >
          <img
            src={photoUrl}
            alt="Tirupati Seven Hills Landscape"
            className="w-full h-full object-cover object-bottom"
            style={{
              // Slightly reduced contrast and saturation with very subtle blur as specified
              filter: 'saturate(0.85) contrast(0.92) blur(1.5px)',
              transform: 'scale(1.02)' // Prevents blur edge clipping
            }}
          />

          {/* Soft atmospheric white overlay to blend naturally into the white theme */}
          <div className="absolute inset-0 bg-white/20 pointer-events-none" />
        </div>
      )}
    </div>
  );
};
