// CEK KONDISI SEKOLAH SEKARANG - Jalankan di console
// Copy paste ke console browser di halaman schools

console.log('🔍 MENGECEK KONDISI SEKOLAH SAAT INI...');
console.log('='.repeat(50));

// 1. Cek data di localStorage
console.log('1. 📦 DATA DI LOCALSTORAGE:');
const localSchools = localStorage.getItem('schools_data');
if (localSchools) {
    const schools = JSON.parse(localSchools);
    console.log(`✅ Ada ${schools.length} sekolah di localStorage:`);
    schools.forEach((school, i) => {
        console.log(`   ${i+1}. ${school.name} (ID: ${school.id})`);
    });
} else {
    console.log('❌ Tidak ada data sekolah di localStorage');
}

// 2. Cek koneksi Supabase
console.log('\n2. 🗄️ KONEKSI SUPABASE:');
const supabaseUrl = 'https://glhaliktsrcvnznbgxqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';

if (typeof window.supabase !== 'undefined') {
    console.log('✅ Supabase client tersedia');
    
    const client = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    // Test query
    client.from('schools').select('*').then(({ data, error }) => {
        if (error) {
            console.error('❌ Error query Supabase:', error.message);
        } else {
            console.log(`✅ Ada ${data?.length || 0} sekolah di Supabase:`);
            data?.forEach((school, i) => {
                console.log(`   ${i+1}. ${school.name} (ID: ${school.id})`);
            });
        }
    });
} else {
    console.log('❌ Supabase client tidak tersedia');
}

// 3. Cek user authentication
console.log('\n3. 👤 USER AUTHENTICATION:');
const user = localStorage.getItem('auth_user');
if (user) {
    const userData = JSON.parse(user);
    console.log('✅ User login:', userData.username);
    console.log('   User ID:', userData.id);
} else {
    console.log('❌ User tidak login');
}

// 4. Rekomendasi solusi
console.log('\n4. 💡 REKOMENDASI SOLUSI:');

setTimeout(() => {
    const hasLocalData = !!localStorage.getItem('schools_data');
    const hasSupabase = typeof window.supabase !== 'undefined';
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 REKOMENDASI BERDASARKAN KONDISI:');
    
    if (hasSupabase && hasLocalData) {
        console.log('📋 KONDISI: Ada Supabase + Ada localStorage');
        console.log('💡 SOLUSI: Pilih Pure Supabase (Opsi 1)');
        console.log('   - Hapus kompleksitas localStorage');
        console.log('   - Pakai Supabase sebagai single source of truth');
        console.log('   - Jalankan: implementasiPureSupabase()');
    } else if (hasSupabase && !hasLocalData) {
        console.log('📋 KONDISI: Ada Supabase + Tidak ada localStorage');
        console.log('💡 SOLUSI: Perfect! Langsung pakai Pure Supabase');
        console.log('   - Jalankan: implementasiPureSupabase()');
    } else if (!hasSupabase && hasLocalData) {
        console.log('📋 KONDISI: Tidak ada Supabase + Ada localStorage');
        console.log('💡 SOLUSI: Pakai Pure localStorage dulu');
        console.log('   - Jalankan: implementasiPureLocalStorage()');
    } else {
        console.log('📋 KONDISI: Tidak ada Supabase + Tidak ada localStorage');
        console.log('💡 SOLUSI: Setup dari awal');
        console.log('   - Jalankan: setupDariAwal()');
    }
}, 2000);

// 5. Function untuk implementasi Pure Supabase
window.implementasiPureSupabase = function() {
    console.log('🚀 IMPLEMENTASI PURE SUPABASE...');
    
    // Hapus localStorage untuk menghindari konflik
    localStorage.removeItem('schools_data');
    localStorage.removeItem('schools_data_backup');
    localStorage.removeItem('schools_data_timestamp');
    
    console.log('✅ localStorage dibersihkan');
    console.log('📝 Sekarang edit file schools.tsx:');
    console.log('');
    console.log('1. Import: import { supabase } from "@/lib/supabase";');
    console.log('2. Ganti useQuery dengan:');
    console.log(`
const { data: schools = [], isLoading, refetch } = useQuery({
  queryKey: ['schools'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
});`);
    
    console.log('3. Ganti handleAddSchool dengan:');
    console.log(`
const handleAddSchool = async () => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .insert([{
        name: newSchool.name,
        address: newSchool.address,
        phone: newSchool.contact,
        principal: newSchool.principalName,
        email: ''
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    refetch();
    toast({ title: "Berhasil", description: "Sekolah berhasil ditambahkan" });
    setNewSchool({ name: "", address: "", contact: "", principalName: "", principalNip: "" });
    setIsAddDialogOpen(false);
  } catch (error) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  }
};`);
    
    console.log('✅ Copy code di atas ke schools.tsx');
};

// 6. Function untuk implementasi Pure localStorage
window.implementasiPureLocalStorage = function() {
    console.log('🚀 IMPLEMENTASI PURE LOCALSTORAGE...');
    
    // Pastikan ada data sample
    const currentData = localStorage.getItem('schools_data');
    if (!currentData) {
        const sampleSchools = [
            {
                id: crypto.randomUUID(),
                name: 'SMKN 4 Garut',
                address: 'Jl. Pembangunan No. 123',
                contact: '0262-123456',
                principalName: 'Drs. Budi Santoso',
                principalNip: '196501011990031001',
                supervisions: 0,
                createdAt: new Date().toISOString()
            },
            {
                id: crypto.randomUUID(),
                name: 'SMKS Plus Sukaraja',
                address: 'Jl. Sukaraja No. 456',
                contact: '0262-654321',
                principalName: 'Dra. Siti Aminah',
                principalNip: '196702021991032002',
                supervisions: 0,
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('schools_data', JSON.stringify(sampleSchools));
        console.log('✅ Sample data ditambahkan');
    }
    
    console.log('📝 Edit schools.tsx dengan localStorage only');
    console.log('✅ Refresh halaman untuk melihat perubahan');
};

// 7. Function untuk setup dari awal
window.setupDariAwal = function() {
    console.log('🚀 SETUP DARI AWAL...');
    console.log('1. Cek koneksi internet');
    console.log('2. Cek kredensial Supabase');
    console.log('3. Login ulang jika perlu');
    console.log('4. Pilih implementasiPureSupabase() atau implementasiPureLocalStorage()');
};

console.log('\n✅ Analisis selesai! Tunggu rekomendasi...');