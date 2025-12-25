
// Emergency fallback for reports data
export const getReportsDataFallback = () => {
  try {
    const userData = localStorage.getItem('auth_user');
    if (!userData) return [];
    
    const currentUser = JSON.parse(userData);
    const userId = currentUser.username === 'wawan' ? '1762696525337' : currentUser.id;
    
    const localData = localStorage.getItem('local-database') || '{}';
    const database = JSON.parse(localData);
    
    const activities = [];
    
    // Tasks
    const tasks = database.tasks?.filter(t => t.userId === userId) || [];
    tasks.forEach(task => {
      activities.push({
        id: task.id,
        type: 'Tugas Pokok',
        title: task.title || 'Tugas Harian',
        date: task.date || task.createdAt,
        location: 'Sekolah Binaan',
        organizer: 'Pengawas Sekolah',
        description: task.description || '',
        photo1: task.photo1,
        photo2: task.photo2,
        createdAt: task.createdAt
      });
    });
    
    // Supervisions
    const supervisions = database.supervisions?.filter(s => s.userId === userId) || [];
    supervisions.forEach(supervision => {
      const school = database.schools?.find(s => s.id === supervision.schoolId);
      activities.push({
        id: supervision.id,
        type: 'Supervisi',
        title: `Supervisi ${school?.name || 'Sekolah'}`,
        date: supervision.date || supervision.createdAt,
        location: school?.name || 'Sekolah Binaan',
        organizer: 'Pengawas Sekolah',
        description: supervision.findings || supervision.recommendations || '',
        photo1: supervision.photo1,
        photo2: supervision.photo2,
        createdAt: supervision.createdAt
      });
    });
    
    // Additional Tasks
    const additionalTasks = database.additionalTasks?.filter(t => t.userId === userId) || [];
    additionalTasks.forEach(task => {
      activities.push({
        id: task.id,
        type: 'Tugas Tambahan',
        title: task.name || task.title || 'Kegiatan Tambahan',
        date: task.date || task.createdAt,
        location: task.location || 'Tempat Kegiatan',
        organizer: task.organizer || 'Pengawas Sekolah',
        description: task.description || '',
        photo1: task.photo1,
        photo2: task.photo2,
        createdAt: task.createdAt
      });
    });
    
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Fallback query error:', error);
    return [];
  }
};
