import React, { useState } from 'react';
import { 
  ShieldCheck, Truck, RotateCcw, Headphones, Star, CheckCircle2, 
  ChevronDown, ChevronUp, Sparkles, MapPin, Eye, EyeOff, Settings, Plus, HelpCircle,
  CreditCard, Smartphone, Banknote, Check
} from 'lucide-react';
import { CustomerReview, ProductDisplaySettings } from '../types';
import { DEFAULT_PRODUCT_DISPLAY_SETTINGS } from '../data';

interface EcommercePerksAndReviewsProps {
  onBrowseJerseys?: () => void;
  showCustomerReviews?: boolean;
  customerReviews?: CustomerReview[];
  showGotQuestions?: boolean;
  productDisplaySettings?: ProductDisplaySettings;
  isAdmin?: boolean;
  onOpenSettings?: (tab?: 'general' | 'productDisplay' | 'orderRules' | 'reviews' | 'gotQuestions') => void;
  onToggleReviewsVisibility?: (visible: boolean) => void;
  onToggleGotQuestionsVisibility?: (visible: boolean) => void;
  onToggleProductDisplay?: (settings: Partial<ProductDisplaySettings>) => void;
}

export default function EcommercePerksAndReviews({ 
  onBrowseJerseys,
  showCustomerReviews = true,
  customerReviews = [],
  showGotQuestions = true,
  productDisplaySettings = DEFAULT_PRODUCT_DISPLAY_SETTINGS,
  isAdmin = false,
  onOpenSettings,
  onToggleReviewsVisibility,
  onToggleGotQuestionsVisibility,
  onToggleProductDisplay,
}: EcommercePerksAndReviewsProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const display = productDisplaySettings || DEFAULT_PRODUCT_DISPLAY_SETTINGS;

  // Build dynamic active perks based on toggle settings
  const dynamicPerks = [];

  if (display.showAuthenticity !== false) {
    dynamicPerks.push({
      key: 'authenticity',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      badge: '100% AUTHENTIC',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: display.authenticityText || '100% Authentic Quality',
      description: display.authenticityDesc || 'Thai Premium match fabric & official double-knit mesh with authentic player badges.',
    });
  }

  if (display.showFastCourier !== false) {
    dynamicPerks.push({
      key: 'courier',
      icon: Truck,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      badge: 'EXPRESS 24/7',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      title: display.fastCourierText || 'Fast Doorstep Courier 24/7',
      description: display.fastCourierDesc || 'Fast 24-72 hours courier delivery across all 64 districts in Bangladesh with live tracking.',
    });
  }

  if (display.showCashOnDelivery !== false) {
    dynamicPerks.push({
      key: 'cod',
      icon: Banknote,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      badge: 'COD ENABLED',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      title: display.cashOnDeliveryText || 'Cash on Delivery Available',
      description: display.cashOnDeliveryDesc || 'Pay safely with cash when your parcel arrives right at your doorstep.',
    });
  }

  if (display.showMobileBanking !== false) {
    dynamicPerks.push({
      key: 'mobileBanking',
      icon: Smartphone,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      badge: 'BKASH / NAGAD',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      title: display.mobileBankingText || 'Mobile Banking Available',
      description: display.mobileBankingDesc || 'Verified bKash & Nagad personal merchant wallets with instant TrxID confirmation.',
    });
  }

  if (display.showEasyExchange !== false) {
    dynamicPerks.push({
      key: 'exchange',
      icon: RotateCcw,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      badge: '7-DAY REPLACEMENT',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      title: display.easyExchangeText || '7-Day Easy Size Replacement',
      description: display.easyExchangeDesc || 'Hassle-free exchange guarantee if your jersey sizing needs adjustment.',
    });
  }

  // Always append helpline pillar if needed
  dynamicPerks.push({
    key: 'helpline',
    icon: Headphones,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20',
    badge: 'LIVE SUPPORT',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    title: '24/7 Helpline & WhatsApp',
    description: 'Friendly support via hotline call, WhatsApp chat, and AI voice assistance anytime.',
  });

  const faqs = [
    {
      q: 'How do I choose the correct jersey size?',
      a: 'We offer standard Asian & European sizes: S (Chest 38"), M (Chest 40"), L (Chest 42"), XL (Chest 44"), and XXL (Chest 46"). If you prefer a looser fit, we recommend selecting one size larger.',
    },
    {
      q: 'Is Cash on Delivery (COD) supported in my area?',
      a: 'Yes! We support Cash on Delivery across all 64 districts in Bangladesh through Steadfast, RedX, and Paperfly couriers. You can pay the jersey price right at your doorstep.',
    },
    {
      q: 'How do I confirm my payment after bKash / Nagad Send Money?',
      a: 'After sending money to our verified bKash or Nagad personal number, copy the Transaction ID (TrxID) from your SMS or app, then message our official Facebook page or submit your order form.',
    },
    {
      q: 'Can I add custom name and number printing?',
      a: 'Yes! We use official vinyl heat-press font sets for all club and national teams. Custom prints are durable, machine washable, and will not peel.',
    },
  ];

  // Calculate rating stats dynamically
  const activeReviews = customerReviews && customerReviews.length > 0 ? customerReviews : [];
  const averageRating = activeReviews.length > 0 
    ? (activeReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / activeReviews.length).toFixed(1)
    : '5.0';

  const isPerksBarVisible = display.showPerksBar !== false;

  return (
    <section id="trust-and-reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 font-sans">
      {/* ========================================================================= */}
      {/* ADMIN NOTIFICATION WHEN PERKS BAR IS HIDDEN */}
      {/* ========================================================================= */}
      {!isPerksBarVisible && isAdmin && (
        <div className="bg-emerald-950/40 border border-dashed border-emerald-500/50 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xl">
          <div className="flex items-center gap-3 text-emerald-200">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white uppercase tracking-tight">Product Trust & Perks Bar is Hidden</h5>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                The Authenticity, Fast Delivery & Payment trust badges bar is turned OFF from store visitors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleProductDisplay && onToggleProductDisplay({ showPerksBar: true })}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Turn Perks Bar ON</span>
            </button>
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => onOpenSettings('productDisplay')}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-200 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-400" />
                <span>Configure Badges</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* E-COMMERCE VALUE PILLARS & TRUST BADGES */}
      {/* ========================================================================= */}
      {isPerksBarVisible && (
        <div className="relative mb-12">
          {/* Admin Header action button */}
          {isAdmin && (
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>E-Commerce Product Display & Trust Pillars</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenSettings && onOpenSettings('productDisplay')}
                  className="px-2.5 py-1 bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 text-zinc-300 hover:text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Settings className="w-3 h-3 text-amber-400" />
                  <span>Customize Badges</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleProductDisplay && onToggleProductDisplay({ showPerksBar: false })}
                  className="p-1 bg-zinc-900/90 hover:bg-rose-950/60 border border-white/15 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer"
                  title="Hide Perks Bar"
                >
                  <EyeOff className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {dynamicPerks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.key}
                  className={`bg-[#0d120f]/90 border ${perk.borderColor} hover:border-white/30 rounded-2xl p-4.5 transition-all shadow-lg flex flex-col justify-between group hover:-translate-y-0.5`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`w-9 h-9 rounded-xl ${perk.bgColor} ${perk.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${perk.badgeColor}`}>
                        {perk.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1.5 leading-snug">
                      {perk.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {perk.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN NOTIFICATION WHEN REVIEWS ARE HIDDEN */}
      {/* ========================================================================= */}
      {!showCustomerReviews && isAdmin && (
        <div className="bg-amber-950/40 border border-dashed border-amber-500/50 rounded-2xl p-4 sm:p-5 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xl">
          <div className="flex items-center gap-3 text-amber-200">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white uppercase tracking-tight">Customer Reviews Section is Currently Hidden</h5>
              <p className="text-[11px] text-amber-300/80 mt-0.5">
                The customer review rating block is turned OFF and hidden from store visitors. You can turn it back ON anytime.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleReviewsVisibility && onToggleReviewsVisibility(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Turn Reviews ON</span>
            </button>
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => onOpenSettings('reviews')}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-200 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>Configure in Settings</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CUSTOMER REVIEWS & RATINGS SHOWCASE (CONDITIONAL VISIBILITY) */}
      {/* ========================================================================= */}
      {showCustomerReviews && (
        <div className="bg-[#0b100d] border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Admin quick toggle badge */}
          {isAdmin && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleReviewsVisibility && onToggleReviewsVisibility(false)}
                className="px-2.5 py-1 bg-black/60 hover:bg-rose-950/60 border border-white/15 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Hide Reviews section from store"
              >
                <EyeOff className="w-3 h-3 text-rose-400" />
                <span>Hide Reviews</span>
              </button>
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => onOpenSettings('reviews')}
                  className="p-1 bg-black/60 hover:bg-white/10 border border-white/15 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Configure Reviews in Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Buyer Feedback</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                Customer Ratings & Reviews
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Real feedback from jersey collectors and football fans across Bangladesh
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5">
              <div className="flex flex-col items-center justify-center pr-4 border-r border-white/10">
                <span className="text-3xl font-display font-black text-emerald-400 leading-none">
                  {averageRating}
                </span>
                <div className="flex items-center gap-0.5 mt-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-white block">100% Recommended</span>
                <span className="text-[11px] text-zinc-400">
                  Based on {activeReviews.length} verified order{activeReviews.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Review Cards Grid */}
          {activeReviews.length === 0 ? (
            <div className="text-center py-10 bg-black/30 border border-dashed border-white/10 rounded-2xl">
              <p className="text-sm text-zinc-400">No customer reviews configured yet.</p>
              {isAdmin && onOpenSettings && (
                <button
                  type="button"
                  onClick={() => onOpenSettings('reviews')}
                  className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Review in Settings</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#121914] border border-white/10 hover:border-emerald-500/40 rounded-2xl p-4.5 transition-all flex flex-col justify-between shadow-md group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{rev.date}</span>
                    </div>

                    <p className="text-xs text-zinc-300 italic mb-4 leading-relaxed group-hover:text-white transition-colors">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-white flex items-center gap-1">
                          {rev.name}
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        </h5>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                          {rev.location}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10 text-emerald-300 font-bold">
                        {rev.size}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium truncate block mt-1">
                      {rev.jersey}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN NOTIFICATION WHEN "GOT QUESTIONS" (FAQ) IS HIDDEN */}
      {/* ========================================================================= */}
      {!showGotQuestions && isAdmin && (
        <div className="bg-cyan-950/40 border border-dashed border-cyan-500/50 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xl">
          <div className="flex items-center gap-3 text-cyan-200">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white uppercase tracking-tight">"Got Questions?" (FAQ) Section is Currently Hidden</h5>
              <p className="text-[11px] text-cyan-300/80 mt-0.5">
                The "Got Questions? / Frequently Asked Questions" block is turned OFF and removed from visitors. You can turn it back ON anytime.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleGotQuestionsVisibility && onToggleGotQuestionsVisibility(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Turn "Got Questions" ON</span>
            </button>
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => onOpenSettings('gotQuestions')}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-400" />
                <span>Settings</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FREQUENTLY ASKED QUESTIONS (CONDITIONAL VISIBILITY) */}
      {/* ========================================================================= */}
      {showGotQuestions && (
        <div className="bg-[#0e1410] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl relative">
          {/* Admin quick toggle badge */}
          {isAdmin && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleGotQuestionsVisibility && onToggleGotQuestionsVisibility(false)}
                className="px-2.5 py-1 bg-black/60 hover:bg-rose-950/60 border border-white/15 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Hide Got Questions section from store"
              >
                <EyeOff className="w-3 h-3 text-rose-400" />
                <span>Remove / Hide FAQ</span>
              </button>
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => onOpenSettings('gotQuestions')}
                  className="p-1 bg-black/60 hover:bg-white/10 border border-white/15 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Configure Store Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Got Questions?
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase mt-2">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Everything you need to know about sizing, payment, and delivery
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-black/50 border border-white/10 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-zinc-300 border-t border-white/5 leading-relaxed bg-white/[0.02]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
