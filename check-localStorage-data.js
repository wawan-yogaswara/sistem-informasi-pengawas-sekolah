// Script untuk mengecek data localStorage user Wawan
console.log('🔍 Checking localStorage data for user Wawan...');

// 1. Cek user data
console.log('\n👤 USER DATA:');
const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
const userData = JSON.parse(localStorage.getItem('user_data') || '{}');

console.log('auth_user:', authUser);
console.log('currentUser:', currentUser);
console.log('user_data:', userData);

// 2. Cek semua data yang tersimpan
console.log('\n📊 DATA TERSIMPAN:');
const localDatabase = JSON.parse(localStorage.getItem('local-database') || '{}');
const tasksData = JSON.parse(localStorage.getItem('tasks_data') || '[]');
const supervisionsData = JSON.parse(localStorage.getItem('supervisions_data') || '[]');
const schoolsData = JSON.parse(localStorage.getItem('schools_data') || '[]');
const additionalTasksData = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');

console.log('local-database:', {
  users: localDatabase.users?.length || 0,
  tasks: localDatabase.tasks?.length || 0,
  supervisions: localDatabase.supervisions?.length || 0,
  schools: localDatabase.schools?.length || 0,
  additionalTasks: localDatabase.additionalTasks?.length || 0
});

console.log('Individual data:');
console.log('- tasks_data:', tasksData.length, 'items');
console.log('- supervisions_data:', supervisionsData.length, 'items');
console.log('- schools_data:', schoolsData.length, 'items');
console.log('- additional_tasks_data:', additionalTasksData.length, 'items');

// 3. Cek data untuk user Wawan
console.log('\n🔍 DATA UNTUK USER WAWAN:');
const wawaUserId = '1762696525337';
const wawaUsername = 'wawan';

// Filter tasks untuk Wawan
const wawaTasks = tasksData.filter(task => 
  task.userId === wawaUserId || 
  task.username === wawaUsername ||
  task.user_id === wawaUserId ||
  task.user === wawaUsername
);

// Filter supervisions untuk Wawan
const wawaSupervisions = supervisionsData.filter(supervision => 
  supervision.userId === wawaUserId || 
  supervision.username === wawaUsername ||
  supervision.user_id === wawaUserId ||
  supervision.user === wawaUsername
);

// Filter additional tasks untuk Wawan
const wawaAdditionalTasks = additionalTasksData.filter(task => 
  task.userId === wawaUserId || 
  task.username === wawaUsername ||
  task.user_id === wawaUserId ||
  task.user === wawaUsername
);

console.log('Wawan Tasks:', wawaTasks.length, 'items');
console.log('Wawan Supervisions:', wawaSupervisions.length, 'items');
console.log('Wawan Additional Tasks:', wawaAdditionalTasks.length, 'items');

// 4. Detail data Wawan
if (wawaTasks.length > 0) {
  console.log('\n📋 DETAIL TASKS WAWAN:');
  wawaTasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.title} (${task.date}) - ${task.completed ? 'Selesai' : 'Belum Selesai'}`);
  });
}

if (wawaSupervisions.length > 0) {
  console.log('\n👁️ DETAIL SUPERVISIONS WAWAN:');
  wawaSupervisions.forEach((supervision, index) => {
    console.log(`${index + 1}. ${supervision.title || supervision.school} (${supervision.date})`);
  });
}

if (wawaAdditionalTasks.length > 0) {
  console.log('\n➕ DETAIL ADDITIONAL TASKS WAWAN:');
  wawaAdditionalTasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.title || task.name} (${task.date})`);
  });
}

// 5. Diagnosis masalah
console.log('\n🔍 DIAGNOSIS:');
if (wawaTasks.length === 0 && wawaSupervisions.length === 0 && wawaAdditionalTasks.length === 0) {
  console.log('❌ MASALAH: Tidak ada data untuk user Wawan ditemukan!');
  console.log('Kemungkinan penyebab:');
  console.log('1. Data tidak tersimpan dengan user ID yang benar');
  console.log('2. Data tersimpan tapi dengan format yang berbeda');
  console.log('3. Data hilang atau terhapus');
} else {
  console.log('✅ Data ditemukan untuk user Wawan');
  console.log(`Total aktivitas: ${wawaTasks.length + wawaSupervisions.length + wawaAdditionalTasks.length}`);
}

// 6. Cek semua keys localStorage
console.log('\n🗂️ SEMUA KEYS LOCALSTORAGE:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key) {
    const value = localStorage.getItem(key);
    const size = value ? value.length : 0;
    console.log(`${key}: ${size} characters`);
  }
}

console.log('\n✅ Pemeriksaan localStorage selesai!');

// Return summary
return {
  userExists: !!(authUser.username || currentUser.username || userData.username),
  currentUser: authUser.username || currentUser.username || userData.username || 'Unknown',
  totalTasks: wawaTasks.length,
  totalSupervisions: wawaSupervisions.length,
  totalAdditionalTasks: wawaAdditionalTasks.length,
  hasData: (wawaTasks.length + wawaSupervisions.length + wawaAdditionalTasks.length) > 0
};