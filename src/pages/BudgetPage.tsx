import { useState } from "react";
import { useBudgets, useUpsertBudget, useDeleteBudget } from "@/hooks/useProjectData";
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

const BudgetPage = () => {
  const { data: items, isLoading } = useBudgets();
  const { data: projects } = useProjects();
  const upsert = useUpsertBudget();
  const remove = useDeleteBudget();
  const { toast } = useToast();
  const [form, setForm] = useState({ project_id: "", estimated_budget: 0, actual_expense: 0 });
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsert.mutateAsync({ ...form, ...(editId ? { id: editId } : {}) });
      toast({ title: editId ? "Budget updated" : "Budget added" });
      setForm({ project_id: "", estimated_budget: 0, actual_expense: 0 });
      setEditId(null);
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (s: any) => {
    setForm({ project_id: s.project_id, estimated_budget: s.estimated_budget, actual_expense: s.actual_expense });
    setEditId(s.id);
    setOpen(true);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Budget Tracking</h1><p className="text-muted-foreground mt-1">Track estimated vs actual expenses</p></div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm({ project_id: "", estimated_budget: 0, actual_expense: 0 }); setEditId(null); } }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Budget</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Budget</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger>
                <SelectContent>{projects?.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
              </Select>
              <div><label className="text-sm text-muted-foreground">Estimated Budget ($)</label><Input type="number" value={form.estimated_budget} onChange={(e) => setForm({ ...form, estimated_budget: parseFloat(e.target.value) || 0 })} required min={0} step="0.01" /></div>
              <div><label className="text-sm text-muted-foreground">Actual Expense ($)</label><Input type="number" value={form.actual_expense} onChange={(e) => setForm({ ...form, actual_expense: parseFloat(e.target.value) || 0 })} required min={0} step="0.01" /></div>
              <div className="p-3 bg-muted rounded-lg"><p className="text-sm text-muted-foreground">Remaining: <span className="font-bold text-foreground">${(form.estimated_budget - form.actual_expense).toLocaleString()}</span></p></div>
              <Button type="submit" className="w-full">{editId ? "Update" : "Add"} Budget</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Estimated</TableHead><TableHead>Actual</TableHead><TableHead>Remaining</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {items && items.length > 0 ? items.map((s: any) => {
                const remaining = s.estimated_budget - s.actual_expense;
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.projects?.title}</TableCell>
                    <TableCell>${Number(s.estimated_budget).toLocaleString()}</TableCell>
                    <TableCell>${Number(s.actual_expense).toLocaleString()}</TableCell>
                    <TableCell><span className={remaining >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>${remaining.toLocaleString()}</span></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete budget?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => remove.mutateAsync(s.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              }) : <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No budget records yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPage;
