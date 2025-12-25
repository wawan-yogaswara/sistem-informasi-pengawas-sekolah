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
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  photo?: string | null;
  created_at?: string;
};

export default function TasksPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: "", 
    description: "", 
    completed: false,
    date: new Date().toISOString().split('T')[0]
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

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

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setPhoto(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  // SIMPLE: Add task function - Pure Supabase
  const handleAddTask = async () => {
    try {
      console.log('📝 Adding task:', newTask.title);
      
      if (!newTask.title || !newTask.description) {
        toast({
          title: "Error",
          description: "Judul dan deskripsi harus diisi",
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
      
      // Convert photo to base64 if exists
      let photoBase64 = null;
      if (photo) {
        const reader = new FileReader();
        photoBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo);
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
          photo: photoBase64
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
      setNewTask({ title: "", description: "", completed: false, date: new Date().toISOString().split('T')[0] });
      removePhoto();
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
                <Label>Foto (Opsional)</Label>
                <div className="space-y-3">
                  {!photo && (
                    <div className="flex items-center gap-2">
                      <Input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <Label
                        htmlFor="photo-upload"
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <ImageIcon className="h-4 w-4" />
                        <span>Pilih Foto</span>
                      </Label>
                    </div>
                  )}
                  
                  {photoPreview && (
                    <div className="relative group">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={removePhoto}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
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
                <Button onClick={handleAddTask} disabled={!newTask.title || !newTask.description}>
                  Simpan Tugas
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteTask(task.id)}
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {task.photo && (
                <div className="mb-3">
                  <img
                    src={task.photo}
                    alt="Foto tugas"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {task.description}
                </p>
              )}
              <div className="text-xs text-muted-foreground">
                {task.date ? new Date(task.date).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}
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