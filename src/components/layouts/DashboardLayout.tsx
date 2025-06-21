import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import CommandMenu from '@/components/CommandMenu';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  Search, 
  Bell, 
  Home, 
  BarChart3, 
  Users, 
  Calendar, 
  Settings, 
  CreditCard, 
  LogOut,
  ChevronDown,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  userType: 'admin' | 'coach' | 'parent';
  currentPath: string;
}

const DashboardLayout = ({ 
  children, 
  title, 
  userType,
  currentPath
}: DashboardLayoutProps) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Define navigation items based on user type
  const getNavigationItems = () => {
    const commonItems = [
      { label: 'Settings', icon: <Settings className="h-4 w-4" />, path: `/${userType}/settings` }
    ];
    
    if (userType === 'admin') {
      if (isMobile) {
        return [
          { label: 'Dashboard', icon: <Home className="h-4 w-4" />, path: '/admin/dashboard' },
        ];
      }
      return [
        { label: 'Analytics', icon: <BarChart3 className="h-4 w-4" />, path: '/admin/analytics' },
        { label: 'Dashboard', icon: <Home className="h-4 w-4" />, path: '/admin/dashboard' },
      ];
    } else if (userType === 'coach') {
      return [
        { label: 'Dashboard', icon: <Home className="h-4 w-4" />, path: '/coach/dashboard' },
        { label: 'Students', icon: <Users className="h-4 w-4" />, path: '/coach/students' },
        { label: 'Schedule', icon: <Calendar className="h-4 w-4" />, path: '/coach/schedule' },
        ...commonItems
      ];
    }
    
    return [
      { label: 'Dashboard', icon: <Home className="h-4 w-4" />, path: '/parent/dashboard' },
      { label: 'Schedule', icon: <Calendar className="h-4 w-4" />, path: '/parent/schedule' },
      { label: 'Payments', icon: <CreditCard className="h-4 w-4" />, path: '/parent/payments' },
      ...commonItems
    ];
  };
  
  const navigationItems = getNavigationItems();
  
  // Get current page for breadcrumb
  const currentPageName = navigationItems.find(item => item.path === currentPath)?.label || title;
  
  // Colors based on user type
  const getUserTypeColors = () => {
    switch (userType) {
      case 'admin':
        return {
          primary: 'bg-red-600 hover:bg-red-700 text-white',
          subtle: 'text-red-600',
          separator: 'text-red-300'
        };
      case 'coach':
        return {
          primary: 'bg-blue-600 hover:bg-blue-700 text-white', 
          subtle: 'text-blue-600',
          separator: 'text-blue-300'
        };
      case 'parent':
        return {
          primary: 'bg-green-600 hover:bg-green-700 text-white',
          subtle: 'text-green-600',
          separator: 'text-green-300'
        };
    }
  };
  
  const colors = getUserTypeColors();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-gray-200 bg-white shadow-sm sticky top-0 z-40">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            {!(isMobile && userType === 'admin') && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-60 sm:w-72 pr-0">
                  <div className="flex flex-col h-full p-4">
                    <div className="flex items-center mb-8 pl-4">
                      <img 
                        src="/lovable-uploads/33900580-8f8e-4c8d-b6d6-511af21db8ca.png" 
                        alt="National Sports School Logo" 
                        className="h-10 w-auto mr-2 object-contain"
                      />
                      <h2 className="text-lg font-bold">NSS Portal</h2>
                    </div>
                    <nav className="space-y-2 flex-1">
                      {navigationItems.map((item) => (
                        <Button
                          key={item.path}
                          variant={currentPath === item.path ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 pl-4 transition-all", 
                            currentPath === item.path ? "" : "hover:bg-gray-100"
                          )}
                          onClick={() => navigate(item.path)}
                        >
                          {item.icon}
                          {item.label}
                        </Button>
                      ))}
                    </nav>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 pl-4 mt-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => navigate('/')}
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {/* Brand Logo (Always visible) */}
            <div className="flex items-center gap-2" onClick={() => navigate('/')} role="button">
              <img 
                src="/lovable-uploads/33900580-8f8e-4c8d-b6d6-511af21db8ca.png" 
                alt="National Sports School Logo" 
                className="h-8 w-auto object-contain"
              />
              {userType !== 'admin' && (
                <span className="font-bold text-xl hidden sm:block">NSS</span>
              )}
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 mx-6 lg:mx-10">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={currentPath === item.path ? "secondary" : "ghost"}
                className={cn(
                  "gap-2 transition-all", 
                  currentPath === item.path ? "" : "hover:bg-gray-100"
                )}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="hidden lg:inline-block">{item.label}</span>
              </Button>
            ))}
          </nav>
          
          <div className="ml-auto flex items-center gap-2">            
            {/* Command Menu Trigger - Hide for admin */}
            {userType !== 'admin' && (
              <Button 
                variant="outline" 
                className="hidden md:flex gap-2"
                onClick={() => setIsCommandOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:inline-block">Search</span>
                <kbd className="hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-70">
                  <span>⌘</span>K
                </kbd>
              </Button>
            )}
            
            {/* Notifications */}
            {userType !== 'admin' && (
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            )}

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {userType !== 'admin' && <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User avatar" />}
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@nss.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate(`/${userType}/settings`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs and Title */}
          <div>
            <Breadcrumb className="mb-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/${userType}/dashboard`); }}>
                      {userType === 'admin' ? 'Admin' : userType === 'coach' ? 'Coach' : 'Parent'}
                    </a>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={colors.separator} />
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-medium">
                    {currentPageName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h1>
          </div>
          
          {/* Page Content */}
          <div className="mt-6">
            {children}
          </div>
        </div>
      </main>

      {/* Command Menu component */}
      {isCommandOpen && (
        <CommandMenu
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
          userType={userType}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
