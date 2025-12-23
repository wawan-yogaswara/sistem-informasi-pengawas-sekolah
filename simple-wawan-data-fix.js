// Script SEDERHANA untuk menampilkan data user wawan yang BENAR
// Copy-paste ke browser console (F12 -> Console) dan tekan Enter

console.log('🎯 Setting EXACT wawan data...');

// 1. Clear semua data lama
localStorage.clear();

// 2. Set user wawan
const wawan = {
  id: "1762696525337",
  username: "wawan", 
  fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
  role: "pengawas",
  nip: "196801011990031001"
};

localStorage.setItem('auth_user', JSON.stringify(wawan));
localStorage.setItem('currentUser', JSON.stringify(wawan));

// 3. Buat data EXACT: 4 tugas (2 selesai), 3 sekolah, 3 supervisi, 3 tugas tambahan
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const data = {
  users: [wawan],
  
  // 3 sekolah
  schools: [
    { id: "s1", name: "SDN 1 Garut Kota", userId: "1762696525337", username: "wawan" },
    { id: "s2", name: "SDN 2 Garut Kota", userId: "1762696525337", username: "wawan" },
    { id: "s3", name: "SDN 3 Garut Kota", userId: "1762696525337", username: "wawan" }
  ],
  
  // 4 tugas (2 selesai)
  tasks: [
    { id: "t1", title: "Supervisi Kelas 1-3", userId: "1762696525337", username: "wawan", completed: true, status: "completed", date: new Date(year, month, 5).toISOString() },
    { id: "t2", title: "Pembinaan Guru", userId: "1762696525337", username: "wawan", completed: true, status: "completed", date: new Date(year, month, 8).toISOString() },
    { id: "t3", title: "Evaluasi Kurikulum", userId: "1762696525337", username: "wawan", completed: false, status: "in_progress", date: new Date(year, month, 12).toISOString() },
    { id: "t4", title: "Monitoring Administrasi", userId: "1762696525337", username: "wawan", completed: false, status: "pending", date: new Date(year, month, 15).toISOString() }
  ],
  
  // 3 supervisi (bulan ini)
  supervisions: [
    { id: "sv1", title: "Supervisi Akademik", userId: "1762696525337", username: "wawan", date: new Date(year, month, 10).toISOString() },
    { id: "sv2", title: "Supervisi Manajerial", userId: "1762696525337", username: "wawan", date: new Date(year, month, 14).toISOString() },
    { id: "sv3", title: "Supervisi Klinis", userId: "1762696525337", username: "wawan", date: new Date(year, month, 18).toISOString() }
  ],
  
  // 3 tugas tambahan
  additionalTasks: [
    { id: "at1", title: "Pelatihan Guru", name: "Pelatihan Guru", userId: "1762696525337", username: "wawan", date: new Date(year, month, 20).toISOString() },
    { id: "at2", title: "Workshop Penilaian", name: "Workshop Penilaian", userId: "1762696525337", username: "wawan", date: new Date(year, month, 22).toISOString() },
    { id: "at3", title: "Seminar Karakter", name: "Seminar Karakter", userId: "1762696525337", username: "wawan", date: new Date(year, month, 25).toISOString() }
  ]
};

// 4. Save data
localStorage.setItem('local-database', JSON.stringify(data));

// 5. Hitung dan save stats EXACT
const stats = {
  totalTasks: 4,
  completedTasks: 2,
  totalSchools: 3,
  monthlySupervisions: 3,
  totalSupervisions: 3,
  totalAdditionalTasks: 3
};

localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));

console.log('✅ Data wawan set!');
console.log('📊 Stats:', stats);

// 6. Refresh halaman
alert('✅ Data user wawan berhasil diset!\n\nTotal Tugas: 4\nTugas Selesai: 2\nSekolah Binaan: 3\nSupervisi Bulan Ini: 3\nTugas Tambahan: 3\n\nHalaman akan refresh...');
window.location.reload();