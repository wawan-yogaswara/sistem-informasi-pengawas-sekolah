// DEBUG SUPERVISI LAPORAN MISMATCH
// Copy paste ke browser console di halaman Laporan

console.log('🔍 DEBUG: Supervisi di halaman vs laporan');

const debugSupervisiMismatch = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  console.log('👤 Using user_id:', userId);
  
  // 1. Test direct Supabase query
  try {
    console.log('📊 Testing direct Supabase query...');
    
    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Query all supervisions
    const { data: allSupervisions, error: allError } = await supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ All supervisions error:', allError);
    } else {
      console.log(`📋 Total supervisions in Supabase: ${allSupervisions.length}`);
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
    }
    
    // Query supervisions for specific user
    const { data: userSupervisions, error: userError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (userError) {
      console.error('❌ User supervisions error:', userError);
    } else {
      console.log(`👤 Supervisions for user ${userId}: ${userSupervisions.length}`);
      userSupervisions.forEach((supervision, index) => {
        console.log(`👤 User supervision ${index + 1}:`, {
          id: supervision.id,
          school: supervision.school || supervision.school_name,
          user_id: supervision.user_id,
          date: supervision.date,
          type: supervision.type,
          created_at: supervision.created_at
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Direct Supabase query failed:', error);
  }
  
  // 2. Test API endpoint
  try {
    console.log('🌐 Testing API endpoint...');
    
    const response = await fetch(`/api/supervisions?user_id=${encodeURIComponent(userId)}`);
    console.log('🌐 API response status:', response.status);
    
    if (response.ok) {
      const apiData = await response.json();
      console.log(`🌐 API returned ${apiData.length} supervisions`);
      apiData.forEach((supervision, index) => {
        console.log(`🌐 API supervision ${index + 1}:`, {
          id: supervision.id,
          school: supervision.school || supervision.school_name,
          user_id: supervision.user_id,
          date: supervision.date,
          type: supervision.type,
          created_at: supervision.created_at
        });
      });
    } else {
      const errorText = await response.text();
      console.error('🌐 API error:', response.status, errorText);
    }
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
  
  // 3. Check what Reports page is loading
  console.log('📊 Checking Reports page data loading...');
  
  // Check if there's cached data
  const cachedData = localStorage.getItem('reports_activities_cache');
  if (cachedData) {
    try {
      const parsedData = JSON.parse(cachedData);
      const supervisions = parsedData.filter(item => item.type === 'Supervisi');
      console.log(`📦 Cached supervisions: ${supervisions.length}`);
      supervisions.forEach((supervision, index) => {
        console.log(`📦 Cached supervision ${index + 1}:`, {
          id: supervision.id,
          title: supervision.title,
          location: supervision.location,
          date: supervision.date,
          source: supervision.source
        });
      });
    } catch (error) {
      console.error('❌ Error parsing cached data:', error);
    }
  } else {
    console.log('📦 No cached data found');
  }
  
  // 4. Simulate Reports page data loading
  console.log('🔄 Simulating Reports page data loading...');
  
  try {
    // Test the same logic as Reports page
    const supervisionsResponse = await fetch(`/api/supervisions?user_id=${encodeURIComponent(userId)}`);
    console.log('📊 Reports simulation - supervisions response status:', supervisionsResponse.status);
    
    if (supervisionsResponse.ok) {
      const supervisionsData = await supervisionsResponse.json();
      console.log(`📊 Reports simulation - found ${supervisionsData.length} supervisions`);
      
      // Fetch schools for location names (same as Reports page)
      const schoolsResponse = await fetch('/api/schools');
      const schoolsData = schoolsResponse.ok ? await schoolsResponse.json() : [];
      console.log(`🏫 Schools data: ${schoolsData.length} schools`);
      
      // Process supervisions (same as Reports page)
      const processedSupervisions = [];
      supervisionsData.forEach((supervision) => {
        // Get school name
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
          school_name: supervision.school || supervision.school_name,
          matched_school: school?.name || 'NO MATCH'
        });
      });
      
      console.log(`✅ Total processed supervisions for Reports: ${processedSupervisions.length}`);
      
    } else {
      const errorText = await supervisionsResponse.text();
      console.error('📊 Reports simulation - supervisions API error:', supervisionsResponse.status, errorText);
    }
    
  } catch (error) {
    console.error('❌ Reports simulation failed:', error);
  }
  
  console.log('🎯 DEBUG COMPLETE - Check the logs above to identify the mismatch');
};

// Run the debug
debugSupervisiMismatch();