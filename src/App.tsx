import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  Search, 
  X, 
  PlusCircle, 
  MapPin, 
  Sparkles, 
  Star, 
  Shirt, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Flame, 
  Package, 
  ArrowRight, 
  HelpCircle, 
  ArrowUpDown, 
  MessageSquare, 
  Clock, 
  Zap, 
  Tag, 
  Layers, 
  Check, 
  RotateCcw, 
  CreditCard,
  Edit2,
  Percent,
  Sliders,
  AlertCircle,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import JerseyCard from './components/JerseyCard';
import RulesCard from './components/RulesCard';
import OrderForm from './components/OrderForm';
import SecureOrdersPanel from './components/SecureOrdersPanel';
import CartDrawer, { CartItem } from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import BannerEditorModal from './components/BannerEditorModal';
import FlashSaleManagerModal from './components/FlashSaleManagerModal';
import StoreSettingsModal, { SettingsTab } from './components/StoreSettingsModal';
import EcommerceFilterBar, { SortOption } from './components/EcommerceFilterBar';
import EcommercePerksAndReviews from './components/EcommercePerksAndReviews';
import PaymentHubAndFooter from './components/PaymentHubAndFooter';
import { JERSEYS, DEFAULT_BANNER_SLIDES, DEFAULT_CUSTOMER_REVIEWS, DEFAULT_PRODUCT_DISPLAY_SETTINGS, DEFAULT_ORDER_RULES_SETTINGS, DEFAULT_NAVBAR_SETTINGS } from './data';
import { Jersey, Order, VisitorLog, BannerSlide, FlashSaleConfig, CustomerReview, ProductDisplaySettings, OrderRulesSettings, NavbarSettings } from './types';
import VisitorTracker from './components/VisitorTracker';
import BackupPanel from './components/BackupPanel';
import VoiceAgent from './components/VoiceAgent';
import BrandLogo from './components/BrandLogo';
import { compressImageFile } from './utils/imageCompressor';

export default function App() {
  const [bKashNumber, setBKashNumber] = useState('01402580064');
  const [nagadNumber, setNagadNumber] = useState('01402580064');
  const [whatsappNumber, setWhatsappNumber] = useState('01402580064');
  const [supportEmail, setSupportEmail] = useState('support@napis.com');
  const [hotlineNumber, setHotlineNumber] = useState('01402580064');
  const [hubAddress, setHubAddress] = useState('Mirpur, Dhaka - 1216, Bangladesh');
  const [helplineLabel, setHelplineLabel] = useState('HELPLINE');
  const [voiceAgentNumber, setVoiceAgentNumber] = useState('01402580064');
  const [showVoiceAssistant, setShowVoiceAssistant] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nafi_show_voice_assistant');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });
  const [facebookLink, setFacebookLink] = useState('https://www.facebook.com/share/1Bh4gYajWE/');
  const [bKashQR, setBKashQR] = useState<string | null>(null);
  const [nagadQR, setNagadQR] = useState<string | null>(null);
  const [showStoreSettingsModal, setShowStoreSettingsModal] = useState(false);
  const [storeSettingsInitialTab, setStoreSettingsInitialTab] = useState<SettingsTab>('general');
  const [productDisplaySettings, setProductDisplaySettings] = useState<ProductDisplaySettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nafi_product_display_settings');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_PRODUCT_DISPLAY_SETTINGS;
  });
  const [orderRulesSettings, setOrderRulesSettings] = useState<OrderRulesSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nafi_order_rules_settings');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_ORDER_RULES_SETTINGS;
  });
  const [navbarSettings, setNavbarSettings] = useState<NavbarSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nafi_navbar_settings');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_NAVBAR_SETTINGS;
  });
  const [showCustomerReviews, setShowCustomerReviews] = useState<boolean>(true);
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>(DEFAULT_CUSTOMER_REVIEWS);
  const [showGotQuestions, setShowGotQuestions] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [personalOrders, setPersonalOrders] = useState<Order[]>([]);
  const [jerseysList, setJerseysList] = useState<Jersey[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nafi_saved_jerseys');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Could not read locally saved jerseys", e);
      }
    }
    return JERSEYS;
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasFetchedState, setHasFetchedState] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nafi_jersey_is_admin') === 'true';
    }
    return false;
  });

  // Dynamic Banner Slides & Discount Percentages state
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nafi_banner_slides');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_BANNER_SLIDES;
  });
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);
  const [flashSaleDiscountPercent, setFlashSaleDiscountPercent] = useState<number>(0);
  const [showBannerEditorModal, setShowBannerEditorModal] = useState(false);
  const [showFlashManagerModal, setShowFlashManagerModal] = useState(false);
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // Flash Sale configuration state
  const [flashSaleConfig, setFlashSaleConfig] = useState<FlashSaleConfig>({
    enabled: true,
    title: 'Flash Sale',
    subtitle: 'Official Match Player Edition Drop',
    discountPercent: 0,
    showTimer: true,
    endTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    durationHours: 6,
    autoRestart: true,
    showStockProgress: true,
    jerseyIds: ['brazil-2026', 'argentina-2026', 'bangladesh-2026', 'japan-2026'],
  });
  const [showStockProgressGlobal, setShowStockProgressGlobal] = useState<boolean>(true);

  // Cart & Quick View States (Daraz & iHerb standard)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nafi_jersey_cart');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewJersey, setQuickViewJersey] = useState<Jersey | null>(null);

  // Sync Cart with localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nafi_jersey_cart', JSON.stringify(cartItems));
      } catch (e) {
        console.error(e);
      }
    }
  }, [cartItems]);

  // Persist Admin session status in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nafi_jersey_is_admin', isAdmin ? 'true' : 'false');
    }
  }, [isAdmin]);

  // Load personal order history from localStorage on mounting
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('my_orders_history');
        if (stored) {
          setPersonalOrders(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Error reading personal order history from storage", err);
      }
    }
  }, []);

  // Views tracker & logs state
  const [viewsCount, setViewsCount] = useState<number>(147);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('bestmatch');
  const [selectedFilterChip, setSelectedFilterChip] = useState('all');
  const [trackOrderQuery, setTrackOrderQuery] = useState('');

  // Checkout modal state
  const [checkoutJersey, setCheckoutJersey] = useState<Jersey | null>(null);
  const [checkoutSize, setCheckoutSize] = useState('M');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Promotional Banner Carousel Slider state (Daraz home slider)
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance banner slides
  useEffect(() => {
    if (!bannerSlides || bannerSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  // Flash Sale Countdown Timer (Calculated from flashSaleConfig.endTime with perpetual auto-renewal so deals NEVER disappear)
  const [countdown, setCountdown] = useState({ hours: 5, minutes: 59, seconds: 59, isEnded: false });
  useEffect(() => {
    const updateCountdown = () => {
      let targetTime = flashSaleConfig?.endTime ? new Date(flashSaleConfig.endTime).getTime() : 0;
      const now = Date.now();
      
      // If time has passed or not set, keep smooth perpetual rolling timer active
      if (!targetTime || targetTime <= now) {
        const cycleHours = flashSaleConfig?.durationHours || 6;
        targetTime = now + cycleHours * 3600 * 1000;
      }

      const diff = Math.max(0, targetTime - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ hours, minutes, seconds, isEnded: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [flashSaleConfig?.endTime, flashSaleConfig?.durationHours]);

  // Admin Panels state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJersey, setEditingJersey] = useState<Jersey | null>(null);
  
  // Admin Form state
  const [formCountry, setFormCountry] = useState('');
  const [formName, setFormName] = useState('');
  const [formRegion, setFormRegion] = useState<'Club' | 'Americas' | 'Europe' | 'Asia' | 'Africa' | 'Special'>('Club');
  const [formCategory, setFormCategory] = useState<string>('Club Jersey');
  const [formJerseyType, setFormJerseyType] = useState<string>('Player Edition');
  const [formLeague, setFormLeague] = useState<string>('La Liga');
  const [formOriginalPriceBDT, setFormOriginalPriceBDT] = useState<number>(1350);
  const [formDiscountPercent, setFormDiscountPercent] = useState<number>(0);
  const [formPriceBDT, setFormPriceBDT] = useState<number>(1350);
  const [formSoldCount, setFormSoldCount] = useState<number>(12);
  const [formStockLeft, setFormStockLeft] = useState<number>(8);
  const [formShowStockProgress, setFormShowStockProgress] = useState<boolean>(true);
  const [formShowSoldCount, setFormShowSoldCount] = useState<boolean>(true);
  const [formRating, setFormRating] = useState<number>(5.0);
  const [formShowRating, setFormShowRating] = useState<boolean>(true);
  const [formReviewsCount, setFormReviewsCount] = useState<number>(142);
  const [formFreeDelivery, setFormFreeDelivery] = useState<boolean>(true);
  const [formShowCoins, setFormShowCoins] = useState<boolean>(true);
  const [formCoinsReward, setFormCoinsReward] = useState<number>(20);
  const [formTagText, setFormTagText] = useState<string>('PREMIUM THAI');
  const [formShowTag, setFormShowTag] = useState<boolean>(true);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formBadgeColor, setFormBadgeColor] = useState('bg-indigo-600 text-white');
  const [formAccentColor, setFormAccentColor] = useState('text-indigo-400');
  const [formBgGradient, setFormBgGradient] = useState('from-indigo-650/10 via-zinc-850/5 to-slate-950');

  // Automatic calculation helper when user changes discount percentage or base price in modal
  const updateFormPrices = (origPrice: number, discountPct: number) => {
    setFormOriginalPriceBDT(origPrice);
    setFormDiscountPercent(discountPct);
    const computed = discountPct > 0 
      ? Math.round(origPrice * (1 - discountPct / 100))
      : origPrice;
    setFormPriceBDT(computed);
  };

  // Region lookup
  const getJerseyRegion = (item: Jersey | string) => {
    if (typeof item !== 'string' && item.region) {
      return item.region;
    }
    const country = typeof item === 'string' ? item : (item.country || '');
    const name = typeof item === 'string' ? '' : (item.name || '');
    const c = `${country} ${name}`.toLowerCase();
    if (
      c === 'club' ||
      c.includes('club') ||
      ['real madrid', 'barcelona', 'manchester city', 'manchester united', 'man city', 'man utd', 'arsenal', 'liverpool', 'chelsea', 'psg', 'paris', 'bayern', 'inter miami', 'ac milan', 'inter milan', 'juventus', 'al nassr', 'al hilal', 'dortmund', 'tottenham', 'atletico', 'napoli', 'roma', 'ajax', 'aston villa', 'newcastle', 'leverkusen', 'sporting', 'benfica', 'porto'].some(club => c.includes(club))
    ) {
      return 'Club';
    }
    if (c.includes('brazil') || c.includes('argentina') || c.includes('uruguay') || c.includes('colombia') || c.includes('usa') || c.includes('canada') || c.includes('mexico')) return 'Americas';
    if (c.includes('bangladesh') || c.includes('japan') || c.includes('india') || c.includes('saudi arabia') || c.includes('south korea')) return 'Asia';
    if (c.includes('nigeria') || c.includes('morocco') || c.includes('senegal') || c.includes('ghana') || c.includes('egypt')) return 'Africa';
    return 'Europe';
  };

  const filteredJerseys = jerseysList.filter((jersey) => {
    const matchesSearch =
      jersey.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jersey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jersey.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (jersey.tagText && jersey.tagText.toLowerCase().includes(searchQuery.toLowerCase()));

    const region = jersey.region || getJerseyRegion(jersey);
    const isClubJersey =
      region === 'Club' ||
      jersey.category === 'Club Jersey' ||
      jersey.country.toLowerCase().includes('club') ||
      ['real madrid', 'barcelona', 'manchester city', 'manchester united', 'man city', 'man utd', 'arsenal', 'liverpool', 'chelsea', 'psg', 'paris', 'bayern', 'inter miami', 'ac milan', 'inter milan', 'juventus', 'al nassr', 'al hilal', 'dortmund', 'tottenham', 'atletico', 'napoli', 'roma', 'ajax', 'aston villa', 'newcastle', 'leverkusen', 'sporting', 'benfica', 'porto'].some(club => 
        jersey.name.toLowerCase().includes(club) || 
        jersey.country.toLowerCase().includes(club) || 
        jersey.description.toLowerCase().includes(club) ||
        (jersey.tagText && jersey.tagText.toLowerCase().includes(club))
      );

    const matchesRegion =
      selectedRegion === 'All' ||
      (selectedRegion === 'Club' || selectedRegion === 'Club Jersey' ? isClubJersey : region === selectedRegion);

    // Filter Chips logic (Daraz E-Commerce)
    let matchesChip = true;
    if (selectedFilterChip === 'voucher-max') {
      matchesChip = (jersey.discountPercent !== undefined && jersey.discountPercent > 0) || globalDiscountPercent > 0;
    } else if (selectedFilterChip === 'new-arrival') {
      matchesChip = (jersey.rating || 5.0) >= 4.8;
    } else if (selectedFilterChip === 'club-jersey' || selectedFilterChip === 'clubs') {
      matchesChip = isClubJersey;
    } else if (selectedFilterChip === 'free-delivery') {
      matchesChip = jersey.freeDelivery !== false || jersey.priceBDT >= 650;
    } else if (selectedFilterChip === 'best-price') {
      matchesChip = jersey.priceBDT <= 850 || (jersey.discountPercent !== undefined && jersey.discountPercent >= 20);
    } else if (selectedFilterChip === 'kids') {
      matchesChip = jersey.name.toLowerCase().includes('kids') || jersey.description.toLowerCase().includes('kids') || (jersey.tagText && jersey.tagText.toLowerCase().includes('kids'));
    } else if (selectedFilterChip === 'national') {
      matchesChip = !isClubJersey && ['brazil', 'argentina', 'bangladesh', 'portugal', 'spain', 'germany', 'france', 'japan', 'italy', 'england'].some(nat => 
        jersey.country.toLowerCase().includes(nat) || jersey.name.toLowerCase().includes(nat)
      );
    }

    return matchesSearch && matchesRegion && matchesChip;
  });

  const sortedJerseys = [...filteredJerseys].sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceBDT - b.priceBDT;
    if (sortBy === 'price-desc') return b.priceBDT - a.priceBDT;
    if (sortBy === 'sale') {
      const discA = a.discountPercent || globalDiscountPercent || 0;
      const discB = b.discountPercent || globalDiscountPercent || 0;
      return discB - discA;
    }
    if (sortBy === 'rating') return (b.rating || 5.0) - (a.rating || 5.0);
    return 0; // bestmatch / featured default
  });

  // Track Order lookup
  const matchedOrders = trackOrderQuery.trim()
    ? [...personalOrders, ...orders].filter(o => 
        o.id.toLowerCase().includes(trackOrderQuery.trim().toLowerCase()) ||
        o.customerPhone.includes(trackOrderQuery.trim()) ||
        o.transactionId.toLowerCase().includes(trackOrderQuery.trim().toLowerCase())
      )
    : [];

  // Cart Handlers
  const handleAddToCart = (jersey: Jersey, size: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.jersey.id === jersey.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.jersey.id === jersey.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { jersey, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (jerseyId: string, size: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.jersey.id === jerseyId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (jerseyId: string, size: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.jersey.id === jerseyId && item.size === size)));
  };

  const handleCheckoutFromCart = () => {
    if (cartItems.length > 0) {
      setCheckoutJersey(cartItems[0].jersey);
      setCheckoutSize(cartItems[0].size);
      setShowCheckoutModal(true);
    }
  };

  const cartTotalBDT = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.jersey.priceBDT * item.quantity, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Seed / Sync of initial statistics & settings with the persistent Cloud backend server
  const fetchGlobalState = async () => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (isAdmin) {
        headers['x-admin-passcode'] = 'admin2026';
      }
      const response = await fetch('/api/config', {
        headers
      });
      if (response.ok) {
        const data = await response.json();
        setBKashNumber(data.bKashNumber);
        setNagadNumber(data.nagadNumber);
        if (data.whatsappNumber !== undefined) setWhatsappNumber(data.whatsappNumber || '01402580064');
        if (data.showVoiceAssistant !== undefined) {
          setShowVoiceAssistant(Boolean(data.showVoiceAssistant));
          try {
            localStorage.setItem('nafi_show_voice_assistant', String(data.showVoiceAssistant));
          } catch (e) {}
        }
        if (data.supportEmail !== undefined) setSupportEmail(data.supportEmail || 'support@napis.com');
        if (data.hotlineNumber !== undefined) setHotlineNumber(data.hotlineNumber || '01402580064');
        if (data.hubAddress !== undefined) setHubAddress(data.hubAddress || 'Mirpur, Dhaka - 1216, Bangladesh');
        if (data.helplineLabel !== undefined) setHelplineLabel(data.helplineLabel || 'HELPLINE');
        if (data.voiceAgentNumber !== undefined) setVoiceAgentNumber(data.voiceAgentNumber || '01402580064');
        if (data.facebookLink !== undefined) setFacebookLink(data.facebookLink || 'https://www.facebook.com/share/1Bh4gYajWE/');
        if (data.bKashQR !== undefined) setBKashQR(data.bKashQR);
        if (data.nagadQR !== undefined) setNagadQR(data.nagadQR);
        if (data.webhookUrl !== undefined) setWebhookUrl(data.webhookUrl);
        if (data.bannerSlides && Array.isArray(data.bannerSlides) && data.bannerSlides.length > 0) {
          setBannerSlides(data.bannerSlides);
        }
        if (data.globalDiscountPercent !== undefined) {
          setGlobalDiscountPercent(Number(data.globalDiscountPercent));
        }
        if (data.flashSaleDiscountPercent !== undefined) {
          setFlashSaleDiscountPercent(Number(data.flashSaleDiscountPercent));
        }
        if (data.flashSaleConfig) {
          setFlashSaleConfig(data.flashSaleConfig);
        }
        if (data.showStockProgressGlobal !== undefined) {
          setShowStockProgressGlobal(Boolean(data.showStockProgressGlobal));
        }
        if (data.showCustomerReviews !== undefined) {
          setShowCustomerReviews(Boolean(data.showCustomerReviews));
        }
        if (data.showGotQuestions !== undefined) {
          setShowGotQuestions(Boolean(data.showGotQuestions));
        }
        if (data.customerReviews && Array.isArray(data.customerReviews)) {
          setCustomerReviews(data.customerReviews);
        }
        if (data.productDisplaySettings) {
          setProductDisplaySettings(data.productDisplaySettings);
          try {
            localStorage.setItem('nafi_product_display_settings', JSON.stringify(data.productDisplaySettings));
          } catch (e) {}
        }
        if (data.orderRulesSettings) {
          setOrderRulesSettings(data.orderRulesSettings);
          try {
            localStorage.setItem('nafi_order_rules_settings', JSON.stringify(data.orderRulesSettings));
          } catch (e) {}
        }
        if (data.navbarSettings) {
          setNavbarSettings(data.navbarSettings);
          try {
            localStorage.setItem('nafi_navbar_settings', JSON.stringify(data.navbarSettings));
          } catch (e) {}
        }
        if (data.jerseys && Array.isArray(data.jerseys) && data.jerseys.length > 0) {
          setJerseysList(data.jerseys);
          try {
            localStorage.setItem('nafi_saved_jerseys', JSON.stringify(data.jerseys));
          } catch (e) {}
        }
        setOrders(data.orders || []);
        setViewsCount(data.viewsCount || 0);
        setHasFetchedState(true);
      }
    } catch (e) {
      console.log('Using local client store defaults', e);
      setHasFetchedState(true);
    }
  };

  // Keep local storage in sync whenever jerseysList changes
  useEffect(() => {
    if (jerseysList && jerseysList.length > 0) {
      try {
        localStorage.setItem('nafi_saved_jerseys', JSON.stringify(jerseysList));
      } catch (e) {}
    }
  }, [jerseysList]);

  const handleSaveBannerSlides = async (newSlides: BannerSlide[]) => {
    setBannerSlides(newSlides);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nafi_banner_slides', JSON.stringify(newSlides));
      } catch (e) {
        console.error("Local storage banner save:", e);
      }
    }
    try {
      await fetch('/api/banner-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify({ slides: newSlides }),
      });
    } catch (err) {
      console.error('Failed to sync banner slides', err);
    }
  };

  const handleSaveGlobalDiscount = async (percent: number) => {
    setGlobalDiscountPercent(percent);
    try {
      await fetch('/api/config/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify({ globalDiscountPercent: percent }),
      });
    } catch (err) {
      console.error('Failed to sync global discount', err);
    }
  };

  const handleSaveFlashSaleDiscount = async (percent: number) => {
    setFlashSaleDiscountPercent(percent);
    try {
      await fetch('/api/config/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify({ flashSaleDiscountPercent: percent }),
      });
    } catch (err) {
      console.error('Failed to sync flash discount', err);
    }
  };

  const handleSaveFlashSaleConfig = async (config: FlashSaleConfig) => {
    setFlashSaleConfig(config);
    setFlashSaleDiscountPercent(config.discountPercent);
    if (config.showStockProgress !== undefined) {
      setShowStockProgressGlobal(config.showStockProgress);
    }
    try {
      await fetch('/api/config/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify({
          flashSaleConfig: config,
          flashSaleDiscountPercent: config.discountPercent,
          showStockProgressGlobal: config.showStockProgress,
        }),
      });
    } catch (err) {
      console.error('Failed to sync flash sale config', err);
    }
  };

  const handleSaveStockProgressGlobal = async (show: boolean) => {
    setShowStockProgressGlobal(show);
    try {
      await fetch('/api/config/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify({ showStockProgressGlobal: show }),
      });
    } catch (err) {
      console.error('Failed to sync stock progress setting', err);
    }
  };

  useEffect(() => {
    fetchGlobalState();

    // Periodic auto-sync polling every 15 seconds so changes from any device appear everywhere automatically
    const interval = setInterval(() => {
      fetchGlobalState();
    }, 15000);

    // Sync on tab focus / visibility change
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchGlobalState();
      }
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', fetchGlobalState);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', fetchGlobalState);
    };
  }, [isAdmin]);

  // Smooth scroll
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBuyNowTrigger = (jersey: Jersey, size: string) => {
    setCheckoutJersey(jersey);
    setCheckoutSize(size);
    setShowCheckoutModal(true);
  };

  const handleCreateOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setPersonalOrders((prev) => [newOrder, ...prev]);
    setShowCheckoutModal(false);

    // Save to local storage
    if (typeof window !== 'undefined') {
      try {
        const currentStored = localStorage.getItem('my_orders_history');
        const parsed = currentStored ? JSON.parse(currentStored) : [];
        localStorage.setItem('my_orders_history', JSON.stringify([newOrder, ...parsed]));
      } catch (err) {
        console.error("Failed to store order in local history", err);
      }
    }

    // Clear cart if this item was in cart
    if (checkoutJersey) {
      setCartItems((prev) => prev.filter(i => !(i.jersey.id === checkoutJersey.id && i.size === checkoutSize)));
    }

    // Sync order to backend
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch(err => console.error("Error broadcasting new order", err));
  };

  const handleUpdateBKashNumber = (newNum: string) => {
    setBKashNumber(newNum);
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
      body: JSON.stringify({ bKashNumber: newNum }),
    }).catch(err => console.error(err));
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await fetchGlobalState();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRestoreState = async (importedState: any): Promise<boolean> => {
    try {
      if (importedState.bKashNumber) setBKashNumber(importedState.bKashNumber);
      if (importedState.nagadNumber) setNagadNumber(importedState.nagadNumber);
      if (importedState.whatsappNumber) setWhatsappNumber(importedState.whatsappNumber);
      if (importedState.bKashQR !== undefined) setBKashQR(importedState.bKashQR);
      if (importedState.nagadQR !== undefined) setNagadQR(importedState.nagadQR);
      if (importedState.webhookUrl !== undefined) setWebhookUrl(importedState.webhookUrl);
      if (importedState.jerseys && Array.isArray(importedState.jerseys)) {
        setJerseysList(importedState.jerseys);
      }

      // Sync with server
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify({
          bKashNumber: importedState.bKashNumber || bKashNumber,
          nagadNumber: importedState.nagadNumber || nagadNumber,
          whatsappNumber: importedState.whatsappNumber || whatsappNumber,
          bKashQR: importedState.bKashQR ?? bKashQR,
          nagadQR: importedState.nagadQR ?? nagadQR,
          webhookUrl: importedState.webhookUrl ?? webhookUrl,
          jerseys: importedState.jerseys || jerseysList,
        }),
      });
      return true;
    } catch (e) {
      console.error('Failed to restore backup state:', e);
      return false;
    }
  };

  const handleUpdateNagadNumber = (newNum: string) => {
    setNagadNumber(newNum);
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
      body: JSON.stringify({ nagadNumber: newNum }),
    }).catch(err => console.error(err));
  };

  const handleUpdateWhatsappNumber = (newNum: string) => {
    setWhatsappNumber(newNum);
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
      body: JSON.stringify({ whatsappNumber: newNum }),
    }).catch(err => console.error(err));
  };

  const handleUpdateBKashQR = (newQR: string | null) => {
    setBKashQR(newQR);
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
      body: JSON.stringify({ bKashQR: newQR }),
    }).catch(err => console.error(err));
  };

  const handleUpdateNagadQR = (newQR: string | null) => {
    setNagadQR(newQR);
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
      body: JSON.stringify({ nagadQR: newQR }),
    }).catch(err => console.error(err));
  };

  const handleUpdateWebhookUrl = (newUrl: string | null) => {
    setWebhookUrl(newUrl);
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
      body: JSON.stringify({ webhookUrl: newUrl }),
    }).catch(err => console.error(err));
  };

  const handleToggleReviewsVisibility = async (visible: boolean) => {
    setShowCustomerReviews(visible);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify({ showCustomerReviews: visible }),
      });
    } catch (err) {
      console.error('Failed to update reviews visibility', err);
    }
  };

  const handleToggleGotQuestionsVisibility = async (visible: boolean) => {
    setShowGotQuestions(visible);
    try {
      await fetch('/api/got-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify({ showGotQuestions: visible }),
      });
    } catch (err) {
      console.error('Failed to update got questions visibility', err);
    }
  };

  const handleToggleProductDisplay = async (updated: Partial<ProductDisplaySettings>) => {
    const merged = { ...productDisplaySettings, ...updated };
    setProductDisplaySettings(merged);
    try {
      localStorage.setItem('nafi_product_display_settings', JSON.stringify(merged));
    } catch (e) {}
    try {
      await fetch('/api/product-display', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify({ productDisplaySettings: merged }),
      });
    } catch (err) {
      console.error('Failed to sync product display settings', err);
    }
  };

  const handleToggleOrderRules = async (updated: Partial<OrderRulesSettings>) => {
    const merged = { ...orderRulesSettings, ...updated };
    setOrderRulesSettings(merged);
    try {
      localStorage.setItem('nafi_order_rules_settings', JSON.stringify(merged));
    } catch (e) {}
    try {
      await fetch('/api/order-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify({ orderRulesSettings: merged }),
      });
    } catch (err) {
      console.error('Failed to sync order rules settings', err);
    }
  };

  const handleSaveStoreSettings = async (settings: {
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
  }): Promise<boolean> => {
    setBKashNumber(settings.bKashNumber);
    setNagadNumber(settings.nagadNumber);
    setSupportEmail(settings.supportEmail);
    setHotlineNumber(settings.hotlineNumber);
    setHubAddress(settings.hubAddress);
    setWhatsappNumber(settings.whatsappNumber);
    if (settings.helplineLabel !== undefined) setHelplineLabel(settings.helplineLabel);
    if (settings.voiceAgentNumber !== undefined) setVoiceAgentNumber(settings.voiceAgentNumber);
    if (settings.showVoiceAssistant !== undefined) {
      setShowVoiceAssistant(settings.showVoiceAssistant);
      try {
        localStorage.setItem('nafi_show_voice_assistant', String(settings.showVoiceAssistant));
      } catch (e) {}
    }
    if (settings.facebookLink !== undefined) setFacebookLink(settings.facebookLink);
    if (settings.bKashQR !== undefined) setBKashQR(settings.bKashQR);
    if (settings.nagadQR !== undefined) setNagadQR(settings.nagadQR);
    if (settings.showCustomerReviews !== undefined) setShowCustomerReviews(settings.showCustomerReviews);
    if (settings.customerReviews !== undefined) setCustomerReviews(settings.customerReviews);
    if (settings.showGotQuestions !== undefined) setShowGotQuestions(settings.showGotQuestions);
    if (settings.productDisplaySettings !== undefined) {
      setProductDisplaySettings(settings.productDisplaySettings);
      try {
        localStorage.setItem('nafi_product_display_settings', JSON.stringify(settings.productDisplaySettings));
      } catch (e) {}
    }
    if (settings.orderRulesSettings !== undefined) {
      setOrderRulesSettings(settings.orderRulesSettings);
      try {
        localStorage.setItem('nafi_order_rules_settings', JSON.stringify(settings.orderRulesSettings));
      } catch (e) {}
    }
    if (settings.navbarSettings !== undefined) {
      setNavbarSettings(settings.navbarSettings);
      try {
        localStorage.setItem('nafi_navbar_settings', JSON.stringify(settings.navbarSettings));
      } catch (e) {}
    }

    try {
      if (settings.navbarSettings) {
        fetch('/api/navbar-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
          body: JSON.stringify({ navbarSettings: settings.navbarSettings }),
        }).catch(err => console.error(err));
      }
    } catch (e) {}

    try {
      const res = await fetch('/api/config/store-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        throw new Error('Failed to persist store settings');
      }
      return true;
    } catch (err) {
      console.error('Error saving store settings:', err);
      // Fallback
      fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
        body: JSON.stringify(settings),
      }).catch(e => console.error(e));
      return true;
    }
  };

  // Image Upload helper with automatic compression
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1000, 0.82);
        setFormImage(compressed);
      } catch (err) {
        console.warn('Image compression fallback', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Admin: Add New Jersey
  const handleAddJerseySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCountry || !formName) {
      alert('Please fill out Country and Jersey Name');
      return;
    }

    const calculatedSelling = formDiscountPercent > 0
      ? Math.round((formOriginalPriceBDT || 1350) * (1 - formDiscountPercent / 100))
      : (formOriginalPriceBDT || 1350);

    const newJersey: Jersey = {
      id: `${formCountry.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      country: formCountry,
      name: formName,
      region: formRegion,
      category: formCategory,
      jerseyType: formJerseyType,
      league: formLeague,
      originalPriceBDT: formOriginalPriceBDT || 1350,
      discountPercent: formDiscountPercent || 0,
      priceBDT: calculatedSelling,
      priceUSD: Number((calculatedSelling / 115).toFixed(1)),
      soldCount: formSoldCount !== undefined ? formSoldCount : 12,
      stockLeft: formStockLeft !== undefined ? formStockLeft : 8,
      showStockProgress: formShowStockProgress,
      showSoldCount: formShowSoldCount,
      showRating: formShowRating,
      freeDelivery: formFreeDelivery,
      showCoins: formShowCoins,
      coinsReward: formCoinsReward,
      showTag: formShowTag,
      tagText: formTagText,
      image: formImage || '/src/assets/images/input_file_3.png',
      description: formDescription || `Official match player edition jersey for ${formCountry}. Engineered with high-performance breathable fabric.`,
      rating: Number(formRating) || 5.0,
      reviewsCount: Number(formReviewsCount) || Math.floor(80 + Math.random() * 200),
      badgeColor: formBadgeColor,
      accentColor: formAccentColor,
      bgGradient: formBgGradient,
    };

    const updated = [newJersey, ...jerseysList];
    setJerseysList(updated);
    setShowAddModal(false);
    setFormCountry('');
    setFormName('');
    setFormRegion('Club');
    setFormCategory('Club Jersey');
    setFormJerseyType('Player Edition');
    setFormLeague('La Liga');
    setFormImage('');
    setFormDescription('');
    setFormRating(5.0);
    setFormShowRating(true);
    setFormReviewsCount(142);
    setFormFreeDelivery(true);
    setFormShowCoins(true);
    setFormCoinsReward(20);
    setFormShowSoldCount(true);
    setFormShowTag(true);
    setFormTagText('PREMIUM THAI');

    // Sync with server
    fetch('/api/jerseys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
      body: JSON.stringify(newJersey),
    }).catch(err => console.error("Error creating jersey on backend", err));
  };

  // Admin: Open Edit Modal
  const handleOpenEditModalForJersey = (jersey: Jersey) => {
    setEditingJersey(jersey);
    setFormCountry(jersey.country);
    setFormName(jersey.name);
    setFormRegion((jersey.region as any) || (getJerseyRegion(jersey) as any) || 'Club');
    setFormCategory(jersey.category || (jersey.region === 'Club' ? 'Club Jersey' : 'National Team Jersey'));
    setFormJerseyType(jersey.jerseyType || 'Player Edition');
    setFormLeague(jersey.league || '');
    const orig = jersey.originalPriceBDT || (jersey.discountPercent && jersey.discountPercent > 0 ? Math.round(jersey.priceBDT / (1 - jersey.discountPercent / 100)) : jersey.priceBDT);
    const disc = jersey.discountPercent !== undefined ? jersey.discountPercent : 0;
    setFormOriginalPriceBDT(orig);
    setFormDiscountPercent(disc);
    setFormPriceBDT(jersey.priceBDT);
    setFormSoldCount(jersey.soldCount !== undefined ? jersey.soldCount : 12);
    setFormStockLeft(jersey.stockLeft !== undefined ? jersey.stockLeft : 8);
    setFormShowStockProgress(jersey.showStockProgress !== false);
    setFormShowSoldCount(jersey.showSoldCount !== false);
    setFormRating(jersey.rating !== undefined ? jersey.rating : 5.0);
    setFormShowRating(jersey.showRating !== false);
    setFormReviewsCount(jersey.reviewsCount !== undefined ? jersey.reviewsCount : 142);
    setFormFreeDelivery(jersey.freeDelivery !== false);
    setFormShowCoins(jersey.showCoins !== false);
    setFormCoinsReward(jersey.coinsReward !== undefined ? jersey.coinsReward : 20);
    setFormShowTag(jersey.showTag !== false);
    setFormTagText(jersey.tagText || 'PREMIUM THAI');
    setFormDescription(jersey.description);
    setFormImage(jersey.image);
    setFormBadgeColor(jersey.badgeColor || 'bg-emerald-600 text-white');
    setFormAccentColor(jersey.accentColor || 'text-emerald-400');
    setFormBgGradient(jersey.bgGradient || 'from-emerald-600/10 via-zinc-850/5 to-slate-950');
  };

  // Admin: Save Edited Jersey
  const handleEditJerseySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJersey) return;

    const calculatedSelling = formDiscountPercent > 0
      ? Math.round(formOriginalPriceBDT * (1 - formDiscountPercent / 100))
      : formOriginalPriceBDT;

    const updatedJersey: Jersey = {
      ...editingJersey,
      country: formCountry,
      name: formName,
      region: formRegion,
      category: formCategory,
      jerseyType: formJerseyType,
      league: formLeague,
      originalPriceBDT: formOriginalPriceBDT,
      discountPercent: formDiscountPercent,
      priceBDT: calculatedSelling,
      priceUSD: Number((calculatedSelling / 115).toFixed(1)),
      soldCount: formSoldCount,
      stockLeft: formStockLeft,
      showStockProgress: formShowStockProgress,
      showSoldCount: formShowSoldCount,
      showRating: formShowRating,
      freeDelivery: formFreeDelivery,
      showCoins: formShowCoins,
      coinsReward: formCoinsReward,
      showTag: formShowTag,
      tagText: formTagText,
      image: formImage || editingJersey.image,
      description: formDescription,
      rating: Number(formRating) || 5.0,
      reviewsCount: Number(formReviewsCount) || editingJersey.reviewsCount || 142,
      badgeColor: formBadgeColor,
      accentColor: formAccentColor,
      bgGradient: formBgGradient,
    };

    const updated = jerseysList.map((j) => (j.id === editingJersey.id ? updatedJersey : j));
    setJerseysList(updated);
    setEditingJersey(null);
    setFormImage('');

    fetch(`/api/jerseys/${editingJersey.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
      body: JSON.stringify(updatedJersey),
    }).catch(err => console.error("Error updating jersey on backend", err));
  };

  // Admin: Delete Jersey
  const handleDeleteJersey = (id: string) => {
    if (confirm('Are you sure you want to remove this jersey from the store catalog?')) {
      const updated = jerseysList.filter((j) => j.id !== id);
      setJerseysList(updated);

      fetch(`/api/jerseys/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-passcode': 'admin2026' },
      }).catch(err => console.error("Error deleting jersey", err));
    }
  };

  // Flash Sale Items (Selected flash sale jerseys or fallback)
  const flashSaleJerseys: Jersey[] = useMemo(() => {
    if (flashSaleConfig?.jerseyIds && Array.isArray(flashSaleConfig.jerseyIds)) {
      return flashSaleConfig.jerseyIds
        .map((id) => jerseysList.find((j) => j.id === id))
        .filter((j): j is Jersey => Boolean(j));
    }
    return jerseysList.slice(0, 4);
  }, [flashSaleConfig?.jerseyIds, jerseysList]);

  // Remove jersey directly from Flash Sale
  const handleRemoveJerseyFromFlashSale = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentIds = flashSaleConfig?.jerseyIds || flashSaleJerseys.map((j) => j.id);
    const updated = currentIds.filter((itemId) => itemId !== id);
    handleSaveFlashSaleConfig({
      ...flashSaleConfig,
      jerseyIds: updated,
    });
  };

  return (
    <div className="min-h-screen bg-[#090c0a] text-zinc-100 flex flex-col font-sans select-none">
      {/* Mega Header Component (Daraz / iHerb style) */}
      <Header
        bKashNumber={bKashNumber}
        setBKashNumber={handleUpdateBKashNumber}
        nagadNumber={nagadNumber}
        setNagadNumber={handleUpdateNagadNumber}
        whatsappNumber={whatsappNumber}
        setWhatsappNumber={handleUpdateWhatsappNumber}
        helplineLabel={helplineLabel}
        hotlineNumber={hotlineNumber}
        facebookLink={facebookLink}
        cartCount={cartCount}
        cartTotalBDT={cartTotalBDT}
        onOpenCart={() => setIsCartOpen(true)}
        scrollToSection={scrollToSection}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onAddJerseyClick={() => setShowAddModal(true)}
        onOpenBannerEditor={() => setShowBannerEditorModal(true)}
        onOpenStoreSettings={() => setShowStoreSettingsModal(true)}
        onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        navbarSettings={navbarSettings}
        showVoiceAssistant={showVoiceAssistant}
      />

      {/* Main E-Commerce Content Canvas */}
      <main className="flex-1 pb-24 font-sans">

        {/* Store Owner Active Edit Controls Banner */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 border-b border-emerald-500/30 px-4 py-2.5">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="uppercase tracking-wider">Store Owner Mode Active (স্থায়ী এডিট ও অ্যাড মোড চালু)</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowStoreSettingsModal(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg transition-all shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Store & Payment Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow cursor-pointer flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add New Jersey</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowFlashManagerModal(true)}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all shadow cursor-pointer flex items-center gap-1"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Manage Flash Sale</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowBannerEditorModal(true)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Banner & Rates</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('orders-admin')}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Orders ({orders.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* ========================================================================= */}
        {/* TOP VIEW: DARAZ / iHERB 3-COLUMN HERO BANNER & CATEGORY NAVIGATION HUB */}
        {/* ========================================================================= */}
        {(() => {
          const safeSlide = bannerSlides[currentSlide % Math.max(1, bannerSlides.length)] || bannerSlides[0] || DEFAULT_BANNER_SLIDES[0];
          return (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                
                {/* Left Column (3 cols): Category Tree Menu (Daraz style) */}
                <div className="hidden lg:flex lg:col-span-3 bg-[#101411] border border-white/10 rounded-xl p-3.5 flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-white/10 text-xs font-bold text-white uppercase tracking-wider">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>National Categories</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      {[
                        { name: '🇧🇷 Brazil (Gold Edition)', query: 'Brazil', region: 'Americas' },
                        { name: '🇦🇷 Argentina (3-Star)', query: 'Argentina', region: 'Americas' },
                        { name: '🇵🇹 Portugal (Navigator)', query: 'Portugal', region: 'Europe' },
                        { name: '🇫🇷 France (Royal Crest)', query: 'France', region: 'Europe' },
                        { name: '🇩🇪 Germany (Modernist)', query: 'Germany', region: 'Europe' },
                        { name: '🇧🇩 Bangladesh (Gold)', query: 'Bangladesh', region: 'Asia' },
                        { name: '🇯🇵 Japan (Anime Edition)', query: 'Japan', region: 'Asia' },
                        { name: '🇪🇸 Spain (La Roja)', query: 'Spain', region: 'Europe' },
                      ].map((cat) => (
                        <button
                          key={cat.query}
                          type="button"
                          onClick={() => {
                            setSearchQuery(cat.query);
                            setSelectedRegion(cat.region);
                            scrollToSection('shop');
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-zinc-300 hover:text-emerald-400 hover:bg-white/5 transition-all text-left font-medium cursor-pointer"
                        >
                          <span className="truncate">{cat.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Perks Strip */}
                  <div className="pt-3 border-t border-white/10 space-y-1.5 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Player Double-Knit Fabric</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-400 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Squad Heat-Press (+300 Tk)</span>
                    </div>
                  </div>
                </div>

                {/* Center Column (6 cols): Promotional Slider Carousel (Framed text with contrast scrim so images NEVER cover discount or text) */}
                <div className={`lg:col-span-6 relative bg-gradient-to-r ${safeSlide.bgGradient || 'from-[#0f1411] via-[#121a15] to-[#0c100e]'} border border-white/10 rounded-xl overflow-hidden shadow-2xl min-h-[340px] sm:min-h-[380px] flex flex-col justify-between p-4 sm:p-7 transition-colors duration-500`}>
                  
                  {/* Dedicated High-Contrast Gradient Scrim Overlay to ensure text & discount rates are 100% visible on all screens */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent z-[1] pointer-events-none" />

                  {/* Admin Direct Quick-Editor button on the banner */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowBannerEditorModal(true)}
                      className="absolute top-2.5 right-2.5 z-30 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-black/90 hover:bg-emerald-600 border border-emerald-500/50 text-emerald-300 hover:text-white rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1.5 backdrop-blur transition-all shadow-xl cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Edit Top Banners & Rates</span>
                    </button>
                  )}

                  {/* Right Side Slide Image Container (Proper containment and object-fit so it never covers corner text) */}
                  <div className="absolute right-0 sm:right-2 bottom-0 top-0 w-[42%] sm:w-[38%] flex items-center justify-center pointer-events-none z-0 overflow-hidden pr-1">
                    {safeSlide.image && (
                      <img
                        key={safeSlide.id}
                        src={safeSlide.image}
                        alt="Banner Kit"
                        referrerPolicy="no-referrer"
                        className="max-h-48 sm:max-h-64 md:max-h-72 w-auto max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] transform group-hover:scale-105 transition-all duration-500"
                      />
                    )}
                  </div>

                  {/* Slide Content (Guaranteed clearance & crystal-clear readability under all image sizes) */}
                  <div className="relative z-10 w-full max-w-[62%] sm:max-w-[65%] space-y-2 sm:space-y-2.5 pr-1 sm:pr-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className={`inline-block text-[9.5px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-md ${safeSlide.accentBadge || 'bg-emerald-500 text-black'}`}>
                        {safeSlide.tag}
                      </span>
                      
                      {/* Prominent Discount Badge (Displays slide discount, flash discount, or store discount) */}
                      {((safeSlide.discountPercent !== undefined && safeSlide.discountPercent > 0) || flashSaleDiscountPercent > 0 || globalDiscountPercent > 0) && (
                        <span className="text-[9.5px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg border border-red-400/40 flex items-center gap-1 animate-pulse">
                          <Percent className="w-3 h-3 text-yellow-300" />
                          <span>-{(safeSlide.discountPercent && safeSlide.discountPercent > 0) ? safeSlide.discountPercent : (flashSaleDiscountPercent > 0 ? flashSaleDiscountPercent : globalDiscountPercent)}% OFF</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-2xl md:text-3xl font-display font-black text-white leading-tight uppercase tracking-tight drop-shadow-md break-words">
                      {safeSlide.title}
                    </h2>

                    <p className="text-[11px] sm:text-[13px] text-zinc-200 leading-snug sm:leading-relaxed drop-shadow max-w-sm line-clamp-2 sm:line-clamp-3">
                      {safeSlide.subtitle}
                    </p>

                    {/* Delivery & Dispatch Notice Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/75 border border-white/10 text-[9px] sm:text-[10px] text-emerald-400 font-mono">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">Mirpur Dhaka • 64 Districts Delivery</span>
                    </div>

                    <div className="pt-1 sm:pt-2 flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedRegion('All');
                          scrollToSection('shop');
                        }}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-wider px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-emerald-950/60 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{safeSlide.cta || 'Shop Collection'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => scrollToSection('flash-sale')}
                        className="px-3 sm:px-4 py-2 sm:py-2.5 bg-black/70 hover:bg-black/90 border border-orange-500/40 hover:border-orange-400 text-orange-300 font-bold text-[11px] sm:text-xs uppercase rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow"
                      >
                        <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                        <span>Flash Deals ({flashSaleJerseys.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Slider Dots & Arrow Controls */}
                  <div className="relative z-10 flex items-center justify-between pt-3 mt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      {bannerSlides.map((slide, idx) => (
                        <button
                          key={slide.id}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            currentSlide % bannerSlides.length === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-white/20 hover:bg-white/40'
                          }`}
                          title={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1))}
                        className="p-1 rounded-lg bg-black/60 hover:bg-black text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title="Previous Slide"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
                        className="p-1 rounded-lg bg-black/60 hover:bg-black text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title="Next Slide"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column (3 cols): Online Business Benefits & User Trust Hub */}
                <div className="lg:col-span-3 bg-[#101411] border border-white/10 rounded-xl p-4 flex flex-col justify-between shadow-lg space-y-3">
                  {/* Store Profile Card */}
                  <div className="bg-[#141a15] border border-emerald-500/20 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                    <BrandLogo size="sm" showSubtitle={false} className="justify-center" />
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Official Online Business Page
                    </p>
                    {productDisplaySettings?.showHappyFansRating && (
                      <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{productDisplaySettings.happyFansRatingText || '4.9 / 5.0 (500+ Happy Fans)'}</span>
                      </div>
                    )}
                  </div>

                  {/* Key Trust Pillars */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-2 p-2 bg-black/40 rounded-lg border border-white/5">
                      <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-[11px]">
                          Online Orders • {hubAddress ? hubAddress.split('-')[0].trim() : 'Mirpur, Dhaka'}
                        </strong>
                        <span className="text-[9.5px] text-zinc-400">1–3 Days Courier to All 64 Districts</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 bg-black/40 rounded-lg border border-white/5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-[11px]">Player Version Fabric</strong>
                        <span className="text-[9.5px] text-zinc-400">Double-Knit Breathable Weave</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 bg-black/40 rounded-lg border border-white/5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-[11px]">bKash / Nagad / COD</strong>
                        <span className="text-[9.5px] text-zinc-400">Instant Verified Receipts</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct WhatsApp Support */}
                  <a
                    href={`https://wa.me/88${(whatsappNumber || '01402580064').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366]/40 text-[#25d366] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>WhatsApp Helpline</span>
                  </a>
                </div>
              </div>
            </section>
          );
        })()}

        {/* ========================================================================= */}
        {/* SECTION 1: DARAZ-STYLE "FLASH SALE" WITH LIVE COUNTDOWN TIMER */}
        {/* ========================================================================= */}
        {flashSaleConfig?.enabled !== false && (
          <section id="flash-sale" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 scroll-mt-24">
            <div className="bg-[#121613] border border-orange-500/30 rounded-2xl p-4 sm:p-5 shadow-xl overflow-hidden relative">
              {/* Flash Sale Header Strip (Daraz iconic red/orange banner) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black text-xs uppercase tracking-wider px-3 py-1 rounded-lg shadow-md">
                    <Flame className="w-4 h-4 text-yellow-300 animate-pulse" />
                    <span>{flashSaleConfig?.title || 'Flash Sale'}</span>
                  </div>

                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
                    {flashSaleJerseys.length} Kits Live
                  </span>

                  {/* Real-time Countdown clock (toggleable via admin) */}
                  {flashSaleConfig?.showTimer !== false && (
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-zinc-300">
                      <span className="text-zinc-400 text-[11px] font-sans mr-1">
                        {countdown.isEnded ? 'Sale Concluded:' : 'Ending in:'}
                      </span>
                      <span className="bg-black/80 px-2 py-1 rounded text-orange-400 border border-orange-500/30">
                        {String(countdown.hours).padStart(2, '0')}h
                      </span>
                      <span>:</span>
                      <span className="bg-black/80 px-2 py-1 rounded text-orange-400 border border-orange-500/30">
                        {String(countdown.minutes).padStart(2, '0')}m
                      </span>
                      <span>:</span>
                      <span className="bg-black/80 px-2 py-1 rounded text-orange-400 border border-orange-500/30">
                        {String(countdown.seconds).padStart(2, '0')}s
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Dedicated Flash Sale Add/Remove Manager Button (Owner only) */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowFlashManagerModal(true)}
                      className="px-3 py-1.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
                      title="Add or Remove Jerseys from Flash Sale"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>+ Manage / Add Jerseys</span>
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowBannerEditorModal(true)}
                      className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-orange-500/40 text-orange-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Timer & Rates</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRegion('All');
                      scrollToSection('shop');
                    }}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 uppercase tracking-wider cursor-pointer ml-1"
                  >
                    <span>Shop More</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Flash Sale Product Grid */}
              {flashSaleJerseys.length === 0 ? (
                <div className="p-8 text-center bg-black/40 rounded-xl border border-dashed border-orange-500/30">
                  <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-bold text-white uppercase">Flash Sale Coming Soon</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                    Stay tuned! Exclusive limited-time discount jerseys will appear here soon.
                  </p>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowFlashManagerModal(true)}
                      className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase rounded-lg transition-all inline-flex items-center gap-2 cursor-pointer shadow"
                    >
                      <Flame className="w-4 h-4" />
                      <span>+ Add Jerseys to Flash Sale</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {flashSaleJerseys.map((jersey) => {
                    const discPct = flashSaleDiscountPercent > 0 ? flashSaleDiscountPercent : (jersey.discountPercent || 0);
                    const hasDiscount = discPct > 0;
                    
                    let originalPrice = jersey.originalPriceBDT || (hasDiscount ? Math.round(jersey.priceBDT / (1 - discPct / 100)) : jersey.priceBDT);
                    let sellingPrice = hasDiscount ? Math.round(originalPrice * (1 - discPct / 100)) : jersey.priceBDT;

                    const soldCount = jersey.soldCount !== undefined ? jersey.soldCount : 12;
                    const stockLeft = jersey.stockLeft !== undefined ? jersey.stockLeft : 8;
                    const showStock = (jersey.showStockProgress !== false) && (showStockProgressGlobal !== false);
                    const totalUnits = Math.max(1, soldCount + stockLeft);
                    const soldPercentage = Math.min(100, Math.max(12, Math.round((soldCount / totalUnits) * 100)));

                    return (
                      <div
                        key={`flash-${jersey.id}`}
                        className="bg-[#0b0e0c] border border-white/10 hover:border-orange-500/50 rounded-xl p-3 flex flex-col justify-between group transition-all cursor-pointer shadow-md relative"
                        onClick={() => setQuickViewJersey(jersey)}
                      >
                        {/* Quick Remove from Flash Sale button (Admin only) */}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => handleRemoveJerseyFromFlashSale(jersey.id, e)}
                            className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/80 hover:bg-red-600 border border-white/20 hover:border-red-500 text-zinc-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 sm:opacity-70 sm:hover:opacity-100 cursor-pointer shadow-lg"
                            title="Remove from Flash Sale"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <div className="relative p-2 bg-gradient-to-b from-black/50 to-black/80 rounded-lg flex items-center justify-center min-h-[140px] sm:min-h-[170px] overflow-hidden">
                          {hasDiscount && (
                            <span className="absolute top-2 left-2 z-20 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-lg border border-red-400/40 uppercase whitespace-nowrap">
                              -{discPct}% OFF
                            </span>
                          )}
                          <img
                            src={jersey.image}
                            alt={jersey.name}
                            referrerPolicy="no-referrer"
                            className="max-h-32 sm:max-h-36 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md"
                          />
                        </div>

                        <div className="mt-2.5">
                          <h4 className="text-xs font-bold text-white uppercase tracking-tight line-clamp-1 group-hover:text-orange-400 transition-colors">
                            {jersey.name}
                          </h4>
                          <div className="flex items-baseline flex-wrap gap-1.5 mt-1 whitespace-nowrap">
                            <span className="text-sm sm:text-base font-mono font-black text-orange-400 shrink-0">
                              ৳ {sellingPrice.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span className="text-[10.5px] text-zinc-500 line-through font-mono shrink-0">
                                ৳ {originalPrice.toLocaleString()}
                              </span>
                            )}
                            {hasDiscount && (
                              <span className="text-[9.5px] font-bold text-red-400 shrink-0 whitespace-nowrap">
                                ({discPct}% Off)
                              </span>
                            )}
                          </div>

                          {/* Stock progress bar (Editable via Admin) */}
                          {showStock && (
                            <div className="mt-2">
                              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all"
                                  style={{ width: `${soldPercentage}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-mono text-zinc-400 block mt-1">
                                {soldCount} Sold / <span className="text-amber-400 font-semibold">{stockLeft} Left in Stock</span>
                              </span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(jersey, 'M');
                            }}
                            className="w-full mt-2.5 py-1.5 bg-orange-600/20 hover:bg-orange-600 border border-orange-500/40 hover:border-orange-500 text-orange-200 hover:text-white text-[10px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Jersey Quick Slot Card (Visible ONLY in Admin Mode) */}
                  {isAdmin && (
                    <div
                      onClick={() => setShowFlashManagerModal(true)}
                      className="bg-zinc-950/40 hover:bg-zinc-900/60 border-2 border-dashed border-orange-500/30 hover:border-orange-500/80 rounded-xl p-4 flex flex-col items-center justify-center text-center group cursor-pointer transition-all min-h-[180px] sm:min-h-[220px]"
                    >
                      <div className="p-3 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-all mb-2">
                        <PlusCircle className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-white uppercase group-hover:text-orange-400 transition-colors">
                        + Add Flash Jersey
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-1 max-w-[140px] leading-tight">
                        Pick kits or create new for Flash Sale
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: DARAZ SORT & FILTER CAROUSEL BAR */}
        {/* ========================================================================= */}
        <EcommerceFilterBar
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedFilterChip={selectedFilterChip}
          setSelectedFilterChip={setSelectedFilterChip}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          totalResults={sortedJerseys.length}
        />

        {/* ========================================================================= */}
        {/* SECTION 4: ALL JERSEY COLLECTIONS (MAIN PRODUCT CATALOG) */}
        {/* ========================================================================= */}
        <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 scroll-mt-24 font-sans">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-[11px] font-mono font-bold text-orange-400 uppercase tracking-widest">
                  Official Match Store
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight mt-0.5">
                All Jersey Collections
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Showing {sortedJerseys.length} authentic Thai premium kits available for instant delivery
              </p>
            </div>

            {/* Quick Count & Tag */}
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-orange-300 font-bold">
                {selectedRegion === 'All' ? 'All Regions' : selectedRegion}
              </span>
              {selectedFilterChip !== 'all' && (
                <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold">
                  {selectedFilterChip}
                </span>
              )}
            </div>
          </div>

          {/* Active Filter indicator */}
          {searchQuery && (
            <div className="flex items-center gap-2 mb-4 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs text-emerald-300">
              <span>Filtered by search: "<strong>{searchQuery}</strong>"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="ml-auto text-emerald-400 hover:text-white font-bold underline"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* High-Density E-Commerce Product Grid (4 items per row on desktop) */}
          {sortedJerseys.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {sortedJerseys.map((jersey) => (
                <JerseyCard
                  key={jersey.id}
                  jersey={jersey}
                  onBuyNow={handleBuyNowTrigger}
                  onAddToCart={handleAddToCart}
                  onQuickView={(j) => setQuickViewJersey(j)}
                  isAdmin={isAdmin}
                  onEdit={handleOpenEditModalForJersey}
                  onDelete={handleDeleteJersey}
                  globalDiscountPercent={globalDiscountPercent}
                  showStockProgressGlobal={showStockProgressGlobal}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#101411] border border-white/10 p-12 rounded-2xl text-center max-w-md mx-auto shadow-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold uppercase text-sm">No Kits Match Your Query</h4>
              <p className="text-xs text-zinc-400 mt-1">
                No jerseys found for "{searchQuery}". Try searching for Brazil, Argentina, or Bangladesh.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('All');
                }}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded-lg transition-colors shadow"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: E-COMMERCE VALUE PERKS, 5.0★ VERIFIED REVIEWS & FAQ */}
        {/* ========================================================================= */}
        <EcommercePerksAndReviews
          onBrowseJerseys={() => scrollToSection('shop')}
          showCustomerReviews={showCustomerReviews}
          customerReviews={customerReviews}
          showGotQuestions={showGotQuestions}
          productDisplaySettings={productDisplaySettings}
          isAdmin={isAdmin}
          onOpenSettings={(tab) => {
            if (tab) setStoreSettingsInitialTab(tab);
            setShowStoreSettingsModal(true);
          }}
          onToggleReviewsVisibility={handleToggleReviewsVisibility}
          onToggleGotQuestionsVisibility={handleToggleGotQuestionsVisibility}
          onToggleProductDisplay={handleToggleProductDisplay}
        />

        {/* ========================================================================= */}
        {/* SECTION 6: LIVE ORDER DISPATCH TRACKER */}
        {/* ========================================================================= */}
        <section id="track" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 scroll-mt-24">
          <div className="bg-[#101411] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Live Dispatch Tracker
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase mt-2">
                Track Your Parcel
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your Order ID, bKash/Nagad Phone Number, or TrxID to view real-time courier status.
              </p>

              <div className="mt-5 flex items-center gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="e.g. NJH-12345 or 017xxxxxxxx"
                  value={trackOrderQuery}
                  onChange={(e) => setTrackOrderQuery(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                {trackOrderQuery && (
                  <button
                    type="button"
                    onClick={() => setTrackOrderQuery('')}
                    className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Matched Orders List */}
              {trackOrderQuery.trim() && (
                <div className="mt-6 text-left space-y-3 max-w-lg mx-auto">
                  {matchedOrders.length > 0 ? (
                    matchedOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-black/60 border border-emerald-500/30 rounded-xl p-4 space-y-2 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-emerald-400">{ord.id}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            {ord.status || 'Verified & Queued'}
                          </span>
                        </div>
                        <div className="text-xs text-white font-bold">{ord.jerseyName} ({ord.size}) × {ord.quantity}</div>
                        <div className="text-[11px] text-zinc-400 flex items-center justify-between font-mono">
                          <span>Tk {ord.amount.toLocaleString()} ({ord.paymentMethod})</span>
                          <span>{new Date(ord.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-center text-xs text-zinc-400">
                      No matching parcel found for "{trackOrderQuery}". Please verify your order number or phone.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: OFFICIAL ORDERING & PAYMENT RULES, CASH ON DELIVERY & HELPLINE (AT THE END) */}
        {/* ========================================================================= */}
        <section id="rules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 scroll-mt-24">
          <RulesCard
            bKashNumber={bKashNumber}
            nagadNumber={nagadNumber}
            bKashQR={bKashQR}
            nagadQR={nagadQR}
            facebookLink={facebookLink}
            hotlineNumber={hotlineNumber}
            whatsappNumber={whatsappNumber}
            supportEmail={supportEmail}
            helplineLabel={helplineLabel}
            hubAddress={hubAddress}
            orderRulesSettings={orderRulesSettings}
            isAdmin={isAdmin}
            onUpdateQR={(type, data) => {
              if (type === 'bKash') handleUpdateBKashQR(data);
              else handleUpdateNagadQR(data);
            }}
            onPlaceOrderClick={() => {
              if (jerseysList.length > 0) {
                setCheckoutJersey(jerseysList[0]);
                setShowCheckoutModal(true);
              } else {
                scrollToSection('shop');
              }
            }}
            onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
            onOpenSettings={(tab) => {
              if (tab) setStoreSettingsInitialTab(tab);
              setShowStoreSettingsModal(true);
            }}
            onToggleOrderRules={handleToggleOrderRules}
          />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: ADMIN SECURE CONTROLS & LOGS (ONLY VISIBLE TO ADMIN) */}
        {/* ========================================================================= */}
        {isAdmin && (
          <section id="admin-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 scroll-mt-24">
            <SecureOrdersPanel
              isAdmin={isAdmin}
              orders={orders}
              personalOrders={personalOrders}
              onOrderUpdate={(newOrders) => setOrders(newOrders)}
              onPersonalOrderDelete={(orderId) => setPersonalOrders(prev => prev.filter(o => o.id !== orderId))}
            />

            <div className="mt-8">
              <BackupPanel
                isAdmin={isAdmin}
                jerseysList={jerseysList}
                bKashNumber={bKashNumber}
                nagadNumber={nagadNumber}
                whatsappNumber={whatsappNumber}
                bKashQR={bKashQR}
                nagadQR={nagadQR}
                webhookUrl={webhookUrl}
                isSyncing={isSyncing}
                onRestoreState={handleRestoreState}
                onManualSync={handleManualSync}
              />
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 7: PAYMENT HUB & FULL E-COMMERCE FOOTER (AT THE VERY END) */}
        {/* ========================================================================= */}
        <PaymentHubAndFooter
          bKashNumber={bKashNumber}
          setBKashNumber={handleUpdateBKashNumber}
          nagadNumber={nagadNumber}
          setNagadNumber={handleUpdateNagadNumber}
          whatsappNumber={whatsappNumber}
          setWhatsappNumber={handleUpdateWhatsappNumber}
          supportEmail={supportEmail}
          setSupportEmail={setSupportEmail}
          hotlineNumber={hotlineNumber}
          setHotlineNumber={setHotlineNumber}
          hubAddress={hubAddress}
          setHubAddress={setHubAddress}
          bKashQR={bKashQR || undefined}
          nagadQR={nagadQR || undefined}
          onUpdateQR={(type, data) => {
            if (type === 'bKash') handleUpdateBKashQR(data);
            else handleUpdateNagadQR(data);
          }}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          onOpenLoginModal={() => setShowAdminLoginModal(true)}
          onOpenStoreSettings={() => setShowStoreSettingsModal(true)}
          scrollToSection={scrollToSection}
        />
      </main>

      {/* Cart Drawer (Daraz / iHerb slide-in drawer) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckoutFromCart}
        bKashNumber={bKashNumber}
        nagadNumber={nagadNumber}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        jersey={quickViewJersey}
        onClose={() => setQuickViewJersey(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNowTrigger}
        globalDiscountPercent={globalDiscountPercent}
        showStockProgressGlobal={showStockProgressGlobal}
      />

      {/* ========================================================================= */}
      {/* BANNER & DISCOUNT PERCENTAGES ADMIN EDITOR MODAL (ADMIN ONLY) */}
      {/* ========================================================================= */}
      <BannerEditorModal
        isOpen={showBannerEditorModal && isAdmin}
        onClose={() => setShowBannerEditorModal(false)}
        slides={bannerSlides}
        onSaveSlides={handleSaveBannerSlides}
        globalDiscountPercent={globalDiscountPercent}
        onSaveGlobalDiscount={handleSaveGlobalDiscount}
        flashSaleDiscountPercent={flashSaleDiscountPercent}
        onSaveFlashSaleDiscount={handleSaveFlashSaleDiscount}
        catalogJerseys={jerseysList}
        flashSaleConfig={flashSaleConfig}
        onSaveFlashSaleConfig={handleSaveFlashSaleConfig}
        showStockProgressGlobal={showStockProgressGlobal}
        onSaveStockProgressGlobal={handleSaveStockProgressGlobal}
      />

      {/* ========================================================================= */}
      {/* FLASH SALE DIRECT MANAGER MODAL (ADD / REMOVE JERSEYS - ADMIN ONLY) */}
      {/* ========================================================================= */}
      <FlashSaleManagerModal
        isOpen={showFlashManagerModal && isAdmin}
        onClose={() => setShowFlashManagerModal(false)}
        catalogJerseys={jerseysList}
        flashSaleConfig={flashSaleConfig}
        onSaveFlashSaleConfig={handleSaveFlashSaleConfig}
        onAddNewCatalogJersey={(newJersey) => {
          setJerseysList((prev) => [newJersey, ...prev]);
          fetch('/api/jerseys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-passcode': 'admin2026' },
            body: JSON.stringify(newJersey),
          }).catch(err => console.error("Error creating jersey on backend", err));
        }}
      />

      {/* ========================================================================= */}
      {/* STORE & PAYMENT SETTINGS ADMIN MODAL (BKASH, NAGAD, SUPPORT EMAIL, HUB, HOTLINE, REVIEWS, PRODUCT DISPLAY, ORDER RULES) */}
      {/* ========================================================================= */}
      <StoreSettingsModal
        isOpen={showStoreSettingsModal && isAdmin}
        onClose={() => setShowStoreSettingsModal(false)}
        initialTab={storeSettingsInitialTab}
        bKashNumber={bKashNumber}
        setBKashNumber={handleUpdateBKashNumber}
        nagadNumber={nagadNumber}
        setNagadNumber={handleUpdateNagadNumber}
        supportEmail={supportEmail}
        setSupportEmail={setSupportEmail}
        hotlineNumber={hotlineNumber}
        setHotlineNumber={setHotlineNumber}
        hubAddress={hubAddress}
        setHubAddress={setHubAddress}
        whatsappNumber={whatsappNumber}
        setWhatsappNumber={handleUpdateWhatsappNumber}
        helplineLabel={helplineLabel}
        setHelplineLabel={setHelplineLabel}
        voiceAgentNumber={voiceAgentNumber}
        setVoiceAgentNumber={setVoiceAgentNumber}
        showVoiceAssistant={showVoiceAssistant}
        setShowVoiceAssistant={setShowVoiceAssistant}
        facebookLink={facebookLink}
        setFacebookLink={setFacebookLink}
        bKashQR={bKashQR}
        nagadQR={nagadQR}
        showCustomerReviews={showCustomerReviews}
        setShowCustomerReviews={setShowCustomerReviews}
        customerReviews={customerReviews}
        setCustomerReviews={setCustomerReviews}
        showGotQuestions={showGotQuestions}
        setShowGotQuestions={setShowGotQuestions}
        productDisplaySettings={productDisplaySettings}
        setProductDisplaySettings={setProductDisplaySettings}
        orderRulesSettings={orderRulesSettings}
        setOrderRulesSettings={setOrderRulesSettings}
        navbarSettings={navbarSettings}
        setNavbarSettings={setNavbarSettings}
        onUpdateQR={(type, data) => {
          if (type === 'bKash') handleUpdateBKashQR(data);
          else handleUpdateNagadQR(data);
        }}
        onSaveAllSettings={handleSaveStoreSettings}
      />

      {/* ========================================================================= */}
      {/* CHECKOUT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCheckoutModal && checkoutJersey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-1">
                <OrderForm
                  preselectedJersey={checkoutJersey}
                  preselectedSize={checkoutSize}
                  bKashNumber={bKashNumber}
                  nagadNumber={nagadNumber}
                  whatsappNumber={whatsappNumber}
                  bKashQR={bKashQR}
                  nagadQR={nagadQR}
                  onOrderSubmit={handleCreateOrder}
                  jerseysList={jerseysList}
                  onClose={() => setShowCheckoutModal(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* ADMIN ADD JERSEY MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showAddModal && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-10 max-h-[92vh] overflow-y-auto font-sans text-xs"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Add New Jersey</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-zinc-500 hover:text-white font-mono text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleAddJerseySubmit} className="space-y-4">
                  {/* Jersey Category / Region Selector */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-2.5">
                    <label className="text-[10px] font-mono text-indigo-400 uppercase font-bold flex items-center justify-between">
                      <span>Jersey Region & Category (জার্সি ক্যাটাগরি ও অঞ্চল)</span>
                      <span className="text-[9px] text-zinc-400 font-normal">Controls catalog filter</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {[
                        { region: 'Club', category: 'Club Jersey', label: '⚽ Club Jersey' },
                        { region: 'Americas', category: 'South American Jersey', label: '🇧🇷 🇦🇷 South America' },
                        { region: 'Asia', category: 'Asian Jersey', label: '🇧🇩 🇯🇵 Asian Jersey' },
                        { region: 'Europe', category: 'European Jersey', label: '🇵🇹 🇫🇷 European Jersey' },
                        { region: 'Europe', category: 'International Kit', label: '🌍 International Kit' },
                      ].map((cat) => (
                        <button
                          key={cat.category}
                          type="button"
                          onClick={() => {
                            setFormRegion(cat.region as any);
                            setFormCategory(cat.category);
                          }}
                          className={`px-2.5 py-1.5 rounded text-[11px] font-medium text-left border transition-all cursor-pointer ${
                            formCategory === cat.category
                              ? 'bg-indigo-600 text-white border-indigo-500 font-bold shadow-md shadow-indigo-600/30'
                              : 'bg-zinc-900/90 text-zinc-300 border-white/5 hover:border-white/20'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Quick Club / Country Preset Clickers */}
                    <div className="pt-1 border-t border-white/5">
                      <span className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                        Quick Presets:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { name: 'Real Madrid', country: 'Real Madrid', region: 'Club', cat: 'Club Jersey' },
                          { name: 'Barcelona', country: 'Barcelona', region: 'Club', cat: 'Club Jersey' },
                          { name: 'Manchester City', country: 'Manchester City', region: 'Club', cat: 'Club Jersey' },
                          { name: 'Arsenal', country: 'Arsenal', region: 'Club', cat: 'Club Jersey' },
                          { name: 'PSG', country: 'PSG', region: 'Club', cat: 'Club Jersey' },
                          { name: 'Brazil', country: 'Brazil', region: 'Americas', cat: 'South American Jersey' },
                          { name: 'Argentina', country: 'Argentina', region: 'Americas', cat: 'South American Jersey' },
                          { name: 'Bangladesh', country: 'Bangladesh', region: 'Asia', cat: 'Asian Jersey' },
                          { name: 'Japan', country: 'Japan', region: 'Asia', cat: 'Asian Jersey' },
                          { name: 'Portugal', country: 'Portugal', region: 'Europe', cat: 'European Jersey' },
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setFormCountry(preset.country);
                              setFormName(`${preset.name} Player Edition Match Kit`);
                              setFormRegion(preset.region as any);
                              setFormCategory(preset.cat);
                            }}
                            className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5 transition-colors cursor-pointer"
                          >
                            + {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Jersey Type / Edition Selector */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-2">
                    <label className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                      Jersey Type / Edition (জার্সি সংস্করণ ও কোয়ালিটি)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { type: 'Player Edition', label: '⭐ Player Edition (Thai Match)' },
                        { type: 'Fan Edition', label: '👕 Fan Edition (Stadium Comfort)' },
                        { type: 'Retro Vintage', label: '⏳ Retro Vintage Edition (Classic)' },
                        { type: 'Special Anime', label: '🎨 Special Anime / Designer Edition' },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setFormJerseyType(item.type)}
                          className={`px-2.5 py-2 rounded text-[11px] font-medium text-left border transition-all cursor-pointer ${
                            formJerseyType === item.type
                              ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-md shadow-emerald-600/30'
                              : 'bg-zinc-900/90 text-zinc-300 border-white/5 hover:border-white/20'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Club / Country Name</label>
                      <input
                        type="text"
                        value={formCountry}
                        onChange={(e) => setFormCountry(e.target.value)}
                        className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs"
                        placeholder="e.g. Real Madrid / Bangladesh"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Original Price (BDT)</label>
                      <input
                        type="number"
                        value={formOriginalPriceBDT}
                        onChange={(e) => updateFormPrices(Math.max(1, parseInt(e.target.value) || 0), formDiscountPercent)}
                        className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Jersey Display Name</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs"
                      placeholder="e.g. Bangladesh World Cup 2026 Home Kit"
                      required
                    />
                  </div>

                  {/* Discount Rate & Auto Price Preview */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        <span>Discount Rate (%)</span>
                      </label>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Auto decreases selling price
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="number"
                          min="0"
                          max="95"
                          value={formDiscountPercent}
                          onChange={(e) => updateFormPrices(formOriginalPriceBDT, Math.max(0, Math.min(95, parseInt(e.target.value) || 0)))}
                          className="w-full bg-zinc-900 text-white px-3 py-2 border border-white/10 rounded focus:outline-none focus:border-emerald-500 text-xs font-mono"
                          placeholder="e.g. 20"
                        />
                      </div>
                      <div className="bg-zinc-950 p-2 rounded border border-white/5 flex flex-col justify-center">
                        <span className="text-[9px] text-zinc-500 uppercase font-mono">Calculated Final Price:</span>
                        <span className="text-sm font-black font-mono text-emerald-400">
                          Tk {formPriceBDT.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Customer Reviews Control (e.g. 5.0, 4.9, 4.8, 4.5) */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Jersey Rating & Reviews (রেটিং ও রিভিউ)</span>
                      </label>
                      <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 font-mono">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{Number(formRating || 5.0).toFixed(1)} / 5.0</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                          Rating Score (e.g. 4.9, 4.8, 4.5, 5.0)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="1.0"
                          max="5.0"
                          value={formRating}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setFormRating(isNaN(val) ? 5.0 : Math.min(5.0, Math.max(1.0, val)));
                          }}
                          className="w-full bg-zinc-900 text-amber-300 font-bold px-3 py-2 border border-white/10 rounded focus:outline-none focus:border-amber-400 text-xs font-mono"
                          placeholder="5.0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                          Reviews Count (e.g. 142)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formReviewsCount}
                          onChange={(e) => setFormReviewsCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-zinc-900 text-white px-3 py-2 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs font-mono"
                          placeholder="120"
                        />
                      </div>
                    </div>

                    {/* Quick preset buttons */}
                    <div>
                      <span className="block text-[9px] font-mono text-zinc-400 uppercase mb-1.5">Quick Presets (এক ক্লিকে রেটিং সিলেক্ট):</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[5.0, 4.9, 4.8, 4.7, 4.5, 4.0].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setFormRating(preset)}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              Number(formRating) === preset
                                ? 'bg-amber-400 text-black border border-amber-300 shadow-md shadow-amber-400/20'
                                : 'bg-zinc-900 text-zinc-300 border border-white/10 hover:border-amber-400/50 hover:text-amber-300'
                            }`}
                          >
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                            <span>{preset.toFixed(1)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Badges & Special Display Controls (Ratings, Coins, Free Delivery, Sold Count, Top Tag) */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <label className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Product Badges & Display Access (ব্যাজ কন্ট্রোল)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Free Delivery Toggle */}
                      <label className="flex items-center justify-between p-2 bg-zinc-900/80 border border-white/5 rounded-lg cursor-pointer hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs text-zinc-200">Free Delivery Badge</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formFreeDelivery}
                          onChange={(e) => setFormFreeDelivery(e.target.checked)}
                          className="accent-emerald-500 rounded"
                        />
                      </label>

                      {/* Rating Score Badge Toggle */}
                      <label className="flex items-center justify-between p-2 bg-zinc-900/80 border border-white/5 rounded-lg cursor-pointer hover:border-amber-500/30 transition-all">
                        <div className="flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-zinc-200">Show Rating (★ {Number(formRating).toFixed(1)})</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formShowRating}
                          onChange={(e) => setFormShowRating(e.target.checked)}
                          className="accent-amber-400 rounded"
                        />
                      </label>

                      {/* Sold Count Badge Toggle */}
                      <label className="flex items-center justify-between p-2 bg-zinc-900/80 border border-white/5 rounded-lg cursor-pointer hover:border-orange-500/30 transition-all">
                        <div className="flex items-center gap-2">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-xs text-zinc-200">Show Sold Count ({formSoldCount} sold)</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formShowSoldCount}
                          onChange={(e) => setFormShowSoldCount(e.target.checked)}
                          className="accent-orange-500 rounded"
                        />
                      </label>

                      {/* Coins Reward Badge Toggle */}
                      <label className="flex items-center justify-between p-2 bg-zinc-900/80 border border-white/5 rounded-lg cursor-pointer hover:border-yellow-500/30 transition-all">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-yellow-400" />
                          <span className="text-xs text-zinc-200">Show Coins (Save ৳{formCoinsReward})</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formShowCoins}
                          onChange={(e) => setFormShowCoins(e.target.checked)}
                          className="accent-yellow-400 rounded"
                        />
                      </label>
                    </div>

                    {/* Coins Amount & Top Tag Text */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                          Coins Amount (Save ৳)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formCoinsReward}
                          onChange={(e) => setFormCoinsReward(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-zinc-900 text-yellow-400 font-bold px-3 py-2 border border-white/10 rounded text-xs font-mono"
                          placeholder="20"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                          Top Tag (e.g. KIDS JERSEY, PAYDAY)
                        </label>
                        <input
                          type="text"
                          value={formTagText}
                          onChange={(e) => setFormTagText(e.target.value)}
                          className="w-full bg-zinc-900 text-white font-bold px-3 py-2 border border-white/10 rounded text-xs"
                          placeholder="PREMIUM THAI"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock & Sold progress numbers (Daraz style 12 Sold / 8 Left) */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>Stock Progress Bar Display</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-zinc-300">
                        <input
                          type="checkbox"
                          checked={formShowStockProgress}
                          onChange={(e) => setFormShowStockProgress(e.target.checked)}
                          className="accent-emerald-500 rounded"
                        />
                        <span>Show Bar</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">Sold Count (e.g. 12)</label>
                        <input
                          type="number"
                          min="0"
                          value={formSoldCount}
                          onChange={(e) => setFormSoldCount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-zinc-900 text-white px-3 py-2 border border-white/10 rounded text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">Stock Left (e.g. 8)</label>
                        <input
                          type="number"
                          min="0"
                          value={formStockLeft}
                          onChange={(e) => setFormStockLeft(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-zinc-900 text-white px-3 py-2 border border-white/10 rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Upload Jersey Image
                    </label>
                    <div className="border-2 border-dashed border-white/10 rounded p-4 text-center hover:border-indigo-500/50 transition-all bg-black/40">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="block w-full text-zinc-500 text-[11px] font-mono file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                      />
                    </div>

                    {formImage && (
                      <div className="mt-3 flex items-center gap-3 p-2 bg-black border border-white/5 rounded">
                        <img
                          src={formImage}
                          alt="preview"
                          className="w-12 h-12 object-contain bg-zinc-900 border border-white/10 p-0.5 rounded"
                        />
                        <div className="text-[9px] font-mono text-emerald-400 flex-1 truncate">
                          <span>Photo Loaded ✓</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormImage('')}
                          className="text-red-500 hover:text-white px-1.5"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Price description & specifications details</label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs resize-none"
                      placeholder="Wear details, premium fabric description, collar layout specifications..."
                    />
                  </div>

                  <div className="flex pt-4 gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider py-3 rounded active:scale-95 transition-all cursor-pointer"
                    >
                      Publish New Jersey
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="bg-zinc-800 text-zinc-400 text-xs px-4 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* ADMIN EDIT JERSEY MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingJersey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setEditingJersey(null);
                setFormImage('');
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-10 max-h-[92vh] overflow-y-auto font-sans text-xs"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Edit Jersey Details</h3>
                  <button
                    onClick={() => {
                      setEditingJersey(null);
                      setFormImage('');
                    }}
                    className="text-zinc-500 hover:text-white font-mono text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleEditJerseySubmit} className="space-y-4">
                  {/* Jersey Category / Region Selector */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-2.5">
                    <label className="text-[10px] font-mono text-indigo-400 uppercase font-bold flex items-center justify-between">
                      <span>Jersey Region & Category (জার্সি ক্যাটাগরি ও অঞ্চল)</span>
                      <span className="text-[9px] text-zinc-400 font-normal">Controls catalog filter</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {[
                        { region: 'Club', category: 'Club Jersey', label: '⚽ Club Jersey' },
                        { region: 'Americas', category: 'South American Jersey', label: '🇧🇷 🇦🇷 South America' },
                        { region: 'Asia', category: 'Asian Jersey', label: '🇧🇩 🇯🇵 Asian Jersey' },
                        { region: 'Europe', category: 'European Jersey', label: '🇵🇹 🇫🇷 European Jersey' },
                        { region: 'Europe', category: 'International Kit', label: '🌍 International Kit' },
                      ].map((cat) => (
                        <button
                          key={cat.category}
                          type="button"
                          onClick={() => {
                            setFormRegion(cat.region as any);
                            setFormCategory(cat.category);
                          }}
                          className={`px-2.5 py-1.5 rounded text-[11px] font-medium text-left border transition-all cursor-pointer ${
                            formCategory === cat.category
                              ? 'bg-indigo-600 text-white border-indigo-500 font-bold shadow-md shadow-indigo-600/30'
                              : 'bg-zinc-900/90 text-zinc-300 border-white/5 hover:border-white/20'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Jersey Type / Edition Selector */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-2">
                    <label className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                      Jersey Type / Edition (জার্সি সংস্করণ ও কোয়ালিটি)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { type: 'Player Edition', label: '⭐ Player Edition (Thai Match)' },
                        { type: 'Fan Edition', label: '👕 Fan Edition (Stadium Comfort)' },
                        { type: 'Retro Vintage', label: '⏳ Retro Vintage Edition (Classic)' },
                        { type: 'Special Anime', label: '🎨 Special Anime / Designer Edition' },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setFormJerseyType(item.type)}
                          className={`px-2.5 py-2 rounded text-[11px] font-medium text-left border transition-all cursor-pointer ${
                            formJerseyType === item.type
                              ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-md shadow-emerald-600/30'
                              : 'bg-zinc-900/90 text-zinc-300 border-white/5 hover:border-white/20'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Club / Country Name</label>
                      <input
                        type="text"
                        value={formCountry}
                        onChange={(e) => setFormCountry(e.target.value)}
                        className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Original Price (BDT)</label>
                      <input
                        type="number"
                        value={formOriginalPriceBDT}
                        onChange={(e) => updateFormPrices(Math.max(1, parseInt(e.target.value) || 0), formDiscountPercent)}
                        className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Jersey Display Name</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs"
                      required
                    />
                  </div>

                  {/* Discount Rate & Auto Price Preview */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        <span>Discount Rate (%)</span>
                      </label>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Original price automatically decreases
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="number"
                          min="0"
                          max="95"
                          value={formDiscountPercent}
                          onChange={(e) => updateFormPrices(formOriginalPriceBDT, Math.max(0, Math.min(95, parseInt(e.target.value) || 0)))}
                          className="w-full bg-zinc-900 text-white px-3 py-2 border border-white/10 rounded focus:outline-none focus:border-emerald-500 text-xs font-mono"
                          placeholder="e.g. 20"
                        />
                      </div>
                      <div className="bg-zinc-950 p-2 rounded border border-white/5 flex flex-col justify-center">
                        <span className="text-[9px] text-zinc-500 uppercase font-mono">Final Selling Price:</span>
                        <span className="text-sm font-black font-mono text-emerald-400">
                          Tk {formPriceBDT.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Customer Reviews Control (e.g. 5.0, 4.9, 4.8, 4.5) */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Jersey Rating & Reviews (রেটিং ও রিভিউ এডিট)</span>
                      </label>
                      <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 font-mono">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{Number(formRating || 5.0).toFixed(1)} / 5.0</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                          Rating Score (e.g. 4.9, 4.8, 4.5, 5.0)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="1.0"
                          max="5.0"
                          value={formRating}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setFormRating(isNaN(val) ? 5.0 : Math.min(5.0, Math.max(1.0, val)));
                          }}
                          className="w-full bg-zinc-900 text-amber-300 font-bold px-3 py-2 border border-white/10 rounded focus:outline-none focus:border-amber-400 text-xs font-mono"
                          placeholder="5.0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                          Reviews Count (e.g. 142)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formReviewsCount}
                          onChange={(e) => setFormReviewsCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-zinc-900 text-white px-3 py-2 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs font-mono"
                          placeholder="120"
                        />
                      </div>
                    </div>

                    {/* Quick preset buttons */}
                    <div>
                      <span className="block text-[9px] font-mono text-zinc-400 uppercase mb-1.5">Quick Presets (এক ক্লিকে রেটিং সিলেক্ট):</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[5.0, 4.9, 4.8, 4.7, 4.5, 4.0].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setFormRating(preset)}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              Number(formRating) === preset
                                ? 'bg-amber-400 text-black border border-amber-300 shadow-md shadow-amber-400/20'
                                : 'bg-zinc-900 text-zinc-300 border border-white/10 hover:border-amber-400/50 hover:text-amber-300'
                            }`}
                          >
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                            <span>{preset.toFixed(1)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Badges & Special Display Controls (Ratings, Coins, Free Delivery, Sold Count, Top Tag) */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <label className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Product Badges & Display Access (ব্যাজ কন্ট্রোল)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Free Delivery Toggle */}
                      <label className="flex items-center justify-between p-2 bg-zinc-900/80 border border-white/5 rounded-lg cursor-pointer hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs text-zinc-200">Free Delivery Badge</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formFreeDelivery}
                          onChange={(e) => setFormFreeDelivery(e.target.checked)}
                          className="accent-emerald-500 rounded"
                        />
                      </label>

                      {/* Rating Score Badge Toggle */}
                      <label className="flex items-center justify-between p-2 bg-zinc-900/80 border border-white/5 rounded-lg cursor-pointer hover:border-amber-500/30 transition-all">
                        <div className="flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-zinc-200">Show Rating (★ {Number(formRating).toFixed(1)})</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formShowRating}
                          onChange={(e) => setFormShowRating(e.target.checked)}
                          className="accent-amber-400 rounded"
                        />
                      </label>

                      {/* Sold Count Badge Toggle */}
                      <label className="flex items-center justify-between p-2 bg-zinc-900/80 border border-white/5 rounded-lg cursor-pointer hover:border-orange-500/30 transition-all">
                        <div className="flex items-center gap-2">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-xs text-zinc-200">Show Sold Count ({formSoldCount} sold)</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formShowSoldCount}
                          onChange={(e) => setFormShowSoldCount(e.target.checked)}
                          className="accent-orange-500 rounded"
                        />
                      </label>

                      {/* Coins Reward Badge Toggle */}
                      <label className="flex items-center justify-between p-2 bg-zinc-900/80 border border-white/5 rounded-lg cursor-pointer hover:border-yellow-500/30 transition-all">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-yellow-400" />
                          <span className="text-xs text-zinc-200">Show Coins (Save ৳{formCoinsReward})</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formShowCoins}
                          onChange={(e) => setFormShowCoins(e.target.checked)}
                          className="accent-yellow-400 rounded"
                        />
                      </label>
                    </div>

                    {/* Coins Amount & Top Tag Text */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                          Coins Amount (Save ৳)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formCoinsReward}
                          onChange={(e) => setFormCoinsReward(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-zinc-900 text-yellow-400 font-bold px-3 py-2 border border-white/10 rounded text-xs font-mono"
                          placeholder="20"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                          Top Tag (e.g. KIDS JERSEY, PAYDAY)
                        </label>
                        <input
                          type="text"
                          value={formTagText}
                          onChange={(e) => setFormTagText(e.target.value)}
                          className="w-full bg-zinc-900 text-white font-bold px-3 py-2 border border-white/10 rounded text-xs"
                          placeholder="PREMIUM THAI"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock & Sold progress numbers (Daraz style 12 Sold / 8 Left) */}
                  <div className="p-3 bg-black/60 border border-white/10 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>Inventory & Sold Counter Display</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-zinc-300">
                        <input
                          type="checkbox"
                          checked={formShowStockProgress}
                          onChange={(e) => setFormShowStockProgress(e.target.checked)}
                          className="accent-emerald-500 rounded"
                        />
                        <span>Display "X Sold / Y Left"</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">Sold Count</label>
                        <input
                          type="number"
                          min="0"
                          value={formSoldCount}
                          onChange={(e) => setFormSoldCount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-zinc-900 text-white px-3 py-2 border border-white/10 rounded text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">Stock Left</label>
                        <input
                          type="number"
                          min="0"
                          value={formStockLeft}
                          onChange={(e) => setFormStockLeft(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-zinc-900 text-white px-3 py-2 border border-white/10 rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Replace Image from Gallery (Upload)
                    </label>
                    <div className="border-2 border-dashed border-white/10 rounded p-4 text-center hover:border-indigo-500/50 transition-all bg-black/40">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="block w-full text-zinc-500 text-[11px] font-mono file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                      />
                    </div>

                    {formImage && (
                      <div className="mt-3 flex items-center gap-3 p-2 bg-black border border-white/5 rounded">
                        <img
                          src={formImage}
                          alt="preview"
                          className="w-12 h-12 object-contain bg-zinc-900 border border-white/10 p-0.5 rounded"
                        />
                        <div className="text-[9px] font-mono text-emerald-400 flex-1 truncate">
                          <span>Replacement Photo Loaded ✓</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormImage('')}
                          className="text-red-500 hover:text-white px-1.5 cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Price description & specifications details</label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-black text-white px-3 py-2.5 border border-white/10 rounded focus:outline-none focus:border-indigo-500 text-xs resize-none"
                      required
                    />
                  </div>

                  <div className="flex pt-4 gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider py-3 rounded active:scale-95 transition-all cursor-pointer"
                    >
                      Save Configuration
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingJersey(null);
                        setFormImage('');
                      }}
                      className="bg-zinc-800 text-zinc-400 text-xs px-4 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Global Admin Login Modal */}
        {showAdminLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAdminLoginModal(false);
                setAdminPasscode('');
                setAdminLoginError('');
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[#121613] border border-orange-500/30 rounded-2xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold uppercase">Store Owner Login</h4>
                    <p className="text-[10px] text-zinc-400">Exclusive Admin Configuration</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLoginModal(false);
                    setAdminPasscode('');
                    setAdminLoginError('');
                  }}
                  className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (adminPasscode === 'admin2026') {
                    setIsAdmin(true);
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem('nafi_jersey_is_admin', 'true');
                      } catch (err) {}
                    }
                    setShowAdminLoginModal(false);
                    setAdminPasscode('');
                    setAdminLoginError('');
                  } else {
                    setAdminLoginError('Invalid Passcode! Try again.');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Security Passcode
                  </label>
                  <input
                    type="password"
                    value={adminPasscode}
                    onChange={(e) => {
                      setAdminPasscode(e.target.value);
                      setAdminLoginError('');
                    }}
                    placeholder="Enter owner passcode"
                    className="w-full bg-black/60 border border-white/15 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
                    autoFocus
                  />
                  {adminLoginError && (
                    <p className="text-rose-400 text-[10px] mt-1.5 font-bold">{adminLoginError}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminLoginModal(false);
                      setAdminPasscode('');
                      setAdminLoginError('');
                    }}
                    className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    Authenticate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating AI Voice Agent */}
      {showVoiceAssistant && (
        <VoiceAgent
          jerseysList={jerseysList}
          bKashNumber={bKashNumber}
          nagadNumber={nagadNumber}
          directCallNumber={voiceAgentNumber || hotlineNumber || whatsappNumber || '01402580064'}
          facebookLink={facebookLink}
          selectedJersey={checkoutJersey}
          isOpenControlled={isVoiceAgentOpen}
          onOpenChange={setIsVoiceAgentOpen}
          onOrderConfirmed={(newVoiceOrder) => {
            setOrders(prev => [newVoiceOrder, ...prev]);
            setPersonalOrders(prev => [newVoiceOrder, ...prev]);
            if (typeof window !== 'undefined') {
              try {
                const stored = localStorage.getItem('my_orders_history');
                const list = stored ? JSON.parse(stored) : [];
                localStorage.setItem('my_orders_history', JSON.stringify([newVoiceOrder, ...list]));
              } catch (err) {
                console.error('Error saving voice order history to storage:', err);
              }
            }
          }}
        />
      )}
    </div>
  );
}
