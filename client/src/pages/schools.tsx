import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin, Phone, School as SchoolIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type School = {
  id: string;
  name: string;
  address: string;
  phone: string;
  principal: string;
  email?: string;
  created_at?: string;
};

export default function SchoolsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // SIMPLE: Pure Supabase query
  const { data: schools = [], isLoading, refetch } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      console.log('🔍 Fetching schools from Supabase...');
      
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Schools loaded:', data?.length || 0);
      return data || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({ 
    name: "", 
    address: "", 
    phone: "", 
    principal: "",
    email: ""
  });

  // SIMPLE: Add school function
  const handleAddSchool = async () => {
    try {
      console.log('📝 Adding school:', newSchool.name);
      
      const { data, error } = await supabase
        .from('schools')
        .insert([{
          name: newSchool.name,
          address: newSchool.address,
          phone: newSchool.phone,
          principal: newSchool.principal,
          email: newSchool.email || ''
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Insert error:', error);
        throw error;
      }
      
      console.log('✅ School added:', data);
      
      // Refresh data
      refetch();
      
      // Success feedback
      toast({
        title: "Berhasil",
        description: "Sekolah berhasil ditambahkan",
      });
      
      // Reset form
      setNewSchool({ name: "", address: "", phone: "", principal: "", email: "" });
      setIsAddDialogOpen(false);
      
    } catch (error: any) {
      console.error('❌ Add school error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat menyimpan sekolah",
        variant: "destructive",
      });
    }
  };

  // SIMPLE: Delete school function
  const handleDeleteSchool = async (id: string) => {
    try {
      console.log('🗑️ Deleting school:', id);
      
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Delete error:', error);
        throw error;
      }
      
      console.log('✅ School deleted');
      
      // Refresh data
      refetch();
      
      toast({
        title: "Berhasil",
        description: "Sekolah berhasil dihapus",
      });
      
    } catch (error: any) {
      console.error('❌ Delete school error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat menghapus sekolah",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data sekolah...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sekolah Binaan</h1>
          <p className="text-muted-foreground mt-1">Kelola data sekolah yang Anda bina</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Sekolah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Sekolah Binaan</DialogTitle>
              <DialogDescription>Tambahkan sekolah baru ke dalam daftar binaan Anda</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school-name">Nama Sekolah</Label>
                <Input
                  id="school-name"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                  placeholder="Contoh: SMKN 4 Garut"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-address">Alamat</Label>
                <Input
                  id="school-address"
                  value={newSchool.address}
                  onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                  placeholder="Alamat lengkap sekolah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-phone">Telepon</Label>
                <Input
                  id="school-phone"
                  value={newSchool.phone}
                  onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                  placeholder="Nomor telepon sekolah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="principal-name">Nama Kepala Sekolah</Label>
                <Input
                  id="principal-name"
                  value={newSchool.principal}
                  onChange={(e) => setNewSchool({ ...newSchool, principal: e.target.value })}
                  placeholder="Nama lengkap kepala sekolah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-email">Email (Opsional)</Label>
                <Input
                  id="school-email"
                  value={newSchool.email}
                  onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                  placeholder="Email sekolah"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddSchool} disabled={!newSchool.name}>
                  Simpan Sekolah
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {schools.length === 0 ? (
        <div className="text-center py-12">
          <SchoolIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Belum ada sekolah binaan</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tambahkan sekolah pertama Anda untuk memulai
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Sekolah Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <Card key={school.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                      <SchoolIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{school.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Aktif
                      </Badge>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Sekolah</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus {school.name}? Data supervisi terkait akan tetap tersimpan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteSchool(school.id)}>
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{school.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">{school.phone}</span>
                </div>
                {school.principal && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">Kepala Sekolah</p>
                    <p className="text-sm text-muted-foreground">{school.principal}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}