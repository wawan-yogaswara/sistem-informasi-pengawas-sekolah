// TEST INPUT LANGSUNG - SEKARANG
// Copy paste ke console browser

console.log('🧪 TEST INPUT LANGSUNG');

// Test user data
const userData = localStorage.getItem('auth_user');
console.log('User data:', userData ? JSON.parse(userData) : 'No user');

// Test Supabase connection
console.log('Supabase:', supabase);

// Test simple task insert
async function testTaskInsert() {
  try {
    const user = JSON.parse(localStorage.getItem('auth_user'));
    const userId = `user-${user.username}-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: userId,
        title: 'Test Task Simple',
        description: 'Test description',
        completed: false,
        date: '2025-01-22'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Task error:', error);
    } else {
      console.log('✅ Task success:', data);
    }
  } catch (e) {
    console.error('❌ Task failed:', e);
  }
}

// Test simple supervision insert
async function testSupervisionInsert() {
  try {
    const user = JSON.parse(localStorage.getItem('auth_user'));
    const userId = `user-${user.username}-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('supervisions')
      .insert([{
        user_id: userId,
        school: 'Test School',
        type: 'Akademik',
        date: '2025-01-22',
        findings: 'Test findings'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supervision error:', error);
    } else {
      console.log('✅ Supervision success:', data);
    }
  } catch (e) {
    console.error('❌ Supervision failed:', e);
  }
}

// Jalankan test
testTaskInsert();
testSupervisionInsert();