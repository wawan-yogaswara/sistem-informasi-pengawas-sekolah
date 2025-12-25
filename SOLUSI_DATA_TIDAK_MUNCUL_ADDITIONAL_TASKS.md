# Solusi Data Tidak Muncul di Additional Tasks

## Masalah
- Data berhasil tersimpan (ada notifikasi sukses)
- Data tidak muncul di halaman additional tasks
- Data tidak masuk ke tabel Supabase

## Langkah Debug

### 1. Buka Browser Console (F12)
Jalankan script debug ini di console:

```javascript
// Debug lengkap additional tasks
console.log('🔍 Debug Additional Tasks...');

// 1. Cek localStorage
const localData = localStorage.getItem('additional_tasks_data');
console.log('📦 Data localStorage:', localData ? JSON.parse(localData) : 'Kosong');

// 2. Cek auth
const authUser = localStorage.getItem('auth_user');
const authToken = localStorage.getItem('auth_token');
console.log('🔐 Auth User:', authUser ? JSON.parse(authUser) : 'Tidak ada');
console.log('🔐 Auth Token:', authToken ? 'Ada' : 'Tidak ada');

// 3. Test API GET
fetch('/api/additional-tasks', {
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('📥 GET Response status:', response.status);
  return response.json();
})
.then(data => console.log('📥 GET Data:', data))
.catch(error => console.error('❌ GET Error:', error));

// 4. Test API POST
const testData = {
  title: 'Debug Test',
  description: 'Test debugging',
  date: '2025-01-15',
  status: 'pending'
};

fetch('/api/additional-tasks', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('📤 POST Response status:', response.status);
  return response.json();
})
.then(data => console.log('📤 POST Data:', data))
.catch(error => console.error('❌ POST Error:', error));
```

### 2. Cek Network Tab
- Buka Network tab di DevTools
- Coba input data lagi
- Lihat apakah ada request ke `/api/additional-tasks`
- Cek status code dan response

### 3. Kemungkinan Masalah

#### A. Authentication Issue
Jika auth token tidak ada atau invalid:
```javascript
// Re-login
localStorage.removeItem('auth_user');
localStorage.removeItem('auth_token');
// Kemudian login ulang
```

#### B. API Endpoint Issue
Jika API tidak merespon dengan benar, cek server logs atau restart server.

#### C. React Query Cache Issue
```javascript
// Clear React Query cache
if (window.queryClient) {
  window.queryClient.clear();
  window.location.reload();
}
```

### 4. Force Refresh Data
```javascript
// Force refresh halaman dan clear cache
localStorage.removeItem('additional_tasks_data');
if (window.queryClient) {
  window.queryClient.invalidateQueries(['additional-tasks']);
}
window.location.reload();
```

### 5. Manual Fix
Jika masih tidak berhasil, coba input data manual:
```javascript
// Input manual ke localStorage untuk test
const manualData = {
  id: crypto.randomUUID(),
  title: 'Manual Test',
  description: 'Test manual input',
  date: '2025-01-15',
  status: 'pending',
  user_id: JSON.parse(localStorage.getItem('auth_user')).id,
  created_at: new Date().toISOString()
};

const existing = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');
existing.unshift(manualData);
localStorage.setItem('additional_tasks_data', JSON.stringify(existing));

// Refresh halaman
window.location.reload();
```

## Solusi Cepat
1. Refresh halaman (Ctrl+F5)
2. Clear browser cache
3. Login ulang
4. Coba input data lagi

## Jika Masih Bermasalah
Beri tahu hasil dari script debug di atas, terutama:
- Status code dari API calls
- Error messages yang muncul
- Isi data di localStorage