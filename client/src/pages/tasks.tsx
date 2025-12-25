import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Image as ImageIcon, X, Edit, Printer } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  photo?: string | null;
  photo2?: string | null;
  created_at?: string;
  activity_type?: string;
  school_id?: string;
  school_name?: string;
};

export default function TasksPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({ 
    title: "", 
    description: "", 
    completed: false,
    date: new Date().toISOString().split('T')[0],
    activity_type: "",
    school_id: ""
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const photo2InputRef = useRef<HTMLInputElement>(null);

  // SIMPLE: Pure Supabase query
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('🔍 Fetching tasks from Supabase...');
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Tasks loaded:', data?.length || 0);
      return data || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Query untuk mengambil data sekolah
  const { data: schools = [] } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      console.log('🔍 Fetching schools from Supabase...');
      
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('❌ Supabase schools error:', error);
        throw error;
      }
      
      console.log('✅ Schools loaded:', data?.length || 0);
      return data || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, photoNumber: 1 | 2 = 1) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "File harus berupa gambar",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: "Error",
        description: "Ukuran file maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    if (photoNumber === 1) {
      setPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhoto2(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto2Preview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (photoNumber: 1 | 2 = 1) => {
    if (photoNumber === 1) {
      setPhoto(null);
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
        setPhotoPreview(null);
      }
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    } else {
      setPhoto2(null);
      if (photo2Preview) {
        URL.revokeObjectURL(photo2Preview);
        setPhoto2Preview(null);
      }
      if (photo2InputRef.current) {
        photo2InputRef.current.value = '';
      }
    }
  };

  // SIMPLE: Add task function - Pure Supabase
  const handleAddTask = async () => {
    try {
      console.log('📝 Adding task:', newTask.title);
      
      if (!newTask.title || !newTask.description || !newTask.activity_type || !newTask.school_id) {
        toast({
          title: "Error",
          description: "Semua field wajib harus diisi",
          variant: "destructive",
        });
        return;
      }
      
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
      
      const currentUser = JSON.parse(userData);
      
      // Get school name
      const selectedSchool = schools.find(school => school.id === newTask.school_id);
      
      // Convert photos to base64 if exists
      let photoBase64 = null;
      let photo2Base64 = null;
      
      if (photo) {
        const reader = new FileReader();
        photoBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo);
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
        .from('tasks')
        .insert([{
          user_id: currentUser.id,
          title: newTask.title,
          description: newTask.description,
          completed: newTask.completed,
          date: newTask.date,
          photo: photoBase64,
          photo2: photo2Base64,
          activity_type: newTask.activity_type,
          school_id: newTask.school_id,
          school_name: selectedSchool?.name || ''
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Insert error:', error);
        throw error;
      }
      
      console.log('✅ Task added:', data);
      
      // Refresh data
      refetch();
      
      // Success feedback
      toast({
        title: "Berhasil",
        description: "Tugas berhasil ditambahkan",
      });
      
      // Reset form
      setNewTask({ 
        title: "", 
        description: "", 
        completed: false, 
        date: new Date().toISOString().split('T')[0],
        activity_type: "",
        school_id: ""
      });
      removePhoto(1);
      removePhoto(2);
      setIsAddDialogOpen(false);
      
    } catch (error: any) {
      console.error('❌ Add task error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat menyimpan tugas",
        variant: "destructive",
      });
    }
  };

  // SIMPLE: Delete task function - Pure Supabase
  const handleDeleteTask = async (id: string) => {
    try {
      console.log('🗑️ Deleting task:', id);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Delete error:', error);
        throw error;
      }
      
      console.log('✅ Task deleted');
      
      // Refresh data
      refetch();
      
      toast({
        title: "Berhasil",
        description: "Tugas berhasil dihapus",
      });
      
    } catch (error: any) {
      console.error('❌ Delete task error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat menghapus tugas",
        variant: "destructive",
      });
    }
  };

  // SIMPLE: Toggle complete function - Pure Supabase
  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      console.log('✅ Toggling task completion:', id, completed);
      
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', id);
      
      if (error) {
        console.error('❌ Update error:', error);
        throw error;
      }
      
      console.log('✅ Task status updated');
      
      // Refresh data
      refetch();
      
      toast({
        title: "Berhasil",
        description: `Tugas ${completed ? 'selesai' : 'belum selesai'}`,
      });
      
    } catch (error: any) {
      console.error('❌ Toggle complete error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat mengupdate status tugas",
        variant: "destructive",
      });
    }
  };

  // EDIT: Edit task function
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      completed: task.completed,
      date: task.date,
      activity_type: task.activity_type || "",
      school_id: task.school_id || ""
    });
    if (task.photo) {
      setPhotoPreview(task.photo);
    }
    if ((task as any).photo2) {
      setPhoto2Preview((task as any).photo2);
    }
    setIsEditDialogOpen(true);
  };

  // EDIT: Update task function
  const handleUpdateTask = async () => {
    if (!editingTask) return;
    
    try {
      console.log('📝 Updating task:', editingTask.id);
      
      if (!newTask.title || !newTask.description || !newTask.activity_type || !newTask.school_id) {
        toast({
          title: "Error",
          description: "Semua field wajib harus diisi",
          variant: "destructive",
        });
        return;
      }
      
      // Get school name
      const selectedSchool = schools.find(school => school.id === newTask.school_id);
      
      // Convert photos to base64 if new photos are selected
      let photoBase64 = photoPreview;
      let photo2Base64 = photo2Preview;
      
      if (photo) {
        const reader = new FileReader();
        photoBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo);
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
        .from('tasks')
        .update({
          title: newTask.title,
          description: newTask.description,
          completed: newTask.completed,
          date: newTask.date,
          photo: photoBase64,
          photo2: photo2Base64,
          activity_type: newTask.activity_type,
          school_id: newTask.school_id,
          school_name: selectedSchool?.name || ''
        })
        .eq('id', editingTask.id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Update error:', error);
        throw error;
      }
      
      console.log('✅ Task updated:', data);
      
      // Refresh data
      refetch();
      
      // Success feedback
      toast({
        title: "Berhasil",
        description: "Tugas berhasil diperbarui",
      });
      
      // Reset form
      setNewTask({ 
        title: "", 
        description: "", 
        completed: false, 
        date: new Date().toISOString().split('T')[0],
        activity_type: "",
        school_id: ""
      });
      removePhoto(1);
      removePhoto(2);
      setIsEditDialogOpen(false);
      setEditingTask(null);
      
    } catch (error: any) {
      console.error('❌ Update task error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat memperbarui tugas",
        variant: "destructive",
      });
    }
  };

  // PRINT: Print task function
  const handlePrintTask = (task: Task) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cetak Tugas Harian - ${task.title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #333; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .title { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .subtitle { 
            font-size: 16px; 
            color: #666;
          }
          .content { 
            margin-bottom: 20px;
          }
          .field { 
            margin-bottom: 15px;
          }
          .field-label { 
            font-weight: bold; 
            display: inline-block; 
            width: 120px;
          }
          .field-value { 
            display: inline-block;
          }
          .description { 
            margin-top: 10px; 
            padding: 10px; 
            background-color: #f5f5f5; 
            border-radius: 5px;
          }
          .photo { 
            max-width: 300px; 
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .footer { 
            margin-top: 40px; 
            text-align: right;
          }
          .signature { 
            margin-top: 60px; 
            text-align: right;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">LAPORAN TUGAS HARIAN</div>
          <div class="subtitle">Sistem Kepengawasan Sekolah</div>
        </div>
        
        <div class="content">
          <div class="field">
            <span class="field-label">Judul Tugas:</span>
            <span class="field-value">${task.title}</span>
          </div>
          
          <div class="field">
            <span class="field-label">Tanggal:</span>
            <span class="field-value">${new Date(task.date).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          
          <div class="field">
            <span class="field-label">Status:</span>
            <span class="field-value">${task.completed ? '✅ Selesai' : '⏳ Belum Selesai'}</span>
          </div>
          
          <div class="field">
            <span class="field-label">Pengawas:</span>
            <span class="field-value">${currentUser.fullName || currentUser.full_name || currentUser.username || 'Tidak diketahui'}</span>
          </div>
          
          ${currentUser.nip ? `
          <div class="field">
            <span class="field-label">NIP:</span>
            <span class="field-value">${currentUser.nip}</span>
          </div>
          ` : ''}
          
          <div class="field">
            <span class="field-label">Deskripsi:</span>
          </div>
          <div class="description">
            ${task.description.replace(/\n/g, '<br>')}
          </div>
          
          ${task.photo || (task as any).photo2 ? `
          <div class="field">
            <span class="field-label">Foto:</span>
          </div>
          ${task.photo ? `<img src="${task.photo}" alt="Foto Tugas 1" class="photo"><p style="text-align: center; font-size: 10px; margin: 5px 0;">Foto 1</p>` : ''}
          ${(task as any).photo2 ? `<img src="${(task as any).photo2}" alt="Foto Tugas 2" class="photo"><p style="text-align: center; font-size: 10px; margin: 5px 0;">Foto 2</p>` : ''}
          ` : ''}
        </div>
        
        <div class="footer">
          <p>Dicetak pada: ${new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        <div class="signature">
          <p>Pengawas Sekolah</p>
          <br><br><br>
          <p><u>${currentUser.fullName || currentUser.full_name || currentUser.username || 'Nama Pengawas'}</u></p>
          ${currentUser.nip ? `<p>NIP. ${currentUser.nip}</p>` : ''}
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data tugas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tugas Harian</h1>
          <p className="text-muted-foreground mt-1">Kelola tugas dan aktivitas harian Anda</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Tugas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Tugas Baru</DialogTitle>
              <DialogDescription>Buat tugas baru untuk aktivitas harian Anda</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Judul Tugas</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Contoh: Menyiapkan laporan bulanan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-date">Tanggal</Label>
                <Input
                  id="task-date"
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-type">Jenis Kegiatan</Label>
                <Select value={newTask.activity_type} onValueChange={(value) => setNewTask({ ...newTask, activity_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kegiatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perencanaan">Perencanaan</SelectItem>
                    <SelectItem value="Pendampingan">Pendampingan</SelectItem>
                    <SelectItem value="Pelaporan">Pelaporan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school-select">Tempat Kegiatan (Sekolah Binaan)</Label>
                <Select value={newTask.school_id} onValueChange={(value) => setNewTask({ ...newTask, school_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sekolah binaan" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-description">Deskripsi</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Deskripsi detail tugas..."
                  rows={4}
                />
              </div>
              
              {/* Photo Upload Section */}
              <div className="space-y-2">
                <Label>Foto Kegiatan (Opsional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Foto 1 */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Foto 1</Label>
                    {!photo && !photoPreview && (
                      <div className="flex items-center gap-2">
                        <Input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, 1)}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Label
                          htmlFor="photo-upload"
                          className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full justify-center"
                        >
                          <ImageIcon className="h-4 w-4" />
                          <span>Pilih Foto 1</span>
                        </Label>
                      </div>
                    )}
                    
                    {photoPreview && (
                      <div className="relative group">
                        <img
                          src={photoPreview}
                          alt="Preview Foto 1"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(1)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Foto 2 */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Foto 2</Label>
                    {!photo2 && !photo2Preview && (
                      <div className="flex items-center gap-2">
                        <Input
                          ref={photo2InputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, 2)}
                          className="hidden"
                          id="photo2-upload"
                        />
                        <Label
                          htmlFor="photo2-upload"
                          className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full justify-center"
                        >
                          <ImageIcon className="h-4 w-4" />
                          <span>Pilih Foto 2</span>
                        </Label>
                      </div>
                    )}
                    
                    {photo2Preview && (
                      <div className="relative group">
                        <img
                          src={photo2Preview}
                          alt="Preview Foto 2"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(2)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="task-completed"
                  checked={newTask.completed}
                  onCheckedChange={(checked) => setNewTask({ ...newTask, completed: !!checked })}
                />
                <Label htmlFor="task-completed">Tandai sebagai selesai</Label>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddTask} disabled={!newTask.title || !newTask.description || !newTask.activity_type || !newTask.school_id}>
                  Simpan Tugas
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Tugas</DialogTitle>
              <DialogDescription>Perbarui informasi tugas Anda</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-title">Judul Tugas</Label>
                <Input
                  id="edit-task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Contoh: Menyiapkan laporan bulanan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-task-date">Tanggal</Label>
                <Input
                  id="edit-task-date"
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-activity-type">Jenis Kegiatan</Label>
                <Select value={newTask.activity_type} onValueChange={(value) => setNewTask({ ...newTask, activity_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kegiatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perencanaan">Perencanaan</SelectItem>
                    <SelectItem value="Pendampingan">Pendampingan</SelectItem>
                    <SelectItem value="Pelaporan">Pelaporan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-school-select">Tempat Kegiatan (Sekolah Binaan)</Label>
                <Select value={newTask.school_id} onValueChange={(value) => setNewTask({ ...newTask, school_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sekolah binaan" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-task-description">Deskripsi</Label>
                <Textarea
                  id="edit-task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Deskripsi detail tugas..."
                  rows={4}
                />
              </div>
              
              {/* Photo Upload Section */}
              <div className="space-y-2">
                <Label>Foto Kegiatan (Opsional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Foto 1 */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Foto 1</Label>
                    {!photo && !photoPreview && (
                      <div className="flex items-center gap-2">
                        <Input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, 1)}
                          className="hidden"
                          id="edit-photo-upload"
                        />
                        <Label
                          htmlFor="edit-photo-upload"
                          className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full justify-center"
                        >
                          <ImageIcon className="h-4 w-4" />
                          <span>Pilih Foto 1</span>
                        </Label>
                      </div>
                    )}
                    
                    {photoPreview && (
                      <div className="relative group">
                        <img
                          src={photoPreview}
                          alt="Preview Foto 1"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(1)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            if (photoInputRef.current) {
                              photoInputRef.current.click();
                            }
                          }}
                        >
                          Ganti Foto
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Foto 2 */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Foto 2</Label>
                    {!photo2 && !photo2Preview && (
                      <div className="flex items-center gap-2">
                        <Input
                          ref={photo2InputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, 2)}
                          className="hidden"
                          id="edit-photo2-upload"
                        />
                        <Label
                          htmlFor="edit-photo2-upload"
                          className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full justify-center"
                        >
                          <ImageIcon className="h-4 w-4" />
                          <span>Pilih Foto 2</span>
                        </Label>
                      </div>
                    )}
                    
                    {photo2Preview && (
                      <div className="relative group">
                        <img
                          src={photo2Preview}
                          alt="Preview Foto 2"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(2)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            if (photo2InputRef.current) {
                              photo2InputRef.current.click();
                            }
                          }}
                        >
                          Ganti Foto
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-task-completed"
                  checked={newTask.completed}
                  onCheckedChange={(checked) => setNewTask({ ...newTask, completed: !!checked })}
                />
                <Label htmlFor="edit-task-completed">Tandai sebagai selesai</Label>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingTask(null);
                  setNewTask({ 
                    title: "", 
                    description: "", 
                    completed: false, 
                    date: new Date().toISOString().split('T')[0],
                    activity_type: "",
                    school_id: ""
                  });
                  removePhoto(1);
                  removePhoto(2);
                }}>
                  Batal
                </Button>
                <Button onClick={handleUpdateTask} disabled={!newTask.title || !newTask.description || !newTask.activity_type || !newTask.school_id}>
                  Perbarui Tugas
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task: Task) => (
          <Card key={task.id} className={`hover:shadow-md transition-shadow ${task.completed ? 'opacity-75' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => handleToggleComplete(task.id, !!checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <CardTitle className={`text-lg leading-tight ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={task.completed ? "secondary" : "default"}>
                        {task.completed ? "Selesai" : "Belum Selesai"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleEditTask(task)}
                    title="Edit Tugas"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handlePrintTask(task)}
                    title="Cetak Tugas"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-red-50"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Hapus Tugas"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(task.photo || (task as any).photo2) && (
                <div className="mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {task.photo && (
                      <div>
                        <img
                          src={task.photo}
                          alt="Foto tugas 1"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <p className="text-xs text-center text-muted-foreground mt-1">Foto 1</p>
                      </div>
                    )}
                    {(task as any).photo2 && (
                      <div>
                        <img
                          src={(task as any).photo2}
                          alt="Foto tugas 2"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <p className="text-xs text-center text-muted-foreground mt-1">Foto 2</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {task.description}
                </p>
              )}
              <div className="space-y-2">
                {task.activity_type && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-blue-600">Jenis:</span>
                    <Badge variant="outline" className="text-xs">
                      {task.activity_type}
                    </Badge>
                  </div>
                )}
                {task.school_name && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-green-600">Tempat:</span>
                    <span className="text-xs text-muted-foreground">{task.school_name}</span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {task.date ? new Date(task.date).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Belum ada tugas yang dibuat.</p>
          <p className="text-sm text-muted-foreground mt-1">Klik tombol "Tambah Tugas" untuk membuat tugas baru.</p>
        </div>
      )}
    </div>
  );
}