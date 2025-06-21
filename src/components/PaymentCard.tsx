
import React from 'react';
import { CreditCard, Wallet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PaymentCardProps {
  childName: string;
  pendingFees?: number;
}

const PaymentCard = ({ childName, pendingFees = 0 }: PaymentCardProps) => {
  const { toast } = useToast();

  const handleOpenPaymentApp = () => {
    console.log('=== PAYMENT APP REQUEST ===');
    console.log('Child:', childName);
    console.log('Pending Fees:', pendingFees);
    console.log('User Agent:', navigator.userAgent);
    console.log('Platform:', navigator.platform);
    console.log('Timestamp:', new Date().toISOString());

    // Try to open common payment apps (PWA compatible)
    const paymentMethods = [
      { name: 'Google Pay', url: 'googlepay://', fallback: 'https://pay.google.com' },
      { name: 'PayPal', url: 'paypal://', fallback: 'https://paypal.com' },
      { name: 'Samsung Pay', url: 'samsungpay://', fallback: null },
      { name: 'Apple Pay', url: 'applepay://', fallback: null }
    ];

    // Check if device supports payment apps
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMobile = isAndroid || isIOS;

    console.log('Device Detection:', { isAndroid, isIOS, isMobile });

    if (isMobile) {
      // Try to open native payment app
      if (isAndroid) {
        // Try Google Pay first on Android
        console.log('Attempting to open Google Pay...');
        window.location.href = 'intent://pay.google.com#Intent;scheme=https;package=com.google.android.apps.nbu.paisa.user;end';
      } else if (isIOS) {
        // Try Apple Pay on iOS (limited support)
        console.log('iOS detected - showing payment options...');
        toast({
          title: "Payment Options",
          description: "Please use your preferred payment app from the home screen",
        });
      }
    } else {
      // Desktop fallback - open web payment
      console.log('Desktop detected - opening web payment...');
      window.open('https://pay.google.com', '_blank');
    }

    // Generic payment intent for PWA
    try {
      // Use Web Share API if available
      if (navigator.share) {
        console.log('Using Web Share API for payment...');
        navigator.share({
          title: 'Sports School Payment',
          text: `Payment for ${childName} - Amount: $${pendingFees}`,
          url: window.location.href
        });
      }
    } catch (error) {
      console.log('Web Share API error:', error);
    }

    console.log('Payment app opening attempt completed');
    console.log('===========================');

    toast({
      title: "Opening Payment App",
      description: "Redirecting to your preferred payment method...",
    });
  };

  const handleQuickPay = (method: string) => {
    console.log('=== QUICK PAY SELECTED ===');
    console.log('Payment Method:', method);
    console.log('Child:', childName);
    console.log('Amount:', pendingFees);
    console.log('Timestamp:', new Date().toISOString());
    console.log('=========================');

    // Simulate opening specific payment methods
    switch (method) {
      case 'gpay':
        window.open('https://pay.google.com', '_blank');
        break;
      case 'paypal':
        window.open('https://paypal.com', '_blank');
        break;
      case 'card':
        toast({
          title: "Card Payment",
          description: "Redirecting to secure card payment...",
        });
        break;
    }
  };

  return (
    <div className="bg-card shadow-sm border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Wallet className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-lg font-bold text-foreground">Payment Center</h3>
            <p className="text-sm text-muted-foreground">Fees and payments for {childName}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {pendingFees > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-yellow-800">Pending Fees</h4>
                <p className="text-yellow-600">Outstanding amount to be paid</p>
              </div>
              <div className="text-2xl font-bold text-yellow-800">₹{pendingFees}</div>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-foreground mb-3">Payment Options</h4>
          
          <div className="space-y-3">
            <Button 
              onClick={handleOpenPaymentApp}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Open Payment App
            </Button>

            <div className="grid grid-cols-3 gap-2">
              <Button 
                onClick={() => handleQuickPay('gpay')}
                variant="outline" 
                className="h-10 text-xs"
              >
                Google Pay
              </Button>
              <Button 
                onClick={() => handleQuickPay('paypal')}
                variant="outline" 
                className="h-10 text-xs"
              >
                PayPal
              </Button>
              <Button 
                onClick={() => handleQuickPay('card')}
                variant="outline" 
                className="h-10 text-xs"
              >
                <CreditCard className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Secure payments processed through trusted payment providers
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
