import React, { useState } from 'react';
import { 
  PhoneCall, 
  Copy, 
  Check, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Lock, 
  Unlock, 
  QrCode, 
  HelpCircle, 
  ExternalLink,
  CreditCard,
  CheckCircle2,
  Package,
  Settings2
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { formatWhatsAppLink } from '../utils/whatsappHelper';

interface PaymentHubAndFooterProps {
  bKashNumber: string;
  setBKashNumber: (num: string) => void;
  nagadNumber: string;
  setNagadNumber: (num: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (num: string) => void;
  supportEmail?: string;
  setSupportEmail?: (email: string) => void;
  hotlineNumber?: string;
  setHotlineNumber?: (num: string) => void;
  hubAddress?: string;
  setHubAddress?: (addr: string) => void;
  bKashQR?: string;
  nagadQR?: string;
  onUpdateQR?: (type: 'bKash' | 'nagad', dataUrl: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  onOpenLoginModal: () => void;
  onOpenStoreSettings?: () => void;
  scrollToSection: (id: string) => void;
}

export default function PaymentHubAndFooter({
  bKashNumber,
  setBKashNumber,
  nagadNumber,
  setNagadNumber,
  whatsappNumber = 'https://wa.me/qr/MV2Z72HWCIQZD1',
  setWhatsappNumber,
  supportEmail = 'support@napis.com',
  setSupportEmail,
  hotlineNumber = '01402580064',
  setHotlineNumber,
  hubAddress = 'Mirpur, Dhaka - 1216, Bangladesh',
  setHubAddress,
  bKashQR,
  nagadQR,
  onUpdateQR,
  isAdmin,
  setIsAdmin,
  onOpenLoginModal,
  onOpenStoreSettings,
  scrollToSection,
}: PaymentHubAndFooterProps) {
  const [copiedB, setCopiedB] = useState(false);
  const [copiedN, setCopiedN] = useState(false);
  const [showEditNumbers, setShowEditNumbers] = useState(false);

  const [tempB, setTempB] = useState(bKashNumber);
  const [tempN, setTempN] = useState(nagadNumber);
  const [tempW, setWhatsapp] = useState(whatsappNumber);

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

  const handleSaveNumbers = (e: React.FormEvent) => {
    e.preventDefault();
    setBKashNumber(tempB.trim());
    setNagadNumber(tempN.trim());
    setWhatsappNumber(tempW.trim());
    setShowEditNumbers(false);
  };

  const handleQRUpload = (type: 'bKash' | 'nagad', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateQR) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        onUpdateQR(type, reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <footer id="payment-and-footer-section" className="w-full bg-[#070a08] border-t border-white/15 text-zinc-300 font-sans mt-20">
      {/* ========================================================================= */}
      {/* 1. OFFICIAL PAYMENT METHODS (BKASH & NAGAD) - PLACED AT THE VERY END */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-xs uppercase tracking-widest mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Verified Payment Accounts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
            Pay via bKash, Nagad & Cash on Delivery
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Send money or make payment to our verified merchant numbers below, then enter your TrxID during checkout for instant verification.
          </p>
        </div>

        {/* Payment Account Cards (Daraz & Bangladeshi E-Commerce Standard) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* bKash Official Box */}
          <div className="bg-[#12080f] border-2 border-pink-600/40 hover:border-pink-500 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all">
            <div className="flex items-center justify-between gap-3 border-b border-pink-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                  bK
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">bKash Account</h3>
                  <span className="text-[11px] text-pink-400 font-mono">Personal / Merchant Number</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-pink-500/20 text-pink-300 text-[10px] font-mono font-bold uppercase border border-pink-500/30">
                Verified ✓
              </span>
            </div>

            {/* bKash Number & Copy Action */}
            <div className="mt-5 p-4 bg-black/60 border border-pink-500/30 rounded-xl flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">bKash Mobile Number</span>
                <span className="text-lg sm:text-xl font-mono font-black text-white tracking-wider">
                  {bKashNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyB}
                className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold uppercase rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedB ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedB ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            {/* bKash Steps */}
            <div className="mt-4 space-y-1.5 text-xs text-zinc-400 font-sans">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                <span>Open your bKash App & select <strong>Send Money</strong> or <strong>Payment</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                <span>Enter jersey order total & reference <strong>"Jersey"</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                <span>Copy the <strong>Transaction ID (TrxID)</strong> and paste in Checkout</span>
              </div>
            </div>

            {/* QR Code (if available or uploadable) */}
            {bKashQR && (
              <div className="mt-4 pt-3 border-t border-pink-500/20 flex items-center gap-3">
                <img src={bKashQR} alt="bKash QR" className="w-16 h-16 bg-white p-1 rounded-lg object-contain shadow" />
                <div className="text-[11px] text-zinc-400">
                  <strong className="text-white block">Scan to Pay via bKash</strong>
                  <span>Open bKash App &gt; Tap QR Code &gt; Scan</span>
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <label className="text-pink-400 font-bold cursor-pointer hover:underline text-[11px]">
                  <span>+ Upload bKash QR</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleQRUpload('bKash', e)} />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenStoreSettings) onOpenStoreSettings();
                    else setShowEditNumbers(true);
                  }}
                  className="text-pink-400 hover:text-pink-300 font-bold text-[11px] cursor-pointer"
                >
                  ⚙️ Edit bKash
                </button>
              </div>
            )}
          </div>

          {/* Nagad Official Box */}
          <div className="bg-[#120a05] border-2 border-orange-600/40 hover:border-orange-500 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all">
            <div className="flex items-center justify-between gap-3 border-b border-orange-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                  ন
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">Nagad Account</h3>
                  <span className="text-[11px] text-orange-400 font-mono">Personal / Merchant Number</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-300 text-[10px] font-mono font-bold uppercase border border-orange-500/30">
                Verified ✓
              </span>
            </div>

            {/* Nagad Number & Copy Action */}
            <div className="mt-5 p-4 bg-black/60 border border-orange-500/30 rounded-xl flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Nagad Mobile Number</span>
                <span className="text-lg sm:text-xl font-mono font-black text-white tracking-wider">
                  {nagadNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyN}
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedN ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedN ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            {/* Nagad Steps */}
            <div className="mt-4 space-y-1.5 text-xs text-zinc-400 font-sans">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>Open your Nagad App & select <strong>Send Money</strong> or <strong>Payment</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>Enter jersey order total & reference <strong>"Jersey"</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>Copy the <strong>Transaction ID (TrxID)</strong> and paste in Checkout</span>
              </div>
            </div>

            {/* QR Code */}
            {nagadQR && (
              <div className="mt-4 pt-3 border-t border-orange-500/20 flex items-center gap-3">
                <img src={nagadQR} alt="Nagad QR" className="w-16 h-16 bg-white p-1 rounded-lg object-contain shadow" />
                <div className="text-[11px] text-zinc-400">
                  <strong className="text-white block">Scan to Pay via Nagad</strong>
                  <span>Open Nagad App &gt; Tap QR Scan</span>
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <label className="text-orange-400 font-bold cursor-pointer hover:underline text-[11px]">
                  <span>+ Upload Nagad QR</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleQRUpload('nagad', e)} />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenStoreSettings) onOpenStoreSettings();
                    else setShowEditNumbers(true);
                  }}
                  className="text-orange-400 hover:text-orange-300 font-bold text-[11px] cursor-pointer"
                >
                  ⚙️ Edit Nagad
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cash On Delivery & Customer Support Hotline Banner */}
        <div className="mt-8 bg-[#101511] border border-white/10 rounded-2xl p-5 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase">Cash on Delivery (COD) Supported</h4>
              <p className="text-xs text-zinc-400">Available across all 64 districts in Bangladesh with ৳100 advance courier security.</p>
            </div>
          </div>
          <a
            href={formatWhatsAppLink(whatsappNumber)}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-[#25d366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Helpline: {whatsappNumber && (whatsappNumber.includes('wa.me') || whatsappNumber.includes('http')) ? 'WhatsApp Direct' : (whatsappNumber || '01402580064')}</span>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CUSTOMER TRUST PILLARS (AUTHENTICITY, DELIVERY, GUARANTEE) */}
      {/* ========================================================================= */}
      <div className="border-y border-white/10 bg-[#090d0a] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-7 h-7 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase">100% Authentic Quality</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Thai Premium match fabric & official double-knit mesh.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase">Doorstep Express Delivery</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">1-3 days fast delivery across all 64 districts in Bangladesh.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RefreshCw className="w-7 h-7 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase">7-Day Free Exchange</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Hassle-free size replacement if it doesn't fit you.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Lock className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase">100% Secure Payment</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">bKash, Nagad verified receipts & direct TrxID confirmation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. COMPREHENSIVE E-COMMERCE FOOTER (DARAZ & AMAZON STANDARD) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <BrandLogo size="md" />
          <p className="text-zinc-400 leading-relaxed">
            Bangladesh's premier online destination for official Thai premium football kits, player edition jerseys, and world cup apparel.
          </p>
          <div className="pt-2 text-zinc-400">
            <p><strong className="text-white">Hub:</strong> {hubAddress || 'Mirpur, Dhaka - 1216, Bangladesh'}</p>
            <p><strong className="text-white">Hotline:</strong> {hotlineNumber || whatsappNumber || '01402580064'}</p>
            <p><strong className="text-white">Email:</strong> {supportEmail || 'support@napis.com'}</p>
          </div>
        </div>

        {/* Col 2: Customer Care */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Customer Care</h4>
          <ul className="space-y-2 text-zinc-400">
            <li><button onClick={() => scrollToSection('shop')} className="hover:text-orange-400 transition-colors">How to Place an Order</button></li>
            <li><button onClick={() => scrollToSection('track')} className="hover:text-orange-400 transition-colors">Track Your Parcel (Order ID / Phone)</button></li>
            <li><button onClick={() => scrollToSection('rules')} className="hover:text-orange-400 transition-colors">Delivery Rates & Shipping Time</button></li>
            <li><button onClick={() => scrollToSection('rules')} className="hover:text-orange-400 transition-colors">Returns, Exchange & Refund Policy</button></li>
            <li><button onClick={() => scrollToSection('rules')} className="hover:text-orange-400 transition-colors">Size Guide (S, M, L, XL, XXL)</button></li>
          </ul>
        </div>

        {/* Col 3: Popular Categories */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Jersey Categories</h4>
          <ul className="space-y-2 text-zinc-400">
            <li><button onClick={() => scrollToSection('shop')} className="hover:text-orange-400 transition-colors">South America (Brazil, Argentina, Uruguay)</button></li>
            <li><button onClick={() => scrollToSection('shop')} className="hover:text-orange-400 transition-colors">Europe (Portugal, Spain, Germany, France)</button></li>
            <li><button onClick={() => scrollToSection('shop')} className="hover:text-orange-400 transition-colors">Asia & National Kits (Bangladesh Home/Away)</button></li>
            <li><button onClick={() => scrollToSection('shop')} className="hover:text-orange-400 transition-colors">Club Kits (Real Madrid, Barcelona, Man City)</button></li>
            <li><button onClick={() => scrollToSection('flash-sale')} className="hover:text-orange-400 transition-colors">Limited Flash Sale Offers</button></li>
          </ul>
        </div>

        {/* Col 4: Payment & Verification Logos */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Payment & Delivery Partners</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-pink-950/70 border border-pink-500/40 text-pink-300 font-bold rounded text-[11px]">bKash</span>
            <span className="px-2.5 py-1 bg-orange-950/70 border border-orange-500/40 text-orange-300 font-bold rounded text-[11px]">Nagad</span>
            <span className="px-2.5 py-1 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold rounded text-[11px]">Cash on Delivery</span>
            <span className="px-2.5 py-1 bg-zinc-900 border border-white/10 text-zinc-300 rounded text-[11px]">Steadfast Courier</span>
            <span className="px-2.5 py-1 bg-zinc-900 border border-white/10 text-zinc-300 rounded text-[11px]">RedX</span>
            <span className="px-2.5 py-1 bg-zinc-900 border border-white/10 text-zinc-300 rounded text-[11px]">Pathao</span>
          </div>

          <div className="pt-3">
            <span className="text-[11px] text-zinc-500 block mb-1">Store Owner Access:</span>
            {isAdmin ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-emerald-400 font-mono text-[11px] font-bold">Admin Active ✓</span>
                {onOpenStoreSettings && (
                  <button
                    type="button"
                    onClick={onOpenStoreSettings}
                    className="px-2 py-0.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-bold rounded text-[11px] cursor-pointer"
                  >
                    ⚙️ Store Settings
                  </button>
                )}
                <button
                  onClick={() => setIsAdmin(false)}
                  className="text-red-400 hover:text-red-300 underline text-[11px] cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white bg-zinc-900 px-3 py-1.5 rounded border border-white/10 hover:border-orange-500/50 transition-all text-[11px] cursor-pointer"
              >
                <Unlock className="w-3 h-3 text-orange-400" />
                <span>Store Owner Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-[#050706] py-4 text-center text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© Nafi Jersey House. All Rights Reserved. Designed for Authentic Football Fans in Bangladesh.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Delivery Policy</span>
          </div>
        </div>
      </div>

      {/* Admin Edit Numbers Modal */}
      {showEditNumbers && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141a15] border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white uppercase mb-4 pb-2 border-b border-white/10">
              Edit Merchant Payment Numbers
            </h3>
            <form onSubmit={handleSaveNumbers} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">bKash Number</label>
                <input
                  type="text"
                  value={tempB}
                  onChange={(e) => setTempB(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Nagad Number</label>
                <input
                  type="text"
                  value={tempN}
                  onChange={(e) => setTempN(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">WhatsApp Helpline</label>
                <input
                  type="text"
                  value={tempW}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-white font-mono"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-lg uppercase"
                >
                  Save Numbers
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditNumbers(false)}
                  className="px-4 bg-zinc-800 text-zinc-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
