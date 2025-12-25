import { createClient } from '@supabase/supabase-js';
import type { IStorage } from './storage';
import type {
  User,
  InsertUser,
  School,
  InsertSchool,
  Task,
  InsertTask,
  Event,
  InsertEvent,
  Supervision,
  InsertSupervision,
  AdditionalTask,
  InsertAdditionalTask,
} from "@shared/schema";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key are required');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        username: user.username,
        password: user.password,
        role: user.role || 'pengawas',
        name: user.fullName,
        nip: user.nip || null,
        position: user.rank || null,
        photo: user.photoUrl || null,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert back to expected format
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      role: data.role,
      fullName: data.name,
      nip: data.nip,
      rank: data.position,
      photoUrl: data.photo,
      createdAt: new Date(data.created_at),
    } as User;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const updateData: any = {};
    
    if (updates.fullName) updateData.name = updates.fullName;
    if (updates.nip) updateData.nip = updates.nip;
    if (updates.rank) updateData.position = updates.rank;
    if (updates.photoUrl) updateData.photo = updates.photoUrl;
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      role: data.role,
      fullName: data.name,
      nip: data.nip,
      rank: data.position,
      photoUrl: data.photo,
      createdAt: new Date(data.created_at),
    } as User;
  }

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(user => ({
      id: user.id,
      username: user.username,
      password: user.password,
      role: user.role,
      fullName: user.name,
      nip: user.nip,
      rank: user.position,
      photoUrl: user.photo,
      createdAt: new Date(user.created_at),
    })) as User[];
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Schools
  async getSchools(userId: string): Promise<School[]> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getSchool(id: string): Promise<School | undefined> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createSchool(school: InsertSchool): Promise<School> {
    const { data, error } = await supabase
      .from('schools')
      .insert([school])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteSchool(id: string): Promise<void> {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return data.map(task => ({
      id: task.id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      date: new Date(task.date),
      completed: task.completed,
      category: 'Perencanaan', // Default since column doesn't exist
      photo1: task.photo,
      photo2: null, // Not supported in current schema
      createdAt: new Date(task.created_at),
    })) as Task[];
  }

  async getTask(id: string): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return undefined;
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      completed: data.completed,
      category: data.category || 'Perencanaan',
      photo1: data.photo1 || data.photo,
      photo2: data.photo2,
      createdAt: new Date(data.created_at),
    } as Task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: task.userId,
        title: task.title,
        description: task.description,
        date: task.date,
        completed: task.completed,
        photo: task.photo1, // Use existing photo column
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      completed: data.completed,
      category: 'Perencanaan', // Default category since column doesn't exist
      photo1: data.photo,
      photo2: null, // Not supported in current schema
      createdAt: new Date(data.created_at),
    } as Task;
  }

  async updateTask(id: string, task: Partial<InsertTask>): Promise<Task> {
    const updateData: any = {};
    
    if (task.title) updateData.title = task.title;
    if (task.description) updateData.description = task.description;
    if (task.date) updateData.date = task.date;
    if (task.completed !== undefined) updateData.completed = task.completed;
    if (task.category) updateData.category = task.category;
    if (task.photo1) {
      updateData.photo = task.photo1;
      updateData.photo1 = task.photo1;
    }
    if (task.photo2) updateData.photo2 = task.photo2;
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      completed: data.completed,
      category: data.category,
      photo1: data.photo1,
      photo2: data.photo2,
      createdAt: new Date(data.created_at),
    } as Task;
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Events
  async getEvents(userId: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert([{
        user_id: event.userId,
        school_id: event.schoolId,
        title: event.title,
        date: event.date,
        time: event.time,
        description: event.description,
        reminded: event.reminded,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Supervisions
  async getSupervisions(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('supervisions')
      .select(`
        *,
        schools(name)
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return data.map(supervision => ({
      ...supervision,
      school: supervision.schools?.name || 'Unknown School',
    }));
  }

  async getSupervisionsBySchool(schoolId: string): Promise<Supervision[]> {
    const { data, error } = await supabase
      .from('supervisions')
      .select('*')
      .eq('school_id', schoolId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getSupervision(id: string): Promise<Supervision | undefined> {
    const { data, error } = await supabase
      .from('supervisions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createSupervision(supervision: InsertSupervision): Promise<Supervision> {
    const { data, error } = await supabase
      .from('supervisions')
      .insert([{
        user_id: supervision.userId,
        school_id: supervision.schoolId,
        type: supervision.type,
        date: supervision.date,
        findings: supervision.findings,
        recommendations: supervision.recommendations,
        teacher_name: supervision.teacherName,
        teacher_nip: supervision.teacherNip,
        photo: supervision.photo1,
        photo1: supervision.photo1,
        photo2: supervision.photo2,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateSupervision(id: string, supervision: Partial<InsertSupervision>): Promise<Supervision> {
    const updateData: any = {};
    
    if (supervision.schoolId) updateData.school_id = supervision.schoolId;
    if (supervision.type) updateData.type = supervision.type;
    if (supervision.date) updateData.date = supervision.date;
    if (supervision.findings) updateData.findings = supervision.findings;
    if (supervision.recommendations) updateData.recommendations = supervision.recommendations;
    if (supervision.teacherName) updateData.teacher_name = supervision.teacherName;
    if (supervision.teacherNip) updateData.teacher_nip = supervision.teacherNip;
    if (supervision.photo1) {
      updateData.photo = supervision.photo1;
      updateData.photo1 = supervision.photo1;
    }
    if (supervision.photo2) updateData.photo2 = supervision.photo2;
    
    const { data, error } = await supabase
      .from('supervisions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteSupervision(id: string): Promise<void> {
    const { error } = await supabase
      .from('supervisions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Additional Tasks
  async getAdditionalTasks(userId: string): Promise<AdditionalTask[]> {
    const { data, error } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return data.map(task => ({
      id: task.id,
      userId: task.user_id,
      schoolId: task.school_id,
      title: task.title,
      description: task.description,
      date: new Date(task.date),
      status: task.status,
      photo: task.photo,
      createdAt: new Date(task.created_at),
    })) as AdditionalTask[];
  }

  async getAdditionalTask(id: string): Promise<AdditionalTask | undefined> {
    const { data, error } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return undefined;
    
    return {
      id: data.id,
      userId: data.user_id,
      schoolId: data.school_id,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      status: data.status,
      photo: data.photo,
      createdAt: new Date(data.created_at),
    } as AdditionalTask;
  }

  async createAdditionalTask(task: any): Promise<AdditionalTask> {
    const { data, error } = await supabase
      .from('additional_tasks')
      .insert([{
        user_id: task.userId,
        school_id: task.schoolId || null,
        title: task.title,
        description: task.description,
        date: task.date,
        status: task.status || 'pending',
        photo: task.photo,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      schoolId: data.school_id,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      status: data.status,
      photo: data.photo,
      createdAt: new Date(data.created_at),
    } as AdditionalTask;
  }

  async updateAdditionalTask(id: string, task: Partial<InsertAdditionalTask>): Promise<AdditionalTask> {
    const updateData: any = {};
    
    if (task.name) {
      updateData.name = task.name;
      updateData.title = task.name;
    }
    if (task.title) {
      updateData.title = task.title;
      updateData.name = task.title;
    }
    if (task.description) updateData.description = task.description;
    if (task.date) updateData.date = task.date;
    if (task.location) updateData.location = task.location;
    if (task.organizer) updateData.organizer = task.organizer;
    if (task.photo1) {
      updateData.photo = task.photo1;
      updateData.photo1 = task.photo1;
    }
    if (task.photo2) updateData.photo2 = task.photo2;
    
    const { data, error } = await supabase
      .from('additional_tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      schoolId: data.school_id,
      name: data.name || data.title,
      title: data.title || data.name,
      description: data.description,
      date: new Date(data.date),
      location: data.location,
      organizer: data.organizer,
      photo1: data.photo1,
      photo2: data.photo2,
      createdAt: new Date(data.created_at),
    } as AdditionalTask;
  }

  async deleteAdditionalTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('additional_tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Reports
  async getMonthlyStats(userId: string, year: number, month: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

    // Get tasks stats
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('completed')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (tasksError) throw tasksError;

    // Get supervisions count
    const { data: supervisions, error: supervisionsError } = await supabase
      .from('supervisions')
      .select('id')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (supervisionsError) throw supervisionsError;

    // Get additional tasks count
    const { data: additionalTasks, error: additionalTasksError } = await supabase
      .from('additional_tasks')
      .select('id')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (additionalTasksError) throw additionalTasksError;

    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(t => t.completed).length || 0;

    return {
      totalTasks,
      completedTasks,
      supervisions: supervisions?.length || 0,
      additionalTasks: additionalTasks?.length || 0,
    };
  }

  async getYearlyStats(userId: string, year: number): Promise<any> {
    const startDate = new Date(year, 0, 1).toISOString();
    const endDate = new Date(year, 11, 31, 23, 59, 59).toISOString();

    // Get tasks stats
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('completed')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (tasksError) throw tasksError;

    // Get supervisions count
    const { data: supervisions, error: supervisionsError } = await supabase
      .from('supervisions')
      .select('id')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (supervisionsError) throw supervisionsError;

    // Get schools count
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('id');

    if (schoolsError) throw schoolsError;

    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(t => t.completed).length || 0;

    return {
      totalSupervisions: supervisions?.length || 0,
      totalTasks,
      completedTasks,
      schools: schools?.length || 0,
      completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }
}

export const supabaseStorage = new SupabaseStorage();