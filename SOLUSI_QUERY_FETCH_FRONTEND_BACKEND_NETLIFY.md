# SOLUSI QUERY FETCH FRONTEND BACKEND NETLIFY

## Root Cause Analysis

Berdasarkan informasi bahwa **halaman Tugas Harian dan Supervisi datanya muncul** tapi **halaman Laporan tidak muncul**, masalahnya ada di **query fetch dari frontend ke backend** khusus untuk halaman laporan.

### Penyebab Utama: Environment Variables di Netlify Functions

**Masalah**: API endpoints menggunakan `process.env.VITE_SUPABASE_URL` dan `process.env.VITE_SUPABASE_ANON_KEY`, tapi di Netlify Functions, environment variables tidak menggunakan prefix `VITE_`.

**Mengapa Halaman Lain Berfungsi**:
- Halaman **Tasks** dan **Supervisions** menggunakan **client-side Supabase** langsung
- Halaman **Reports** menggunakan **API endpoints** yang gagal akses environment variables

## Solusi Langsung untuk User

### STEP 1: Emergency Fix (Jalankan di Console)
```javascript
// Buka halaman reports di production
// Tekan F12 → Console
// Copy-paste dan jalankan:

async function emergencyFixReports() {
  console.log('🚨 Emergency Fix Reports...');
  
  try {
    // Import Supabase client langsung
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    const activities = [];
    
    // Load semua data langsung dari Supabase
    const [tasksResult, supervisionsResult, additionalResult] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', userId),
      supabase.from('supervisions').select('*').eq('user_id', userId),
      supabase.from('additional_tasks').select('*').eq('user_id', userId)
    ]);
    
    // Process tasks
    if (tasksResult.data) {
      tasksResult.data.forEach(task => {
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
          source: 'emergency-fix'
        });
      });
    }
    
    // Process supervisions
    if (supervisionsResult.data) {
      supervisionsResult.data.forEach(supervision => {
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
          source: 'emergency-fix'
        });
      });
    }
    
    // Process additional tasks
    if (additionalResult.data) {
      additionalResult.data.forEach(task => {
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
          source: 'emergency-fix'
        });
      });
    }
    
    console.log(`✅ Loaded ${activities.length} activities`);
    console.log(`📸 Activities with photos: ${activities.filter(a => a.photo1 || a.photo2).length}`);
    
    // Cache dan trigger update
    localStorage.setItem('reports_activities_cache', JSON.stringify(activities));
    window.dispatchEvent(new CustomEvent('updateReportsData', { detail: { activities } }));
    
    alert(`✅ Emergency fix berhasil!\n📊 ${activities.length} aktivitas dimuat\n📸 ${activities.filter(a => a.photo1 || a.photo2).length} dengan foto\n\n🔄 Refresh halaman untuk melihat data`);
    
  } catch (error) {
    console.error('❌ Emergency fix error:', error);
    alert('❌ Emergency fix gagal. Cek console untuk detail error.');
  }
}

// Jalankan emergency fix
emergencyFixReports();
```

### STEP 2: Test API Endpoints
```javascript
// Test apakah API endpoints berfungsi
async function testAPIs() {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  const baseUrl = window.location.origin;
  
  const endpoints = [
    `${baseUrl}/api/tasks-daily?user_id=${userId}`,
    `${baseUrl}/api/supervisions?user_id=${userId}`,
    `${baseUrl}/api/activities?user_id=${userId}`
  ];
  
  for (const url of endpoints) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(`✅ ${url}: ${data.length} records`);
    } catch (error) {
      console.error(`❌ ${url}: ${error.message}`);
    }
  }
}

testAPIs();
```

## Solusi Permanent untuk Developer

### STEP 1: Update API Files
Replace existing API files dengan versi yang sudah diperbaiki:

1. **api/tasks-daily.js** → gunakan `api/tasks-daily-fixed.js`
2. **api/activities.js** → gunakan `api/activities-fixed.js`
3. **api/supervisions.js** → update dengan pattern yang sama

**Key Changes**:
```javascript
// BEFORE (SALAH):
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://...';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJ...';

// AFTER (BENAR):
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://...';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJ...';
```

### STEP 2: Add Environment Variables di Netlify
Login ke Netlify Dashboard → Site Settings → Environment Variables:

```
SUPABASE_URL = https://fmxeboullgcewzjpql.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
VITE_SUPABASE_URL = https://fmxeboullgcewzjpql.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
```

### STEP 3: Redeploy
1. Push changes ke GitHub
2. Netlify akan auto-deploy
3. Test halaman reports

## Verification Steps

### 1. Cek Environment Variables
```javascript
// Jalankan di console production
console.log('Environment check:', {
  origin: window.location.origin,
  hostname: window.location.hostname,
  isNetlify: window.location.hostname.includes('netlify.app')
});
```

### 2. Test API Response
```javascript
// Test individual API
fetch('/api/tasks-daily?user_id=421cdb28-f2af-4f1f-aa5f-c59a3d661a2e')
  .then(r => r.json())
  .then(data => console.log('Tasks API:', data.length, 'records'))
  .catch(err => console.error('Tasks API error:', err));
```

### 3. Verify Data Loading
```javascript
// Cek apakah reports page sudah load data
const activities = JSON.parse(localStorage.getItem('reports_activities_cache') || '[]');
console.log('Cached activities:', activities.length);
```

## Expected Results

Setelah fix ini:
- ✅ API endpoints berfungsi dengan environment variables yang benar
- ✅ Halaman reports dapat load data dari Supabase
- ✅ Foto muncul di halaman laporan
- ✅ Semua fitur export PDF berfungsi normal

## Troubleshooting

Jika masih bermasalah:
1. **Cek Netlify Functions Logs**: Netlify Dashboard → Functions → View logs
2. **Cek Browser Network Tab**: F12 → Network → lihat API calls yang gagal
3. **Jalankan Emergency Fix**: Gunakan script di STEP 1 sebagai workaround sementara

## Status
- **Issue**: Query fetch frontend ke backend gagal di production Netlify
- **Root Cause**: Environment variables tidak accessible di Netlify Functions
- **Solution**: Update API files + add proper environment variables
- **Priority**: HIGH - affects core functionality