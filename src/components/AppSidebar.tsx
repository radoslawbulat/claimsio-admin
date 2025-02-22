
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Portfolios", icon: Briefcase, path: "/portfolios" },
  { title: "Debtors", icon: Users, path: "/debtors" },
  { title: "Events", icon: Calendar, path: "/events" },
  { title: "Payments", icon: CreditCard, path: "/payments" },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Success",
        description: "Successfully logged out",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to logout",
      });
    }
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        {/* Logo and Toggle Section */}
        <div className="p-4 flex items-center justify-between">
          <div className={cn(
            "flex items-center gap-3",
            state === "collapsed" && "opacity-0"
          )}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">C</span>
            </div>
            <span className="font-bold text-2xl">Claimsio</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hover:bg-accent"
          >
            {state === "collapsed" ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Main Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={state === "collapsed" ? item.title : undefined} asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 w-full",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={state === "collapsed" ? "Settings" : undefined} asChild>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 w-full",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )
                    }
                  >
                    <Settings className="h-4 w-4 shrink-0" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={state === "collapsed" ? "Logout" : undefined}
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-destructive hover:text-destructive/90"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

