# Debug: Frontend API Integration

## Masalah yang Ditemukan:
- ✅ Test production berhasil (data masuk ke Supabase)
- ❌ User input manual tidak masuk (frontend masih pakai localStorage)

## Root Cause:
Frontend aplikasi (`additional-tasks.tsx`) masih menggunakan localStorage untuk menyimpan data, bukan Supabase API yang sudah dikonfigurasi.

## Perbaikan yang Dilakukan:

### 1. Import API Module
```typescript
import { additionalTasksApi } from "@/lib/api";
```

### 2. Update Data Fetching
```typescript
// BEFORE: localStorage
const { data: tasks = [], isLoading } = useQuery({
  queryKey: ['additional-tasks'],
  queryFn: () => {
    const tasksData = localStorage.getItem('additional_tasks_data');
    // ...localStorage logic
  }
});

// AFTER: Supabase API
const { data: tasks = [], isLoading } = useQuery({
  queryKey: ['additional-tasks'],
  queryFn: async () => {
    const data = await additionalTasksApi.getAll();
    return data;
  }
});
```

### 3. Update Data Saving
```typescript
// BEFORE: localStorage
const handleAddTask = () => {
  const tasksData = localStorage.getItem('additional_tasks_data');
  // ...localStorage logic
};

// AFTER: Supabase API
const handleAddTask = async () => {
  const savedTask = await additionalTasksApi.create({
    name: newTask.name,
    date: newTask.date,
    location: newTask.location,
    organizer: newTask.organizer,
    description: newTask.description,
    photo1: newTask.photo1,
    photo2: newTask.photo2,
  });
};
```

### 4. Update Data Deletion
```typescript
// BEFORE: localStorage
const handleDeleteTask = (id: string) => {
  const updatedTasks = currentTasks.filter(task => task.id !== id);
  localStorage.setItem('additional_tasks_data', JSON.stringify(updatedTasks));
};

// AFTER: Supabase API
const handleDeleteTask = async (id: string) => {
  await additionalTasksApi.delete(id);
  queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
};
```

## Expected Results:
- ✅ Data input manual akan langsung masuk ke Supabase
- ✅ Data sinkron antar browser
- ✅ Real-time updates via React Query
- ✅ Fallback ke localStorage jika API gagal

## Next Steps:
1. Deploy perubahan ke Netlify
2. Test input data manual di browser
3. Verifikasi data masuk ke Supabase
4. Test browser sync

## Test Commands:
```bash
# Test API connection
node test-data-input-final-fix.js

# Check latest data in Supabase
node test-netlify-supabase-final.js
```