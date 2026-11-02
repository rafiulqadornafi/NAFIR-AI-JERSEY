import React, { useState, useRef } from 'react';
import { 
  X, Plus, Trash2, Edit2, Check, ArrowUp, ArrowDown, Sparkles, 
  Percent, Layers, Save, Tag, Zap, Clock, Flame, Search,
  Sliders, ArrowRight, ToggleLeft, ToggleRight, Calendar, AlertCircle,
  Image as ImageIcon, Upload, Eye, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BannerSlide, Jersey, FlashSaleConfig } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

interface BannerEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: BannerSlide[];
  onSaveSlides: (slides: BannerSlide[]) => Promise<void> | void;
  globalDiscountPercent: number;
  onSaveGlobalDiscount: (percent: number) => Promise<void> | void;
  flashSaleDiscountPercent: number;
  onSaveFlashSaleDiscount: (percent: number) => Promise<void> | void;
  flashSaleConfig?: FlashSaleConfig;
  onSaveFlashSaleConfig?: (config: FlashSaleConfig) => Promise<void> | void;
  showStockProgressGlobal?: boolean;
  onSaveStockProgressGlobal?: (show: boolean) => Promise<void> | void;
  catalogJerseys: Jersey[];
  initialTab?: 'banners' | 'flash' | 'discounts';
}

const GRADIENT_PRESETS = [
  { label: 'Emerald Green', value: 'from-emerald-950/90 via-zinc-900 to-black', badge: 'bg-emerald-500 text-black' },
  { label: 'Midnight Blue', value: 'from-blue-950/90 via-zinc-900 to-black', badge: 'bg-amber-400 text-black' },
  { label: 'Teal Aurora', value: 'from-teal-950/90 via-zinc-900 to-black', badge: 'bg-teal-400 text-black' },
  { label: 'Crimson Red', value: 'from-rose-950/90 via-zinc-900 to-black', badge: 'bg-rose-500 text-white' },
  { label: 'Golden Yellow', value: 'from-amber-950/90 via-zinc-900 to-black', badge: 'bg-yellow-400 text-black' },
  { label: 'Carbon Stealth', value: 'from-zinc-900 via-zinc-950 to-black', badge: 'bg-white text-black' },
];

export default function BannerEditorModal({
  isOpen,
  onClose,
  slides,
  onSaveSlides,
  globalDiscountPercent,
  onSaveGlobalDiscount,
  flashSaleDiscountPercent,
  onSaveFlashSaleDiscount,
  flashSaleConfig,
  onSaveFlashSaleConfig,
  showStockProgressGlobal = true,
  onSaveStockProgressGlobal,
  catalogJerseys,
  initialTab = 'banners',
}: BannerEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'banners' | 'flash' | 'discounts'>(initialTab);
  const [currentSlides, setCurrentSlides] = useState<BannerSlide[]>(slides);
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Gallery file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Discount & Flash states
  const [globalDiscount, setGlobalDiscount] = useState<number>(globalDiscountPercent);
  const [flashDiscount, setFlashDiscount] = useState<number>(flashSaleDiscountPercent);
  const [showStockProgress, setShowStockProgress] = useState<boolean>(showStockProgressGlobal);
  
  // Flash Sale configuration state
  const [flashConfig, setFlashConfig] = useState<FlashSaleConfig>(() => {
    return flashSaleConfig || {
      enabled: true,
      title: 'Flash Sale',
      subtitle: 'Limited Time Match Edition Drop',
      discountPercent: flashSaleDiscountPercent !== undefined ? flashSaleDiscountPercent : 0,
      showTimer: true,
      endTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
      durationHours: 6,
      autoRestart: true,
      showStockProgress: true,
    };
  });

  // Interactive Price Calculator Simulation
  const [simBasePrice, setSimBasePrice] = useState<number>(1350);
  const [simDiscount, setSimDiscount] = useState<number>(flashSaleDiscountPercent || 0);

  // Flash Sale jerseys search & picker states
  const [flashCatalogSearch, setFlashCatalogSearch] = useState('');
  const [showFlashCatalogPicker, setShowFlashCatalogPicker] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Active flash sale jersey IDs
  const activeFlashJerseyIds = flashConfig.jerseyIds !== undefined
    ? flashConfig.jerseyIds
    : catalogJerseys.slice(0, 4).map(j => j.id);

  const activeFlashJerseys = activeFlashJerseyIds
    .map(id => catalogJerseys.find(j => j.id === id))
    .filter((j): j is Jersey => Boolean(j));

  const filteredFlashCatalog = catalogJerseys.filter(j => {
    if (!flashCatalogSearch.trim()) return true;
    const q = flashCatalogSearch.toLowerCase();
    return j.name.toLowerCase().includes(q) || j.country.toLowerCase().includes(q);
  });

  const handleToggleFlashJerseyInModal = (jerseyId: string) => {
    let updatedIds: string[];
    if (activeFlashJerseyIds.includes(jerseyId)) {
      updatedIds = activeFlashJerseyIds.filter(id => id !== jerseyId);
      showNotice('Jersey removed from Flash Sale.');
    } else {
      updatedIds = [...activeFlashJerseyIds, jerseyId];
      showNotice('Jersey added to Flash Sale!');
    }
    setFlashConfig(prev => ({ ...prev, jerseyIds: updatedIds }));
  };

  const handleRemoveFlashJerseyInModal = (jerseyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updatedIds = activeFlashJerseyIds.filter(id => id !== jerseyId);
    setFlashConfig(prev => ({ ...prev, jerseyIds: updatedIds }));
    showNotice('Jersey removed from Flash Sale.');
  };

  const handleMoveFlashJerseyInModal = (index: number, direction: 'left' | 'right') => {
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= activeFlashJerseyIds.length) return;
    const copy = [...activeFlashJerseyIds];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setFlashConfig(prev => ({ ...prev, jerseyIds: copy }));
  };

  // Update local state when props change
  React.useEffect(() => {
    setCurrentSlides(slides);
  }, [slides]);

  React.useEffect(() => {
    setGlobalDiscount(globalDiscountPercent);
  }, [globalDiscountPercent]);

  React.useEffect(() => {
    setFlashDiscount(flashSaleDiscountPercent);
    setSimDiscount(flashSaleDiscountPercent);
  }, [flashSaleDiscountPercent]);

  React.useEffect(() => {
    if (flashSaleConfig) {
      setFlashConfig(flashSaleConfig);
    }
  }, [flashSaleConfig]);

  React.useEffect(() => {
    setShowStockProgress(showStockProgressGlobal);
  }, [showStockProgressGlobal]);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const handleSlideFormChange = (field: keyof BannerSlide, value: any) => {
    if (!editingSlide) return;
    setEditingSlide({
      ...editingSlide,
      [field]: value,
    });
  };

  // Upload image from Gallery / Local device
  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 1000, 0.82);
      if (editingSlide) {
        handleSlideFormChange('image', compressed);
      }
    } catch (err) {
      console.error('Failed to compress gallery image', err);
    }
  };

  // Quick select a jersey from catalog for the banner slide
  const handleSelectJerseyForSlide = (jersey: Jersey) => {
    if (!editingSlide) {
      setEditingSlide({
        id: `slide-${Date.now()}`,
        tag: `🔥 ${jersey.country.toUpperCase()} MATCH EDITION`,
        title: jersey.name.toUpperCase(),
        subtitle: `Authentic ${jersey.country} player version kit. Fast nationwide doorstep delivery from Mirpur, Dhaka across all 64 districts.`,
        cta: 'Shop Now',
        bgGradient: jersey.country === 'Brazil' 
          ? 'from-emerald-950/90 via-zinc-900 to-black'
          : jersey.country === 'Argentina'
          ? 'from-blue-950/90 via-zinc-900 to-black'
          : jersey.country === 'Portugal'
          ? 'from-teal-950/90 via-zinc-900 to-black'
          : 'from-zinc-900 via-zinc-950 to-black',
        accentBadge: jersey.country === 'Brazil' ? 'bg-emerald-500 text-black' : 'bg-amber-400 text-black',
        highlightKit: jersey.name,
        image: jersey.image,
        discountPercent: jersey.discountPercent || 0,
        jerseyId: jersey.id,
      });
      setIsCreatingNew(true);
    } else {
      setEditingSlide({
        ...editingSlide,
        title: editingSlide.title || jersey.name.toUpperCase(),
        subtitle: editingSlide.subtitle || `Authentic ${jersey.country} player version kit. Fast nationwide delivery from Mirpur, Dhaka.`,
        image: jersey.image,
        highlightKit: jersey.name,
        jerseyId: jersey.id,
      });
    }
  };

  const handleSaveSlide = () => {
    if (!editingSlide) return;
    
    if (isCreatingNew) {
      const newSlide: BannerSlide = {
        ...editingSlide,
        id: editingSlide.id || `slide-${Date.now()}`,
      };
      const updated = [...currentSlides, newSlide];
      setCurrentSlides(updated);
      onSaveSlides(updated);
    } else {
      const updated = currentSlides.map((s) => (s.id === editingSlide.id ? editingSlide : s));
      setCurrentSlides(updated);
      onSaveSlides(updated);
    }

    setEditingSlide(null);
    setIsCreatingNew(false);
    showNotice('Banner slide updated successfully!');
  };

  const handleDeleteSlide = (id: string | number) => {
    if (currentSlides.length <= 1) {
      alert('You must have at least one top banner slide.');
      return;
    }
    const updated = currentSlides.filter((s) => s.id !== id);
    setCurrentSlides(updated);
    onSaveSlides(updated);
    if (editingSlide?.id === id) {
      setEditingSlide(null);
    }
    showNotice('Slide removed.');
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentSlides.length) return;

    const copy = [...currentSlides];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);

    setCurrentSlides(copy);
    onSaveSlides(copy);
  };

  const handleSetFlashDurationHours = (hours: number) => {
    const end = new Date(Date.now() + hours * 3600 * 1000).toISOString();
    setFlashConfig((prev) => ({
      ...prev,
      durationHours: hours,
      endTime: end,
      enabled: true,
      showTimer: true,
    }));
    showNotice(`Flash Sale countdown set for ${hours} hours!`);
  };

  const handleRemoveTiming = () => {
    setFlashConfig((prev) => ({
      ...prev,
      showTimer: false,
    }));
    showNotice('Countdown timer removed from Flash Sale section.');
  };

  const handleEnableTiming = () => {
    const end = new Date(Date.now() + (flashConfig.durationHours || 6) * 3600 * 1000).toISOString();
    setFlashConfig((prev) => ({
      ...prev,
      showTimer: true,
      endTime: end,
    }));
    showNotice('Countdown timer enabled.');
  };

  const handleRemoveFlashDiscount = () => {
    setFlashDiscount(0);
    setFlashConfig((prev) => ({
      ...prev,
      discountPercent: 0,
    }));
    showNotice('Flash sale discount removed (0% - regular price).');
  };

  const handleEndFlashSaleNow = () => {
    setFlashConfig((prev) => ({
      ...prev,
      enabled: false,
      endTime: new Date().toISOString(),
    }));
    showNotice('Flash Sale marked as ended.');
  };

  const handleRestartFlashSale = () => {
    const newEnd = new Date(Date.now() + (flashConfig.durationHours || 6) * 3600 * 1000).toISOString();
    setFlashConfig((prev) => ({
      ...prev,
      enabled: true,
      showTimer: true,
      endTime: newEnd,
    }));
    showNotice('Flash Sale timer restarted!');
  };

  const handleSaveAllFlashSettings = async () => {
    setIsSaving(true);
    try {
      if (onSaveFlashSaleConfig) {
        await onSaveFlashSaleConfig(flashConfig);
      }
      await onSaveFlashSaleDiscount(Number(flashDiscount) || 0);
      if (onSaveStockProgressGlobal) {
        await onSaveStockProgressGlobal(showStockProgress);
      }
      showNotice('Flash Sale configuration & timing settings saved successfully!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAllDiscounts = async () => {
    setIsSaving(true);
    try {
      await onSaveGlobalDiscount(Number(globalDiscount) || 0);
      await onSaveFlashSaleDiscount(Number(flashDiscount) || 0);
      if (onSaveStockProgressGlobal) {
        await onSaveStockProgressGlobal(showStockProgress);
      }
      showNotice('Discount settings saved and applied to entire storefront!');
    } finally {
      setIsSaving(false);
    }
  };

  const showNotice = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const calculateSellingPrice = (base: number, percent: number) => {
    if (percent <= 0) return base;
    return Math.round(base * (1 - percent / 100));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-[#0e120f] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden z-10 text-white flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-black border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span>Top Banners, Flash Sale & Discount Management</span>
                  <span className="text-[10px] font-mono bg-emerald-500 text-black px-2 py-0.5 rounded font-bold">
                    ADMIN
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Manage hero carousel slides, gallery jersey images, flash sale discount rate, and countdown timers.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-black/40 px-4 sm:px-6 gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => { setActiveTab('banners'); setEditingSlide(null); setIsCreatingNew(false); }}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'banners'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Top Banner Slides ({currentSlides.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('flash')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'flash'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Flash Sale & Timer Control</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('discounts')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'discounts'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Percent className="w-4 h-4" />
              <span>Discount Rates & Price Calculator</span>
            </button>
          </div>

          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="mx-4 sm:mx-6 mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Tab Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-grow space-y-6">
            
            {/* ========================================================================= */}
            {/* TAB 1: TOP BANNER SLIDES MANAGER */}
            {/* ========================================================================= */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                {editingSlide ? (
                  /* Edit / Add Slide Form */
                  <div className="bg-black/60 border border-white/15 rounded-xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-tight flex items-center gap-2">
                        <Edit2 className="w-4 h-4" />
                        <span>{isCreatingNew ? 'Create New Promotional Banner Slide' : 'Edit Banner Slide Details'}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setEditingSlide(null); setIsCreatingNew(false); }}
                        className="text-xs text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Headline Tag & Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                          Slide Badge Tag (Top Pill)
                        </label>
                        <input
                          type="text"
                          value={editingSlide.tag || ''}
                          onChange={(e) => handleSlideFormChange('tag', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs text-white focus:border-emerald-500 focus:outline-none"
                          placeholder="e.g. 🔥 2026 WORLD CUP SPECIAL"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                          Slide Discount Badge (% OFF)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="90"
                            value={editingSlide.discountPercent !== undefined ? editingSlide.discountPercent : 0}
                            onChange={(e) => handleSlideFormChange('discountPercent', Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
                            placeholder="0 = No discount badge"
                          />
                          <span className="text-xs text-zinc-400 font-mono">%</span>
                          <button
                            type="button"
                            onClick={() => handleSlideFormChange('discountPercent', 0)}
                            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded cursor-pointer whitespace-nowrap"
                          >
                            Set 0%
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                        Main Display Headline (Title)
                      </label>
                      <input
                        type="text"
                        value={editingSlide.title || ''}
                        onChange={(e) => handleSlideFormChange('title', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
                        placeholder="e.g. OFFICIAL MATCH PLAYER EDITION KITS"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                        Subtext / Delivery Announcement
                      </label>
                      <textarea
                        rows={3}
                        value={editingSlide.subtitle || ''}
                        onChange={(e) => handleSlideFormChange('subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
                        placeholder="e.g. Engineered with double-knit breathable mesh & authentic crests. Fast doorstep courier delivery from Mirpur, Dhaka to all 64 districts in Bangladesh."
                      />
                    </div>

                    {/* Jersey Image Source / Gallery Upload Section */}
                    <div className="p-4 bg-zinc-950 border border-white/10 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" /> Slide Jersey Image (From Gallery or Catalog)
                        </label>
                        <span className="text-[10px] text-zinc-400">PNG / JPG / WEBP</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleGalleryImageUpload}
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-inner"
                        >
                          <Upload className="w-4 h-4" />
                          <span>📸 Upload Jersey from Gallery / Device</span>
                        </button>

                        <input
                          type="text"
                          value={editingSlide.image || ''}
                          onChange={(e) => handleSlideFormChange('image', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs font-mono text-zinc-300 focus:border-emerald-500 focus:outline-none"
                          placeholder="Image URL or Base64 / Local Path"
                        />
                      </div>

                      {/* Pick from existing Catalog Jerseys */}
                      <div className="pt-2">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1.5">
                          Or click a jersey below to use its picture for this slide:
                        </span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {catalogJerseys.map((j) => (
                            <button
                              key={j.id}
                              type="button"
                              onClick={() => handleSelectJerseyForSlide(j)}
                              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-emerald-950/80 border border-white/15 hover:border-emerald-400 text-[11px] text-zinc-300 hover:text-white rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
                            >
                              <img src={j.image} alt={j.name} referrerPolicy="no-referrer" className="w-4 h-4 object-contain" />
                              <span>{j.country}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                          Action Button Label (CTA)
                        </label>
                        <input
                          type="text"
                          value={editingSlide.cta || ''}
                          onChange={(e) => handleSlideFormChange('cta', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs text-white focus:border-emerald-500 focus:outline-none"
                          placeholder="e.g. Shop Collection / Order Now"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                          Highlight Kit Subtitle
                        </label>
                        <input
                          type="text"
                          value={editingSlide.highlightKit || ''}
                          onChange={(e) => handleSlideFormChange('highlightKit', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs text-white focus:border-emerald-500 focus:outline-none"
                          placeholder="e.g. Brazil 2026 Authentic Master Kit"
                        />
                      </div>
                    </div>

                    {/* Gradient Themes */}
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1.5">
                        Background Ambience Theme
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {GRADIENT_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              handleSlideFormChange('bgGradient', preset.value);
                              handleSlideFormChange('accentBadge', preset.badge);
                            }}
                            className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                              editingSlide.bgGradient === preset.value
                                ? 'border-emerald-400 bg-emerald-950/40 text-white shadow-sm ring-1 ring-emerald-400/40'
                                : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/20'
                            }`}
                          >
                            <span className="font-medium text-[11px]">{preset.label}</span>
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${preset.value}`}></div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Slide Preview Box (Showing safe space & no overlap) */}
                    <div className="mt-4 p-4 bg-zinc-950 border border-white/10 rounded-xl space-y-2">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                        Live Visual Layout Preview (Safe Text Spacing):
                      </span>
                      <div className={`relative bg-gradient-to-r ${editingSlide.bgGradient || 'from-emerald-950/90 via-zinc-900 to-black'} p-5 rounded-xl border border-white/10 overflow-hidden min-h-[160px] flex items-center justify-between`}>
                        {/* Text Side (Max 58% width to never collide) */}
                        <div className="w-[58%] z-10 space-y-1.5 pr-2">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${editingSlide.accentBadge || 'bg-emerald-500 text-black'}`}>
                              {editingSlide.tag || 'PROMO TAG'}
                            </span>
                            {editingSlide.discountPercent !== undefined && editingSlide.discountPercent > 0 && (
                              <span className="inline-block text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-600 text-white">
                                -{editingSlide.discountPercent}% OFF
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm sm:text-base font-display font-black text-white uppercase leading-tight line-clamp-2">
                            {editingSlide.title || 'HEADLINE TITLE'}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                            {editingSlide.subtitle || 'Subtitle subtext description'}
                          </p>
                        </div>
                        {/* Image Side (40% width on right) */}
                        <div className="w-[40%] flex items-center justify-center">
                          {editingSlide.image ? (
                            <img
                              src={editingSlide.image}
                              alt="Preview"
                              className="max-h-24 sm:max-h-28 object-contain drop-shadow-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-xl bg-black/40 border border-dashed border-zinc-700 flex items-center justify-center text-zinc-500 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => { setEditingSlide(null); setIsCreatingNew(false); }}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSlide}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Slide</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Slides List View */
                  <>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase">Top Hero Slides Order & Settings</h4>
                        <p className="text-xs text-zinc-400">
                          These slides rotate in the top hero banner carousel. You can reorder, edit texts, or add more.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Hidden file input for quick direct upload */}
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressed = await compressImageFile(file, 1000, 0.82);
                                setEditingSlide({
                                  id: `slide-${Date.now()}`,
                                  tag: '🔥 NEW PROMO KIT',
                                  title: 'OFFICIAL MATCH PLAYER EDITION',
                                  subtitle: 'High performance authentic football kit. Fast doorstep courier delivery from Mirpur, Dhaka to all 64 districts.',
                                  cta: 'Order Now',
                                  bgGradient: 'from-emerald-950/90 via-zinc-900 to-black',
                                  accentBadge: 'bg-emerald-500 text-black',
                                  highlightKit: 'New Jersey',
                                  image: compressed,
                                  discountPercent: flashSaleDiscountPercent || 20,
                                });
                                setIsCreatingNew(true);
                              } catch (err) {
                                console.error('Failed to compress direct upload banner image', err);
                              }
                            }
                          }}
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-emerald-300 text-xs font-bold uppercase rounded-lg border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                          title="Upload Jersey from Gallery to create slide"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Add from Gallery</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingSlide({
                              id: `slide-${Date.now()}`,
                              tag: '🔥 NEW PROMO OFFER',
                              title: 'OFFICIAL MATCH PLAYER EDITION',
                              subtitle: 'Fast courier delivery from Mirpur, Dhaka to all 64 districts in Bangladesh with verified parcel tracking.',
                              cta: 'Shop Collection',
                              bgGradient: 'from-emerald-950/90 via-zinc-900 to-black',
                              accentBadge: 'bg-emerald-500 text-black',
                              highlightKit: 'National Kit',
                              image: catalogJerseys[0]?.image || '/src/assets/images/brazil_jersey_2026_1779474536112.png',
                              discountPercent: 0,
                            });
                            setIsCreatingNew(true);
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase rounded-lg shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Slide</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Add from Jersey Catalog */}
                    <div className="p-4 bg-zinc-950/80 border border-white/10 rounded-xl space-y-2.5">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> 1-Click: Create Banner Slide from Any Jersey
                      </span>
                      <p className="text-xs text-zinc-400">
                        Click on any jersey below to immediately generate a high-impact promotional top banner slide for it:
                      </p>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
                        {catalogJerseys.map((j) => (
                          <button
                            key={j.id}
                            type="button"
                            onClick={() => handleSelectJerseyForSlide(j)}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-emerald-950/60 border border-white/15 hover:border-emerald-500/40 text-xs text-zinc-300 hover:text-white rounded-lg flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
                          >
                            <img src={j.image} alt={j.name} referrerPolicy="no-referrer" className="w-4 h-4 object-contain" />
                            <span>+ {j.country}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Slides List */}
                    <div className="space-y-3">
                      {currentSlides.map((slide, index) => (
                        <div
                          key={slide.id}
                          className="p-4 bg-zinc-900/80 border border-white/10 hover:border-white/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="flex flex-col items-center gap-1">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveSlide(index, 'up')}
                                className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-[10px] font-mono text-zinc-500">#{index + 1}</span>
                              <button
                                type="button"
                                disabled={index === currentSlides.length - 1}
                                onClick={() => handleMoveSlide(index, 'down')}
                                className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {slide.image && (
                              <img
                                src={slide.image}
                                alt={slide.title}
                                referrerPolicy="no-referrer"
                                className="w-14 h-14 object-contain bg-black/40 rounded-lg p-1 border border-white/10 flex-shrink-0"
                              />
                            )}

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${slide.accentBadge || 'bg-emerald-500 text-black'}`}>
                                  {slide.tag || 'Slide'}
                                </span>
                                {slide.discountPercent && slide.discountPercent > 0 ? (
                                  <span className="text-[9px] font-bold text-rose-300 bg-rose-950/60 border border-rose-500/30 px-1.5 py-0.5 rounded">
                                    -{slide.discountPercent}% OFF
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                                    Regular Price
                                  </span>
                                )}
                              </div>
                              <h5 className="text-xs sm:text-sm font-bold text-white uppercase mt-1">
                                {slide.title}
                              </h5>
                              <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                                {slide.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSlide(slide);
                                setIsCreatingNew(false);
                              }}
                              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg text-zinc-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit Slide"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteSlide(slide.id)}
                              className="p-1.5 bg-rose-950/50 hover:bg-rose-600 border border-rose-500/30 text-rose-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Delete Slide"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Flash Sale Cross-link Banner Widget */}
                    <div className="p-4 bg-gradient-to-r from-orange-950/40 via-zinc-900 to-black border border-orange-500/30 rounded-xl flex items-center justify-between flex-wrap gap-3 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-600/20 text-orange-400">
                          <Flame className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                            <span>Top Banner & Flash Sale Sync</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                              {activeFlashJerseys.length} Kits Live
                            </span>
                          </h5>
                          <p className="text-[11px] text-zinc-400">
                            Currently showing in Flash Drop: {activeFlashJerseys.map(j => j.country).join(', ') || 'No jerseys selected yet'}.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('flash')}
                        className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <span>Manage Flash Sale Kits</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: FLASH SALE & COUNTDOWN CONTROLLER */}
            {/* ========================================================================= */}
            {activeTab === 'flash' && (
              <div className="space-y-6">
                {/* Master Switch: Enable / End Flash Sale */}
                <div className="p-5 bg-gradient-to-r from-orange-950/40 via-zinc-900 to-black border border-orange-500/30 rounded-xl space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
                        <Flame className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Flash Sale Section & Discount Rate</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${flashConfig.enabled ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                            {flashConfig.enabled ? '● ACTIVE LIVE' : '○ ENDED / PAUSED'}
                          </span>
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Toggle the Flash Sale section on your store page, remove or change the 20% discount rate, and add or remove the countdown timing.
                        </p>
                      </div>
                    </div>

                    {/* Toggle Button */}
                    <div className="flex items-center gap-2">
                      {flashConfig.enabled ? (
                        <button
                          type="button"
                          onClick={handleEndFlashSaleNow}
                          className="px-3.5 py-2 bg-red-950/60 hover:bg-red-700 border border-red-500/50 text-red-200 hover:text-white text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>End Sale Now</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRestartFlashSale}
                          className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-950"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Activate Flash Sale</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Section Title & Discount Rate */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                        Flash Section Title
                      </label>
                      <input
                        type="text"
                        value={flashConfig.title || 'Flash Sale'}
                        onChange={(e) => setFlashConfig({ ...flashConfig, title: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs text-white focus:border-orange-500 focus:outline-none"
                        placeholder="e.g. Flash Sale / World Cup Flash Deals"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase">
                          Flash Sale Discount Rate (% OFF)
                        </label>
                        {flashDiscount > 0 && (
                          <button
                            type="button"
                            onClick={handleRemoveFlashDiscount}
                            className="text-[10px] text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
                          >
                            Remove Discount (0%)
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="90"
                          value={flashDiscount}
                          onChange={(e) => {
                            const val = Math.max(0, Math.min(90, parseInt(e.target.value) || 0));
                            setFlashDiscount(val);
                            setFlashConfig({ ...flashConfig, discountPercent: val });
                          }}
                          className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs font-mono text-white focus:border-orange-500 focus:outline-none"
                          placeholder="0 = No discount"
                        />
                        <span className="text-xs text-zinc-400 font-mono">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Discount Presets */}
                  <div className="p-3 bg-black/50 border border-white/10 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">
                      Quick Discount Rate Selector:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {[
                        { label: '0% (No Discount / Regular Price)', val: 0 },
                        { label: '10% OFF', val: 10 },
                        { label: '15% OFF', val: 15 },
                        { label: '20% OFF', val: 20 },
                        { label: '25% OFF', val: 25 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => {
                            setFlashDiscount(preset.val);
                            setFlashConfig({ ...flashConfig, discountPercent: preset.val });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            flashDiscount === preset.val
                              ? 'bg-orange-500 text-black shadow'
                              : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-white/10'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Countdown Timer: Add / Remove & Duration Controls */}
                  <div className="p-4 bg-black/60 border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] font-mono text-orange-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Countdown Timer (Add or Remove Timing)
                      </span>

                      {/* Timer Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          if (flashConfig.showTimer === false) {
                            handleEnableTiming();
                          } else {
                            handleRemoveTiming();
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                          flashConfig.showTimer !== false
                            ? 'bg-orange-600 text-white shadow'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {flashConfig.showTimer !== false ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Timer Visible (ON)</span>
                          </>
                        ) : (
                          <span>Timer Hidden / Removed (OFF)</span>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-zinc-400">
                      Choose when the discount ends, or remove the timing completely if you want a timeless flash collection:
                    </p>

                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {[
                        { label: '2 Hours Flash', hrs: 2 },
                        { label: '6 Hours (Standard)', hrs: 6 },
                        { label: '12 Hours (Half Day)', hrs: 12 },
                        { label: '24 Hours (1 Day)', hrs: 24 },
                        { label: '48 Hours (Weekend)', hrs: 48 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleSetFlashDurationHours(preset.hrs)}
                          className="px-3 py-1.5 bg-zinc-900 hover:bg-orange-950/60 border border-white/15 hover:border-orange-500/40 text-xs text-zinc-200 hover:text-white rounded-lg transition-all cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={handleRemoveTiming}
                        className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-lg transition-all cursor-pointer"
                      >
                        ✕ Remove Timing
                      </button>
                    </div>

                    {flashConfig.showTimer !== false && (
                      <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 font-mono bg-zinc-950/80 p-2.5 rounded-lg border border-white/5">
                        <span>Target End Timestamp:</span>
                        <span className="text-orange-400 font-bold">
                          {new Date(flashConfig.endTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* SECTION: Displayed Flash Sale Jerseys (Add / Remove) */}
                  <div className="p-4 sm:p-5 bg-black/70 border border-orange-500/40 rounded-xl space-y-4 shadow-xl">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                        <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                          Jerseys Displayed in Flash Sale ({activeFlashJerseys.length})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowFlashCatalogPicker(!showFlashCatalogPicker)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow ${
                          showFlashCatalogPicker
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{showFlashCatalogPicker ? 'Close Catalog Picker' : '+ Add Jersey to Flash Sale'}</span>
                      </button>
                    </div>

                    {/* Active Flash Sale Jerseys Grid */}
                    {activeFlashJerseys.length === 0 ? (
                      <div className="p-6 bg-zinc-950/80 border border-dashed border-orange-500/30 rounded-xl text-center space-y-2">
                        <AlertCircle className="w-7 h-7 text-orange-400 mx-auto" />
                        <h5 className="text-xs font-bold text-white uppercase">No jerseys in Flash Sale currently</h5>
                        <p className="text-[11px] text-zinc-400">
                          Click "+ Add Jersey to Flash Sale" to select kits from your store catalog.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {activeFlashJerseys.map((jersey, idx) => {
                          const disc = flashDiscount > 0 ? flashDiscount : (jersey.discountPercent || 0);
                          const calcPrice = disc > 0 ? Math.round(jersey.priceBDT * (1 - disc / 100)) : jersey.priceBDT;
                          return (
                            <div
                              key={jersey.id}
                              className="relative bg-zinc-950 border border-orange-500/40 hover:border-orange-500 rounded-xl p-2.5 flex flex-col justify-between group shadow-md"
                            >
                              {/* Position & Remove Badge */}
                              <span className="absolute top-1.5 left-1.5 z-10 w-4 h-4 rounded-full bg-orange-600 text-white font-mono font-bold text-[9px] flex items-center justify-center shadow">
                                #{idx + 1}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => handleRemoveFlashJerseyInModal(jersey.id, e)}
                                className="absolute top-1.5 right-1.5 z-10 p-1 bg-red-600/90 hover:bg-red-500 text-white rounded-md transition-all shadow cursor-pointer"
                                title="Remove from Flash Sale"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>

                              {/* Thumbnail */}
                              <div className="bg-black/60 rounded-lg p-1.5 min-h-[90px] flex items-center justify-center mb-1.5">
                                <img
                                  src={jersey.image}
                                  alt={jersey.name}
                                  referrerPolicy="no-referrer"
                                  className="max-h-20 object-contain group-hover:scale-105 transition-transform"
                                />
                              </div>

                              <div>
                                <span className="text-[9px] font-bold text-emerald-400 uppercase block truncate">
                                  {jersey.country}
                                </span>
                                <h6 className="text-[11px] font-bold text-white line-clamp-1">
                                  {jersey.name}
                                </h6>
                                <div className="flex items-baseline gap-1 mt-0.5 font-mono">
                                  <span className="text-xs font-black text-orange-400">
                                    Tk {calcPrice}
                                  </span>
                                  {disc > 0 && (
                                    <span className="text-[9px] text-zinc-500 line-through">
                                      Tk {jersey.priceBDT}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Reorder */}
                              <div className="flex items-center justify-between gap-1 pt-1.5 mt-1.5 border-t border-white/10 text-[9.5px] text-zinc-400 font-mono">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveFlashJerseyInModal(idx, 'left')}
                                  className="px-1 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 text-zinc-300"
                                >
                                  ←
                                </button>
                                <span className="text-[8.5px] text-orange-300 font-bold">Active</span>
                                <button
                                  type="button"
                                  disabled={idx === activeFlashJerseys.length - 1}
                                  onClick={() => handleMoveFlashJerseyInModal(idx, 'right')}
                                  className="px-1 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 text-zinc-300"
                                >
                                  →
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Expandable Catalog Picker */}
                    <AnimatePresence>
                      {showFlashCatalogPicker && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 border-t border-white/10 space-y-3"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Select Jerseys from Store Catalog ({catalogJerseys.length})</span>
                            </span>

                            <div className="relative w-full sm:w-56">
                              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                              <input
                                type="text"
                                value={flashCatalogSearch}
                                onChange={(e) => setFlashCatalogSearch(e.target.value)}
                                placeholder="Search catalog..."
                                className="w-full pl-7 pr-2.5 py-1 bg-zinc-900 border border-white/15 rounded-lg text-xs text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                            {filteredFlashCatalog.map((jersey) => {
                              const isSelected = activeFlashJerseyIds.includes(jersey.id);
                              return (
                                <div
                                  key={jersey.id}
                                  onClick={() => handleToggleFlashJerseyInModal(jersey.id)}
                                  className={`p-2 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                                    isSelected
                                      ? 'bg-orange-950/40 border-orange-500/60 shadow'
                                      : 'bg-zinc-900/80 hover:bg-zinc-900 border-white/10 hover:border-white/20'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img
                                      src={jersey.image}
                                      alt={jersey.name}
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 object-contain bg-black/50 rounded-md p-1 shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <span className="text-[9.5px] font-bold text-emerald-400 block truncate">
                                        {jersey.country}
                                      </span>
                                      <h6 className="text-[11px] font-bold text-white truncate">
                                        {jersey.name}
                                      </h6>
                                      <span className="text-[10px] font-mono text-zinc-400">
                                        Tk {jersey.priceBDT}
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                      isSelected
                                        ? 'bg-red-600/80 hover:bg-red-600 text-white'
                                        : 'bg-orange-600 hover:bg-orange-500 text-white'
                                    }`}
                                  >
                                    {isSelected ? '✕ Remove' : '+ Add'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Stock Left & Sold Badges Visibility Control */}
                  <div className="p-4 bg-zinc-950 border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Tag className="w-4 h-4 text-emerald-400" />
                        <div>
                          <h5 className="text-xs font-bold text-white uppercase">
                            "12 Sold / 8 Left in Stock" Display Control
                          </h5>
                          <p className="text-[11px] text-zinc-400">
                            Control whether the live sold/stock progress bar appears above "Add to Cart" and "Add to Bag" buttons.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowStockProgress(!showStockProgress)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                          showStockProgress
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {showStockProgress ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Visible (ON)</span>
                          </>
                        ) : (
                          <span>Hidden (OFF)</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Save Flash Settings Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSaveAllFlashSettings}
                      className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Saving...' : 'Save Flash Sale & Timing Settings'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: DISCOUNT RATES & AUTOMATIC PRICE CALCULATOR */}
            {/* ========================================================================= */}
            {activeTab === 'discounts' && (
              <div className="space-y-6">
                <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <Percent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase">
                        Global & Storefront Discount Engine
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Set percentage discounts that automatically recalculate selling prices across your entire online catalog.
                      </p>
                    </div>
                  </div>

                  {/* Discount Rate Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-zinc-900 border border-white/10 rounded-xl space-y-2">
                      <label className="block text-xs font-bold text-white uppercase">
                        Global Catalog Discount Rate
                      </label>
                      <p className="text-[11px] text-zinc-400">
                        Applies to all standard jerseys across the page (unless individual discount is specified).
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="number"
                          min="0"
                          max="90"
                          value={globalDiscount}
                          onChange={(e) => setGlobalDiscount(Math.max(0, Math.min(90, parseInt(e.target.value) || 0)))}
                          className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg text-sm font-mono text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                        />
                        <span className="text-sm font-mono text-zinc-400 font-bold">%</span>
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-900 border border-white/10 rounded-xl space-y-2">
                      <label className="block text-xs font-bold text-white uppercase">
                        Flash Sale Drop Discount Rate
                      </label>
                      <p className="text-[11px] text-zinc-400">
                        Applies to the 4 jerseys displayed in the top Flash Sale section. Set to 0% to remove discount.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="number"
                          min="0"
                          max="90"
                          value={flashDiscount}
                          onChange={(e) => setFlashDiscount(Math.max(0, Math.min(90, parseInt(e.target.value) || 0)))}
                          className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg text-sm font-mono text-orange-400 font-bold focus:border-orange-500 focus:outline-none"
                        />
                        <span className="text-sm font-mono text-zinc-400 font-bold">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Live Price Simulator */}
                  <div className="p-4 bg-black/70 border border-emerald-500/30 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-bold">
                      <Sparkles className="w-4 h-4" /> Live Automatic Price Calculation Simulator
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          Original Price (Base Tk)
                        </label>
                        <input
                          type="number"
                          value={simBasePrice}
                          onChange={(e) => setSimBasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-3 py-1.5 bg-zinc-900 border border-white/15 rounded-lg text-xs font-mono text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          Applied Discount (%)
                        </label>
                        <input
                          type="number"
                          value={simDiscount}
                          onChange={(e) => setSimDiscount(Math.max(0, Math.min(90, parseInt(e.target.value) || 0)))}
                          className="w-full px-3 py-1.5 bg-zinc-900 border border-white/15 rounded-lg text-xs font-mono text-white"
                        />
                      </div>

                      <div className="p-3 bg-zinc-900/90 border border-emerald-500/40 rounded-xl text-center">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                          Final Selling Price:
                        </span>
                        <div className="text-lg font-mono font-black text-emerald-400">
                          Tk {calculateSellingPrice(simBasePrice, simDiscount).toLocaleString()}
                        </div>
                        {simDiscount > 0 && (
                          <span className="text-[10px] text-zinc-500 line-through">
                            Tk {simBasePrice.toLocaleString()} (-{simDiscount}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSaveAllDiscounts}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Saving...' : 'Save All Discount Settings'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-black/60 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-mono">
              Changes sync instantly to your online storefront.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
