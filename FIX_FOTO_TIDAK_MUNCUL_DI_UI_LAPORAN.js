// FIX FOTO TIDAK MUNCUL DI UI LAPORAN
// Copy paste ke browser console di halaman Laporan

console.log('🖼️ FIX: Foto tidak muncul di UI Laporan');

const fixFotoTidakMunculDiUI = () => {
  console.log('🔧 Fixing foto display di UI...');
  
  // 1. Force refresh semua gambar yang error
  const allImages = document.querySelectorAll('img');
  console.log(`🖼️ Found ${allImages.length} images on page`);
  
  allImages.forEach((img, index) => {
    console.log(`🖼️ Image ${index + 1}:`, {
      src: img.src ? (img.src.startsWith('data:') ? 'base64' : img.src) : 'NO SRC',
      alt: img.alt,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    });
    
    // Force reload gambar yang gagal load
    if (!img.complete || img.naturalWidth === 0) {
      console.log(`🔄 Reloading image ${index + 1}`);
      const originalSrc = img.src;
      img.src = '';
      setTimeout(() => {
        img.src = originalSrc;
      }, 100);
    }
  });
  
  // 2. Check untuk gambar yang hidden atau tidak visible
  const hiddenImages = document.querySelectorAll('img[style*="display: none"], img[style*="visibility: hidden"]');
  console.log(`👻 Found ${hiddenImages.length} hidden images`);
  
  hiddenImages.forEach((img, index) => {
    console.log(`👻 Hidden image ${index + 1}:`, img.src);
    img.style.display = 'block';
    img.style.visibility = 'visible';
  });
  
  // 3. Force re-render foto containers
  const photoContainers = document.querySelectorAll('[class*="photo"], [class*="foto"], [class*="image"]');
  console.log(`📦 Found ${photoContainers.length} photo containers`);
  
  photoContainers.forEach((container, index) => {
    console.log(`📦 Container ${index + 1}:`, container.className);
    
    // Force re-render
    const display = container.style.display;
    container.style.display = 'none';
    setTimeout(() => {
      container.style.display = display || 'block';
    }, 50);
  });
  
  // 4. Check untuk error placeholders dan replace dengan foto asli
  const errorDivs = document.querySelectorAll('div[class*="error"], div[class*="placeholder"]');
  console.log(`❌ Found ${errorDivs.length} error placeholders`);
  
  errorDivs.forEach((div, index) => {
    console.log(`❌ Error placeholder ${index + 1}:`, div.innerHTML);
    
    // Cari data foto dari parent element
    const parentCard = div.closest('[class*="card"], [class*="activity"]');
    if (parentCard) {
      const activityData = parentCard.getAttribute('data-activity') || parentCard.getAttribute('data-photos');
      if (activityData) {
        console.log(`🔄 Trying to restore photo for placeholder ${index + 1}`);
        // Restore foto jika ada data
        try {
          const data = JSON.parse(activityData);
          if (data.photo1 || data.photo2) {
            div.innerHTML = `<img src="${data.photo1 || data.photo2}" alt="Restored photo" style="width: 100%; height: 100%; object-fit: cover;" />`;
          }
        } catch (e) {
          console.log('Could not parse activity data');
        }
      }
    }
  });
  
  // 5. Force CSS refresh untuk foto
  const style = document.createElement('style');
  style.textContent = `
    img {
      max-width: 100% !important;
      height: auto !important;
      display: block !important;
      visibility: visible !important;
    }
    
    .photo-item img,
    [class*="photo"] img,
    [class*="foto"] img {
      opacity: 1 !important;
      transform: none !important;
    }
    
    /* Force show hidden photo containers */
    .grid > div:has(img),
    .photos-grid > div,
    [class*="photo-container"] {
      display: block !important;
      visibility: visible !important;
    }
  `;
  document.head.appendChild(style);
  
  // 6. Trigger resize event untuk force re-layout
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
    console.log('🔄 Triggered resize event');
  }, 200);
  
  // 7. Check hasil setelah fix
  setTimeout(() => {
    const visibleImages = document.querySelectorAll('img:not([style*="display: none"]):not([style*="visibility: hidden"])');
    const loadedImages = Array.from(visibleImages).filter(img => img.complete && img.naturalWidth > 0);
    
    console.log('📊 HASIL FIX:');
    console.log(`📊 Total images: ${allImages.length}`);
    console.log(`📊 Visible images: ${visibleImages.length}`);
    console.log(`📊 Loaded images: ${loadedImages.length}`);
    
    if (loadedImages.length < visibleImages.length) {
      console.log('⚠️ Masih ada foto yang tidak load, coba refresh halaman');
    } else {
      console.log('✅ Semua foto berhasil dimuat!');
    }
  }, 1000);
};

// Jalankan fix
fixFotoTidakMunculDiUI();

// Auto-retry setiap 3 detik untuk foto yang masih gagal
let retryCount = 0;
const retryInterval = setInterval(() => {
  retryCount++;
  console.log(`🔄 Auto-retry ${retryCount}/3...`);
  
  const failedImages = document.querySelectorAll('img:not([complete="true"])');
  if (failedImages.length > 0 && retryCount < 3) {
    fixFotoTidakMunculDiUI();
  } else {
    clearInterval(retryInterval);
    console.log('🏁 Auto-retry selesai');
  }
}, 3000);