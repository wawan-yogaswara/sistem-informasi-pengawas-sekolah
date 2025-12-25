# EMERGENCY DEBUG APEL PAGI - LANGKAH DEMI LANGKAH

## Masalah
Data Apel Pagi sudah ada di Supabase tapi tidak muncul di halaman laporan setelah refresh.

## Langkah Debug Segera

### 1. Buka Developer Tools
- Tekan F12 atau klik kanan → Inspect
- Buka tab Console

### 2. Jalankan Script Debug
Copy paste script ini ke console:

```javascript
// EMERGENCY DEBUG APEL PAGI
const emergencyDebug = async () => {
  console.log('🚨 EMERGENCY DEBUG APEL PAGI');
  
  // Test API langsung
  const response = await fetch('/api/tasks');
  const data = await response.json();
  
  console.log('📊 Total data dari API:', data.length);
  
  // Cari apel pagi
  const apelTasks = data.filter(task => 
    (task.title && task.title.toLowerCase().includes('apel')) ||
    (task.name && task.name.toLowerCase().includes('apel'))
  );
  
  console.log('🌅 Data Apel Pagi ditemukan:', apelTasks.length);
  
  if (apelTasks.length > 0) {
    console.log('✅ APEL PAGI ADA DI SUPABASE!');
    apelTasks.forEach((task, i) => {
      console.log(`${i+1}. ${task.title || task.name}`);
      console.log(`   - ID: ${task.id}`);
      console.log(`   - User ID: ${task.user_id}`);
      console.log(`   - Date: ${task.date}`);
    });
    
    // Cek user yang login
    const authUser = localStorage.getItem('auth_user');
    const currentUser = localStorage.getItem('currentUser');
    
    let loginUserId = 'unknown';
    if (authUser) {
      const user = JSON.parse(authUser);
      loginUserId = user.id || user.username || 'unknown';
    } else if (currentUser) {
      const user = JSON.parse(currentUser);
      loginUserId = user.id || user.username || 'unknown';
    }
    
    console.log('👤 User yang login:', loginUserId);
    
    // Cek apakah user_id cocok
    const matchingTasks = apelTasks.filter(task => task.user_id === loginUserId);
    console.log('🎯 Apel tasks dengan user_id yang cocok:', matchingTasks.length);
    
    if (matchingTasks.length === 0) {
      console.log('⚠️ MASALAH DITEMUKAN: User ID tidak cocok!');
      console.log('💡 SOLUSI: Update user_id di Supabase atau gunakan user_id yang benar');
      
      // Show all user_ids
      const userIds = [...new Set(apelTasks.map(t => t.user_id))];
      console.log('📋 User IDs di data Apel Pagi:', userIds);
    } else {
      console.log('✅ User ID cocok, masalah mungkin di cache atau React Query');
    }
    
  } else {
    console.log('❌ APEL PAGI TIDAK ADA DI SUPABASE!');
    console.log('📋 Data yang ada:');
    data.slice(0, 5).forEach(task => {
      console.log(`- ${task.title || task.name} (${task.user_id})`);
    });
  }
};

emergencyDebug();
```

### 3. Berdasarkan Hasil Debug

#### Jika "APEL PAGI ADA DI SUPABASE" tapi "User ID tidak cocok":
```javascript
// FIX USER ID - Update data di Supabase
const fixUserId = async () => {
  const authUser = localStorage.getItem('auth_user');
  const user = JSON.parse(authUser);
  const correctUserId = user.id || user.username;
  
  console.log('🔧 Updating user_id to:', correctUserId);
  
  // Update semua apel pagi tasks
  const response = await fetch('/api/tasks', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'update_user_id',
      old_user_id: 'GANTI_DENGAN_USER_ID_LAMA',
      new_user_id: correctUserId
    })
  });
  
  console.log('Update result:', await response.json());
};

// Jalankan setelah ganti GANTI_DENGAN_USER_ID_LAMA
// fixUserId();
```

#### Jika "User ID cocok" tapi masih tidak muncul:
```javascript
// FORCE REFRESH REACT QUERY
if (window.queryClient) {
  window.queryClient.clear();
  window.queryClient.invalidateQueries(['all-activities']);
}
localStorage.clear();
location.reload();
```

#### Jika "APEL PAGI TIDAK ADA DI SUPABASE":
```javascript
// MIGRATE DARI LOCALSTORAGE
const migrateApelPagi = async () => {
  const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
  const apelTasks = localData.additionalTasks?.filter(task => 
    task.name && task.name.toLowerCase().includes('apel')
  ) || [];
  
  console.log('📤 Migrating', apelTasks.length, 'apel tasks...');
  
  for (const task of apelTasks) {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: task.name,
        description: task.description || 'Apel pagi rutin',
        date: task.date,
        location: task.location || 'KCD XI',
        organizer: task.organizer || 'KCD XI',
        user_id: 'wawan-user'
      })
    });
    
    if (response.ok) {
      console.log('✅ Migrated:', task.name);
    } else {
      console.log('❌ Failed:', task.name);
    }
  }
  
  console.log('🎉 Migration complete! Refresh page.');
};

migrateApelPagi();
```

### 4. Refresh Halaman
Setelah menjalankan script yang sesuai, refresh halaman laporan.

## Status
🚨 Script debug siap dijalankan untuk identifikasi masalah
🔧 Script perbaikan tersedia untuk berbagai skenario