
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Share2, Plus, Smartphone } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = React.useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = React.useState(false);

  React.useEffect(() => {
    // Only show the prompt if we are in a browser context
    if (typeof window === 'undefined') return;
    
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

    // If already installed, don't show anything
    if (pwaInstalled) return;

    // Check if user has permanently dismissed the prompt
    const hasPermaDismissed = localStorage.getItem('pwa-install-prompt-dismissed-permanently');
    if (hasPermaDismissed === 'true') return;

    // Check if the prompt was recently dismissed (within 3 days instead of 7)
    const tempDismissalTime = localStorage.getItem('pwa-install-prompt-seen');
    if (tempDismissalTime) {
      const dismissalDate = parseInt(tempDismissalTime, 10);
      const currentTime = Date.now();
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // Reduced from 7 days
      
      if (currentTime - dismissalDate < threeDaysInMs) {
        return; // Don't show if dismissed less than 3 days ago
      }
    }

    // Handle the beforeinstallprompt event for non-iOS
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show immediately when the event fires
      setShowInstallPrompt(true);
    };

    // Show appropriate prompt based on device
    if (!iOS) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      // For testing purposes, show the prompt after a short delay even without the event
      setTimeout(() => {
        if (!deferredPrompt && !showInstallPrompt) {
          console.log('No beforeinstallprompt event, showing manual prompt');
          setShowInstallPrompt(true);
        }
      }, 3000);
    } else {
      // For iOS, show our custom prompt after a shorter delay
      const iosPromptDelayMs = 3000; // Reduced from 5 seconds
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, iosPromptDelayMs);
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('App installed');
      setIsPWAInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      // Store that the app is installed
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, show detailed instructions
      setShowInstallPrompt(false);
      setShowIOSInstructions(true);
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
    // Set a temporary dismissal (will show again in 7 days)
    localStorage.setItem('pwa-install-prompt-seen', Date.now().toString());
  };

  const handleDismissPermanently = () => {
    setShowInstallPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem('pwa-install-prompt-dismissed-permanently', 'true');
  };

  const closeIOSInstructions = () => {
    setShowIOSInstructions(false);
    localStorage.setItem('pwa-install-prompt-seen', Date.now().toString());
  };

  // If no prompt to show, don't render anything
  if (!showInstallPrompt && !showIOSInstructions) {
    return null;
  }

  return (
    <>
      {/* iOS Install Instructions Modal */}
      <Dialog open={showIOSInstructions} onOpenChange={closeIOSInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Install Sports Hub App</DialogTitle>
            <DialogDescription>
              Follow these steps to install Sports Hub on your iOS device:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Share2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Step 1: Tap the Share button</p>
                <p className="text-xs text-muted-foreground">
                  Look for the share icon in Safari's menu bar
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Plus className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Step 2: Tap "Add to Home Screen"</p>
                <p className="text-xs text-muted-foreground">
                  Scroll down in the share menu if needed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Step 3: Tap "Add" in the top right</p>
                <p className="text-xs text-muted-foreground">
                  The app will be installed on your home screen
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleDismissPermanently}>
              Don't show again
            </Button>
            <Button onClick={closeIOSInstructions}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Install Prompt Banner */}
      {showInstallPrompt && (
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
                      ? "Get quick access and offline features"
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
              <Button 
                onClick={handleInstallClick} 
                size="sm" 
                className="flex-1 text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {isIOS ? "Show How" : "Install"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDismissPermanently} 
                size="sm" 
                className="flex-1 text-xs"
              >
                Don't show again
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;
