
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Banknote, RefreshCw } from 'lucide-react';
import { useUpdatePaymentLog } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type PaymentLog = {
  id: number;
  student_id: number;
  amount: number;
  status: 'paid' | 'not_paid' | 'upcoming';
  payment_date: string;
  method: string;
  student: {
    name: string;
  };
};

interface PaymentsTabProps {
  paymentLogs: PaymentLog[];
  onRefresh?: () => void;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ paymentLogs, onRefresh }) => {
  const { toast } = useToast();
  const updatePaymentMutation = useUpdatePaymentLog();
  
  // State to track payment method updates
  const [updatedMethods, setUpdatedMethods] = useState<Record<number, string>>({});
  
  const handleHandCashPayment = async (paymentId: number, studentName: string) => {
    try {
      // Update the payment in Supabase
      await updatePaymentMutation.mutateAsync({
        id: paymentId,
        status: 'paid',
        method: 'Hand Cash'
      });

      // Update local state for immediate UI feedback
      setUpdatedMethods(prev => ({
        ...prev,
        [paymentId]: 'Hand Cash'
      }));
      
      toast({
        title: "Payment Updated",
        description: `${studentName}'s payment has been marked as paid by Hand Cash.`,
      });
      
      console.log(`Payment ID: ${paymentId}, Student: ${studentName}, Method: Hand Cash, Status: Paid`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate total revenue from paid payments
  const totalRevenue = paymentLogs
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  // Format currency (amount comes in rupees from backend)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount); // Amount is already in rupees
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Payment Management</h2>
          <p className="text-sm text-muted-foreground">Track and manage student payments</p>
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={updatePaymentMutation.isPending}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">From {paymentLogs.filter(p => p.status === 'paid').length} paid transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentLogs.filter(p => p.status === 'not_paid').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paymentLogs.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{payment.student.name}</CardTitle>
                <Badge variant={payment.status === 'paid' ? 'default' : payment.status === 'not_paid' ? 'destructive' : 'outline'}>
                  {payment.status === 'paid' ? 'Paid' : payment.status === 'not_paid' ? 'Unpaid' : 'Upcoming'}
                </Badge>
              </div>
              <CardDescription>{new Date(payment.payment_date).toLocaleDateString()}</CardDescription>
            </CardHeader>            <CardContent className="text-sm space-y-3">
              <div>
                <p>Amount: <span className="font-semibold">{formatCurrency(payment.amount)}</span></p>
                <p>Method: <span className={updatedMethods[payment.id] ? 'font-semibold text-green-600' : ''}>
                  {updatedMethods[payment.id] || payment.method}
                </span></p>
              </div>
              {payment.status !== 'paid' && !updatedMethods[payment.id] && (
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleHandCashPayment(payment.id, payment.student.name)}
                  disabled={updatePaymentMutation.isPending}
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  {updatePaymentMutation.isPending ? 'Updating...' : 'Paid by Hand Cash'}
                </Button>
              )}
              {updatedMethods[payment.id] && (
                <div className="text-center text-sm text-green-600 font-medium">
                  ✓ Payment method updated to Hand Cash
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default PaymentsTab;
