import { useState } from 'react';
import { ShoppingBag, Star, Edit, Trash2, Zap, Eye, ArrowRight, ShieldCheck, MapPin, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { Jersey } from '../types';

interface JerseyCardProps {
  key?: string;
  jersey: Jersey;
  onBuyNow: (jersey: Jersey, selectedSize: string) => void;
  onAddToCart?: (jersey: Jersey, selectedSize: string) => void;
  onQuickView?: (jersey: Jersey) => void;
  isAdmin?: boolean;
  onEdit?: (jersey: Jersey) => void;
  onDelete?: (id: string) => void;
  globalDiscountPercent?: number;
  showStockProgressGlobal?: boolean;
}

export default function JerseyCard({
  jersey,
  onBuyNow,
  onAddToCart,
  onQuickView,
  isAdmin,
  onEdit,
  onDelete,
  globalDiscountPercent = 0,
  showStockProgressGlobal = true,
}: JerseyCardProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [isHovered, setIsHovered] = useState(false);
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  
  // Calculate customizable discount rate
  const discountPercent = jersey.discountPercent !== undefined 
    ? jersey.discountPercent 
    : (globalDiscountPercent > 0 ? globalDiscountPercent : 0);

  const hasDiscount = discountPercent > 0;
  
  // Price Calculation Logic
  let originalPrice: number;
  let sellingPrice: number;

  if (jersey.originalPriceBDT && jersey.originalPriceBDT > 0) {
    originalPrice = jersey.originalPriceBDT;
    sellingPrice = hasDiscount 
      ? Math.round(jersey.originalPriceBDT * (1 - discountPercent / 100))
      : jersey.originalPriceBDT;
  } else {
    sellingPrice = jersey.priceBDT;
    originalPrice = hasDiscount 
      ? Math.round(jersey.priceBDT / (1 - discountPercent / 100))
      : jersey.priceBDT;
  }

  // Stock indicator and sales proof (Daraz e-commerce style)
  const soldCount = jersey.soldCount !== undefined ? jersey.soldCount : (Math.floor(jersey.priceBDT % 80) + 18);
  const stockLeft = jersey.stockLeft !== undefined ? jersey.stockLeft : 14;
  const ratingScore = typeof jersey.rating === 'number' ? jersey.rating : 4.8;
  const locationTag = jersey.locationTag || ((jersey.id && parseInt(jersey.id.slice(-1) || '0') % 2 === 0) ? 'Dhaka' : 'Sylhet / BD');
  const coinSaveAmount = jersey.coinsReward !== undefined ? jersey.coinsReward : Math.max(10, Math.round(sellingPrice * 0.02));

  // Determine badge tag (e.g., KIDS JERSEY, THAI PREMIUM, PAYDAY SALE, MATCH VERSION)
  const topTag = jersey.tagText || (
    jersey.name.toLowerCase().includes('kids') 
      ? 'KIDS JERSEY' 
      : jersey.name.toLowerCase().includes('retro') 
        ? 'RETRO CLASSIC' 
        : (hasDiscount && discountPercent >= 30)
          ? 'PAYDAY SALE' 
          : 'PREMIUM THAI'
  );

  const showTagBadge = jersey.showTag !== false;
  const showRatingBadge = jersey.showRating !== false;
  const showCoinsBadge = jersey.showCoins !== false;
  const showFreeDeliveryBadge = jersey.freeDelivery !== false;
  const showSoldBadge = jersey.showSoldCount !== false;
  const showStockIndicator = jersey.showStockProgress !== false && showStockProgressGlobal;

  return (
    <motion.div
      id={`product-card-${jersey.id}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between bg-[#101512] hover:bg-[#131915] border border-white/10 hover:border-orange-500/50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 font-sans"
    >
      {/* Product Image Container (Daraz aspect ratio & badges) */}
      <div 
        className="relative p-2.5 sm:p-3 flex items-center justify-center min-h-[170px] sm:min-h-[220px] bg-gradient-to-b from-black/50 via-zinc-950/30 to-black/70 overflow-hidden cursor-pointer"
        onClick={() => onQuickView && onQuickView(jersey)}
      >
        {/* Top Badges (Daraz Style) */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-20 pointer-events-none gap-1">
          {/* Left badge (e.g. KIDS JERSEY or PAYDAY SALE) */}
          {showTagBadge ? (
            <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-md pointer-events-auto ${
              topTag === 'PAYDAY SALE' 
                ? 'bg-amber-400 text-black font-extrabold' 
                : topTag === 'KIDS JERSEY'
                  ? 'bg-yellow-400 text-zinc-950 font-extrabold'
                  : 'bg-orange-600 text-white'
            }`}>
              {topTag}
            </span>
          ) : <div />}

          {/* Right badge: Country / Club & Admin tools */}
          <div className="flex items-center gap-1 pointer-events-auto">
            {/* Admin operations */}
            {isAdmin && (
              <div className="flex items-center gap-1 mr-1 bg-black/80 p-0.5 rounded border border-white/20" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => onEdit && onEdit(jersey)}
                  className="p-1 bg-indigo-600 hover:bg-indigo-500 rounded text-white transition-all cursor-pointer"
                  title="Edit Kit Details & Display Badges"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete && onDelete(jersey.id)}
                  className="p-1 bg-rose-600 hover:bg-rose-500 rounded text-white transition-all cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}

            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-900/90 text-zinc-300 border border-white/15">
              {jersey.country}
            </span>
          </div>
        </div>

        {/* Product Image */}
        <img
          src={jersey.image}
          alt={jersey.name}
          referrerPolicy="no-referrer"
          className="relative max-h-40 sm:max-h-52 object-contain select-none transform group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_10px_14px_rgba(0,0,0,0.85)] z-10"
        />

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
          <button
            type="button"
            className="px-3 py-1.5 bg-zinc-900/95 border border-white/20 text-white text-xs font-bold uppercase rounded-lg shadow-lg flex items-center gap-1.5 backdrop-blur pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-transform cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content (Daraz Authentic Style) */}
      <div className="p-3 sm:p-3.5 flex-grow flex flex-col justify-between bg-[#0d120f] border-t border-white/10">
        <div>
          {/* 2-line Clamped Product Title (Daraz Format) */}
          <h4 
            onClick={() => onQuickView && onQuickView(jersey)}
            className="text-xs sm:text-[13px] font-semibold text-zinc-100 leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors cursor-pointer"
            title={jersey.name}
          >
            {jersey.name} | {jersey.country} Thai Premium Match Quality Kit
          </h4>

          {/* Pricing Row with Bengali Taka ৳ / Tk */}
          <div className="mt-2 flex items-baseline flex-wrap gap-1.5 whitespace-nowrap">
            <span className="text-base sm:text-lg font-mono font-black text-orange-500 shrink-0">
              ৳ {sellingPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-zinc-500 line-through font-mono shrink-0">
                ৳ {originalPrice.toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <span className="text-[10.5px] font-bold text-red-400 shrink-0 whitespace-nowrap">
                {discountPercent}% Off
              </span>
            )}
          </div>

          {/* Daraz Coins & Free Delivery Promotions Pill */}
          {(showCoinsBadge || showFreeDeliveryBadge) && (
            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
              {showCoinsBadge && (
                <span className="inline-flex items-center gap-1 text-[9.5px] font-medium bg-amber-400/15 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded">
                  <Tag className="w-2.5 h-2.5 text-amber-400" />
                  Coins save ৳ {coinSaveAmount}
                </span>
              )}
              {showFreeDeliveryBadge && (
                <span className="text-[9.5px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded font-medium">
                  Free Delivery
                </span>
              )}
            </div>
          )}

          {/* Rating, Sold Count & Location (Daraz Social Proof Row) */}
          {(showRatingBadge || showSoldBadge) && (
            <div className="mt-2 flex items-center justify-between text-[10.5px] text-zinc-400 font-sans">
              <div className="flex items-center gap-1.5">
                {showRatingBadge && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-zinc-200">{ratingScore.toFixed(1)}</span>
                  </div>
                )}
                {showRatingBadge && showSoldBadge && (
                  <span className="text-zinc-500">•</span>
                )}
                {showSoldBadge && (
                  <span className="text-zinc-400 font-medium">{soldCount} sold</span>
                )}
              </div>
              <span className="text-[9.5px] text-zinc-500 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5 text-zinc-400" />
                {locationTag}
              </span>
            </div>
          )}

          {/* Compact Size Selector */}
          <div className="mt-2.5 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-1 text-[9.5px] text-zinc-400">
              <span>Size: <strong className="text-orange-400 font-mono">{selectedSize}</strong></span>
              {showStockIndicator && (
                <span className="text-emerald-400 font-medium">In Stock ({stockLeft})</span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-0.5 sm:py-1 text-center font-mono text-[9.5px] sm:text-[10px] font-bold rounded transition-all border cursor-pointer ${
                    selectedSize === size
                      ? 'bg-orange-600 text-white border-orange-400 shadow-sm'
                      : 'bg-black/40 text-zinc-400 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* E-Commerce Actions: Add to Bag + Buy Now */}
        <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(jersey, selectedSize)}
            className="py-1.5 sm:py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/15 hover:border-orange-500/50 text-zinc-200 hover:text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
            title="Add to Shopping Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
            <span>+ Cart</span>
          </button>

          <button
            type="button"
            onClick={() => onBuyNow(jersey, selectedSize)}
            className="py-1.5 sm:py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-lg shadow-md hover:shadow-orange-900/40 transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
            title="Instant Checkout"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
