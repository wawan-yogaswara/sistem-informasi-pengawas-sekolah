// DEBUG API ADDITIONAL TASKS
// Script untuk debug API additionalTasksApi.create

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Simulate authApi.getCurrentUser
const authApi = {
  getCurrentUser: async () => {
    // Get user from localStorage simulation
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .limit(1)
      .single();
    
    return {
      id: users.id,
      username: users.username,
      full_name: users.name || users.username,
      role: users.role || 'user'
    };
  }
};

// Copy of the API function for debugging
const debugAdditionalTasksApi = {
  create: async (taskData) => {
    try {
      console.log('🔍 DEBUG: Starting create function...');
      console.log('Input taskData:', JSON.stringify(taskData, null, 2));
      
      // Get current user to determine school_id
      const currentUser = await authApi.getCurrentUser();
      console.log('Current user:', JSON.stringify(currentUser, null, 2));
      
      // Get user's school_id from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('school_id')
        .eq('id', currentUser.id)
        .single();
      
      console.log('User data query result:', { userData, userError });
      
      let schoolId;
      
      if (userError || !userData?.school_id) {
        console.log('⚠️ No school_id found, using fallback...');
        
        // Fallback: use first available school
        const { data: schools, error: schoolError } = await supabase
          .from('schools')
          .select('id')
          .limit(1)
          .single();
        
        console.log('Fallback school query:', { schools, schoolError });
        
        if (schoolError || !schools) {
          throw new Error('Tidak ada data sekolah tersedia');
        }
        
        schoolId = schools.id;
        console.log('Using fallback school_id:', schoolId);
      } else {
        schoolId = userData.school_id;
        console.log('Using user school_id:', schoolId);
      }
      
      // Map to correct Supabase schema (based on actual table structure)
      const supabaseTask = {
        user_id: currentUser.id,
        school_id: schoolId,
        title: taskData.name,  // name -> title
        description: taskData.description || '',
        date: new Date().toISOString().split('T')[0], // Required: current date in YYYY-MM-DD format
        status: 'completed' // Set as completed since it's already done
      };
      
      console.log('Final supabaseTask:', JSON.stringify(supabaseTask, null, 2));
      
      // Save to Supabase with error handling
      const { data, error } = await supabase
        .from('additional_tasks')
        .insert([supabaseTask])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Supabase insert error:', error);
        throw new Error(`Gagal menyimpan ke database: ${error.message}`);
      }
      
      console.log('✅ Insert successful:', JSON.stringify(data, null, 2));
      return data;
      
    } catch (error) {
      console.error('❌ Error in create function:', error);
      throw error;
    }
  }
};

async function debugAPI() {
  console.log('🔧 DEBUG API ADDITIONAL TASKS...\n');
  
  try {
    // Test the API function
    const testData = {
      name: 'Debug Test Task',
      description: 'This is a debug test task to check API functionality'
    };
    
    console.log('Testing API with data:', JSON.stringify(testData, null, 2));
    
    const result = await debugAdditionalTasksApi.create(testData);
    
    console.log('\n✅ API test successful!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    // Clean up - delete the test data
    await supabase
      .from('additional_tasks')
      .delete()
      .eq('id', result.id);
    
    console.log('\n🗑️ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Run debug
debugAPI();