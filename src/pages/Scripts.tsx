import { useState } from "react";
import { useScripts, useUpsertScript, useDeleteScript } from "@/hooks/useProjectData";
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

const Scripts = () => {
  const { data: scripts, isLoading } = useScripts();
  const { data: projects } = useProjects();
  const upsert = useUpsertScript();
  const remove = useDeleteScript();
  const { toast } = useToast();
  const [form, setForm] = useState({ project_id: "", status: "Not Started", file_path: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsert.mutateAsync({ ...form, ...(editId ? { id: editId } : {}) });
      toast({ title: editId ? "Script updated" : "Script added" });
      setForm({ project_id: "", status: "Not Started", file_path: "" });
      setEditId(null);
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (s: any) => {
    setForm({ project_id: s.project_id, status: s.status, file_path: s.file_path || "" });
    setEditId(s.id);
    setOpen(true);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Script Tracking</h1><p className="text-muted-foreground mt-1">Track script progress for each project</p></div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm({ project_id: "", status: "Not Started", file_path: "" }); setEditId(null); } }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Script</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Script</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger>
                <SelectContent>{projects?.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="File path (optional)" value={form.file_path} onChange={(e) => setForm({ ...form, file_path: e.target.value })} />
              <Button type="submit" className="w-full">{editId ? "Update" : "Add"} Script</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Status</TableHead><TableHead>File Path</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {scripts && scripts.length > 0 ? scripts.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.projects?.title}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.status === "Final" ? "bg-green-100 text-green-700" : s.status === "Draft" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>{s.status}</span>
                  </TableCell>
                  <TableCell>{s.file_path || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(s)}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete script?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => remove.mutateAsync(s.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No scripts tracked yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scripts;
