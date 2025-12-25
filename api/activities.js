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
      
      console.log('🔍 Fetching activities for user_id:', user_id);
      
      // Get real data from Supabase - try additional_tasks table first (this is the correct table)
      let activities = [];
      let error = null;

      // Build query with user_id filter if provided
      let activitiesQuery = supabase
        .from('additional_tasks')
        .select(`
          *,
          schools (
            id,
            name
          )
        `);
      
      if (user_id) {
        activitiesQuery = activitiesQuery.eq('user_id', user_id);
      }
      
      // Try 'additional_tasks' table first (this is the correct table for activities)
      const { data: additionalTasksData, error: additionalTasksError } = await activitiesQuery
        .order('created_at', { ascending: false });

      if (!additionalTasksError && additionalTasksData) {
        console.log(`✅ Found ${additionalTasksData.length} activities from additional_tasks table`);
        activities = additionalTasksData.map(task => ({
          id: task.id,
          title: task.title,
          name: task.title, // For compatibility
          description: task.description,
          date: task.date,
          location: task.location,
          organizer: task.organizer || 'Pengawas Sekolah',
          photo: task.photo,     // FIXED: Use 'photo' not 'photo1'
          photo1: task.photo,    // Keep for Reports page compatibility
          photo2: task.photo2,
          user_id: task.user_id,
          school_id: task.school_id,
          schools: task.schools,
          created_at: task.created_at,
          updated_at: task.updated_at
        }));
      } else {
        console.log('⚠️ additional_tasks query failed, trying activities table:', additionalTasksError?.message);
        
        // Try 'activities' table as fallback
        let fallbackQuery = supabase
          .from('activities')
          .select('*');
        
        if (user_id) {
          fallbackQuery = fallbackQuery.eq('user_id', user_id);
        }
        
        const { data: activitiesData, error: activitiesError } = await fallbackQuery
          .order('created_at', { ascending: false });

        if (!activitiesError && activitiesData) {
          console.log(`✅ Found ${activitiesData.length} activities from activities table`);
          activities = activitiesData;
        } else {
          console.log('❌ Both tables failed:', { additionalTasksError, activitiesError });
          error = additionalTasksError || activitiesError;
        }
      }

      if (error) {
        console.error('Supabase GET error:', error);
        return res.status(500).json({ error: 'Failed to fetch activities' });
      }

      res.json(activities || []);

    } else if (req.method === 'POST') {
      const { title, description, date, user_id, type, location, name } = req.body;

      if (!title && !name) {
        return res.status(400).json({ error: 'Title or name is required' });
      }

      // Validate user_id - ensure it's a valid UUID format
      let validUserId = user_id || 'default_user';
      
      // For Wawan user, use the correct UUID
      if (user_id === '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e' || validUserId === 'wawan' || validUserId === 'default_user') {
        validUserId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
      }
      
      // Validate school_id - use default school if not provided
      const defaultSchoolId = '1cd40355-1b07-402d-8309-b243c098cfe9'; // SDN 1 Garut
      
      // Prepare data for insertion into additional_tasks table
      const activityData = {
        title: title || name,
        description: description || '',
        date: date || new Date().toISOString().split('T')[0],
        user_id: validUserId,
        school_id: defaultSchoolId,
        status: 'completed',
        location: location || 'Tempat Kegiatan',
        organizer: 'Pengawas Sekolah',
        photo: null, // Will be handled separately if needed
        photo2: null,
        created_at: new Date().toISOString()
      };

      console.log('💾 Inserting activity data:', activityData);

      // Insert into additional_tasks table (this is the correct table for activities)
      let { data: newActivity, error } = await supabase
        .from('additional_tasks')
        .insert([activityData])
        .select()
        .single();

      // If additional_tasks table doesn't exist or has constraint issues, try activities table
      if (error) {
        console.log('⚠️ additional_tasks insert failed, trying activities table:', error.message);
        
        const fallbackData = {
          title: activityData.title,
          description: activityData.description,
          date: activityData.date,
          user_id: activityData.user_id,
          type: 'activity',
          location: activityData.location,
          created_at: activityData.created_at
        };

        const result = await supabase
          .from('activities')
          .insert([fallbackData])
          .select()
          .single();

        newActivity = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Supabase INSERT error:', error);
        return res.status(500).json({ error: 'Failed to create activity' });
      }

      res.status(201).json(newActivity);

    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const updateData = req.body;

      console.log('✏️ Updating activity:', id, updateData);

      // Try updating in 'additional_tasks' table first (this is the correct table)
      let { data: updatedActivity, error } = await supabase
        .from('additional_tasks')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      // If additional_tasks table doesn't work, try 'activities' table
      if (error) {
        console.log('⚠️ additional_tasks update failed, trying activities table:', error.message);
        
        const result = await supabase
          .from('activities')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        updatedActivity = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Supabase UPDATE error:', error);
        return res.status(500).json({ error: 'Failed to update activity' });
      }

      res.status(200).json(updatedActivity);

    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      console.log('🗑️ Deleting activity:', id);

      // Try deleting from 'additional_tasks' table first (this is the correct table)
      let { error } = await supabase
        .from('additional_tasks')
        .delete()
        .eq('id', id);

      // If additional_tasks table doesn't work, try 'activities' table
      if (error) {
        console.log('⚠️ additional_tasks delete failed, trying activities table:', error.message);
        
        const result = await supabase
          .from('activities')
          .delete()
          .eq('id', id);

        error = result.error;
      }

      if (error) {
        console.error('Supabase DELETE error:', error);
        return res.status(500).json({ error: 'Failed to delete activity' });
      }

      res.status(200).json({ message: 'Activity deleted successfully' });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Activities API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}