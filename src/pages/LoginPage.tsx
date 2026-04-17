import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, LogIn, Lock } from 'lucide-react';
import React, { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMockLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password) return;

    const mockEmail = `${name.toLowerCase().replace(/\s+/g, '.')}@stylesprint.mock`;
    const mockPassword = password.length >= 6 ? password : `${password}stylesprint`; // Firebase requires 6 chars

    try {
      setLoading(true);
      let userCredential;
      
      try {
        // Try signing in
        userCredential = await signInWithEmailAndPassword(auth, mockEmail, mockPassword);
      } catch (signInError: any) {
        // If user doesn't exist, create them
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          userCredential = await createUserWithEmailAndPassword(auth, mockEmail, mockPassword);
        } else {
          throw signInError;
        }
      }

      const { user } = userCredential;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: name,
          email: mockEmail,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          favoriteStoreIds: []
        });
      }

      navigate('/profile');
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/operation-not-allowed') {
        alert("Please enable Email/Password authentication in your Firebase console.");
      } else if (error.code === 'auth/weak-password') {
        alert("Password must be at least 6 characters.");
      } else {
        alert(`Login simulation failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-10 pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 max-w-md w-full"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
          <User size={32} className="opacity-40" />
        </div>
        
        <h1 className="luxury-title text-4xl mb-4 text-center">Identity</h1>
        <p className="text-white/40 mb-10 text-sm text-center">Enter any name and password to enter the boutique.</p>
        
        <form onSubmit={handleMockLogin} className="space-y-6">
          <div className="space-y-2">
            <span className="micro-label !opacity-100">Member Name</span>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={16} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-white/30 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="micro-label !opacity-100">Access Key</span>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={16} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-white/30 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-white text-black rounded-full font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <LogIn size={20} />
                Enter Boutique
              </>
            )}
          </button>
        </form>
        
        <p className="mt-8 text-[10px] opacity-20 uppercase tracking-[0.2em] text-center italic">StyleSprint Member Access</p>
      </motion.div>
    </main>
  );
}
