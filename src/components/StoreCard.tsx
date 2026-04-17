import React from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, ArrowRight, Heart } from 'lucide-react';
import { Store } from '../types';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function StoreCard({ store }: { store: Store }) {
  const { toggleFavoriteStore, isFavorite } = useUser();
  const isFav = isFavorite(store.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteStore(store.id);
  };

  return (
    <Link to={`/stores/${store.id}`}>
      <motion.div 
        whileHover={{ y: -10 }}
        className="glass-card overflow-hidden group h-full flex flex-col relative"
      >
        <button 
          onClick={handleFavorite}
          className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white transition-colors group/fav"
        >
          <Heart size={14} className={isFav ? "fill-red-500 text-red-500" : "text-white group-hover/fav:text-black"} />
        </button>

        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={store.image} 
            alt={store.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-bold">{store.rating}</span>
          </div>
          <div className="absolute bottom-3 left-3 bg-white text-black px-2 py-0.5 rounded-full micro-label !text-[6px]">
            {store.category}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-sm font-bold mb-1 group-hover:underline">{store.name}</h3>
          <div className="flex items-center gap-2 opacity-40 mb-4">
            <MapPin size={10} />
            <span className="text-[10px] truncate">{store.address}</span>
          </div>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-20">Ready in 15m</span>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
