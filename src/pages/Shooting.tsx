import { useState } from "react";
import { useShootingSchedule, useUpsertShooting, useDeleteShooting } from "@/hooks/useProjectData";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Shooting = () => {
  const { data: items, isLoading } = useShootingSchedule();
  const { data: projects } = useProjects();
  const upsert = useUpsertShooting();
  const remove = useDeleteShooting();
  const { toast } = useToast();
  const [form, setForm] = useState({ project_id: "", shooting_date: "", location: "", scene_number: 1, is_completed: false });
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsert.mutateAsync({ ...form, ...(editId ? { id: editId } : {}) });
      toast({ title: editId ? "Schedule updated" : "Schedule added" });
      setForm({ project_id: "", shooting_date: "", location: "", scene_number: 1, is_completed: false });
      setEditId(null);
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (s: any) => {
    setForm({ project_id: s.project_id, shooting_date: s.shooting_date, location: s.location, scene_number: s.scene_number, is_completed: s.is_completed });
    setEditId(s.id);
    setOpen(true);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Shooting Schedule</h1><p className="text-muted-foreground mt-1">Manage shooting dates, locations, and scenes</p></div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm({ project_id: "", shooting_date: "", location: "", scene_number: 1, is_completed: false }); setEditId(null); } }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Schedule</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Shooting Schedule</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger>
                <SelectContent>{projects?.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
              </Select>
              <div><label className="text-sm text-muted-foreground">Shooting Date</label><Input type="date" value={form.shooting_date} onChange={(e) => setForm({ ...form, shooting_date: e.target.value })} required /></div>
              <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              <Input type="number" placeholder="Scene Number" value={form.scene_number} onChange={(e) => setForm({ ...form, scene_number: parseInt(e.target.value) })} required min={1} />
              <div className="flex items-center gap-2">
                <Checkbox checked={form.is_completed} onCheckedChange={(c) => setForm({ ...form, is_completed: !!c })} />
                <label className="text-sm">Completed</label>
              </div>
              <Button type="submit" className="w-full">{editId ? "Update" : "Add"} Schedule</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Date</TableHead><TableHead>Location</TableHead><TableHead>Scene #</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {items && items.length > 0 ? items.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.projects?.title}</TableCell>
                  <TableCell>{s.shooting_date}</TableCell>
                  <TableCell>{s.location}</TableCell>
                  <TableCell>{s.scene_number}</TableCell>
                  <TableCell><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.is_completed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{s.is_completed ? "Done" : "Pending"}</span></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(s)}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete schedule?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => remove.mutateAsync(s.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No shooting schedules yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shooting;
