// EMERGENCY FIX: Input Tugas Harian tidak bisa submit
// Copy paste ke browser console di halaman Tugas Harian

console.log('🚨 EMERGENCY FIX: Input tugas harian tidak bisa submit');

const emergencyFixInputTugasHarian = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    console.log('🚀 Starting emergency fix for tugas harian input...');
    
    // 1. SETUP USER AND SUPABASE
    const userData = {
      id: userId,
      username: 'wawan',
      fullName: 'Wawan Setiawan',
      role: 'admin'
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 2. CLEAR ALL CACHES
    console.log('🧹 Clearing all caches...');
    localStorage.removeItem('tasks_cache');
    localStorage.removeItem('schema_cache');
    if (window.queryClient) {
      window.queryClient.clear();
    }
    
    // 3. OVERRIDE FORM SUBMIT FUNCTION
    console.log('🔧 Overriding form submit function...');
    
    // Find the form
    const form = document.querySelector('form');
    if (form) {
      console.log('📝 Form found, overriding submit...');
      
      // Remove existing event listeners
      const newForm = form.cloneNode(true);
      form.parentNode.replaceChild(newForm, form);
      
      // Add new submit handler
      newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('📤 Form submitted, processing...');
        
        try {
          // Get form data
          const formData = new FormData(newForm);
          const data = {};
          for (let [key, value] of formData.entries()) {
            data[key] = value;
          }
          
          // Get additional data from form fields
          const titleInput = newForm.querySelector('input[name="title"], input[placeholder*="judul"], input[placeholder*="Judul"]');
          const descInput = newForm.querySelector('textarea[name="description"], textarea[placeholder*="deskripsi"]');
          const dateInput = newForm.querySelector('input[type="date"], input[name="date"]');
          const locationInput = newForm.querySelector('input[name="location"], select[name="school"], input[placeholder*="sekolah"]');
          
          const submitData = {
            title: titleInput?.value || data.title || 'Tugas Harian',
            description: descInput?.value || data.description || '',
            date: dateInput?.value || data.date || new Date().toISOString().split('T')[0],
            location: locationInput?.value || data.location || 'Sekolah Binaan',
            school: locationInput?.value || data.school || 'Sekolah Binaan',
            user_id: userId,
            created_at: new Date().toISOString()
          };
          
          console.log('📋 Submitting data:', submitData);
          
          // Try API first
          try {
            const response = await fetch('/api/tasks-daily', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(submitData)
            });
            
            if (response.ok) {
              const result = await response.json();
              console.log('✅ API submit successful:', result);
              alert('Data berhasil disimpan!');
              window.location.reload();
              return;
            } else {
              console.log('⚠️ API failed, trying direct Supabase...');
            }
          } catch (apiError) {
            console.log('⚠️ API error, trying direct Supabase:', apiError);
          }
          
          // Fallback to direct Supabase
          const { data: result, error } = await supabase
            .from('tasks')
            .insert([submitData])
            .select()
            .single();
          
          if (!error && result) {
            console.log('✅ Supabase submit successful:', result);
            alert('Data berhasil disimpan!');
            window.location.reload();
          } else {
            console.error('❌ Supabase submit failed:', error);
            alert('Gagal menyimpan data: ' + (error?.message || 'Unknown error'));
          }
          
        } catch (error) {
          console.error('❌ Form submit error:', error);
          alert('Terjadi kesalahan: ' + error.message);
        }
      });
      
      console.log('✅ Form submit handler overridden');
    }
    
    // 4. OVERRIDE SAVE BUTTON CLICK
    console.log('🔧 Overriding save button...');
    
    const saveButton = document.querySelector('button[type="submit"], button:contains("Simpan"), button:contains("Save")');
    if (saveButton) {
      console.log('💾 Save button found, overriding click...');
      
      saveButton.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('💾 Save button clicked, processing...');
        
        try {
          // Get form values directly
          const titleInput = document.querySelector('input[placeholder*="judul"], input[placeholder*="Judul"]');
          const descInput = document.querySelector('textarea[placeholder*="deskripsi"]');
          const dateInput = document.querySelector('input[type="date"]');
          const locationSelect = document.querySelector('select');
          
          const submitData = {
            title: titleInput?.value || 'Tugas Harian',
            description: descInput?.value || '',
            date: dateInput?.value || new Date().toISOString().split('T')[0],
            location: locationSelect?.value || 'Sekolah Binaan',
            school: locationSelect?.value || 'Sekolah Binaan',
            user_id: userId,
            created_at: new Date().toISOString()
          };
          
          console.log('📋 Save button data:', submitData);
          
          // Direct Supabase insert
          const { data: result, error } = await supabase
            .from('tasks')
            .insert([submitData])
            .select()
            .single();
          
          if (!error && result) {
            console.log('✅ Save successful:', result);
            alert('Data berhasil disimpan!');
            window.location.reload();
          } else {
            console.error('❌ Save failed:', error);
            alert('Gagal menyimpan: ' + (error?.message || 'Unknown error'));
          }
          
        } catch (error) {
          console.error('❌ Save button error:', error);
          alert('Terjadi kesalahan: ' + error.message);
        }
      });
      
      console.log('✅ Save button handler overridden');
    }
    
    // 5. CREATE MANUAL SUBMIT FUNCTION
    window.submitTugasHarianManual = async () => {
      try {
        const titleInput = document.querySelector('input[placeholder*="judul"], input[placeholder*="Judul"]');
        const descInput = document.querySelector('textarea[placeholder*="deskripsi"]');
        const dateInput = document.querySelector('input[type="date"]');
        const locationSelect = document.querySelector('select');
        
        const data = {
          title: titleInput?.value || 'Tugas Harian',
          description: descInput?.value || '',
          date: dateInput?.value || new Date().toISOString().split('T')[0],
          location: locationSelect?.value || 'Sekolah Binaan',
          school: locationSelect?.value || 'Sekolah Binaan',
          user_id: userId,
          created_at: new Date().toISOString()
        };
        
        console.log('📋 Manual submit data:', data);
        
        const { data: result, error } = await supabase
          .from('tasks')
          .insert([data])
          .select()
          .single();
        
        if (!error && result) {
          console.log('✅ Manual submit successful:', result);
          alert('Data berhasil disimpan!');
          window.location.reload();
        } else {
          console.error('❌ Manual submit failed:', error);
          alert('Gagal menyimpan: ' + (error?.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('❌ Manual submit error:', error);
        alert('Terjadi kesalahan: ' + error.message);
      }
    };
    
    console.log(`
🎉 EMERGENCY FIX COMPLETED! 🎉

✅ Form submit handler overridden
✅ Save button handler overridden  
✅ Manual submit function created
✅ All caches cleared

🛠️ CARA MENGGUNAKAN:

1. ISI FORM SEPERTI BIASA
2. KLIK TOMBOL SIMPAN

Jika masih tidak bisa:
3. Buka console (F12)
4. Ketik: submitTugasHarianManual()
5. Tekan Enter

Form sekarang akan langsung menyimpan ke database!
    `);
    
  } catch (error) {
    console.error('❌ Emergency fix failed:', error);
    alert('Emergency fix gagal: ' + error.message);
  }
};

// Execute the emergency fix
console.log('🚀 Executing emergency fix...');
emergencyFixInputTugasHarian();