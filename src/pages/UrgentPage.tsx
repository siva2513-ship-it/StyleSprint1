import { Clock, Zap, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UrgentPage() {
  return (
    <main className="pt-32 px-10 pb-20 bg-white text-black min-h-screen">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-8 animate-pulse">
          <Zap size={32} className="fill-black" />
        </div>
        <h1 className="luxury-title text-6xl !tracking-tighter !text-black mb-4">60 Min<br />Guarantee</h1>
        <p className="max-w-xl text-base opacity-60 font-medium">We deliver your clothes fast. If you need it now, StyleSprint makes it happen in under an hour.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black/10">
        {[
          { icon: MapPin, title: 'Across Mumbai', desc: 'We deliver fast in most areas of the city.' },
          { icon: Clock, title: 'Real Fast', desc: 'From shop to your door in 60 minutes or less.' },
          { icon: Zap, title: 'Best Riders', desc: 'Our riders are ready to help you any time.' }
        ].map((item, i) => (
          <div key={i} className="p-10 border-r border-black/10 last:border-r-0 flex flex-col items-start gap-4">
            <item.icon size={24} />
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="opacity-60 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <Link to="/stores" className="inline-flex items-center gap-4 bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform uppercase tracking-widest text-[10px]">
          See Shops <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}
