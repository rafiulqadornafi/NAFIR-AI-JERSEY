import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Jersey } from '../types';

export interface CartItem {
  jersey: Jersey;
  size: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (jerseyId: string, size: string, delta: number) => void;
  onRemoveItem: (jerseyId: string, size: string) => void;
  onCheckout: () => void;
  bKashNumber: string;
  nagadNumber: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalBDT = cartItems.reduce((sum, item) => sum + item.jersey.priceBDT * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#0e120f] border-l border-white/15 text-white shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#131915]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">Shopping Bag</h3>
                    <p className="text-[11px] text-zinc-400 font-medium">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Close Cart"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-white/5">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => {
                    const regularPriceBDT = Math.round(item.jersey.priceBDT * 1.2);
                    return (
                      <div
                        key={`${item.jersey.id}-${item.size}`}
                        className="pt-3.5 first:pt-0 flex items-start gap-3.5 group"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-20 bg-black/60 border border-white/10 rounded-lg p-1.5 flex items-center justify-center shrink-0 overflow-hidden relative">
                          <img
                            src={item.jersey.image}
                            alt={item.jersey.name}
                            className="max-h-full object-contain drop-shadow"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-white uppercase tracking-tight truncate">
                              {item.jersey.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.jersey.id, item.size)}
                              className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                              Size: {item.size}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              {item.jersey.country}
                            </span>
                          </div>

                          {/* Price & Quantity Controls */}
                          <div className="flex items-center justify-between mt-2.5">
                            <div>
                              <span className="text-xs font-mono font-black text-white">
                                Tk {(item.jersey.priceBDT * item.quantity).toLocaleString()}
                              </span>
                              <span className="text-[10px] text-zinc-500 line-through font-mono ml-1.5">
                                Tk {(regularPriceBDT * item.quantity).toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 bg-black/60 border border-white/15 rounded-md p-0.5">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.jersey.id, item.size, -1)}
                                className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                                title="Decrease"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-mono font-bold text-white">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.jersey.id, item.size, 1)}
                                className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                                title="Increase"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">Your Bag is Empty</h4>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                      Explore official player-version national kits and add items to your cart.
                    </p>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-white/10 bg-[#131915] space-y-3.5">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-mono text-white font-bold">Tk {subtotalBDT.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Home Delivery (64 Districts)</span>
                      <span className="text-emerald-400 font-medium">Contact via FB for area rate</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm font-bold text-white">
                      <span>Estimated Total</span>
                      <span className="text-base font-mono font-black text-emerald-400">
                        Tk {subtotalBDT.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onCheckout();
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-400 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Authentic
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" /> Fast Dispatch
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
