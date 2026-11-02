import React, { useState, useMemo } from 'react';
import { 
  X, Plus, Trash2, Check, Search, Flame, Tag, ShoppingBag, 
  Sparkles, ArrowRight, Image as ImageIcon, Upload, AlertCircle, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Jersey, FlashSaleConfig } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

interface FlashSaleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogJerseys: Jersey[];
  flashSaleConfig: FlashSaleConfig;
  onSaveFlashSaleConfig: (config: FlashSaleConfig) => Promise<void> | void;
  onAddNewCatalogJersey?: (jersey: Jersey) => void;
}

export default function FlashSaleManagerModal({
  isOpen,
  onClose,
  catalogJerseys,
  flashSaleConfig,
  onSaveFlashSaleConfig,
  onAddNewCatalogJersey,
}: FlashSaleManagerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'pick' | 'create'>('pick');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string>('');

  // Active selected IDs
  const activeIds = useMemo(() => {
    if (flashSaleConfig?.jerseyIds && Array.isArray(flashSaleConfig.jerseyIds)) {
      return flashSaleConfig.jerseyIds;
    }
    return catalogJerseys.slice(0, 4).map(j => j.id);
  }, [flashSaleConfig?.jerseyIds, catalogJerseys]);

  // Current flash sale jerseys list
  const currentFlashJerseys = useMemo(() => {
    return activeIds
      .map(id => catalogJerseys.find(j => j.id === id))
      .filter((j): j is Jersey => Boolean(j));
  }, [activeIds, catalogJerseys]);

  // Filtered catalog for picker
  const filteredCatalog = useMemo(() => {
    if (!searchQuery.trim()) return catalogJerseys;
    const q = searchQuery.toLowerCase();
    return catalogJerseys.filter(
      j => j.name.toLowerCase().includes(q) || j.country.toLowerCase().includes(q)
    );
  }, [catalogJerseys, searchQuery]);

  // Create new custom flash jersey state
  const [newCountry, setNewCountry] = useState('Brazil');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(1350);
  const [newImage, setNewImage] = useState('');
  const [newDescription, setNewDescription] = useState('Official Player Edition Match Jersey. 100% Breathable double-knit fabric.');

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleToggleJersey = async (jerseyId: string) => {
    setIsSaving(true);
    try {
      let updatedIds: string[];
      if (activeIds.includes(jerseyId)) {
        updatedIds = activeIds.filter(id => id !== jerseyId);
        showNotice('Jersey removed from Flash Sale.');
      } else {
        updatedIds = [...activeIds, jerseyId];
        showNotice('Jersey added to Flash Sale!');
      }

      const updatedConfig: FlashSaleConfig = {
        ...flashSaleConfig,
        jerseyIds: updatedIds,
      };

      await onSaveFlashSaleConfig(updatedConfig);
    } catch (err) {
      console.error('Failed to update flash sale jerseys', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveJersey = async (jerseyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsSaving(true);
    try {
      const updatedIds = activeIds.filter(id => id !== jerseyId);
      const updatedConfig: FlashSaleConfig = {
        ...flashSaleConfig,
        jerseyIds: updatedIds,
      };
      await onSaveFlashSaleConfig(updatedConfig);
      showNotice('Jersey removed from Flash Sale.');
    } catch (err) {
      console.error('Failed to remove jersey from flash sale', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveJersey = async (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeIds.length) return;

    setIsSaving(true);
    try {
      const copy = [...activeIds];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);

      const updatedConfig: FlashSaleConfig = {
        ...flashSaleConfig,
        jerseyIds: copy,
      };
      await onSaveFlashSaleConfig(updatedConfig);
      showNotice('Flash Sale display order updated.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateAndAddJersey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Please enter a jersey name.');
      return;
    }

    setIsSaving(true);
    try {
      const newJerseyId = `jersey-${Date.now()}`;
      const defaultImg = newImage.trim() || '/src/assets/images/brazil_jersey_2026_1779474536112.png';
      
      const newJersey: Jersey = {
        id: newJerseyId,
        country: newCountry,
        name: newName.trim(),
        priceBDT: Number(newPrice) || 1350,
        originalPriceBDT: Number(newPrice) || 1350,
        priceUSD: Math.round((Number(newPrice) || 1350) / 100 * 10) / 10,
        image: defaultImg,
        description: newDescription,
        rating: 4.9,
        reviewsCount: 15,
        badgeColor: 'bg-emerald-600 text-white',
        accentColor: 'text-yellow-400',
        bgGradient: 'from-amber-500/10 via-emerald-600/5 to-slate-950',
        discountPercent: flashSaleConfig.discountPercent || 20,
        soldCount: 8,
        stockLeft: 12,
        showStockProgress: true,
      };

      // Add to catalog
      if (onAddNewCatalogJersey) {
        onAddNewCatalogJersey(newJersey);
      }

      // Add to flash sale
      const updatedIds = [...activeIds, newJerseyId];
      const updatedConfig: FlashSaleConfig = {
        ...flashSaleConfig,
        jerseyIds: updatedIds,
      };

      await onSaveFlashSaleConfig(updatedConfig);
      
      // Reset form
      setNewName('');
      setNewImage('');
      setSelectedTab('pick');
      showNotice(`"${newJersey.name}" added to store & Flash Sale!`);
    } catch (err) {
      console.error('Error creating jersey', err);
    } finally {
      setIsSaving(false);
    }
  };

  const discRate = flashSaleConfig.discountPercent || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl bg-[#0e120f] border border-orange-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-950/80 via-zinc-900 to-black border-b border-orange-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-600/20 border border-orange-500/40 text-orange-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Manage Flash Sale Jerseys</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {currentFlashJerseys.length} Active
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Choose which jerseys appear in the Flash Sale section. Add new kits or remove existing ones with 1 click.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-500 text-zinc-950 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* SECTION 1: Currently Active Flash Sale Jerseys */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                  🔥 Currently Displayed in Flash Sale ({currentFlashJerseys.length})
                </span>
                {discRate > 0 && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono">
                    -{discRate}% OFF APPLIED
                  </span>
                )}
              </div>
              <span className="text-[11px] text-zinc-400">
                Visible on homepage & top flash deals
              </span>
            </div>

            {currentFlashJerseys.length === 0 ? (
              <div className="p-6 bg-zinc-950/80 border border-dashed border-orange-500/30 rounded-xl text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-orange-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">No jerseys in Flash Sale yet</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Pick jerseys from the catalog below or create a new one to show in the Flash Sale section.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentFlashJerseys.map((jersey, idx) => {
                  const finalPrice = discRate > 0 ? Math.round(jersey.priceBDT * (1 - discRate / 100)) : jersey.priceBDT;
                  return (
                    <div
                      key={jersey.id}
                      className="relative bg-zinc-950 border-2 border-orange-500/50 rounded-xl p-2.5 flex flex-col justify-between group shadow-lg"
                    >
                      {/* Position Badge */}
                      <span className="absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded-full bg-orange-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow">
                        #{idx + 1}
                      </span>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => handleRemoveJersey(jersey.id, e)}
                        className="absolute top-1.5 right-1.5 z-10 p-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg transition-all shadow-md cursor-pointer"
                        title="Remove from Flash Sale"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Jersey Image */}
                      <div className="bg-black/60 rounded-lg p-2 min-h-[110px] flex items-center justify-center mb-2">
                        <img
                          src={jersey.image}
                          alt={jersey.name}
                          referrerPolicy="no-referrer"
                          className="max-h-24 object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Jersey Info */}
                      <div>
                        <span className="text-[9.5px] font-bold text-emerald-400 uppercase block truncate">
                          {jersey.country}
                        </span>
                        <h5 className="text-xs font-bold text-white line-clamp-1">
                          {jersey.name}
                        </h5>
                        <div className="flex items-baseline gap-1 mt-1 font-mono">
                          <span className="text-xs font-black text-orange-400">
                            Tk {finalPrice}
                          </span>
                          {discRate > 0 && (
                            <span className="text-[10px] text-zinc-500 line-through">
                              Tk {jersey.priceBDT}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Re-order buttons */}
                      <div className="flex items-center justify-between gap-1 pt-2 mt-2 border-t border-white/10 text-[10px] text-zinc-400 font-mono">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveJersey(idx, 'left')}
                          className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                        >
                          ← Left
                        </button>
                        <span className="text-[9px] text-orange-300 font-semibold">Active</span>
                        <button
                          type="button"
                          disabled={idx === currentFlashJerseys.length - 1}
                          onClick={() => handleMoveJersey(idx, 'right')}
                          className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                        >
                          Right →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 2: Selector Tabs - Pick from Catalog vs Create New Jersey */}
          <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTab('pick')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedTab === 'pick'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Pick from Store Catalog ({catalogJerseys.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('create')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedTab === 'create'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Create & Add New Jersey</span>
                </button>
              </div>

              {selectedTab === 'pick' && (
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jersey (e.g. Brazil)..."
                    className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-white/15 rounded-lg text-xs text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none font-sans"
                  />
                </div>
              )}
            </div>

            {/* TAB: Pick from Catalog */}
            {selectedTab === 'pick' && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400">
                  Click on any jersey below to add or remove it from the Flash Sale section:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {filteredCatalog.map((jersey) => {
                    const isSelected = activeIds.includes(jersey.id);
                    return (
                      <div
                        key={jersey.id}
                        onClick={() => handleToggleJersey(jersey.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-orange-950/30 border-orange-500/60 shadow-md'
                            : 'bg-zinc-900/60 hover:bg-zinc-900 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={jersey.image}
                            alt={jersey.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-contain bg-black/50 rounded-lg p-1 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-emerald-400 block truncate">
                              {jersey.country}
                            </span>
                            <h6 className="text-xs font-bold text-white truncate">
                              {jersey.name}
                            </h6>
                            <span className="text-[11px] font-mono text-zinc-400 block">
                              Tk {jersey.priceBDT}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
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
              </div>
            )}

            {/* TAB: Create & Add New Jersey */}
            {selectedTab === 'create' && (
              <form onSubmit={handleCreateAndAddJersey} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      Country / Team:
                    </label>
                    <select
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Brazil">🇧🇷 Brazil</option>
                      <option value="Argentina">🇦🇷 Argentina</option>
                      <option value="Bangladesh">🇧🇩 Bangladesh</option>
                      <option value="Portugal">🇵🇹 Portugal</option>
                      <option value="France">🇫🇷 France</option>
                      <option value="Spain">🇪🇸 Spain</option>
                      <option value="Germany">🇩🇪 Germany</option>
                      <option value="Japan">🇯🇵 Japan</option>
                      <option value="England">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</option>
                      <option value="Italy">🇮🇹 Italy</option>
                      <option value="Custom Edition">✨ Special Club / Player Edition</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      Regular Price (Tk):
                    </label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs text-white font-mono focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      Jersey Full Name:
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Brazil Special Black Edition Kit"
                      className="w-full px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      Jersey Image (Upload or URL):
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="Image URL or upload a file..."
                        className="flex-1 px-3 py-2 bg-zinc-900 border border-white/15 rounded-lg text-xs text-white focus:border-orange-500 focus:outline-none"
                      />
                      <label className="w-full sm:w-auto px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/20 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-orange-400" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressed = await compressImageFile(file, 1000, 0.82);
                                setNewImage(compressed);
                              } catch (err) {
                                console.warn('Compression failed', err);
                                const reader = new FileReader();
                                reader.onload = () => setNewImage(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    {newImage && (
                      <div className="mt-2 flex items-center gap-2">
                        <img src={newImage} alt="Preview" className="w-10 h-10 object-contain rounded bg-zinc-950 border border-white/10" />
                        <span className="text-[10px] text-emerald-400 font-mono">Image attached successfully</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving || !newName.trim()}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create & Add to Flash Sale</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>Selected for Flash Sale:</span>
            <strong className="text-orange-400">{currentFlashJerseys.length} Kits</strong>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
          >
            Done / Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
