import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Check,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  QrCode,
  Upload,
  CreditCard,
  Building,
  Headphones,
  Bot,
  Star,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Smartphone,
  Banknote,
  Sliders,
  Sparkles,
  Info,
  Layers,
  Flame,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomerReview, ProductDisplaySettings, OrderRulesSettings, NavbarSettings } from '../types';
import { DEFAULT_CUSTOMER_REVIEWS, DEFAULT_PRODUCT_DISPLAY_SETTINGS, DEFAULT_ORDER_RULES_SETTINGS, DEFAULT_NAVBAR_SETTINGS } from '../data';
import { compressImageFile } from '../utils/imageCompressor';

export type SettingsTab = 'general' | 'navbar' | 'productDisplay' | 'orderRules' | 'payment' | 'reviews' | 'gotQuestions';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SettingsTab;
  bKashNumber: string;
  setBKashNumber: (num: string) => void;
  nagadNumber: string;
  setNagadNumber: (num: string) => void;
  supportEmail: string;
  setSupportEmail: (email: string) => void;
  hotlineNumber: string;
  setHotlineNumber: (num: string) => void;
  hubAddress: string;
  setHubAddress: (addr: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (num: string) => void;
  helplineLabel?: string;
  setHelplineLabel?: (label: string) => void;
  voiceAgentNumber?: string;
  setVoiceAgentNumber?: (num: string) => void;
  showVoiceAssistant?: boolean;
  setShowVoiceAssistant?: (val: boolean) => void;
  facebookLink?: string;
  setFacebookLink?: (link: string) => void;
  bKashQR?: string | null;
  nagadQR?: string | null;
  showCustomerReviews?: boolean;
  setShowCustomerReviews?: (val: boolean) => void;
  customerReviews?: CustomerReview[];
  setCustomerReviews?: (reviews: CustomerReview[]) => void;
  showGotQuestions?: boolean;
  setShowGotQuestions?: (val: boolean) => void;
  productDisplaySettings?: ProductDisplaySettings;
  setProductDisplaySettings?: (settings: ProductDisplaySettings) => void;
  orderRulesSettings?: OrderRulesSettings;
  setOrderRulesSettings?: (settings: OrderRulesSettings) => void;
  navbarSettings?: NavbarSettings;
  setNavbarSettings?: (settings: NavbarSettings) => void;
  onUpdateQR?: (type: 'bKash' | 'Nagad', dataUrl: string | null) => void;
  onSaveAllSettings: (settings: {
    bKashNumber: string;
    nagadNumber: string;
    supportEmail: string;
    hotlineNumber: string;
    hubAddress: string;
    whatsappNumber: string;
    helplineLabel?: string;
    voiceAgentNumber?: string;
    showVoiceAssistant?: boolean;
    facebookLink?: string;
    bKashQR?: string | null;
    nagadQR?: string | null;
    showCustomerReviews?: boolean;
    customerReviews?: CustomerReview[];
    showGotQuestions?: boolean;
    productDisplaySettings?: ProductDisplaySettings;
    orderRulesSettings?: OrderRulesSettings;
    navbarSettings?: NavbarSettings;
  }) => Promise<boolean>;
}

export default function StoreSettingsModal({
  isOpen,
  onClose,
  initialTab = 'general',
  bKashNumber,
  setBKashNumber,
  nagadNumber,
  setNagadNumber,
  supportEmail,
  setSupportEmail,
  hotlineNumber,
  setHotlineNumber,
  hubAddress,
  setHubAddress,
  whatsappNumber,
  setWhatsappNumber,
  helplineLabel = 'HELPLINE',
  setHelplineLabel,
  voiceAgentNumber = '01402580064',
  setVoiceAgentNumber,
  showVoiceAssistant = true,
  setShowVoiceAssistant,
  facebookLink = 'https://www.facebook.com/share/1Bh4gYajWE/',
  setFacebookLink,
  bKashQR,
  nagadQR,
  showCustomerReviews = true,
  setShowCustomerReviews,
  customerReviews = DEFAULT_CUSTOMER_REVIEWS,
  setCustomerReviews,
  showGotQuestions = true,
  setShowGotQuestions,
  productDisplaySettings = DEFAULT_PRODUCT_DISPLAY_SETTINGS,
  setProductDisplaySettings,
  orderRulesSettings = DEFAULT_ORDER_RULES_SETTINGS,
  setOrderRulesSettings,
  navbarSettings = DEFAULT_NAVBAR_SETTINGS,
  setNavbarSettings,
  onUpdateQR,
  onSaveAllSettings,
}: StoreSettingsModalProps) {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  // General settings state
  const [bKash, setBKash] = useState(bKashNumber || '01402580064');
  const [nagad, setNagad] = useState(nagadNumber || '01402580064');
  const [email, setEmail] = useState(supportEmail || 'support@napis.com');
  const [hotline, setHotline] = useState(hotlineNumber || '01402580064');
  const [address, setAddress] = useState(hubAddress || 'Mirpur, Dhaka - 1216, Bangladesh');
  const [whatsapp, setWhatsapp] = useState(whatsappNumber || 'https://wa.me/qr/MV2Z72HWCIQZD1');
  const [helpline, setHelpline] = useState(helplineLabel || 'HELPLINE');
  const [voiceNumber, setVoiceNumber] = useState(voiceAgentNumber || '01402580064');
  const [voiceAssistantEnabled, setVoiceAssistantEnabled] = useState(showVoiceAssistant !== false);
  const [fbLink, setFbLink] = useState(facebookLink || 'https://www.facebook.com/share/1Bh4gYajWE/');

  // QR Codes state
  const [bKashQRLocal, setBKashQRLocal] = useState<string | null>(bKashQR || null);
  const [nagadQRLocal, setNagadQRLocal] = useState<string | null>(nagadQR || null);

  // Navbar Settings state
  const [navSettings, setNavSettings] = useState<NavbarSettings>(
    navbarSettings || DEFAULT_NAVBAR_SETTINGS
  );

  // Product Display Settings state
  const [prodDisplay, setProdDisplay] = useState<ProductDisplaySettings>(
    productDisplaySettings || DEFAULT_PRODUCT_DISPLAY_SETTINGS
  );

  // Order Rules Settings state
  const [orderRules, setOrderRules] = useState<OrderRulesSettings>(
    orderRulesSettings || DEFAULT_ORDER_RULES_SETTINGS
  );

  // Customer Reviews state
  const [showReviews, setShowReviews] = useState(showCustomerReviews);
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>(
    customerReviews && customerReviews.length > 0 ? customerReviews : DEFAULT_CUSTOMER_REVIEWS
  );
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [newReview, setNewReview] = useState<Partial<CustomerReview>>({
    name: '',
    rating: 5,
    comment: '',
    jersey: '',
    location: '',
    date: 'Just now',
    size: 'L',
  });

  // Got Questions state
  const [gotQuestionsVisible, setGotQuestionsVisible] = useState(showGotQuestions);

  // UI state
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Track if modal was previously open to prevent background sync from wiping user edits
  const wasOpenRef = useRef(false);

  // Sync state ONLY when the modal transitions from closed to open
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      setActiveTab(initialTab || 'general');
      setBKash(bKashNumber || '01402580064');
      setNagad(nagadNumber || '01402580064');
      setEmail(supportEmail || 'support@napis.com');
      setHotline(hotlineNumber || '01402580064');
      setAddress(hubAddress || 'Mirpur, Dhaka - 1216, Bangladesh');
      setWhatsapp(whatsappNumber || 'https://wa.me/qr/MV2Z72HWCIQZD1');
      setHelpline(helplineLabel || 'HELPLINE');
      setVoiceNumber(voiceAgentNumber || '01402580064');
      setVoiceAssistantEnabled(showVoiceAssistant !== false);
      setFbLink(facebookLink || 'https://www.facebook.com/share/1Bh4gYajWE/');
      setBKashQRLocal(bKashQR || null);
      setNagadQRLocal(nagadQR || null);
      setNavSettings(navbarSettings || DEFAULT_NAVBAR_SETTINGS);
      setProdDisplay(productDisplaySettings || DEFAULT_PRODUCT_DISPLAY_SETTINGS);
      setOrderRules(orderRulesSettings || DEFAULT_ORDER_RULES_SETTINGS);
      setShowReviews(showCustomerReviews);
      setReviewsList(customerReviews && customerReviews.length > 0 ? customerReviews : DEFAULT_CUSTOMER_REVIEWS);
      setGotQuestionsVisible(showGotQuestions);
    } else if (!isOpen) {
      wasOpenRef.current = false;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // QR Upload handlers
  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'bKash' | 'Nagad') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 600, 0.85);
      if (type === 'bKash') {
        setBKashQRLocal(compressed);
        if (onUpdateQR) onUpdateQR('bKash', compressed);
      } else {
        setNagadQRLocal(compressed);
        if (onUpdateQR) onUpdateQR('Nagad', compressed);
      }
    } catch (err) {
      console.error('Error uploading QR code:', err);
    }
  };

  // Review management handlers
  const handleAddReview = () => {
    if (!newReview.name || !newReview.comment) return;
    const reviewToAdd: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: newReview.name || 'Verified Buyer',
      rating: Number(newReview.rating) || 5,
      comment: newReview.comment || '',
      jersey: newReview.jersey || 'Official Club Jersey',
      location: newReview.location || 'Dhaka, Bangladesh',
      date: 'Just now',
      size: newReview.size || 'L',
    };

    setReviewsList([reviewToAdd, ...reviewsList]);
    setNewReview({
      name: '',
      rating: 5,
      comment: '',
      jersey: '',
      location: '',
      date: 'Just now',
      size: 'L',
    });
  };

  const handleUpdateReview = (id: string) => {
    if (!newReview.name || !newReview.comment) return;
    setReviewsList(
      reviewsList.map((r) =>
        r.id === id
          ? {
              ...r,
              name: newReview.name || r.name,
              rating: Number(newReview.rating) || r.rating,
              comment: newReview.comment || r.comment,
              jersey: newReview.jersey || r.jersey,
              location: newReview.location || r.location,
              size: newReview.size || r.size,
            }
          : r
      )
    );
    setEditingReviewId(null);
    setNewReview({
      name: '',
      rating: 5,
      comment: '',
      jersey: '',
      location: '',
      date: 'Just now',
      size: 'L',
    });
  };

  const handleDeleteReview = (id: string) => {
    setReviewsList(reviewsList.filter((r) => r.id !== id));
  };

  const startEditReview = (r: CustomerReview) => {
    setEditingReviewId(r.id);
    setNewReview({
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      jersey: r.jersey,
      location: r.location,
      size: r.size,
    });
  };

  // Master Save Handler
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    // Apply immediate local state updates
    setBKashNumber(bKash);
    setNagadNumber(nagad);
    setSupportEmail(email);
    setHotlineNumber(hotline);
    setHubAddress(address);
    setWhatsappNumber(whatsapp);
    if (setHelplineLabel) setHelplineLabel(helpline);
    if (setVoiceAgentNumber) setVoiceAgentNumber(voiceNumber);
    if (setShowVoiceAssistant) setShowVoiceAssistant(voiceAssistantEnabled);
    if (setFacebookLink) setFacebookLink(fbLink);
    if (setShowCustomerReviews) setShowCustomerReviews(showReviews);
    if (setCustomerReviews) setCustomerReviews(reviewsList);
    if (setShowGotQuestions) setShowGotQuestions(gotQuestionsVisible);
    if (setProductDisplaySettings) setProductDisplaySettings(prodDisplay);
    if (setOrderRulesSettings) setOrderRulesSettings(orderRules);
    if (setNavbarSettings) setNavbarSettings(navSettings);

    const payload = {
      bKashNumber: bKash,
      nagadNumber: nagad,
      supportEmail: email,
      hotlineNumber: hotline,
      hubAddress: address,
      whatsappNumber: whatsapp,
      helplineLabel: helpline,
      voiceAgentNumber: voiceNumber,
      showVoiceAssistant: voiceAssistantEnabled,
      facebookLink: fbLink,
      bKashQR: bKashQRLocal,
      nagadQR: nagadQRLocal,
      showCustomerReviews: showReviews,
      customerReviews: reviewsList,
      showGotQuestions: gotQuestionsVisible,
      productDisplaySettings: prodDisplay,
      orderRulesSettings: orderRules,
      navbarSettings: navSettings,
    };

    const ok = await onSaveAllSettings(payload);
    setSaving(false);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f1511] border border-white/15 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#141b16] via-[#111713] to-[#0c120e] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>Store Management & Settings</span>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Admin Panel
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Configure location, nav bar badges, authenticity perks, order rules, payment wallets, and FAQ visibility
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 pb-2 bg-[#0c120e] border-b border-white/10 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'general'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Store & Hub Location</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('navbar')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'navbar'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layout className="w-3.5 h-3.5 text-orange-400" />
            <span>Nav & Top Bar ({[navSettings.showAuthenticBadge, navSettings.showFastDelivery, navSettings.showCodBadge, navSettings.showChatOn].filter(Boolean).length} Active)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('productDisplay')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'productDisplay'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Product Display & Perks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orderRules')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'orderRules'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Order & Payment Rules</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'payment'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Wallets & QR Codes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Reviews ({reviewsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gotQuestions')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'gotQuestions'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? (FAQ)</span>
          </button>
        </div>

        {/* Modal Body with Form */}
        <form onSubmit={handleSaveAll} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* ========================================================================= */}
          {/* TAB 1: STORE & HUB LOCATION */}
          {/* ========================================================================= */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-300">
                  <span className="font-bold text-white block mb-0.5">Physical Hub & Customer Support Details</span>
                  Your store location defaults to <strong className="text-emerald-300">Mirpur, Dhaka</strong>. You can customize the address and contact lines below. Any updates will reflect immediately across all customer views, footer badges, and ordering rules.
                </div>
              </div>

              {/* Hub Address */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Store Dispatch Hub & Physical Location</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Mirpur, Dhaka - 1216, Bangladesh"
                  className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none transition-colors"
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  Shown in the store header, delivery badge, order payment rules, and footer.
                </p>
              </div>

              {/* Helpline Label & Support Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-teal-400" />
                    <span>Helpline Badge Title</span>
                  </label>
                  <input
                    type="text"
                    value={helpline}
                    onChange={(e) => setHelpline(e.target.value)}
                    placeholder="HELPLINE"
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Support Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="support@napis.com"
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* 24/7 Hotline & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>24/7 Hotline Call Number</span>
                  </label>
                  <input
                    type="text"
                    value={hotline}
                    onChange={(e) => setHotline(e.target.value)}
                    placeholder="01402580064"
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Direct (QR Link or Number)</span>
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="https://wa.me/qr/MV2Z72HWCIQZD1"
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Accepts QR URL (e.g. https://wa.me/qr/MV2Z72HWCIQZD1) or BD phone number (e.g. 01402580064)
                  </p>
                </div>
              </div>

              {/* AI Voice Assistant Toggle Card */}
              <div className="bg-gradient-to-r from-teal-950/40 via-zinc-900 to-emerald-950/40 border border-teal-500/30 rounded-2xl p-4.5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                        <span>AI Voice Assistant Widget</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                          Bilingual Bangla / English
                        </span>
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Enable or disable the floating voice assistant button for hands-free jersey orders and queries.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setVoiceAssistantEnabled(!voiceAssistantEnabled)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      voiceAssistantEnabled
                        ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/20'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {voiceAssistantEnabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Enabled (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Disabled (Hidden)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Voice Agent Number & Facebook Page Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-teal-400" />
                    <span>AI Voice Agent Direct Hotline</span>
                  </label>
                  <input
                    type="text"
                    value={voiceNumber}
                    onChange={(e) => setVoiceNumber(e.target.value)}
                    placeholder="01402580064"
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>Official Facebook Page URL</span>
                  </label>
                  <input
                    type="url"
                    value={fbLink}
                    onChange={(e) => setFbLink(e.target.value)}
                    placeholder="https://www.facebook.com/share/1Bh4gYajWE/"
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1B: NAVIGATION BAR & TOP UTILITY BAR CUSTOMIZER */}
          {/* ========================================================================= */}
          {activeTab === 'navbar' && (
            <div className="space-y-6">
              {/* Header Info & Presets */}
              <div className="bg-gradient-to-r from-orange-950/30 via-zinc-900 to-emerald-950/30 border border-orange-500/20 rounded-2xl p-4.5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-orange-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>Navigation Bar & Top Badges Controller</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setNavSettings(DEFAULT_NAVBAR_SETTINGS)}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Show All (Daraz Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNavSettings((prev) => ({
                          ...prev,
                          showTopAnnouncementBar: true,
                          showAuthenticBadge: true,
                          showFastDelivery: false,
                          showRulesShortcut: false,
                          showPaymentShortcut: false,
                          showCodBadge: true,
                          showChatOn: true,
                          showAiVoiceButton: true,
                          showTrackOrderButton: true,
                          showCategoriesSubNav: true,
                        }))
                      }
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Compact High-Trust
                    </button>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Choose exactly what items, guarantees, and badges are displayed in the header navigation: toggle <strong className="text-orange-300">100% Authentic</strong>, <strong className="text-zinc-200">Fast Delivery</strong>, <strong className="text-emerald-300">Cash on Delivery</strong>, <strong className="text-[#25d366]">Chat On (WhatsApp Live)</strong>, rules, and sub-nav tabs.
                </p>
              </div>

              {/* LIVE REAL-TIME PREVIEW OF THE HEADER TOP BAR */}
              <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Eye className="w-3.5 h-3.5" /> Live Preview of Top Header
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500">Updates Instantly</span>
                </div>
                
                <div className="bg-[#060807] border border-white/10 rounded-xl p-2.5 text-xs text-white overflow-x-auto shadow-inner">
                  {navSettings.showTopAnnouncementBar !== false ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex flex-wrap items-center gap-2">
                        {navSettings.showAuthenticBadge !== false && (
                          <span className="inline-flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 text-orange-300 font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3 text-orange-400" />
                            {navSettings.authenticBadgeText || '100% AUTHENTIC THAI KITS'}
                          </span>
                        )}
                        {navSettings.showFastDelivery !== false && (
                          <span className="text-zinc-300 text-[10px] truncate max-w-xs">
                            {navSettings.fastDeliveryText || 'Fast Doorstep Courier to All 64 Districts in Bangladesh • Cash on Delivery & Mobile Banking Available'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {navSettings.showRulesShortcut !== false && (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {navSettings.rulesShortcutText || 'Ordering Rules (৩টি নিয়ম)'}
                          </span>
                        )}
                        {navSettings.showPaymentShortcut !== false && (
                          <span className="text-[10px] text-zinc-400">
                            {navSettings.paymentShortcutText || 'Payment Methods (bKash / Nagad) ↓'}
                          </span>
                        )}
                        {navSettings.showCodBadge !== false && (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">
                            <Truck className="w-2.5 h-2.5" />
                            {navSettings.codBadgeText || 'Cash on Delivery Supported'}
                          </span>
                        )}
                        {navSettings.showChatOn !== false && (
                          <span className="inline-flex items-center gap-1 bg-[#25d366]/15 border border-[#25d366]/40 text-[#25d366] px-2 py-0.5 rounded text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                            {navSettings.chatOnLabel || 'Chat On'}: {hotline || '01402580064'}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-zinc-500 text-xs italic">
                      Top Announcement Bar is currently turned OFF.
                    </div>
                  )}
                </div>
              </div>

              {/* Master Top Announcement Bar Switch */}
              <div className="bg-[#141b16] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                      Master Switch: Top Announcement Bar
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Show or hide the very top black utility bar containing the trust guarantees and quick shortcuts.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNavSettings((prev) => ({
                      ...prev,
                      showTopAnnouncementBar: !prev.showTopAnnouncementBar,
                    }))
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    navSettings.showTopAnnouncementBar !== false
                      ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {navSettings.showTopAnnouncementBar !== false ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>ON (Display)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>OFF (Hidden)</span>
                    </>
                  )}
                </button>
              </div>

              {/* SECTION A: INDIVIDUAL TOP UTILITY BAR ITEMS */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Top Utility Bar Badges & Texts</span>
                </h4>

                {/* 1. 100% Authentic Badge */}
                <div className="bg-[#121613] border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                      <span className="text-xs font-bold text-white uppercase">100% Authentic Quality Badge</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNavSettings((prev) => ({
                          ...prev,
                          showAuthenticBadge: !prev.showAuthenticBadge,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        navSettings.showAuthenticBadge !== false
                          ? 'bg-emerald-500 text-black'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {navSettings.showAuthenticBadge !== false ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={navSettings.authenticBadgeText || ''}
                    onChange={(e) =>
                      setNavSettings((prev) => ({ ...prev, authenticBadgeText: e.target.value }))
                    }
                    placeholder="100% AUTHENTIC THAI KITS"
                    className="w-full bg-black/60 border border-white/15 focus:border-orange-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>

                {/* 2. Fast Delivery / Bangladesh Shipping Note */}
                <div className="bg-[#121613] border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span className="text-xs font-bold text-white uppercase">Fast Courier & 64 Districts Note</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNavSettings((prev) => ({
                          ...prev,
                          showFastDelivery: !prev.showFastDelivery,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        navSettings.showFastDelivery !== false
                          ? 'bg-emerald-500 text-black'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {navSettings.showFastDelivery !== false ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={navSettings.fastDeliveryText || ''}
                    onChange={(e) =>
                      setNavSettings((prev) => ({ ...prev, fastDeliveryText: e.target.value }))
                    }
                    placeholder="Fast Doorstep Courier to All 64 Districts in Bangladesh • Cash on Delivery & Mobile Banking Available"
                    className="w-full bg-black/60 border border-white/15 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                {/* 3. Cash on Delivery (COD) Badge */}
                <div className="bg-[#121613] border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white uppercase">Cash on Delivery Supported Badge</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNavSettings((prev) => ({
                          ...prev,
                          showCodBadge: !prev.showCodBadge,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        navSettings.showCodBadge !== false
                          ? 'bg-emerald-500 text-black'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {navSettings.showCodBadge !== false ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={navSettings.codBadgeText || ''}
                    onChange={(e) =>
                      setNavSettings((prev) => ({ ...prev, codBadgeText: e.target.value }))
                    }
                    placeholder="Cash on Delivery Supported"
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                {/* 4. Chat On / WhatsApp Live Status Badge */}
                <div className="bg-[#121613] border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <MessageCircle className="w-4 h-4 text-[#25d366]" />
                      <span className="text-xs font-bold text-white uppercase">Chat On (WhatsApp Live Support) Badge</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNavSettings((prev) => ({
                          ...prev,
                          showChatOn: !prev.showChatOn,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        navSettings.showChatOn !== false
                          ? 'bg-emerald-500 text-black'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {navSettings.showChatOn !== false ? 'Visible' : 'Hidden'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">Badge Prefix Label</label>
                      <input
                        type="text"
                        value={navSettings.chatOnLabel || ''}
                        onChange={(e) =>
                          setNavSettings((prev) => ({ ...prev, chatOnLabel: e.target.value }))
                        }
                        placeholder="Chat On"
                        className="w-full bg-black/60 border border-white/15 focus:border-[#25d366] rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">Status Text (Optional)</label>
                      <input
                        type="text"
                        value={navSettings.chatOnStatusText || ''}
                        onChange={(e) =>
                          setNavSettings((prev) => ({ ...prev, chatOnStatusText: e.target.value }))
                        }
                        placeholder="Online 24/7"
                        className="w-full bg-black/60 border border-white/15 focus:border-[#25d366] rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Ordering Rules & Payment Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#121613] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-white uppercase">Ordering Rules Link</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNavSettings((prev) => ({
                            ...prev,
                            showRulesShortcut: !prev.showRulesShortcut,
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          navSettings.showRulesShortcut !== false
                            ? 'bg-emerald-500 text-black'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {navSettings.showRulesShortcut !== false ? 'On' : 'Off'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={navSettings.rulesShortcutText || ''}
                      onChange={(e) =>
                        setNavSettings((prev) => ({ ...prev, rulesShortcutText: e.target.value }))
                      }
                      placeholder="Ordering Rules (৩টি নিয়ম)"
                      className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="bg-[#121613] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-white uppercase">Payment Link Shortcut</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNavSettings((prev) => ({
                            ...prev,
                            showPaymentShortcut: !prev.showPaymentShortcut,
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          navSettings.showPaymentShortcut !== false
                            ? 'bg-emerald-500 text-black'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {navSettings.showPaymentShortcut !== false ? 'On' : 'Off'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={navSettings.paymentShortcutText || ''}
                      onChange={(e) =>
                        setNavSettings((prev) => ({ ...prev, paymentShortcutText: e.target.value }))
                      }
                      placeholder="Payment Methods (bKash / Nagad) ↓"
                      className="w-full bg-black/60 border border-white/15 focus:border-orange-500 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: MAIN HEADER ACTION BUTTONS */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                  <Bot className="w-4 h-4 text-teal-400" />
                  <span>Main Header Action Buttons</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* AI Voice Assistant Button */}
                  <div className="bg-[#121613] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-teal-400" />
                        <span className="text-xs font-bold text-white uppercase">AI Voice Button</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setNavSettings((prev) => ({
                            ...prev,
                            showAiVoiceButton: !prev.showAiVoiceButton,
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          navSettings.showAiVoiceButton !== false
                            ? 'bg-emerald-500 text-black'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {navSettings.showAiVoiceButton !== false ? 'On' : 'Off'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={navSettings.aiVoiceButtonText || ''}
                      onChange={(e) =>
                        setNavSettings((prev) => ({ ...prev, aiVoiceButtonText: e.target.value }))
                      }
                      placeholder="AI Voice"
                      className="w-full bg-black/60 border border-white/15 focus:border-teal-500 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>

                  {/* Track Order Shortcut Button */}
                  <div className="bg-[#121613] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold text-white uppercase">Track Order Button</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setNavSettings((prev) => ({
                            ...prev,
                            showTrackOrderButton: !prev.showTrackOrderButton,
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          navSettings.showTrackOrderButton !== false
                            ? 'bg-emerald-500 text-black'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {navSettings.showTrackOrderButton !== false ? 'On' : 'Off'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={navSettings.trackOrderButtonText || ''}
                      onChange={(e) =>
                        setNavSettings((prev) => ({ ...prev, trackOrderButtonText: e.target.value }))
                      }
                      placeholder="Track Order"
                      className="w-full bg-black/60 border border-white/15 focus:border-orange-500 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: SUB-NAVIGATION & CATEGORIES BAR */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Categories & Sub-Navigation Bar</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setNavSettings((prev) => ({
                        ...prev,
                        showCategoriesSubNav: !prev.showCategoriesSubNav,
                      }))
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      navSettings.showCategoriesSubNav !== false
                        ? 'bg-emerald-500 text-black'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {navSettings.showCategoriesSubNav !== false ? 'Sub-Nav Enabled' : 'Sub-Nav Hidden'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Flash sale tab */}
                  <div className="bg-[#121613] border border-white/10 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" /> Flash Sale
                      </span>
                      <input
                        type="checkbox"
                        checked={navSettings.showFlashSaleNav !== false}
                        onChange={(e) =>
                          setNavSettings((prev) => ({ ...prev, showFlashSaleNav: e.target.checked }))
                        }
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={navSettings.flashSaleNavText || ''}
                      onChange={(e) =>
                        setNavSettings((prev) => ({ ...prev, flashSaleNavText: e.target.value }))
                      }
                      placeholder="⚡ Flash Sale"
                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    />
                  </div>

                  {/* Club jersey tab */}
                  <div className="bg-[#121613] border border-white/10 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-200">⚽ Club Jersey</span>
                      <input
                        type="checkbox"
                        checked={navSettings.showClubJerseyNav !== false}
                        onChange={(e) =>
                          setNavSettings((prev) => ({ ...prev, showClubJerseyNav: e.target.checked }))
                        }
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={navSettings.clubJerseyNavText || ''}
                      onChange={(e) =>
                        setNavSettings((prev) => ({ ...prev, clubJerseyNavText: e.target.value }))
                      }
                      placeholder="⚽ Club Jersey"
                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    />
                  </div>

                  {/* South America tab */}
                  <div className="bg-[#121613] border border-white/10 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-200">🇧🇷 🇦🇷 South America</span>
                      <input
                        type="checkbox"
                        checked={navSettings.showSouthAmericaNav !== false}
                        onChange={(e) =>
                          setNavSettings((prev) => ({ ...prev, showSouthAmericaNav: e.target.checked }))
                        }
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={navSettings.southAmericaNavText || ''}
                      onChange={(e) =>
                        setNavSettings((prev) => ({ ...prev, southAmericaNavText: e.target.value }))
                      }
                      placeholder="🇧🇷 🇦🇷 South America"
                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    />
                  </div>

                  {/* Europe tab */}
                  <div className="bg-[#121613] border border-white/10 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-200">🇵🇹 🇫🇷 Europe</span>
                      <input
                        type="checkbox"
                        checked={navSettings.showEuropeNav !== false}
                        onChange={(e) =>
                          setNavSettings((prev) => ({ ...prev, showEuropeNav: e.target.checked }))
                        }
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={navSettings.europeNavText || ''}
                      onChange={(e) =>
                        setNavSettings((prev) => ({ ...prev, europeNavText: e.target.value }))
                      }
                      placeholder="🇵🇹 🇫🇷 🇩🇪 Europe"
                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    />
                  </div>

                  {/* Asia tab */}
                  <div className="bg-[#121613] border border-white/10 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-200">🇧🇩 🇯🇵 Asia</span>
                      <input
                        type="checkbox"
                        checked={navSettings.showAsiaNav !== false}
                        onChange={(e) =>
                          setNavSettings((prev) => ({ ...prev, showAsiaNav: e.target.checked }))
                        }
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={navSettings.asiaNavText || ''}
                      onChange={(e) =>
                        setNavSettings((prev) => ({ ...prev, asiaNavText: e.target.value }))
                      }
                      placeholder="🇧🇩 🇯🇵 Asia"
                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    />
                  </div>

                  {/* Mirpur Hub Dispatch badge */}
                  <div className="bg-[#121613] border border-white/10 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400">🚚 Hub Badge</span>
                      <input
                        type="checkbox"
                        checked={navSettings.showHubLocationBadge !== false}
                        onChange={(e) =>
                          setNavSettings((prev) => ({ ...prev, showHubLocationBadge: e.target.checked }))
                        }
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={navSettings.hubLocationBadgeText || ''}
                      onChange={(e) =>
                        setNavSettings((prev) => ({ ...prev, hubLocationBadgeText: e.target.value }))
                      }
                      placeholder="Mirpur Hub Dispatch"
                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PRODUCT DISPLAY SETTINGS & VALUE PILLARS */}
          {/* ========================================================================= */}
          {activeTab === 'productDisplay' && (
            <div className="space-y-6">
              {/* Master Toggle */}
              <div className="bg-[#141b16] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                      Show Product Display & Value Pillars Bar
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Display the 100% Authentic, 24/7 Fast Courier, COD, Mobile Banking, and Size Exchange trust bar.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setProdDisplay((prev) => ({ ...prev, showPerksBar: !prev.showPerksBar }))
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    prodDisplay.showPerksBar !== false
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {prodDisplay.showPerksBar !== false ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>ON (Visible)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>OFF (Hidden)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Pillar 1: 100% Authentic */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pillar 1: 100% Authentic Quality Guarantee</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-zinc-300 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodDisplay.showAuthenticity !== false}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, showAuthenticity: e.target.checked }))
                      }
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <span>Display Badge</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={prodDisplay.authenticityText || '100% Authentic Quality'}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, authenticityText: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={prodDisplay.authenticityDesc || 'Thai Premium match fabric & official double-knit mesh.'}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, authenticityDesc: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Pillar 2: Fast Doorstep Courier 24/7 */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs uppercase">
                    <Truck className="w-4 h-4" />
                    <span>Pillar 2: Fast Doorstep Courier 24/7</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-zinc-300 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodDisplay.showFastCourier !== false}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, showFastCourier: e.target.checked }))
                      }
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <span>Display Badge</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={prodDisplay.fastCourierText || 'Fast Doorstep Courier 24/7'}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, fastCourierText: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={prodDisplay.fastCourierDesc || 'Fast 24-72 hours courier delivery across all 64 districts in Bangladesh.'}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, fastCourierDesc: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Pillar 3: Cash on Delivery Available */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs uppercase">
                    <Banknote className="w-4 h-4" />
                    <span>Pillar 3: Cash on Delivery Available</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-zinc-300 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodDisplay.showCashOnDelivery !== false}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, showCashOnDelivery: e.target.checked }))
                      }
                      className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                    />
                    <span>Display Badge</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={prodDisplay.cashOnDeliveryText || 'Cash on Delivery Available'}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, cashOnDeliveryText: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={prodDisplay.cashOnDeliveryDesc || 'Pay safely with cash when your parcel arrives right at your doorstep.'}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, cashOnDeliveryDesc: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Pillar 4: Mobile Banking Available */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5 text-pink-400 font-bold text-xs uppercase">
                    <Smartphone className="w-4 h-4" />
                    <span>Pillar 4: Mobile Banking (bKash / Nagad)</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-zinc-300 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodDisplay.showMobileBanking !== false}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, showMobileBanking: e.target.checked }))
                      }
                      className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
                    />
                    <span>Display Badge</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={prodDisplay.mobileBankingText || 'Mobile Banking Available'}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, mobileBankingText: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={prodDisplay.mobileBankingDesc || 'Verified bKash & Nagad personal merchant wallets with instant TrxID confirmation.'}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, mobileBankingDesc: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Pillar 5: Easy Exchange */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5 text-blue-400 font-bold text-xs uppercase">
                    <RotateCcw className="w-4 h-4" />
                    <span>Pillar 5: 7-Day Easy Size Replacement</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-zinc-300 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodDisplay.showEasyExchange !== false}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, showEasyExchange: e.target.checked }))
                      }
                      className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                    />
                    <span>Display Badge</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={prodDisplay.easyExchangeText || '7-Day Easy Size Replacement'}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, easyExchangeText: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={prodDisplay.easyExchangeDesc || 'Hassle-free exchange guarantee if your jersey sizing needs adjustment.'}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, easyExchangeDesc: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Happy Fans / Customer Satisfaction Rating Toggle */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs uppercase">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>Happy Fans & Customer Satisfaction Rating Badge</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-zinc-300 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodDisplay.showHappyFansRating === true}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, showHappyFansRating: e.target.checked }))
                      }
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <span>{prodDisplay.showHappyFansRating ? 'Shown (ON)' : 'Hidden (OFF)'}</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Rating & Fans Text</label>
                    <input
                      type="text"
                      value={prodDisplay.happyFansRatingText || '4.9 / 5.0 (500+ Happy Fans)'}
                      onChange={(e) =>
                        setProdDisplay((prev) => ({ ...prev, happyFansRatingText: e.target.value }))
                      }
                      placeholder="4.9 / 5.0 (500+ Happy Fans)"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Controls the "500+ Happy Fans / 80% happy family" badge visibility under the official store profile card.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ORDER & PAYMENT CORE RULES */}
          {/* ========================================================================= */}
          {activeTab === 'orderRules' && (
            <div className="space-y-6">
              {/* Master Toggle */}
              <div className="bg-[#141b16] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                      Show Core Ordering & Payment Rules Section
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Displays the 3-step order workflow, payment methods, and Mirpur dispatch location info.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setOrderRules((prev) => ({ ...prev, showRulesCard: !prev.showRulesCard }))
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    orderRules.showRulesCard !== false
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {orderRules.showRulesCard !== false ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>ON (Visible)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>OFF (Hidden)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step 1 Configuration */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-tight block">
                  Step 1: Order Placement Instruction
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Bengali Title</label>
                    <input
                      type="text"
                      value={orderRules.step1TitleBn || '১. প্রথমে অর্ডার প্লেস করুন'}
                      onChange={(e) =>
                        setOrderRules((prev) => ({ ...prev, step1TitleBn: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Bengali Description</label>
                    <input
                      type="text"
                      value={orderRules.step1DescBn || 'পছন্দের জার্সির সাইজ (S/M/L/XL/XXL) ও পরিমাণ সিলেক্ট করে অর্ডার করুন।'}
                      onChange={(e) =>
                        setOrderRules((prev) => ({ ...prev, step1DescBn: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 Configuration */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-tight block">
                  Step 2: Payment & TrxID Collection
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Bengali Title</label>
                    <input
                      type="text"
                      value={orderRules.step2TitleBn || '২. পেমেন্ট ও TrxID সংগ্রহ'}
                      onChange={(e) =>
                        setOrderRules((prev) => ({ ...prev, step2TitleBn: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Bengali Description</label>
                    <input
                      type="text"
                      value={orderRules.step2DescBn || 'বিকাশ বা নগদ নম্বরে Send Money করে Transaction ID (TrxID) সংরক্ষণ করুন।'}
                      onChange={(e) =>
                        setOrderRules((prev) => ({ ...prev, step2DescBn: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3 Configuration */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-3">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-tight block">
                  Step 3: Official Facebook Message
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Bengali Title</label>
                    <input
                      type="text"
                      value={orderRules.step3TitleBn || '৩. ফেসবুক পেজে লিংক সহ মেসেজ'}
                      onChange={(e) =>
                        setOrderRules((prev) => ({ ...prev, step3TitleBn: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Bengali Description</label>
                    <input
                      type="text"
                      value={orderRules.step3DescBn || 'আপনার TrxID, নাম, ফোন নম্বর ও ডেলিভারি ঠিকানা সহ ফেসবুক পেজে মেসেজ করুন।'}
                      onChange={(e) =>
                        setOrderRules((prev) => ({ ...prev, step3DescBn: e.target.value }))
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: WALLETS & QR CODES */}
          {/* ========================================================================= */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* bKash Wallet */}
                <div className="bg-[#1a0f14] border border-pink-500/20 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-pink-400 uppercase tracking-tight flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span>bKash Personal Wallet</span>
                    </h4>
                    <span className="text-[10px] font-mono bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded border border-pink-500/30">
                      Send Money
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">bKash Account Number</label>
                    <input
                      type="text"
                      value={bKash}
                      onChange={(e) => setBKash(e.target.value)}
                      className="w-full bg-black/70 border border-pink-500/30 rounded-xl px-3.5 py-2 text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-2">bKash QR Code</label>
                    <div className="flex items-center gap-4">
                      {bKashQRLocal ? (
                        <div className="relative w-20 h-20 bg-white rounded-xl p-1 border border-pink-500/40">
                          <img src={bKashQRLocal} alt="bKash QR" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => {
                              setBKashQRLocal(null);
                              if (onUpdateQR) onUpdateQR('bKash', null);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white flex items-center justify-center shadow hover:bg-red-500 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-black/50 border border-dashed border-pink-500/40 rounded-xl flex flex-col items-center justify-center text-pink-400">
                          <QrCode className="w-6 h-6 mb-1" />
                          <span className="text-[9px] text-zinc-400">Auto QR</span>
                        </div>
                      )}

                      <label className="px-3.5 py-2 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom QR</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleQRUpload(e, 'bKash')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Nagad Wallet */}
                <div className="bg-[#1a130f] border border-orange-500/20 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-orange-400 uppercase tracking-tight flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span>Nagad Personal Wallet</span>
                    </h4>
                    <span className="text-[10px] font-mono bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded border border-orange-500/30">
                      Send Money
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Nagad Account Number</label>
                    <input
                      type="text"
                      value={nagad}
                      onChange={(e) => setNagad(e.target.value)}
                      className="w-full bg-black/70 border border-orange-500/30 rounded-xl px-3.5 py-2 text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-2">Nagad QR Code</label>
                    <div className="flex items-center gap-4">
                      {nagadQRLocal ? (
                        <div className="relative w-20 h-20 bg-white rounded-xl p-1 border border-orange-500/40">
                          <img src={nagadQRLocal} alt="Nagad QR" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => {
                              setNagadQRLocal(null);
                              if (onUpdateQR) onUpdateQR('Nagad', null);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white flex items-center justify-center shadow hover:bg-red-500 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-black/50 border border-dashed border-orange-500/40 rounded-xl flex flex-col items-center justify-center text-orange-400">
                          <QrCode className="w-6 h-6 mb-1" />
                          <span className="text-[9px] text-zinc-400">Auto QR</span>
                        </div>
                      )}

                      <label className="px-3.5 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 text-orange-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom QR</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleQRUpload(e, 'Nagad')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CUSTOMER REVIEWS & RATINGS */}
          {/* ========================================================================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Master Visibility Toggle */}
              <div className="bg-[#141b16] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                      Customer Reviews & Ratings Section
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Show or hide the verified customer review rating cards on the storefront.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowReviews(!showReviews)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    showReviews
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {showReviews ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>ON (Visible)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>OFF (Hidden)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Add / Edit Review Form */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  {editingReviewId ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{editingReviewId ? 'Edit Customer Review' : 'Add New Customer Review'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={newReview.name || ''}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Jersey Purchased</label>
                    <input
                      type="text"
                      value={newReview.jersey || ''}
                      onChange={(e) => setNewReview({ ...newReview, jersey: e.target.value })}
                      placeholder="e.g. Real Madrid Home 24/25"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Location & Size</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newReview.location || ''}
                        onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                        placeholder="Mirpur, Dhaka"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white"
                      />
                      <select
                        value={newReview.size || 'L'}
                        onChange={(e) => setNewReview({ ...newReview, size: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-2 text-xs text-white"
                      >
                        <option value="S">Size S</option>
                        <option value="M">Size M</option>
                        <option value="L">Size L</option>
                        <option value="XL">Size XL</option>
                        <option value="XXL">Size XXL</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">Customer Feedback / Comment</label>
                  <textarea
                    rows={2}
                    value={newReview.comment || ''}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Write the customer's positive review..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-bold">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= (Number(newReview.rating) || 5)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-zinc-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingReviewId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingReviewId(null);
                          setNewReview({
                            name: '',
                            rating: 5,
                            comment: '',
                            jersey: '',
                            location: '',
                            size: 'L',
                          });
                        }}
                        className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-xl hover:bg-zinc-700"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        editingReviewId ? handleUpdateReview(editingReviewId) : handleAddReview()
                      }
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingReviewId ? 'Save Changes' : 'Add Review'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-400 block">Existing Reviews ({reviewsList.length})</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-black/60 border border-white/10 rounded-xl p-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white flex items-center gap-1">
                            {rev.name}
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-300 italic mb-2 line-clamp-2">"{rev.comment}"</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-zinc-500">
                        <span>
                          {rev.jersey} • {rev.size}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => startEditReview(rev)}
                            className="p-1 text-zinc-400 hover:text-emerald-400 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1 text-zinc-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: GOT QUESTIONS? (FAQ) TOGGLE */}
          {/* ========================================================================= */}
          {activeTab === 'gotQuestions' && (
            <div className="space-y-5">
              {/* Master Visibility Toggle */}
              <div className="bg-[#141b16] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                      Show "Got Questions?" (FAQ) Section
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Enable or disable the Frequently Asked Questions accordion block on your website.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setGotQuestionsVisible(!gotQuestionsVisible)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    gotQuestionsVisible
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {gotQuestionsVisible ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>ON (Display)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>OFF (Hidden)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
                  <Info className="w-4 h-4" />
                  <span>FAQ Overview</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  When turned ON, users can click to expand answers for sizing, Cash on Delivery, bKash TrxID verification, and custom name/number printing. When turned OFF, the section is cleanly removed from display.
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 bg-[#0c120e] border-t border-white/10 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            disabled={saving}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
              savedSuccess
                ? 'bg-emerald-400 text-black'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white active:scale-95'
            }`}
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving All Settings...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Store Settings</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
