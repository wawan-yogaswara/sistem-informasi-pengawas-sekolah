import { supabase } from "./supabase";

// API client - Dynamic URL based on environment
const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : '/api'; // Use relative path for production

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Auth API - Fallback to localStorage if Supabase fails
export const authApi = {
  login: async (username: string, password: string) => {
    try {
      console.log('🔐 Mencoba login:', username);
      
      // Kredensial yang valid (hardcoded untuk emergency)
      const validCredentials = {
        'admin': { password: 'admin123', user: {
          id: 'admin-123',
          username: 'admin',
          full_name: 'Administrator',
          role: 'admin',
          nip: '123456789',
          position: 'Administrator'
        }},
        'wawan': { password: 'wawan123', user: {
          id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
          username: 'wawan',
          full_name: 'Wawan Yogaswara',
          role: 'user',
          nip: '196505051990031007',
          position: 'Pengawas Sekolah'
        }}
      };
      
      // Cek kredensial
      const credential = validCredentials[username as keyof typeof validCredentials];
      if (!credential || credential.password !== password) {
        throw new Error('Username atau password salah');
      }
      
      const userData = credential.user;
      
      // Store user data in localStorage
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', username + '-token-' + Date.now());

      console.log('✅ Login berhasil:', userData.full_name);
      return { user: userData, token: username + '-token-' + Date.now() };
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Fallback: coba Supabase jika ada
      try {
        console.log('🔄 Fallback ke Supabase...');
        
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single();
        
        if (!error && users) {
          const userData = {
            id: users.id,
            username: users.username,
            full_name: users.name || users.full_name || users.username,
            role: users.role || 'user',
            nip: users.nip || '',
            position: users.position || ''
          };
          
          localStorage.setItem('auth_user', JSON.stringify(userData));
          localStorage.setItem('auth_token', 'supabase-token-' + Date.now());
          
          console.log('✅ Supabase login berhasil:', userData);
          return { user: userData, token: 'supabase-token-' + Date.now() };
        }
      } catch (supabaseError) {
        console.warn('Supabase juga gagal:', supabaseError);
      }
      
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
      
      console.log('📝 Creating school with data:', schoolData);
      
      const { data, error } = await supabase
        .from('schools')
        .insert([{
          name: schoolData.name,
          address: schoolData.address,
          phone: schoolData.phone || schoolData.contact || '',
          principal: schoolData.principal || schoolData.principal_name || '',
          email: schoolData.email || ''
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Supabase error creating school:', error);
        throw error;
      }
      
      console.log('✅ School created successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error creating school:', error);
      throw new Error('Gagal membuat sekolah: ' + error.message);
    }
  }
};

// Additional Tasks API - Direct Supabase with localStorage sync
export const additionalTasksApi = {
  getAll: async () => {
    try {
      // Always try Supabase first
      const { data, error } = await supabase
        .from('additional_tasks')
        .select(`
          *,
          schools (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Supabase error, falling back to localStorage:', error);
        throw error;
      }
      
      console.log('✅ Data additional tasks dari Supabase:', data?.length || 0, 'records');
      
      // Update localStorage with fresh data
      if (data) {
        localStorage.setItem('additional_tasks_data', JSON.stringify(data));
      }
      
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
      // Get current user with correct ID validation
      const currentUser = await authApi.getCurrentUser();
      
      // Validate user ID format (should be UUID)
      if (!currentUser.id || !currentUser.id.includes('-')) {
        console.warn('⚠️ Invalid user ID format, using fallback');
        // Use correct wawan ID as fallback
        currentUser.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
      }
      
      // Use first available school as default
      const schoolId = '1cd40355-1b07-402d-8309-b243c098cfe9'; // SDN 1 Garut
      
      // Map to correct Supabase schema (based on actual table structure)
      const supabaseTask = {
        user_id: currentUser.id,
        school_id: schoolId,
        title: taskData.name || taskData.title,  // Support both name and title
        description: taskData.description || '',
        date: taskData.date || new Date().toISOString().split('T')[0], // Required: date in YYYY-MM-DD format
        status: taskData.status || 'completed', // Set as completed since it's already done
        photo: taskData.photo || null // Add photo support
      };
      
      console.log('📤 Saving additional task to Supabase:', supabaseTask.title);
      console.log('   User ID:', supabaseTask.user_id);
      console.log('   School ID:', supabaseTask.school_id);
      console.log('   Title:', supabaseTask.title);
      console.log('   Description:', supabaseTask.description?.substring(0, 50) + '...');
      
      // Save to Supabase with error handling
      const { data, error } = await supabase
        .from('additional_tasks')
        .insert([supabaseTask])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Gagal menyimpan ke database: ${error.message}`);
      }
      
      console.log('✅ Additional task berhasil disimpan ke Supabase:', data);
      
      // Update localStorage as cache only
      const localTasks = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');
      localTasks.unshift(data);
      localStorage.setItem('additional_tasks_data', JSON.stringify(localTasks));
      
      console.log('📦 localStorage updated as cache');
      
      return data;
    } catch (error: any) {
      console.error('❌ Error creating additional task:', error);
      
      // Fallback to localStorage with proper UUID and correct user ID
      console.log('📦 Fallback: saving to localStorage with UUID');
      
      const currentUser = await authApi.getCurrentUser();
      const correctUserId = currentUser.id && currentUser.id.includes('-') 
        ? currentUser.id 
        : '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e'; // Wawan's correct ID
      
      const taskWithUUID = {
        id: crypto.randomUUID(), // Use proper UUID
        title: taskData.name || taskData.title,
        description: taskData.description || '',
        date: taskData.date || new Date().toISOString().split('T')[0],
        status: taskData.status || 'pending',
        photo: taskData.photo || null,
        user_id: correctUserId,
        school_id: '1cd40355-1b07-402d-8309-b243c098cfe9', // SDN 1 Garut
        created_at: new Date().toISOString()
      };
      
      const localTasks = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');
      localTasks.unshift(taskWithUUID);
      localStorage.setItem('additional_tasks_data', JSON.stringify(localTasks));
      
      console.log('✅ Task saved to localStorage with UUID:', taskWithUUID.id);
      return taskWithUUID;
    }
  },

  createWithPhotos: async (formData: FormData) => {
    try {
      // Extract form data
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const date = formData.get('date') as string;
      const status = formData.get('status') as string;
      
      // Handle photo upload - convert to base64
      let photoBase64 = null;
      const photo1 = formData.get('photo1') as File;
      
      if (photo1) {
        const reader = new FileReader();
        photoBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo1);
        });
      }
      
      // Get current user
      const currentUser = await authApi.getCurrentUser();
      
      // Create task data for localStorage with UUID-like ID
      const taskData = {
        id: crypto.randomUUID(), // Use proper UUID
        title: title,
        description: description || '',
        date: date || new Date().toISOString().split('T')[0],
        status: status || 'pending',
        photo: photoBase64,
        user_id: currentUser.id,
        created_at: new Date().toISOString()
      };
      
      console.log('📤 Saving additional task to localStorage:', {
        title: taskData.title,
        hasPhoto: !!photoBase64,
        date: taskData.date
      });
      
      // Save to localStorage directly for now
      const localTasks = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');
      localTasks.unshift(taskData);
      localStorage.setItem('additional_tasks_data', JSON.stringify(localTasks));
      
      console.log('✅ Additional task saved to localStorage successfully');
      
      return taskData;
      
    } catch (error: any) {
      console.error('❌ Error creating additional task with photos:', error);
      throw new Error(`Gagal menyimpan data: ${error.message}. Pastikan koneksi internet stabil dan coba lagi.`);
    }
  },

  delete: async (id: string) => {
    try {
      // Delete from Supabase first
      const { error } = await supabase
        .from('additional_tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      console.log('✅ Additional task berhasil dihapus dari Supabase');
      
      // Update localStorage immediately
      const localTasks = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');
      const filteredTasks = localTasks.filter((task: any) => task.id !== id);
      localStorage.setItem('additional_tasks_data', JSON.stringify(filteredTasks));
      
      return { success: true };
    } catch (error: any) {
      console.error('❌ Error deleting additional task:', error);
      
      // Fallback: delete from localStorage only
      console.log('📦 Fallback: deleting from localStorage only');
      const localTasks = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');
      const filteredTasks = localTasks.filter((task: any) => task.id !== id);
      localStorage.setItem('additional_tasks_data', JSON.stringify(filteredTasks));
      
      return { success: true };
    }
  }
};

// Tasks API - Direct Supabase with localStorage fallback
export const tasksApi = {
  getAll: async () => {
    try {
      console.log('🔍 Fetching tasks...');
      
      // Coba localStorage dulu untuk response cepat
      const localTasks = localStorage.getItem('tasks_data');
      if (localTasks) {
        const tasks = JSON.parse(localTasks);
        console.log('📦 Tasks dari localStorage:', tasks.length, 'records');
        return tasks;
      }
      
      // Jika localStorage kosong, coba Supabase
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
      
      if (error) {
        console.warn('⚠️ Supabase error, using fallback:', error);
        throw error;
      }
      
      console.log('✅ Tasks dari Supabase:', data?.length || 0, 'records');
      
      // Update localStorage dengan data Supabase
      if (data && data.length > 0) {
        localStorage.setItem('tasks_data', JSON.stringify(data));
      }
      
      return data || [];
    } catch (error: any) {
      console.error('❌ Error fetching tasks:', error);
      
      // Fallback ke localStorage
      const localData = localStorage.getItem('tasks_data');
      if (localData) {
        const tasks = JSON.parse(localData);
        console.log('📦 Fallback ke localStorage tasks:', tasks.length, 'records');
        return tasks;
      }
      
      // Jika tidak ada data sama sekali, return sample data
      console.log('📝 Generating sample tasks...');
      const sampleTasks = [
        {
          id: crypto.randomUUID(),
          user_id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
          title: 'Supervisi Pembelajaran',
          description: 'Melakukan supervisi pembelajaran di sekolah binaan',
          completed: false,
          date: new Date().toISOString().split('T')[0],
          activity_type: 'Pendampingan',
          school_id: '1cd40355-1b07-402d-8309-b243c098cfe9',
          photo: null,
          photo2: null,
          created_at: new Date().toISOString(),
          schools: {
            id: '1cd40355-1b07-402d-8309-b243c098cfe9',
            name: 'SDN 1 Garut'
          }
        }
      ];
      
      localStorage.setItem('tasks_data', JSON.stringify(sampleTasks));
      return sampleTasks;
    }
  },

  create: async (taskData: any) => {
    try {
      // Get current user with correct ID validation
      const currentUser = await authApi.getCurrentUser();
      
      // Validate user ID format (should be UUID)
      if (!currentUser.id || !currentUser.id.includes('-')) {
        console.warn('⚠️ Invalid user ID format, using fallback');
        // Use correct wawan ID as fallback
        currentUser.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
      }
      
      // Map to correct Supabase schema (NO category column)
      const supabaseTask = {
        user_id: currentUser.id,
        title: taskData.title,
        description: taskData.description || '',
        completed: taskData.completed || false,
        date: taskData.date,
        photo: taskData.photo1 || taskData.photo || '', // Use 'photo' not 'photo1'
        created_at: new Date().toISOString()
      };
      
      console.log('📤 Saving task directly to Supabase:', supabaseTask.title);
      console.log('   User ID:', supabaseTask.user_id);
      
      // Save to Supabase with error handling
      const { data, error } = await supabase
        .from('tasks')
        .insert([supabaseTask])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Gagal menyimpan ke database: ${error.message}`);
      }
      
      console.log('✅ Task berhasil disimpan ke Supabase:', data);
      
      // Update localStorage as cache only
      const localTasks = JSON.parse(localStorage.getItem('tasks_data') || '[]');
      localTasks.unshift(data);
      localStorage.setItem('tasks_data', JSON.stringify(localTasks));
      
      console.log('📦 localStorage updated as cache');
      
      return data;
    } catch (error: any) {
      console.error('❌ Error creating task:', error);
      
      // Fallback to localStorage with proper UUID and correct user ID
      console.log('📦 Fallback: saving to localStorage with UUID');
      
      const currentUser = await authApi.getCurrentUser();
      const correctUserId = currentUser.id && currentUser.id.includes('-') 
        ? currentUser.id 
        : '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e'; // Wawan's correct ID
      
      const taskWithUUID = {
        id: crypto.randomUUID(), // Use proper UUID
        title: taskData.title,
        description: taskData.description || '',
        completed: taskData.completed || false,
        date: taskData.date,
        photo: taskData.photo1 || taskData.photo || '',
        user_id: correctUserId,
        created_at: new Date().toISOString()
      };
      
      const localTasks = JSON.parse(localStorage.getItem('tasks_data') || '[]');
      localTasks.unshift(taskWithUUID);
      localStorage.setItem('tasks_data', JSON.stringify(localTasks));
      
      console.log('✅ Task saved to localStorage with UUID:', taskWithUUID.id);
      return taskWithUUID;
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
        id: crypto.randomUUID(), // Use proper UUID instead of timestamp
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