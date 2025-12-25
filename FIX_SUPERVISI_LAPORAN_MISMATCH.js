// FIX SUPERVISI LAPORAN MISMATCH
// Copy paste ke browser console di halaman Laporan

console.log('🔧 FIX: Supervisi tidak muncul lengkap di laporan');

const fixSupervisiLaporanMismatch = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  console.log('👤 Using user_id:', userId);
  
  // 1. Force correct user ID in localStorage
  const userData = localStorage.getItem('auth_user');
  if (userData) {
    const user = JSON.parse(userData);
    user.id = userId;
    user.username = 'wawan';
    localStorage.setItem('auth_user', JSON.stringify(user));
    console.log('✅ User ID forced for supervisions');
  }
  
  // 2. Clear any cached data
  localStorage.removeItem('reports_activities_cache');
  console.log('✅ Reports cache cleared');
  
  // 3. Test and fix supervisions data loading
  try {
    console.log('🔧 Testing supervisions data loading...');
    
    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get all supervisions (not filtered by user_id first)
    const { data: allSupervisions, error: allError } = await supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ Error fetching all supervisions:', allError);
      return;
    }
    
    console.log(`📋 Total supervisions in database: ${allSupervisions.length}`);
    
    // Check user_id values
    const userIds = [...new Set(allSupervisions.map(s => s.user_id))];
    console.log('👥 Unique user_ids in supervisions:', userIds);
    
    // Find supervisions that might belong to wawan user
    const wawaSupervisions = allSupervisions.filter(s => 
      s.user_id === userId || 
      s.user_id === 'wawan' || 
      s.user_id === 'user-wawan' ||
      !s.user_id ||
      s.user_id === 'default_user'
    );
    
    console.log(`👤 Supervisions that might belong to wawan: ${wawaSupervisions.length}`);
    wawaSupervisions.forEach((supervision, index) => {
      console.log(`👤 Wawan supervision ${index + 1}:`, {
        id: supervision.id,
        school: supervision.school || supervision.school_name,
        user_id: supervision.user_id,
        date: supervision.date,
        type: supervision.type
      });
    });
    
    // 4. Fix user_id for supervisions that should belong to wawan
    if (wawaSupervisions.length > 0) {
      console.log('🔧 Fixing user_id for wawan supervisions...');
      
      for (const supervision of wawaSupervisions) {
        if (supervision.user_id !== userId) {
          console.log(`🔧 Updating supervision ${supervision.id} user_id from "${supervision.user_id}" to "${userId}"`);
          
          const { error: updateError } = await supabase
            .from('supervisions')
            .update({ user_id: userId })
            .eq('id', supervision.id);
          
          if (updateError) {
            console.error(`❌ Error updating supervision ${supervision.id}:`, updateError);
          } else {
            console.log(`✅ Updated supervision ${supervision.id}`);
          }
        }
      }
    }
    
    // 5. Test API endpoint after fix
    console.log('🌐 Testing API endpoint after fix...');
    
    const response = await fetch(`/api/supervisions?user_id=${encodeURIComponent(userId)}`);
    if (response.ok) {
      const apiData = await response.json();
      console.log(`🌐 API now returns ${apiData.length} supervisions for user ${userId}`);
      apiData.forEach((supervision, index) => {
        console.log(`🌐 API supervision ${index + 1}:`, {
          id: supervision.id,
          school: supervision.school || supervision.school_name,
          date: supervision.date,
          type: supervision.type
        });
      });
    } else {
      console.error('🌐 API still failing:', response.status);
    }
    
    // 6. Force refresh the Reports page data
    console.log('🔄 Force refreshing Reports page...');
    
    // Dispatch custom event to trigger Reports page refresh
    const updateEvent = new CustomEvent('updateReportsData', {
      detail: { 
        forceRefresh: true,
        source: 'supervisions_fix'
      }
    });
    window.dispatchEvent(updateEvent);
    
    // Also try to refresh the page after a delay
    setTimeout(() => {
      console.log('🔄 Refreshing page in 2 seconds...');
      window.location.reload();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
};

// Run the fix
fixSupervisiLaporanMismatch();