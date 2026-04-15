import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // As requested: username raghav, password raghav@384
    if (username === 'raghav' && password === 'raghav@384') {
      localStorage.setItem('admin_session', 'true');
      toast.success('Admin logged in successfully');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-[#161616] border-[#333333] shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-6">
            <span className="text-2xl font-black tracking-tighter uppercase text-white">ZENVY<span className="text-[#F27D26]">.</span> <span className="text-[10px] text-[#A0A0A0] font-bold ml-2 border border-[#333333] px-2 py-0.5 rounded">ADMIN</span></span>
          </div>
          <CardTitle className="text-xl font-bold uppercase tracking-tight">Admin Sign-In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Username</label>
              <Input 
                className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]"
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Password</label>
              <Input 
                className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold uppercase tracking-widest py-6">
              Sign In
            </Button>
          </form>
          <div className="mt-8 text-[10px] text-[#A0A0A0] text-center uppercase tracking-widest">
            <p>Internal Access Only • Authorized Staff Only</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
