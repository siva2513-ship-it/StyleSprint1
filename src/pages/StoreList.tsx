import { useState, useMemo } from 'react';
import { MOCK_STORES } from '../data/mockData';
import StoreCard from '../components/StoreCard';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';

export default function StoreList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Luxury', 'Streetwear', 'Ethnic'];

  const filteredStores = useMemo(() => {
    return MOCK_STORES.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            store.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || store.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="pt-32 px-10 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-8">
        <div>
          <span className="micro-label">Our Shops</span>
          <h1 className="luxury-title text-5xl mt-3">
            Local shops {selectedCategory !== 'All' && <span className="luxury-title-serif block mt-1">— {selectedCategory}</span>}
          </h1>
        </div>

        <div className="w-full lg:w-auto flex flex-col gap-6">
          {/* Search Bar */}
          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity" size={18} />
            <input 
              type="text"
              placeholder="Search stores or areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-10 micro-label !text-sm !tracking-normal focus:outline-none focus:border-white/30 transition-all placeholder:opacity-40"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent text-white border-white/10 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredStores.map((store, index) => (
            <motion.div
              key={store.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
            >
              <StoreCard store={store} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredStores.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-40 text-center glass-card"
          >
            <p className="luxury-title-serif !text-2xl !italic opacity-40">No boutiques found matching your selection.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-6 micro-label underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
