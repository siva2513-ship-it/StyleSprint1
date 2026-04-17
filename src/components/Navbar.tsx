import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search, MapPin } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { motion } from 'motion/react';

export default function Navbar() {
  const { items } = useCart();
  const { profile } = useUser();
  const itemCount = items.reduce((a, b) => a + b.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-md border-bottom border-white/10 h-16 flex items-center px-10">
      <div className="flex-1 flex items-center gap-8">
        <Link to="/" className="luxury-title text-xl !tracking-widest flex items-center gap-1 group">
          Style<span className="luxury-title-serif !text-2xl !italic !lowercase group-hover:tracking-widest transition-all">sprint</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/stores" className="micro-label hover:opacity-100 transition-opacity">Shops</Link>
          <Link to="/curated" className="micro-label hover:opacity-100 transition-opacity">Clothes</Link>
          <Link to="/urgent" className="micro-label hover:opacity-100 transition-opacity text-red-500">60m Delivery</Link>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
          <MapPin size={12} className="opacity-40" />
          <span className="text-[10px] font-medium tracking-tight">Mumbai</span>
        </div>
        
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-40">
          <Search size={18} />
        </button>
        
        <Link to="/profile" className="p-1 hover:bg-white/10 rounded-full transition-colors">
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="Me" className="w-8 h-8 rounded-full border border-white/10" referrerPolicy="no-referrer" />
          ) : (
            <User size={18} className="opacity-40" />
          )}
        </Link>
        
        <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
          <ShoppingBag size={20} />
          {itemCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 w-4 h-4 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center"
            >
              {itemCount}
            </motion.span>
          )}
        </Link>
      </div>
    </nav>
  );
}
