// FIX INPUT SUPERVISI TIDAK BISA FETCH
// Copy paste ke browser console di halaman Supervisi

console.log('🔧 FIX: Input supervisi tidak bisa di-fetch');

const fixInputSupervisiTidakBisaFetch = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    // 1. Force user ID
    const userData = localStorage.getItem('auth_user');
    if (userData) {
      const user = JSON.parse(userData);
      user.id = userId;
      user.username = 'wawan';
      localStorage.setItem('auth_user', JSON.stringify(user));
      console.log('✅ User ID forced');
    }
    
    // 2. Import Supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 3. DIAGNOSA: Cek semua data supervisi di database
    console.log('🔍 DIAGNOSA: Checking all supervisions in database...');
    
    const { data: allSupervisions, error: allError } = await supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ Error fetching all supervisions:', allError);
      return;
    }
    
    console.log(`📋 Total supervisions in database: ${allSupervisions.length}`);
    
    // Show all supervisions with details
    allSupervisions.forEach((supervision, index) => {
      console.log(`📋 Supervision ${index + 1}:`, {
        id: supervision.id,
        school: supervision.school || supervision.school_name,
        user_id: supervision.user_id,
        date: supervision.date,
        type: supervision.type,
        created_at: supervision.created_at,
        findings: supervision.findings ? 'EXISTS' : 'EMPTY'
      });
    });
    
    // 4. DIAGNOSA: Cek supervisi untuk user tertentu
    console.log(`🔍 DIAGNOSA: Checking supervisions for user ${userId}...`);
    
    const { data: userSupervisions, error: userError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (userError) {
      console.error('❌ Error fetching user supervisions:', userError);
    } else {
      console.log(`👤 Supervisions for user ${userId}: ${userSupervisions.length}`);
      userSupervisions.forEach((supervision, index) => {
        console.log(`👤 User supervision ${index + 1}:`, {
          id: supervision.id,
          school: supervision.school || supervision.school_name,
          date: supervision.date,
          type: supervision.type,
          created_at: supervision.created_at
        });
      });
    }
    
    // 5. FIX: Update user_id untuk supervisi yang tidak memiliki user_id yang benar
    console.log('🔧 FIXING: Updating user_id for supervisions...');
    
    const needsFixSupervisions = allSupervisions.filter(s => 
      s.user_id !== userId && (
        s.user_id === 'wawan' || 
        s.user_id === 'default_user' ||
        s.user_id === null ||
        !s.user_id ||
        typeof s.user_id !== 'string' ||
        s.user_id.length < 10
      )
    );
    
    console.log(`🔧 Supervisions needing user_id fix: ${needsFixSupervisions.length}`);
    
    for (const supervision of needsFixSupervisions) {
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
    
    // 6. DIAGNOSA: Test API endpoint
    console.log('🌐 DIAGNOSA: Testing API endpoint...');
    
    try {
      const apiResponse = await fetch(`/api/supervisions?user_id=${encodeURIComponent(userId)}`);
      console.log('🌐 API response status:', apiResponse.status);
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        console.log(`🌐 API returned ${apiData.length} supervisions`);
        apiData.forEach((supervision, index) => {
          console.log(`🌐 API supervision ${index + 1}:`, {
            id: supervision.id,
            school: supervision.school || supervision.school_name,
            date: supervision.date,
            type: supervision.type,
            user_id: supervision.user_id
          });
        });
      } else {
        const errorText = await apiResponse.text();
        console.error('🌐 API error:', apiResponse.status, errorText);
      }
    } catch (apiError) {
      console.error('❌ API test failed:', apiError);
    }
    
    // 7. FIX: Clear React Query cache
    console.log('🔄 FIXING: Clearing React Query cache...');
    
    // Try to access React Query client
    if (window.queryClient) {
      await window.queryClient.clear();
      await window.queryClient.invalidateQueries({ queryKey: ['supervisions'] });
      await window.queryClient.refetchQueries({ queryKey: ['supervisions'] });
      console.log('✅ React Query cache cleared and refetched');
    } else {
      console.log('⚠️ React Query client not found, trying alternative methods');
    }
    
    // 8. FIX: Force page refresh untuk memuat data terbaru
    console.log('🔄 FIXING: Force refresh to load latest data...');
    
    // Dispatch custom event untuk trigger refresh
    const refreshEvent = new CustomEvent('refreshSupervisions', {
      detail: { 
        forceRefresh: true,
        source: 'input_fix'
      }
    });
    window.dispatchEvent(refreshEvent);
    
    // 9. VERIFY: Check hasil setelah fix
    setTimeout(async () => {
      console.log('✅ VERIFY: Checking results after fix...');
      
      const { data: finalSupervisions } = await supabase
        .from('supervisions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      console.log(`📊 FINAL RESULT: ${finalSupervisions.length} supervisions for user ${userId}`);
      
      if (finalSupervisions.length > 0) {
        console.log('✅ SUCCESS: Supervisions can now be fetched!');
        finalSupervisions.forEach((supervision, index) => {
          console.log(`✅ Final supervision ${index + 1}:`, {
            id: supervision.id,
            school: supervision.school || supervision.school_name,
            date: supervision.date,
            type: supervision.type
          });
        });
      } else {
        console.log('⚠️ WARNING: Still no supervisions found. Try adding a new supervision.');
      }
      
      // Force page refresh
      console.log('🔄 Refreshing page in 2 seconds...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    }, 1000);
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
};

// Run the fix
fixInputSupervisiTidakBisaFetch();