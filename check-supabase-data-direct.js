// Direct Supabase query to check data for Wawan user
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function checkSupabaseData() {
  console.log('🔍 Checking Supabase data directly for user:', WAWAN_USER_ID);
  console.log('=======================================================');
  
  try {
    // Check tasks table
    console.log('\n📋 Checking tasks table...');
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', WAWAN_USER_ID)
      .order('created_at', { ascending: false });
    
    if (tasksError) {
      console.log('❌ Tasks error:', tasksError);
    } else {
      console.log(`✅ Found ${tasks.length} tasks`);
      tasks.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} (${task.date}) - User: ${task.user_id}`);
      });
    }
    
    // Check supervisions table
    console.log('\n🔍 Checking supervisions table...');
    const { data: supervisions, error: supervisionsError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', WAWAN_USER_ID)
      .order('created_at', { ascending: false });
    
    if (supervisionsError) {
      console.log('❌ Supervisions error:', supervisionsError);
    } else {
      console.log(`✅ Found ${supervisions.length} supervisions`);
      supervisions.forEach((supervision, index) => {
        console.log(`   ${index + 1}. ${supervision.school_name || 'Unknown'} (${supervision.date}) - User: ${supervision.user_id}`);
      });
    }
    
    // Check activities table
    console.log('\n➕ Checking activities table...');
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', WAWAN_USER_ID)
      .order('created_at', { ascending: false });
    
    if (activitiesError) {
      console.log('❌ Activities error:', activitiesError);
      
      // Try events table as fallback
      console.log('🔄 Trying events table...');
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', WAWAN_USER_ID)
        .order('created_at', { ascending: false });
      
      if (eventsError) {
        console.log('❌ Events error:', eventsError);
      } else {
        console.log(`✅ Found ${events.length} events`);
        events.forEach((event, index) => {
          console.log(`   ${index + 1}. ${event.name || event.title} (${event.date}) - User: ${event.user_id}`);
        });
      }
    } else {
      console.log(`✅ Found ${activities.length} activities`);
      activities.forEach((activity, index) => {
        console.log(`   ${index + 1}. ${activity.title || activity.name} (${activity.date}) - User: ${activity.user_id}`);
      });
    }
    
    // Check all data without user filter to see what's in the database
    console.log('\n🔍 Checking all data (without user filter)...');
    
    const { data: allTasks } = await supabase.from('tasks').select('user_id, title').limit(5);
    console.log('Sample tasks user_ids:', allTasks?.map(t => ({ user_id: t.user_id, title: t.title })));
    
    const { data: allSupervisions } = await supabase.from('supervisions').select('user_id, school_name').limit(5);
    console.log('Sample supervisions user_ids:', allSupervisions?.map(s => ({ user_id: s.user_id, school: s.school_name })));
    
    const { data: allActivities } = await supabase.from('activities').select('user_id, title, name').limit(5);
    if (allActivities) {
      console.log('Sample activities user_ids:', allActivities.map(a => ({ user_id: a.user_id, title: a.title || a.name })));
    } else {
      const { data: allEvents } = await supabase.from('events').select('user_id, name').limit(5);
      console.log('Sample events user_ids:', allEvents?.map(e => ({ user_id: e.user_id, name: e.name })));
    }
    
  } catch (error) {
    console.error('❌ Error checking Supabase data:', error);
  }
}

checkSupabaseData();