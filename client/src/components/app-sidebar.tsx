import {
  Calendar,
  ClipboardList,
  FileText,
  Home,
  School,
  ClipboardCheck,
  Plus,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Profil Pengawas",
    url: "/profile",
    icon: User,
  },
  {
    title: "Daftar Tugas",
    url: "/tasks",
    icon: ClipboardList,
  },
  {
    title: "Jadwal Kegiatan",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Kegiatan Supervisi",
    url: "/supervisions",
    icon: ClipboardCheck,
  },
  {
    title: "Sekolah Binaan",
    url: "/schools",
    icon: School,
  },
  {
    title: "Tugas Tambahan",
    url: "/additional",
    icon: Plus,
  },
  {
    title: "Laporan",
    url: "/reports",
    icon: FileText,
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user from localStorage (client-side auth) - menggunakan sumber yang sama dengan dashboard
  const getCurrentUser = () => {
    try {
      // Try auth_user first (from Supabase login)
      let currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      
      // Fallback to other possible keys
      if (!currentUser.username) {
        currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      }
      if (!currentUser.username) {
        currentUser = JSON.parse(localStorage.getItem('user_data') || '{}');
      }
      
      console.log('👤 Sidebar - Current user data:', currentUser);
      console.log('🔐 Sidebar - User role:', currentUser.role);
      
      return currentUser.username ? currentUser : null;
    } catch (error) {
      console.error('❌ Sidebar - Error getting user data:', error);
      return null;
    }
  };

  // Load user data on component mount and listen for changes
  useEffect(() => {
    const loadUser = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };

    // Load initially
    loadUser();

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_user' || e.key === 'currentUser' || e.key === 'user_data') {
        console.log('🔄 Sidebar - User data changed, reloading...');
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case of same-tab changes
    const interval = setInterval(loadUser, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Show toast notification
    toast({
      title: "Berhasil",
      description: "Anda telah keluar dari aplikasi",
    });
    
    // Redirect to login page
    setLocation('/login');
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold px-4 py-4">
            Pengawas Sekolah
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.url.slice(1) || 'dashboard'}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Admin Only Menu */}
              {currentUser?.role === 'admin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location === '/users'}>
                    <Link href="/users">
                      <Shield className="h-4 w-4" />
                      <span>Manajemen User</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <button
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
