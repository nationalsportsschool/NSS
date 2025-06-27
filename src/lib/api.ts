/**
 * NSS Frontend API Integration
 * This file provides React hooks and utilities to replace mockData with real API calls
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API Base URL - Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nssbackend-czak.onrender.com/api';

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('🔗 API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    API_BASE_URL,
    mode: import.meta.env.MODE
  });
}

// API Client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    // Don't set Content-Type for FormData - let browser handle it
    if (options?.body instanceof FormData) {
      delete config.headers!['Content-Type'];
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; // Extract data from API response format
  }

  // Students API
  async getStudents() {
    return this.request('/students');
  }

  async getStudent(id: number) {
    return this.request(`/students/${id}`);
  }

  async createStudent(studentData: any) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(id: number, updateData: any) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteStudent(id: number) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  async getStudentsBySport(sport: string) {
    return this.request(`/students/sport/${sport}`);
  }

  async getStudentsByPaymentStatus(status: string) {
    return this.request(`/students/payment-status/${status}`);
  }

  // Payment API
  async getPaymentLogs() {
    return this.request('/payment/logs');
  }

  async createPaymentLog(paymentData: any) {
    return this.request('/payment/logs', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async updatePaymentLog(id: number, updateData: any) {
    return this.request(`/payment/logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async getPaymentLogsByStudent(studentId: number) {
    return this.request(`/payment/logs/student/${studentId}`);
  }

  async createPaymentOrder(orderData: any) {
    return this.request('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async verifyPayment(verificationData: any) {
    return this.request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }

  async getRazorpayKey() {
    return this.request('/payment/key');
  }

  // Coaches API
  async getCoaches() {
    return this.request('/coaches');
  }

  async getCoach(id: number) {
    return this.request(`/coaches/${id}`);
  }

  async createCoach(coachData: any) {
    return this.request('/coaches', {
      method: 'POST',
      body: JSON.stringify(coachData),
    });
  }

  async updateCoach(id: number, coachData: any) {
    return this.request(`/coaches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coachData),
    });
  }

  async deleteCoach(id: number) {
    return this.request(`/coaches/${id}`, {
      method: 'DELETE',
    });
  }

  async getCoachesBySport(sport: string) {
    return this.request(`/coaches/sport/${sport}`);
  }

  // Authentication API
  async adminLogin(username: string, password: string) {
    // For auth endpoints, we need the full response structure
    const url = `${this.baseUrl}/auth/admin/login`;
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return full response for auth endpoints
  }

  async verifyAdminAuth(token: string) {
    // For auth endpoints, we need the full response structure  
    const url = `${this.baseUrl}/auth/admin/verify`;
    
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return full response for auth endpoints
  }

  async coachLogin(username: string, password: string) {
    // For auth endpoints, we need the full response structure
    const url = `${this.baseUrl}/auth/coach/login`;
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return full response for auth endpoints
  }

  async verifyCoachAuth(token: string) {
    // For auth endpoints, we need the full response structure  
    const url = `${this.baseUrl}/auth/coach/verify`;
    
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return full response for auth endpoints
  }

  async parentLogin(username: string, password: string) {
    // For auth endpoints, we need the full response structure
    const url = `${this.baseUrl}/auth/parent/login`;
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return full response for auth endpoints
  }

  async verifyParentAuth(token: string) {
    // For auth endpoints, we need the full response structure  
    const url = `${this.baseUrl}/auth/parent/verify`;
    
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return full response for auth endpoints
  }

  // Attendance API
  async getStudentAttendance(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return this.request(`/attendance/students?${params.toString()}`);
  }

  async getCoachAttendance(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return this.request(`/attendance/coaches?${params.toString()}`);
  }

  async markStudentAttendance(attendanceData: any) {
    return this.request('/attendance/students', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  async markCoachAttendance(attendanceData: any) {
    return this.request('/attendance/coaches', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  // Drills API
  async getDrills() {
    return this.request('/drills');
  }

  async createDrill(drillData: any, imageFile?: File) {
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Append other drill data
      Object.keys(drillData).forEach(key => {
        formData.append(key, drillData[key]);
      });

      return this.request('/drills', {
        method: 'POST',
        body: formData,
        headers: {} // Let browser set Content-Type for FormData
      });
    } else {
      return this.request('/drills', {
        method: 'POST',
        body: JSON.stringify(drillData),
      });
    }
  }

  // Parent-specific API
  async getParentChildren(parentId: number) {
    return this.request(`/parents/${parentId}/children`);
  }

  async getChildAttendance(studentId: number, startDate?: string, endDate?: string) {
    let endpoint = `/students/${studentId}/attendance`;
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('start', startDate);
      if (endDate) params.append('end', endDate);
      endpoint += `?${params.toString()}`;
    }
    return this.request(endpoint);
  }

  async getChildPayments(studentId: number) {
    return this.request(`/students/${studentId}/payments`);
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Coach API methods
export const coachApi = {
  // Get all coaches
  getAll: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/coaches`);
    if (!response.ok) throw new Error('Failed to fetch coaches');
    const data = await response.json();
    return data.data || [];
  },

  // Create coach
  create: async (coachData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/coaches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coachData),
    });
    if (!response.ok) throw new Error('Failed to create coach');
    const data = await response.json();
    return data.data;
  },

  // Update coach
  update: async (id: number, coachData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/coaches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coachData),
    });
    if (!response.ok) throw new Error('Failed to update coach');
    const data = await response.json();
    return data.data;
  },

  // Delete coach
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/coaches/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete coach');
  },
};

// React Query Hooks for Students
export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => apiClient.getStudents(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStudent = (id: number) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => apiClient.getStudent(id),
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (studentData: any) => apiClient.createStudent(studentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiClient.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// React Query Hooks for Coaches
export const useCoaches = () => {
  return useQuery({
    queryKey: ['coaches'],
    queryFn: () => apiClient.getCoaches(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCoach = (id: number) => {
  return useQuery({
    queryKey: ['coach', id],
    queryFn: () => apiClient.getCoach(id),
    enabled: !!id,
  });
};

export const useCreateCoach = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (coachData: any) => apiClient.createCoach(coachData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
    },
  });
};

export const useUpdateCoach = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiClient.updateCoach(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
    },
  });
};

export const useDeleteCoach = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.deleteCoach(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
    },
  });
};

export const useCoachesBySport = (sport: string) => {
  return useQuery({
    queryKey: ['coaches', 'sport', sport],
    queryFn: () => apiClient.getCoachesBySport(sport),
    enabled: !!sport,
  });
};

// React Query Hooks for Payment Logs
export const usePaymentLogs = () => {
  return useQuery({
    queryKey: ['paymentLogs'],
    queryFn: () => apiClient.getPaymentLogs(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePaymentLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentData: any) => apiClient.createPaymentLog(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentLogs'] });
    },
  });
};

export const useUpdatePaymentLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...updateData }: { id: number } & any) => apiClient.updatePaymentLog(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentLogs'] });
    },
  });
};

// React Query Hooks for Attendance
export const useStudentAttendance = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['studentAttendance', startDate, endDate],
    queryFn: () => apiClient.getStudentAttendance(startDate, endDate),
    staleTime: 1 * 60 * 1000, // 1 minute for attendance data
  });
};

export const useCoachAttendance = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['coachAttendance', startDate, endDate],
    queryFn: () => apiClient.getCoachAttendance(startDate, endDate),
    staleTime: 1 * 60 * 1000,
  });
};

export const useMarkStudentAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (attendanceData: any) => apiClient.markStudentAttendance(attendanceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentAttendance'] });
    },
  });
};

export const useMarkCoachAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (attendanceData: any) => apiClient.markCoachAttendance(attendanceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coachAttendance'] });
    },
  });
};

// React Query Hooks for Drills
export const useDrills = () => {
  return useQuery({
    queryKey: ['drills'],
    queryFn: () => apiClient.getDrills(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDrill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ drillData, imageFile }: { drillData: any; imageFile?: File }) => 
      apiClient.createDrill(drillData, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drills'] });
    },
  });
};

// Payment Integration Hooks
export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: (orderData: any) => apiClient.createPaymentOrder(orderData),
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (verificationData: any) => apiClient.verifyPayment(verificationData),
  });
};

export const useRazorpayKey = () => {
  return useQuery({
    queryKey: ['razorpayKey'],
    queryFn: () => apiClient.getRazorpayKey(),
    staleTime: Infinity, // Key doesn't change often
  });
};

// Parent-specific hooks
export const useParentChildren = (parentId?: number) => {
  return useQuery({
    queryKey: ['parentChildren', parentId],
    queryFn: () => parentId ? apiClient.getParentChildren(parentId) : Promise.resolve([]),
    enabled: !!parentId,
  });
};

export const useChildAttendance = (studentId?: number, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['childAttendance', studentId, startDate, endDate],
    queryFn: () => studentId ? apiClient.getChildAttendance(studentId, startDate, endDate) : Promise.resolve([]),
    enabled: !!studentId,
  });
};

export const useChildPayments = (studentId?: number) => {
  return useQuery({
    queryKey: ['childPayments', studentId],
    queryFn: () => studentId ? apiClient.getChildPayments(studentId) : Promise.resolve([]),
    enabled: !!studentId,
  });
};
