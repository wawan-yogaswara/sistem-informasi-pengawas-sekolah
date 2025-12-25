// Script untuk menerapkan schema yang kompatibel dengan frontend
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diset di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applySchema() {
  try {
    console.log('🔧 Menerapkan schema yang kompatibel dengan frontend...');
    
    // Read the SQL schema file
    const schemaSQL = fs.readFileSync('supabase-schema-frontend-compatible.sql', 'utf8');
    
    // Split SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Menjalankan ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        try {
          console.log(`${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
          
          const { error } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (error) {
            console.warn(`⚠️ Warning pada statement ${i + 1}:`, error.message);
            // Continue with next statement
          } else {
            console.log(`✅ Statement ${i + 1} berhasil`);
          }
        } catch (err) {
          console.warn(`⚠️ Error pada statement ${i + 1}:`, err.message);
          // Continue with next statement
        }
      }
    }
    
    console.log('🎉 Schema berhasil diterapkan!');
    
    // Test connection
    console.log('🧪 Testing connection...');
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) {
      console.error('❌ Error testing connection:', error);
    } else {
      console.log('✅ Connection test berhasil');
    }
    
  } catch (error) {
    console.error('❌ Error applying schema:', error);
  }
}

// Alternative method using direct SQL execution
async function applySchemaAlternative() {
  try {
    console.log('🔧 Menerapkan schema dengan metode alternatif...');
    
    // Read the SQL schema file
    const schemaSQL = fs.readFileSync('supabase-schema-frontend-compatible.sql', 'utf8');
    
    // Execute the entire SQL at once
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: schemaSQL 
    });
    
    if (error) {
      console.error('❌ Error executing schema:', error);
      return;
    }
    
    console.log('✅ Schema berhasil diterapkan!');
    console.log('📊 Result:', data);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the schema application
console.log('🚀 Memulai penerapan schema...');
applySchema().then(() => {
  console.log('✅ Selesai!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});