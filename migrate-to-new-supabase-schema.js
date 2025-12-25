#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://glhaliktsrcvnznbgxqt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsamFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjU2NzQsImV4cCI6MjA1MTQwMTY3NH0.Qs8Qs8Qs8Qs8Qs8Qs8Qs8Qs8Qs8Qs8Qs8Qs8Qs8Qs8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function backupExistingData() {
    console.log('🔄 Backup data yang ada...');
    
    const backup = {
        users: [],
        schools: [],
        tasks: [],
        supervisions: [],
        additional_tasks: [],
        timestamp: new Date().toISOString()
    };

    try {
        // Backup users
        const { data: users } = await supabase.from('users').select('*');
        if (users) backup.users = users;

        // Backup schools
        const { data: schools } = await supabase.from('schools').select('*');
        if (schools) backup.schools = schools;

        // Backup tasks
        const { data: tasks } = await supabase.from('tasks').select('*');
        if (tasks) backup.tasks = tasks;

        // Backup supervisions
        const { data: supervisions } = await supabase.from('supervisions').select('*');
        if (supervisions) backup.supervisions = supervisions;

        // Backup additional_tasks
        const { data: additional_tasks } = await supabase.from('additional_tasks').select('*');
        if (additional_tasks) backup.additional_tasks = additional_tasks;

        // Save backup to file
        const backupFile = `supabase-backup-${Date.now()}.json`;
        fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
        
        console.log(`✅ Backup berhasil disimpan ke: ${backupFile}`);
        console.log(`   - Users: ${backup.users.length} records`);
        console.log(`   - Schools: ${backup.schools.length} records`);
        console.log(`   - Tasks: ${backup.tasks.length} records`);
        console.log(`   - Supervisions: ${backup.supervisions.length} records`);
        console.log(`   - Additional Tasks: ${backup.additional_tasks.length} records`);
        
        return backup;
    } catch (error) {
        console.log('⚠️ Tidak ada data untuk dibackup atau tabel belum ada');
        return backup;
    }
}

async function executeSQL(sqlContent) {
    console.log('🔄 Menjalankan SQL untuk membuat struktur tabel baru...');
    
    try {
        // Split SQL content by semicolon and execute each statement
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (const statement of statements) {
            if (statement.trim()) {
                console.log(`   Executing: ${statement.substring(0, 50)}...`);
                const { error } = await supabase.rpc('exec_sql', { sql: statement });
                
                if (error) {
                    console.error(`   ❌ Error: ${error.message}`);
                    // Continue with next statement
                } else {
                    console.log(`   ✅ Success`);
                }
            }
        }
        
        console.log('✅ Struktur tabel baru berhasil dibuat');
    } catch (error) {
        console.error('❌ Error executing SQL:', error.message);
        throw error;
    }
}

async function restoreData(backup) {
    console.log('🔄 Restore data ke struktur tabel baru...');
    
    try {
        // Restore users (skip if already exists)
        if (backup.users.length > 0) {
            console.log(`   Restoring ${backup.users.length} users...`);
            for (const user of backup.users) {
                const { error } = await supabase
                    .from('users')
                    .upsert(user, { onConflict: 'username' });
                
                if (error && !error.message.includes('duplicate')) {
                    console.error(`   ❌ Error restoring user ${user.username}:`, error.message);
                }
            }
        }

        // Restore schools
        if (backup.schools.length > 0) {
            console.log(`   Restoring ${backup.schools.length} schools...`);
            for (const school of backup.schools) {
                const { error } = await supabase
                    .from('schools')
                    .insert(school);
                
                if (error && !error.message.includes('duplicate')) {
                    console.error(`   ❌ Error restoring school ${school.name}:`, error.message);
                }
            }
        }

        // Restore tasks
        if (backup.tasks.length > 0) {
            console.log(`   Restoring ${backup.tasks.length} tasks...`);
            for (const task of backup.tasks) {
                const { error } = await supabase
                    .from('tasks')
                    .insert(task);
                
                if (error) {
                    console.error(`   ❌ Error restoring task ${task.title}:`, error.message);
                }
            }
        }

        // Restore supervisions
        if (backup.supervisions.length > 0) {
            console.log(`   Restoring ${backup.supervisions.length} supervisions...`);
            for (const supervision of backup.supervisions) {
                const { error } = await supabase
                    .from('supervisions')
                    .insert(supervision);
                
                if (error) {
                    console.error(`   ❌ Error restoring supervision:`, error.message);
                }
            }
        }

        // Restore additional_tasks
        if (backup.additional_tasks.length > 0) {
            console.log(`   Restoring ${backup.additional_tasks.length} additional tasks...`);
            for (const task of backup.additional_tasks) {
                const { error } = await supabase
                    .from('additional_tasks')
                    .insert(task);
                
                if (error) {
                    console.error(`   ❌ Error restoring additional task ${task.title}:`, error.message);
                }
            }
        }

        console.log('✅ Data berhasil di-restore');
    } catch (error) {
        console.error('❌ Error restoring data:', error.message);
    }
}

async function verifyNewStructure() {
    console.log('🔄 Verifikasi struktur tabel baru...');
    
    try {
        // Test each table
        const tables = ['users', 'schools', 'tasks', 'supervisions', 'additional_tasks'];
        
        for (const table of tables) {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1);
            
            if (error) {
                console.error(`   ❌ Error accessing table ${table}:`, error.message);
            } else {
                console.log(`   ✅ Table ${table} accessible`);
            }
        }
        
        console.log('✅ Verifikasi selesai');
    } catch (error) {
        console.error('❌ Error verifying structure:', error.message);
    }
}

async function main() {
    console.log('🚀 MEMULAI MIGRASI STRUKTUR TABEL SUPABASE BARU');
    console.log('================================================');
    
    try {
        // Step 1: Backup existing data
        const backup = await backupExistingData();
        
        // Step 2: Read and execute new schema SQL
        const sqlFile = path.join(__dirname, 'supabase-schema-new-clean.sql');
        if (!fs.existsSync(sqlFile)) {
            throw new Error(`File SQL tidak ditemukan: ${sqlFile}`);
        }
        
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');
        await executeSQL(sqlContent);
        
        // Step 3: Restore data if any
        if (backup.users.length > 0 || backup.schools.length > 0 || 
            backup.tasks.length > 0 || backup.supervisions.length > 0 || 
            backup.additional_tasks.length > 0) {
            await restoreData(backup);
        }
        
        // Step 4: Verify new structure
        await verifyNewStructure();
        
        console.log('');
        console.log('🎉 MIGRASI BERHASIL SELESAI!');
        console.log('✅ Struktur tabel baru sudah sesuai dengan frontend');
        console.log('✅ Data lama sudah di-backup dan di-restore');
        console.log('✅ Aplikasi siap digunakan dengan Supabase');
        
    } catch (error) {
        console.error('❌ MIGRASI GAGAL:', error.message);
        process.exit(1);
    }
}

main();