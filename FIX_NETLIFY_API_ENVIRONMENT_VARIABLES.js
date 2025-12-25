// FIX NETLIFY API ENVIRONMENT VARIABLES
// Masalah: API endpoints di Netlify tidak bisa akses environment variables dengan prefix VITE_

console.log('🔧 FIX NETLIFY API ENVIRONMENT VARIABLES');

// MASALAH YANG DITEMUKAN:
// 1. API endpoints menggunakan process.env.VITE_SUPABASE_URL
// 2. Di Netlify Functions, environment variables tidak menggunakan prefix VITE_
// 3. Halaman frontend (tasks, supervisions) berfungsi karena menggunakan client-side Supabase
// 4. Halaman reports tidak berfungsi karena menggunakan API endpoints yang gagal akses env vars

// SOLUSI 1: Update API endpoints untuk menggunakan environment variables yang benar
const correctApiCode = `
// BEFORE (SALAH):
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// AFTER (BENAR):
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
`;

console.log('📋 Kode yang perlu diperbaiki:', correctApiCode);

// SOLUSI 2: Environment Variables yang perlu ditambahkan di Netlify
const netlifyEnvVars = {
  'SUPABASE_URL': 'https://fmxeboullgcewzjpql.supabase.co',
  'SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8',
  'VITE_SUPABASE_URL': 'https://fmxeboullgcewzjpql.supabase.co',
  'VITE_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
};

console.log('🌐 Environment Variables untuk Netlify:', netlifyEnvVars);

// SOLUSI 3: Test API endpoints di production
async function testProductionAPIs() {
  console.log('🧪 Testing production API endpoints...');
  
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e'; // Wawan's user ID
  const baseUrl = window.location.origin;
  
  const endpoints = [
    { name: 'Tasks Daily', url: `${baseUrl}/api/tasks-daily?user_id=${userId}` },
    { name: 'Supervisions', url: `${baseUrl}/api/supervisions?user_id=${userId}` },
    { name: 'Activities', url: `${baseUrl}/api/activities?user_id=${userId}` }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing ${endpoint.name}:`, endpoint.url);
      const response = await fetch(endpoint.url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name} OK:`, data.length, 'records');
        
        // Log sample data untuk debugging
        if (data.length > 0) {
          console.log(`📋 Sample ${endpoint.name} data:`, data[0]);
          
          // Cek foto khusus
          if (data[0].photo || data[0].photo1 || data[0].photo2) {
            console.log(`📸 ${endpoint.name} photo fields:`, {
              photo: data[0].photo ? 'exists' : null,
              photo1: data[0].photo1 ? 'exists' : null,
              photo2: data[0].photo2 ? 'exists' : null
            });
          }
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ ${endpoint.name} FAILED:`, response.status, errorText);
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name} ERROR:`, error);
    }
  }
}

// SOLUSI 4: Emergency fix untuk force load data
async function emergencyForceLoadData() {
  console.log('🚨 Emergency force load data...');
  
  try {
    // Import Supabase client langsung
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    const activities = [];
    
    // Load tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!tasksError && tasks) {
      console.log(`📋 Direct Supabase tasks: ${tasks.length}`);
      tasks.forEach(task => {
        activities.push({
          id: task.id,
          type: 'Tugas Pokok',
          title: task.title || 'Tugas Harian',
          date: task.date || task.created_at,
          location: task.location || task.school || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo || task.photo1,
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'direct-supabase-tasks'
        });
      });
    }
    
    // Load supervisions
    const { data: supervisions, error: supervisionsError } = await supabase
      .from('supervisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!supervisionsError && supervisions) {
      console.log(`🔍 Direct Supabase supervisions: ${supervisions.length}`);
      supervisions.forEach(supervision => {
        activities.push({
          id: supervision.id,
          type: 'Supervisi',
          title: `Supervisi ${supervision.school_name || 'Sekolah'}`,
          date: supervision.date || supervision.created_at,
          location: supervision.school_name || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: supervision.findings || supervision.recommendations || '',
          photo1: supervision.photo || supervision.photo1,
          photo2: supervision.photo2,
          createdAt: supervision.created_at,
          source: 'direct-supabase-supervisions'
        });
      });
    }
    
    // Load additional tasks
    const { data: additionalTasks, error: additionalError } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!additionalError && additionalTasks) {
      console.log(`➕ Direct Supabase additional_tasks: ${additionalTasks.length}`);
      additionalTasks.forEach(task => {
        activities.push({
          id: task.id,
          type: 'Tugas Tambahan',
          title: task.title || task.name || 'Kegiatan Tambahan',
          date: task.date || task.created_at,
          location: task.location || 'Tempat Kegiatan',
          organizer: task.organizer || 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo || task.photo1,
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'direct-supabase-additional-tasks'
        });
      });
    }
    
    console.log(`📊 Total activities loaded: ${activities.length}`);
    console.log('📸 Activities with photos:', activities.filter(a => a.photo1 || a.photo2).length);
    
    // Cache data dan trigger update
    localStorage.setItem('reports_activities_cache', JSON.stringify(activities));
    
    // Trigger custom event untuk update UI
    window.dispatchEvent(new CustomEvent('updateReportsData', {
      detail: { activities }
    }));
    
    console.log('✅ Emergency force load berhasil!');
    console.log('🔄 Refresh halaman untuk melihat data');
    
    return activities;
    
  } catch (error) {
    console.error('❌ Emergency force load error:', error);
    return [];
  }
}

// INSTRUKSI PENGGUNAAN
console.log(`
🔧 CARA MENGATASI MASALAH INI:

OPSI 1 - QUICK FIX (Untuk User):
1. Jalankan: emergencyForceLoadData()
2. Refresh halaman reports
3. Data akan muncul sementara

OPSI 2 - PERMANENT FIX (Untuk Developer):
1. Update API files untuk menggunakan environment variables yang benar
2. Tambahkan environment variables di Netlify dashboard:
   - SUPABASE_URL: https://fmxeboullgcewzjpql.supabase.co
   - SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
3. Redeploy aplikasi

OPSI 3 - TEST API (Untuk Debugging):
1. Jalankan: testProductionAPIs()
2. Lihat hasil di console
3. Identifikasi API mana yang gagal

DIAGNOSIS:
- Halaman Tasks & Supervisions berfungsi karena menggunakan client-side Supabase
- Halaman Reports tidak berfungsi karena menggunakan API endpoints
- API endpoints di Netlify tidak bisa akses environment variables dengan prefix VITE_
`);

// Export functions untuk digunakan
window.testProductionAPIs = testProductionAPIs;
window.emergencyForceLoadData = emergencyForceLoadData;