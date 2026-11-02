import React, { useState } from 'react';
import { X, Star, ShoppingBag, CheckCircle2, ShieldCheck, Truck, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Jersey } from '../types';

interface QuickViewModalProps {
  jersey: Jersey | null;
  onClose: () => void;
  onAddToCart: (jersey: Jersey, size: string) => void;
  onBuyNow: (jersey: Jersey, size: string) => void;
  globalDiscountPercent?: number;
  showStockProgressGlobal?: boolean;
}

export default function QuickViewModal({
  jersey,
  onClose,
  onAddToCart,
  onBuyNow,
  globalDiscountPercent = 0,
  showStockProgressGlobal = true,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  if (!jersey) return null;

  const discountPercent = jersey.discountPercent !== undefined 
    ? jersey.discountPercent 
    : (globalDiscountPercent > 0 ? globalDiscountPercent : 0);

  const hasDiscount = discountPercent > 0;
  
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

  const savingsBDT = Math.max(0, originalPrice - sellingPrice);

  const soldCount = jersey.soldCount !== undefined ? jersey.soldCount : 12;
  const stockLeft = jersey.stockLeft !== undefined ? jersey.stockLeft : 8;
  const showStock = (jersey.showStockProgress !== false) && (showStockProgressGlobal !== false);
  const totalUnits = Math.max(1, soldCount + stockLeft);
  const soldPercentage = Math.min(100, Math.max(12, Math.round((soldCount / totalUnits) * 100)));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#0f1310] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 text-white"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black border border-white/15 text-zinc-400 hover:text-white transition-colors z-20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Product Image & Gallery Display */}
            <div className="relative p-8 bg-gradient-to-b from-black/60 via-zinc-950/40 to-black/80 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${jersey.badgeColor || 'bg-emerald-600 text-white'} shadow-md`}>
                  {jersey.country}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  PLAYER FIT
                </span>
              </div>

              <img
                src={jersey.image}
                alt={jersey.name}
                referrerPolicy="no-referrer"
                className="max-h-72 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.9)] select-none"
              />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-white/5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% In Stock
                </span>
                <span className="bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-white/5 font-mono text-zinc-300 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {typeof jersey.rating === 'number' ? jersey.rating.toFixed(1) : (jersey.rating || '5.0')} ({jersey.reviewsCount || 120} reviews)
                </span>
              </div>
            </div>

            {/* Right: Product Details, Size Selector, & Add to Bag */}
            <div className="p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                  Official Match Edition
                </span>
                <h3 className="text-xl font-display font-extrabold text-white mt-1 uppercase tracking-tight">
                  {jersey.name}
                </h3>

                {/* Pricing */}
                <div className="flex items-baseline gap-2.5 mt-3 flex-wrap">
                  <span className="text-2xl font-mono font-black text-white">
                    Tk {sellingPrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm font-mono text-zinc-500 line-through">
                        Tk {originalPrice.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Save Tk {savingsBDT.toLocaleString()} ({discountPercent}% OFF)
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Progress Indicator (Controlled by Admin) */}
                {showStock && (
                  <div className="mt-3 bg-black/40 p-2.5 rounded-lg border border-white/10">
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all"
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-zinc-400">
                      <span>{soldCount} Sold</span>
                      <span className="text-amber-400 font-semibold">{stockLeft} Left in Stock</span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-zinc-300 mt-3.5 leading-relaxed">
                  {jersey.description}
                </p>

                {/* Fabric Features */}
                <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Moisture-wicking mesh</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Heat-pressed club crest</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Custom squad print ready</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>1–3 day delivery across BD</span>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Select Size: <strong className="text-emerald-400 font-mono">{selectedSize}</strong>
                    </span>
                    <span className="text-[10px] text-zinc-500">Standard Asian Fit</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 text-center font-mono text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
                            : 'bg-black/50 text-zinc-400 hover:text-white border-white/10 hover:border-white/25'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(jersey, selectedSize);
                    }}
                    className="py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBuyNow(jersey, selectedSize);
                    }}
                    className="py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[10px] text-center text-zinc-500">
                  ⚡ Central Dispatch from Mirpur Dhaka • Direct bKash / Nagad / Cash on Delivery
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
