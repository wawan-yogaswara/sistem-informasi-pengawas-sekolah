import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { user_id } = req.query;
      
      console.log('🔍 API /tasks GET request:', { user_id });
      
      // Build query
      let query = supabase
        .from('additional_tasks')
        .select('*');
      
      // Filter by user_id if provided
      if (user_id) {
        query = query.eq('user_id', user_id);
        console.log('📋 Filtering by user_id:', user_id);
      } else {
        console.log('📋 No user_id filter, getting all data');
      }
      
      // Get real data from Supabase
      const { data: tasks, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase GET error:', error);
        return res.status(500).json({ error: 'Failed to fetch tasks' });
      }

      console.log(`✅ Found ${tasks?.length || 0} additional tasks`);
      
      // Log apel tasks specifically
      const apelTasks = (tasks || []).filter(task => 
        (task.title && task.title.toLowerCase().includes('apel')) ||
        (task.name && task.name.toLowerCase().includes('apel'))
      );
      console.log(`🌅 Apel tasks found: ${apelTasks.length}`);
      apelTasks.forEach(task => {
        console.log(`  - ${task.title || task.name} (user: ${task.user_id})`);
      });

      res.json(tasks || []);

    } else if (req.method === 'POST') {
      const { name, title, description, category, date, location, organizer, user_id } = req.body;

      const taskName = name || title;
      if (!taskName) {
        return res.status(400).json({ error: 'Name or title is required' });
      }

      // Insert into Supabase additional_tasks table with correct structure
      const taskData = {
        name: taskName,
        description: description || '',
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        location: location || category || 'Tidak Diketahui',
        organizer: organizer || 'Pengawas Sekolah',
        user_id: user_id || 'default_user'
      };

      console.log('Inserting task data:', taskData);

      const { data: newTask, error } = await supabase
        .from('additional_tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) {
        console.error('Supabase INSERT error:', error);
        return res.status(500).json({ error: 'Failed to create task', details: error.message });
      }

      console.log('Task created successfully:', newTask);
      res.status(201).json(newTask);

    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const updateData = req.body;

      // Update in Supabase
      const { data: updatedTask, error } = await supabase
        .from('additional_tasks')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase UPDATE error:', error);
        return res.status(500).json({ error: 'Failed to update task' });
      }

      res.status(200).json(updatedTask);

    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      // Delete from Supabase
      const { error } = await supabase
        .from('additional_tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase DELETE error:', error);
        return res.status(500).json({ error: 'Failed to delete task' });
      }

      res.status(200).json({ message: 'Task deleted successfully' });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Tasks API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}