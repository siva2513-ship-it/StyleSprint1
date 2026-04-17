import { useCart } from '../contexts/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { getStylingAdvice } from '../services/geminiService';
import { db, auth } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function CartPage() {
  const { items, removeItem, total, clearCart } = useCart();
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length > 0) {
      setLoadingAdvice(true);
      getStylingAdvice(items).then(res => {
        setAdvice(res);
        setLoadingAdvice(false);
      });
    } else {
      setAdvice(null);
    }
  }, [items.length]);

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      alert("Please sign in to place an order.");
      return;
    }

    try {
      setIsCheckingOut(true);
      const orderId = 'order-' + Math.random().toString(36).substr(2, 9);
      const orderData = {
        customerId: auth.currentUser.uid,
        storeId: items[0].storeId, // Simplification: orders from one store at a time
        items: items.map(i => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity
        })),
        total,
        status: 'preparing', // Start at preparing for better demo
        createdAt: serverTimestamp(),
        deliveryLocation: { address: 'Current Location', lat: 18.93, lng: 72.83 },
        agentInfo: {
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          vehicle: 'Electric Scooter (MH01-EF-1234)',
          currentLocation: { lat: 18.95, lng: 72.82 }
        }
      };

      await setDoc(doc(db, 'orders', orderId), orderData);
      clearCart();
      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/order/${orderId}`);
      }, 3000);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="pt-32 px-10 pb-20 min-h-screen relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <CheckCircle size={48} className="text-white" />
              </div>
              <h2 className="luxury-title text-4xl !text-white mb-2">Order Successful</h2>
              <p className="text-white/40 micro-label tracking-widest">Redirecting to track your clothes...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="luxury-title text-4xl mb-12">Your Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className="glass-card p-6 flex items-center gap-6"
            >
              <img 
                src={item.images[0]} 
                alt={item.name} 
                className="w-20 h-28 object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <h3 className="text-sm font-bold">{item.name}</h3>
                <p className="opacity-40 text-xs mb-2">₹{item.price.toLocaleString()}</p>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded">Qty: {item.quantity}</span>
                </div>
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="p-2 hover:bg-white/10 rounded-full text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}

          {items.length === 0 && (
            <div className="py-20 text-center glass-card">
              <ShoppingBag className="mx-auto mb-4 opacity-10" size={48} />
              <p className="text-white/40 italic text-sm">Your bag is empty.</p>
            </div>
          )}

          {items.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 glass-card p-8 border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02]"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-white opacity-40" size={20} />
                <h3 className="micro-label !text-white !opacity-100 text-sm">AI Advice</h3>
              </div>
              
              {loadingAdvice ? (
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200" />
                </div>
              ) : (
                <div className="text-white/60 italic text-sm leading-relaxed whitespace-pre-line">
                  {advice}
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card p-8 sticky top-32">
            <h3 className="micro-label mb-6">Total Cost</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs">
                <span className="opacity-40">Items</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="opacity-40">Delivery</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="font-medium">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              disabled={items.length === 0 || isCheckingOut}
              onClick={handleCheckout}
              className="w-full py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none text-xs uppercase"
            >
              {isCheckingOut ? 'Checking out...' : 'Order Now'}
              {!isCheckingOut && <ArrowRight size={16} />}
            </button>
            <p className="text-[9px] text-center mt-4 opacity-20">Terms apply for fast delivery.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
