import { useState, useEffect } from "react";

interface UserProfile {
  fullName: string;
  nip: string;
  photoUrl: string | null;
  role: string;
}

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  totalSchools: number;
  monthlySupervisions: number;
  totalSupervisions: number;
  totalAdditionalTasks: number;
}

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [photoError, setPhotoError] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    totalSchools: 0,
    monthlySupervisions: 0,
    totalSupervisions: 0,
    totalAdditionalTasks: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Dedicated function to fetch and persist profile photo
  const fetchProfilePhoto = () => {
    console.log('📷 Fetching profile photo...');
    
    // Get all possible photo sources
    const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');
    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Find photo with priority order
    let photoUrl = null;
    
    if (profileData.photoUrl) {
      photoUrl = profileData.photoUrl;
      console.log('📷 Photo found in profile_data');
    } else if (authUser.photo_url) {
      photoUrl = authUser.photo_url;
      console.log('📷 Photo found in auth_user.photo_url');
    } else if (authUser.photoUrl) {
      photoUrl = authUser.photoUrl;
      console.log('📷 Photo found in auth_user.photoUrl');
    } else if (currentUser.photoUrl) {
      photoUrl = currentUser.photoUrl;
      console.log('📷 Photo found in currentUser.photoUrl');
    } else if (currentUser.photo) {
      photoUrl = currentUser.photo;
      console.log('📷 Photo found in currentUser.photo');
    }
    
    // Convert /uploads/ path to full URL if needed
    if (photoUrl && photoUrl.startsWith('/uploads/')) {
      photoUrl = `http://localhost:5000${photoUrl}`;
      console.log('📷 Converted uploads path to full URL');
    }
    
    if (photoUrl) {
      console.log(`📷 Photo URL: ${photoUrl.substring(0, 50)}...`);
      console.log(`📷 Photo URL length: ${photoUrl.length} chars`);
      // Store in a dedicated key for dashboard
      localStorage.setItem('dashboard_photo', photoUrl);
      return photoUrl;
    } else {
      console.log('📷 No photo found in any source');
      localStorage.removeItem('dashboard_photo');
      return null;
    }
  };

  // Load user profile from auth_user (Supabase login) or fallback sources
  const loadUserProfile = () => {
    console.log('🔄 Loading user profile...');
    
    // Try auth_user first (from Supabase login)
    let currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    
    // Fallback to other possible keys
    if (!currentUser.username) {
      currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    if (!currentUser.username) {
      currentUser = JSON.parse(localStorage.getItem('user_data') || '{}');
    }
    
    console.log('👤 Current user data:', currentUser);
    
    if (currentUser.username) {
      // Get profile data from profile_data (where photo is saved)
      const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');
      
      // Fetch photo using dedicated function
      const photoUrl = fetchProfilePhoto();
      
      const profile = {
        fullName: currentUser.full_name || currentUser.fullName || currentUser.name || currentUser.username || 'Pengguna',
        nip: currentUser.nip || profileData.nip || '',
        photoUrl: photoUrl,
        role: currentUser.role || 'user'
      };
      console.log('✅ User profile loaded:', profile);
      setUserProfile(profile);
      // Reset photo states when profile changes
      setPhotoError(false);
    } else {
      console.log('⚠️ No user data found, using default');
      // Try to find user from local database
      const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
      const defaultUser = localData.users?.[0] || {
        fullName: 'Pengguna',
        nip: '',
        photoUrl: null,
        role: 'user'
      };
      
      setUserProfile({
        fullName: defaultUser.fullName || 'Pengguna',
        nip: defaultUser.nip || '',
        photoUrl: defaultUser.photoUrl || null,
        role: defaultUser.role || 'user'
      });
      // Reset photo states for default user
      setPhotoError(false);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching dashboard data...');
      
      const currentUser = JSON.parse(localStorage.getItem('auth_user') || localStorage.getItem('currentUser') || localStorage.getItem('user_data') || '{}');
      console.log('👤 Current user for data filtering:', currentUser);
      
      let tasks: any[] = [];
      let supervisions: any[] = [];
      let schools: any[] = [];
      let additionalTasks: any[] = [];

      // Try localStorage first
      console.log('🔄 Loading from localStorage...');
      const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
      
      tasks = localData.tasks || [];
      supervisions = localData.supervisions || [];
      schools = localData.schools || [];
      additionalTasks = localData.additionalTasks || [];
      
      console.log('📊 localStorage Data loaded:', {
        tasks: tasks.length,
        supervisions: supervisions.length,
        schools: schools.length,
        additionalTasks: additionalTasks.length
      });

      // If no data in main localStorage, try individual keys
      if (tasks.length === 0 && supervisions.length === 0 && schools.length === 0) {
        console.log('🔄 Loading from individual localStorage keys...');
        
        const tasksData = localStorage.getItem('tasks_data');
        const supervisionsData = localStorage.getItem('supervisions_data');
        const schoolsData = localStorage.getItem('schools_data');
        const additionalTasksData = localStorage.getItem('additional_tasks_data');
        
        if (tasksData) {
          tasks = JSON.parse(tasksData);
          console.log('📋 Tasks loaded from localStorage:', tasks.length);
        }
        
        if (supervisionsData) {
          supervisions = JSON.parse(supervisionsData);
          console.log('👁️ Supervisions loaded from localStorage:', supervisions.length);
        }
        
        if (schoolsData) {
          schools = JSON.parse(schoolsData);
          console.log('🏫 Schools loaded from localStorage:', schools.length);
        }
        
        if (additionalTasksData) {
          additionalTasks = JSON.parse(additionalTasksData);
          console.log('➕ Additional tasks loaded from localStorage:', additionalTasks.length);
        }
      }

      // If still no data, create sample data automatically
      if (tasks.length === 0 && supervisions.length === 0 && schools.length === 0) {
        console.log('📝 No data found, creating sample data...');
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        
        // Create sample data
        const sampleData = {
          users: [
            {
              id: "1762696525337",
              username: "wawan",
              fullName: "Wawan Setiawan",
              role: "user",
              nip: "196801011990031001"
            }
          ],
          schools: [
            {
              id: "school_001",
              name: "SDN 1 Garut Kota",
              address: "Jl. Raya Garut No. 1",
              headmaster: "Drs. Ahmad Suryadi"
            },
            {
              id: "school_002", 
              name: "SDN 2 Garut Kota",
              address: "Jl. Raya Garut No. 2",
              headmaster: "Hj. Siti Nurhasanah, S.Pd"
            },
            {
              id: "school_003",
              name: "SDN 3 Garut Kota", 
              address: "Jl. Raya Garut No. 3",
              headmaster: "Drs. Bambang Sutrisno"
            }
          ],
          tasks: [
            {
              id: "task_001",
              title: "Supervisi Pembelajaran Kelas 1-3",
              description: "Melakukan supervisi pembelajaran di kelas rendah",
              userId: "1762696525337",
              username: "wawan",
              schoolId: "school_001",
              schoolName: "SDN 1 Garut Kota",
              status: "completed",
              completed: true,
              date: new Date(currentYear, currentMonth, 5).toISOString(),
              createdAt: new Date(currentYear, currentMonth, 1).toISOString()
            },
            {
              id: "task_002",
              title: "Evaluasi Kurikulum Merdeka",
              description: "Mengevaluasi implementasi kurikulum merdeka",
              userId: "1762696525337", 
              username: "wawan",
              schoolId: "school_002",
              schoolName: "SDN 2 Garut Kota",
              status: "in_progress",
              completed: false,
              date: new Date(currentYear, currentMonth, 10).toISOString(),
              createdAt: new Date(currentYear, currentMonth, 3).toISOString()
            },
            {
              id: "task_003",
              title: "Monitoring Administrasi Sekolah",
              description: "Memantau kelengkapan administrasi sekolah",
              userId: "1762696525337",
              username: "wawan", 
              schoolId: "school_003",
              schoolName: "SDN 3 Garut Kota",
              status: "pending",
              completed: false,
              date: new Date(currentYear, currentMonth, 15).toISOString(),
              createdAt: new Date(currentYear, currentMonth, 5).toISOString()
            }
          ],
          supervisions: [
            {
              id: "supervision_001",
              title: "Supervisi Akademik Semester 1",
              schoolId: "school_001",
              schoolName: "SDN 1 Garut Kota",
              userId: "1762696525337",
              username: "wawan",
              date: new Date(currentYear, currentMonth, 8).toISOString(),
              notes: "Pembelajaran sudah berjalan dengan baik",
              createdAt: new Date(currentYear, currentMonth, 8).toISOString()
            },
            {
              id: "supervision_002", 
              title: "Supervisi Manajerial",
              schoolId: "school_002",
              schoolName: "SDN 2 Garut Kota",
              userId: "1762696525337",
              username: "wawan",
              date: new Date(currentYear, currentMonth, 12).toISOString(),
              notes: "Manajemen sekolah perlu diperbaiki",
              createdAt: new Date(currentYear, currentMonth, 12).toISOString()
            }
          ],
          additionalTasks: [
            {
              id: "additional_001",
              title: "Pelatihan Guru Kurikulum Merdeka",
              description: "Memberikan pelatihan kepada guru-guru",
              userId: "1762696525337",
              username: "wawan",
              schoolId: "school_001", 
              schoolName: "SDN 1 Garut Kota",
              date: new Date(currentYear, currentMonth, 20).toISOString(),
              status: "completed",
              createdAt: new Date(currentYear, currentMonth, 18).toISOString()
            },
            {
              id: "additional_002",
              title: "Workshop Penilaian Autentik",
              description: "Mengadakan workshop tentang penilaian autentik",
              userId: "1762696525337",
              username: "wawan", 
              schoolId: "school_002",
              schoolName: "SDN 2 Garut Kota",
              date: new Date(currentYear, currentMonth, 25).toISOString(),
              status: "scheduled",
              createdAt: new Date(currentYear, currentMonth, 20).toISOString()
            }
          ]
        };
        
        // Save sample data to localStorage
        localStorage.setItem('local-database', JSON.stringify(sampleData));
        localStorage.setItem('tasks_data', JSON.stringify(sampleData.tasks));
        localStorage.setItem('supervisions_data', JSON.stringify(sampleData.supervisions));
        localStorage.setItem('schools_data', JSON.stringify(sampleData.schools));
        localStorage.setItem('additional_tasks_data', JSON.stringify(sampleData.additionalTasks));
        
        // Set user session if not exists
        if (!currentUser.username) {
          const wawaUser = {
            id: "1762696525337",
            username: "wawan",
            fullName: "Wawan Setiawan",
            role: "user",
            nip: "196801011990031001"
          };
          localStorage.setItem('auth_user', JSON.stringify(wawaUser));
          localStorage.setItem('currentUser', JSON.stringify(wawaUser));
        }
        
        // Use sample data
        tasks = sampleData.tasks;
        supervisions = sampleData.supervisions;
        schools = sampleData.schools;
        additionalTasks = sampleData.additionalTasks;
        
        console.log('✅ Sample data created and saved');
      }

      // Filter for current user dan hapus data dummy 2024
      let userTasks = tasks;
      let userSupervisions = supervisions;
      let userAdditionalTasks = additionalTasks;

      console.log('🔍 Raw data before filtering:', {
        tasks: tasks.length,
        supervisions: supervisions.length,
        additionalTasks: additionalTasks.length,
        currentUser: currentUser
      });

      if (currentUser.role !== 'admin' && (currentUser.username || currentUser.id)) {
        console.log('🔍 Filtering data for non-admin user...');
        
        userTasks = tasks.filter((task: any) => {
          const matches = task.username === currentUser.username || 
                         task.userId === currentUser.id ||
                         task.user === currentUser.username ||
                         task.user_id === currentUser.id ||
                         (currentUser.username === 'wawan' && (task.userId === '1762696525337' || task.user_id === '1762696525337'));
          if (matches) console.log('✅ Found matching task:', task.title);
          return matches;
        });
        
        userSupervisions = supervisions.filter((supervision: any) => {
          const matches = supervision.username === currentUser.username || 
                         supervision.userId === currentUser.id ||
                         supervision.user === currentUser.username ||
                         supervision.user_id === currentUser.id ||
                         (currentUser.username === 'wawan' && (supervision.userId === '1762696525337' || supervision.user_id === '1762696525337'));
          if (matches) console.log('✅ Found matching supervision:', supervision.title);
          return matches;
        });
        
        userAdditionalTasks = additionalTasks.filter((task: any) => {
          const matches = task.username === currentUser.username || 
                         task.userId === currentUser.id ||
                         task.user === currentUser.username ||
                         task.user_id === currentUser.id ||
                         (currentUser.username === 'wawan' && (task.userId === '1762696525337' || task.user_id === '1762696525337'));
          if (matches) console.log('✅ Found matching additional task:', task.title);
          return matches;
        });
      } else {
        console.log('👑 Admin user - showing all data');
      }

      console.log('📊 After user filtering:', {
        userTasks: userTasks.length,
        userSupervisions: userSupervisions.length,
        userAdditionalTasks: userAdditionalTasks.length
      });

      // HAPUS DATA DUMMY TAHUN 2024 dari semua data
      console.log('🗑️ Filtering out 2024 dummy data...');
      
      userTasks = userTasks.filter((task: any) => {
        const taskDate = new Date(task.date || task.createdAt || task.created_at);
        const isNotDummy2024 = taskDate.getFullYear() !== 2024;
        if (!isNotDummy2024) console.log('🗑️ Removing 2024 dummy task:', task.title);
        return isNotDummy2024;
      });
      
      userSupervisions = userSupervisions.filter((supervision: any) => {
        const supervisionDate = new Date(supervision.date || supervision.createdAt || supervision.created_at);
        const isNotDummy2024 = supervisionDate.getFullYear() !== 2024;
        if (!isNotDummy2024) console.log('🗑️ Removing 2024 dummy supervision:', supervision.title);
        return isNotDummy2024;
      });
      
      userAdditionalTasks = userAdditionalTasks.filter((task: any) => {
        const taskDate = new Date(task.date || task.createdAt || task.created_at);
        const isNotDummy2024 = taskDate.getFullYear() !== 2024;
        if (!isNotDummy2024) console.log('🗑️ Removing 2024 dummy additional task:', task.title);
        return isNotDummy2024;
      });

      console.log('📊 Filtered data counts (excluding 2024 dummy):', {
        userTasks: userTasks.length,
        userSupervisions: userSupervisions.length,
        userAdditionalTasks: userAdditionalTasks.length
      });

      // Calculate stats
      const completedTasks = userTasks.filter((task: any) => 
        task.completed === true || task.status === 'completed'
      ).length;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlySupervisions = userSupervisions.filter((supervision: any) => {
        const date = new Date(supervision.date || supervision.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length;

      // Filter schools untuk user (sekolah yang pernah disupervisi user)
      let userSchools = schools;
      if (currentUser.role !== 'admin' && (currentUser.username || currentUser.id)) {
        // Ambil sekolah unik dari supervisi user
        const schoolIdsFromSupervisions = Array.from(new Set(userSupervisions.map((s: any) => s.school_id || s.schoolId)));
        userSchools = schools.filter((school: any) => 
          schoolIdsFromSupervisions.includes(school.id)
        );
        console.log('🏫 User schools from supervisions:', userSchools.length);
      }

      const newStats = {
        totalTasks: userTasks.length,
        completedTasks,
        totalSchools: userSchools.length, // Menggunakan sekolah yang relevan dengan user
        monthlySupervisions,
        totalSupervisions: userSupervisions.length,
        totalAdditionalTasks: userAdditionalTasks.length
      };

      console.log('✅ Dashboard stats calculated:', newStats);
      setStats(newStats);

      // Recent activities - hanya aktivitas user yang sebenarnya (bukan dummy 2024)
      const allActivities = [
        ...userTasks.map((task: any) => ({ 
          ...task, 
          type: 'task',
          title: task.title || task.name || 'Tugas',
          date: task.createdAt || task.date || new Date().toISOString(),
          description: task.description || ''
        })),
        ...userSupervisions.map((supervision: any) => ({ 
          ...supervision, 
          type: 'supervision',
          title: supervision.title || supervision.schoolName || 'Supervisi',
          date: supervision.date || supervision.createdAt || new Date().toISOString(),
          description: supervision.notes || supervision.description || ''
        })),
        ...userAdditionalTasks.map((task: any) => ({ 
          ...task, 
          type: 'additional',
          title: task.title || task.name || 'Tugas Tambahan',
          date: task.createdAt || task.date || new Date().toISOString(),
          description: task.description || ''
        }))
      ];

      // Filter hanya aktivitas dengan tanggal valid dan BUKAN tahun 2024 (data dummy)
      const sortedActivities = allActivities
        .filter(activity => {
          if (!activity.date) return false;
          const activityDate = new Date(activity.date);
          const activityYear = activityDate.getFullYear();
          // Hapus data dummy tahun 2024
          return activityYear !== 2024 && activityDate.getTime() > 0;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      console.log('📋 Recent activities loaded (excluding 2024 dummy data):', sortedActivities.length);
      setRecentActivities(sortedActivities);

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      
      // Show empty data if everything fails
      console.log('📝 Showing empty data as fallback');
      setStats({
        totalTasks: 0,
        completedTasks: 0,
        totalSchools: 0,
        monthlySupervisions: 0,
        totalSupervisions: 0,
        totalAdditionalTasks: 0
      });
      
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
    fetchDashboardData();
    
    // Listen for localStorage changes (when photo is uploaded in profile page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'profile_data' || e.key === 'auth_user') {
        console.log('📷 Photo data changed, refreshing profile...');
        loadUserProfile();
      }
    };
    
    // Listen for custom events (when photo is uploaded)
    const handlePhotoUpdate = () => {
      console.log('📷 Photo update event received, refreshing profile...');
      loadUserProfile();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('photoUpdated', handlePhotoUpdate);
    
    // Also check for photo updates every 5 seconds
    const photoCheckInterval = setInterval(() => {
      const currentPhoto = userProfile?.photoUrl;
      const latestPhoto = fetchProfilePhoto();
      
      if (currentPhoto !== latestPhoto) {
        console.log('📷 Photo changed detected, updating profile...');
        loadUserProfile();
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('photoUpdated', handlePhotoUpdate);
      clearInterval(photoCheckInterval);
    };
  }, [userProfile?.photoUrl]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-blue-500 flex items-center justify-center">
                    {userProfile?.photoUrl ? (
                      <img 
                        src={userProfile.photoUrl} 
                        alt="Foto Profil"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('❌ Photo failed to load, showing initials');
                          setPhotoError(true);
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('✅ Photo loaded successfully');
                          setPhotoError(false);
                        }}
                        style={{ display: photoError ? 'none' : 'block' }}
                      />
                    ) : null}
                    {(!userProfile?.photoUrl || photoError) && (
                      <span className="text-white text-2xl font-bold">
                        {userProfile?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {getGreeting()}, {userProfile?.fullName || 'Pengguna'}! 👋
                  </h1>
                  <p className="text-blue-100 text-lg mb-1">
                    Selamat datang di Sistem Kepengawasan Sekolah
                  </p>
                  {userProfile?.nip && (
                    <p className="text-blue-200 text-sm">NIP: {userProfile.nip}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                      {userProfile?.role === 'admin' ? '👑 Administrator' : '👨‍🏫 Pengawas'}
                    </span>
                    <span className="text-green-300 text-sm flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatTime(currentTime)}</div>
                <div className="text-blue-200 text-sm">{formatDate(currentTime)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Tugas</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalTasks}</p>
                <p className="text-xs text-gray-500 mt-1">Tugas keseluruhan</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tugas Selesai</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
                <p className="text-xs text-gray-500 mt-1">Dari {stats.totalTasks} tugas</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Sekolah Binaan</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalSchools}</p>
                <p className="text-xs text-gray-500 mt-1">Sekolah yang dibina</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Supervisi Bulan Ini</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.monthlySupervisions}</p>
                <p className="text-xs text-gray-500 mt-1">Supervisi {new Date().toLocaleDateString('id-ID', { month: 'long' })}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Supervisi</p>
                <p className="text-3xl font-bold text-red-600">{stats.totalSupervisions}</p>
                <p className="text-xs text-gray-500 mt-1">Supervisi keseluruhan</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tugas Tambahan</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.totalAdditionalTasks}</p>
                <p className="text-xs text-gray-500 mt-1">Kegiatan tambahan</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-3">📊</span>
              Progress Tugas
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Tugas Selesai</span>
                  <span className="text-sm font-bold text-green-600">
                    {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                  <div className="text-sm text-gray-600">Selesai</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalTasks - stats.completedTasks}</div>
                  <div className="text-sm text-gray-600">Belum Selesai</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-3">📋</span>
              Aktivitas Terbaru
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Aktivitas terbaru Anda dalam sistem kepengawasan
            </p>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity.id || index} className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        activity.type === 'task' ? 'bg-blue-500' :
                        activity.type === 'supervision' ? 'bg-yellow-500' :
                        activity.type === 'additional' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}>
                        {activity.type === 'task' ? '📋' :
                         activity.type === 'supervision' ? '👁️' :
                         activity.type === 'additional' ? '➕' :
                         '📝'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-900 mb-1">
                        {activity.title || activity.name || 'Aktivitas'}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {activity.type === 'task' ? '📋 Tugas Kepengawasan' :
                         activity.type === 'supervision' ? '👁️ Supervisi Sekolah' :
                         activity.type === 'additional' ? '➕ Tugas Tambahan' :
                         '📝 Aktivitas Lainnya'}
                      </p>
                      {activity.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                          {activity.description}
                        </p>
                      )}
                      {activity.schoolName && (
                        <p className="text-xs text-blue-600 font-medium">
                          🏫 {activity.schoolName}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(activity.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {(() => {
                          const now = new Date();
                          const activityDate = new Date(activity.date);
                          const diffTime = Math.abs(now.getTime() - activityDate.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          
                          if (diffDays === 1) return 'Hari ini';
                          if (diffDays === 2) return 'Kemarin';
                          if (diffDays <= 7) return `${diffDays - 1} hari lalu`;
                          if (diffDays <= 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
                          return `${Math.floor(diffDays / 30)} bulan lalu`;
                        })()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <p className="text-gray-500 text-lg font-medium mb-2">Belum ada aktivitas</p>
                  <p className="text-gray-400 text-sm mb-6">Mulai dengan menambahkan tugas, supervisi, atau kegiatan tambahan untuk melihat aktivitas terbaru Anda</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a href="/tasks" className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                      📋 Tambah Tugas
                    </a>
                    <a href="/supervisions" className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium">
                      👁️ Buat Supervisi
                    </a>
                    <a href="/additional-tasks" className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
                      ➕ Tugas Tambahan
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}