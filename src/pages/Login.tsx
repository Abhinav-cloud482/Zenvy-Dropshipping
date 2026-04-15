import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      toast.error('Login failed');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in successfully');
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-[#161616] border-[#333333] shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-6">
            <Link to="/">
              <span className="text-2xl font-black tracking-tighter uppercase text-white">ZENVY<span className="text-[#F27D26]">.</span></span>
            </Link>
          </div>
          <CardTitle className="text-xl font-bold uppercase tracking-tight">
            {isRegistering ? 'Create Account' : 'Sign In'}
          </CardTitle>
          <div className="text-[#A0A0A0] text-[10px] uppercase tracking-widest font-bold mt-2">
            {isRegistering ? 'Join the dropshipping elite' : 'Access your dashboard'}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Email Address</label>
              <Input 
                className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]"
                type="email" 
                placeholder="name@company.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Password</label>
              <Input 
                className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]"
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold uppercase tracking-widest py-6">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#333333]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-[#161616] px-2 text-[#A0A0A0]">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full border-[#333333] hover:bg-[#222222] text-white font-bold uppercase tracking-widest text-xs py-6"
            onClick={handleGoogleLogin}
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-2" alt="Google" />
            Google Account
          </Button>

          <div className="text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-bold text-[#F27D26] hover:brightness-110 uppercase tracking-widest"
            >
              {isRegistering ? 'Already have an account? Sign In' : 'New here? Create an account'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { Link } from 'react-router-dom';
