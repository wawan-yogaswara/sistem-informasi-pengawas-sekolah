// 🔍 Console Debug Script for Additional Tasks Button
// Copy-paste this entire script into browser console on the Additional Tasks page

console.log('🚀 Starting Additional Tasks Button Debug...');

// 1. Check if we're on the right page
console.log('📍 Current URL:', window.location.href);
if (!window.location.pathname.includes('additional-tasks')) {
    console.warn('⚠️ You are not on the additional-tasks page!');
    console.log('💡 Navigate to: http://localhost:5173/additional-tasks');
} else {
    console.log('✅ On correct page (additional-tasks)');
}

// 2. Check user session
console.log('\n👤 Checking user session...');
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
    try {
        const user = JSON.parse(currentUser);
        console.log('✅ User found:', user.fullName || user.username);
        console.log('🔑 Role:', user.role);
        
        if (user.role === 'admin') {
            console.log('✅ User has admin role - should see button');
        } else {
            console.warn('⚠️ User is not admin - might not see button');
        }
    } catch (error) {
        console.error('❌ Error parsing user data:', error);
    }
} else {
    console.error('❌ No user session found');
}

// 3. Check for React errors
console.log('\n⚛️ Checking React status...');
if (window.React) {
    console.log('✅ React is loaded');
} else {
    console.warn('⚠️ React not found in window');
}

// Check React root
const reactRoot = document.getElementById('root');
if (reactRoot) {
    console.log('✅ React root found');
    if (reactRoot.innerHTML.trim() === '') {
        console.error('❌ React root is empty - app not mounted');
    } else {
        console.log('✅ React app appears to be mounted');
    }
} else {
    console.error('❌ React root not found');
}

// 4. Check DOM elements
console.log('\n🔍 Checking DOM elements...');

// Find main container
const mainContainer = document.querySelector('[class*="space-y-6"]');
if (mainContainer) {
    console.log('✅ Main container found');
    console.log('📊 Container classes:', mainContainer.className);
} else {
    console.error('❌ Main container not found');
}

// Find header section
const header = document.querySelector('h1');
if (header) {
    console.log('✅ Header found:', header.textContent);
    console.log('📊 Header parent:', header.parentElement);
} else {
    console.error('❌ Header not found');
}

// Find all buttons
const allButtons = document.querySelectorAll('button');
console.log(`📊 Total buttons found: ${allButtons.length}`);

if (allButtons.length > 0) {
    console.log('📋 Button texts:');
    Array.from(allButtons).forEach((btn, index) => {
        const text = btn.textContent.trim();
        const isVisible = getComputedStyle(btn).display !== 'none' && getComputedStyle(btn).visibility !== 'hidden';
        console.log(`  ${index + 1}. "${text}" - Visible: ${isVisible}`);
        
        if (text.includes('Tambah Kegiatan') || text.includes('Tambah')) {
            console.log('🎯 FOUND TARGET BUTTON!');
            console.log('📊 Button element:', btn);
            console.log('📊 Button styles:', {
                display: getComputedStyle(btn).display,
                visibility: getComputedStyle(btn).visibility,
                opacity: getComputedStyle(btn).opacity,
                position: getComputedStyle(btn).position
            });
        }
    });
} else {
    console.error('❌ No buttons found at all');
}

// 5. Check for specific "Tambah Kegiatan" button
console.log('\n🎯 Looking for "Tambah Kegiatan" button...');
const addButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent.includes('Tambah Kegiatan') || btn.textContent.includes('Tambah')
);

if (addButton) {
    console.log('✅ "Tambah Kegiatan" button FOUND!');
    console.log('📊 Button element:', addButton);
    console.log('📊 Button parent:', addButton.parentElement);
    console.log('📊 Button computed styles:', getComputedStyle(addButton));
    
    // Check if button is actually visible
    const rect = addButton.getBoundingClientRect();
    console.log('📊 Button position:', rect);
    
    if (rect.width === 0 || rect.height === 0) {
        console.warn('⚠️ Button has zero dimensions');
    }
    
    if (rect.top < 0 || rect.left < 0) {
        console.warn('⚠️ Button is positioned outside viewport');
    }
    
} else {
    console.error('❌ "Tambah Kegiatan" button NOT found');
    
    // Try to find Dialog components
    console.log('\n🔍 Looking for Dialog components...');
    const dialogs = document.querySelectorAll('[role="dialog"], [data-radix-dialog-content]');
    console.log(`📊 Dialog elements found: ${dialogs.length}`);
    
    // Check for DialogTrigger
    const dialogTriggers = document.querySelectorAll('[data-radix-dialog-trigger]');
    console.log(`📊 Dialog triggers found: ${dialogTriggers.length}`);
}

// 6. Check localStorage data
console.log('\n💾 Checking localStorage data...');
const additionalTasksData = localStorage.getItem('additional_tasks_data');
if (additionalTasksData) {
    try {
        const tasks = JSON.parse(additionalTasksData);
        console.log('✅ Additional tasks data found');
        console.log('📊 Tasks count:', tasks.length);
        console.log('📋 Tasks:', tasks);
    } catch (error) {
        console.error('❌ Error parsing additional tasks data:', error);
    }
} else {
    console.warn('⚠️ No additional tasks data in localStorage');
}

// 7. Force inject button for testing
console.log('\n💉 Injecting test button...');
try {
    const headerDiv = document.querySelector('h1')?.parentElement;
    if (headerDiv) {
        // Create test button
        const testButton = document.createElement('button');
        testButton.innerHTML = '🧪 TEST BUTTON (Tambah Kegiatan)';
        testButton.style.cssText = `
            background: #16a34a;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 20px;
            font-size: 14px;
        `;
        
        testButton.onclick = function() {
            alert('Test button works! The issue is with React component rendering.');
            console.log('✅ Test button clicked - functionality works');
        };
        
        // Make sure parent has flex layout
        headerDiv.parentElement.style.display = 'flex';
        headerDiv.parentElement.style.justifyContent = 'space-between';
        headerDiv.parentElement.style.alignItems = 'flex-start';
        
        headerDiv.parentElement.appendChild(testButton);
        console.log('✅ Test button injected successfully');
        console.log('🧪 Try clicking the test button to verify functionality');
    } else {
        console.error('❌ Could not find header to inject test button');
    }
} catch (error) {
    console.error('❌ Error injecting test button:', error);
}

// 8. Summary and recommendations
console.log('\n📋 SUMMARY & RECOMMENDATIONS:');
console.log('1. Check if React app is properly mounted');
console.log('2. Check browser console for JavaScript errors');
console.log('3. Verify user has admin role');
console.log('4. Check if Dialog components are properly imported');
console.log('5. Try refreshing the page');
console.log('6. Try clearing browser cache');
console.log('7. Check if CSS is hiding the button');

console.log('\n🔧 NEXT STEPS:');
console.log('1. If test button works, issue is with React rendering');
console.log('2. If no buttons found, check React component mounting');
console.log('3. If user not admin, login as admin');
console.log('4. Check browser Network tab for failed requests');

console.log('\n✅ Debug script completed!');
console.log('📊 Results logged above. Look for ❌ errors and ⚠️ warnings.');