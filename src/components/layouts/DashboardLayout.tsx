import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { 
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
  const navigate = useNavigate();

  // Define navigation items based on user type
  const getNavigationItems = () => {
    const commonItems = [
      { label: 'Settings', icon: <Settings className="h-4 w-4" />, path: `/${userType}/settings` }
    ];
    
    if (userType === 'admin') {
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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-gray-200 bg-white shadow-sm sticky top-0 z-40">        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            {/* Mobile Menu - Removed for all users */}
            
              {/* Brand Logo (Always visible) */}
            <div className="flex items-center gap-2" onClick={() => navigate('/')} role="button">
              <img 
                src="/lovable-uploads/33900580-8f8e-4c8d-b6d6-511af21db8ca.png" 
                alt="National Sports School Logo" 
                className="h-8 w-auto object-contain"
              />
              {userType === 'coach' && (
                <span className="font-bold text-xl hidden sm:block">NSS</span>
              )}
            </div>
          </div>
          
          {/* Desktop Navigation - Hidden for coaches and parents */}
          {userType === 'admin' && (
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
          )}
          
          <div className="ml-auto flex items-center gap-2">            
            {/* Command Menu Trigger - Removed for all users */}
            
            {/* Notifications - Removed for all users */}
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback>
                      {userType === 'admin' ? 'AD' : userType === 'coach' ? 'CO' : 'PA'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                {userType === 'coach' ? (
                  // Simplified menu for coaches - only logout
                  <>
                    <DropdownMenuLabel>Coach Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/')} className="text-red-600">
                      Log out
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </>
                ) : (
                  // Full menu for admin and parent
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate(`/${userType}/profile`)}>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/${userType}/settings`)}>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/')} className="text-red-600">
                      Log out
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Page Content */}
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs and Page Title - Hidden for coaches and parents */}
        {userType === 'admin' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <Breadcrumb className="mb-2">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      onClick={() => navigate(`/${userType}/dashboard`)}
                      className={colors.subtle}
                    >
                      {userType === 'admin' ? 'Admin' : userType === 'parent' ? 'Parent' : 'Coach'}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className={colors.separator} />
                  <BreadcrumbItem>
                    <BreadcrumbLink className="font-medium">
                      {currentPageName}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h1>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="relative">
          {children}
        </div>
      </div>
      
      {/* Command Menu component - Removed */}
    </div>
  );
};

export default DashboardLayout;
