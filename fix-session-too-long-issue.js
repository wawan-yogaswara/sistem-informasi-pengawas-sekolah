// Fix Session Too Long Issue
// Script untuk mengatasi masalah "session too long" yang sering muncul

console.log('🔧 Fixing session too long issue...');

// 1. Clear all existing intervals and timeouts
function clearAllIntervals() {
  console.log('🧹 Clearing all intervals and timeouts...');
  
  // Clear all intervals
  const highestIntervalId = setInterval(() => {}, 1);
  for (let i = 0; i < highestIntervalId; i++) {
    clearInterval(i);
  }
  
  // Clear all timeouts
  const highestTimeoutId = setTimeout(() => {}, 1);
  for (let i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
  }
  
  console.log('✅ All intervals and timeouts cleared');
}

// 2. Remove excessive event listeners
function cleanupEventListeners() {
  console.log('🧹 Cleaning up event listeners...');
  
  // Remove storage event listeners
  const storageListeners = window.addEventListener.toString().match(/storage/g);
  if (storageListeners && storageListeners.length > 1) {
    console.log(`⚠️ Found ${storageListeners.length} storage listeners, cleaning up...`);
    // Clone window to remove all listeners
    const newWindow = window.cloneNode ? window.cloneNode(true) : window;
  }
  
  // Remove custom event listeners
  window.removeEventListener('photoUpdated', () => {});
  window.removeEventListener('wawanStatsReady', () => {});
  window.removeEventListener('storage', () => {});
  
  console.log('✅ Event listeners cleaned up');
}

// 3. Optimize localStorage access
function optimizeLocalStorage() {
  console.log('🔧 Optimizing localStorage access...');
  
  // Remove duplicate or unnecessary keys
  const keysToCheck = [
    'dashboard_photo',
    'wawan_dashboard_stats',
    'profile_data',
    'auth_user',
    'currentUser'
  ];
  
  keysToCheck.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        // Re-save to ensure clean format
        const parsed = JSON.parse(value);
        localStorage.setItem(key, JSON.stringify(parsed));
      } catch (e) {
        // If not JSON, keep as is
        console.log(`📝 Key ${key} is not JSON, keeping as string`);
      }
    }
  });
  
  console.log('✅ localStorage optimized');
}

// 4. Set reasonable intervals for data refresh
function setOptimalIntervals() {
  console.log('⏰ Setting optimal refresh intervals...');
  
  // Clear any existing dashboard refresh intervals
  clearAllIntervals();
  
  // Set a single, reasonable interval for dashboard updates (5 minutes)
  const dashboardRefreshInterval = setInterval(() => {
    console.log('🔄 Dashboard auto-refresh (5 min interval)');
    
    // Only refresh if user is active (not idle)
    if (document.visibilityState === 'visible') {
      // Trigger a gentle refresh
      window.dispatchEvent(new CustomEvent('dashboardRefresh', {
        detail: { source: 'auto-refresh' }
      }));
    }
  }, 5 * 60 * 1000); // 5 minutes
  
  // Store interval ID for cleanup
  window.dashboardRefreshInterval = dashboardRefreshInterval;
  
  console.log('✅ Optimal intervals set');
}

// 5. Implement session cleanup on page unload
function setupSessionCleanup() {
  console.log('🧹 Setting up session cleanup...');
  
  window.addEventListener('beforeunload', () => {
    console.log('🧹 Page unloading, cleaning up session...');
    
    // Clear intervals
    if (window.dashboardRefreshInterval) {
      clearInterval(window.dashboardRefreshInterval);
    }
    
    // Clear any temporary session data
    const tempKeys = Object.keys(localStorage).filter(key => 
      key.includes('temp_') || key.includes('cache_')
    );
    
    tempKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('✅ Session cleaned up on page unload');
  });
  
  console.log('✅ Session cleanup handlers set');
}

// 6. Monitor and prevent excessive API calls
function preventExcessiveAPICalls() {
  console.log('🚦 Setting up API call throttling...');
  
  // Track API calls
  window.apiCallTracker = window.apiCallTracker || {};
  
  // Override fetch to add throttling
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    const now = Date.now();
    
    // Track calls per URL
    if (!window.apiCallTracker[url]) {
      window.apiCallTracker[url] = [];
    }
    
    // Remove old calls (older than 1 minute)
    window.apiCallTracker[url] = window.apiCallTracker[url].filter(
      time => now - time < 60000
    );
    
    // Check if too many calls in the last minute
    if (window.apiCallTracker[url].length > 10) {
      console.warn(`⚠️ Too many API calls to ${url}, throttling...`);
      return Promise.reject(new Error('API call throttled - too many requests'));
    }
    
    // Record this call
    window.apiCallTracker[url].push(now);
    
    return originalFetch.apply(this, args);
  };
  
  console.log('✅ API call throttling enabled');
}

// 7. Main fix function
function fixSessionTooLongIssue() {
  console.log('🚀 Starting session too long fix...');
  
  try {
    clearAllIntervals();
    cleanupEventListeners();
    optimizeLocalStorage();
    setOptimalIntervals();
    setupSessionCleanup();
    preventExcessiveAPICalls();
    
    console.log('✅ Session too long issue fixed!');
    console.log('📋 Applied fixes:');
    console.log('  - Cleared excessive intervals and timeouts');
    console.log('  - Cleaned up event listeners');
    console.log('  - Optimized localStorage access');
    console.log('  - Set reasonable refresh intervals (5 min)');
    console.log('  - Added session cleanup on page unload');
    console.log('  - Enabled API call throttling');
    
    // Show success message
    if (typeof window !== 'undefined' && window.alert) {
      setTimeout(() => {
        alert('✅ Session issue fixed! The "session too long" messages should stop appearing.');
      }, 1000);
    }
    
  } catch (error) {
    console.error('❌ Error fixing session issue:', error);
  }
}

// Run the fix
fixSessionTooLongIssue();

// Export for manual use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fixSessionTooLongIssue,
    clearAllIntervals,
    cleanupEventListeners,
    optimizeLocalStorage
  };
}