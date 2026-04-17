import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, LogIn } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/profile');
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-10 pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
          <User size={32} className="opacity-40" />
        </div>
        
        <h1 className="luxury-title text-4xl mb-4">Welcome</h1>
        <p className="text-white/40 mb-10 text-sm">Sign in to StyleSprint to save shops and track your orders.</p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-[0.98]"
        >
          <LogIn size={20} />
          Sign in with Google
        </button>
        
        <p className="mt-8 text-[10px] opacity-20 uppercase tracking-[0.2em]">Safe and Secure Authentication</p>
      </motion.div>
    </main>
  );
}
