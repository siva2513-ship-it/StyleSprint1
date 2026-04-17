import { useParams } from 'react-router-dom';
import { MOCK_STORES, MOCK_PRODUCTS } from '../data/mockData';
import { ShoppingBag, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion } from 'motion/react';

export default function StoreDetail() {
  const { id } = useParams();
  const store = MOCK_STORES.find(s => s.id === id);
  const products = MOCK_PRODUCTS.filter(p => p.storeId === id);
  const { addItem } = useCart();

  if (!store) return <div className="pt-40 px-10">Store not found</div>;

  return (
    <main className="pt-32 px-10 pb-20">
      <div className="relative h-80 rounded-3xl overflow-hidden mb-12">
        <img 
          src={store.image} 
          alt={store.name} 
          className="w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg to-transparent" />
        <div className="absolute bottom-6 left-6">
          <span className="micro-label">Good Shop</span>
          <h1 className="luxury-title text-4xl mt-2">{store.name}</h1>
          <p className="opacity-40 text-xs mt-2">{store.address} • Closes at 10 PM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -5 }}
            className="glass-card p-4 group"
          >
            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 relative">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => addItem(product)}
                className="absolute bottom-3 right-3 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex justify-between items-start mb-0.5">
              <h3 className="font-bold text-sm tracking-tight">{product.name}</h3>
              <span className="font-medium text-xs">₹{product.price.toLocaleString()}</span>
            </div>
            <span className="micro-label !text-[7px] !opacity-20">{product.category}</span>
          </motion.div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full py-20 text-center glass-card">
            <ShoppingBag className="mx-auto mb-4 opacity-20" size={48} />
            <p className="text-white/40">New collections coming soon to this store.</p>
          </div>
        )}
      </div>
    </main>
  );
}
