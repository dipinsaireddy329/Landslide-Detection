import React from 'react';

interface TirupatiSevenHillsBackgroundProps {
  /**
   * 'hero': Positioned in lower-middle background with subtle atmospheric glow
   * 'dashboard': Positioned along the bottom with reduced opacity for high data legibility
   * 'subtle': Ultra-faint background watermark
   */
  variant?: 'hero' | 'dashboard' | 'subtle';
  className?: string;
  opacity?: number;
}

export const TirupatiSevenHillsBackground: React.FC<TirupatiSevenHillsBackgroundProps> = ({
  variant = 'dashboard',
  className = '',
  opacity
}) => {
  // Opacity calibrated strictly within 8%–15% range as requested
  const defaultOpacity = variant === 'hero' ? 0.12 : variant === 'dashboard' ? 0.08 : 0.06;
  const activeOpacity = opacity !== undefined ? opacity : defaultOpacity;

  return (
    <div 
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Subtle atmospheric glow behind the Seven Hills (only on hero) */}
      {variant === 'hero' && (
        <div 
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1400px] h-[320px] bg-gradient-to-t from-slate-300/20 via-sky-100/10 to-transparent blur-3xl pointer-events-none"
        />
      )}

      {/* Seven Hills Silhouette Vector */}
      <svg
        viewBox="0 0 1920 360"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter blur-[1px]"
        style={{ opacity: activeOpacity }}
      >
        <defs>
          {/* Subtle vertical gradients to naturally fade the hills into the background */}
          <linearGradient id="sevenHillsBackRidge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#334155" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="sevenHillsFrontRidge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#1e293b" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="sevenHillsBaseFoothills" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 
          Layer 1 (Distant Horizon):
          Panoramic silhouette of the 7 distinct peaks of Tirumala (Seshachalam Range):
          Peak 1: Seshadri (x ~ 190)
          Peak 2: Neeladri (x ~ 470)
          Peak 3: Garudadri (x ~ 750)
          Peak 4: Anjanadri (x ~ 1030)
          Peak 5: Vrishabhadri (x ~ 1300)
          Peak 6: Narayanadri (x ~ 1560)
          Peak 7: Venkatadri (x ~ 1770)
        */}
        <path
          d="
            M 0 270
            C 60 250, 110 200, 150 160
            C 170 140, 195 125, 220 128
            C 255 132, 290 180, 340 195
            C 380 205, 410 160, 440 120
            C 460 92, 485 90, 510 102
            C 550 122, 580 185, 620 190
            C 660 195, 700 130, 730 85
            C 755 50, 780 52, 805 78
            C 840 115, 875 180, 930 185
            C 970 188, 1000 130, 1030 92
            C 1055 60, 1080 62, 1105 85
            C 1145 125, 1180 195, 1230 195
            C 1260 195, 1290 145, 1315 118
            C 1340 92, 1365 95, 1390 115
            C 1430 148, 1460 200, 1500 200
            C 1525 200, 1550 135, 1575 88
            C 1595 55, 1620 58, 1645 80
            C 1680 110, 1710 175, 1745 178
            C 1765 178, 1785 130, 1810 118
            C 1835 108, 1860 125, 1880 155
            C 1900 185, 1910 220, 1920 250
            L 1920 360
            L 0 360
            Z
          "
          fill="url(#sevenHillsBackRidge)"
        />

        {/* 
          Layer 2 (Midground Ridge Profile):
          Overlapping geological ridgelines emphasizing the natural rolling shoulders
          and saddles of the Eastern Ghats Seshachalam mountain terrain.
        */}
        <path
          d="
            M 0 290
            C 70 280, 120 240, 170 215
            C 210 195, 260 210, 310 230
            C 360 250, 420 200, 460 165
            C 490 140, 520 145, 550 165
            C 600 200, 650 235, 710 230
            C 750 225, 800 170, 840 140
            C 870 120, 900 125, 930 150
            C 980 190, 1020 225, 1070 220
            C 1120 215, 1170 175, 1210 155
            C 1240 140, 1270 145, 1300 170
            C 1350 210, 1400 240, 1460 235
            C 1510 230, 1560 180, 1600 145
            C 1630 120, 1660 125, 1690 155
            C 1740 200, 1790 235, 1850 240
            C 1880 242, 1905 260, 1920 280
            L 1920 360
            L 0 360
            Z
          "
          fill="url(#sevenHillsFrontRidge)"
        />

        {/* 
          Layer 3 (Foothills & Base Blend):
          Soft organic base contour that smoothly grounds the hills into the page background.
        */}
        <path
          d="
            M 0 310
            C 120 300, 240 270, 360 280
            C 480 290, 600 260, 720 270
            C 840 280, 960 250, 1080 265
            C 1200 280, 1320 255, 1440 270
            C 1560 285, 1680 260, 1800 275
            C 1860 282, 1900 295, 1920 310
            L 1920 360
            L 0 360
            Z
          "
          fill="url(#sevenHillsBaseFoothills)"
        />
      </svg>
    </div>
  );
};
