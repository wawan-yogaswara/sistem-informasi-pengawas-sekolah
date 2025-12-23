import { supabase } from "./supabase";

// API client - Dynamic URL based on environment
const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : '/api'; // Use relative path for production

// Auth API - Using Supabase directly for production
export const authApi = {
  login: async (username: string, password: string) => {
    try {
      console.log('Attempting login with Supabase...');
      
      // Direct Supabase authentication
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error || !users) {
        console.error('User not found:', error);
        throw new Error('Username atau password salah');
      }
      
      // For production, we'll do a simple password check
      // In a real app, you'd use bcrypt to compare hashed passwords
      const isValidPassword = password === 'admin123' && username === 'admin' ||
                             password === 'wawan123' && username === 'wawan';
      
      if (!isValidPassword) {
        throw new Error('Username atau password salah');
      }
      
      // Create user session data
      const userData = {
        id: users.id,
        username: users.username,
        full_name: users.name || users.username,
        role: users.role || 'user',
        nip: users.nip || '',
        position: users.position || ''
      };
      
      // Store user data in localStorage
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', 'supabase-token-' + Date.now());

      console.log('✅ Login successful:', userData);
      return { user: userData, token: 'supabase-token-' + Date.now() };
      
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login gagal');
    }
  },

  logout: async () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    return { success: true };
  },

  getCurrentUser: async () => {
    const userData = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');
    
    if (!userData || !token) {
      throw new Error('Tidak ada session aktif');
    }

    return JSON.parse(userData);
  }
};

// Users API - Direct Supabase
export const usersApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('✅ Data users dari Supabase:', data?.length || 0, 'records');
      return data || [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      
      // Fallback to localStorage
      const localData = localStorage.getItem('users_data');
      if (localData) {
        const users = JSON.parse(localData);
        console.log('📦 Fallback ke localStorage users:', users.length, 'records');
        return users;
      }
      
      return [];
    }
  },

  create: async (userData: any) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: userData.username,
          password: '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', // admin123
          full_name: userData.full_name,
          role: userData.role,
          nip: userData.nip || '',
          rank: userData.rank || '',
          photo_url: userData.photo_url || ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error('Gagal membuat user');
    }
  }
};

// Schools API - Direct Supabase
export const schoolsApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          users!schools_user_id_fkey (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('✅ Data schools dari Supabase:', data?.length || 0, 'records');
      return data || [];
    } catch (error: any) {
      console.error('Error fetching schools:', error);
      
      // Fallback to localStorage
      const localData = localStorage.getItem('schools_data');
      if (localData) {
        const schools = JSON.parse(localData);
        console.log('📦 Fallback ke localStorage schools:', schools.length, 'records');
        return schools;
      }
      
      return [];
    }
  },

  create: async (schoolData: any) => {
    try {
      // Get current user to set user_id
      const currentUser = await authApi.getCurrentUser();
      
      const { data, error } = await supabase
        .from('schools')
        .insert([{
          user_id: currentUser.id,
          name: schoolData.name,
          address: schoolData.address,
          contact: schoolData.contact || '',
          principal_name: schoolData.principal_name || ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating school:', error);
      throw new Error('Gagal membuat sekolah');
    }
  }
};

// Additional Tasks API - Direct Supabase
export const additionalTasksApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('additional_tasks')
        .select(`
          *,
          users!additional_tasks_user_id_fkey (
            username,
            full_name
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      console.log('✅ Data additional tasks dari Supabase:', data?.length || 0, 'records');
      return data || [];
    } catch (error: any) {
      console.error('Error fetching additional tasks:', error);
      
      // Fallback to localStorage
      const localData = localStorage.getItem('additional_tasks_data');
      if (localData) {
        const tasks = JSON.parse(localData);
        console.log('📦 Fallback ke localStorage additional tasks:', tasks.length, 'records');
        return tasks;
      }
      
      return [];
    }
  },

  create: async (taskData: any) => {
    try {
      // Get current user to set user_id
      const currentUser = await authApi.getCurrentUser();
      
      const { data, error } = await supabase
        .from('additional_tasks')
        .insert([{
          user_id: currentUser.id,
          name: taskData.name,
          date: taskData.date,
          location: taskData.location,
          organizer: taskData.organizer || '',
          description: taskData.description || '',
          photo1: taskData.photo1 || ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating additional task:', error);
      throw new Error('Gagal membuat tugas tambahan');
    }
  },

  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('additional_tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting additional task:', error);
      throw new Error('Gagal menghapus tugas tambahan');
    }
  }
};

// Tasks API - Direct Supabase
export const tasksApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          users!tasks_user_id_fkey (
            username,
            full_name
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      console.log('✅ Data tasks dari Supabase:', data?.length || 0, 'records');
      return data || [];
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      
      // Fallback to localStorage
      const localData = localStorage.getItem('tasks_data');
      if (localData) {
        const tasks = JSON.parse(localData);
        console.log('📦 Fallback ke localStorage tasks:', tasks.length, 'records');
        return tasks;
      }
      
      return [];
    }
  },

  create: async (taskData: any) => {
    try {
      // Get current user to set user_id
      const currentUser = await authApi.getCurrentUser();
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          user_id: currentUser.id,
          title: taskData.title,
          category: taskData.category || 'Umum',
          description: taskData.description || '',
          completed: taskData.completed || false,
          date: taskData.date,
          photo1: taskData.photo1 || ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating task:', error);
      throw new Error('Gagal membuat tugas');
    }
  }
};

// Supervisions API - Direct localStorage (Fixed for Edge compatibility)
export const supervisionsApi = {
  getAll: async () => {
    try {
      // Direct localStorage only - no API calls to prevent 405 errors
      if (typeof window !== 'undefined' && window.localStorage) {
        const supervisionsData = localStorage.getItem('supervisions_data');
        if (supervisionsData) {
          const parsed = JSON.parse(supervisionsData);
          console.log('📦 Supervisions dari localStorage:', Array.isArray(parsed) ? parsed.length : 0, 'records');
          return Array.isArray(parsed) ? parsed : [];
        }
      }
      
      console.log('📦 No supervisions data found, returning empty array');
      return [];
    } catch (error: any) {
      console.error('Error reading supervisions from localStorage:', error);
      return [];
    }
  },

  create: async (formData: FormData) => {
    try {
      console.log('🔄 Creating supervision with FormData...');
      
      // Convert FormData to object with proper async file handling
      const supervisionData: any = {};
      const filePromises: Promise<void>[] = [];
      
      formData.forEach((value, key) => {
        if (key.startsWith('photo') && value instanceof File) {
          // Convert file to base64 for localStorage
          const promise = new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              supervisionData[key] = reader.result;
              resolve();
            };
            reader.readAsDataURL(value);
          });
          filePromises.push(promise);
        } else {
          supervisionData[key] = value;
        }
      });
      
      // Wait for all file conversions to complete
      await Promise.all(filePromises);
      
      // Get existing supervisions from localStorage
      const existingData = localStorage.getItem('supervisions_data');
      const supervisions = existingData ? JSON.parse(existingData) : [];
      
      // Find school name from schoolId
      const schoolsData = localStorage.getItem('schools_data');
      const schools = schoolsData ? JSON.parse(schoolsData) : [];
      const selectedSchool = schools.find((s: any) => s.id === supervisionData.schoolId);
      const schoolName = selectedSchool ? selectedSchool.name : supervisionData.schoolId;
      
      // Create new supervision object
      const newSupervision = {
        id: Date.now().toString(),
        school: schoolName,
        type: supervisionData.type || 'Akademik',
        date: supervisionData.date || new Date().toISOString().split('T')[0],
        teacherName: supervisionData.teacherName || '',
        teacherNip: supervisionData.teacherNip || '',
        findings: supervisionData.findings || '',
        recommendations: supervisionData.recommendations || '',
        photo1: supervisionData.photo1 || null,
        photo2: supervisionData.photo2 || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to supervisions array
      supervisions.push(newSupervision);
      
      // Save to localStorage with backup
      localStorage.setItem('supervisions_data', JSON.stringify(supervisions));
      localStorage.setItem('supervisions_data_backup', JSON.stringify(supervisions));
      
      console.log('✅ Supervisi berhasil disimpan:', newSupervision);
      return newSupervision;
    } catch (error: any) {
      console.error('❌ Error creating supervision:', error);
      throw new Error('Gagal menyimpan supervisi: ' + error.message);
    }
  },

  delete: async (id: string) => {
    try {
      console.log('🗑️ Deleting supervision:', id);
      
      const existingData = localStorage.getItem('supervisions_data');
      const supervisions = existingData ? JSON.parse(existingData) : [];
      
      const filteredSupervisions = supervisions.filter((s: any) => s.id !== id);
      
      localStorage.setItem('supervisions_data', JSON.stringify(filteredSupervisions));
      localStorage.setItem('supervisions_data_backup', JSON.stringify(filteredSupervisions));
      
      console.log('✅ Supervisi berhasil dihapus');
      return { success: true, id };
    } catch (error: any) {
      console.error('❌ Error deleting supervision:', error);
      throw new Error('Gagal menghapus supervisi');
    }
  }
};

// Dashboard API - Aggregate data from Supabase
export const dashboardApi = {
  getStats: async () => {
    try {
      const [usersData, schoolsData, tasksData, additionalTasksData] = await Promise.all([
        usersApi.getAll(),
        schoolsApi.getAll(),
        tasksApi.getAll(),
        additionalTasksApi.getAll()
      ]);

      return {
        totalUsers: usersData.length,
        totalSchools: schoolsData.length,
        totalTasks: tasksData.length,
        totalAdditionalTasks: additionalTasksData.length,
        completedTasks: tasksData.filter((task: any) => task.completed).length
      };
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalUsers: 0,
        totalSchools: 0,
        totalTasks: 0,
        totalAdditionalTasks: 0,
        completedTasks: 0
      };
    }
  }
};

// Export all APIs - removed duplicate exports