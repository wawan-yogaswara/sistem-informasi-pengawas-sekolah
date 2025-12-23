# Cara Diagnosa Data User Wawan yang Sudah Ada

## Tujuan
Mengecek apakah data user wawan sudah ada di localStorage dan mengidentifikasi kenapa dashboard menampilkan statistik nol.

## Langkah Diagnosa

### 1. Buka Browser Console
1. Buka aplikasi di browser (http://localhost:5173)
2. Tekan F12 untuk membuka Developer Tools
3. Klik tab "Console"

### 2. Jalankan Script Diagnosa
Copy dan paste script berikut ke console, lalu tekan Enter:

```javascript
// Script diagnosa data user wawan di localStorage
console.log('🔍 Mendiagnosis data user wawan di localStorage...');

// Cek semua data yang ada di localStorage
function checkAllLocalStorageData() {
    console.log('📊 Mengecek semua data di localStorage...');
    
    const keys = Object.keys(localStorage);
    console.log('🔑 Keys yang ditemukan di localStorage:', keys);
    
    const relevantData = {};
    
    keys.forEach(key => {
        try {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    const parsed = JSON.parse(value);
                    relevantData[key] = parsed;
                    console.log(`✅ ${key}:`, typeof parsed === 'object' ? Object.keys(parsed) : parsed);
                } catch (e) {
                    relevantData[key] = value;
                    console.log(`📝 ${key}:`, value.substring(0, 100) + (value.length > 100 ? '...' : ''));
                }
            }
        } catch (error) {
            console.log(`❌ Error reading ${key}:`, error.message);
        }
    });
    
    return relevantData;
}

// Cek data aktivitas untuk user wawan
function checkWawanActivitiesData() {
    console.log('📋 Mengecek data aktivitas untuk user wawan...');
    
    const localDatabase = localStorage.getItem('local-database');
    const tasksData = localStorage.getItem('tasks_data');
    const supervisionsData = localStorage.getItem('supervisions_data');
    const additionalTasksData = localStorage.getItem('additional_tasks_data');
    const schoolsData = localStorage.getItem('schools_data');
    
    let allTasks = [];
    let allSupervisions = [];
    let allAdditionalTasks = [];
    let allSchools = [];
    
    // Cek dari local-database utama
    if (localDatabase) {
        try {
            const db = JSON.parse(localDatabase);
            console.log('📊 local-database structure:', Object.keys(db));
            
            if (db.tasks) {
                allTasks = [...allTasks, ...db.tasks];
                console.log(`📋 Tasks dari local-database: ${db.tasks.length}`);
            }
            if (db.supervisions) {
                allSupervisions = [...allSupervisions, ...db.supervisions];
                console.log(`👁️ Supervisions dari local-database: ${db.supervisions.length}`);
            }
            if (db.additionalTasks) {
                allAdditionalTasks = [...allAdditionalTasks, ...db.additionalTasks];
                console.log(`➕ Additional tasks dari local-database: ${db.additionalTasks.length}`);
            }
            if (db.schools) {
                allSchools = [...allSchools, ...db.schools];
                console.log(`🏫 Schools dari local-database: ${db.schools.length}`);
            }
        } catch (e) {
            console.log('❌ Error parsing local-database:', e.message);
        }
    }
    
    // Remove duplicates
    allTasks = allTasks.filter((task, index, self) => 
        index === self.findIndex(t => t.id === task.id)
    );
    allSupervisions = allSupervisions.filter((supervision, index, self) => 
        index === self.findIndex(s => s.id === supervision.id)
    );
    allAdditionalTasks = allAdditionalTasks.filter((task, index, self) => 
        index === self.findIndex(t => t.id === task.id)
    );
    allSchools = allSchools.filter((school, index, self) => 
        index === self.findIndex(s => s.id === school.id)
    );
    
    console.log('📊 Total data setelah deduplication:');
    console.log(`📋 Total tasks: ${allTasks.length}`);
    console.log(`👁️ Total supervisions: ${allSupervisions.length}`);
    console.log(`➕ Total additional tasks: ${allAdditionalTasks.length}`);
    console.log(`🏫 Total schools: ${allSchools.length}`);
    
    return {
        tasks: allTasks,
        supervisions: allSupervisions,
        additionalTasks: allAdditionalTasks,
        schools: allSchools
    };
}

// Filter data untuk user wawan
function filterDataForWawan(allData) {
    console.log('🔍 Memfilter data untuk user wawan...');
    
    const wawanIdentifiers = ['wawan', '1762696525337'];
    
    const wawanTasks = allData.tasks.filter(task => {
        const matches = wawanIdentifiers.some(id => 
            task.username === id || 
            task.userId === id || 
            task.user === id || 
            task.user_id === id
        );
        if (matches) {
            console.log('✅ Found wawan task:', task.title || task.name);
        }
        return matches;
    });
    
    const wawanSupervisions = allData.supervisions.filter(supervision => {
        const matches = wawanIdentifiers.some(id => 
            supervision.username === id || 
            supervision.userId === id || 
            supervision.user === id || 
            supervision.user_id === id
        );
        if (matches) {
            console.log('✅ Found wawan supervision:', supervision.title || supervision.name);
        }
        return matches;
    });
    
    const wawanAdditionalTasks = allData.additionalTasks.filter(task => {
        const matches = wawanIdentifiers.some(id => 
            task.username === id || 
            task.userId === id || 
            task.user === id || 
            task.user_id === id
        );
        if (matches) {
            console.log('✅ Found wawan additional task:', task.title || task.name);
        }
        return matches;
    });
    
    console.log('📊 Data wawan yang ditemukan:');
    console.log(`📋 Wawan tasks: ${wawanTasks.length}`);
    console.log(`👁️ Wawan supervisions: ${wawanSupervisions.length}`);
    console.log(`➕ Wawan additional tasks: ${wawanAdditionalTasks.length}`);
    
    return {
        tasks: wawanTasks,
        supervisions: wawanSupervisions,
        additionalTasks: wawanAdditionalTasks,
        schools: allData.schools
    };
}

// Hitung statistik berdasarkan data yang ada
function calculateStatsFromExistingData(wawanData) {
    console.log('📊 Menghitung statistik dari data yang ada...');
    
    const completedTasks = wawanData.tasks.filter(task => 
        task.completed === true || task.status === 'completed'
    ).length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlySupervisions = wawanData.supervisions.filter(supervision => {
        const date = new Date(supervision.date || supervision.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
    
    const stats = {
        totalTasks: wawanData.tasks.length,
        completedTasks,
        totalSchools: wawanData.schools.length,
        monthlySupervisions,
        totalSupervisions: wawanData.supervisions.length,
        totalAdditionalTasks: wawanData.additionalTasks.length
    };
    
    console.log('📈 Statistik yang dihitung:');
    console.log('- Total Tugas:', stats.totalTasks);
    console.log('- Tugas Selesai:', stats.completedTasks);
    console.log('- Total Sekolah:', stats.totalSchools);
    console.log('- Supervisi Bulan Ini:', stats.monthlySupervisions);
    console.log('- Total Supervisi:', stats.totalSupervisions);
    console.log('- Total Tugas Tambahan:', stats.totalAdditionalTasks);
    
    return stats;
}

// Jalankan diagnosa
try {
    console.log('🚀 Memulai diagnosa data user wawan...');
    
    // 1. Cek semua data localStorage
    const allData = checkAllLocalStorageData();
    
    // 2. Cek data aktivitas
    const activitiesData = checkWawanActivitiesData();
    
    // 3. Filter untuk user wawan
    const wawanData = filterDataForWawan(activitiesData);
    
    // 4. Hitung statistik
    const stats = calculateStatsFromExistingData(wawanData);
    
    console.log('✅ Diagnosa selesai!');
    
    // Tampilkan ringkasan
    if (stats.totalTasks > 0 || stats.totalSupervisions > 0) {
        console.log('✅ DATA SUDAH ADA! Dashboard seharusnya bisa menampilkan statistik.');
        console.log('🔄 Masalah mungkin di dashboard component. Coba refresh halaman.');
        
        // Coba trigger refresh dashboard
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'local-database',
            newValue: localStorage.getItem('local-database')
        }));
        
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        
    } else {
        console.log('❌ DATA KOSONG! Tidak ada data untuk user wawan.');
        console.log('💡 Perlu membuat data baru atau mengimpor data yang sudah ada.');
    }
    
} catch (error) {
    console.error('❌ Error saat diagnosa:', error);
}
```

### 3. Analisis Hasil

Setelah menjalankan script, Anda akan melihat salah satu dari hasil berikut:

#### Hasil A: Data Sudah Ada ✅
```
✅ DATA SUDAH ADA! Dashboard seharusnya bisa menampilkan statistik.
🔄 Masalah mungkin di dashboard component. Coba refresh halaman.
```

**Artinya**: Data user wawan sudah ada di localStorage, masalah ada di dashboard component atau cache browser.

**Solusi**: 
- Halaman akan refresh otomatis
- Jika masih bermasalah, clear browser cache (Ctrl+Shift+Delete)
- Periksa console untuk error JavaScript

#### Hasil B: Data Kosong ❌
```
❌ DATA KOSONG! Tidak ada data untuk user wawan.
💡 Perlu membuat data baru atau mengimpor data yang sudah ada.
```

**Artinya**: Tidak ada data untuk user wawan di localStorage.

**Solusi**: 
- Buat data baru menggunakan fitur aplikasi
- Atau gunakan script untuk membuat data sample
- Atau impor data dari backup jika ada

### 4. Langkah Lanjutan

#### Jika Data Sudah Ada tapi Dashboard Masih Nol:
1. Periksa error di console browser
2. Cek apakah user session sudah benar
3. Pastikan dashboard component tidak ada bug
4. Clear browser cache dan cookies

#### Jika Data Kosong:
1. Login sebagai user wawan
2. Buat beberapa tugas, supervisi, dan aktivitas
3. Atau gunakan script untuk membuat data sample

### 5. Verifikasi User Session

Jalankan script ini untuk memastikan user session benar:

```javascript
// Cek user session
const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

console.log('👤 Auth User:', authUser);
console.log('👤 Current User:', currentUser);

if (!authUser.username && !currentUser.username) {
    console.log('❌ User session tidak ada, perlu login ulang');
} else if (authUser.username === 'wawan' || currentUser.username === 'wawan') {
    console.log('✅ User session wawan sudah benar');
} else {
    console.log('⚠️ User session bukan wawan:', authUser.username || currentUser.username);
}
```

## Kesimpulan

Script diagnosa ini akan membantu mengidentifikasi apakah:
1. ✅ Data user wawan sudah ada (masalah di dashboard component)
2. ❌ Data user wawan kosong (perlu buat data baru)
3. ⚠️ Data ada tapi format salah (perlu perbaikan format)
4. 🔄 User session tidak benar (perlu login ulang)

Dengan diagnosa ini, kita bisa menentukan solusi yang tepat tanpa perlu membuat data sample yang tidak real.