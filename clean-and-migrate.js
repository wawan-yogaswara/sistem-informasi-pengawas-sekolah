/**
 * Script untuk membersihkan data lama dan migrate ulang
 * Menghapus semua data existing lalu migrate fresh
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Warna untuk console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Supabase configuration dari environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Map untuk konversi ID dari timestamp ke UUID
const idMap = new Map();

function getOrCreateUUID(oldId) {
  if (!oldId) return uuidv4();
  if (!idMap.has(oldId)) {
    idMap.set(oldId, uuidv4());
  }
  return idMap.get(oldId);
}

async function cleanDatabase(supabase) {
  log('\n🧹 Cleaning existing data...', 'yellow');
  
  try {
    // Delete in reverse order (respecting foreign keys)
    await supabase.from('additional_tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    log('   ✅ Cleaned additional_tasks', 'green');
    
    await supabase.from('supervisions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    log('   ✅ Cleaned supervisions', 'green');
    
    await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    log('   ✅ Cleaned tasks', 'green');
    
    await supabase.from('schools').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    log('   ✅ Cleaned schools', 'green');
    
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    log('   ✅ Cleaned users', 'green');
    
    log('✅ Database cleaned successfully', 'green');
  } catch (error) {
    log(`⚠️  Warning during cleanup: ${error.message}`, 'yellow');
  }
}

async function migrateData() {
  log('\n🚀 Starting Clean Migration: Local Database → Supabase\n', 'cyan');

  try {
    // Validasi environment variables
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      log('❌ Missing Supabase configuration!', 'red');
      log('   Please check SUPABASE_URL and SUPABASE_ANON_KEY in .env file', 'yellow');
      process.exit(1);
    }

    log(`🔗 Supabase URL: ${SUPABASE_URL}`, 'blue');

    // 1. Load local database
    log('\n📂 Loading local database...', 'blue');
    const localDbPath = path.join(__dirname, 'local-database.json');
    
    if (!fs.existsSync(localDbPath)) {
      log('❌ local-database.json not found!', 'red');
      log('   Please make sure the file exists at: ' + localDbPath, 'yellow');
      process.exit(1);
    }

    const localData = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    log('✅ Local database loaded successfully', 'green');
    log(`   Users: ${localData.users?.length || 0}`, 'cyan');
    log(`   Schools: ${localData.schools?.length || 0}`, 'cyan');
    log(`   Supervisions: ${localData.supervisions?.length || 0}`, 'cyan');
    log(`   Tasks: ${localData.tasks?.length || 0}`, 'cyan');
    log(`   Additional Tasks: ${localData.additionalTasks?.length || 0}`, 'cyan');

    // 2. Initialize Supabase client
    log('\n🔌 Connecting to Supabase...', 'blue');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError) {
      log('❌ Failed to connect to Supabase!', 'red');
      log(`   Error: ${testError.message}`, 'red');
      process.exit(1);
    }
    
    log('✅ Connected to Supabase successfully', 'green');

    // 3. Clean existing data
    await cleanDatabase(supabase);

    // 4. Migrate Users FIRST (karena ada foreign key dependencies)
    if (localData.users && localData.users.length > 0) {
      log('\n👥 Migrating users...', 'blue');
      
      for (const user of localData.users) {
        try {
          const newUserId = getOrCreateUUID(user.id);
          
          const { error } = await supabase
            .from('users')
            .insert({
              id: newUserId,
              username: user.username,
              password: user.password || '$2b$10$default',
              name: user.fullName || user.name || user.username,
              role: user.role === 'admin' ? 'admin' : 'user',
              nip: user.nip || null,
              position: user.position || user.rank || null,
              photo: user.photoUrl || null,
              created_at: user.createdAt || new Date().toISOString()
            });

          if (error) {
            log(`   ⚠️  Error migrating user ${user.username}: ${error.message}`, 'yellow');
          } else {
            log(`   ✅ Migrated: ${user.username} (${user.role || 'user'})`, 'green');
          }
        } catch (err) {
          log(`   ❌ Failed to migrate user ${user.username}: ${err.message}`, 'red');
        }
      }
      log(`✅ Users migration completed: ${localData.users.length} users`, 'green');
    }

    // 5. Migrate Schools
    if (localData.schools && localData.schools.length > 0) {
      log('\n🏫 Migrating schools...', 'blue');
      
      for (const school of localData.schools) {
        try {
          const newSchoolId = getOrCreateUUID(school.id);
          
          const { error } = await supabase
            .from('schools')
            .insert({
              id: newSchoolId,
              name: school.name,
              address: school.address || null,
              principal: school.principal || null,
              phone: school.phone || null,
              email: school.email || null,
              created_at: school.createdAt || new Date().toISOString()
            });

          if (error) {
            log(`   ⚠️  Error migrating school ${school.name}: ${error.message}`, 'yellow');
          } else {
            log(`   ✅ Migrated: ${school.name}`, 'green');
          }
        } catch (err) {
          log(`   ❌ Failed to migrate school ${school.name}: ${err.message}`, 'red');
        }
      }
      log(`✅ Schools migration completed: ${localData.schools.length} schools`, 'green');
    }

    // 6. Migrate Tasks
    if (localData.tasks && localData.tasks.length > 0) {
      log('\n📝 Migrating tasks...', 'blue');
      
      for (const task of localData.tasks) {
        try {
          const newTaskId = getOrCreateUUID(task.id);
          const userId = getOrCreateUUID(task.userId);
          
          const { error } = await supabase
            .from('tasks')
            .insert({
              id: newTaskId,
              user_id: userId,
              title: task.title,
              description: task.description || null,
              date: task.date || new Date().toISOString().split('T')[0],
              completed: task.completed || false,
              photo: task.photo || null,
              created_at: task.createdAt || new Date().toISOString()
            });

          if (error) {
            log(`   ⚠️  Error migrating task: ${error.message}`, 'yellow');
          } else {
            log(`   ✅ Migrated task: ${task.title}`, 'green');
          }
        } catch (err) {
          log(`   ❌ Failed to migrate task: ${err.message}`, 'red');
        }
      }
      log(`✅ Tasks migration completed: ${localData.tasks.length} tasks`, 'green');
    }

    // 7. Migrate Supervisions
    if (localData.supervisions && localData.supervisions.length > 0) {
      log('\n📋 Migrating supervisions...', 'blue');
      
      for (const supervision of localData.supervisions) {
        try {
          const newSupervisionId = getOrCreateUUID(supervision.id);
          const userId = getOrCreateUUID(supervision.userId);
          const schoolId = getOrCreateUUID(supervision.schoolId);
          
          const { error } = await supabase
            .from('supervisions')
            .insert({
              id: newSupervisionId,
              user_id: userId,
              school_id: schoolId,
              type: supervision.type || 'academic',
              date: supervision.date || new Date().toISOString().split('T')[0],
              findings: supervision.findings || supervision.notes || null,
              recommendations: supervision.recommendations || null,
              photo: supervision.photo || null,
              created_at: supervision.createdAt || new Date().toISOString()
            });

          if (error) {
            log(`   ⚠️  Error migrating supervision: ${error.message}`, 'yellow');
          } else {
            log(`   ✅ Migrated supervision: ${supervision.id}`, 'green');
          }
        } catch (err) {
          log(`   ❌ Failed to migrate supervision: ${err.message}`, 'red');
        }
      }
      log(`✅ Supervisions migration completed: ${localData.supervisions.length} records`, 'green');
    }

    // 8. Migrate Additional Tasks
    if (localData.additionalTasks && localData.additionalTasks.length > 0) {
      log('\n➕ Migrating additional tasks...', 'blue');
      
      for (const task of localData.additionalTasks) {
        try {
          const newTaskId = getOrCreateUUID(task.id);
          const userId = getOrCreateUUID(task.userId);
          const schoolId = task.schoolId ? getOrCreateUUID(task.schoolId) : null;
          
          const { error } = await supabase
            .from('additional_tasks')
            .insert({
              id: newTaskId,
              user_id: userId,
              school_id: schoolId,
              title: task.title || task.name,
              description: task.description || null,
              date: task.date || new Date().toISOString().split('T')[0],
              status: task.status || 'pending',
              photo: task.photo || null,
              created_at: task.createdAt || new Date().toISOString()
            });

          if (error) {
            log(`   ⚠️  Error migrating additional task: ${error.message}`, 'yellow');
          } else {
            log(`   ✅ Migrated additional task: ${task.title || task.name}`, 'green');
          }
        } catch (err) {
          log(`   ❌ Failed to migrate additional task: ${err.message}`, 'red');
        }
      }
      log(`✅ Additional tasks migration completed: ${localData.additionalTasks.length} tasks`, 'green');
    }

    // 9. Summary
    log('\n' + '='.repeat(60), 'cyan');
    log('🎉 CLEAN MIGRATION COMPLETED SUCCESSFULLY!', 'green');
    log('='.repeat(60), 'cyan');
    log('\n📊 Migration Summary:', 'cyan');
    log(`   ✅ Users: ${localData.users?.length || 0}`, 'green');
    log(`   ✅ Schools: ${localData.schools?.length || 0}`, 'green');
    log(`   ✅ Tasks: ${localData.tasks?.length || 0}`, 'green');
    log(`   ✅ Supervisions: ${localData.supervisions?.length || 0}`, 'green');
    log(`   ✅ Additional Tasks: ${localData.additionalTasks?.length || 0}`, 'green');
    
    log('\n🔄 ID Mapping:', 'cyan');
    log(`   Generated ${idMap.size} UUID mappings`, 'blue');
    
    log('\n🚀 Next Steps:', 'cyan');
    log('   1. ✅ Data berhasil dimigrate ke Supabase', 'green');
    log('   2. 🔍 Verify data di Supabase dashboard', 'blue');
    log('   3. 🧪 Test aplikasi dengan database Supabase', 'blue');
    log('   4. 🚀 Deploy aplikasi ke production', 'blue');
    log('\n');

    // 10. Save ID mapping for reference
    const mappingFile = 'id-mapping-clean.json';
    const mappingData = Object.fromEntries(idMap);
    fs.writeFileSync(mappingFile, JSON.stringify(mappingData, null, 2));
    log(`💾 ID mapping saved to: ${mappingFile}`, 'cyan');

  } catch (error) {
    log('\n❌ Migration failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    log('\nStack trace:', 'yellow');
    console.error(error);
    process.exit(1);
  }
}

// Run migration
migrateData();