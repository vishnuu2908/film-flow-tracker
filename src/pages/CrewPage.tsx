import { useState } from "react";
import { useCrew, useUpsertCrew, useDeleteCrew } from "@/hooks/useProjectData";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CrewPage = () => {
  const { data: items, isLoading } = useCrew();
  const { data: projects } = useProjects();
  const upsert = useUpsertCrew();
  const remove = useDeleteCrew();
  const { toast } = useToast();
  const [form, setForm] = useState({ project_id: "", name: "", role: "", contact_info: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsert.mutateAsync({ ...form, ...(editId ? { id: editId } : {}) });
      toast({ title: editId ? "Crew member updated" : "Crew member added" });
      setForm({ project_id: "", name: "", role: "", contact_info: "" });
      setEditId(null);
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (s: any) => {
    setForm({ project_id: s.project_id, name: s.name, role: s.role, contact_info: s.contact_info || "" });
    setEditId(s.id);
    setOpen(true);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Crew Management</h1><p className="text-muted-foreground mt-1">Manage actors and crew members</p></div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm({ project_id: "", name: "", role: "", contact_info: "" }); setEditId(null); } }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Crew</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Crew Member</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger>
                <SelectContent>{projects?.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Role (e.g., Actor, Cinematographer)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              <Input placeholder="Contact Info (optional)" value={form.contact_info} onChange={(e) => setForm({ ...form, contact_info: e.target.value })} />
              <Button type="submit" className="w-full">{editId ? "Update" : "Add"} Crew Member</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Contact</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {items && items.length > 0 ? items.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.projects?.title}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>{s.contact_info || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(s)}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete crew member?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => remove.mutateAsync(s.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No crew members yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrewPage;
