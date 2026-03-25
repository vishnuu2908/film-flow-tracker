import { useState } from "react";
import { useEditing, useUpsertEditing, useDeleteEditing } from "@/hooks/useProjectData";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EditingPage = () => {
  const { data: items, isLoading } = useEditing();
  const { data: projects } = useProjects();
  const upsert = useUpsertEditing();
  const remove = useDeleteEditing();
  const { toast } = useToast();
  const [form, setForm] = useState({ project_id: "", editing_percentage: 0, editor_name: "", export_status: "Pending" });
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsert.mutateAsync({ ...form, ...(editId ? { id: editId } : {}) });
      toast({ title: editId ? "Editing updated" : "Editing added" });
      setForm({ project_id: "", editing_percentage: 0, editor_name: "", export_status: "Pending" });
      setEditId(null);
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (s: any) => {
    setForm({ project_id: s.project_id, editing_percentage: s.editing_percentage, editor_name: s.editor_name, export_status: s.export_status });
    setEditId(s.id);
    setOpen(true);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Editing Tracking</h1><p className="text-muted-foreground mt-1">Track editing progress and export status</p></div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm({ project_id: "", editing_percentage: 0, editor_name: "", export_status: "Pending" }); setEditId(null); } }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Editing</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Editing Record</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger>
                <SelectContent>{projects?.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Editor Name" value={form.editor_name} onChange={(e) => setForm({ ...form, editor_name: e.target.value })} required />
              <div>
                <label className="text-sm text-muted-foreground">Editing Progress: {form.editing_percentage}%</label>
                <Slider value={[form.editing_percentage]} onValueChange={(v) => setForm({ ...form, editing_percentage: v[0] })} max={100} step={1} className="mt-2" />
              </div>
              <Select value={form.export_status} onValueChange={(v) => setForm({ ...form, export_status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Exported">Exported</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">{editId ? "Update" : "Add"} Record</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Editor</TableHead><TableHead>Progress</TableHead><TableHead>Export Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {items && items.length > 0 ? items.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.projects?.title}</TableCell>
                  <TableCell>{s.editor_name}</TableCell>
                  <TableCell><div className="flex items-center gap-2 min-w-[120px]"><Progress value={s.editing_percentage} className="h-2 flex-1" /><span className="text-xs font-medium">{s.editing_percentage}%</span></div></TableCell>
                  <TableCell><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.export_status === "Exported" ? "bg-green-100 text-green-700" : s.export_status === "In Progress" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>{s.export_status}</span></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(s)}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete record?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => remove.mutateAsync(s.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No editing records yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditingPage;
