import { User, LogOut, Package, Settings, MapPin, Heart, Clock, X, RotateCcw, RefreshCw, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';
import { MOCK_STORES } from '../data/mockData';
import StoreCard from '../components/StoreCard';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Order } from '../types';
import { useNavigate } from 'react-router-dom';

const CANCEL_REASONS = [
  "Changed my mind",
  "Incorrect items",
  "Found better price elsewhere",
  "Delivery is taking too long",
  "Ordering by mistake"
];

export default function ProfilePage() {
  const { profile, loading: profileLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showCancelSurvey, setShowCancelSurvey] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const navigate = useNavigate();

  const favoriteStores = MOCK_STORES.filter(s => profile?.favoriteStoreIds?.includes(s.id));

  useEffect(() => {
    if (!profileLoading && !profile) {
      navigate('/login');
      return;
    }

    if (profile) {
      const q = query(
        collection(db, 'orders'),
        where('customerId', '==', profile.uid),
        orderBy('createdAt', 'desc')
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const o = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(o);
        setLoadingOrders(false);
      });

      return () => unsub();
    }
  }, [profile, profileLoading, navigate]);

  const handleCancelOrder = async () => {
    if (!showCancelSurvey || !selectedReason) return;

    try {
      setIsProcessing(true);
      await updateDoc(doc(db, 'orders', showCancelSurvey), {
        status: 'cancelled',
        cancelReason: selectedReason
      });
      setShowCancelSurvey(null);
      setSelectedReason(null);
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Could not cancel. It may have already shipped.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleItemAction = async (order: Order, productId: string, action: 'return' | 'replace') => {
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
      setIsProcessing(true);
      await updateDoc(doc(db, 'orders', order.id), {
        items: updatedItems
      });
      alert(`Your request to ${action} this item has been submitted.`);
    } catch (error) {
      console.error("Action error:", error);
      alert("Failed to submit request.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (profileLoading) return <div className="pt-40 text-center micro-label">Checking...</div>;
  if (!profile) return null;

  return (
    <main className="pt-32 px-10 pb-20 max-w-6xl mx-auto min-h-screen">
      <AnimatePresence>
        {showCancelSurvey && (
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
                  onClick={() => { setShowCancelSurvey(null); setSelectedReason(null); }}
                  className="flex-1 py-4 border border-white/10 rounded-full text-xs uppercase font-bold tracking-widest"
                >
                  Back
                </button>
                <button 
                  disabled={!selectedReason || isProcessing}
                  onClick={handleCancelOrder}
                  className="flex-1 py-4 bg-red-500 text-white rounded-full text-xs uppercase font-bold tracking-widest disabled:opacity-30"
                >
                  {isProcessing ? '...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end justify-between mb-12">
        <h1 className="luxury-title text-5xl">The Member</h1>
        <button onClick={() => auth.signOut()} className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity micro-label">
          <LogOut size={14} />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-8">
          <div className="glass-card p-8 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border border-white/20 p-1 mb-4">
              <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                {profile?.photoURL ? <img src={profile.photoURL} alt="Me" /> : <User size={40} className="opacity-20" />}
              </div>
            </div>
            <h3 className="text-xl font-display">{profile?.displayName || 'Guest member'}</h3>
            <p className="text-xs opacity-40 mt-1">{profile?.email}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Package size={18} className="opacity-40" />
                <h3 className="micro-label !text-white !opacity-100">Order History</h3>
              </div>
              
              <div className="space-y-4">
                {loadingOrders ? (
                  <p className="text-[10px] opacity-20 uppercase tracking-widest">Finding...</p>
                ) : orders.length > 0 ? (
                  orders.map(order => (
                    <motion.div 
                      key={order.id}
                      layout
                      className="rounded-2xl border border-white/10 overflow-hidden"
                    >
                      <div 
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="flex items-center justify-between p-4 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-[10px] font-bold">₹{order.total.toLocaleString()}</p>
                          <p className={`text-[8px] uppercase font-bold ${order.status === 'cancelled' ? 'text-red-500' : 'opacity-40'}`}>
                            {order.status.replace(/_/g, ' ')}
                          </p>
                        </div>
                        <ChevronRight size={14} className={`opacity-20 transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`} />
                      </div>
                      
                      <AnimatePresence>
                        {expandedOrder === order.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/20 p-4 border-t border-white/5 space-y-4"
                          >
                            {order.items.map((item, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-medium opacity-60 leading-tight">{item.name} (x{item.quantity})</span>
                                  <span className="text-[10px] font-bold">₹{item.price.toLocaleString()}</span>
                                </div>
                                {order.status === 'delivered' && (
                                  <div className="flex gap-2">
                                    {item.returnStatus && item.returnStatus !== 'none' ? (
                                      <span className="text-[7px] uppercase font-bold px-2 py-1 bg-white/10 rounded flex items-center gap-1">
                                        {item.returnStatus === 'return_requested' ? <RotateCcw size={8} /> : <RefreshCw size={8} />}
                                        {item.returnStatus.replace('_', ' ')}
                                      </span>
                                    ) : (
                                      <>
                                        <button 
                                          onClick={() => handleItemAction(order, item.productId, 'return')}
                                          className="text-[7px] uppercase font-bold px-2 py-1 border border-white/10 rounded hover:bg-white/5 transition-colors flex items-center gap-1"
                                        >
                                          <RotateCcw size={8} /> Return
                                        </button>
                                        <button 
                                          onClick={() => handleItemAction(order, item.productId, 'replace')}
                                          className="text-[7px] uppercase font-bold px-2 py-1 border border-white/10 rounded hover:bg-white/5 transition-colors flex items-center gap-1"
                                        >
                                          <RefreshCw size={8} /> Replace
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}

                            <div className="pt-2 flex gap-2">
                              <button 
                                onClick={() => navigate(`/order/${order.id}`)}
                                className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg micro-label !opacity-100 !text-[8px] transition-colors"
                              >
                                Track Details
                              </button>
                              {(order.status === 'pending' || order.status === 'preparing') && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setShowCancelSurvey(order.id); }}
                                  className="flex-1 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg micro-label !opacity-100 !text-[8px] transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-[10px] opacity-20 italic">No orders yet</p>
                )}
              </div>
            </div>

            {[
              { icon: MapPin, label: 'Addresses', value: '2 Locations' },
              { icon: Settings, label: 'Account', value: 'Preferences' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 5 }}
                className="glass-card p-6 flex items-center gap-4 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="micro-label opacity-40 !text-[8px]">{item.label}</p>
                  <p className="font-bold text-sm tracking-tight">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <Heart size={20} className="text-red-500 fill-red-500" />
            <h2 className="micro-label !text-white !opacity-100 text-lg">Favorite Shops</h2>
          </div>

          {favoriteStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {favoriteStores.map((store) => (
                  <motion.div 
                    key={store.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <StoreCard store={store} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="glass-card p-20 text-center border-dashed border-white/10">
              <Heart size={40} className="mx-auto mb-4 opacity-10" />
              <p className="text-white/40 italic">You haven't saved any shops yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
