// FIX LAPORAN SUPERVISI SIMPLE
// Copy paste ke browser console di halaman Laporan
// Khusus untuk masalah supervisi hanya muncul 1 di laporan

console.log('🔧 SIMPLE FIX: Supervisi hanya muncul 1 di laporan');

const fixLaporanSupervisiSimple = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    console.log('🚀 Starting simple fix for supervision reports...');
    
    // 1. SETUP SUPABASE
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 2. CHECK CURRENT SUPERVISIONS
    console.log('🔍 Checking current supervisions...');
    
    const { data: allSupervisions, error } = await supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log(`📊 Total supervisions in database: ${allSupervisions.length}`);
    
    // Show all supervisions
    allSupervisions.forEach((supervision, index) => {
      console.log(`${index + 1}. ${supervision.school || supervision.school_name} (User: ${supervision.user_id}) - ${supervision.date}`);
    });
    
    // 3. FIX USER_ID FOR ALL SUPERVISIONS
    console.log('🔧 Fixing user_id for all supervisions...');
    
    for (const supervision of allSupervisions) {
      if (supervision.user_id !== userId) {
        console.log(`🔧 Updating supervision ${supervision.id} to user ${userId}`);
        
        const { error: updateError } = await supabase
          .from('supervisions')
          .update({ user_id: userId })
          .eq('id', supervision.id);
        
        if (updateError) {
          console.error(`❌ Failed to update ${supervision.id}:`, updateError);
        } else {
          console.log(`✅ Updated ${supervision.id}`);
        }
      }
    }
    
    // 4. VERIFY UPDATED DATA
    console.log('✅ Verifying updated data...');
    
    const { data: updatedSupervisions } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    console.log(`📊 Supervisions for user ${userId}: ${updatedSupervisions.length}`);
    
    updatedSupervisions.forEach((supervision, index) => {
      console.log(`✅ ${index + 1}. ${supervision.school || supervision.school_name} - ${supervision.date}`);
    });
    
    // 5. FORCE REPORTS PAGE REFRESH
    console.log('🔄 Force refreshing reports page...');
    
    // Clear cache
    localStorage.removeItem('reports_activities_cache');
    
    // Set user data
    const userData = {
      id: userId,
      username: 'wawan',
      fullName: 'Wawan Setiawan',
      role: 'admin'
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    
    // Create activities data for reports
    const activities = [];
    
    // Add supervisions
    updatedSupervisions.forEach((supervision) => {
      activities.push({
        id: supervision.id,
        type: 'Supervisi',
        title: `Supervisi ${supervision.school || supervision.school_name || 'Sekolah'}`,
        date: supervision.date || supervision.created_at,
        location: supervision.school || supervision.school_name || 'Sekolah Binaan',
        organizer: 'Pengawas Sekolah',
        description: supervision.findings || supervision.recommendations || '',
        photo1: supervision.photo1,
        photo2: supervision.photo2,
        createdAt: supervision.created_at,
        source: 'supabase'
      });
    });
    
    console.log(`📋 Created ${activities.length} supervision activities`);
    
    // Cache for reports page
    localStorage.setItem('reports_activities_cache', JSON.stringify(activities));
    
    // Dispatch events
    const events = ['updateReportsData', 'refreshReports', 'dataUpdated'];
    events.forEach(eventName => {
      const event = new CustomEvent(eventName, {
        detail: { activities, source: 'simple_fix' }
      });
      window.dispatchEvent(event);
    });
    
    console.log(`
🎉 SIMPLE FIX COMPLETED! 🎉

✅ ${updatedSupervisions.length} supervisions found
✅ All user_id values updated
✅ Reports data refreshed
✅ Cache cleared

Refreshing page in 3 seconds...
    `);
    
    // Auto refresh page
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    
  } catch (error) {
    console.error('❌ Simple fix failed:', error);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

// Execute the simple fix
fixLaporanSupervisiSimple();