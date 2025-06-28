
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, Users, Download, Smartphone } from 'lucide-react';
import { useCoachAuth } from '@/contexts/CoachAuthContext';
import { apiClient } from '@/lib/api';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'coach' | 'parent' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: coachLogin } = useCoachAuth();

  // Check if we should show the install button
  useEffect(() => {
    const checkInstallability = () => {
      // Check if PWA is already installed
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const isPWAInstalled = isStandalone || isInWebAppiOS;

      // Check if user permanently dismissed
      const hasPermaDismissed = localStorage.getItem('pwa-install-prompt-dismissed-permanently');
      
      // Detect iOS
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(iOS);

      // Show install button if not installed and not permanently dismissed
      if (!isPWAInstalled && hasPermaDismissed !== 'true') {
        setShowInstallButton(true);
      }
    };

    checkInstallability();
  }, []);

  const handleInstallApp = () => {
    if (isIOS) {
      toast({
        title: "Install Sports Hub",
        description: "Use Safari's share menu and tap 'Add to Home Screen' to install the app.",
      });
    } else {
      // Try to trigger the install prompt
      const event = new CustomEvent('show-pwa-prompt');
      window.dispatchEvent(event);
    }
  };

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
        title: "Missing Information",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (selectedRole === 'coach') {
        // Use real coach authentication (exact same as CoachLogin.tsx)
        const result = await coachLogin(username, password);
        
        if (result.success) {
          toast({
            title: "Login Successful",
            description: "Welcome to your coach dashboard!",
          });
          navigate('/coach/dashboard');
        } else {
          toast({
            title: "Login Failed",
            description: result.message || "Invalid credentials. Please check your username and password.",
            variant: "destructive",
          });
        }
      } else if (selectedRole === 'admin') {
        // Admin authentication using database
        try {
          const result = await apiClient.adminLogin(username, password);
          if (result.success) {
            // Store admin token and data
            localStorage.setItem('adminToken', result.data.token);
            localStorage.setItem('adminData', JSON.stringify(result.data.admin));
            
            toast({
              title: "Login Successful",
              description: `Welcome back, ${result.data.admin.full_name || username}!`,
            });
            navigate('/admin/analytics');
          } else {
            toast({
              title: "Login Failed",
              description: result.message || "Invalid admin credentials.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Login Failed",
            description: error instanceof Error ? error.message : "Invalid admin credentials.",
            variant: "destructive",
          });
        }
      } else if (selectedRole === 'parent') {
        // Parent authentication using database
        try {
          const result = await apiClient.parentLogin(username, password);
          if (result.success) {
            // Store parent token and data
            localStorage.setItem('parentToken', result.data.token);
            localStorage.setItem('parentData', JSON.stringify(result.data.parent));
            
            toast({
              title: "Login Successful",
              description: `Welcome back, ${result.data.parent.full_name || username}!`,
            });
            navigate('/parent/dashboard');
          } else {
            toast({
              title: "Login Failed",
              description: result.message || "Invalid parent credentials.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Login Failed",
            description: error instanceof Error ? error.message : "Invalid parent credentials.",
            variant: "destructive",
          });
        }
      } else {
        // This should never happen as we've covered all roles
        toast({
          title: "Error",
          description: "Unknown role selected.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
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
              src="/lovable-uploads/d3e2c1ed-3a94-410a-92a5-4126a5366ca6.png" 
              alt="National Sports School Logo" 
              className="h-20 w-auto md:h-24 object-contain"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              National Sports School
            </h1>
            <p className="text-lg text-gray-600">
              Excellence in Sports Education
            </p>
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
                  autoComplete="username"
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
                  autoComplete="current-password"
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

        {/* Floating Install Button */}
        {showInstallButton && (
          <div className="fixed top-4 right-4 z-40">
            <Button
              onClick={handleInstallApp}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-full"
            >
              {isIOS ? <Smartphone className="h-4 w-4" /> : <Download className="h-4 w-4" />}
              <span className="text-sm font-medium">Install App</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
