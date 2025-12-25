import { createClient } from '@supabase/supabase-js';

// FIXED: Initialize Supabase client dengan environment variables yang benar untuk Netlify
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
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

  // ENHANCED: Log environment variables untuk debugging
  console.log('🔧 Environment check:', {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    finalUrl: supabaseUrl,
    finalKey: supabaseKey ? 'SET' : 'NOT SET'
  });

  try {
    if (req.method === 'GET') {
      const { user_id } = req.query;
      
      console.log('📋 Fetching tasks for user_id:', user_id);
      
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
        console.error('❌ Supabase GET error:', error);
        return res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
      }

      console.log(`✅ Successfully fetched ${tasks?.length || 0} tasks`);
      
      // ENHANCED: Log sample data untuk debugging
      if (tasks && tasks.length > 0) {
        console.log('📋 Sample task data:', {
          id: tasks[0].id,
          title: tasks[0].title,
          photo: tasks[0].photo ? 'EXISTS' : 'NULL',
          photo1: tasks[0].photo1 ? 'EXISTS' : 'NULL',
          photo2: tasks[0].photo2 ? 'EXISTS' : 'NULL',
          user_id: tasks[0].user_id
        });
      }

      res.json(tasks || []);

    } else if (req.method === 'POST') {
      const { title, description, date, location, school, user_id, photo, photo2, school_name, activity_type, school_id, completed } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // ENHANCED: Insert into Supabase tasks table dengan semua field yang diperlukan
      const taskData = {
        title: title,
        description: description || '',
        date: date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        location: location || school || 'Sekolah Binaan',
        school: school || location || 'Sekolah Binaan',
        school_name: school_name || school || location || 'Sekolah Binaan',
        activity_type: activity_type || 'Tugas Harian',
        school_id: school_id || null,
        photo: photo || null,
        photo2: photo2 || null,
        user_id: user_id || 'default_user',
        completed: completed !== undefined ? completed : false,
        created_at: new Date().toISOString()
      };

      console.log('💾 Inserting task data:', taskData);

      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase INSERT error:', error);
        return res.status(500).json({ error: 'Failed to create task', details: error.message });
      }

      console.log('✅ Task created successfully:', newTask.id);
      res.status(201).json(newTask);

    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const updateData = req.body;

      console.log('✏️ Updating task:', id, updateData);

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
        console.error('❌ Supabase UPDATE error:', error);
        return res.status(500).json({ error: 'Failed to update task', details: error.message });
      }

      console.log('✅ Task updated successfully:', updatedTask.id);
      res.status(200).json(updatedTask);

    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      console.log('🗑️ Deleting task:', id);

      // Delete from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Supabase DELETE error:', error);
        return res.status(500).json({ error: 'Failed to delete task', details: error.message });
      }

      console.log('✅ Task deleted successfully:', id);
      res.status(200).json({ message: 'Task deleted successfully' });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('❌ Tasks Daily API error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}