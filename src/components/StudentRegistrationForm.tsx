
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DateInput } from '@/components/ui/date-input';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface StudentRegistrationFormProps {
  onBack: () => void;
  onSuccess: (parentCredentials: { username: string; password: string }) => void;
}

const formSchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required').regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in dd/mm/yyyy format'),
  address: z.string().min(1, 'Address is required'),
  parentNumber: z.string().min(1, 'Parent number is required'),
  weight: z.string().min(1, 'Weight is required'),
  height: z.string().min(1, 'Height is required'),
  interestedGame: z.string().min(1, 'Please select a sport/game'),
  governmentSchool: z.string().min(1, 'Please select Yes or No'),
  schoolName: z.string().min(1, 'School name is required'),
  sex: z.string().min(1, 'Please select gender'),
  nationality: z.string().min(1, 'Nationality is required'),
  groupBatch: z.string().min(1, 'Please select group/batch')
});

type FormData = z.infer<typeof formSchema>;

const StudentRegistrationForm = ({ onBack, onSuccess }: StudentRegistrationFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: '',
      dateOfBirth: '',
      address: '',
      parentNumber: '',
      weight: '',
      height: '',
      interestedGame: '',
      governmentSchool: '',
      schoolName: '',
      sex: '',
      nationality: '',
      groupBatch: ''
    }
  });

  const generateCredentials = () => {
    const username = `parent_${form.getValues('studentName').toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substring(7)}`;
    const password = Math.random().toString(36).substring(2, 10);
    return { username, password };
  };

  const onSubmit = (data: FormData) => {
    const credentials = generateCredentials();
    
    console.log('=== STUDENT REGISTRATION ===');
    console.log('Student Name:', data.studentName);
    console.log('Date of Birth:', data.dateOfBirth);
    console.log('Sport Interest:', data.interestedGame);
    console.log('Parent Credentials Generated:', credentials);
    console.log('Registration Time:', new Date().toISOString());
    console.log('===========================');
    
    toast({
      title: "Student Added Successfully",
      description: `${data.studentName} has been registered`,
    });
    
    onSuccess(credentials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Student Registration</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-xl">
              <UserPlus className="h-5 w-5 mr-2 text-primary" />
              Add New Student
            </CardTitle>
            <CardDescription>Please fill in all the required information</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">Basic Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter student's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                        <FormControl>
                          <DateInput 
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter nationality" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact & Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">Contact Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter full address" rows={3} className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent's Phone Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Enter parent's phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Physical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">Physical Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg) *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Weight in kg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm) *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Height in cm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Sports & Education */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">Sports & Education</h3>
                  
                  <FormField
                    control={form.control}
                    name="interestedGame"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interested Sport *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sport/game" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="football">Football</SelectItem>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="swimming">Swimming</SelectItem>
                            <SelectItem value="cricket">Cricket</SelectItem>
                            <SelectItem value="badminton">Badminton</SelectItem>
                            <SelectItem value="volleyball">Volleyball</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="groupBatch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group/Batch *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select group/batch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginners">Beginners</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="junior">Junior (Under 12)</SelectItem>
                            <SelectItem value="senior">Senior (12+)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="governmentSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Government School *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Yes or No" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter school name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium mt-8">
                  Register Student
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;
