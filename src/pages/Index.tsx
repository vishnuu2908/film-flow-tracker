import { useDashboardStats } from "@/hooks/useProjectData";
import { useProjects } from "@/hooks/useProjects";
import { useProjectProgress } from "@/hooks/useProjectData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Film, CheckCircle, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) => (
  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1 font-['Space_Grotesk']">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProjectProgressCard = ({ project }: { project: any }) => {
  const { data: progress } = useProjectProgress(project.id);
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Link to="/projects" className="font-semibold text-foreground hover:text-primary transition-colors">
            {project.title}
          </Link>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            project.status === "Completed" ? "bg-green-100 text-green-700" :
            project.status === "On Hold" ? "bg-yellow-100 text-yellow-700" :
            "bg-blue-100 text-blue-700"
          }`}>
            {project.status}
          </span>
        </div>
        <Progress value={progress?.total ?? 0} className="h-3 mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Script: {progress?.script ?? 0}%</span>
          <span>Shoot: {progress?.shooting ?? 0}%</span>
          <span>Edit: {progress?.editing ?? 0}%</span>
          <span className="font-bold text-foreground">{progress?.total ?? 0}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  if (statsLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your short film projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={stats?.total ?? 0} icon={Film} color="bg-primary" />
        <StatCard title="Completed" value={stats?.completed ?? 0} icon={CheckCircle} color="bg-[hsl(var(--success))]" />
        <StatCard title="Ongoing" value={stats?.ongoing ?? 0} icon={Clock} color="bg-[hsl(var(--warning))]" />
        <StatCard title="Budget Spent" value={`$${(stats?.totalBudgetSpent ?? 0).toLocaleString()}`} icon={DollarSign} color="bg-[hsl(var(--accent))]" />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Project Progress</h2>
        </div>
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => <ProjectProgressCard key={p.id} project={p} />)}
          </div>
        ) : (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No projects yet. <Link to="/projects" className="text-primary hover:underline">Create your first project</Link></p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
