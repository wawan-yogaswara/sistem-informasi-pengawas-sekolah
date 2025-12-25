import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar, MapPin, Users, Image as ImageIcon, Printer, TrendingUp, BarChart3 } from "lucide-react";

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("semua");
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load activities from localStorage
  useEffect(() => {
    const loadActivities = () => {
      try {
        console.log('🔍 Loading activities from localStorage...');
        setIsLoading(true);
        
        // Get current user
        const userData = localStorage.getItem('auth_user');
        if (!userData) {
          console.log('⚠️ No user data found');
          setAllActivities([]);
          setIsLoading(false);
          return;
        }
        
        const currentUser = JSON.parse(userData);
        console.log('👤 Current user:', currentUser.username);
        
        // For wawan user, use the correct ID
        let userId = currentUser.id;
        if (currentUser.username === 'wawan') {
          userId = '1762696525337';
        }
        
        console.log('🔑 Using user_id:', userId);
        
        const activities: any[] = [];
        
        // Fetch tasks from Supabase
        try {
          const tasksResponse = await fetch('/api/tasks-daily');
          if (tasksResponse.ok) {
            const tasksData = await tasksResponse.json();
            const userTasks = tasksData.filter((task: any) => task.user_id === userId);
            console.log(`📋 Found ${userTasks.length} tasks from Supabase for user ${userId}`);
            
            userTasks.forEach((task: any) => {
              activities.push({
                id: task.id,
                type: 'Tugas Pokok',
                title: task.title || 'Tugas Harian',
                date: task.date || task.created_at,
                location: 'Sekolah Binaan',
                organizer: 'Pengawas Sekolah',
                description: task.description || '',
                photo1: task.photo1,
                photo2: task.photo2,
                createdAt: task.created_at,
                source: 'supabase'
              });
            });
          }
        } catch (error) {
          console.error('Error fetching tasks from Supabase:', error);
        }
        
        // Fetch supervisions from Supabase
        try {
          const supervisionsResponse = await fetch('/api/supervisions');
          if (supervisionsResponse.ok) {
            const supervisionsData = await supervisionsResponse.json();
            const userSupervisions = supervisionsData.filter((supervision: any) => supervision.user_id === userId);
            console.log(`🔍 Found ${userSupervisions.length} supervisions from Supabase for user ${userId}`);
            
            // Fetch schools for location names
            const schoolsResponse = await fetch('/api/schools');
            const schoolsData = schoolsResponse.ok ? await schoolsResponse.json() : [];
            
            userSupervisions.forEach((supervision: any) => {
              // Get school name
              const school = schoolsData.find((s: any) => s.id === supervision.school_id);
              
              activities.push({
                id: supervision.id,
                type: 'Supervisi',
                title: `Supervisi ${school?.name || 'Sekolah'}`,
                date: supervision.date || supervision.created_at,
                location: school?.name || 'Sekolah Binaan',
                organizer: 'Pengawas Sekolah',
                description: supervision.findings || supervision.recommendations || '',
                photo1: supervision.photo1,
                photo2: supervision.photo2,
                createdAt: supervision.created_at,
                source: 'supabase'
              });
            });
          }
        } catch (error) {
          console.error('Error fetching supervisions from Supabase:', error);
        }
        
        // Fetch additional tasks from Supabase
        try {
          const additionalTasksResponse = await fetch('/api/activities');
          if (additionalTasksResponse.ok) {
            const additionalTasksData = await additionalTasksResponse.json();
            const userAdditionalTasks = additionalTasksData.filter((task: any) => task.user_id === userId);
            console.log(`➕ Found ${userAdditionalTasks.length} additional tasks from Supabase for user ${userId}`);
            
            userAdditionalTasks.forEach((task: any) => {
              activities.push({
                id: task.id,
                type: 'Tugas Tambahan',
                title: task.name || task.title || 'Kegiatan Tambahan',
                date: task.date || task.created_at,
                location: task.location || 'Tempat Kegiatan',
                organizer: task.organizer || 'Pengawas Sekolah',
                description: task.description || '',
                photo1: task.photo1,
                photo2: task.photo2,
                createdAt: task.created_at,
                source: 'supabase'
              });
            });
          }
        } catch (error) {
          console.error('Error fetching additional tasks from Supabase:', error);
        }
        
        console.log(`📊 Total activities loaded from Supabase: ${activities.length}`);
        console.log('📋 Activities with photos:', activities.filter(a => a.photo1 || a.photo2).length);
        
        // Log sample activities for debugging
        if (activities.length > 0) {
          console.log('📋 Sample activities:', activities.slice(0, 3).map(a => ({
            id: a.id,
            type: a.type,
            title: a.title,
            hasPhoto1: !!a.photo1,
            hasPhoto2: !!a.photo2,
            photo1Path: a.photo1 ? (a.photo1.startsWith('data:') ? 'base64' : a.photo1) : null,
            photo2Path: a.photo2 ? (a.photo2.startsWith('data:') ? 'base64' : a.photo2) : null,
            source: a.source
          })));
        }
        
        // Sort by date (newest first)
        const sortedActivities = activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAllActivities(sortedActivities);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error loading activities:', error);
        setAllActivities([]);
        setIsLoading(false);
      }
    };

    loadActivities();
  }, []);

  // Filter activities by period
  const getFilteredActivities = (period: string) => {
    if (period === "semua") return allActivities;
    
    if (period === "bulanan") {
      return allActivities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.getMonth() === selectedMonth && 
               activityDate.getFullYear() === selectedYear;
      });
    }
    
    if (period === "tahunan") {
      return allActivities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.getFullYear() === selectedYear;
      });
    }
    
    return allActivities;
  };

  // Get months list
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Get years list (dinamis: 2 tahun sebelumnya, tahun sekarang, dan 2 tahun ke depan)
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Tugas Tambahan': return 'bg-blue-100 text-blue-800';
      case 'Supervisi': return 'bg-green-100 text-green-800';
      case 'Tugas Pokok': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportPDF = (period: string = "semua") => {
    try {
      const activitiesToExport = getFilteredActivities(period);
      
      // Generate PDF content with filtered data
      const generatePDFContent = () => {
        // Get profile data
        const profileData = localStorage.getItem('profile_data') || localStorage.getItem('user_data');
        const profile = profileData ? JSON.parse(profileData) : null;
        
        // Generate period title
        const getPeriodTitle = () => {
          if (period === "bulanan") {
            return `Periode: ${months[selectedMonth]} ${selectedYear}`;
          } else if (period === "tahunan") {
            return `Periode: Tahun ${selectedYear}`;
          }
          return `Periode: Semua Aktivitas`;
        };
        
        // Collect all photos (maksimal 6)
        const allPhotos: any[] = [];
        activitiesToExport.forEach(activity => {
          if (activity.photo1) allPhotos.push({ src: activity.photo1, caption: `${activity.title} - Foto 1` });
          if (activity.photo2) allPhotos.push({ src: activity.photo2, caption: `${activity.title} - Foto 2` });
        });
        
        // Limit to 6 photos
        const selectedPhotos = allPhotos.slice(0, 6);
        
        const photosHTML = selectedPhotos.length > 0 ? `
            <div style="margin: 20px 0; page-break-inside: avoid;" class="no-break">
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                Bukti Kegiatan (Dokumentasi Foto)
              </div>
              <div class="photos-grid">
                ${selectedPhotos.map((photo, index) => `
                  <div class="photo-item">
                    <img src="${photo.src.startsWith('data:') ? photo.src : `http://localhost:5000/uploads/${photo.src}`}" alt="Foto ${index + 1}" />
                    <p class="photo-caption">
                      Foto ${index + 1}: ${photo.caption.length > 35 ? photo.caption.substring(0, 35) + '...' : photo.caption}
                    </p>
                  </div>
                `).join('')}
              </div>
              ${allPhotos.length > 6 ? `
                <p style="text-align: center; margin-top: 12px; font-size: 10px; color: #6b7280; font-style: italic;">
                  Menampilkan 6 dari ${allPhotos.length} foto dokumentasi kegiatan
                </p>
              ` : ''}
            </div>
        ` : '';
        
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Laporan Aktivitas Pengawas Sekolah</title>
              <style>
                @page {
                  size: A4 portrait;
                  margin: 15mm 20mm 20mm 20mm;
                }
                
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body {
                  font-family: 'Times New Roman', serif;
                  font-size: 12px;
                  line-height: 1.4;
                  color: #333;
                  background: white;
                  max-width: 210mm;
                  margin: 0 auto;
                  padding: 0;
                }
                
                .header {
                  text-align: center;
                  margin-bottom: 25mm;
                  border-bottom: 3px solid #2563eb;
                  padding-bottom: 20px;
                }
                
                .header h1 {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 6px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  color: #1f2937;
                  line-height: 1.2;
                }
                
                .header h2 {
                  font-size: 14px;
                  font-weight: normal;
                  color: #6b7280;
                  margin-bottom: 4px;
                  line-height: 1.2;
                }
                
                .photos-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 10px;
                  margin-top: 15px;
                }
                
                .photo-item {
                  text-align: center;
                  page-break-inside: avoid;
                }
                
                .photo-item img {
                  width: 100%;
                  height: 80px;
                  object-fit: cover;
                  border-radius: 6px;
                  border: 1px solid #e5e7eb;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .photo-caption {
                  font-size: 9px;
                  color: #6b7280;
                  margin-top: 6px;
                  line-height: 1.2;
                  font-weight: 500;
                }
                
                .summary-section {
                  margin: 15px 0;
                  padding: 12px;
                  background: #f9fafb;
                  border-left: 4px solid #2563eb;
                  border-radius: 4px;
                  page-break-inside: avoid;
                }
                
                .stats-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 10px;
                  margin-bottom: 15px;
                }
                
                .stat-item {
                  text-align: center;
                  padding: 10px;
                  background: white;
                  border: 1px solid #e5e7eb;
                  border-radius: 6px;
                  font-size: 11px;
                }
                
                .stat-number {
                  font-size: 20px;
                  font-weight: bold;
                  margin-bottom: 4px;
                  color: #2563eb;
                }
                
                .stat-label {
                  font-size: 10px;
                  text-transform: uppercase;
                  font-weight: 600;
                  color: #6b7280;
                }
                
                .signature-section {
                  margin-top: 30px;
                  text-align: right;
                  page-break-inside: avoid;
                }
                
                .signature-date {
                  margin-bottom: 12px;
                  font-size: 12px;
                }
                
                .signature-title {
                  margin-bottom: 60px;
                  font-size: 12px;
                  font-weight: 600;
                }
                
                .signature-name {
                  font-weight: bold;
                  border-bottom: 2px solid #333;
                  display: inline-block;
                  min-width: 200px;
                  text-align: center;
                  padding-bottom: 4px;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Laporan Aktivitas Pengawas Sekolah</h1>
                <h2>Dinas Pendidikan Provinsi Jawa Barat</h2>
                <h2>Cabang Dinas Pendidikan Wilayah XI</h2>
                <h2>${getPeriodTitle()}</h2>
              </div>
              
              <div class="summary-section">
                <div class="summary-title">Ringkasan Statistik Kegiatan</div>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-number">${activitiesToExport.filter(a => a.type === 'Tugas Tambahan').length}</div>
                    <div class="stat-label">Tugas Tambahan</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">${activitiesToExport.filter(a => a.type === 'Supervisi').length}</div>
                    <div class="stat-label">Supervisi</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">${activitiesToExport.filter(a => a.type === 'Tugas Pokok').length}</div>
                    <div class="stat-label">Tugas Pokok</div>
                  </div>
                </div>
                <p style="font-size: 12px; color: #6b7280; text-align: center;">
                  Total ${activitiesToExport.length} aktivitas telah didokumentasikan, ${activitiesToExport.filter(a => a.photo1 || a.photo2).length} aktivitas dengan foto
                </p>
              </div>
              
              ${photosHTML}
              
              <div class="signature-section">
                <div class="signature-date">Garut, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div class="signature-title">Pengawas Sekolah,</div>
                <div class="signature-name">${profile?.fullName || 'H. Wawan Yogaswara, S.Pd, M.Pd'}</div>
                <div style="margin-top: 10px; font-size: 12px;">NIP: ${profile?.nip || '196805301994121001'}</div>
              </div>
            </body>
          </html>
        `;
      };
      
      // Create and open PDF in new window
      const pdfContent = generatePDFContent();
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        
        // Auto print after content loads
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      } else {
        // Fallback: create downloadable HTML file
        const blob = new Blob([pdfContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Laporan_Aktivitas_${period}_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data aktivitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Laporan Aktivitas</h1>
          <p className="text-muted-foreground mt-1">Laporan aktivitas dengan filter periode</p>
        </div>
      </div>

      {/* Debug Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="text-blue-600">📊</div>
            <div>
              <p className="font-medium text-blue-900">Status Data</p>
              <p className="text-sm text-blue-700">
                Ditemukan {allActivities.length} aktivitas ({allActivities.filter(a => a.photo1 || a.photo2).length} dengan foto)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="semua" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Semua Aktivitas
          </TabsTrigger>
          <TabsTrigger value="bulanan" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Laporan Bulanan
          </TabsTrigger>
          <TabsTrigger value="tahunan" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Laporan Tahunan
          </TabsTrigger>
        </TabsList>

        {/* Semua Aktivitas Tab */}
        <TabsContent value="semua" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Semua Aktivitas</h2>
              <p className="text-muted-foreground">Seluruh aktivitas yang telah didokumentasikan</p>
            </div>
            <Button onClick={() => handleExportPDF("semua")} className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4 mr-2" />
              Export ke PDF
            </Button>
          </div>
          {renderActivitiesContent(getFilteredActivities("semua"))}
        </TabsContent>

        {/* Laporan Bulanan Tab */}
        <TabsContent value="bulanan" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Laporan Bulanan</h2>
              <p className="text-muted-foreground">Aktivitas berdasarkan bulan dan tahun</p>
            </div>
            <Button onClick={() => handleExportPDF("bulanan")} className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF Bulanan
            </Button>
          </div>
          
          {/* Month and Year Selectors */}
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Bulan:</label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tahun:</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {renderActivitiesContent(getFilteredActivities("bulanan"), `${months[selectedMonth]} ${selectedYear}`)}
        </TabsContent>

        {/* Laporan Tahunan Tab */}
        <TabsContent value="tahunan" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Laporan Tahunan</h2>
              <p className="text-muted-foreground">Aktivitas berdasarkan tahun</p>
            </div>
            <Button onClick={() => handleExportPDF("tahunan")} className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF Tahunan
            </Button>
          </div>
          
          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Tahun:</label>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {renderActivitiesContent(getFilteredActivities("tahunan"), `Tahun ${selectedYear}`)}
        </TabsContent>
      </Tabs>

      {/* Export Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Printer className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Export ke PDF</p>
              <p className="text-sm text-blue-700">
                Pilih tab laporan yang diinginkan, lalu klik tombol "Export ke PDF" untuk membuat laporan lengkap
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Helper function to render activities content
  function renderActivitiesContent(activities: any[], periodTitle?: string) {
    return (
      <>
        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Aktivitas {periodTitle || ""}</CardTitle>
            <CardDescription>Total aktivitas yang telah didokumentasikan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {activities.filter((a: any) => a.type === 'Tugas Tambahan').length}
                </div>
                <div className="text-sm text-blue-600">Tugas Tambahan</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {activities.filter((a: any) => a.type === 'Supervisi').length}
                </div>
                <div className="text-sm text-green-600">Supervisi</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {activities.filter((a: any) => a.type === 'Tugas Pokok').length}
                </div>
                <div className="text-sm text-purple-600">Tugas Pokok</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        {activities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {periodTitle ? `Belum ada aktivitas untuk ${periodTitle}` : "Belum ada aktivitas"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Aktivitas akan muncul di sini setelah Anda menambahkan tugas, supervisi, atau kegiatan tambahan
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity: any) => (
              <Card key={`${activity.type}-${activity.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(activity.type)}>
                          {activity.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {activity.source}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(activity.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{activity.organizer}</span>
                        </div>
                        {(activity.photo1 || activity.photo2) && (
                          <Badge variant="outline">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            {[activity.photo1, activity.photo2].filter(Boolean).length} foto
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                {(activity.description || activity.photo1 || activity.photo2) && (
                  <CardContent className="space-y-3">
                    {activity.description && (
                      <div>
                        <p className="text-sm font-medium mb-1">Deskripsi:</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    )}
                    
                    {(activity.photo1 || activity.photo2) && (
                      <div>
                        <p className="text-sm font-medium mb-2">Dokumentasi Foto:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {activity.photo1 && (
                            <div className="space-y-2">
                              <img 
                                src={activity.photo1.startsWith('data:') ? activity.photo1 : `http://localhost:5000/uploads/${activity.photo1}`} 
                                alt="Foto 1" 
                                className="w-full h-48 object-cover rounded-md border"
                                onLoad={() => {
                                  console.log('✅ Photo1 loaded successfully:', activity.photo1);
                                }}
                                onError={(e) => {
                                  console.log('❌ Error loading photo1:', activity.photo1);
                                  const target = e.currentTarget as HTMLImageElement;
                                  
                                  // Try alternative paths
                                  if (target.src.includes('localhost:5000')) {
                                    console.log('🔄 Trying localhost:3000...');
                                    target.src = `http://localhost:3000/uploads/${activity.photo1}`;
                                  } else if (target.src.includes('localhost:3000')) {
                                    console.log('🔄 Trying relative path...');
                                    target.src = `/uploads/${activity.photo1}`;
                                  } else {
                                    console.log('❌ All paths failed, hiding image');
                                    target.style.display = 'none';
                                    // Show error message
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'w-full h-48 bg-gray-100 border rounded-md flex items-center justify-center text-gray-500 text-sm';
                                    errorDiv.innerHTML = `<div class="text-center"><div>📷</div><div>Foto tidak dapat dimuat</div><div class="text-xs">${activity.photo1}</div></div>`;
                                    target.parentNode?.replaceChild(errorDiv, target);
                                  }
                                }}
                              />
                              <p className="text-xs text-center text-muted-foreground">Foto 1</p>
                            </div>
                          )}
                          {activity.photo2 && (
                            <div className="space-y-2">
                              <img 
                                src={activity.photo2.startsWith('data:') ? activity.photo2 : `http://localhost:5000/uploads/${activity.photo2}`} 
                                alt="Foto 2" 
                                className="w-full h-48 object-cover rounded-md border"
                                onLoad={() => {
                                  console.log('✅ Photo2 loaded successfully:', activity.photo2);
                                }}
                                onError={(e) => {
                                  console.log('❌ Error loading photo2:', activity.photo2);
                                  const target = e.currentTarget as HTMLImageElement;
                                  
                                  // Try alternative paths
                                  if (target.src.includes('localhost:5000')) {
                                    console.log('🔄 Trying localhost:3000...');
                                    target.src = `http://localhost:3000/uploads/${activity.photo2}`;
                                  } else if (target.src.includes('localhost:3000')) {
                                    console.log('🔄 Trying relative path...');
                                    target.src = `/uploads/${activity.photo2}`;
                                  } else {
                                    console.log('❌ All paths failed, hiding image');
                                    target.style.display = 'none';
                                    // Show error message
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'w-full h-48 bg-gray-100 border rounded-md flex items-center justify-center text-gray-500 text-sm';
                                    errorDiv.innerHTML = `<div class="text-center"><div>📷</div><div>Foto tidak dapat dimuat</div><div class="text-xs">${activity.photo2}</div></div>`;
                                    target.parentNode?.replaceChild(errorDiv, target);
                                  }
                                }}
                              />
                              <p className="text-xs text-center text-muted-foreground">Foto 2</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </>
    );
  }
}