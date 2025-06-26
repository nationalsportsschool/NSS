import React from 'react';
import { Wallet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCreatePaymentOrder, useRazorpayKey } from '@/lib/api';

interface PaymentCardProps {
  childName: string;
  pendingFees?: number;
}

// Declare Razorpay global type
declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentCard = ({ childName, pendingFees = 0 }: PaymentCardProps) => {
  const { toast } = useToast();
  const createOrderMutation = useCreatePaymentOrder();
  const { data: razorpayKeyData } = useRazorpayKey();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    console.log('=== RAZORPAY PAYMENT INITIATION ===');
    console.log('Child:', childName);
    console.log('Amount in rupees:', pendingFees);
    console.log('Timestamp:', new Date().toISOString());

    try {
      // Load Razorpay script if not already loaded
      const isScriptLoaded = await loadRazorpayScript();
      
      if (!isScriptLoaded) {
        toast({
          title: "Error",
          description: "Failed to load payment gateway. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!window.Razorpay) {
        toast({
          title: "Error",
          description: "Payment gateway not available. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Create payment order
      const orderData = {
        amount: pendingFees, // Amount in rupees
        receiptId: `receipt_${childName.replace(/\s+/g, '_')}_${Date.now()}`,
        notes: {
          student_name: childName,
          payment_for: 'School Fees',
          payment_type: 'test_payment'
        }
      };

      console.log('Creating payment order:', orderData);

      const orderResponse = await createOrderMutation.mutateAsync(orderData);
      console.log('Order created successfully:', orderResponse);

      // Configure Razorpay options
      const options = {
        key: (razorpayKeyData as any)?.key_id || 'rzp_test_GhNPi99WYzHbbc', // Fallback to test key
        amount: (orderResponse as any).amount, // Amount in paise (already converted by backend)
        currency: (orderResponse as any).currency || 'INR',
        name: 'National Sports School',
        description: `Fees payment for ${childName}`,
        order_id: (orderResponse as any).orderId,
        handler: function (response: any) {
          console.log('Payment successful:', response);
          toast({
            title: "Payment Successful!",
            description: `Payment of ₹${pendingFees} completed successfully.`,
          });
          
          // Here you can add code to verify payment with backend
          console.log('Payment ID:', response.razorpay_payment_id);
          console.log('Order ID:', response.razorpay_order_id);
          console.log('Signature:', response.razorpay_signature);
        },
        prefill: {
          name: childName,
          email: 'parent@example.com',
          contact: '9999999999'
        },
        notes: orderData.notes,
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
            });
          }
        }
      };

      console.log('Launching Razorpay with options:', options);

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }

    console.log('===============================');
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
              onClick={handleRazorpayPayment}
              disabled={createOrderMutation.isPending}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base"
            >
              <Smartphone className="h-5 w-5 mr-2" />
              {createOrderMutation.isPending ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Secure payments via Razorpay (Test Mode)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
