
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = React.useState(false);

  React.useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if PWA is already installed
    const checkPWAInstalled = () => {
      // Check if running in standalone mode (PWA is installed)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // Check if running as PWA on mobile
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      
      return isStandalone || isInWebAppiOS;
    };

    const pwaInstalled = checkPWAInstalled();
    setIsPWAInstalled(pwaInstalled);

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt if user hasn't dismissed it permanently
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-dismissed-permanently');
      if (!hasSeenPrompt && !pwaInstalled) {
        setShowInstallPrompt(true);
      }
    };

    // For non-iOS browsers, show install prompt if available and not dismissed
    if (!iOS && !pwaInstalled) {
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-dismissed-permanently');
      if (!hasSeenPrompt) {
        // Show prompt after a short delay to ensure page is loaded
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 2000);
      }
    }

    // For iOS, show instructions if not dismissed
    if (iOS && !pwaInstalled) {
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-dismissed-permanently');
      if (!hasSeenPrompt) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 2000);
      }
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('App installed');
      setIsPWAInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, show instructions
      setShowInstallPrompt(false);
      localStorage.setItem('pwa-install-prompt-dismissed-permanently', 'true');
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        console.log('User choice:', choiceResult.outcome);
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setIsPWAInstalled(true);
        }
        
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      } catch (error) {
        console.error('Error during installation:', error);
      }
    } else {
      // If no deferred prompt, just hide the notification
      setShowInstallPrompt(false);
      localStorage.setItem('pwa-install-prompt-dismissed-permanently', 'true');
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Set a temporary dismissal (will show again on next visit unless permanently dismissed)
    localStorage.setItem('pwa-install-prompt-seen', Date.now().toString());
  };

  const handleDismissPermanently = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-prompt-dismissed-permanently', 'true');
  };

  // Show prompt based on conditions
  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-background border rounded-lg shadow-lg p-4 w-full animate-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Download className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm truncate">
                Install Sports Hub
              </h3>
              <p className="text-xs text-muted-foreground leading-tight">
                {isIOS 
                  ? "Tap Share → 'Add to Home Screen' for quick access"
                  : "Install for offline access and better performance"
                }
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2 mt-3">
          <Button onClick={handleInstallClick} size="sm" className="flex-1 text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            {isIOS ? "Got it" : "Install"}
          </Button>
          <Button variant="outline" onClick={handleDismissPermanently} size="sm" className="flex-1 text-xs">
            Don't show again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
