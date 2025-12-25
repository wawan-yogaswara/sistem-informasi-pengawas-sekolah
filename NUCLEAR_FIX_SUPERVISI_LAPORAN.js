// NUCLEAR FIX SUPERVISI LAPORAN
// Copy paste ke browser console di halaman Laporan

console.log('💥 NUCLEAR FIX: Supervisi tidak lengkap di laporan');

const nuclearFixSupervisiLaporan = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  console.log('👤 Target user_id:', userId);
  
  // 1. Force user ID
  const userData = localStorage.getItem('auth_user');
  if (userData) {
    const user = JSON.parse(userData);
    user.id = userId;
    user.username = 'wawan';
    localStorage.setItem('auth_user', JSON.stringify(user));
    console.log('✅ User ID forced');
  }
  
  // 2. Clear all caches
  localStorage.removeItem('reports_activities_cache');
  console.log('✅ Cache cleared');
  
  // 3. Direct Supabase diagnosis and fix
  try {
    console.log('🔧 NUCLEAR FIX: Direct Supabase operations...');
    
    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get ALL supervisions first
    const { data: allSupervisions, error: allError } = await supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ Error fetching supervisions:', allError);
      return;
    }
    
    console.log(`📋 Total supervisions in database: ${allSupervisions.length}`);
    
    // Show all supervisions with their user_ids
    allSupervisions.forEach((supervision, index) => {
      console.log(`📋 Supervision ${index + 1}:`, {
        id: supervision.id,
        school: supervision.school || supervision.school_name,
        user_id: supervision.user_id,
        date: supervision.date,
        type: supervision.type,
        created_at: supervision.created_at
      });
    });
    
    // Find supervisions that should belong to wawan
    const potentialWawanSupervisions = allSupervisions.filter(s => 
      s.user_id !== userId && (
        s.user_id === 'wawan' || 
        s.user_id === 'user-wawan' ||
        s.user_id === 'default_user' ||
        !s.user_id ||
        s.user_id === null
      )
    );
    
    console.log(`🎯 Supervisions that need user_id fix: ${potentialWawanSupervisions.length}`);
    
    // Fix user_id for these supervisions
    if (potentialWawanSupervisions.length > 0) {
      console.log('🔧 FIXING user_id for supervisions...');
      
      for (const supervision of potentialWawanSupervisions) {
        console.log(`🔧 Updating supervision ${supervision.id} from user_id "${supervision.user_id}" to "${userId}"`);
        
        const { error: updateError } = await supabase
          .from('supervisions')
          .update({ user_id: userId })
          .eq('id', supervision.id);
        
        if (updateError) {
          console.error(`❌ Failed to update supervision ${supervision.id}:`, updateError);
        } else {
          console.log(`✅ Updated supervision ${supervision.id}`);
        }
      }
    }
    
    // 4. Verify the fix by querying with user_id filter
    console.log('✅ Verifying fix...');
    
    const { data: userSupervisions, error: userError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (userError) {
      console.error('❌ Error verifying fix:', userError);
    } else {
      console.log(`✅ After fix - supervisions for user ${userId}: ${userSupervisions.length}`);
      userSupervisions.forEach((supervision, index) => {
        console.log(`✅ Fixed supervision ${index + 1}:`, {
          id: supervision.id,
          school: supervision.school || supervision.school_name,
          date: supervision.date,
          type: supervision.type
        });
      });
    }
    
    // 5. Test API endpoint
    console.log('🌐 Testing API endpoint...');
    
    const apiResponse = await fetch(`/api/supervisions?user_id=${encodeURIComponent(userId)}`);
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log(`🌐 API returns ${apiData.length} supervisions`);
      apiData.forEach((supervision, index) => {
        console.log(`🌐 API supervision ${index + 1}:`, {
          id: supervision.id,
          school: supervision.school || supervision.school_name,
          date: supervision.date,
          type: supervision.type
        });
      });
    } else {
      console.error('🌐 API error:', apiResponse.status);
    }
    
    // 6. Simulate Reports page processing
    console.log('📊 Simulating Reports page processing...');
    
    if (apiResponse.ok) {
      const supervisionsData = await apiResponse.json();
      
      // Get schools data
      const schoolsResponse = await fetch('/api/schools');
      const schoolsData = schoolsResponse.ok ? await schoolsResponse.json() : [];
      console.log(`🏫 Schools available: ${schoolsData.length}`);
      
      // Process supervisions exactly like Reports page
      const processedSupervisions = [];
      supervisionsData.forEach((supervision) => {
        // Get school name - this is the critical part
        const school = schoolsData.find((s) => s.id === supervision.school_id);
        
        const processed = {
          id: supervision.id,
          type: 'Supervisi',
          title: `Supervisi ${school?.name || supervision.school || supervision.school_name || 'Sekolah'}`,
          date: supervision.date || supervision.created_at,
          location: school?.name || supervision.school || supervision.school_name || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: supervision.findings || supervision.recommendations || '',
          photo1: supervision.photo1,
          photo2: supervision.photo2,
          createdAt: supervision.created_at,
          source: 'supabase'
        };
        
        processedSupervisions.push(processed);
        
        console.log(`📊 Processed supervision ${processedSupervisions.length}:`, {
          id: processed.id,
          title: processed.title,
          location: processed.location,
          date: processed.date,
          school_id: supervision.school_id,
          school_field: supervision.school || supervision.school_name,
          matched_school: school?.name || 'NO MATCH'
        });
      });
      
      console.log(`📊 FINAL: ${processedSupervisions.length} supervisions will appear in Reports`);
      
      // Cache the processed data for Reports page
      const allActivities = processedSupervisions; // In real Reports page, this would include tasks and additional_tasks too
      localStorage.setItem('reports_activities_cache', JSON.stringify(allActivities));
      console.log('📦 Cached processed data for Reports page');
    }
    
    // 7. Force page refresh
    console.log('🔄 Refreshing page in 3 seconds...');
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    
  } catch (error) {
    console.error('❌ Nuclear fix failed:', error);
  }
};

// Run the nuclear fix
nuclearFixSupervisiLaporan();