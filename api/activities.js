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
      // Get real data from Supabase - try multiple table names
      let activities = [];
      let error = null;

      // Try 'activities' table first
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (!activitiesError && activitiesData) {
        activities = activitiesData;
      } else {
        // Try 'events' table as fallback
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (!eventsError && eventsData) {
          activities = eventsData;
        } else {
          error = activitiesError || eventsError;
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

      // Prepare data for insertion
      const activityData = {
        title: title || name,
        description: description || '',
        date: date || new Date().toISOString().split('T')[0],
        user_id: user_id || 'default_user',
        type: type || 'activity',
        location: location || 'Unknown',
        created_at: new Date().toISOString()
      };

      // Try inserting into 'activities' table first
      let { data: newActivity, error } = await supabase
        .from('activities')
        .insert([activityData])
        .select()
        .single();

      // If activities table doesn't exist, try 'events' table
      if (error && error.code === '42P01') {
        const eventData = {
          name: activityData.title,
          description: activityData.description,
          date: activityData.date,
          user_id: activityData.user_id,
          location: activityData.location,
          created_at: activityData.created_at
        };

        const result = await supabase
          .from('events')
          .insert([eventData])
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

      // Try updating in 'activities' table first
      let { data: updatedActivity, error } = await supabase
        .from('activities')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      // If activities table doesn't exist, try 'events' table
      if (error && error.code === '42P01') {
        const result = await supabase
          .from('events')
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

      // Try deleting from 'activities' table first
      let { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      // If activities table doesn't exist, try 'events' table
      if (error && error.code === '42P01') {
        const result = await supabase
          .from('events')
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