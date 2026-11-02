import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export default function BrandLogo({
  size = 'md',
  showSubtitle = true,
  className = ''
}: BrandLogoProps) {
  const dimensions = {
    sm: { 
      icon: 'w-8 h-8 rounded-lg', 
      text: 'text-sm font-bold', 
      badge: 'text-[8px] px-1.5 py-0.5', 
      sub: 'text-[9px]' 
    },
    md: { 
      icon: 'w-10 h-10 rounded-xl', 
      text: 'text-base sm:text-lg font-extrabold', 
      badge: 'text-[9px] px-2 py-0.5', 
      sub: 'text-[11px]' 
    },
    lg: { 
      icon: 'w-12 h-12 rounded-xl', 
      text: 'text-lg sm:text-xl font-extrabold', 
      badge: 'text-[10px] px-2.5 py-0.5', 
      sub: 'text-xs' 
    },
    xl: { 
      icon: 'w-16 h-16 rounded-2xl', 
      text: 'text-2xl sm:text-3xl font-black', 
      badge: 'text-xs px-3 py-1', 
      sub: 'text-sm' 
    },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Clean, Premium Business Brand Mark */}
      <div 
        className={`relative ${dimensions.icon} shrink-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 p-0.5 shadow-md shadow-emerald-950/40 border border-emerald-400/30 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-emerald-500/20 group-hover:border-emerald-400/60`}
      >
        <div className="w-full h-full bg-zinc-950/90 rounded-[inherit] flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-teal-500/10 pointer-events-none" />
          
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3/4 h-3/4 relative z-10"
          >
            {/* Clean, Modern Jersey Shape with 'N' geometry */}
            <path
              d="M14 10L8 16L13 22L16 18V38H32V18L35 22L40 16L34 10H14Z"
              fill="url(#nafi-business-grad)"
              stroke="#34D399"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Elegant V-Collar */}
            <path
              d="M20 10C20 15 28 15 28 10"
              stroke="#FDE68A"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Signature Clean 'N' Letterform Accent */}
            <path
              d="M21 21V33M21 22L27 32M27 21V33"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <defs>
              <linearGradient id="nafi-business-grad" x1="8" y1="10" x2="40" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#059669" />
                <stop offset="1" stopColor="#064E3B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Clean, Beautiful Business Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className={`${dimensions.text} tracking-tight text-white flex items-center gap-1 sm:gap-1.5 whitespace-nowrap transition-colors`}>
            <span className="text-white drop-shadow-sm font-black">Nafi</span>
            <span className="text-emerald-400 font-black">Jersey</span>
            <span className="text-zinc-200 font-bold">House</span>
          </span>
          <span className={`bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${dimensions.badge} font-bold rounded-md uppercase tracking-wider shadow-sm`}>
            Official
          </span>
        </div>
        
        {showSubtitle && (
          <p className={`${dimensions.sub} text-zinc-400 font-medium flex items-center gap-1.5 mt-0.5 tracking-wide`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-zinc-300">Authentic Football Kits</span>
          </p>
        )}
      </div>
    </div>
  );
}


