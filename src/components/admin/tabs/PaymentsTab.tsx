
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Banknote } from 'lucide-react';

type PaymentLog = {
  id: number;
  studentName: string;
  amount: string;
  status: 'paid' | 'not_paid' | 'upcoming';
  date: string;
  method: string;
};

interface PaymentsTabProps {
  paymentLogs: PaymentLog[];
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ paymentLogs }) => {
  // State to track payment method updates
  const [updatedMethods, setUpdatedMethods] = useState<Record<number, string>>({});
  
  const handleHandCashPayment = (paymentId: number, studentName: string) => {
    // Update the payment method to "Hand Cash"
    setUpdatedMethods(prev => ({
      ...prev,
      [paymentId]: 'Hand Cash'
    }));
    
    console.log(`Payment ID: ${paymentId}, Student: ${studentName}, Method: Hand Cash, Status: Paid`);
  };

  return (
    <>      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,50,000</div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentLogs.filter(p => p.status === 'not_paid').length}</div>
            <p className="text-xs text-muted-foreground mt-1">-3 from yesterday</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paymentLogs.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{payment.studentName}</CardTitle>
                <Badge variant={payment.status === 'paid' ? 'default' : payment.status === 'not_paid' ? 'destructive' : 'outline'}>
                  {payment.status === 'paid' ? 'Paid' : payment.status === 'not_paid' ? 'Unpaid' : 'Upcoming'}
                </Badge>
              </div>
              <CardDescription>{payment.date}</CardDescription>
            </CardHeader>            <CardContent className="text-sm space-y-3">
              <div>
                <p>Amount: <span className="font-semibold">{payment.amount}</span></p>
                <p>Method: <span className={updatedMethods[payment.id] ? 'font-semibold text-green-600' : ''}>
                  {updatedMethods[payment.id] || payment.method}
                </span></p>
              </div>
              {payment.status !== 'paid' && !updatedMethods[payment.id] && (
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleHandCashPayment(payment.id, payment.studentName)}
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  Paid by Hand Cash
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
