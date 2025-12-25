// COPY PASTE SCRIPT INI KE CONSOLE BROWSER SEKARANG
// Jalankan di console halaman localhost:5173/schools

console.clear();
console.log('🚨 EMERGENCY DEBUG SEKOLAH - STARTING NOW...');
console.log('='.repeat(60));

// 1. Check schoolsApi availability
console.log('1️⃣ CHECKING SCHOOLSAPI...');
try {
    if (typeof schoolsApi !== 'undefined') {
        console.log('✅ schoolsApi is available');
        console.log('   schoolsApi.create:', typeof schoolsApi.create);
        console.log('   schoolsApi.getAll:', typeof schoolsApi.getAll);
    } else {
        console.error('❌ schoolsApi is NOT available!');
        console.log('🔍 Checking imports...');
        
        // Check if we can access it from window or global scope
        console.log('window.schoolsApi:', window.schoolsApi);
        console.log('globalThis.schoolsApi:', globalThis.schoolsApi);
    }
} catch (error) {
    console.error('❌ Error checking schoolsApi:', error);
}

// 2. Check current user
console.log('\n2️⃣ CHECKING CURRENT USER...');
try {
    const currentUser = localStorage.getItem('auth_user');
    if (currentUser) {
        const parsed = JSON.parse(currentUser);
        console.log('✅ Current user found:');
        console.log('   Username:', parsed.username);
        console.log('   User ID:', parsed.id);
        console.log('   Role:', parsed.role);
        console.log('   ID format valid:', parsed.id && parsed.id.includes('-') ? '✅ YES' : '❌ NO');
        
        if (!parsed.id || !parsed.id.includes('-')) {
            console.warn('⚠️ USER ID NEEDS FIXING!');
            console.log('💡 Expected format: UUID with dashes (e.g., 421cdb28-f2af-4f1f-aa5f-c59a3d661a2e)');
        }
    } else {
        console.error('❌ No current user found in localStorage!');
    }
} catch (error) {
    console.error('❌ Error checking user:', error);
}

// 3. Check localStorage schools
console.log('\n3️⃣ CHECKING LOCALSTORAGE SCHOOLS...');
try {
    const schoolsData = localStorage.getItem('schools_data');
    if (schoolsData) {
        const schools = JSON.parse(schoolsData);
        console.log('✅ Schools in localStorage:', schools.length);
        console.log('📋 School list:');
        schools.forEach((school, index) => {
            console.log(`   ${index + 1}. ${school.name} (ID: ${school.id || 'No ID'})`);
        });
    } else {
        console.log('⚠️ No schools_data in localStorage');
    }
} catch (error) {
    console.error('❌ Error reading localStorage schools:', error);
}

// 4. Test direct Supabase connection
console.log('\n4️⃣ TESTING SUPABASE CONNECTION...');
try {
    const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';
    
    if (typeof window.supabase !== 'undefined') {
        console.log('✅ Supabase client available');
        
        const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
        
        // Test query
        supabaseClient
            .from('schools')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data, error }) => {
                if (error) {
                    console.error('❌ Supabase query error:', error);
                } else {
                    console.log('✅ Supabase query successful:', data?.length || 0, 'schools');
                    console.log('📋 Schools in Supabase:');
                    data?.forEach((school, index) => {
                        console.log(`   ${index + 1}. ${school.name} (ID: ${school.id})`);
                    });
                    
                    // Compare with localStorage
                    const localSchools = JSON.parse(localStorage.getItem('schools_data') || '[]');
                    const supabaseNames = data?.map(s => s.name) || [];
                    const localNames = localSchools.map(s => s.name);
                    
                    const onlyInLocal = localSchools.filter(school => 
                        !supabaseNames.includes(school.name)
                    );
                    
                    console.log('\n🔍 DATA COMPARISON:');
                    console.log('   localStorage:', localNames.length, 'schools');
                    console.log('   Supabase:', supabaseNames.length, 'schools');
                    console.log('   Only in localStorage:', onlyInLocal.length, 'schools');
                    
                    if (onlyInLocal.length > 0) {
                        console.warn('⚠️ SCHOOLS MISSING FROM SUPABASE:');
                        onlyInLocal.forEach((school, index) => {
                            console.log(`   ${index + 1}. ${school.name}`);
                        });
                        
                        // Create sync function
                        window.syncMissingSchools = async function() {
                            console.log('🔄 Syncing missing schools to Supabase...');
                            
                            for (const school of onlyInLocal) {
                                try {
                                    const supabaseSchool = {
                                        name: school.name,
                                        address: school.address,
                                        principal: school.principalName || school.principal || '',
                                        phone: school.contact || school.phone || '',
                                        email: school.email || ''
                                    };
                                    
                                    console.log(`📤 Syncing: ${school.name}`);
                                    
                                    const { data: syncData, error: syncError } = await supabaseClient
                                        .from('schools')
                                        .insert([supabaseSchool])
                                        .select()
                                        .single();
                                    
                                    if (syncError) {
                                        console.error(`❌ Failed to sync ${school.name}:`, syncError);
                                    } else {
                                        console.log(`✅ Synced: ${school.name} (ID: ${syncData.id})`);
                                    }
                                    
                                } catch (error) {
                                    console.error(`❌ Error syncing ${school.name}:`, error);
                                }
                            }
                            
                            console.log('✅ Sync completed! Refresh Supabase dashboard to see changes.');
                        };
                        
                        console.log('💡 Run syncMissingSchools() to sync missing schools to Supabase');
                    } else {
                        console.log('✅ All schools are synced!');
                    }
                }
            });
    } else {
        console.error('❌ Supabase client not available');
        console.log('💡 Try loading Supabase client first');
    }
} catch (error) {
    console.error('❌ Error testing Supabase:', error);
}

// 5. Create test function
console.log('\n5️⃣ CREATING TEST FUNCTIONS...');

window.testSchoolCreation = async function() {
    console.log('🧪 Testing school creation...');
    
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
                const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
                const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';
                
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

// 6. Monitor form submissions
console.log('\n6️⃣ SETTING UP FORM MONITORING...');

// Override form submission to debug
const originalSubmit = HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit = function() {
    console.log('🔍 Form submission detected:', this);
    return originalSubmit.call(this);
};

// Monitor button clicks
document.addEventListener('click', function(event) {
    if (event.target.textContent?.includes('Simpan') || 
        event.target.textContent?.includes('Tambah')) {
        console.log('🔍 Button click detected:', event.target.textContent);
        console.log('   Target:', event.target);
    }
});

console.log('✅ Form monitoring active');

// 7. Final instructions
console.log('\n' + '='.repeat(60));
console.log('🎯 DEBUG SETUP COMPLETE!');
console.log('');
console.log('📋 AVAILABLE FUNCTIONS:');
console.log('• testSchoolCreation() - Test creating a school');
console.log('• syncMissingSchools() - Sync missing schools to Supabase (if available)');
console.log('');
console.log('🔧 NEXT STEPS:');
console.log('1. Check the logs above for any ❌ errors');
console.log('2. If schools are missing from Supabase, run: syncMissingSchools()');
console.log('3. Try adding a school through the UI and watch console');
console.log('4. Run: testSchoolCreation() to test manual creation');
console.log('');
console.log('✅ Ready for debugging!');