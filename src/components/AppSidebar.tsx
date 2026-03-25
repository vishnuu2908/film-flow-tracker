import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Film, FileText, Camera, Scissors, DollarSign, Users, LogOut, Clapperboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Projects", icon: Film, path: "/projects" },
  { label: "Scripts", icon: FileText, path: "/scripts" },
  { label: "Shooting", icon: Camera, path: "/shooting" },
  { label: "Editing", icon: Scissors, path: "/editing" },
  { label: "Budget", icon: DollarSign, path: "/budget" },
  { label: "Crew", icon: Users, path: "/crew" },
];

const AppSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-primary text-primary-foreground flex flex-col">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <Clapperboard className="h-8 w-8" />
        <div>
          <h1 className="text-lg font-bold font-['Space_Grotesk']">ShortFilm</h1>
          <p className="text-xs opacity-70">Track Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-white/20 text-white shadow-md"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
