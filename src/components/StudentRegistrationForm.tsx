
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
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
  parentName: z.string().min(1, 'Parent name is required'),
  parentNumber: z.string().min(1, 'Parent number is required'),
  parentUsername: z.string().min(3, 'Username must be at least 3 characters'),
  parentPassword: z.string().min(4, 'Password must be at least 4 characters'),
  weight: z.string().min(1, 'Weight is required'),
  height: z.string().min(1, 'Height is required'),
  interestedGames: z.array(z.string()).min(1, 'Please select at least one sport').max(2, 'You can select maximum 2 sports'),
  governmentSchool: z.string().min(1, 'Please select Yes or No'),
  schoolName: z.string().min(1, 'School name is required'),
  sex: z.string().min(1, 'Please select gender'),
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
      parentName: '',
      parentNumber: '',
      parentUsername: '',
      parentPassword: '',
      weight: '',
      height: '',
      interestedGames: [],
      governmentSchool: '',
      schoolName: '',
      sex: '',
      groupBatch: ''
    }
  });

  // Mapping functions to convert form values to database enum values
  const mapSportToEnum = (sport: string): string => {
    const sportMap: { [key: string]: string } = {
      'football': 'Football',
      'basketball': 'Basketball', 
      'tennis': 'Tennis',
      'swimming': 'Swimming',
      'cricket': 'Cricket',
      'badminton': 'Basketball', // Map to existing enum value since Badminton isn't in enum
      'volleyball': 'Basketball' // Map to existing enum value since Volleyball isn't in enum
    };
    return sportMap[sport] || 'Football';
  };

  const mapGroupToEnum = (group: string): string => {
    const groupMap: { [key: string]: string } = {
      'beginners': 'Beginners',
      'intermediate': 'Intermediate', 
      'advanced': 'Advanced',
      'junior': 'Beginners', // Map junior to Beginners
      'senior': 'Intermediate' // Map senior to Intermediate
    };
    return groupMap[group] || 'Beginners';
  };

  const onSubmit = async (data: FormData) => {
    try {
      console.log('=== STUDENT REGISTRATION ===');
      console.log('Student Name:', data.studentName);
      console.log('Date of Birth:', data.dateOfBirth);
      console.log('Sport Interest:', data.interestedGames);
      console.log('Parent Credentials:', data.parentUsername, data.parentPassword);
      console.log('Registration Time:', new Date().toISOString());
      console.log('===========================');

      // Call the API to create student with parent
      const response = await fetch('http://localhost:5000/api/students/with-parent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: data.studentName,
          sport: mapSportToEnum(data.interestedGames[0]), // Use mapped enum value
          // secondarySport: data.interestedGames[1] ? mapSportToEnum(data.interestedGames[1]) : null, // Commented out until DB migration
          groupLevel: mapGroupToEnum(data.groupBatch), // Use mapped enum value
          feePlan: 'monthly', // Default fee plan
          feeAmount: 2000, // Default fee amount
          parentName: data.parentName,
          parentContact: data.parentNumber,
          parentUsername: data.parentUsername, // Use exact username from form
          parentPassword: data.parentPassword, // Use exact password from form
          // Additional data
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          weight: data.weight,
          height: data.height,
          governmentSchool: data.governmentSchool,
          schoolName: data.schoolName,
          sex: data.sex
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register student');
      }

      const result = await response.json();
      
      toast({
        title: "Student Registered Successfully",
        description: `${data.studentName} has been registered. Parent credentials have been created.`,
      });

      // Return the exact credentials entered by the parent
      onSuccess({
        username: data.parentUsername,
        password: data.parentPassword
      });

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong during registration",
        variant: "destructive"
      });
    }
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

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
                    name="parentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent's Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter parent's full name" {...field} />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="parentUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Login Username *</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose username for parent login" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Login Password *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Choose password for parent login" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                    name="interestedGames"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interested Sports * (Select 1-2 sports)</FormLabel>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['football', 'basketball', 'tennis', 'swimming', 'cricket', 'badminton', 'volleyball'].map((sport) => (
                            <div key={sport} className="flex items-center space-x-2">
                              <Checkbox
                                id={sport}
                                checked={field.value?.includes(sport) || false}
                                onCheckedChange={(checked) => {
                                  const currentGames = field.value || [];
                                  if (checked) {
                                    if (currentGames.length < 2) {
                                      field.onChange([...currentGames, sport]);
                                    }
                                  } else {
                                    field.onChange(currentGames.filter((game) => game !== sport));
                                  }
                                }}
                                disabled={(field.value?.length >= 2 && !field.value?.includes(sport)) || false}
                              />
                              <label 
                                htmlFor={sport} 
                                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize ${
                                  (field.value?.length >= 2 && !field.value?.includes(sport)) ? 'opacity-50' : ''
                                }`}
                              >
                                {sport}
                              </label>
                            </div>
                          ))}
                        </div>
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
