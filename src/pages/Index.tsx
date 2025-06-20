
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, Users } from 'lucide-react';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'coach' | 'parent' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const roles = [
    {
      id: 'admin' as const,
      title: 'Administrator',
      subtitle: 'Manage the entire school system',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700',
      textColor: 'text-red-600',
      borderColor: 'border-red-500',
    },
    {
      id: 'coach' as const,
      title: 'Coach',
      subtitle: 'Train and guide students',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500',
    },
    {
      id: 'parent' as const,
      title: 'Parent',
      subtitle: "Track your child's progress",
      icon: Users,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      textColor: 'text-green-600',
      borderColor: 'border-green-500',
    },
  ];
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation with improved error messages
    if (!selectedRole) {
      toast({
        variant: "destructive",
        title: "Role Required",
        description: "Please select your role before logging in",
      });
      return;
    }
    
    if (!username || !password) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter both username and password",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`${selectedRole} login attempt:`, { username, password });
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${username}!`,
      });

      // Redirect based on user type
      if (selectedRole === 'admin') {
        navigate('/admin/analytics');
      } else if (selectedRole === 'coach') {
        navigate('/coach/dashboard');
      } else if (selectedRole === 'parent') {
        navigate('/parent/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoleData = roles.find(role => role.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/33900580-8f8e-4c8d-b6d6-511af21db8ca.png" 
              alt="National Sports School Logo" 
              className="h-20 w-auto md:h-24 object-contain"
            />
          </div>
        </div>

        {/* Main Login Section */}
        <div className="max-w-md mx-auto">
          
          {/* Role Icons */}
          <div className="mb-8">
            <div className="flex justify-center items-center space-x-8">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                
                return (
                  <div
                    key={role.id}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => {
                      setSelectedRole(role.id);
                      setUsername('');
                      setPassword('');
                    }}
                  >
                    <div
                      className={`p-4 rounded-full transition-all duration-300 ${
                        isSelected 
                          ? `bg-gradient-to-r ${role.color} transform scale-125 shadow-lg` 
                          : 'bg-white/80 hover:bg-white transform scale-100 hover:scale-110 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <Icon className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    {isSelected && (
                      <div className="mt-3 text-center">
                        <span className={`text-sm font-semibold ${role.textColor}`}>
                          {role.title}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!selectedRole}
                  required
                  className={`mt-1 h-12 text-base transition-all duration-200 bg-white/90 backdrop-blur-sm ${
                    !selectedRole 
                      ? 'bg-gray-100/90 text-gray-400 cursor-not-allowed' 
                      : 'bg-white/90 hover:bg-white'
                  }`}
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!selectedRole}
                  required
                  className={`mt-1 h-12 text-base transition-all duration-200 bg-white/90 backdrop-blur-sm ${
                    !selectedRole 
                      ? 'bg-gray-100/90 text-gray-400 cursor-not-allowed' 
                      : 'bg-white/90 hover:bg-white'
                  }`}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !selectedRole || !username || !password}
              className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                selectedRoleData
                  ? `bg-gradient-to-r ${selectedRoleData.color} ${selectedRoleData.hoverColor} text-white shadow-lg hover:shadow-xl`
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </div>
              ) : selectedRoleData ? (
                `Sign In as ${selectedRoleData.title}`
              ) : (
                'Select Role to Continue'
              )}
            </Button>
          </form>          {/* Helper Text */}
          {!selectedRole && (
            <p className="text-center text-sm text-gray-600 mt-4">
              Please select your role above to enable the login form
            </p>
          )}
        </div>
      </div>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
