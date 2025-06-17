
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X, Eye, Calendar, Image as ImageIcon, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Activity {
  id: string;
  title: string;
  description: string;
  batch: string;
  date: string;
  photos: string[];
  status: 'draft' | 'shared';
}

const ActivityUpdateCard = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [activityTitle, setActivityTitle] = useState<string>('');
  const [activityDescription, setActivityDescription] = useState<string>('');
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  
  const [recentActivities] = useState<Activity[]>([{
    id: '1',
    title: 'Football Training Session',
    description: 'Focused on dribbling and passing techniques',
    batch: 'Morning Batch A',
    date: '2024-06-07',
    photos: ['photo1.jpg', 'photo2.jpg'],
    status: 'shared'
  }, {
    id: '2',
    title: 'Basketball Practice',
    description: 'Free throw practice and team coordination',
    batch: 'Evening Batch B',
    date: '2024-06-06',
    photos: ['photo3.jpg'],
    status: 'draft'
  }]);

  const batches = ['Morning Batch A', 'Evening Batch B', 'Weekend Batch C'];

  const handleShowForm = () => {
    console.log('New Activity button clicked - showing form');
    setShowForm(!showForm);
  };

  const handleBatchSelect = (batch: string) => {
    console.log('Activity batch selected:', batch);
    setSelectedBatch(batch);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Activity title changed:', e.target.value);
    setActivityTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Activity description changed:', e.target.value);
    setActivityDescription(e.target.value);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      console.log('Photos uploaded:', {
        count: newPhotos.length,
        files: newPhotos.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      });
      setSelectedPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    const removedPhoto = selectedPhotos[index];
    console.log('Photo removed:', {
      index,
      filename: removedPhoto.name,
      remainingCount: selectedPhotos.length - 1
    });
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleCancelForm = () => {
    console.log('Activity form cancelled - resetting form data');
    setShowForm(false);
    setSelectedBatch('');
    setActivityTitle('');
    setActivityDescription('');
    setSelectedPhotos([]);
  };

  const handleViewActivity = (activityId: string) => {
    const activity = recentActivities.find(a => a.id === activityId);
    console.log('View activity clicked:', {
      activityId,
      activityTitle: activity?.title,
      activityStatus: activity?.status
    });
  };

  const handleSubmitActivity = async () => {
    if (!selectedBatch || !activityTitle || !activityDescription) {
      console.log('Activity submission failed - missing required fields:', {
        selectedBatch: !!selectedBatch,
        activityTitle: !!activityTitle,
        activityDescription: !!activityDescription
      });
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const timestamp = new Date();
    const activityData = {
      submissionTime: timestamp.toISOString(),
      batch: selectedBatch,
      title: activityTitle,
      description: activityDescription,
      photoCount: selectedPhotos.length,
      photos: selectedPhotos.map(photo => ({
        name: photo.name,
        size: photo.size,
        type: photo.type,
        lastModified: new Date(photo.lastModified).toISOString()
      }))
    };

    console.log('=== ACTIVITY SUBMISSION ===');
    console.log('Submission timestamp:', timestamp.toISOString());
    console.log('Activity details:', {
      batch: selectedBatch,
      title: activityTitle,
      description: activityDescription,
      photoCount: selectedPhotos.length
    });
    console.log('Photo details:', activityData.photos);
    console.log('Full activity submission data:', activityData);
    console.log('===========================');

    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Activity shared successfully');
      toast({
        title: "Activity Shared Successfully",
        description: "Activity has been shared with parents and admin"
      });
      setSelectedBatch('');
      setActivityTitle('');
      setActivityDescription('');
      setSelectedPhotos([]);
      setIsSubmitting(false);
      setShowForm(false);
    }, 1500);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">Activity Updates</h3>
            </div>
          </div>
          <Button onClick={handleShowForm} size="sm" className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-center rounded-sm py-0 my-0 mx-[14px] px-[22px]">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-5 py-5 space-y-5">
        {/* New Activity Form */}
        {showForm && (
          <div className="bg-secondary rounded-lg p-5 space-y-4 border border-border">
            <div className="space-y-4">
              <div>
                <Label htmlFor="batch" className="text-sm font-bold text-foreground mb-2 block">Batch</Label>
                <Select value={selectedBatch} onValueChange={handleBatchSelect}>
                  <SelectTrigger className="h-12 rounded-lg border-border bg-card">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map(batch => (
                      <SelectItem key={batch} value={batch}>
                        {batch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="title" className="text-sm font-bold text-foreground mb-2 block">Activity Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Football Training Session" 
                  value={activityTitle} 
                  onChange={handleTitleChange} 
                  className="h-12 rounded-lg border-border bg-card" 
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-bold text-foreground mb-2 block">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the activities and achievements..." 
                  value={activityDescription} 
                  onChange={handleDescriptionChange} 
                  rows={3} 
                  className="rounded-lg resize-none border-border bg-card" 
                />
              </div>

              <div>
                <Label className="text-sm font-bold text-foreground mb-2 block">Photos</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-card">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                    id="photo-upload" 
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground font-medium">Upload photos</p>
                  </label>
                </div>
              </div>

              {selectedPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {selectedPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center border border-border">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <button 
                        onClick={() => removePhoto(index)} 
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleSubmitActivity} 
                  disabled={isSubmitting} 
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold"
                >
                  {isSubmitting ? "Sharing..." : "Share Activity"}
                </Button>
                <Button 
                  onClick={handleCancelForm} 
                  variant="outline" 
                  className="h-12 px-6 rounded-lg border-border"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="space-y-4">
          <h4 className="font-bold text-foreground">Recent Activities</h4>
          {recentActivities.map(activity => (
            <div key={activity.id} className="bg-secondary rounded-lg p-4 border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-foreground truncate">{activity.title}</h5>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{activity.description}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <Badge variant={activity.status === 'shared' ? 'default' : 'secondary'} className="px-3 py-1 rounded-lg font-medium">
                    {activity.status === 'shared' ? 'Shared' : 'Draft'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-lg hover:bg-secondary"
                    onClick={() => handleViewActivity(activity.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityUpdateCard;
