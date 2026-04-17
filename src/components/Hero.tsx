import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-center px-10 pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0,transparent_50%)]" />
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="micro-label mb-4 block">Fast Clothes Delivery</span>
          <h1 className="luxury-title mb-6 !text-6xl md:!text-8xl">
            Style <span className="luxury-title-serif">delivered</span><br />
            to your <span className="luxury-title-serif">door</span><br />
            in 60 mins.
          </h1>
          
          <p className="max-w-md text-base text-white/60 mb-10 font-light leading-relaxed">
            Get clothes delivered fast from local shops near you in under an hour.
          </p>

          <div className="flex items-center gap-6">
            <Link 
              to="/stores" 
              className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
            >
              See Shops
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="px-8 py-4 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-colors">
              How it works
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="flex gap-4">
          <div className="w-60 h-80 glass-card p-4 flex flex-col justify-end">
            <img 
              src="https://picsum.photos/seed/fashion1/400/600" 
              alt="Curated" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10">
              <span className="micro-label text-white">Spring 2024</span>
              <p className="text-xl font-display font-medium">Linen Classics</p>
            </div>
          </div>
          <div className="w-60 h-80 glass-card p-4 flex flex-col justify-end translate-y-20">
            <img 
              src="https://picsum.photos/seed/fashion2/400/600" 
              alt="Nearby" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10">
              <span className="micro-label text-white">Available Now</span>
              <p className="text-xl font-display font-medium">Midnight Streetwear</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
