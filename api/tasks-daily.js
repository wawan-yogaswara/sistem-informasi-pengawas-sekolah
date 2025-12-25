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
      
      // Build query
      let query = supabase
        .from('tasks')
        .select('*');
      
      // Filter by user_id if provided
      if (user_id) {
        query = query.eq('user_id', user_id);
      }
      
      // Get real data from Supabase
      const { data: tasks, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase GET error:', error);
        return res.status(500).json({ error: 'Failed to fetch tasks' });
      }

      res.json(tasks || []);

    } else if (req.method === 'POST') {
      const { title, description, date, location, school, user_id, photo } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // Insert into Supabase tasks table
      const taskData = {
        title: title,
        description: description || '',
        date: date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        location: location || school || 'Sekolah Binaan',
        school: school || location || 'Sekolah Binaan',
        photo: photo || null,
        user_id: user_id || 'default_user',
        completed: false,
        created_at: new Date().toISOString()
      };

      console.log('Inserting task data:', taskData);

      const { data: newTask, error } = await supabase
        .from('tasks')
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
        .from('tasks')
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
        .from('tasks')
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
    console.error('Tasks Daily API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}