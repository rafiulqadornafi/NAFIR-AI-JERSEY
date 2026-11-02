import React, { useState } from 'react';
import { ThumbsUp, Flame, ArrowUpDown, Filter, Sparkles, Truck, Award, ShieldCheck, Check } from 'lucide-react';

export type SortOption = 'bestmatch' | 'sale' | 'price-asc' | 'price-desc' | 'rating';

interface EcommerceFilterBarProps {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  selectedFilterChip: string;
  setSelectedFilterChip: (chip: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  totalResults: number;
}

export default function EcommerceFilterBar({
  sortBy,
  setSortBy,
  selectedFilterChip,
  setSelectedFilterChip,
  selectedRegion,
  setSelectedRegion,
  totalResults,
}: EcommerceFilterBarProps) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filterChips = [
    { id: 'all', label: 'All Items' },
    { id: 'club-jersey', label: '⚽ Club Jersey (ক্লাব জার্সি)' },
    { id: 'voucher-max', label: 'Voucher Max' },
    { id: 'new-arrival', label: 'New Arrival' },
    { id: 'free-delivery', label: 'Free Delivery' },
    { id: 'best-price', label: 'Best Price Guaranteed' },
    { id: 'kids', label: 'Kids Kits' },
    { id: 'national', label: 'National Teams' },
  ];

  const handlePriceClick = () => {
    if (sortBy === 'price-asc') {
      setSortBy('price-desc');
    } else {
      setSortBy('price-asc');
    }
  };

  return (
    <div id="ecommerce-filter-bar" className="w-full bg-[#0d110e] border-y border-white/10 sticky top-[72px] sm:top-[68px] z-30 shadow-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Row 1: Primary Sort Tabs (Exact Daraz Mobile & Desktop Layout) */}
        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2 flex-1 overflow-x-auto no-scrollbar">
            {/* Best Match */}
            <button
              type="button"
              onClick={() => setSortBy('bestmatch')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                sortBy === 'bestmatch'
                  ? 'text-orange-400 bg-orange-500/15 border border-orange-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>bestmatch</span>
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>

            {/* Sale / Discounts */}
            <button
              type="button"
              onClick={() => setSortBy('sale')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                sortBy === 'sale'
                  ? 'text-orange-400 bg-orange-500/15 border border-orange-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>sale</span>
              <Flame className="w-3.5 h-3.5 text-orange-500" />
            </button>

            {/* Price Sort */}
            <button
              type="button"
              onClick={handlePriceClick}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                sortBy.startsWith('price')
                  ? 'text-orange-400 bg-orange-500/15 border border-orange-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>price</span>
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortBy === 'price-asc' && <span className="text-[10px] text-orange-300 font-mono">(Low ↑)</span>}
              {sortBy === 'price-desc' && <span className="text-[10px] text-orange-300 font-mono">(High ↓)</span>}
            </button>

            {/* Top Rating */}
            <button
              type="button"
              onClick={() => setSortBy('rating')}
              className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                sortBy === 'rating'
                  ? 'text-orange-400 bg-orange-500/15 border border-orange-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>rating ★ 5.0</span>
            </button>
          </div>

          {/* Filter Trigger */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-lg text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-orange-400" />
              <span>Filter</span>
            </button>

            {/* Region / Category Dropdown Filter */}
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#141a16] border border-white/15 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs font-bold text-white">
                  <span>Region / Category</span>
                  <button
                    onClick={() => setShowFilterDropdown(false)}
                    className="text-zinc-400 hover:text-white text-xs"
                  >
                    Done
                  </button>
                </div>
                <div className="space-y-1">
                  {[
                    { id: 'All', label: 'All Regions (সব জার্সি)' },
                    { id: 'Club', label: '⚽ Club Jersey (ইউরোপিয়ান ও ক্লাব)' },
                    { id: 'Americas', label: '🇧🇷 🇦🇷 South America (ব্রাজিল, আর্জেন্টিনা)' },
                    { id: 'Europe', label: '🇵🇹 🇫🇷 🇩🇪 Europe (ইউরোপীয় দেশ)' },
                    { id: 'Asia', label: '🇧🇩 🇯🇵 Asia (বাংলাদেশ, জাপান)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedRegion(item.id);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                        selectedRegion === item.id || (item.id === 'Club' && selectedRegion === 'Club Jersey')
                          ? 'bg-orange-600 text-white font-bold'
                          : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {(selectedRegion === item.id || (item.id === 'Club' && selectedRegion === 'Club Jersey')) && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Daraz Filter Chips Carousel (Voucher Max, New Arrival, Mall, Free Delivery) */}
        <div className="pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {filterChips.map((chip) => {
            const isSelected = selectedFilterChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedFilterChip(isSelected && chip.id !== 'all' ? 'all' : chip.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100 text-zinc-950 border-white font-bold shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
