import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Phone, Info, Search, Filter, X, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUpdateStudent } from '@/lib/api';
import * as XLSX from 'xlsx';

// Define the type for a single student based on actual database structure
type Student = {
  id: number;
  name: string;
  sport: string;
  group_level: string;
  fee_plan: string;
  fee_amount: number;
  payment_status: 'paid' | 'not_paid' | 'upcoming';
  pending_amount: number;
  parent_contact: string;
  last_payment: string | null;
  created_at: string;
  updated_at: string;
};

interface StudentsTabProps {
  students: Student[];
}

const StudentsTab: React.FC<StudentsTabProps> = ({ students }) => {
  const { toast } = useToast();
  const updateStudentMutation = useUpdateStudent();
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const [filterCoach, setFilterCoach] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Available options from database enums
  const sports = ['Cricket', 'Football', 'Tennis', 'Athletics', 'Swimming', 'Basketball'];
  const batches = ['Beginners', 'Intermediate', 'Advanced', 'Professional'];
  
  // Get unique coaches from the students data (in real app, fetch from coaches table)
  const coaches = ['All Coaches']; // Placeholder as coach assignment isn't implemented yet

  // Filter logic with correct field names
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = !filterSport || student.sport === filterSport;
    // Note: Coach filtering disabled as coach assignment not yet implemented
    
    return matchesSearch && matchesSport;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setFilterSport('');
    setFilterCoach('');
  };

  const hasActiveFilters = searchQuery || filterSport || filterCoach;

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setSelectedSport(student.sport);
    setSelectedBatch(student.group_level);
  };

  const handleSaveChanges = async () => {
    if (!editingStudent) return;
    
    try {
      await updateStudentMutation.mutateAsync({
        id: editingStudent.id,
        data: {
          sport: selectedSport,
          group_level: selectedBatch,
        }
      });
      
      toast({
        title: "Student Updated",
        description: `${editingStudent.name} has been assigned to ${selectedSport} - ${selectedBatch} batch.`,
      });
      setEditingStudent(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportToExcel = () => {
    // Prepare data for export with correct field names
    const exportData = filteredStudents.map(student => ({
      'Student Name': student.name,
      'Sport': student.sport,
      'Group': student.group_level,
      'Fee Plan': student.fee_plan,
      'Payment Status': student.payment_status === 'paid' ? 'Paid' : 'Pending',
      'Pending Amount (₹)': student.pending_amount,
      'Parent Contact': student.parent_contact,
      'Last Payment': student.last_payment || 'N/A'
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const columnWidths = [
      { wch: 20 }, // Student Name
      { wch: 15 }, // Sport
      { wch: 15 }, // Group
      { wch: 20 }, // Fee Plan
      { wch: 15 }, // Payment Status
      { wch: 18 }, // Pending Amount
      { wch: 18 }, // Parent Contact
      { wch: 15 }  // Last Payment
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `students_export_${currentDate}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);

    // Show success toast
    toast({
      title: "Export Successful",
      description: `Student data exported to ${filename}. ${filteredStudents.length} students included.`,
    });
  };

  return (
    <>
      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {[searchQuery, filterSport, filterCoach].filter(Boolean).length}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportToExcel}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">            <div className="space-y-2">
              <Label htmlFor="sport-filter">Filter by Sport</Label>
              <Select value={filterSport || "all-sports"} onValueChange={(value) => setFilterSport(value === "all-sports" ? "" : value)}>
                <SelectTrigger id="sport-filter">
                  <SelectValue placeholder="All Sports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sports">All Sports</SelectItem>
                  {sports.map(sport => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coach-filter">Filter by Coach</Label>
              <Select value={filterCoach || "all-coaches"} onValueChange={(value) => setFilterCoach(value === "all-coaches" ? "" : value)}>
                <SelectTrigger id="coach-filter">
                  <SelectValue placeholder="All Coaches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-coaches">All Coaches</SelectItem>
                  {coaches.map(coach => (
                    <SelectItem key={coach} value={coach}>{coach}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredStudents.length} of {students.length} students
            {hasActiveFilters && " (filtered)"}
          </span>
        </div>
      </div>      {/* Students Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStudents.map((student) => (
            <Card key={student.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg">              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-md font-semibold">{student.name}</CardTitle>                  <Badge
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      student.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {student.payment_status === 'paid' 
                      ? 'Paid' 
                      : `Pending: ₹${student.pending_amount}`
                    }
                  </Badge>
                </div>
              </CardHeader>              <CardContent className="p-4 pt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sport:</span>
                  <span>{student.sport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Group:</span>
                  <span>{student.group_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee Plan:</span>
                  <span>{student.fee_plan}</span>
                </div>                {student.pending_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending Amount:</span>
                    <span className="font-semibold text-red-600">
                      ₹{student.pending_amount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Parent:</span>
                  <div className="flex items-center gap-2">
                    <span>{student.parent_contact}</span>
                    <a href={`tel:${student.parent_contact}`} className="text-gray-500 hover:text-gray-800">
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <div className="pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleEditStudent(student)}
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Edit Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Student Details</DialogTitle>
                        <DialogDescription>
                          Update {editingStudent?.name}'s sport and batch assignment.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="sport" className="text-right">
                            Sport
                          </Label>
                          <Select value={selectedSport} onValueChange={setSelectedSport}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select a sport" />
                            </SelectTrigger>
                            <SelectContent>
                              {sports.map((sport) => (
                                <SelectItem key={sport} value={sport}>
                                  {sport}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="batch" className="text-right">
                            Batch
                          </Label>
                          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select a batch" />
                            </SelectTrigger>
                            <SelectContent>
                              {batches.map((batch) => (
                                <SelectItem key={batch} value={batch}>
                                  {batch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingStudent(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveChanges}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>            </Card>
          ))}
      </div>
      
      {/* No Results Message */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {hasActiveFilters 
              ? "No students found matching your filters. Try adjusting your search criteria."
              : "No students found."
            }
          </p>
        </div>
      )}
    </>
  );
};

export default StudentsTab;
