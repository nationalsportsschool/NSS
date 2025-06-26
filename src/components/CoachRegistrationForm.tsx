import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useCreateCoach } from '@/lib/api';
import * as z from 'zod';

// Coach form validation schema - updated for multiple sports + authentication
const coachFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  sports: z.array(z.string()).min(1, { message: "Please select at least one sport." }),
  experience: z.string().min(1, { message: "Please enter experience in years." }),
  qualifications: z.string().min(5, { message: "Please enter qualifications (minimum 5 characters)." }),
  salary: z.string().min(1, { message: "Please enter salary amount." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password." })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CoachFormValues = z.infer<typeof coachFormSchema>;

// Available sports
const AVAILABLE_SPORTS = [
  'Football',
  'Basketball', 
  'Tennis',
  'Cricket',
  'Athletics',
  'Swimming'
];

interface CoachRegistrationFormProps {
  onBack: () => void;
  onSuccess?: (coach: CoachFormValues) => void;
}

const CoachRegistrationForm: React.FC<CoachRegistrationFormProps> = ({ onBack, onSuccess }) => {
  const { toast } = useToast();
  const createCoachMutation = useCreateCoach();
  
  const form = useForm<CoachFormValues>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      sports: [],
      experience: "",
      qualifications: "",
      salary: "",
      username: "",
      password: "",
      confirmPassword: ""
    }
  });

  const handleAddCoach = async (data: CoachFormValues) => {
    try {
      const coachData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        sports: data.sports,
        experience: data.experience, // Backend expects string, not parsed int
        qualifications: data.qualifications,
        salary: data.salary, // Backend expects string, not parsed int
        username: data.username,
        password: data.password
      };

      await createCoachMutation.mutateAsync(coachData);
      
      toast({
        title: "Coach Added Successfully",
        description: `${data.name} has been added as a coach with username '${data.username}'. They can now log in to the system.`,
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
      
      // Reset form and go back
      form.reset();
      onBack();
    } catch (error) {
      console.error('Error adding coach:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add coach. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Coach</h1>
          <p className="text-muted-foreground">Fill in the details below to add a new coach to your academy.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Coach Information
          </CardTitle>
          <CardDescription>
            Enter the coach's personal and professional details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddCoach)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter coach's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sports"
                  render={() => (
                    <FormItem>
                      <FormLabel>Sports * (Select all that apply)</FormLabel>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {AVAILABLE_SPORTS.map((sport) => (
                          <FormField
                            key={sport}
                            control={form.control}
                            name="sports"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={sport}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(sport)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, sport])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== sport
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {sport}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="coach@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (Years) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Salary (₹) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications & Certifications *</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter qualifications, certifications, and relevant experience..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Login Credentials Section */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800">Login Credentials</h3>
                <p className="text-sm text-blue-600 mb-4">
                  Set up login credentials for the coach to access their dashboard
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter unique username" 
                            {...field}
                            onChange={(e) => {
                              // Convert to lowercase and remove special characters
                              const cleanValue = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                              field.onChange(cleanValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter secure password" 
                            autoComplete="new-password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password *</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Re-enter password to confirm" 
                          autoComplete="new-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Coach
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachRegistrationForm;
