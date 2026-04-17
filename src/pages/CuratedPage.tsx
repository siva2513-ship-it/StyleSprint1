import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function CuratedPage() {
  return (
    <main className="pt-32 px-10 pb-20">
      <div className="mb-12">
        <span className="micro-label">Our Picks</span>
        <h1 className="luxury-title text-6xl mt-4">Good<br />Clothes</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-card aspect-video relative overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/curated1/1200/800" 
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" 
            alt="Editorial"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-12">
            <h3 className="luxury-title text-3xl mb-4">Night Clothes</h3>
            <p className="max-w-md opacity-60 font-light mb-8">Special clothes for your night out in the city. Delivered fast.</p>
            <button className="flex items-center gap-2 micro-label !opacity-100 group-hover:gap-4 transition-all">
              See All <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <div className="glass-card p-12 flex flex-col justify-center">
            <Sparkles className="mb-6 opacity-40" />
            <h3 className="text-2xl font-display mb-4">Just For You</h3>
            <p className="opacity-60 font-light mb-8">We find the best shops near you and show you the clothes you will love.</p>
            <div className="flex gap-4">
              <div className="w-12 h-1 bg-white" />
              <div className="w-8 h-1 bg-white/20" />
              <div className="w-8 h-1 bg-white/20" />
            </div>
          </div>
          
          <div className="flex gap-8 h-80">
            <div className="flex-1 glass-card overflow-hidden">
               <img src="https://picsum.photos/seed/acc1/400/400" className="w-full h-full object-cover opacity-60" alt="Accessory" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 glass-card overflow-hidden">
               <img src="https://picsum.photos/seed/acc2/400/400" className="w-full h-full object-cover opacity-60" alt="Accessory" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
