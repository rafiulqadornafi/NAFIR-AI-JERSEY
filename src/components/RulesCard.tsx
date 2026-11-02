import React, { useState } from 'react';
import { 
  Send, Smartphone, ShieldCheck, CheckCircle2, ArrowRight, MapPin, 
  QrCode, Copy, Check, MessageSquare, AlertTriangle, CreditCard, 
  HelpCircle, Sparkles, PhoneCall, ExternalLink, FileText, Languages, ChevronRight,
  Truck, Bot, Mail, Clock, Headphones, Settings, Eye, EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';
import { OrderRulesSettings } from '../types';
import { DEFAULT_ORDER_RULES_SETTINGS } from '../data';
import { formatWhatsAppLink } from '../utils/whatsappHelper';

interface RulesCardProps {
  bKashNumber: string;
  nagadNumber: string;
  bKashQR: string | null;
  nagadQR: string | null;
  facebookLink?: string;
  hotlineNumber?: string;
  whatsappNumber?: string;
  supportEmail?: string;
  helplineLabel?: string;
  hubAddress?: string;
  orderRulesSettings?: OrderRulesSettings;
  isAdmin: boolean;
  onUpdateQR: (type: 'bKash' | 'Nagad', data: string | null) => void;
  onPlaceOrderClick?: () => void;
  onOpenVoiceAgent?: () => void;
  onOpenSettings?: (tab?: 'general' | 'productDisplay' | 'orderRules' | 'reviews' | 'gotQuestions') => void;
  onToggleOrderRules?: (settings: Partial<OrderRulesSettings>) => void;
}

export default function RulesCard({ 
  bKashNumber, 
  nagadNumber, 
  bKashQR, 
  nagadQR, 
  facebookLink = 'https://www.facebook.com/share/1Bh4gYajWE/',
  hotlineNumber = '01402580064',
  whatsappNumber = 'https://wa.me/qr/MV2Z72HWCIQZD1',
  supportEmail = 'support@napis.com',
  helplineLabel = 'HELPLINE',
  hubAddress = 'Mirpur, Dhaka - 1216, Bangladesh',
  orderRulesSettings = DEFAULT_ORDER_RULES_SETTINGS,
  isAdmin, 
  onUpdateQR,
  onPlaceOrderClick,
  onOpenVoiceAgent,
  onOpenSettings,
  onToggleOrderRules
}: RulesCardProps) {
  const [copiedType, setCopiedType] = useState<'bKash' | 'Nagad' | 'template' | 'hotline' | null>(null);
  const [showQRModal, setShowQRModal] = useState<'bKash' | 'Nagad' | null>(null);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  const rulesConfig = orderRulesSettings || DEFAULT_ORDER_RULES_SETTINGS;
  const isRulesVisible = rulesConfig.showRulesCard !== false;

  if (!isRulesVisible) {
    if (!isAdmin) return null;
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 font-sans">
        <div className="bg-emerald-950/40 border border-dashed border-emerald-500/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xl">
          <div className="flex items-center gap-3 text-emerald-200">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white uppercase tracking-tight">Order & Payment Rules Section is Hidden</h5>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                The 3-step order guidelines and payment instruction cards are currently turned OFF from visitor view.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleOrderRules && onToggleOrderRules({ showRulesCard: true })}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Turn Rules Section ON</span>
            </button>
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => onOpenSettings('orderRules')}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-200 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-400" />
                <span>Configure Rules</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleCopyAndRedirect = (type: 'bKash' | 'Nagad', num: string) => {
    navigator.clipboard.writeText(num.trim());
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
    
    // Redirect to app portals for seamless conversion
    const targetUrl = type === 'bKash' ? 'https://www.bkash.com/app/' : 'https://www.nagad.com.bd';
    window.open(targetUrl, '_blank');
  };

  const sampleTemplate = `Assalamu Alaikum Nafi Jersey House,
Here are my completed order and payment details:

1. Transaction ID (TrxID): [আপনার TrxID এখানে লিখুন]
2. Payment Method: [bKash / Nagad / Cash on Delivery]
3. Total Paid Amount: [মোট টাকা]
4. Customer Name: [আপনার পূর্ণ নাম]
5. Contact Phone: [আপনার মোবাইল নম্বর]
6. Jersey Details: [জার্সির নাম ও সাইজ (S/M/L/XL/XXL)]
7. Custom Print (Optional): [নাম ও নম্বর]
8. Full Delivery Address: [জেলা, থানা, এরিয়া ও সম্পূর্ণ ঠিকানা]

Please verify and dispatch my order. Thank you!`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(sampleTemplate);
    setCopiedType('template');
    setTimeout(() => {
      setCopiedType(null);
    }, 3000);
  };

  const handleCopyHotline = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedType('hotline');
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'bKash' | 'Nagad') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      onUpdateQR(type, base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleClearQR = (type: 'bKash' | 'Nagad') => {
    onUpdateQR(type, null);
  };

  // Safe QR Code generator URLs
  const bKashGeneratedURL = bKashQR || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=230-22-115&data=${encodeURIComponent(bKashNumber.trim())}`;
  const nagadGeneratedURL = nagadQR || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=242-121-32&data=${encodeURIComponent(nagadNumber.trim())}`;

  const cleanPhone = (hotlineNumber || whatsappNumber || '01402580064').replace(/[^0-9]/g, '');

  return (
    <div id="official-rules-container" className="relative overflow-hidden bg-[#090e0b] border border-white/15 rounded-2xl p-5 sm:p-7 md:p-9 shadow-2xl font-sans">
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-500/15 via-pink-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* Header Banner with Translation Toggle */}
      <div className="relative z-10 mb-8 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-emerald-400 tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-extrabold mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ordering Rules & Guidelines</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight uppercase">
              {language === 'bn' ? (
                <>অর্ডার ও পেমেন্টের <span className="text-emerald-400">মূল নিয়মাবলী</span></>
              ) : (
                <>Official Rules <span className="text-emerald-400">For Ordering & Payment</span></>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-3xl leading-relaxed">
              {language === 'bn' 
                ? '১ম ধাপে অর্ডার প্লেস করুন, ২য় ধাপে বিকাশ/নগদে পেমেন্ট সম্পন্ন করে TrxID নিন, ৩য় ধাপে আমাদের ফেসবুক পেজে মেসেজ করুন। এছাড়া রয়েছে ক্যাশ অন ডেলিভারি ও ২৪/৭ হেল্পলাইন।'
                : 'Step 1: Place your order, Step 2: Pay via bKash/Nagad Send Money & copy TrxID, Step 3: Message our Facebook page. Also supports Cash on Delivery & 24/7 Helpline.'}
            </p>
          </div>

          {/* Quick Origin Badge & Language Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Language Translation Switcher */}
            <div className="bg-black/80 border border-white/15 rounded-xl p-1.5 flex items-center gap-1 shadow-inner">
              <Languages className="w-4 h-4 text-emerald-400 ml-1.5 mr-0.5" />
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'bn'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-3 flex items-center gap-2.5 text-xs shadow-inner shrink-0">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white uppercase text-[11px] block">NAFI JERSEY HOUSE</span>
                <span className="text-[10px] text-zinc-300 font-medium">{hubAddress || 'Mirpur, Dhaka - 1216, Bangladesh'}</span>
              </div>
            </div>

            {/* Admin Quick Action Controls */}
            {isAdmin && (
              <div className="flex items-center gap-1.5">
                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={() => onOpenSettings('orderRules')}
                    className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/15 hover:border-emerald-500/50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    title="Configure Order & Payment Rules and Store Hub Location"
                  >
                    <Settings className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Rules & Location</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onToggleOrderRules && onToggleOrderRules({ showRulesCard: false })}
                  className="p-2 bg-zinc-900 hover:bg-rose-950/60 border border-white/15 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 rounded-xl transition-colors cursor-pointer"
                  title="Hide Rules Section from Store"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 CORE ORDERING STEPS SUMMARY CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 mb-8 items-stretch">
        
        {/* STEP 1: PLACE THE ORDER */}
        <div className="bg-[#111713] border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-500 text-black font-black flex items-center justify-center text-sm shadow-md">
                1
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Step 1: Place Order
              </span>
            </div>
            <h4 className="text-base font-black text-white uppercase tracking-tight">
              {language === 'bn' ? '১. প্রথমে অর্ডার প্লেস করুন' : '1. Place Your Order'}
            </h4>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              {language === 'bn'
                ? 'পছন্দের জার্সির সাইজ (S/M/L/XL/XXL) ও পরিমাণ সিলেক্ট করে "Buy Now" অথবা "Cart Checkout" থেকে অর্ডার ফর্ম পূরণ করুন।'
                : 'Select your preferred jersey size, quantity, custom printing (if required), and submit the order checkout form.'}
            </p>
          </div>
          {onPlaceOrderClick && (
            <button
              type="button"
              onClick={onPlaceOrderClick}
              className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow active:scale-95 cursor-pointer"
            >
              <span>{language === 'bn' ? 'জার্সি সিলেক্ট করুন' : 'Browse Jerseys'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* STEP 2: TRANSLATE CONTENT & VERIFY PAYMENT */}
        <div className="bg-[#141612] border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="w-7 h-7 rounded-xl bg-amber-400 text-black font-black flex items-center justify-center text-sm shadow-md">
                2
              </span>
              <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Step 2: Payment & TrxID
              </span>
            </div>
            <h4 className="text-base font-black text-white uppercase tracking-tight">
              {language === 'bn' ? '২. পেমেন্ট ও TrxID সংগ্রহ' : '2. Complete Payment & TrxID'}
            </h4>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              {language === 'bn'
                ? 'বিকাশ বা নগদ পার্সোনাল নম্বরে Send Money করুন এবং সফল পেমেন্টের পর প্রাপ্ত Transaction ID (TrxID) সংরক্ষণ বা কপি করে রাখুন।'
                : 'Send Money to our verified bKash or Nagad number. Keep and copy your Transaction ID (TrxID) from the SMS.'}
            </p>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between bg-black/60 px-3 py-1.5 rounded-lg border border-white/5 text-[11px]">
              <span className="text-pink-400 font-bold">bKash: {bKashNumber}</span>
              <button
                type="button"
                onClick={() => handleCopyAndRedirect('bKash', bKashNumber)}
                className="text-[10px] text-pink-300 hover:text-white underline cursor-pointer"
              >
                Copy
              </button>
            </div>
            <div className="flex items-center justify-between bg-black/60 px-3 py-1.5 rounded-lg border border-white/5 text-[11px]">
              <span className="text-orange-400 font-bold">Nagad: {nagadNumber}</span>
              <button
                type="button"
                onClick={() => handleCopyAndRedirect('Nagad', nagadNumber)}
                className="text-[10px] text-orange-300 hover:text-white underline cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* STEP 3: MESSAGE ON FACEBOOK WITH LINK */}
        <div className="bg-[#121319] border border-blue-500/40 hover:border-blue-500/70 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="w-7 h-7 rounded-xl bg-[#1877f2] text-white font-black flex items-center justify-center text-sm shadow-md">
                3
              </span>
              <span className="text-[10px] font-mono text-blue-300 font-bold uppercase tracking-wider bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
                Step 3: FB Message
              </span>
            </div>
            <h4 className="text-base font-black text-white uppercase tracking-tight">
              {language === 'bn' ? '৩. ফেসবুক পেজে লিংক সহ মেসেজ' : '3. Message Us on Facebook'}
            </h4>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              {language === 'bn'
                ? 'অবশেষে আপনার TrxID, নাম, ফোন নম্বর ও ডেলিভারি ঠিকানা সহ আমাদের ফেসবুক পেজের লিংকে সরাসরি মেসেজ পাঠিয়ে দিন।'
                : 'Finally, message our official Facebook page with your TrxID, full name, phone number and delivery address.'}
            </p>
          </div>

          <div className="mt-4">
            <a
              id="fb-official-page-rules-cta"
              href={facebookLink}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-gradient-to-r from-[#1877f2] to-[#0d5ec4] hover:from-[#166fe5] hover:to-[#0a52ad] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'bn' ? 'ফেসবুক পেজে মেসেজ পাঠান' : 'Send Facebook Message'}</span>
            </a>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* BOX 1: ORDER PAYMENT IS THE MAIN RULE (অর্ডার ও পেমেন্টের মূল নিয়ম) */}
      {/* ========================================================================= */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400">
            <CreditCard className="w-4 h-4" />
          </div>
          <h4 className="text-lg font-black text-white uppercase tracking-tight">
            {language === 'bn' ? 'অর্ডার ও পেমেন্টের মূল নিয়ম (Order Payment Main Rules)' : 'Order Payment Main Rule'}
          </h4>
          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 uppercase font-bold">
            Main Rule
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* SIDE 1: PAYMENT RULES & WALLETS */}
          <div className="bg-[#121613] border border-emerald-500/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-400 block">
                      পেমেন্ট একাউন্ট (Send Money)
                    </span>
                    <h5 className="text-base font-bold text-white uppercase tracking-tight">
                      bKash & Nagad Wallets
                    </h5>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-zinc-900 text-zinc-300 px-2.5 py-1 rounded border border-white/10 font-bold">
                  Personal
                </span>
              </div>

              {/* Wallets */}
              <div className="space-y-3">
                {/* bKash Card */}
                <div className="bg-zinc-950 p-3.5 border border-pink-500/25 hover:border-pink-500/50 rounded-xl transition-all">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#e2127a]/20 text-[#ff5ca6] font-bold text-[10px] uppercase font-mono border border-[#e2127a]/30">
                        bKash Personal
                      </span>
                      <span className="text-white font-mono font-black text-sm select-all">
                        {bKashNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowQRModal('bKash')}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        title="Show bKash QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">QR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyAndRedirect('bKash', bKashNumber)}
                        className="px-3 py-1.5 rounded-lg bg-[#e2127a] hover:bg-[#c20e64] text-white text-[11px] font-bold uppercase transition-all flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
                      >
                        {copiedType === 'bKash' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy & Open bKash</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nagad Card */}
                <div className="bg-zinc-950 p-3.5 border border-orange-500/25 hover:border-orange-500/50 rounded-xl transition-all">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#f6921e]/20 text-[#ffa843] font-bold text-[10px] uppercase font-mono border border-[#f6921e]/30">
                        Nagad Personal
                      </span>
                      <span className="text-white font-mono font-black text-sm select-all">
                        {nagadNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowQRModal('Nagad')}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        title="Show Nagad QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">QR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyAndRedirect('Nagad', nagadNumber)}
                        className="px-3 py-1.5 rounded-lg bg-[#f6921e] hover:bg-[#d57c13] text-white text-[11px] font-bold uppercase transition-all flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
                      >
                        {copiedType === 'Nagad' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy & Open Nagad</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Secure Mobile Banking
              </span>
              <span className="font-mono text-[10px]">Instant SMS Confirmation</span>
            </div>
          </div>

          {/* SIDE 2: ORDER & FACEBOOK MESSAGE RULES */}
          <div className="bg-[#141216] border border-orange-500/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-500/15 text-orange-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-orange-400 block">
                      ফেসবুক মেসেজ ও ভেরিফিকেশন নিয়ম
                    </span>
                    <h5 className="text-base font-bold text-white uppercase tracking-tight">
                      Facebook Confirmation
                    </h5>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-orange-500/20 text-orange-300 px-2.5 py-1 rounded border border-orange-500/30 font-extrabold uppercase">
                  Mandatory
                </span>
              </div>

              {/* MANDATORY HIGHLIGHTED RULE BANNER */}
              <div className="p-4 bg-gradient-to-r from-orange-950/70 via-zinc-950 to-black border-2 border-orange-500/60 rounded-xl mb-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <h6 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                      When everything is finished, send the Transaction ID to the Facebook page messages and provide detailed information.
                    </h6>
                    <p className="text-[11px] sm:text-xs text-orange-200 mt-1 leading-relaxed font-sans font-medium">
                      সবকিছু সম্পন্ন হওয়ার পর বিকাশ/নগদের <strong className="text-white underline">Transaction ID (TrxID)</strong> সহ আপনার পূর্ণ নাম, মোবাইল নম্বর, সাইজ এবং ডেলিভারি ঠিকানা আমাদের ফেসবুক পেজের ইনবক্স মেসেজে পাঠিয়ে দিন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons for Side 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  id="fb-official-page-message-cta"
                  href={facebookLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1877f2] to-[#0d5ec4] hover:from-[#166fe5] hover:to-[#0a52ad] text-white text-xs font-bold py-2.5 px-3.5 rounded-xl uppercase tracking-wider shadow-lg active:scale-95 transition-all text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Facebook পেজে মেসেজ পাঠান</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyTemplate}
                  className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-200 text-xs font-bold py-2.5 px-3.5 rounded-xl uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
                  title="Copy ready message format to clipboard"
                >
                  {copiedType === 'template' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">ফরম্যাট কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>মেসেজ ফরম্যাট কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="text-orange-400 font-medium">
                ⚡ মেসেজ পেলে সাথে সাথে পার্সেল ডিসপ্যাচ করা হয়
              </span>
              <span className="font-mono text-[10px]">Delivery in 1–3 Days</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOX 2: CASH ON DELIVERY SUPPORTED (PLACED BEFORE HELPLINE BOX) */}
      {/* ========================================================================= */}
      <div id="cod-supported-box" className="relative z-10 mb-8">
        <div className="bg-gradient-to-r from-[#0c1811] via-[#101e16] to-[#0d1712] border-2 border-emerald-500/40 hover:border-emerald-500/70 rounded-2xl p-5 sm:p-6 shadow-2xl transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/25">
                    Available Nationwide
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">64 Districts</span>
                </div>
                <h4 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mt-0.5">
                  {language === 'bn' ? 'ক্যাশ অন ডেলিভারি সুবিধা (Cash on Delivery Supported)' : 'Cash on Delivery Supported Nationwide'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pay at Doorstep</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-zinc-300">
            <div className="bg-black/50 border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-white block mb-0.5">হাতে পেয়ে মূল্য পরিশোধ</strong>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  পার্সেল আপনার ঠিকানায় পৌঁছানোর পর দেখে ক্যাশে টাকা পরিশোধ করতে পারবেন।
                </p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-white block mb-0.5">৬৪ জেলায় দ্রুত হোম ডেলিভারি</strong>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  স্টেডফাস্ট, রেডএক্স ও পেপারফ্লাই কুরিয়ারের মাধ্যমে ১-৩ দিনের মধ্যে নিশ্চিত ডেলিভারি।
                </p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-white block mb-0.5">সহজ বুকিং প্রক্রিয়া</strong>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  শুধুমাত্র ডেলিভারি চার্জ বিকাশ/নগদে দিয়ে অর্ডার কনফার্ম করুন, জার্সির মূল্য ডেলিভারির সময় দিন।
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% সুরক্ষিত ডেলিভারি ও অরিজিনাল থাই কোয়ালিটি নিশ্চয়তা
            </span>

            {onPlaceOrderClick && (
              <button
                type="button"
                onClick={onPlaceOrderClick}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow flex items-center gap-1"
              >
                <span>ক্যাশ অন ডেলিভারিতে অর্ডার করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOX 3: HELPLINE BOX (PLACED AFTER ORDER PAYMENT MAIN RULE & CASH ON DELIVERY) */}
      {/* ========================================================================= */}
      <div id="helpline-support-box" className="relative z-10">
        <div className="bg-gradient-to-r from-[#10141b] via-[#141a24] to-[#0f151e] border-2 border-cyan-500/40 hover:border-cyan-500/70 rounded-2xl p-5 sm:p-6 shadow-2xl transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/25">
                    Official Support
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">24/7 Available</span>
                </div>
                <h4 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mt-0.5">
                  {helplineLabel || 'HELPLINE'} & CUSTOMER SUPPORT (২৪/৭ হেল্পলাইন)
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 rounded-xl">
                <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Agent Active</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Call Direct */}
            <div className="bg-black/60 border border-white/10 hover:border-cyan-500/40 p-3.5 rounded-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Direct Phone Call</span>
                  <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-sm font-mono font-black text-white mb-1">{hotlineNumber}</p>
                <p className="text-[10px] text-zinc-400">যে কোনো প্রশ্ন বা জরুরি সহায়তার জন্য সরাসরি কল দিন।</p>
              </div>
              <a
                href={`tel:${hotlineNumber}`}
                className="mt-3 w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Call Now</span>
              </a>
            </div>

            {/* WhatsApp Chat */}
            <div className="bg-black/60 border border-white/10 hover:border-[#25d366]/40 p-3.5 rounded-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#25d366] font-bold uppercase">WhatsApp Chat</span>
                  <MessageSquare className="w-3.5 h-3.5 text-[#25d366]" />
                </div>
                <p className="text-sm font-mono font-black text-white mb-1">{whatsappNumber}</p>
                <p className="text-[10px] text-zinc-400">জার্সির ছবি, সাইজ ও বিস্তারিত জানতে হোয়াটসঅ্যাপে মেসেজ দিন।</p>
              </div>
              <a
                href={formatWhatsAppLink(whatsappNumber)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 w-full py-1.5 bg-[#25d366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Voice Assistant */}
            <div className="bg-black/60 border border-white/10 hover:border-emerald-500/40 p-3.5 rounded-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">AI Voice Assistant</span>
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-sm font-mono font-black text-white mb-1">কথা বলে অর্ডার</p>
                <p className="text-[10px] text-zinc-400">বাংলায় কথা বলে স্বয়ংক্রিয়ভাবে জার্সি বুকিং ও বিস্তারিত জানুন।</p>
              </div>
              <button
                type="button"
                onClick={onOpenVoiceAgent}
                className="mt-3 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
              >
                <Bot className="w-3 h-3" />
                <span>AI Voice খুলুন</span>
              </button>
            </div>

            {/* Support Email & Hub */}
            <div className="bg-black/60 border border-white/10 hover:border-amber-500/40 p-3.5 rounded-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Email & Hub</span>
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-xs font-mono font-bold text-white truncate mb-1">{supportEmail}</p>
                <p className="text-[10px] text-zinc-400">Mirpur, Dhaka - 1216 (Hub Dispatch Center)</p>
              </div>
              <a
                href={`mailto:${supportEmail}`}
                className="mt-3 w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <Mail className="w-3 h-3" />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal Display */}
      {showQRModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowQRModal(null)}
        >
          <div 
            className="bg-[#121614] border border-white/15 rounded-2xl p-6 max-w-sm w-full text-center relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>{showQRModal} Payment QR Code</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowQRModal(null)}
                className="text-zinc-400 hover:text-white text-xs p-1 rounded-md hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl inline-block shadow-inner mb-3">
              <img
                src={showQRModal === 'bKash' ? bKashGeneratedURL : nagadGeneratedURL}
                alt={`${showQRModal} QR`}
                className="w-48 h-48 object-contain mx-auto"
              />
            </div>

            <p className="text-xs text-zinc-300 font-mono font-bold">
              {showQRModal === 'bKash' ? bKashNumber : nagadNumber}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Scan with your {showQRModal} app to make Send Money payment instantly.
            </p>

            {isAdmin && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2">
                <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleQRUpload(e, showQRModal)}
                  />
                  <span>Upload Custom QR</span>
                </label>
                {(showQRModal === 'bKash' ? bKashQR : nagadQR) && (
                  <button
                    type="button"
                    onClick={() => handleClearQR(showQRModal)}
                    className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white rounded-lg text-xs font-bold"
                  >
                    Reset QR
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowQRModal(null)}
              className="mt-4 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
