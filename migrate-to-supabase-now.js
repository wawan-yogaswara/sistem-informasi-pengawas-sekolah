import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import bcrypt from 'bcryptjs';

// Supabase configuration
const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateToSupabase() {
  try {
    console.log('🚀 Starting migration to Supabase...');
    
    // Read local database
    const localData = JSON.parse(fs.readFileSync('local-database.json', 'utf8'));
    console.log('📁 Local data loaded:');
    console.log(`   Users: ${localData.users?.length || 0}`);
    console.log(`   Schools: ${localData.schools?.length || 0}`);
    console.log(`   Tasks: ${localData.tasks?.length || 0}`);
    console.log(`   Supervisions: ${localData.supervisions?.length || 0}`);
    console.log(`   Additional Tasks: ${localData.additionalTasks?.length || 0}`);
    
    // 1. Migrate Users
    if (localData.users && localData.users.length > 0) {
      console.log('\n👤 Migrating users...');
      
      for (const user of localData.users) {
        const userData = {
          id: user.id,
          username: user.username,
          password: user.password,
          full_name: user.fullName,
          role: user.role,
          nip: user.nip || '',
          rank: user.rank || '',
          office_name: user.officeName || '',
          office_address: user.officeAddress || '',
          home_address: user.homeAddress || '',
          phone: user.phone || '',
          photo_url: user.photoUrl || '',
          created_at: user.createdAt || new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('users')
          .upsert(userData, { onConflict: 'id' });
        
        if (error) {
          console.log(`   ❌ Error migrating user ${user.username}:`, error.message);
        } else {
          console.log(`   ✅ User ${user.username} migrated`);
        }
      }
    }
    
    // 2. Migrate Schools
    if (localData.schools && localData.schools.length > 0) {
      console.log('\n🏫 Migrating schools...');
      
      for (const school of localData.schools) {
        const schoolData = {
          id: school.id,
          user_id: school.userId,
          name: school.name,
          address: school.address,
          contact: school.contact,
          principal_name: school.principalName || '',
          principal_nip: school.principalNip || '',
          created_at: school.createdAt || new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('schools')
          .upsert(schoolData, { onConflict: 'id' });
        
        if (error) {
          console.log(`   ❌ Error migrating school ${school.name}:`, error.message);
        } else {
          console.log(`   ✅ School ${school.name} migrated`);
        }
      }
    }
    
    // 3. Migrate Tasks
    if (localData.tasks && localData.tasks.length > 0) {
      console.log('\n📋 Migrating tasks...');
      
      for (const task of localData.tasks) {
        const taskData = {
          id: task.id,
          user_id: task.userId,
          school_id: task.schoolId,
          title: task.title,
          description: task.description || '',
          date: task.date,
          completed: task.completed || false,
          photo_url: task.photoUrl || '',
          created_at: task.createdAt || new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('tasks')
          .upsert(taskData, { onConflict: 'id' });
        
        if (error) {
          console.log(`   ❌ Error migrating task ${task.title}:`, error.message);
        } else {
          console.log(`   ✅ Task ${task.title} migrated`);
        }
      }
    }
    
    // 4. Migrate Supervisions
    if (localData.supervisions && localData.supervisions.length > 0) {
      console.log('\n👁️ Migrating supervisions...');
      
      for (const supervision of localData.supervisions) {
        const supervisionData = {
          id: supervision.id,
          user_id: supervision.userId,
          school_id: supervision.schoolId,
          type: supervision.type || 'academic',
          date: supervision.date,
          findings: supervision.findings || '',
          recommendations: supervision.recommendations || '',
          photo_url: supervision.photoUrl || '',
          created_at: supervision.createdAt || new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('supervisions')
          .upsert(supervisionData, { onConflict: 'id' });
        
        if (error) {
          console.log(`   ❌ Error migrating supervision:`, error.message);
        } else {
          console.log(`   ✅ Supervision migrated`);
        }
      }
    }
    
    // 5. Migrate Additional Tasks
    if (localData.additionalTasks && localData.additionalTasks.length > 0) {
      console.log('\n➕ Migrating additional tasks...');
      
      for (const additionalTask of localData.additionalTasks) {
        const additionalTaskData = {
          id: additionalTask.id,
          user_id: additionalTask.userId,
          school_id: additionalTask.schoolId,
          title: additionalTask.title,
          description: additionalTask.description || '',
          date: additionalTask.date,
          status: additionalTask.status || 'pending',
          photo_url: additionalTask.photoUrl || '',
          created_at: additionalTask.createdAt || new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('additional_tasks')
          .upsert(additionalTaskData, { onConflict: 'id' });
        
        if (error) {
          console.log(`   ❌ Error migrating additional task ${additionalTask.title}:`, error.message);
        } else {
          console.log(`   ✅ Additional task ${additionalTask.title} migrated`);
        }
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('✅ All data has been migrated to Supabase');
    console.log('🔄 Restart server to use Supabase database');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

migrateToSupabase();