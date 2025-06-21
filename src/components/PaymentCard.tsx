import React from 'react';
import { Wallet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PaymentCardProps {
  childName: string;
  pendingFees?: number;
}

const PaymentCard = ({ childName, pendingFees = 0 }: PaymentCardProps) => {
  const { toast } = useToast();

  const handleOpenPaymentApp = () => {
    const amount = pendingFees;
    const payeeName = "National Sports School";
    // IMPORTANT: Replace with your actual VPA/UPI ID in a real application
    const virtualPaymentAddress = "payment@nss.ac.in"; 

    // Construct the UPI URL
    const upiUrl = `upi://pay?pa=${virtualPaymentAddress}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=Fee payment for ${encodeURIComponent(childName)}`;

    console.log('=== PAYMENT INITIATION ===');
    console.log('Child:', childName);
    console.log('Amount:', amount);
    console.log('UPI URL:', upiUrl);
    console.log('Timestamp:', new Date().toISOString());

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      // On mobile, attempt to open the UPI deep link.
      // This will trigger the OS to show a list of installed UPI apps.
      window.location.href = upiUrl;
      
      toast({
        title: "Opening Payment App",
        description: "Please select an app to complete the payment.",
      });

      // Fallback for when no app can handle the UPI link
      const timer = setTimeout(() => {
        toast({
          title: "No Payment App Found",
          description: "Could not automatically open a payment app. Please use your UPI app manually.",
          variant: "destructive",
        });
      }, 3000);

      // If the app opens, the browser loses focus, and we can clear the fallback timer.
      window.addEventListener('blur', () => {
        clearTimeout(timer);
      }, { once: true });

    } else {
      // On desktop, UPI links are not supported. Open a fallback web payment URL.
      // In a real-world scenario, this would be your payment gateway page.
      console.log('Desktop detected. Opening web payment fallback.');
      const fallbackUrl = `https://pay.google.com/gp/v/pay?pn=${encodeURIComponent(payeeName)}&pa=${virtualPaymentAddress}&am=${amount}&cu=INR`;
      window.open(fallbackUrl, '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "Opening a secure payment page in a new tab.",
      });
    }
    console.log('===========================');
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
        {pendingFees > 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <h4 className="font-semibold text-yellow-800">Pending Fees</h4>
            <p className="text-3xl font-bold text-yellow-900 mt-1">₹{pendingFees}</p>
            <p className="text-xs text-yellow-700">Outstanding amount to be paid</p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <h4 className="font-semibold text-green-800">All Cleared!</h4>
            <p className="text-sm text-green-700 mt-1">There are no pending fees. Thank you!</p>
          </div>
        )}

        {pendingFees > 0 && (
          <div>
            <Button 
              onClick={handleOpenPaymentApp}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base"
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Pay Now
            </Button>
          </div>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Secure payments processed via UPI
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
