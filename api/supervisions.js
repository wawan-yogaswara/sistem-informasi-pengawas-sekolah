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
      // Get real data from Supabase
      const { data: supervisions, error } = await supabase
        .from('supervisions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase GET error:', error);
        return res.status(500).json({ error: 'Failed to fetch supervisions' });
      }

      res.json(supervisions || []);

    } else if (req.method === 'POST') {
      const { school_id, school_name, school, type, date, teacher_name, teacher_nip, findings, recommendations, user_id, notes, result } = req.body;

      if (!school_id && !school_name && !school) {
        return res.status(400).json({ error: 'School information is required' });
      }

      // Insert into Supabase
      const supervisionData = {
        school_id: school_id || null,
        school_name: school_name || school || 'Unknown School',
        type: type || 'Akademik',
        date: date || new Date().toISOString().split('T')[0],
        teacher_name: teacher_name || '',
        teacher_nip: teacher_nip || '',
        findings: findings || notes || '',
        recommendations: recommendations || result || '',
        user_id: user_id || 'default_user',
        created_at: new Date().toISOString()
      };

      const { data: newSupervision, error } = await supabase
        .from('supervisions')
        .insert([supervisionData])
        .select()
        .single();

      if (error) {
        console.error('Supabase INSERT error:', error);
        return res.status(500).json({ error: 'Failed to create supervision' });
      }

      res.status(201).json(newSupervision);

    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const updateData = req.body;

      // Update in Supabase
      const { data: updatedSupervision, error } = await supabase
        .from('supervisions')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase UPDATE error:', error);
        return res.status(500).json({ error: 'Failed to update supervision' });
      }

      res.status(200).json(updatedSupervision);

    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      // Delete from Supabase
      const { error } = await supabase
        .from('supervisions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase DELETE error:', error);
        return res.status(500).json({ error: 'Failed to delete supervision' });
      }

      res.status(200).json({ message: 'Supervision deleted successfully' });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Supervisions API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}