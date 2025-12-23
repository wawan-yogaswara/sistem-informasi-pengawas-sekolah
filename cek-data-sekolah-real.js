// Script untuk mengecek data sekolah yang sebenarnya
// Jalankan di browser console (F12 -> Console)

console.log('🔍 Mengecek data sekolah yang sebenarnya...');

// 1. Cek semua sumber data sekolah
const localDatabase = JSON.parse(localStorage.getItem('local-database') || '{}');
const schoolsData = JSON.parse(localStorage.getItem('schools_data') || '[]');

console.log('📊 Data dari local-database.schools:', localDatabase.schools?.length || 0);
if (localDatabase.schools) {
  localDatabase.schools.forEach((school, index) => {
    console.log(`  ${index + 1}. ${school.name}`);
  });
}

console.log('📊 Data dari schools_data:', schoolsData.length);
schoolsData.forEach((school, index) => {
  console.log(`  ${index + 1}. ${school.name}`);
});

// 2. Cek data tugas
const tasks = localDatabase.tasks || [];
console.log('📋 Data tugas:', tasks.length);
tasks.forEach((task, index) => {
  console.log(`  ${index + 1}. ${task.title} - Status: ${task.status} - Completed: ${task.completed}`);
});

// 3. Cek user yang sedang login
const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

console.log('👤 Auth user:', authUser.username || 'tidak ada');
console.log('👤 Current user:', currentUser.username || 'tidak ada');

alert('Cek console untuk melihat data yang sebenarnya!');