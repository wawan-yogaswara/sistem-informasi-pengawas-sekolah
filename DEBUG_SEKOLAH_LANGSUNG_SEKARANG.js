// DEBUG SEKOLAH LANGSUNG - Jalankan di console browser
// Copy paste script ini ke console browser di halaman localhost:5173/schools

console.log('🚨 STARTING COMPREHENSIVE SCHOOL DEBUG...');
console.log('='.repeat(50));

// 1. Check current environment
console.log('1. 🌍 ENVIRONMENT CHECK');
console.log('   URL:', window.location.href);
console.log('   Hostname:', window.location.hostname);
console.log('   Port:', window.location.port);
console.log('   Protocol:', window.location.protocol);

// 2. Check user authentication
console.log('\n2. 👤 USER AUTHENTICATION CHECK');
const currentUser = localStorage.getItem('auth_user');
const authToken = localStorage.getItem('auth_token');

if (currentUser) {
    const user = JSON.parse(currentUser);
    console.log('✅ User logged in:', user.username);
    console.log('   User ID:', user.id);
    console.log('   ID format valid:', user.id && user.id.includes('-') ? '✅' : '❌');
    console.log('   Role:', user.role);
    console.log('   Full name:', user.full_name);
} else {
    console.error('❌ No user authentication found!');
}

if (authToken) {
    console.log('✅ Auth token exists:', authToken.substring(0, 20) + '...');
} else {
    console.error('❌ No auth token found!');
}

// 3. Check localStorage schools data
console.log('\n3. 📦 LOCALSTORAGE SCHOOLS DATA');
const schoolsData = localStorage.getItem('schools_data');
const schoolsBackup = localStorage.getItem('schools_data_backup');
const schoolsTimestamp = localStorage.getItem('schools_data_timestamp');

if (schoolsData) {
    const schools = JSON.parse(schoolsData);
    console.log('✅ Schools in localStorage:', schools.length);
    schools.forEach((school, index) => {
        console.log(`   ${index + 1}. ${school.name} (ID: ${school.id})`);
        console.log(`      Address: ${school.address}`);
        console.log(`      Contact: ${school.contact}`);
        console.log(`      Principal: ${school.principalName || 'N/A'}`);
    });
} else {
    console.log('⚠️ No schools data in localStorage');
}

if (schoolsBackup) {
    const backup = JSON.parse(schoolsBackup);
    console.log('📋 Backup schools data:', backup.length, 'records');
} else {
    console.log('⚠️ No schools backup data');
}

if (schoolsTimestamp) {
    const timestamp = new Date(parseInt(schoolsTimestamp));
    console.log('⏰ Last update:', timestamp.toLocaleString());
} else {
    console.log('⚠️ No timestamp data');
}

// 4. Check Supabase connection
console.log('\n4. 🗄️ SUPABASE CONNECTION CHECK');
const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

// Check if supabase is available globally
if (typeof window.supabase !== 'undefined') {
    console.log('✅ Supabase client available globally');
    
    const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    // Test connection with schools table
    console.log('🔍 Testing Supabase schools query...');
    supabaseClient
        .from('schools')
        .select('*')
        .then(({ data, error }) => {
            if (error) {
                console.error('❌ Supabase schools query error:', error);
                console.error('   Error code:', error.code);
                console.error('   Error message:', error.message);
                console.error('   Error details:', error.details);
            } else {
                console.log('✅ Supabase schools query successful:', data?.length || 0, 'schools');
                if (data && data.length > 0) {
                    data.forEach((school, index) => {
                        console.log(`   ${index + 1}. ${school.name} (ID: ${school.id})`);
                        console.log(`      Created: ${school.created_at}`);
                        console.log(`      Address: ${school.address}`);
                        console.log(`      Phone: ${school.phone}`);
                        console.log(`      Principal: ${school.principal}`);
                    });
                } else {
                    console.log('⚠️ No schools found in Supabase');
                }
            }
        })
        .catch(err => {
            console.error('❌ Supabase connection failed:', err);
        });
} else {
    console.log('⚠️ Supabase client not available globally');
    console.log('🔍 Checking if supabase is imported in modules...');
    
    // Try to access supabase through module system
    if (typeof window.React !== 'undefined') {
        console.log('✅ React is available');
    }
}

// 5. Check API functions
console.log('\n5. 🔧 API FUNCTIONS CHECK');

// Check if schoolsApi is available
if (typeof window.schoolsApi !== 'undefined') {
    console.log('✅ schoolsApi available globally');
} else {
    console.log('⚠️ schoolsApi not available globally');
    console.log('🔍 This is normal - API is imported in components');
}

// 6. Test manual school creation function
console.log('\n6. 🧪 MANUAL SCHOOL CREATION TEST');

window.testCreateSchoolNow = async function() {
    console.log('🚀 Testing manual school creation...');
    
    try {
        const testSchool = {
            name: 'TEST DEBUG SCHOOL ' + Date.now(),
            address: 'Jl. Test Debug No. 123',
            phone: '0262-DEBUG',
            principal: 'Kepala Sekolah Debug',
            email: 'debug@test.com'
        };
        
        console.log('📤 Creating school with data:', testSchool);
        
        // Method 1: Try direct Supabase
        if (typeof window.supabase !== 'undefined') {
            console.log('📤 Method 1: Direct Supabase...');
            
            const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
            const { data, error } = await supabaseClient
                .from('schools')
                .insert([testSchool])
                .select()
                .single();
            
            if (error) {
                console.error('❌ Direct Supabase error:', error);
                throw error;
            } else {
                console.log('✅ Direct Supabase success:', data);
                
                // Update localStorage
                const currentSchools = JSON.parse(localStorage.getItem('schools_data') || '[]');
                const newSchoolData = {
                    id: data.id,
                    name: data.name,
                    address: data.address,
                    contact: data.phone,
                    principalName: data.principal,
                    principalNip: '',
                    supervisions: 0,
                    createdAt: data.created_at
                };
                
                currentSchools.push(newSchoolData);
                localStorage.setItem('schools_data', JSON.stringify(currentSchools));
                localStorage.setItem('schools_data_backup', JSON.stringify(currentSchools));
                localStorage.setItem('schools_data_timestamp', Date.now().toString());
                
                console.log('✅ School added to localStorage cache');
                
                // Trigger page refresh to show new data
                if (typeof window.location !== 'undefined') {
                    console.log('🔄 Refreshing page to show new data...');
                    setTimeout(() => window.location.reload(), 1000);
                }
                
                return data;
            }
        } else {
            throw new Error('Supabase client not available');
        }
        
    } catch (error) {
        console.error('❌ Test creation error:', error);
        
        // Method 2: Fallback to localStorage only
        console.log('📦 Fallback: Using localStorage only...');
        
        const currentSchools = JSON.parse(localStorage.getItem('schools_data') || '[]');
        const newSchoolData = {
            id: Date.now().toString(),
            name: testSchool.name,
            address: testSchool.address,
            contact: testSchool.phone,
            principalName: testSchool.principal,
            principalNip: '',
            supervisions: 0,
            createdAt: new Date().toISOString()
        };
        
        currentSchools.push(newSchoolData);
        localStorage.setItem('schools_data', JSON.stringify(currentSchools));
        localStorage.setItem('schools_data_backup', JSON.stringify(currentSchools));
        localStorage.setItem('schools_data_timestamp', Date.now().toString());
        
        console.log('✅ School added to localStorage (fallback)');
        
        // Trigger page refresh
        if (typeof window.location !== 'undefined') {
            console.log('🔄 Refreshing page to show new data...');
            setTimeout(() => window.location.reload(), 1000);
        }
        
        return newSchoolData;
    }
};

// 7. Test form interaction
console.log('\n7. 🎯 FORM INTERACTION TEST');

window.testFormInteraction = function() {
    console.log('🔍 Testing form elements...');
    
    // Find add school button
    const addButton = document.querySelector('[data-testid="button-add-school"]');
    if (addButton) {
        console.log('✅ Add school button found');
        console.log('   Button text:', addButton.textContent);
        console.log('   Button disabled:', addButton.disabled);
    } else {
        console.log('❌ Add school button not found');
    }
    
    // Find form inputs
    const nameInput = document.querySelector('[data-testid="input-school-name"]');
    const addressInput = document.querySelector('[data-testid="input-school-address"]');
    const contactInput = document.querySelector('[data-testid="input-school-contact"]');
    const saveButton = document.querySelector('[data-testid="button-save-school"]');
    
    console.log('Form elements:');
    console.log('   Name input:', nameInput ? '✅' : '❌');
    console.log('   Address input:', addressInput ? '✅' : '❌');
    console.log('   Contact input:', contactInput ? '✅' : '❌');
    console.log('   Save button:', saveButton ? '✅' : '❌');
    
    if (nameInput && addressInput && contactInput && saveButton) {
        console.log('🧪 Auto-filling form for test...');
        
        nameInput.value = 'TEST AUTO SCHOOL ' + Date.now();
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        addressInput.value = 'Jl. Auto Test No. 456';
        addressInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        contactInput.value = '0262-AUTO';
        contactInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        console.log('✅ Form auto-filled. Click save button to test!');
        console.log('   Or run: document.querySelector("[data-testid=\\"button-save-school\\"]").click()');
    }
};

// 8. Network monitoring
console.log('\n8. 🌐 NETWORK MONITORING SETUP');

// Override fetch to monitor API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const url = args[0];
    console.log('🌐 Network request:', url);
    
    return originalFetch.apply(this, args)
        .then(response => {
            console.log('📡 Response:', response.status, response.statusText, 'for', url);
            return response;
        })
        .catch(error => {
            console.error('❌ Network error for', url, ':', error);
            throw error;
        });
};

// 9. Instructions
console.log('\n' + '='.repeat(50));
console.log('🎯 DEBUG SETUP COMPLETE!');
console.log('');
console.log('📋 QUICK ACTIONS:');
console.log('1. testCreateSchoolNow() - Create test school');
console.log('2. testFormInteraction() - Test form elements');
console.log('3. Check console for any errors when adding school');
console.log('');
console.log('🔧 COMMON ISSUES & FIXES:');
console.log('- If no schools showing: Check localStorage data above');
console.log('- If Supabase errors: Check network tab for failed requests');
console.log('- If form not working: Run testFormInteraction()');
console.log('- If data not saving: Check user authentication');
console.log('');
console.log('✅ Ready for comprehensive debugging!');