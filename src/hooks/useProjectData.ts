import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Scripts
export type Script = Tables<"scripts">;
export const useScripts = (projectId?: string) =>
  useQuery({
    queryKey: ["scripts", projectId],
    queryFn: async () => {
      let q = supabase.from("scripts").select("*, projects(title)").order("created_at", { ascending: false });
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

export const useUpsertScript = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (script: TablesInsert<"scripts"> & { id?: string }) => {
      if (script.id) {
        const { id, ...rest } = script;
        const { error } = await supabase.from("scripts").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("scripts").insert(script);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scripts"] }),
  });
};

export const useDeleteScript = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("scripts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scripts"] }),
  });
};

// Shooting Schedule
export type ShootingSchedule = Tables<"shooting_schedule">;
export const useShootingSchedule = (projectId?: string) =>
  useQuery({
    queryKey: ["shooting_schedule", projectId],
    queryFn: async () => {
      let q = supabase.from("shooting_schedule").select("*, projects(title)").order("shooting_date", { ascending: true });
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

export const useUpsertShooting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: TablesInsert<"shooting_schedule"> & { id?: string }) => {
      if (item.id) {
        const { id, ...rest } = item;
        const { error } = await supabase.from("shooting_schedule").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("shooting_schedule").insert(item);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shooting_schedule"] }),
  });
};

export const useDeleteShooting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shooting_schedule").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shooting_schedule"] }),
  });
};

// Editing
export type Editing = Tables<"editing">;
export const useEditing = (projectId?: string) =>
  useQuery({
    queryKey: ["editing", projectId],
    queryFn: async () => {
      let q = supabase.from("editing").select("*, projects(title)").order("created_at", { ascending: false });
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

export const useUpsertEditing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: TablesInsert<"editing"> & { id?: string }) => {
      if (item.id) {
        const { id, ...rest } = item;
        const { error } = await supabase.from("editing").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("editing").insert(item);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["editing"] }),
  });
};

export const useDeleteEditing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("editing").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["editing"] }),
  });
};

// Budget
export type Budget = Tables<"budget">;
export const useBudgets = (projectId?: string) =>
  useQuery({
    queryKey: ["budget", projectId],
    queryFn: async () => {
      let q = supabase.from("budget").select("*, projects(title)").order("created_at", { ascending: false });
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

export const useUpsertBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: TablesInsert<"budget"> & { id?: string }) => {
      if (item.id) {
        const { id, ...rest } = item;
        const { error } = await supabase.from("budget").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("budget").insert(item);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budget"] }),
  });
};

export const useDeleteBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budget").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budget"] }),
  });
};

// Crew
export type Crew = Tables<"crew">;
export const useCrew = (projectId?: string) =>
  useQuery({
    queryKey: ["crew", projectId],
    queryFn: async () => {
      let q = supabase.from("crew").select("*, projects(title)").order("created_at", { ascending: false });
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

export const useUpsertCrew = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: TablesInsert<"crew"> & { id?: string }) => {
      if (item.id) {
        const { id, ...rest } = item;
        const { error } = await supabase.from("crew").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("crew").insert(item);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crew"] }),
  });
};

export const useDeleteCrew = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("crew").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crew"] }),
  });
};

// Progress calculation
export const useProjectProgress = (projectId: string) =>
  useQuery({
    queryKey: ["progress", projectId],
    queryFn: async () => {
      const [scriptRes, shootingRes, editingRes] = await Promise.all([
        supabase.from("scripts").select("status").eq("project_id", projectId),
        supabase.from("shooting_schedule").select("is_completed").eq("project_id", projectId),
        supabase.from("editing").select("editing_percentage").eq("project_id", projectId),
      ]);

      // Script: 30% if Final
      let scriptScore = 0;
      const scripts = scriptRes.data || [];
      if (scripts.some((s) => s.status === "Final")) scriptScore = 30;
      else if (scripts.some((s) => s.status === "Draft")) scriptScore = 15;

      // Shooting: completed/total * 40
      const shots = shootingRes.data || [];
      const completedShots = shots.filter((s) => s.is_completed).length;
      const shootingScore = shots.length > 0 ? (completedShots / shots.length) * 40 : 0;

      // Editing: avg percentage * 0.3
      const edits = editingRes.data || [];
      const avgEditing = edits.length > 0 ? edits.reduce((sum, e) => sum + e.editing_percentage, 0) / edits.length : 0;
      const editingScore = avgEditing * 0.3;

      return {
        total: Math.round(scriptScore + shootingScore + editingScore),
        script: Math.round(scriptScore),
        shooting: Math.round(shootingScore),
        editing: Math.round(editingScore),
      };
    },
    enabled: !!projectId,
  });

// Dashboard stats
export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [projectsRes, budgetRes] = await Promise.all([
        supabase.from("projects").select("id, status"),
        supabase.from("budget").select("actual_expense"),
      ]);

      const projects = projectsRes.data || [];
      const budgets = budgetRes.data || [];
      const totalBudget = budgets.reduce((sum, b) => sum + Number(b.actual_expense), 0);

      return {
        total: projects.length,
        completed: projects.filter((p) => p.status === "Completed").length,
        ongoing: projects.filter((p) => p.status === "Ongoing").length,
        onHold: projects.filter((p) => p.status === "On Hold").length,
        totalBudgetSpent: totalBudget,
      };
    },
  });
