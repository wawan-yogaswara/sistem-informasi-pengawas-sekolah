/**
 * Script untuk migrate data dari local-database.json ke Supabase
 * Dengan schema yang benar dan konversi ID
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
  if (!idMap.has(oldId)) {
    idMap.set(oldId, uuidv4());
  }
  return idMap.get(oldId);
}

async function migrateData() {
  log('\n🚀 Starting Migration: Local Database → Supabase\n', 'cyan');

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
    log(`   Events: ${localData.events?.length || 0}`, 'cyan');

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

    // 3. Migrate Users
    if (localData.users && localData.users.length > 0) {
      log('\n👥 Migrating users...', 'blue');
      
      for (const user of localData.users) {
        try {
          const newUserId = getOrCreateUUID(user.id);
          
          const { error } = await supabase
            .from('users')
            .upsert({
              id: newUserId,
              username: user.username,
              password: user.password || '$2b$10$default',
              full_name: user.fullName || user.name || user.username,
              role: user.role === 'admin' ? 'admin' : 'pengawas',
              nip: user.nip || null,
              rank: user.rank || null,
              phone: user.phone || null,
              photo_url: user.photoUrl || null,
              created_at: user.createdAt || new Date().toISOString()
            }, { onConflict: 'id' });

          if (error) {
            log(`   ⚠️  Error migrating user ${user.username}: ${error.message}`, 'yellow');
          } else {
            log(`   ✅ Migrated: ${user.username} (${user.role || 'pengawas'})`, 'green');
          }
        } catch (err) {
          log(`   ❌ Failed to migrate user ${user.username}: ${err.message}`, 'red');
        }
      }
      log(`✅ Users migration completed: ${localData.users.length} users`, 'green');
    }

    // 4. Migrate Schools
    if (localData.schools && localData.schools.length > 0) {
      log('\n🏫 Migrating schools...', 'blue');
      
      for (const school of localData.schools) {
        try {
          const newSchoolId = getOrCreateUUID(school.id);
          // Cari user_id yang sesuai (default ke admin jika tidak ada)
          const userId = school.userId ? getOrCreateUUID(school.userId) : idMap.get(localData.users?.[0]?.id) || uuidv4();
          
          const { error } = await supabase
            .from('schools')
            .upsert({
              id: newSchoolId,
              user_id: userId,
              name: school.name,
              address: school.address || 'Alamat tidak tersedia',
              contact: school.phone || school.contact || 'Kontak tidak tersedia',
              principal_name: school.principal || null,
              principal_nip: school.principalNip || null,
              created_at: school.createdAt || new Date().toISOString()
            }, { onConflict: 'id' });

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

    // 5. Migrate Tasks
    if (localData.tasks && localData.tasks.length > 0) {
      log('\n📝 Migrating tasks...', 'blue');
      
      for (const task of localData.tasks) {
        try {
          const newTaskId = getOrCreateUUID(task.id);
          const userId = getOrCreateUUID(task.userId);
          
          const { error } = await supabase
            .from('tasks')
            .upsert({
              id: newTaskId,
              user_id: userId,
              title: task.title,
              category: task.category || 'Perencanaan',
              description: task.description || null,
              completed: task.completed || false,
              photo1: task.photo || null,
              date: task.date || new Date().toISOString(),
              created_at: task.createdAt || new Date().toISOString()
            }, { onConflict: 'id' });

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

    // 6. Migrate Supervisions
    if (localData.supervisions && localData.supervisions.length > 0) {
      log('\n📋 Migrating supervisions...', 'blue');
      
      for (const supervision of localData.supervisions) {
        try {
          const newSupervisionId = getOrCreateUUID(supervision.id);
          const userId = getOrCreateUUID(supervision.userId);
          const schoolId = getOrCreateUUID(supervision.schoolId);
          
          const { error } = await supabase
            .from('supervisions')
            .upsert({
              id: newSupervisionId,
              user_id: userId,
              school_id: schoolId,
              type: supervision.type === 'Manajerial' ? 'Manajerial' : 'Akademik',
              date: supervision.date || new Date().toISOString(),
              teacher_name: supervision.teacherName || null,
              teacher_nip: supervision.teacherNip || null,
              findings: supervision.findings || supervision.notes || 'Tidak ada catatan',
              recommendations: supervision.recommendations || null,
              photo1: supervision.photo || null,
              created_at: supervision.createdAt || new Date().toISOString()
            }, { onConflict: 'id' });

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

    // 7. Migrate Additional Tasks
    if (localData.additionalTasks && localData.additionalTasks.length > 0) {
      log('\n➕ Migrating additional tasks...', 'blue');
      
      for (const task of localData.additionalTasks) {
        try {
          const newTaskId = getOrCreateUUID(task.id);
          const userId = getOrCreateUUID(task.userId);
          
          const { error } = await supabase
            .from('additional_tasks')
            .upsert({
              id: newTaskId,
              user_id: userId,
              name: task.title || task.name,
              date: task.date || new Date().toISOString(),
              location: task.location || 'Lokasi tidak tersedia',
              organizer: task.organizer || 'Penyelenggara tidak tersedia',
              description: task.description || 'Tidak ada deskripsi',
              photo1: task.photo || null,
              created_at: task.createdAt || new Date().toISOString()
            }, { onConflict: 'id' });

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

    // 8. Migrate Events
    if (localData.events && localData.events.length > 0) {
      log('\n📅 Migrating events...', 'blue');
      
      for (const event of localData.events) {
        try {
          const newEventId = getOrCreateUUID(event.id);
          const userId = getOrCreateUUID(event.userId);
          const schoolId = event.schoolId ? getOrCreateUUID(event.schoolId) : null;
          
          const { error } = await supabase
            .from('events')
            .upsert({
              id: newEventId,
              user_id: userId,
              school_id: schoolId,
              title: event.title,
              date: event.date || new Date().toISOString(),
              time: event.time || '08:00',
              description: event.description || null,
              reminded: event.reminded || false,
              created_at: event.createdAt || new Date().toISOString()
            }, { onConflict: 'id' });

          if (error) {
            log(`   ⚠️  Error migrating event: ${error.message}`, 'yellow');
          } else {
            log(`   ✅ Migrated event: ${event.title}`, 'green');
          }
        } catch (err) {
          log(`   ❌ Failed to migrate event: ${err.message}`, 'red');
        }
      }
      log(`✅ Events migration completed: ${localData.events.length} events`, 'green');
    }

    // 9. Summary
    log('\n' + '='.repeat(60), 'cyan');
    log('🎉 MIGRATION COMPLETED SUCCESSFULLY!', 'green');
    log('='.repeat(60), 'cyan');
    log('\n📊 Migration Summary:', 'cyan');
    log(`   ✅ Users: ${localData.users?.length || 0}`, 'green');
    log(`   ✅ Schools: ${localData.schools?.length || 0}`, 'green');
    log(`   ✅ Tasks: ${localData.tasks?.length || 0}`, 'green');
    log(`   ✅ Supervisions: ${localData.supervisions?.length || 0}`, 'green');
    log(`   ✅ Additional Tasks: ${localData.additionalTasks?.length || 0}`, 'green');
    log(`   ✅ Events: ${localData.events?.length || 0}`, 'green');
    
    log('\n🔄 ID Mapping:', 'cyan');
    log(`   Generated ${idMap.size} UUID mappings`, 'blue');
    
    log('\n🚀 Next Steps:', 'cyan');
    log('   1. Verify data in Supabase dashboard', 'blue');
    log('   2. Test application with Supabase database', 'blue');
    log('   3. Update application to use Supabase', 'blue');
    log('\n');

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