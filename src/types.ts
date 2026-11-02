export interface Jersey {
  id: string;
  country: string;
  name: string;
  priceBDT: number;
  originalPriceBDT?: number; // Base original price before discount
  priceUSD: number;
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
  badgeColor: string; // e.g., 'bg-yellow-500'
  accentColor: string; // e.g., 'text-yellow-400'
  bgGradient: string; // e.g., 'from-yellow-900/20 to-green-900/10'
  discountPercent?: number; // e.g., 20 or 0
  soldCount?: number; // e.g., 12
  stockLeft?: number; // e.g., 8
  showStockProgress?: boolean; // toggle whether to show 'X sold / Y left'
  showRating?: boolean; // toggle rating display on/off
  showCoins?: boolean; // toggle coins badge display on/off
  coinsReward?: number; // custom coins amount
  freeDelivery?: boolean; // toggle free delivery badge on/off
  showSoldCount?: boolean; // toggle sold count on/off
  tagText?: string; // custom top tag badge text
  showTag?: boolean; // toggle top tag badge on/off
  locationTag?: string; // custom location tag
  region?: 'Club' | 'Americas' | 'Europe' | 'Asia' | 'Africa' | 'Special' | string;
  category?: 'Club Jersey' | 'South American Jersey' | 'Asian Jersey' | 'European Jersey' | 'International Kit' | string;
  jerseyType?: 'Player Edition' | 'Fan Edition' | 'Retro Vintage' | 'Special Anime' | string;
  league?: string;
}

export interface FlashSaleConfig {
  enabled: boolean;
  title: string;
  subtitle?: string;
  discountPercent: number; // 0 = No discount, >0 = percentage discount
  showTimer?: boolean; // toggle whether to display countdown timer
  endTime: string; // ISO date string or timestamp
  durationHours?: number;
  autoRestart?: boolean;
  showStockProgress?: boolean;
  jerseyIds?: string[]; // IDs of jerseys featured in the flash sale section
}

export interface BannerSlide {
  id: string | number;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  bgGradient: string;
  accentBadge: string;
  highlightKit?: string;
  image: string;
  discountPercent?: number;
  jerseyId?: string;
}

export interface Order {
  id: string;
  jerseyId: string;
  jerseyName: string;
  countryName: string;
  size: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  timestamp: string;
  status: 'Pending Verification' | 'Verified' | 'Shipped' | 'Delivered';
  customNumber?: string;
  customName?: string;
}

export interface VisitorLog {
  id: string;
  name: string;
  location: string;
  device: string;
  action: string;
  timestamp: string;
  ip: string;
  isReal?: boolean;
}

export interface CustomerReview {
  id: string | number;
  name: string;
  location: string;
  jersey: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  size: string;
}

export interface ProductDisplaySettings {
  showPerksBar: boolean;
  showAuthenticity: boolean;
  authenticityText: string;
  authenticityDesc: string;
  showFastCourier: boolean;
  fastCourierText: string;
  fastCourierDesc: string;
  showCashOnDelivery: boolean;
  cashOnDeliveryText: string;
  cashOnDeliveryDesc: string;
  showMobileBanking: boolean;
  mobileBankingText: string;
  mobileBankingDesc: string;
  showEasyExchange: boolean;
  easyExchangeText: string;
  easyExchangeDesc: string;
  showHappyFansRating?: boolean;
  happyFansRatingText?: string;
  showStoreProfileCard?: boolean;
}

export interface OrderRulesSettings {
  showRulesCard: boolean;
  title: string;
  subtitle: string;
  hubLocation: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  codInfo: string;
}

export interface NavbarSettings {
  showTopAnnouncementBar: boolean;
  showAuthenticBadge: boolean;
  authenticBadgeText: string;
  showFastDelivery: boolean;
  fastDeliveryText: string;
  showChatOn: boolean;
  chatOnLabel: string;
  chatOnStatusText?: string;
  showCodBadge: boolean;
  codBadgeText: string;
  showRulesShortcut: boolean;
  rulesShortcutText: string;
  showPaymentShortcut: boolean;
  paymentShortcutText: string;
  showAiVoiceButton: boolean;
  aiVoiceButtonText: string;
  showTrackOrderButton: boolean;
  trackOrderButtonText: string;
  showCategoriesSubNav: boolean;
  showFlashSaleNav: boolean;
  flashSaleNavText: string;
  showClubJerseyNav: boolean;
  clubJerseyNavText: string;
  showSouthAmericaNav: boolean;
  southAmericaNavText: string;
  showEuropeNav: boolean;
  europeNavText: string;
  showAsiaNav: boolean;
  asiaNavText: string;
  showPaymentGuideNav: boolean;
  paymentGuideNavText: string;
  showHubLocationBadge: boolean;
  hubLocationBadgeText: string;
}

export interface StoreSettings {
  bKashNumber: string;
  nagadNumber: string;
  supportEmail: string;
  hotlineNumber: string;
  hubAddress: string;
  whatsappNumber?: string;
  helplineLabel?: string;
  voiceAgentNumber?: string;
  showVoiceAssistant?: boolean;
  facebookLink?: string;
  bKashQR?: string | null;
  nagadQR?: string | null;
  showCustomerReviews?: boolean;
  customerReviews?: CustomerReview[];
  showGotQuestions?: boolean;
  faqList?: { q: string; a: string }[];
  productDisplaySettings?: ProductDisplaySettings;
  orderRulesSettings?: OrderRulesSettings;
  navbarSettings?: NavbarSettings;
}

