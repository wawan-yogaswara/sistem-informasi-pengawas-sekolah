// INJECT DEBUG CONSOLE SEKOLAH - Jalankan di console aplikasi
// Copy paste script ini ke console browser di halaman localhost:5173/schools

console.log('🚨 STARTING EMERGENCY DEBUG FOR SCHOOLS...');

// 1. Check if schoolsApi is available
console.log('1. Checking schoolsApi availability...');
if (typeof schoolsApi !== 'undefined') {
    console.log('✅ schoolsApi is available:', schoolsApi);
} else {
    console.error('❌ schoolsApi is NOT available!');
    console.log('🔍 Checking window object for schoolsApi...');
    console.log('window.schoolsApi:', window.schoolsApi);
}

// 2. Check current user
console.log('2. Checking current user...');
const currentUser = localStorage.getItem('auth_user');
if (currentUser) {
    const parsed = JSON.parse(currentUser);
    console.log('✅ Current user:', parsed);
    console.log('   Username:', parsed.username);
    console.log('   User ID:', parsed.id);
    console.log('   ID format valid:', parsed.id && parsed.id.includes('-') ? '✅' : '❌');
} else {
    console.error('❌ No current user found!');
}

// 3. Check localStorage schools data
console.log('3. Checking localStorage schools data...');
const schoolsData = localStorage.getItem('schools_data');
if (schoolsData) {
    const schools = JSON.parse(schoolsData);
    console.log('✅ Schools in localStorage:', schools.length);
    schools.forEach((school, index) => {
        console.log(`   ${index + 1}. ${school.name}`);
    });
} else {
    console.log('⚠️ No schools data in localStorage');
}

// 4. Test direct Supabase connection
console.log('4. Testing direct Supabase connection...');
const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

// Check if supabase is available
if (typeof window.supabase !== 'undefined') {
    console.log('✅ Supabase client available');
    
    const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    // Test query
    supabaseClient
        .from('schools')
        .select('*')
        .then(({ data, error }) => {
            if (error) {
                console.error('❌ Supabase query error:', error);
            } else {
                console.log('✅ Supabase query successful:', data?.length || 0, 'schools');
                data?.forEach((school, index) => {
                    console.log(`   ${index + 1}. ${school.name}`);
                });
            }
        });
} else {
    console.log('⚠️ Supabase client not available in window');
}

// 5. Monitor form submissions
console.log('5. Setting up form submission monitor...');

// Override the form submission to debug
const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'submit' || type === 'click') {
        const originalListener = listener;
        const debugListener = function(event) {
            if (event.target.textContent?.includes('Simpan') || 
                event.target.textContent?.includes('Tambah') ||
                event.type === 'submit') {
                console.log('🔍 Form submission detected:', event.target);
                console.log('   Event type:', event.type);
                console.log('   Target:', event.target);
            }
            return originalListener.call(this, event);
        };
        return originalAddEventListener.call(this, type, debugListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
};

// 6. Test manual school creation
console.log('6. Creating test function for manual school creation...');

window.testCreateSchool = async function() {
    console.log('🧪 Testing manual school creation...');
    
    try {
        const testSchool = {
            name: 'TEST CONSOLE SCHOOL ' + Date.now(),
            address: 'Test Console Address',
            principal: 'Test Console Principal',
            phone: '0262-CONSOLE',
            email: 'console@test.com'
        };
        
        console.log('📤 Creating school:', testSchool);
        
        // Try using schoolsApi if available
        if (typeof schoolsApi !== 'undefined' && schoolsApi.create) {
            console.log('📤 Using schoolsApi.create...');
            const result = await schoolsApi.create(testSchool);
            console.log('✅ schoolsApi.create result:', result);
        } else {
            console.log('📤 Using direct Supabase call...');
            
            if (typeof window.supabase !== 'undefined') {
                const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
                const { data, error } = await supabaseClient
                    .from('schools')
                    .insert([testSchool])
                    .select()
                    .single();
                
                if (error) {
                    console.error('❌ Direct Supabase error:', error);
                } else {
                    console.log('✅ Direct Supabase success:', data);
                }
            } else {
                console.error('❌ No Supabase client available');
            }
        }
        
    } catch (error) {
        console.error('❌ Test creation error:', error);
    }
};

// 7. Instructions
console.log('🎯 DEBUG SETUP COMPLETE!');
console.log('');
console.log('📋 INSTRUCTIONS:');
console.log('1. Check the logs above for any errors');
console.log('2. Try adding a school through the UI');
console.log('3. Run: testCreateSchool() to test manual creation');
console.log('4. Check console for any error messages');
console.log('');
console.log('🔧 COMMON FIXES:');
console.log('- If schoolsApi not available: Check imports in schools.tsx');
console.log('- If user ID invalid: Run FIX_USER_ID_SUPABASE_LANGSUNG.html');
console.log('- If Supabase errors: Check network tab for failed requests');
console.log('');
console.log('✅ Ready for debugging!');