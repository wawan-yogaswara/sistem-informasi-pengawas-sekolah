#!/usr/bin/env node

/**
 * Fix Foto Reports Enhanced
 * Script untuk memperbaiki masalah foto yang tidak muncul di halaman laporan
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🖼️ FIX FOTO REPORTS ENHANCED');
console.log('============================');

function fixPhotoHandling() {
    const reportsPath = path.join(__dirname, 'client/src/pages/reports.tsx');
    
    if (!fs.existsSync(reportsPath)) {
        console.log('❌ reports.tsx not found');
        return false;
    }
    
    try {
        let content = fs.readFileSync(reportsPath, 'utf8');
        
        // Enhanced photo component with better error handling
        const enhancedPhotoComponent = `
        // Enhanced Photo Component with Multi-Path Fallback
        const PhotoComponent = ({ photo, alt, activityTitle }: { photo: string, alt: string, activityTitle: string }) => {
          const [currentSrc, setCurrentSrc] = useState(photo.startsWith('data:') ? photo : \`http://localhost:5000/uploads/\${photo}\`);
          const [hasError, setHasError] = useState(false);
          const [loadAttempt, setLoadAttempt] = useState(0);
          
          const handleError = () => {
            console.log(\`❌ Photo load error (attempt \${loadAttempt + 1}):\`, photo);
            console.log('🌐 Browser:', navigator.userAgent.includes('Opera') ? 'Opera' : 
                                     navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                                     navigator.userAgent.includes('Edge') ? 'Edge' : 'Other');
            
            const paths = [
              \`http://localhost:5000/uploads/\${photo}\`,
              \`http://localhost:3000/uploads/\${photo}\`,
              \`/uploads/\${photo}\`,
              \`./uploads/\${photo}\`
            ];
            
            if (loadAttempt < paths.length - 1) {
              const nextAttempt = loadAttempt + 1;
              console.log(\`🔄 Trying path \${nextAttempt + 1}: \${paths[nextAttempt]}\`);
              setLoadAttempt(nextAttempt);
              setCurrentSrc(paths[nextAttempt]);
            } else {
              console.log('❌ All paths failed for:', photo);
              setHasError(true);
            }
          };
          
          const handleLoad = () => {
            console.log('✅ Photo loaded successfully:', photo.substring(0, 50) + '...');
            setHasError(false);
          };
          
          if (hasError) {
            return (
              <div className="w-full h-48 bg-red-50 border-2 border-red-200 rounded-md flex items-center justify-center text-red-600 text-sm">
                <div className="text-center p-4">
                  <div className="text-3xl mb-2">📷</div>
                  <div className="font-medium">Foto tidak dapat dimuat</div>
                  <div className="text-xs mt-2 text-red-500">File: {photo}</div>
                  <div className="text-xs text-red-400">
                    Browser: {navigator.userAgent.includes('Opera') ? 'Opera' : 
                             navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                             navigator.userAgent.includes('Edge') ? 'Edge' : 'Other'}
                  </div>
                  <button 
                    onClick={() => {
                      setHasError(false);
                      setLoadAttempt(0);
                      setCurrentSrc(photo.startsWith('data:') ? photo : \`http://localhost:5000/uploads/\${photo}\`);
                    }}
                    className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    🔄 Coba Lagi
                  </button>
                </div>
              </div>
            );
          }
          
          return (
            <img 
              src={currentSrc}
              alt={alt}
              className="w-full h-48 object-cover rounded-md border"
              onLoad={handleLoad}
              onError={handleError}
            />
          );
        };`;
        
        // Add the component after imports
        const importSection = content.substring(0, content.indexOf('export default function ReportsPage()'));
        const restOfContent = content.substring(content.indexOf('export default function ReportsPage()'));
        
        // Replace old img tags with PhotoComponent
        let updatedContent = restOfContent.replace(
          /<img\s+src=\{activity\.photo1\.startsWith\('data:'\)[^}]+\}[^>]+>/g,
          '<PhotoComponent photo={activity.photo1} alt="Foto 1" activityTitle={activity.title} />'
        );
        
        updatedContent = updatedContent.replace(
          /<img\s+src=\{activity\.photo2\.startsWith\('data:'\)[^}]+\}[^>]+>/g,
          '<PhotoComponent photo={activity.photo2} alt="Foto 2" activityTitle={activity.title} />'
        );
        
        // Combine everything
        const finalContent = importSection + enhancedPhotoComponent + '\n\n' + updatedContent;
        
        fs.writeFileSync(reportsPath, finalContent);
        console.log('✅ Enhanced photo handling added to reports.tsx');
        return true;
        
    } catch (error) {
        console.log('❌ Error fixing photo handling:', error.message);
        return false;
    }
}

// Alternative: Create a simpler fix by just adding debug info
function addDebugInfo() {
    const reportsPath = path.join(__dirname, 'client/src/pages/reports.tsx');
    
    try {
        let content = fs.readFileSync(reportsPath, 'utf8');
        
        // Add debug logging at the start of useEffect
        const debugCode = `
        // Debug: Log browser and data info
        console.log('🌐 Browser Info:', {
          browser: navigator.userAgent.includes('Opera') ? 'Opera' : 
                   navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                   navigator.userAgent.includes('Edge') ? 'Edge' : 'Other',
          userAgent: navigator.userAgent,
          localStorage: typeof(Storage) !== "undefined",
          currentURL: window.location.href
        });`;
        
        // Add debug code after the first console.log in useEffect
        content = content.replace(
          "console.log('🔍 Loading activities from localStorage...');",
          "console.log('🔍 Loading activities from localStorage...');" + debugCode
        );
        
        // Add photo debug info
        const photoDebugCode = `
        // Debug: Log photo info for each activity
        activities.forEach((activity, index) => {
          if (activity.photo1 || activity.photo2) {
            console.log(\`📸 Activity \${index + 1} (\${activity.type}): \${activity.title}\`, {
              photo1: activity.photo1 ? (activity.photo1.startsWith('data:') ? 'base64' : activity.photo1) : null,
              photo2: activity.photo2 ? (activity.photo2.startsWith('data:') ? 'base64' : activity.photo2) : null,
              browser: navigator.userAgent.includes('Opera') ? 'Opera' : 
                       navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                       navigator.userAgent.includes('Edge') ? 'Edge' : 'Other'
            });
          }
        });`;
        
        // Add photo debug after activities are processed
        content = content.replace(
          "console.log(`📊 Total activities loaded: ${activities.length}`);",
          "console.log(`📊 Total activities loaded: ${activities.length}`);" + photoDebugCode
        );
        
        fs.writeFileSync(reportsPath, content);
        console.log('✅ Debug info added to reports.tsx');
        return true;
        
    } catch (error) {
        console.log('❌ Error adding debug info:', error.message);
        return false;
    }
}

// Main execution
console.log('1. Adding debug info...');
const debugResult = addDebugInfo();

console.log('\n📊 RESULTS:');
console.log(`Debug info: ${debugResult ? '✅ SUCCESS' : '❌ FAILED'}`);

console.log('\n🎯 NEXT STEPS:');
console.log('1. Buka EMERGENCY_FIX_FOTO_BROWSER_FINAL.html di setiap browser');
console.log('2. Bandingkan hasil di Chrome, Edge, dan Opera');
console.log('3. Check console browser untuk debug info foto');
console.log('4. Jika Opera menunjukkan data nol, gunakan tombol "Sync dari Chrome"');
console.log('5. Test server dengan tombol "Test Server"');

console.log('\n🔧 TROUBLESHOOTING:');
console.log('- Opera data nol: Clear cache, sync localStorage dari Chrome');
console.log('- Foto tidak muncul: Check server running di port 5000/3000');
console.log('- Error loading: Check uploads directory dan file permissions');