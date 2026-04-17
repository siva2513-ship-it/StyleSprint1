import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, ShieldCheck, XCircle, ChevronRight, RotateCcw, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Order } from '../types';

const CANCEL_REASONS = [
  "Changed my mind",
  "Incorrect items",
  "Found better price elsewhere",
  "Delivery is taking too long",
  "Ordering by mistake"
];

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const unsub = onSnapshot(doc(db, 'orders', id), (doc) => {
      if (doc.exists()) {
        setOrder({ id: doc.id, ...doc.data() } as Order);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order || !id || !selectedReason) return;

    try {
      setIsCancelling(true);
      await updateDoc(doc(db, 'orders', id), {
        status: 'cancelled',
        cancelReason: selectedReason
      });
      setShowSurvey(false);
      setShowCancelSuccess(true);
      setTimeout(() => setShowCancelSuccess(false), 3000);
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel order. It might already be out for delivery.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleItemAction = async (productId: string, action: 'return' | 'replace') => {
    if (!order || !id) return;
    const updatedItems = order.items.map(item => {
      if (item.productId === productId) {
        return { 
          ...item, 
          returnStatus: action === 'return' ? 'return_requested' : 'replace_requested' 
        };
      }
      return item;
    });

    try {
      await updateDoc(doc(db, 'orders', id), {
        items: updatedItems
      });
      alert(`Your request to ${action} this item has been submitted.`);
    } catch (error) {
      console.error("Action error:", error);
      alert("Failed to submit request.");
    }
  };

  if (loading) return <div className="pt-40 text-center micro-label">Finding your order...</div>;
  if (!order) return <div className="pt-40 text-center micro-label">Order not found</div>;

  const steps = [
    { key: 'pending', icon: Clock, label: 'We Got It' },
    { key: 'preparing', icon: Package, label: 'Shop Packing' },
    { key: 'out_for_delivery', icon: Truck, label: 'On The Way' },
    { key: 'delivered', icon: CheckCircle, label: 'It is Here' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);
  const progress = order.status === 'cancelled' ? 0 : ((currentStepIndex + 1) / steps.length) * 100;
  
  const canCancel = order.status === 'pending' || order.status === 'preparing';

  return (
    <main className="pt-24 px-10 pb-20 min-h-screen max-w-6xl mx-auto">
      <AnimatePresence>
        {showSurvey && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card p-10 max-w-md w-full"
            >
              <h2 className="luxury-title text-2xl mb-6">Why cancel?</h2>
              <div className="space-y-3 mb-8">
                {CANCEL_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                      selectedReason === reason 
                        ? 'bg-white text-black border-white' 
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-medium">{reason}</span>
                    <ChevronRight size={16} className={selectedReason === reason ? 'opacity-100' : 'opacity-0 group-hover:opacity-40 transition-opacity'} />
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowSurvey(false)}
                  className="flex-1 py-4 border border-white/10 rounded-full text-xs uppercase font-bold tracking-widest"
                >
                  Go Back
                </button>
                <button 
                  disabled={!selectedReason || isCancelling}
                  onClick={handleCancelOrder}
                  className="flex-1 py-4 bg-red-500 text-white rounded-full text-xs uppercase font-bold tracking-widest disabled:opacity-30"
                >
                  {isCancelling ? 'Processing...' : 'Cancel Order'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showCancelSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black flex items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} className="text-red-500" />
              </div>
              <h2 className="luxury-title text-4xl mb-4 italic">Your order is canceled</h2>
              <p className="micro-label !opacity-30">We hope to serve you better next time.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Side: Info & Map */}
        <div className="lg:col-span-2">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <span className="micro-label">Tracking ID: {id?.toUpperCase()}</span>
              <h1 className="luxury-title text-4xl mt-2">{order.status === 'cancelled' ? 'Order Cancelled' : 'Delivery Status'}</h1>
            </div>
            {canCancel && (
              <button 
                onClick={() => setShowSurvey(true)}
                className="micro-label !text-red-500 hover:underline"
              >
                Cancel Order
              </button>
            )}
          </div>

          {/* Map Visualization */}
          <div className="glass-card aspect-[16/9] relative overflow-hidden mb-10 bg-[#111111] opacity-90">
            {order.status === 'cancelled' && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="text-center">
                  <XCircle size={48} className="text-red-500 mx-auto mb-4" />
                  <p className="micro-label !text-white">This delivery was cancelled.</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 opacity-20">
              {/* Simple stylized SVG grid map */}
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Path */}
            <svg className="absolute inset-0 w-full h-full">
              <motion.path
                d="M 100 250 L 300 150 L 600 200"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="10 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>

            {/* Shop Marker */}
            <div className="absolute top-[140px] left-[290px] text-center">
              <div className="w-4 h-4 bg-white rounded-full mx-auto shadow-[0_0_15px_white]" />
              <span className="micro-label mt-2 block !text-[6px]">Shop</span>
            </div>

            {/* Agent Marker */}
            <motion.div 
              animate={{ 
                x: order.status === 'out_for_delivery' ? 450 : 300, 
                y: order.status === 'out_for_delivery' ? 175 : 150 
              }}
              className="absolute text-center z-20"
            >
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                <Truck size={12} className="text-white" />
              </div>
              <span className="micro-label mt-2 block !text-[6px]">Rider</span>
            </motion.div>

            {/* Home Marker */}
            <div className="absolute bottom-[40px] right-[40px] text-center">
              <div className="w-4 h-4 border-2 border-white rounded-full mx-auto" />
              <span className="micro-label mt-2 block !text-[6px]">You</span>
            </div>
            
            <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="micro-label !text-white !opacity-100 italic">Live Tracking Active</span>
            </div>
          </div>

          <div className="glass-card p-10">
            <div className="relative h-1 bg-white/5 mb-12">
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                className="absolute inset-y-0 bg-white"
              />
              <div className="absolute inset-0 flex justify-between -top-4">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i <= currentStepIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-brand-bg transition-colors ${isActive ? 'bg-white text-black' : 'opacity-20'}`}>
                        <Icon size={16} />
                      </div>
                      <span className={`micro-label mt-3 block !text-[6px] ${!isActive && 'opacity-20'}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-white/5">
              <h3 className="micro-label mb-6">Order Items</h3>
              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div>
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">Size: {item.size || 'M'} • Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold">₹{item.price.toLocaleString()}</span>
                      {order.status === 'delivered' && (
                        <div className="flex gap-2">
                          {item.returnStatus && item.returnStatus !== 'none' ? (
                            <span className="text-[8px] uppercase font-bold px-3 py-1 bg-white/10 rounded-full flex items-center gap-1">
                              {item.returnStatus === 'return_requested' ? <RotateCcw size={10} /> : <RefreshCw size={10} />}
                              {item.returnStatus.replace('_', ' ')}
                            </span>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleItemAction(item.productId, 'return')}
                                className="text-[8px] uppercase font-bold px-3 py-1 border border-white/10 rounded-full hover:bg-white/5 transition-colors flex items-center gap-1"
                              >
                                <RotateCcw size={10} /> Return
                              </button>
                              <button 
                                onClick={() => handleItemAction(item.productId, 'replace')}
                                className="text-[8px] uppercase font-bold px-3 py-1 border border-white/10 rounded-full hover:bg-white/5 transition-colors flex items-center gap-1"
                              >
                                <RefreshCw size={10} /> Replace
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Agent & Store */}
        <div className="space-y-8">
          <div className="glass-card p-8">
            <h3 className="micro-label mb-6">Delivery Rider</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                <img 
                  src="https://picsum.photos/seed/rider/200" 
                  alt="Agent" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm">{order.agentInfo?.name || 'Rahul S.'}</h4>
                  <ShieldCheck size={14} className="text-blue-400" />
                </div>
                <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">Verified Partner</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Truck size={14} className="opacity-40" />
                  <span className="text-[10px] font-medium">{order.agentInfo?.vehicle || 'Electric Scooter'}</span>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = `tel:${order.agentInfo?.phone || '+919876543210'}`}
                className="w-full py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-2 text-xs uppercase"
              >
                <Phone size={14} />
                Call Rider
              </button>
            </div>
          </div>

          <div className="glass-card p-8 bg-white text-black">
            <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 opacity-100">Store Note</h3>
            <p className="text-sm font-medium italic opacity-70 leading-relaxed">"Your StyleSprint order is packed with care. We hope you love your new clothes!"</p>
          </div>
          
          <div className="glass-card p-8 border-dashed border-white/10">
            <h3 className="micro-label mb-4">Need Help?</h3>
            <p className="text-[10px] opacity-40 leading-relaxed">Our support team is active. Call us at 1800-STYLE for any delivery updates.</p>
          </div>
        </div>

      </div>
    </main>
  );
}
