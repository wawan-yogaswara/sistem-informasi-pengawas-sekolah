import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, MapPin, Trash2, Upload, X, Image, Edit, Printer, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type AdditionalTask = {
  id: string;
  title: string;
  description: string;
  date?: string;
  status?: string;
  photo?: string;
  photo2?: string;
  location?: string;
  organizer?: string;
  school_id?: string;
  schools?: {
    id: string;
    name: string;
  };
  created_at?: string;
};

export default function AdditionalTasksPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AdditionalTask | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    status: "pending",
    location: "",
    organizer: "",
  });
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalPhotos = selectedPhotos.length + newFiles.length;

    if (totalPhotos > 2) {
      toast({
        title: "Error",
        description: "Maksimal 2 foto yang dapat diunggah",
        variant: "destructive",
      });
      return;
    }

    // Validate file types and sizes
    const validFiles = newFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        toast({
          title: "Error",
          description: `File ${file.name} bukan format gambar yang valid`,
          variant: "destructive",
        });
        return false;
      }

      if (!isValidSize) {
        toast({
          title: "Error",
          description: `File ${file.name} terlalu besar (maksimal 5MB)`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Update selected photos
    const updatedPhotos = [...selectedPhotos, ...validFiles];
    setSelectedPhotos(updatedPhotos);

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPhotoPreview(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(photoPreview[index]);
    
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
  };

  // SIMPLE: Pure Supabase query (same as tasks and supervisions)
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ['additional-tasks'],
    queryFn: async () => {
      console.log('🔍 Fetching additional tasks from Supabase...');
      
      // Get current user
      const userData = localStorage.getItem('auth_user');
      if (!userData) {
        console.log('⚠️ No user data found');
        return [];
      }
      
      const currentUser = JSON.parse(userData);
      
      // SIMPLE: Use username as user_id (same as tasks and supervisions)
      const userId = currentUser.username || currentUser.id;
      
      console.log('👤 Using user_id:', userId);
      
      const { data, error } = await supabase
        .from('additional_tasks')
        .select(`
          *,
          schools (
            id,
            name
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Additional tasks loaded:', data?.length || 0);
      return data || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // SIMPLE: Add task function - Pure Supabase
  const handleAddTask = async () => {
    try {
      console.log('📝 Adding additional task:', newTask.title);
      
      // Validate required fields
      if (!newTask.title || !newTask.description || !newTask.date) {
        toast({
          title: "Error",
          description: "Judul, deskripsi, dan tanggal harus diisi",
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
      
      // SIMPLE: Use username as user_id (same as tasks and supervisions)
      const userId = currentUser.username || currentUser.id;
      
      console.log('👤 User ID:', userId);
      
      // Convert photos to base64 if exists
      let photoBase64 = null;
      let photo2Base64 = null;
      
      if (selectedPhotos.length > 0) {
        const reader1 = new FileReader();
        photoBase64 = await new Promise<string>((resolve) => {
          reader1.onload = () => resolve(reader1.result as string);
          reader1.readAsDataURL(selectedPhotos[0]);
        });
      }
      
      if (selectedPhotos.length > 1) {
        const reader2 = new FileReader();
        photo2Base64 = await new Promise<string>((resolve) => {
          reader2.onload = () => resolve(reader2.result as string);
          reader2.readAsDataURL(selectedPhotos[1]);
        });
      }
      
      // SIMPLE: Use default school for additional tasks (same as tasks)
      const schoolId = '1cd40355-1b07-402d-8309-b243c098cfe9'; // SDN 1 Garut
      
      const { data, error } = await supabase
        .from('additional_tasks')
        .insert([{
          user_id: userId,
          school_id: schoolId,
          title: newTask.title,
          description: newTask.description,
          date: newTask.date,
          status: newTask.status || 'completed',
          location: newTask.location,
          organizer: newTask.organizer,
          photo: photoBase64,
          photo2: photo2Base64
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Insert error:', error);
        throw error;
      }
      
      console.log('✅ Additional task added:', data);
      
      // SIMPLE: Refresh data (same as tasks and supervisions)
      refetch();
      
      // Success feedback
      toast({
        title: "Berhasil",
        description: "Kegiatan tambahan berhasil ditambahkan",
      });
      
      // Reset form
      setNewTask({ title: "", description: "", date: "", status: "pending", location: "", organizer: "" });
      setSelectedPhotos([]);
      photoPreview.forEach(url => URL.revokeObjectURL(url));
      setPhotoPreview([]);
      setIsAddDialogOpen(false);
      
    } catch (error: any) {
      console.error('❌ Add additional task error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat menyimpan kegiatan tambahan",
        variant: "destructive",
      });
    }
  };

  // NUCLEAR FIX: Edit task function
  const handleEditTask = async () => {
    try {
      if (!editingTask) return;
      
      console.log('✏️ Editing additional task:', editingTask.id);
      
      // Validate required fields
      if (!editingTask.title || !editingTask.description || !editingTask.date) {
        toast({
          title: "Error",
          description: "Judul, deskripsi, dan tanggal harus diisi",
          variant: "destructive",
        });
        return;
      }
      
      // Convert photos to base64 if exists
      let photoBase64 = editingTask.photo;
      let photo2Base64 = editingTask.photo2;
      
      if (selectedPhotos.length > 0) {
        const reader1 = new FileReader();
        photoBase64 = await new Promise<string>((resolve) => {
          reader1.onload = () => resolve(reader1.result as string);
          reader1.readAsDataURL(selectedPhotos[0]);
        });
      }
      
      if (selectedPhotos.length > 1) {
        const reader2 = new FileReader();
        photo2Base64 = await new Promise<string>((resolve) => {
          reader2.onload = () => resolve(reader2.result as string);
          reader2.readAsDataURL(selectedPhotos[1]);
        });
      }
      
      const { data, error } = await supabase
        .from('additional_tasks')
        .update({
          title: editingTask.title,
          description: editingTask.description,
          date: editingTask.date,
          status: editingTask.status || 'completed',
          location: editingTask.location,
          organizer: editingTask.organizer,
          photo: photoBase64,
          photo2: photo2Base64
        })
        .eq('id', editingTask.id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Update error:', error);
        throw error;
      }
      
      console.log('✅ Additional task updated:', data);
      
      // SIMPLE: Refresh data (same as tasks and supervisions)
      refetch();
      
      // Success feedback
      toast({
        title: "Berhasil",
        description: "Kegiatan tambahan berhasil diperbarui",
      });
      
      // Reset form
      setEditingTask(null);
      setSelectedPhotos([]);
      photoPreview.forEach(url => URL.revokeObjectURL(url));
      setPhotoPreview([]);
      setIsEditDialogOpen(false);
      
    } catch (error: any) {
      console.error('❌ Edit additional task error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat memperbarui kegiatan tambahan",
        variant: "destructive",
      });
    }
  };

  // Handle print/export PDF
  const handlePrintTask = (task: AdditionalTask) => {
    // Create a simple print view
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Kegiatan Tambahan - ${task.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { margin-bottom: 20px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; }
            .photo { max-width: 300px; margin: 10px 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LAPORAN KEGIATAN TAMBAHAN</h1>
            <h2>${task.title}</h2>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Tanggal:</span> ${task.date ? new Date(task.date).toLocaleDateString('id-ID') : 'Tidak tersedia'}
            </div>
            <div class="field">
              <span class="label">Tempat Kegiatan:</span> ${task.location || 'Tidak tersedia'}
            </div>
            <div class="field">
              <span class="label">Penyelenggara:</span> ${task.organizer || 'Tidak tersedia'}
            </div>
            <div class="field">
              <span class="label">Sekolah:</span> ${task.schools?.name || 'Tidak tersedia'}
            </div>
            <div class="field">
              <span class="label">Deskripsi:</span><br>
              ${task.description || 'Tidak ada deskripsi'}
            </div>
            ${task.photo ? `<div class="field"><span class="label">Foto 1:</span><br><img src="${task.photo}" class="photo" alt="Foto kegiatan 1"></div>` : ''}
            ${task.photo2 ? `<div class="field"><span class="label">Foto 2:</span><br><img src="${task.photo2}" class="photo" alt="Foto kegiatan 2"></div>` : ''}
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Open edit dialog
  const openEditDialog = (task: AdditionalTask) => {
    setEditingTask({
      ...task,
      location: task.location || "",
      organizer: task.organizer || "",
    });
    setSelectedPhotos([]);
    setPhotoPreview([]);
    setIsEditDialogOpen(true);
  };
  const handleDeleteTask = async (id: string) => {
    try {
      console.log('🗑️ Deleting additional task:', id);
      
      const { error } = await supabase
        .from('additional_tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Delete error:', error);
        throw error;
      }
      
      console.log('✅ Additional task deleted');
      
      // SIMPLE: Refresh data (same as tasks and supervisions)
      refetch();
      
      toast({
        title: "Berhasil",
        description: "Kegiatan tambahan berhasil dihapus",
      });
      
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
      
    } catch (error: any) {
      console.error('❌ Delete additional task error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat menghapus kegiatan tambahan",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      handleDeleteTask(taskToDelete);
    }
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
          <h1 className="text-3xl font-bold">Kegiatan Tambahan</h1>
          <p className="text-muted-foreground mt-1">Catat kegiatan dan tugas tambahan di luar supervisi</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kegiatan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Kegiatan Tambahan</DialogTitle>
              <DialogDescription>Catat kegiatan tambahan yang Anda ikuti</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Judul Kegiatan</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Contoh: Rapat Koordinasi Bulanan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-date">Tanggal Kegiatan</Label>
                <Input
                  id="task-date"
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-location">Tempat Kegiatan</Label>
                <Input
                  id="task-location"
                  value={newTask.location}
                  onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                  placeholder="Contoh: Aula Sekolah, Ruang Rapat Dinas"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-organizer">Penyelenggara Kegiatan</Label>
                <Input
                  id="task-organizer"
                  value={newTask.organizer}
                  onChange={(e) => setNewTask({ ...newTask, organizer: e.target.value })}
                  placeholder="Contoh: Dinas Pendidikan, UPTD Pendidikan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-description">Deskripsi Kegiatan</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Deskripsi detail kegiatan..."
                  rows={4}
                />
              </div>
              
              {/* Photo Upload Section */}
              <div className="space-y-2">
                <Label>Foto Kegiatan (Maksimal 2 foto)</Label>
                <div className="space-y-3">
                  {/* Upload Button */}
                  {selectedPhotos.length < 2 && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <Label
                        htmlFor="photo-upload"
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Pilih Foto ({selectedPhotos.length}/2)</span>
                      </Label>
                    </div>
                  )}
                  
                  {/* Photo Previews */}
                  {photoPreview.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {photoPreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Foto {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedPhotos.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                      <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Belum ada foto yang dipilih</p>
                      <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG (Maksimal 5MB per foto)</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddTask} disabled={!newTask.title || !newTask.description || !newTask.date}>
                  Simpan Kegiatan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Kegiatan Tambahan</DialogTitle>
            <DialogDescription>Perbarui informasi kegiatan tambahan</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-title">Judul Kegiatan</Label>
                <Input
                  id="edit-task-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="Contoh: Rapat Koordinasi Bulanan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-task-date">Tanggal Kegiatan</Label>
                <Input
                  id="edit-task-date"
                  type="date"
                  value={editingTask.date}
                  onChange={(e) => setEditingTask({ ...editingTask, date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-task-location">Tempat Kegiatan</Label>
                <Input
                  id="edit-task-location"
                  value={editingTask.location || ""}
                  onChange={(e) => setEditingTask({ ...editingTask, location: e.target.value })}
                  placeholder="Contoh: Aula Sekolah, Ruang Rapat Dinas"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-task-organizer">Penyelenggara Kegiatan</Label>
                <Input
                  id="edit-task-organizer"
                  value={editingTask.organizer || ""}
                  onChange={(e) => setEditingTask({ ...editingTask, organizer: e.target.value })}
                  placeholder="Contoh: Dinas Pendidikan, UPTD Pendidikan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-task-description">Deskripsi Kegiatan</Label>
                <Textarea
                  id="edit-task-description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="Deskripsi detail kegiatan..."
                  rows={4}
                />
              </div>
              
              {/* Photo Upload Section */}
              <div className="space-y-2">
                <Label>Foto Kegiatan (Maksimal 2 foto)</Label>
                <div className="space-y-3">
                  {/* Upload Button */}
                  {selectedPhotos.length < 2 && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="edit-photo-upload"
                      />
                      <Label
                        htmlFor="edit-photo-upload"
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Pilih Foto Baru ({selectedPhotos.length}/2)</span>
                      </Label>
                    </div>
                  )}
                  
                  {/* Current Photos */}
                  {(editingTask.photo || editingTask.photo2) && selectedPhotos.length === 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {editingTask.photo && (
                        <div className="relative group">
                          <img
                            src={editingTask.photo}
                            alt="Foto kegiatan 1"
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Foto 1 (Saat ini)
                          </div>
                        </div>
                      )}
                      {editingTask.photo2 && (
                        <div className="relative group">
                          <img
                            src={editingTask.photo2}
                            alt="Foto kegiatan 2"
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Foto 2 (Saat ini)
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* New Photo Previews */}
                  {photoPreview.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {photoPreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Foto Baru {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleEditTask} disabled={!editingTask.title || !editingTask.description || !editingTask.date}>
                  Perbarui Kegiatan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tasks Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task: AdditionalTask) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600"
                    onClick={() => openEditDialog(task)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600"
                    onClick={() => handlePrintTask(task)}
                    title="Cetak"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => {
                      setTaskToDelete(task.id);
                      setDeleteDialogOpen(true);
                    }}
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(task.photo || task.photo2) && (
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {task.photo && (
                    <img
                      src={task.photo}
                      alt="Foto kegiatan 1"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  )}
                  {task.photo2 && (
                    <img
                      src={task.photo2}
                      alt="Foto kegiatan 2"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  )}
                </div>
              )}
              {task.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{task.location}</span>
                </div>
              )}
              {task.organizer && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span className="truncate">{task.organizer}</span>
                </div>
              )}
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {task.description}
                </p>
              )}
              {(task.date || task.created_at) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{task.date ? new Date(task.date).toLocaleDateString('id-ID') : formatDate(task.created_at!)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Belum ada kegiatan tambahan yang dicatat.</p>
          <p className="text-sm text-muted-foreground mt-1">Klik tombol "Tambah Kegiatan" untuk menambah kegiatan baru.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kegiatan Tambahan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kegiatan tambahan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}