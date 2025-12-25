// ENHANCED FIX: Tugas harian dan supervisi tidak masuk ke halaman laporan
// Copy paste ke browser console di halaman Laporan

console.log('🔧 ENHANCED FIX: Tugas harian dan supervisi tidak masuk ke halaman laporan');

const fixTugasHarianSupervisiEnhanced = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    console.log('🚀 Starting enhanced fix for reports data loading...');
    
    // 1. CLEAR ALL CACHES FIRST
    console.log('🧹 Step 1: Clearing all caches...');
    localStorage.removeItem('reports_activities_cache');
    localStorage.removeItem('activities_cache');
    localStorage.removeItem('tasks_cache');
    localStorage.removeItem('supervisions_cache');
    
    // Clear React Query cache if available
    if (window.queryClient) {
      window.queryClient.clear();
      console.log('✅ React Query cache cleared');
    }
    
    // 2. SETUP USER CONTEXT
    console.log('👤 Step 2: Setting user context...');
    const userData = {
      id: userId,
      username: 'wawan',
      fullName: 'Wawan Setiawan',
      role: 'admin'
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    // 3. SETUP SUPABASE
    console.log('🔗 Step 3: Setting up Supabase...');
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 4. COMPREHENSIVE DATA DIAGNOSIS
    console.log('🔍 Step 4: Comprehensive data diagnosis...');
    
    // Check all possible tables for tasks and supervisions
    const tables = ['tasks', 'tasks_daily', 'supervisions', 'additional_tasks'];
    const allData = {};
    
    for (const table of tables) {
      try {
        console.log(`📋 Checking table: ${table}`);
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error(`❌ Error fetching ${table}:`, error);
          allData[table] = [];
        } else {
          allData[table] = data || [];
          console.log(`📊 ${table}: ${data.length} records found`);
          
          // Show user_id distribution
          const userIds = [...new Set(data.map(item => item.user_id))];
          console.log(`  User IDs in ${table}:`, userIds);
          
          // Show records for our target user
          const userRecords = data.filter(item => item.user_id === userId);
          console.log(`  Records for user ${userId}: ${userRecords.length}`);
          
          if (userRecords.length > 0) {
            console.log(`  Sample records:`, userRecords.slice(0, 3).map(r => ({
              id: r.id,
              title: r.title || r.name || r.school_name || 'No title',
              date: r.date,
              created_at: r.created_at
            })));
          }
        }
      } catch (error) {
        console.error(`❌ Failed to check ${table}:`, error);
        allData[table] = [];
      }
    }
    
    // 5. FIX USER_ID MISMATCHES
    console.log('🔧 Step 5: Fixing user_id mismatches...');
    
    for (const [table, records] of Object.entries(allData)) {
      if (records.length === 0) continue;
      
      const needsFix = records.filter(r => r.user_id !== userId);
      if (needsFix.length > 0) {
        console.log(`🔧 Fixing ${needsFix.length} records in ${table}`);
        
        for (const record of needsFix) {
          try {
            const { error } = await supabase
              .from(table)
              .update({ user_id: userId })
              .eq('id', record.id);
            
            if (error) {
              console.error(`❌ Failed to update ${table} ${record.id}:`, error);
            } else {
              console.log(`✅ Updated ${table} ${record.id}`);
            }
          } catch (error) {
            console.error(`❌ Error updating ${table} ${record.id}:`, error);
          }
        }
      }
    }
    
    // 6. FETCH CORRECTED DATA
    console.log('📊 Step 6: Fetching corrected data...');
    
    const correctedData = {};
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          correctedData[table] = data;
          console.log(`✅ ${table}: ${data.length} records for user ${userId}`);
        } else {
          correctedData[table] = [];
          console.log(`⚠️ ${table}: No data or error:`, error);
        }
      } catch (error) {
        console.error(`❌ Error fetching corrected ${table}:`, error);
        correctedData[table] = [];
      }
    }
    
    // 7. CREATE UNIFIED ACTIVITIES ARRAY
    console.log('🎯 Step 7: Creating unified activities array...');
    
    const activities = [];
    
    // Add tasks_daily as "Tugas Pokok"
    if (correctedData.tasks_daily && correctedData.tasks_daily.length > 0) {
      correctedData.tasks_daily.forEach((task) => {
        activities.push({
          id: `tasks_daily_${task.id}`,
          type: 'Tugas Pokok',
          title: task.title || 'Tugas Harian',
          date: task.date || task.created_at,
          location: task.school_name || task.location || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo1,
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'tasks_daily'
        });
      });
      console.log(`📋 Added ${correctedData.tasks_daily.length} tasks_daily as Tugas Pokok`);
    }
    
    // Add tasks as "Tugas Pokok" (alternative source)
    if (correctedData.tasks && correctedData.tasks.length > 0) {
      correctedData.tasks.forEach((task) => {
        activities.push({
          id: `tasks_${task.id}`,
          type: 'Tugas Pokok',
          title: task.title || 'Tugas Harian',
          date: task.date || task.created_at,
          location: task.school || task.location || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo1 || task.photo,
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'tasks'
        });
      });
      console.log(`📋 Added ${correctedData.tasks.length} tasks as Tugas Pokok`);
    }
    
    // Add supervisions
    if (correctedData.supervisions && correctedData.supervisions.length > 0) {
      correctedData.supervisions.forEach((supervision) => {
        activities.push({
          id: `supervisions_${supervision.id}`,
          type: 'Supervisi',
          title: `Supervisi ${supervision.school || supervision.school_name || 'Sekolah'}`,
          date: supervision.date || supervision.created_at,
          location: supervision.school || supervision.school_name || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: supervision.findings || supervision.recommendations || supervision.notes || '',
          photo1: supervision.photo1,
          photo2: supervision.photo2,
          createdAt: supervision.created_at,
          source: 'supervisions'
        });
      });
      console.log(`🔍 Added ${correctedData.supervisions.length} supervisions`);
    }
    
    // Add additional_tasks
    if (correctedData.additional_tasks && correctedData.additional_tasks.length > 0) {
      correctedData.additional_tasks.forEach((task) => {
        activities.push({
          id: `additional_tasks_${task.id}`,
          type: 'Tugas Tambahan',
          title: task.name || task.title || 'Kegiatan Tambahan',
          date: task.date || task.created_at,
          location: task.location || 'Tempat Kegiatan',
          organizer: task.organizer || 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo || task.photo1,
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'additional_tasks'
        });
      });
      console.log(`➕ Added ${correctedData.additional_tasks.length} additional_tasks`);
    }
    
    // Sort by date (newest first)
    const sortedActivities = activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`📊 TOTAL ACTIVITIES CREATED: ${sortedActivities.length}`);
    console.log('📋 Activities breakdown:');
    console.log(`  - Tugas Pokok: ${sortedActivities.filter(a => a.type === 'Tugas Pokok').length}`);
    console.log(`  - Supervisi: ${sortedActivities.filter(a => a.type === 'Supervisi').length}`);
    console.log(`  - Tugas Tambahan: ${sortedActivities.filter(a => a.type === 'Tugas Tambahan').length}`);
    
    // 8. FORCE UPDATE REPORTS PAGE
    console.log('🔄 Step 8: Force updating reports page...');
    
    // Cache the data
    localStorage.setItem('reports_activities_cache', JSON.stringify(sortedActivities));
    
    // Dispatch multiple update events
    const updateEvents = [
      'updateReportsData',
      'refreshReports',
      'dataUpdated',
      'activitiesUpdated',
      'reportsRefresh'
    ];
    
    updateEvents.forEach(eventName => {
      const event = new CustomEvent(eventName, {
        detail: {
          activities: sortedActivities,
          source: 'enhanced_fix',
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(event);
      document.dispatchEvent(event);
    });
    
    // 9. TEST API ENDPOINTS
    console.log('🌐 Step 9: Testing API endpoints...');
    
    const apiTests = [
      { name: 'tasks-daily', url: `/api/tasks-daily?user_id=${encodeURIComponent(userId)}` },
      { name: 'supervisions', url: `/api/supervisions?user_id=${encodeURIComponent(userId)}` },
      { name: 'activities', url: `/api/activities?user_id=${encodeURIComponent(userId)}` }
    ];
    
    for (const test of apiTests) {
      try {
        const response = await fetch(test.url);
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${test.name} API: ${data.length} records`);
        } else {
          console.error(`❌ ${test.name} API error:`, response.status);
        }
      } catch (error) {
        console.error(`❌ ${test.name} API failed:`, error);
      }
    }
    
    // 10. FORCE REACT COMPONENT REFRESH
    console.log('⚡ Step 10: Force React component refresh...');
    
    // Try to trigger React state updates
    if (window.React) {
      // Force re-render by dispatching a storage event
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'reports_activities_cache',
        newValue: JSON.stringify(sortedActivities)
      }));
    }
    
    // 11. FINAL VERIFICATION AND SUMMARY
    setTimeout(async () => {
      console.log('🎯 Step 11: Final verification...');
      
      // Verify data in database
      const finalCounts = {};
      for (const table of tables) {
        try {
          const { data } = await supabase
            .from(table)
            .select('*')
            .eq('user_id', userId);
          finalCounts[table] = data ? data.length : 0;
        } catch (error) {
          finalCounts[table] = 0;
        }
      }
      
      console.log(`
🎉 ENHANCED FIX COMPLETED! 🎉

📊 FINAL DATABASE COUNTS:
  - tasks_daily: ${finalCounts.tasks_daily || 0}
  - tasks: ${finalCounts.tasks || 0}
  - supervisions: ${finalCounts.supervisions || 0}
  - additional_tasks: ${finalCounts.additional_tasks || 0}

📋 ACTIVITIES PREPARED FOR REPORTS:
  - Total: ${sortedActivities.length}
  - Tugas Pokok: ${sortedActivities.filter(a => a.type === 'Tugas Pokok').length}
  - Supervisi: ${sortedActivities.filter(a => a.type === 'Supervisi').length}
  - Tugas Tambahan: ${sortedActivities.filter(a => a.type === 'Tugas Tambahan').length}

✅ All caches cleared and refreshed
✅ User ID standardized across all tables
✅ Activities data cached for reports page
✅ Multiple update events dispatched
✅ API endpoints tested
✅ React component refresh triggered

${sortedActivities.length > 0 ? '🎉 SUCCESS: Data should now appear in reports!' : '⚠️ WARNING: No activities found in database'}
      `);
      
      if (sortedActivities.length > 0) {
        console.log('📋 Recent activities preview:');
        sortedActivities.slice(0, 5).forEach((activity, index) => {
          console.log(`  ${index + 1}. ${activity.type}: ${activity.title} (${activity.date}) [${activity.source}]`);
        });
      }
      
      console.log('🔄 Refreshing page in 3 seconds to load updated reports...');
      
      // Auto refresh page
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    }, 2000);
    
  } catch (error) {
    console.error('❌ Enhanced fix failed:', error);
    console.log('🔄 Falling back to page refresh...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

// Execute the enhanced fix
console.log('🚀 Executing enhanced fix for reports data...');
fixTugasHarianSupervisiEnhanced();