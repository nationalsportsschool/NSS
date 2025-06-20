import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface LoginCardProps {
  userType: 'admin' | 'coach' | 'parent';
  title: string;
  description: string;
  icon: React.ReactNode;
}

const LoginCard = ({ userType, title, description, icon }: LoginCardProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${userType} login attempt:`, { username, password });
    
    // Mock login success
    toast({
      title: "Success",
      description: "Welcome back!",
    });

    // Redirect based on user type
    if (userType === 'admin') {
      navigate('/admin/analytics');
    } else if (userType === 'coach') {
      navigate('/coach/dashboard');
    } else if (userType === 'parent') {
      navigate('/parent/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-white text-black flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-sm mx-auto space-y-6 transform -translate-y-4">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {icon}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-black">{title}</h1>
            <p className="text-gray-600 text-sm">National Sports School Portal</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor={`${userType}-username`} className="text-black text-sm font-medium">
                Username
              </Label>
              <Input
                id={`${userType}-username`}
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900 h-10"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`${userType}-password`} className="text-black text-sm font-medium">
                Password
              </Label>
              <Input
                id={`${userType}-password`}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900 h-10"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-10 bg-black text-white hover:bg-gray-800 font-semibold text-base"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;
