// DIAGNOSA TUGAS TAMBAHAN TIDAK MUNCUL - FINAL
// Data sudah masuk ke Supabase tapi tidak muncul di halaman

console.log('🔍 DIAGNOSA: Tugas Tambahan tidak muncul di halaman');

// ===========================
// 1. PERBANDINGAN QUERY FETCHING
// ===========================

console.log('\n📊 1. PERBANDINGAN QUERY FETCHING:');

const queryComparison = {
  'Tasks (✅ BEKERJA)': {
    query: `
    const { data: tasks = [], isLoading, refetch } = useQuery({
      queryKey: ['tasks'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });
        return data || [];
      }
    });`,
    filter: 'TIDAK ADA FILTER - mengambil SEMUA data',
    table: 'tasks'
  },
  
  'Supervisions (✅ BEKERJA)': {
    query: `
    const { data: supervisions = [], isLoading, refetch } = useQuery({
      queryKey: ['supervisions'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('supervisions')
          .select('*')
          .order('created_at', { ascending: false });
        return data || [];
      }
    });`,
    filter: 'TIDAK ADA FILTER - mengambil SEMUA data',
    table: 'supervisions'
  },
  
  'Additional Tasks (❌ BERMASALAH)': {
    query: `
    const { data: tasks = [], isLoading, refetch } = useQuery({
      queryKey: ['additional-tasks'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('additional_tasks')
          .select(\`
            *,
            schools (
              id,
              name
            )
          \`)
          .order('created_at', { ascending: false });
        return data || [];
      }
    });`,
    filter: 'TIDAK ADA FILTER - mengambil SEMUA data',
    table: 'additional_tasks'
  }
};

console.log('Query Comparison:', queryComparison);

// ===========================
// 2. KEMUNGKINAN MASALAH
// ===========================

console.log('\n🚨 2. KEMUNGKINAN MASALAH:');

const possibleIssues = [
  {
    issue: 'RLS (Row Level Security) Policy',
    description: 'Tabel additional_tasks mungkin punya RLS policy yang memblokir akses',
    solution: 'Cek RLS policy di Supabase dashboard'
  },
  {
    issue: 'Schema Mismatch',
    description: 'Join dengan tabel schools gagal karena foreign key tidak match',
    solution: 'Coba query tanpa join schools dulu'
  },
  {
    issue: 'User Context',
    description: 'Query membutuhkan user context tapi tidak ada',
    solution: 'Cek apakah ada auth requirement'
  },
  {
    issue: 'Cache Issue',
    description: 'React Query cache bermasalah',
    solution: 'Force refresh atau clear cache'
  }
];

possibleIssues.forEach((issue, index) => {
  console.log(`${index + 1}. ${issue.issue}:`);
  console.log(`   Problem: ${issue.description}`);
  console.log(`   Solution: ${issue.solution}`);
});

// ===========================
// 3. SCRIPT DIAGNOSA LANGSUNG
// ===========================

console.log('\n🔧 3. SCRIPT DIAGNOSA LANGSUNG:');

// Test 1: Query langsung tanpa join
console.log('TEST 1: Query additional_tasks tanpa join');
const testQuery1 = `
// Jalankan di Console Browser (F12)
const { createClient } = supabase;
const supabaseClient = createClient(
  'https://jbhallsrcvmzbqvqt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiaGFsbHNyY3ZtemJxdnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjI4NzEsImV4cCI6MjA1MDUzODg3MX0.Oa4AAOGLZJR_9jbae64_7fdb2b0b8369'
);

supabaseClient
  .from('additional_tasks')
  .select('*')
  .order('created_at', { ascending: false })
  .then(({ data, error }) => {
    console.log('✅ Additional Tasks (tanpa join):', data?.length || 0);
    console.log('Data:', data);
    if (error) console.error('❌ Error:', error);
  });
`;

console.log(testQuery1);

// Test 2: Query dengan join
console.log('\nTEST 2: Query additional_tasks dengan join schools');
const testQuery2 = `
supabaseClient
  .from('additional_tasks')
  .select(\`
    *,
    schools (
      id,
      name
    )
  \`)
  .order('created_at', { ascending: false })
  .then(({ data, error }) => {
    console.log('✅ Additional Tasks (dengan join):', data?.length || 0);
    console.log('Data:', data);
    if (error) console.error('❌ Error:', error);
  });
`;

console.log(testQuery2);

// Test 3: Cek RLS Policy
console.log('\nTEST 3: Cek RLS Policy');
const testQuery3 = `
// Cek apakah RLS enabled
supabaseClient
  .from('additional_tasks')
  .select('*', { count: 'exact' })
  .then(({ data, error, count }) => {
    console.log('✅ Total records:', count);
    console.log('✅ Accessible records:', data?.length || 0);
    if (error) console.error('❌ RLS Error:', error);
  });
`;

console.log(testQuery3);

// ===========================
// 4. SOLUSI BERDASARKAN HASIL TEST
// ===========================

console.log('\n💡 4. SOLUSI BERDASARKAN HASIL TEST:');

const solutions = {
  'Jika Test 1 gagal': {
    problem: 'RLS Policy atau permission issue',
    action: 'Disable RLS atau update policy di Supabase'
  },
  'Jika Test 1 berhasil, Test 2 gagal': {
    problem: 'Foreign key relationship bermasalah',
    action: 'Update query untuk tidak join dengan schools'
  },
  'Jika semua test berhasil': {
    problem: 'React Query cache atau component issue',
    action: 'Clear cache atau restart development server'
  }
};

Object.entries(solutions).forEach(([condition, solution]) => {
  console.log(`${condition}:`);
  console.log(`  Problem: ${solution.problem}`);
  console.log(`  Action: ${solution.action}`);
});

// ===========================
// 5. QUICK FIX SCRIPT
// ===========================

console.log('\n⚡ 5. QUICK FIX SCRIPT:');

const quickFix = `
// QUICK FIX: Update additional-tasks.tsx query
// Ganti query yang ada dengan ini:

const { data: tasks = [], isLoading, refetch } = useQuery({
  queryKey: ['additional-tasks'],
  queryFn: async () => {
    console.log('🔍 Fetching additional tasks from Supabase...');
    
    // SIMPLE: Query tanpa join dulu
    const { data, error } = await supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log('✅ Additional tasks loaded:', data?.length || 0);
    console.log('📋 Data preview:', data?.slice(0, 2));
    return data || [];
  },
  retry: 1,
  refetchOnWindowFocus: false,
});
`;

console.log(quickFix);

console.log('\n🎯 LANGKAH SELANJUTNYA:');
console.log('1. Jalankan TEST 1-3 di Console Browser');
console.log('2. Berdasarkan hasil, terapkan solusi yang sesuai');
console.log('3. Jika masih bermasalah, terapkan QUICK FIX');
console.log('4. Restart development server dan test lagi');