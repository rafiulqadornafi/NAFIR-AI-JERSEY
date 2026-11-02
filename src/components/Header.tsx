import React, { useState, useEffect } from 'react';
import BrandLogo from './BrandLogo';
import { 
  Copy, 
  Check, 
  ShoppingBag, 
  Settings,
  Settings2, 
  Lock, 
  Unlock, 
  PlusCircle, 
  Eye, 
  Search, 
  X, 
  PhoneCall, 
  Truck, 
  ShieldCheck, 
  HelpCircle,
  Package,
  Layers,
  Sparkles,
  Bot,
  Flame,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavbarSettings } from '../types';
import { DEFAULT_NAVBAR_SETTINGS } from '../data';
import { formatWhatsAppLink } from '../utils/whatsappHelper';

interface HeaderProps {
  bKashNumber: string;
  setBKashNumber: (num: string) => void;
  nagadNumber: string;
  setNagadNumber: (num: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (num: string) => void;
  helplineLabel?: string;
  hotlineNumber?: string;
  facebookLink?: string;
  cartCount: number;
  cartTotalBDT: number;
  onOpenCart: () => void;
  scrollToSection: (id: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  onAddJerseyClick?: () => void;
  onOpenBannerEditor?: () => void;
  onOpenStoreSettings?: (tab?: any) => void;
  onOpenVoiceAgent?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  selectedRegion?: string;
  setSelectedRegion?: (reg: string) => void;
  navbarSettings?: NavbarSettings;
  showVoiceAssistant?: boolean;
}

export default function Header({
  bKashNumber,
  setBKashNumber,
  nagadNumber,
  setNagadNumber,
  whatsappNumber,
  setWhatsappNumber,
  helplineLabel = 'HELPLINE',
  hotlineNumber,
  facebookLink = 'https://www.facebook.com/share/1Bh4gYajWE/',
  cartCount = 0,
  cartTotalBDT = 0,
  onOpenCart,
  scrollToSection,
  isAdmin,
  setIsAdmin,
  onAddJerseyClick,
  onOpenBannerEditor,
  onOpenStoreSettings,
  onOpenVoiceAgent,
  searchQuery = '',
  setSearchQuery,
  selectedRegion = 'All',
  setSelectedRegion,
  navbarSettings = DEFAULT_NAVBAR_SETTINGS,
  showVoiceAssistant = true,
}: HeaderProps) {
  const nav = navbarSettings || DEFAULT_NAVBAR_SETTINGS;
  const [copiedB, setCopiedB] = useState(false);
  const [copiedN, setCopiedN] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [tempB, setTempB] = useState(bKashNumber);
  const [tempN, setTempN] = useState(nagadNumber);
  const [tempW, setTempW] = useState(whatsappNumber);

  useEffect(() => {
    setTempB(bKashNumber);
  }, [bKashNumber]);

  useEffect(() => {
    setTempN(nagadNumber);
  }, [nagadNumber]);

  useEffect(() => {
    setTempW(whatsappNumber);
  }, [whatsappNumber]);

  const handleCopyB = () => {
    navigator.clipboard.writeText(bKashNumber);
    setCopiedB(true);
    setTimeout(() => setCopiedB(false), 2000);
  };

  const handleCopyN = () => {
    navigator.clipboard.writeText(nagadNumber);
    setCopiedN(true);
    setTimeout(() => setCopiedN(false), 2000);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nafi_jersey_is_admin', 'false');
      } catch (e) {}
    }
    setShowEdit(false);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin2026') {
      setIsAdmin(true);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('nafi_jersey_is_admin', 'true');
        } catch (e) {}
      }
      setShowLoginModal(false);
      setPasscode('');
      setLoginError('');
    } else {
      setLoginError('Invalid Passcode! Please try again.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setBKashNumber(tempB.trim());
    setNagadNumber(tempN.trim());
    setWhatsappNumber(tempW.trim());
    setShowEdit(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0d0b] border-b border-white/10 shadow-2xl font-sans">
      {/* Top Utility Announcement Bar (Daraz & Amazon E-Commerce standard - Fully Configurable) */}
      {nav.showTopAnnouncementBar !== false && (
        <div className="w-full bg-[#060807] text-white py-1.5 px-4 border-b border-white/10 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
            {/* Announcement tag & Delivery Note */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              {nav.showAuthenticBadge !== false && (
                <span className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-300 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  {nav.authenticBadgeText || '100% AUTHENTIC THAI KITS'}
                </span>
              )}
              {nav.showFastDelivery !== false && (
                <span className="text-zinc-300 text-[11px]">
                  {nav.fastDeliveryText || 'Fast Doorstep Courier to All 64 Districts in Bangladesh • Cash on Delivery & Mobile Banking Available'}
                </span>
              )}
            </div>

            {/* Quick Helpline & Payment shortcut */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {nav.showRulesShortcut !== false && (
                <button
                  type="button"
                  onClick={() => scrollToSection('rules')}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{nav.rulesShortcutText || 'Ordering Rules (৩টি নিয়ম)'}</span>
                </button>
              )}

              {nav.showPaymentShortcut !== false && (
                <button
                  type="button"
                  onClick={() => scrollToSection('payment-and-footer-section')}
                  className="text-[11px] text-zinc-400 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {nav.paymentShortcutText || 'Payment Methods (bKash / Nagad) ↓'}
                </button>
              )}

              {/* Cash on Delivery Supported Badge */}
              {nav.showCodBadge !== false && (
                <button
                  type="button"
                  onClick={() => scrollToSection('rules')}
                  className="inline-flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold px-2.5 py-0.5 rounded text-[11px] transition-all cursor-pointer shadow-sm"
                  title="Cash on Delivery Available in all 64 districts"
                >
                  <Truck className="w-3 h-3 text-emerald-400" />
                  <span>{nav.codBadgeText || 'Cash on Delivery Supported'}</span>
                </button>
              )}

              {/* Chat On / Customer Care Live Status */}
              {nav.showChatOn !== false && (
                <a
                  href={formatWhatsAppLink(whatsappNumber || hotlineNumber)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366]/40 text-[#25d366] px-2.5 py-0.5 rounded text-[11px] font-bold transition-all shadow-sm group"
                  title="Live WhatsApp Support - Instant Order Help"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <MessageCircle className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span>{nav.chatOnLabel || 'Chat On'}: {whatsappNumber && (whatsappNumber.includes('wa.me') || whatsappNumber.includes('http')) ? 'WhatsApp Direct' : (hotlineNumber || whatsappNumber || '01402580064')}</span>
                  {nav.chatOnStatusText && (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-mono">
                      {nav.chatOnStatusText}
                    </span>
                  )}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main E-Commerce Header Bar (Daraz & iHerb flagship layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo */}
        <div 
          className="cursor-pointer group shrink-0" 
          onClick={() => {
            if (setSearchQuery) setSearchQuery('');
            if (setSelectedRegion) setSelectedRegion('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <BrandLogo size="md" />
        </div>

        {/* High-Utility Central Search Bar (Daraz style) */}
        <div className="w-full md:max-w-xl relative">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              scrollToSection('shop');
            }}
            className="flex items-center bg-[#131814] border border-white/15 focus-within:border-orange-500 rounded-xl overflow-hidden shadow-inner transition-colors"
          >
            <div className="pl-3.5 pr-2 text-zinc-400">
              <Search className="w-4 h-4 text-orange-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                if (setSearchQuery) setSearchQuery(e.target.value);
              }}
              placeholder="Search in Nafi Jersey (e.g., Brazil, Argentina, Real Madrid, Kids)..."
              className="w-full bg-transparent text-white placeholder-zinc-500 text-xs py-2.5 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  if (setSearchQuery) setSearchQuery('');
                }}
                className="px-2 text-zinc-400 hover:text-white"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 transition-colors cursor-pointer shrink-0 uppercase tracking-wider"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right Actions: Track Order, AI Voice, Admin & Shopping Cart */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* AI Voice Assistant Trigger */}
          {onOpenVoiceAgent && nav.showAiVoiceButton !== false && showVoiceAssistant !== false && (
            <button
              type="button"
              onClick={onOpenVoiceAgent}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md border border-emerald-400/30 transition-all cursor-pointer"
              title="AI Voice Order Assistant - কথা বলে অর্ডার করুন"
            >
              <Bot className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">{nav.aiVoiceButtonText || 'AI Voice'}</span>
              <span className="sm:hidden font-bold">AI</span>
            </button>
          )}

          {/* Track Order Shortcut */}
          {nav.showTrackOrderButton !== false && (
            <button
              type="button"
              onClick={() => scrollToSection('track-order-hub')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-orange-500/40 text-zinc-300 hover:text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-orange-400" />
              <span>{nav.trackOrderButtonText || 'Track Order'}</span>
            </button>
          )}

          {/* Admin Control Trigger */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              {onOpenStoreSettings && (
                <button
                  type="button"
                  onClick={() => onOpenStoreSettings('navbar')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase rounded-lg shadow-md border border-emerald-400/40 transition-all cursor-pointer"
                  title="Edit Navbar Badges, bKash, Nagad, Support Email, Hotline & Hub Address"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Settings</span>
                </button>
              )}
              {onOpenBannerEditor && (
                <button
                  type="button"
                  onClick={onOpenBannerEditor}
                  className="flex items-center gap-1 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-orange-500/40 text-orange-300 text-xs font-bold uppercase rounded-lg shadow transition-all cursor-pointer"
                  title="Customize Top Banner & Store Discounts"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-300" />
                  <span className="hidden md:inline">Banners</span>
                </button>
              )}
              {onAddJerseyClick && (
                <button
                  onClick={() => {
                    onAddJerseyClick();
                    scrollToSection('shop');
                  }}
                  className="flex items-center gap-1 px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase rounded-lg shadow transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Item</span>
                </button>
              )}
              <button
                onClick={handleAdminLogout}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
                title="Logout Admin"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-2 bg-zinc-950 hover:bg-zinc-900 border border-white/10 hover:border-orange-500/50 text-zinc-400 hover:text-orange-300 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Store Owner Login (Edit / Add Jerseys)"
            >
              <Unlock className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Owner</span>
            </button>
          )}

          {/* Shopping Cart Trigger (Daraz / iHerb style) */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2.5 bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 hover:from-orange-500 hover:to-red-500 text-white px-3.5 sm:px-4 py-2.5 rounded-xl shadow-lg shadow-orange-950/60 font-bold text-xs uppercase tracking-wide cursor-pointer transition-all active:scale-95"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-black font-mono font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
            {cartTotalBDT > 0 && (
              <span className="font-mono text-white hidden md:inline font-bold">
                ৳ {cartTotalBDT.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories & Sub-Navigation Bar (Daraz style - Configurable) */}
      {nav.showCategoriesSubNav !== false && (
        <div className="w-full bg-[#0d110e] border-t border-white/5 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
            {/* Categories Tab Group */}
            <div className="flex items-center gap-2 sm:gap-3 text-zinc-300 font-medium">
              <button
                onClick={() => {
                  if (setSelectedRegion) setSelectedRegion('All');
                  if (setSearchQuery) setSearchQuery('');
                  scrollToSection('shop');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedRegion === 'All' && !searchQuery
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Collections</span>
              </button>

              {nav.showFlashSaleNav !== false && (
                <button
                  onClick={() => {
                    scrollToSection('flash-sale');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md text-amber-300 hover:bg-amber-500/10 font-bold transition-colors cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>{nav.flashSaleNavText || '⚡ Flash Sale'}</span>
                </button>
              )}

              {nav.showClubJerseyNav !== false && (
                <button
                  onClick={() => {
                    if (setSelectedRegion) setSelectedRegion('Club');
                    if (setSearchQuery) setSearchQuery('');
                    scrollToSection('shop');
                  }}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedRegion === 'Club'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{nav.clubJerseyNavText || '⚽ Club Jersey'}</span>
                </button>
              )}

              {nav.showSouthAmericaNav !== false && (
                <button
                  onClick={() => {
                    if (setSelectedRegion) setSelectedRegion('Americas');
                    scrollToSection('shop');
                  }}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedRegion === 'Americas'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{nav.southAmericaNavText || '🇧🇷 🇦🇷 South America'}</span>
                </button>
              )}

              {nav.showEuropeNav !== false && (
                <button
                  onClick={() => {
                    if (setSelectedRegion) setSelectedRegion('Europe');
                    scrollToSection('shop');
                  }}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedRegion === 'Europe'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{nav.europeNavText || '🇵🇹 🇫🇷 🇩🇪 Europe'}</span>
                </button>
              )}

              {nav.showAsiaNav !== false && (
                <button
                  onClick={() => {
                    if (setSelectedRegion) setSelectedRegion('Asia');
                    scrollToSection('shop');
                  }}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedRegion === 'Asia'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{nav.asiaNavText || '🇧🇩 🇯🇵 Asia'}</span>
                </button>
              )}

              {nav.showPaymentGuideNav !== false && (
                <button
                  onClick={() => {
                    scrollToSection('rules');
                  }}
                  className="px-3 py-1 rounded-md hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-zinc-400"
                >
                  <span>{nav.paymentGuideNavText || '💳 Payment Guide'}</span>
                </button>
              )}
            </div>

            {nav.showHubLocationBadge !== false && (
              <div className="flex items-center gap-2 text-zinc-400 text-[11px] shrink-0">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Truck className="w-3 h-3" /> {nav.hubLocationBadgeText || 'Mirpur Hub Dispatch'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Inline Config Drawer */}
      <AnimatePresence>
        {showEdit && isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-950 border-b border-white/15 py-4 px-4 shadow-2xl"
          >
            <form onSubmit={handleSave} className="max-w-4xl mx-auto flex flex-col md:flex-row items-end gap-3 text-xs">
              <div className="flex-1 w-full">
                <label className="block text-[10px] text-zinc-400 font-mono uppercase mb-1">bKash Number</label>
                <input
                  type="text"
                  value={tempB}
                  onChange={(e) => setTempB(e.target.value)}
                  className="w-full bg-[#141414] text-white px-3 py-2 border border-white/10 rounded focus:border-emerald-500 font-mono"
                  required
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[10px] text-zinc-400 font-mono uppercase mb-1">Nagad Number</label>
                <input
                  type="text"
                  value={tempN}
                  onChange={(e) => setTempN(e.target.value)}
                  className="w-full bg-[#141414] text-white px-3 py-2 border border-white/10 rounded focus:border-emerald-500 font-mono"
                  required
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[10px] text-zinc-400 font-mono uppercase mb-1">WhatsApp Hotline</label>
                <input
                  type="text"
                  value={tempW}
                  onChange={(e) => setTempW(e.target.value)}
                  className="w-full bg-[#141414] text-white px-3 py-2 border border-white/10 rounded focus:border-emerald-500 font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded uppercase tracking-wider cursor-pointer h-[38px] transition-colors"
              >
                Save
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Passcode Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Store Admin Access</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setPasscode('');
                    setLoginError('');
                  }}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1.5 uppercase font-semibold">
                    Enter Admin Passcode
                  </label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter security passcode"
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    autoFocus
                  />
                  {loginError && (
                    <p className="text-red-400 text-xs mt-1.5">{loginError}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setPasscode('');
                      setLoginError('');
                    }}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
                  >
                    Login
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
