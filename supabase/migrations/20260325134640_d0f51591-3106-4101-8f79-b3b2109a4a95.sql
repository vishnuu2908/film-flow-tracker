
-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  director_name TEXT NOT NULL,
  genre TEXT NOT NULL,
  start_date DATE NOT NULL,
  expected_end_date DATE,
  status TEXT NOT NULL DEFAULT 'Ongoing' CHECK (status IN ('Ongoing', 'Completed', 'On Hold')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Scripts table
CREATE TABLE public.scripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'Draft', 'Final')),
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage scripts" ON public.scripts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON public.scripts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Shooting schedule table
CREATE TABLE public.shooting_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  shooting_date DATE NOT NULL,
  location TEXT NOT NULL,
  scene_number INT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shooting_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage shooting" ON public.shooting_schedule FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_shooting_updated_at BEFORE UPDATE ON public.shooting_schedule FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Editing table
CREATE TABLE public.editing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  editing_percentage INT NOT NULL DEFAULT 0 CHECK (editing_percentage >= 0 AND editing_percentage <= 100),
  editor_name TEXT NOT NULL,
  export_status TEXT NOT NULL DEFAULT 'Pending' CHECK (export_status IN ('Pending', 'Exported', 'In Progress')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.editing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage editing" ON public.editing FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_editing_updated_at BEFORE UPDATE ON public.editing FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Budget table
CREATE TABLE public.budget (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  estimated_budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  actual_expense DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.budget ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage budget" ON public.budget FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_budget_updated_at BEFORE UPDATE ON public.budget FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Crew table
CREATE TABLE public.crew (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  contact_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.crew ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage crew" ON public.crew FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_crew_updated_at BEFORE UPDATE ON public.crew FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
