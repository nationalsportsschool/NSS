import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Define the type for a single student
type Student = {
  id: number;
  name: string;
  sport: string;
  feePlan: string;
  paymentStatus: 'paid' | 'not_paid' | 'upcoming';
  parentContact: string;
  group: string;
  coach: string;
};

interface StudentsTabProps {
  students: Omit<Student, 'coach'>[];
}

const StudentsTab: React.FC<StudentsTabProps> = ({ students }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {students.map((student) => (
          <Card key={student.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-md font-semibold">{student.name}</CardTitle>
                <Badge
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${student.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {student.paymentStatus === 'paid' ? 'Paid' : student.paymentStatus === 'not_paid' ? 'Unpaid' : 'Upcoming'}
                </Badge>
              </div>
              <CardDescription>{student.sport} - {student.group}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-sm text-muted-foreground space-y-1">
               <p>Coach: <span className="font-medium text-primary">Suresh Kumar</span></p>
               <p>Fee: <span className="font-medium text-primary">₹{student.feePlan.replace(/[^0-9]/g, '')}</span></p>
              <p>Parent Contact: {student.parentContact}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {students.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No students found matching your search.</p>
        </div>
      )}
    </>
  );
};

export default StudentsTab;
