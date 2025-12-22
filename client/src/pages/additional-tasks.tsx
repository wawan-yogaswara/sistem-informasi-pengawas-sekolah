import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Calendar, MapPin, Users, Trash2, Edit, Printer, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AdditionalTask = {
  id: string;
  name: string;
  date: string;
  location: string;
  organizer: string;
  description: string;
  photo1?: string | null;
  photo2?: string | null;
  createdAt?: string;
};

export default function AdditionalTasksPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<AdditionalTask | null>(null);
  const [newTask, setNewTask] = useState({
    name: "",
    date: "",
    location: "",
    organizer: "",
    description: "",
    photo1: null as string | null,
    photo2: null as string | null,
  });

  // Initialize with real tasks
  useEffect(() => {
    const existingData = localStorage.getItem('additional_tasks_data');
    if (!existingData) {
      const year = new Date().getFullYear().toString();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      
      const realTasks = [
        {
          id: "real-task-1",
          name: "Rapat Koordinasi Pengawas Sekolah",
          date: `${year}-${month}-15`,
          location: "Kantor Dinas Pendidikan Provinsi Jawa Barat",
          organizer: "Dinas Pendidikan Provinsi Jawa Barat",
          description: "Rapat koordinasi bulanan membahas program supervisi sekolah, evaluasi kinerja pengawas, dan rencana kegiatan bulan berikutnya.",
          createdAt: `${year}-${month}-15T10:00:00.000Z`
        }
      ];
      
      localStorage.setItem('additional_tasks_data', JSON.stringify(realTasks));
      localStorage.setItem('additional_tasks_data_backup', JSON.stringify(realTasks));
      console.log('✅ Created real additional tasks data:', realTasks.length);
    }
  }, []);

  // Fetch tasks from localStorage
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['additional-tasks'],
    queryFn: () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const tasksData = localStorage.getItem('additional_tasks_data');
          console.log('📖 Reading additional tasks from localStorage:', tasksData);
          
          if (tasksData) {
            const parsed = JSON.parse(tasksData);
            console.log('✅ Parsed additional tasks:', parsed.length, 'items');
            return Array.isArray(parsed) ? parsed : [];
          }
        }
        console.log('⚠️ No additional tasks data found');
        return [];
      } catch (error) {
        console.warn('❌ Error reading additional tasks from localStorage:', error);
        return [];
      }
    },
  });

  const handleAddTask = () => {
    try {
      console.log('💾 Submitting additional task:', newTask);
      
      const tasksData = localStorage.getItem('additional_tasks_data');
      const currentTasks = tasksData ? JSON.parse(tasksData) : [];
      
      const newTaskData = {
        id: Date.now().toString(),
        name: newTask.name,
        date: newTask.date,
        location: newTask.location,
        organizer: newTask.organizer,
        description: newTask.description,
        photo1: newTask.photo1,
        photo2: newTask.photo2,
        createdAt: new Date().toISOString()
      };
      
      const updatedTasks = [...currentTasks, newTaskData];
      
      localStorage.setItem('additional_tasks_data', JSON.stringify(updatedTasks));
      localStorage.setItem('additional_tasks_data_backup', JSON.stringify(updatedTasks));
      localStorage.setItem('additional_tasks_data_timestamp', Date.now().toString());
      
      queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
      
      toast({
        title: "Berhasil",
        description: "Tugas tambahan berhasil ditambahkan",
      });
      
      setNewTask({ name: "", date: "", location: "", organizer: "", description: "", photo1: null, photo2: null });
      setIsAddDialogOpen(false);
      
    } catch (error) {
      console.error('❌ Error in handleAddTask:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan tugas tambahan",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = () => {
    if (!editingTask) return;
    
    try {
      const tasksData = localStorage.getItem('additional_tasks_data');
      const currentTasks = tasksData ? JSON.parse(tasksData) : [];
      
      const updatedTasks = currentTasks.map((task: AdditionalTask) => 
        task.id === editingTask.id ? {
          ...task,
          name: newTask.name,
          date: newTask.date,
          location: newTask.location,
          organizer: newTask.organizer,
          description: newTask.description,
          photo1: newTask.photo1,
          photo2: newTask.photo2,
        } : task
      );
      
      localStorage.setItem('additional_tasks_data', JSON.stringify(updatedTasks));
      localStorage.setItem('additional_tasks_data_backup', JSON.stringify(updatedTasks));
      localStorage.setItem('additional_tasks_data_timestamp', Date.now().toString());
      
      queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
      
      toast({
        title: "Berhasil",
        description: "Tugas tambahan berhasil diperbarui",
      });
      
      setIsEditDialogOpen(false);
      setEditingTask(null);
      setNewTask({ name: "", date: "", location: "", organizer: "", description: "", photo1: null, photo2: null });
      
    } catch (error) {
      console.error('Error in handleEditTask:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui tugas tambahan",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    try {
      const tasksData = localStorage.getItem('additional_tasks_data');
      const currentTasks = tasksData ? JSON.parse(tasksData) : [];
      
      const updatedTasks = currentTasks.filter((task: AdditionalTask) => task.id !== id);
      
      localStorage.setItem('additional_tasks_data', JSON.stringify(updatedTasks));
      localStorage.setItem('additional_tasks_data_backup', JSON.stringify(updatedTasks));
      localStorage.setItem('additional_tasks_data_timestamp', Date.now().toString());
      
      queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
      toast({
        title: "Berhasil",
        description: "Tugas tambahan berhasil dihapus",
      });
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
      
    } catch (error) {
      console.error('Error in handleDeleteTask:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus tugas tambahan",
        variant: "destructive",
      });
    }
  };

  const handlePrintTask = (task: AdditionalTask) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Tugas Tambahan - ${task.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { margin-bottom: 20px; }
              .label { font-weight: bold; }
              .photos { display: flex; gap: 20px; margin-top: 20px; }
              .photo { max-width: 300px; max-height: 200px; border: 1px solid #ccc; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>LAPORAN TUGAS TAMBAHAN</h1>
              <h2>${task.name}</h2>
            </div>
            <div class="content">
              <p><span class="label">Tanggal:</span> ${formatDate(task.date)}</p>
              <p><span class="label">Tempat:</span> ${task.location}</p>
              <p><span class="label">Penyelenggara:</span> ${task.organizer}</p>
              <p><span class="label">Deskripsi:</span></p>
              <p>${task.description}</p>
              ${(task.photo1 || task.photo2) ? `
                <div class="photos">
                  ${task.photo1 ? `<img src="${task.photo1}" alt="Foto 1" class="photo" />` : ''}
                  ${task.photo2 ? `<img src="${task.photo2}" alt="Foto 2" class="photo" />` : ''}
                </div>
              ` : ''}
            </div>
            <div class="no-print" style="margin-top: 30px; text-align: center;">
              <button onclick="window.print()">Cetak</button>
              <button onclick="window.close()">Tutup</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handlePhotoUpload = (photoNumber: 1 | 2, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (photoNumber === 1) {
          setNewTask({ ...newTask, photo1: base64 });
        } else {
          setNewTask({ ...newTask, photo2: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (photoNumber: 1 | 2) => {
    if (photoNumber === 1) {
      setNewTask({ ...newTask, photo1: null });
    } else {
      setNewTask({ ...newTask, photo2: null });
    }
  };

  const openEditDialog = (task: AdditionalTask) => {
    setEditingTask(task);
    setNewTask({
      name: task.name,
      date: task.date,
      location: task.location,
      organizer: task.organizer,
      description: task.description,
      photo1: task.photo1 || null,
      photo2: task.photo2 || null,
    });
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
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
          <h1 className="text-3xl font-bold">Tugas Tambahan</h1>
          <p className="text-muted-foreground mt-1">Catat kegiatan dan tugas tambahan di luar supervisi</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kegiatan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Tugas Tambahan</DialogTitle>
              <DialogDescription>Catat kegiatan tambahan yang Anda ikuti</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-name">Nama Kegiatan</Label>
                <Input
                  id="task-name"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  placeholder="Contoh: Rapat Koordinasi"
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
                  placeholder="Lokasi kegiatan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-organizer">Penyelenggara Kegiatan</Label>
                <Input
                  id="task-organizer"
                  value={newTask.organizer}
                  onChange={(e) => setNewTask({ ...newTask, organizer: e.target.value })}
                  placeholder="Nama penyelenggara"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Deskripsi atau Hasil Kegiatan</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Catatan hasil atau deskripsi kegiatan"
                  rows={4}
                />
              </div>
              
              {/* Photo Upload Section */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Foto Kegiatan (Opsional)
                </Label>
                
                {/* Photo 1 */}
                <div className="space-y-2">
                  <Label htmlFor="photo1" className="text-sm font-medium">Foto 1</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="photo1"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(1, e)}
                      className="flex-1"
                    />
                    {newTask.photo1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePhoto(1)}
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                  {newTask.photo1 && (
                    <div className="mt-2">
                      <img
                        src={newTask.photo1}
                        alt="Preview foto 1"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
                
                {/* Photo 2 */}
                <div className="space-y-2">
                  <Label htmlFor="photo2" className="text-sm font-medium">Foto 2</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="photo2"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(2, e)}
                      className="flex-1"
                    />
                    {newTask.photo2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePhoto(2)}
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                  {newTask.photo2 && (
                    <div className="mt-2">
                      <img
                        src={newTask.photo2}
                        alt="Preview foto 2"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddTask} disabled={!newTask.name || !newTask.date}>
                  Simpan Kegiatan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task: AdditionalTask) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">{task.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(task)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(task.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{task.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="truncate">{task.organizer}</span>
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {task.description}
                </p>
              )}
              
              {/* Photos Display */}
              {(task.photo1 || task.photo2) && (
                <div className="mt-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Camera className="h-3 w-3" />
                    <span>Foto Kegiatan:</span>
                  </div>
                  <div className="flex gap-2">
                    {task.photo1 && (
                      <img
                        src={task.photo1}
                        alt="Foto kegiatan 1"
                        className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          const newWindow = window.open();
                          if (newWindow) {
                            newWindow.document.write(`<img src="${task.photo1}" style="max-width:100%;height:auto;" />`);
                          }
                        }}
                      />
                    )}
                    {task.photo2 && (
                      <img
                        src={task.photo2}
                        alt="Foto kegiatan 2"
                        className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          const newWindow = window.open();
                          if (newWindow) {
                            newWindow.document.write(`<img src="${task.photo2}" style="max-width:100%;height:auto;" />`);
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tugas Tambahan</DialogTitle>
            <DialogDescription>Perbarui informasi kegiatan tambahan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-task-name">Nama Kegiatan</Label>
              <Input
                id="edit-task-name"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                placeholder="Contoh: Rapat Koordinasi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-task-date">Tanggal Kegiatan</Label>
              <Input
                id="edit-task-date"
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-task-location">Tempat Kegiatan</Label>
              <Input
                id="edit-task-location"
                value={newTask.location}
                onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                placeholder="Lokasi kegiatan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-task-organizer">Penyelenggara Kegiatan</Label>
              <Input
                id="edit-task-organizer"
                value={newTask.organizer}
                onChange={(e) => setNewTask({ ...newTask, organizer: e.target.value })}
                placeholder="Nama penyelenggara"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-task-description">Deskripsi atau Hasil Kegiatan</Label>
              <Textarea
                id="edit-task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Catatan hasil atau deskripsi kegiatan"
                rows={4}
              />
            </div>
            
            {/* Photo Upload Section for Edit */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Foto Kegiatan (Opsional)
              </Label>
              
              {/* Photo 1 */}
              <div className="space-y-2">
                <Label htmlFor="edit-photo1" className="text-sm font-medium">Foto 1</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="edit-photo1"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(1, e)}
                    className="flex-1"
                  />
                  {newTask.photo1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePhoto(1)}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
                {newTask.photo1 && (
                  <div className="mt-2">
                    <img
                      src={newTask.photo1}
                      alt="Preview foto 1"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
              
              {/* Photo 2 */}
              <div className="space-y-2">
                <Label htmlFor="edit-photo2" className="text-sm font-medium">Foto 2</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="edit-photo2"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(2, e)}
                    className="flex-1"
                  />
                  {newTask.photo2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePhoto(2)}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
                {newTask.photo2 && (
                  <div className="mt-2">
                    <img
                      src={newTask.photo2}
                      alt="Preview foto 2"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleEditTask} disabled={!newTask.name || !newTask.date}>
                Perbarui Kegiatan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tugas Tambahan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus tugas tambahan ini? Tindakan ini tidak dapat dibatalkan.
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