import { useState, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Printer, Image as ImageIcon, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { supervisionsApi } from "@/lib/api";

type Supervision = {
  id: string;
  school: string;
  type: string;
  date: string;
  teacher_name?: string | null;
  teacher_nip?: string | null;
  findings: string;
  recommendations: string;
  photo1?: string | null;
  photo2?: string | null;
};

export default function SupervisionsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch user data for signature
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      // Get user data from localStorage (same as dashboard)
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        
        // Get additional profile data from localStorage
        const profileData = localStorage.getItem('profile_data');
        const parsedProfile = profileData ? JSON.parse(profileData) : {};
        
        return {
          id: parsedUser.username,
          username: parsedUser.username,
          fullName: parsedUser.fullName,
          role: parsedUser.role,
          ...parsedProfile
        };
      }
      
      throw new Error('No user data found');
    },
  });
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supervisionToDelete, setSupervisionToDelete] = useState<string | null>(null);
  const [editingSupervision, setEditingSupervision] = useState<Supervision | null>(null);
  const [newSupervision, setNewSupervision] = useState({
    school: "",
    type: "Akademik",
    date: "",
    teacherName: "",
    teacherNip: "",
    findings: "",
    recommendations: "",
  });
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [photo1Preview, setPhoto1Preview] = useState<string | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string | null>(null);
  const photo1InputRef = useRef<HTMLInputElement>(null);
  const photo2InputRef = useRef<HTMLInputElement>(null);

  // SIMPLE: Pure Supabase query untuk supervisions
  const { data: supervisions = [], isLoading, refetch } = useQuery({
    queryKey: ['supervisions'],
    queryFn: async () => {
      console.log('🔍 Fetching supervisions from Supabase...');
      
      const { data, error } = await supabase
        .from('supervisions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Supervisions loaded:', data?.length || 0);
      return data || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // SIMPLE: Fetch schools from Supabase
  const { data: schools = [] } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      console.log('🔍 Fetching schools from Supabase...');
      
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('❌ Schools error:', error);
        // Fallback to hardcoded schools if Supabase fails
        return [
          {
            id: "school-smkn4-garut",
            name: "SMKN 4 Garut",
            address: "Jl. Raya Garut No. 200, Garut",
            contact: "0262-2345678",
            principal_name: "Drs. Andi Wijaya, M.Pd",
            principal_nip: "196905101995031001"
          },
          {
            id: "school-sdn1-garut", 
            name: "SDN 1 Garut",
            address: "Jl. Pendidikan No. 1, Garut",
            contact: "0262-1111111",
            principal_name: "Dra. Sri Mulyani, M.Pd",
            principal_nip: "196801011990032001"
          },
          {
            id: "school-smpn1-garut",
            name: "SMPN 1 Garut", 
            address: "Jl. Ahmad Yani No. 50, Garut",
            contact: "0262-2222222",
            principal_name: "Drs. Bambang Sutrisno, M.Pd",
            principal_nip: "196702021991031002"
          }
        ];
      }
      
      console.log('✅ Schools loaded:', data?.length || 0);
      return data || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // SIMPLE: Delete supervision function - Pure Supabase
  const handleDeleteSupervision = async (id: string) => {
    try {
      console.log('🗑️ Deleting supervision:', id);
      
      const { error } = await supabase
        .from('supervisions')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Delete error:', error);
        throw error;
      }
      
      console.log('✅ Supervision deleted');
      
      // Refresh data
      refetch();
      
      toast({
        title: "Berhasil",
        description: "Supervisi berhasil dihapus",
      });
      
      setDeleteDialogOpen(false);
      setSupervisionToDelete(null);
      
    } catch (error: any) {
      console.error('❌ Delete supervision error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat menghapus supervisi",
        variant: "destructive",
      });
    }
  };

  // SIMPLE: Add supervision function - Pure Supabase
  const handleAddSupervision = async () => {
    try {
      console.log('📝 Adding supervision...');
      
      // Validate required fields
      if (!newSupervision.school) {
        toast({
          title: "Error",
          description: "Pilih sekolah terlebih dahulu",
          variant: "destructive",
        });
        return;
      }

      if (!newSupervision.findings.trim()) {
        toast({
          title: "Error", 
          description: "Temuan harus diisi",
          variant: "destructive",
        });
        return;
      }

      // Get current user - SIMPLIFIED
      const userData = localStorage.getItem('auth_user');
      if (!userData) {
        toast({
          title: "Error",
          description: "Silakan login terlebih dahulu",
          variant: "destructive",
        });
        return;
      }
      
      const currentUser = JSON.parse(userData);
      
      // Use simple string user_id (no UUID constraint)
      const userId = currentUser.username || 'user-' + Date.now();
      
      console.log('👤 User ID:', userId);
      
      // Convert photos to base64 if exists
      let photo1Base64 = null;
      let photo2Base64 = null;
      
      if (photo1) {
        const reader = new FileReader();
        photo1Base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo1);
        });
      }
      
      if (photo2) {
        const reader = new FileReader();
        photo2Base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo2);
        });
      }
      
      const { data, error } = await supabase
        .from('supervisions')
        .insert([{
          user_id: userId,
          school: newSupervision.school,
          type: newSupervision.type,
          date: newSupervision.date || new Date().toISOString().split('T')[0],
          teacher_name: newSupervision.teacherName || null,
          teacher_nip: newSupervision.teacherNip || null,
          findings: newSupervision.findings,
          recommendations: newSupervision.recommendations || null,
          photo1: photo1Base64,
          photo2: photo2Base64
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Insert error:', error);
        throw error;
      }
      
      console.log('✅ Supervision added:', data);
      
      // Refresh data
      refetch();
      
      // Success feedback
      toast({
        title: "Berhasil",
        description: "Supervisi berhasil ditambahkan",
      });
      
      // Reset form
      setNewSupervision({ school: "", type: "Akademik", date: "", teacherName: "", teacherNip: "", findings: "", recommendations: "" });
      setPhoto1(null);
      setPhoto2(null);
      setPhoto1Preview(null);
      setPhoto2Preview(null);
      setIsAddDialogOpen(false);
      
    } catch (error: any) {
      console.error('❌ Add supervision error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat menyimpan supervisi",
        variant: "destructive",
      });
    }
  };

  const groupBySchool = () => {
    const grouped: { [key: string]: Supervision[] } = {};
    supervisions.forEach((supervision: Supervision) => {
      if (!grouped[supervision.school]) {
        grouped[supervision.school] = [];
      }
      grouped[supervision.school].push(supervision);
    });
    return grouped;
  };

  const openDeleteDialog = (id: string) => {
    setSupervisionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (supervisionToDelete) {
      handleDeleteSupervision(supervisionToDelete);
    }
  };

  // SIMPLE: Update supervision function - Pure Supabase
  const handleUpdateSupervision = async () => {
    if (!editingSupervision) return;

    try {
      console.log('📝 Updating supervision...');
      
      // Get current user
      const userData = localStorage.getItem('auth_user');
      if (!userData) {
        toast({
          title: "Error",
          description: "Silakan login terlebih dahulu",
          variant: "destructive",
        });
        return;
      }
      
      // Convert photos to base64 if exists
      let photo1Base64 = photo1Preview; // Keep existing if no new photo
      let photo2Base64 = photo2Preview; // Keep existing if no new photo
      
      if (photo1) {
        const reader = new FileReader();
        photo1Base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo1);
        });
      }
      
      if (photo2) {
        const reader = new FileReader();
        photo2Base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo2);
        });
      }
      
      const { data, error } = await supabase
        .from('supervisions')
        .update({
          school: newSupervision.school,
          type: newSupervision.type,
          date: newSupervision.date || editingSupervision.date,
          teacher_name: newSupervision.teacherName || null,
          teacher_nip: newSupervision.teacherNip || null,
          findings: newSupervision.findings,
          recommendations: newSupervision.recommendations || null,
          photo1: photo1Base64,
          photo2: photo2Base64,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingSupervision.id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Update error:', error);
        throw error;
      }
      
      console.log('✅ Supervision updated:', data);
      
      // Refresh data
      refetch();
      
      // Success feedback
      toast({
        title: "Berhasil",
        description: "Supervisi berhasil diupdate",
      });
      
      // Reset form
      setEditingSupervision(null);
      setNewSupervision({ school: "", type: "Akademik", date: "", teacherName: "", teacherNip: "", findings: "", recommendations: "" });
      setPhoto1(null);
      setPhoto2(null);
      setPhoto1Preview(null);
      setPhoto2Preview(null);
      setIsEditDialogOpen(false);
      
    } catch (error: any) {
      console.error('❌ Update supervision error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat mengupdate supervisi",
        variant: "destructive",
      });
    }
  };

  const handleEditSupervision = (supervision: Supervision) => {
    setEditingSupervision(supervision);
    setNewSupervision({
      school: supervision.school,
      type: supervision.type,
      date: supervision.date,
      teacherName: supervision.teacher_name || "",
      teacherNip: supervision.teacher_nip || "",
      findings: supervision.findings,
      recommendations: supervision.recommendations,
    });
    // Set existing photos as preview
    if (supervision.photo1) {
      const photoUrl = supervision.photo1.startsWith('data:') ? supervision.photo1 : `/uploads/${supervision.photo1}`;
      setPhoto1Preview(photoUrl);
    }
    if (supervision.photo2) {
      const photoUrl = supervision.photo2.startsWith('data:') ? supervision.photo2 : `/uploads/${supervision.photo2}`;
      setPhoto2Preview(photoUrl);
    }
    setIsEditDialogOpen(true);
  };



  const getTypeColor = (type: string) => {
    return type === "Akademik" 
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  };

  const handlePrintSupervision = (supervision: Supervision) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const photos = [];
    if (supervision.photo1) {
      const photoUrl = supervision.photo1.startsWith('data:') ? supervision.photo1 : `/uploads/${supervision.photo1}`;
      photos.push({ url: photoUrl, label: 'Foto 1' });
    }
    if (supervision.photo2) {
      const photoUrl = supervision.photo2.startsWith('data:') ? supervision.photo2 : `/uploads/${supervision.photo2}`;
      photos.push({ url: photoUrl, label: 'Foto 2' });
    }
    
    const photosHtml = photos.length > 0
      ? `
        <div style="margin-top: 20px; page-break-inside: avoid;">
          <h3 style="color: #2563eb; margin-bottom: 12px; font-size: 14px;">Foto Supervisi:</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            ${photos.map(photo => `
              <div>
                <img src="${photo.url}" alt="${photo.label}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb;" />
                <p style="text-align: center; margin-top: 4px; font-size: 11px; color: #666;">${photo.label}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `
      : '';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Supervisi - ${supervision.school}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            
            * {
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              font-size: 11pt;
              line-height: 1.4;
              color: #333;
              margin: 0;
              padding: 0;
              width: 210mm;
              min-height: 297mm;
            }
            
            .container {
              padding: 15mm;
              max-width: 100%;
            }
            
            h1 {
              color: #1e40af;
              font-size: 18pt;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 8px;
              margin: 0 0 15px 0;
              text-align: center;
            }
            
            .info-row {
              display: flex;
              margin-bottom: 8px;
              padding: 6px 10px;
              background: #f9fafb;
              border-radius: 4px;
              page-break-inside: avoid;
            }
            
            .info-label {
              font-weight: bold;
              width: 140px;
              color: #555;
              font-size: 10pt;
            }
            
            .info-value {
              flex: 1;
              color: #333;
              font-size: 10pt;
            }
            
            .badge {
              display: inline-block;
              padding: 3px 10px;
              border-radius: 10px;
              font-size: 10pt;
              font-weight: 500;
              background: ${supervision.type === 'Akademik' ? '#dbeafe' : '#dcfce7'};
              color: ${supervision.type === 'Akademik' ? '#1e40af' : '#166534'};
            }
            
            .section {
              margin-top: 15px;
              padding: 12px;
              background: #f9fafb;
              border-left: 3px solid #2563eb;
              border-radius: 4px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 8px;
              font-size: 11pt;
            }
            
            .section-content {
              font-size: 10pt;
              line-height: 1.5;
              color: #333;
            }
            
            .signature-section {
              margin-top: 30px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              page-break-inside: avoid;
            }
            
            .signature-box {
              text-align: center;
            }
            
            .signature-label {
              font-weight: bold;
              margin-bottom: 60px;
              color: #333;
              font-size: 10pt;
            }
            
            .signature-name {
              border-top: 1px solid #333;
              padding-top: 4px;
              font-weight: bold;
              color: #333;
              font-size: 10pt;
            }
            
            .signature-nip {
              font-size: 9pt;
              color: #666;
              margin-top: 3px;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .container {
                padding: 15mm;
              }
              @page {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>LAPORAN SUPERVISI</h1>
            
            <div class="info-row">
              <div class="info-label">Sekolah:</div>
              <div class="info-value">${supervision.school}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Jenis Supervisi:</div>
              <div class="info-value"><span class="badge">${supervision.type}</span></div>
            </div>
            <div class="info-row">
              <div class="info-label">Tanggal:</div>
              <div class="info-value">${new Date(supervision.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            ${supervision.teacher_name ? `
            <div class="info-row">
              <div class="info-label">Guru:</div>
              <div class="info-value">${supervision.teacher_name}${supervision.teacher_nip ? ` (NIP: ${supervision.teacher_nip})` : ''}</div>
            </div>
            ` : ''}
            <div class="info-row">
              <div class="info-label">Jumlah Foto:</div>
              <div class="info-value">${[supervision.photo1, supervision.photo2].filter(Boolean).length} foto</div>
            </div>
            
            <div class="section">
              <div class="section-title">Temuan / Hasil Supervisi:</div>
              <div class="section-content">${supervision.findings}</div>
            </div>
            
            ${supervision.recommendations ? `
            <div class="section">
              <div class="section-title">Rekomendasi:</div>
              <div class="section-content">${supervision.recommendations}</div>
            </div>
            ` : ''}
            
            ${photosHtml}
            
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-label">Guru yang Disupervisi</div>
                <div class="signature-name">${supervision.teacher_name || '(...........................)'}</div>
                ${supervision.teacher_nip ? `<div class="signature-nip">NIP/NUPTK: ${supervision.teacher_nip}</div>` : ''}
              </div>
              <div class="signature-box">
                <div class="signature-label">Pengawas Sekolah</div>
                <div class="signature-name">${user?.fullName || 'Pengawas'}</div>
                ${user?.nip ? `<div class="signature-nip">NIP: ${user.nip}</div>` : ''}
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kegiatan Supervisi</h1>
          <p className="text-muted-foreground mt-1">Catat hasil supervisi akademik dan manajerial</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              data-testid="button-add-supervision"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '40px'
              }}
            >
              <Plus className="h-4 w-4" style={{ marginRight: '8px' }} />
              Tambah Supervisi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Supervisi Baru</DialogTitle>
              <DialogDescription>Catat hasil supervisi ke sekolah binaan</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supervision-school">Sekolah</Label>
                  <Select value={newSupervision.school} onValueChange={(value) => setNewSupervision({ ...newSupervision, school: value })}>
                    <SelectTrigger id="supervision-school" data-testid="select-supervision-school">
                      <SelectValue placeholder="Pilih sekolah" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.length === 0 ? (
                        <SelectItem value="no-school" disabled>Belum ada sekolah</SelectItem>
                      ) : (
                        schools.map((school: any) => (
                          <SelectItem key={school.id} value={school.name}>
                            {school.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supervision-type">Jenis Supervisi</Label>
                  <Select value={newSupervision.type} onValueChange={(value) => setNewSupervision({ ...newSupervision, type: value })}>
                    <SelectTrigger id="supervision-type" data-testid="select-supervision-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Akademik">Akademik</SelectItem>
                      <SelectItem value="Manajerial">Manajerial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervision-date">Tanggal Kegiatan</Label>
                <Input
                  id="supervision-date"
                  type="date"
                  value={newSupervision.date}
                  onChange={(e) => setNewSupervision({ ...newSupervision, date: e.target.value })}
                  data-testid="input-supervision-date"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-name">Nama Guru</Label>
                  <Input
                    id="teacher-name"
                    value={newSupervision.teacherName}
                    onChange={(e) => setNewSupervision({ ...newSupervision, teacherName: e.target.value })}
                    placeholder="Nama lengkap guru"
                    data-testid="input-teacher-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-nip">NIP/NUPTK Guru</Label>
                  <Input
                    id="teacher-nip"
                    value={newSupervision.teacherNip}
                    onChange={(e) => setNewSupervision({ ...newSupervision, teacherNip: e.target.value })}
                    placeholder="NIP atau NUPTK"
                    data-testid="input-teacher-nip"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervision-findings">Temuan / Hasil Supervisi</Label>
                <Textarea
                  id="supervision-findings"
                  value={newSupervision.findings}
                  onChange={(e) => setNewSupervision({ ...newSupervision, findings: e.target.value })}
                  placeholder="Catatan hasil supervisi"
                  rows={4}
                  data-testid="input-supervision-findings"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervision-recommendations">Rekomendasi</Label>
                <Textarea
                  id="supervision-recommendations"
                  value={newSupervision.recommendations}
                  onChange={(e) => setNewSupervision({ ...newSupervision, recommendations: e.target.value })}
                  placeholder="Saran dan rekomendasi"
                  rows={3}
                  data-testid="input-supervision-recommendations"
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Foto (Maksimal 2)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      ref={photo1InputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto1(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPhoto1Preview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      onClick={() => photo1InputRef.current?.click()}
                      className="border-2 border-dashed rounded-md p-6 text-center hover-elevate cursor-pointer relative"
                    >
                      {photo1Preview ? (
                        <>
                          <img src={photo1Preview} alt="Preview 1" className="w-full h-32 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhoto1(null);
                              setPhoto1Preview(null);
                              if (photo1InputRef.current) photo1InputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Foto 1</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <input
                      ref={photo2InputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto2(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPhoto2Preview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      onClick={() => photo2InputRef.current?.click()}
                      className="border-2 border-dashed rounded-md p-6 text-center hover-elevate cursor-pointer relative"
                    >
                      {photo2Preview ? (
                        <>
                          <img src={photo2Preview} alt="Preview 2" className="w-full h-32 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhoto2(null);
                              setPhoto2Preview(null);
                              if (photo2InputRef.current) photo2InputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Foto 2</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)} 
                  data-testid="button-cancel-supervision"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleAddSupervision} 
                  disabled={!newSupervision.school || !newSupervision.findings.trim()} 
                  data-testid="button-save-supervision"
                  style={{
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Simpan Supervisi
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Supervisi</DialogTitle>
              <DialogDescription>Update hasil supervisi</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-supervision-school">Sekolah</Label>
                  <Select value={newSupervision.school} onValueChange={(value) => setNewSupervision({ ...newSupervision, school: value })}>
                    <SelectTrigger id="edit-supervision-school">
                      <SelectValue placeholder="Pilih sekolah" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.length === 0 ? (
                        <SelectItem value="no-school" disabled>Belum ada sekolah</SelectItem>
                      ) : (
                        schools.map((school: any) => (
                          <SelectItem key={school.id} value={school.name}>
                            {school.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-supervision-type">Jenis Supervisi</Label>
                  <Select value={newSupervision.type} onValueChange={(value) => setNewSupervision({ ...newSupervision, type: value })}>
                    <SelectTrigger id="edit-supervision-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Akademik">Akademik</SelectItem>
                      <SelectItem value="Manajerial">Manajerial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-supervision-date">Tanggal Kegiatan</Label>
                <Input
                  id="edit-supervision-date"
                  type="date"
                  value={newSupervision.date}
                  onChange={(e) => setNewSupervision({ ...newSupervision, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-teacher-name">Nama Guru</Label>
                  <Input
                    id="edit-teacher-name"
                    value={newSupervision.teacherName}
                    onChange={(e) => setNewSupervision({ ...newSupervision, teacherName: e.target.value })}
                    placeholder="Nama lengkap guru"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-teacher-nip">NIP/NUPTK Guru</Label>
                  <Input
                    id="edit-teacher-nip"
                    value={newSupervision.teacherNip}
                    onChange={(e) => setNewSupervision({ ...newSupervision, teacherNip: e.target.value })}
                    placeholder="NIP atau NUPTK"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-supervision-findings">Temuan / Hasil Supervisi</Label>
                <Textarea
                  id="edit-supervision-findings"
                  value={newSupervision.findings}
                  onChange={(e) => setNewSupervision({ ...newSupervision, findings: e.target.value })}
                  placeholder="Catatan hasil supervisi"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-supervision-recommendations">Rekomendasi</Label>
                <Textarea
                  id="edit-supervision-recommendations"
                  value={newSupervision.recommendations}
                  onChange={(e) => setNewSupervision({ ...newSupervision, recommendations: e.target.value })}
                  placeholder="Saran dan rekomendasi"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Foto (Maksimal 2)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      ref={photo1InputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto1(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPhoto1Preview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      onClick={() => photo1InputRef.current?.click()}
                      className="border-2 border-dashed rounded-md p-6 text-center hover-elevate cursor-pointer relative"
                    >
                      {photo1Preview ? (
                        <>
                          <img src={photo1Preview} alt="Preview 1" className="w-full h-32 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhoto1(null);
                              setPhoto1Preview(null);
                              if (photo1InputRef.current) photo1InputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Foto 1</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <input
                      ref={photo2InputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto2(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPhoto2Preview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      onClick={() => photo2InputRef.current?.click()}
                      className="border-2 border-dashed rounded-md p-6 text-center hover-elevate cursor-pointer relative"
                    >
                      {photo2Preview ? (
                        <>
                          <img src={photo2Preview} alt="Preview 2" className="w-full h-32 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhoto2(null);
                              setPhoto2Preview(null);
                              if (photo2InputRef.current) photo2InputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Foto 2</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingSupervision(null);
                  setPhoto1(null);
                  setPhoto2(null);
                  setPhoto1Preview(null);
                  setPhoto2Preview(null);
                }}>
                  Batal
                </Button>
                <Button onClick={handleUpdateSupervision} disabled={!newSupervision.school || !newSupervision.findings}>
                  Update Supervisi
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-supervisions">Semua Supervisi</TabsTrigger>
          <TabsTrigger value="byschool" data-testid="tab-by-school">Per Sekolah</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {supervisions.map((supervision: Supervision) => (
            <Card key={supervision.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{supervision.school}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={getTypeColor(supervision.type)} variant="secondary">
                        {supervision.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{supervision.date}</span>
                      {(supervision.photo1 || supervision.photo2) && (
                        <Badge variant="outline" className="text-xs">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {[supervision.photo1, supervision.photo2].filter(Boolean).length} foto
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePrintSupervision(supervision)} data-testid={`button-print-supervision-${supervision.id}`}>
                      <Printer className="h-4 w-4 mr-2" />
                      Cetak
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditSupervision(supervision)} data-testid={`button-edit-supervision-${supervision.id}`}>
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openDeleteDialog(supervision.id)} data-testid={`button-delete-supervision-${supervision.id}`}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Temuan:</p>
                  <p className="text-sm text-muted-foreground">{supervision.findings}</p>
                </div>
                {supervision.recommendations && (
                  <div>
                    <p className="text-sm font-medium mb-1">Rekomendasi:</p>
                    <p className="text-sm text-muted-foreground">{supervision.recommendations}</p>
                  </div>
                )}
                {(supervision.photo1 || supervision.photo2) && (
                  <div>
                    <p className="text-sm font-medium mb-2">Foto Supervisi:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {supervision.photo1 && (
                        <img 
                          src={supervision.photo1.startsWith('data:') ? supervision.photo1 : `/uploads/${supervision.photo1}`} 
                          alt="Foto 1" 
                          className="w-full h-40 object-cover rounded-md border"
                        />
                      )}
                      {supervision.photo2 && (
                        <img 
                          src={supervision.photo2.startsWith('data:') ? supervision.photo2 : `/uploads/${supervision.photo2}`} 
                          alt="Foto 2" 
                          className="w-full h-40 object-cover rounded-md border"
                        />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="byschool" className="space-y-6 mt-6">
          {Object.entries(groupBySchool()).map(([school, schoolSupervisions]) => (
            <Card key={school}>
              <CardHeader>
                <CardTitle>{school}</CardTitle>
                <p className="text-sm text-muted-foreground">{schoolSupervisions.length} supervisi tercatat</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {schoolSupervisions.map((supervision) => (
                  <div key={supervision.id} className="border-l-4 border-primary pl-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(supervision.type)} variant="secondary">
                        {supervision.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{supervision.date}</span>
                    </div>
                    <p className="text-sm">{supervision.findings}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Supervisi?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus supervisi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
