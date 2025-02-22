
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
  const isCollapsed = state === "collapsed";

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
        <SidebarGroup className="px-2 py-4">
          <div className="flex items-center justify-between">
            <h1
              className={cn(
                "font-bold text-2xl transition-opacity duration-300",
                isCollapsed && "opacity-0"
              )}
            >
              Claimsio
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 hover:bg-accent"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 w-full transition-all duration-300",
                          isCollapsed ? "justify-center px-2" : "px-4",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span
                        className={cn(
                          "transition-all duration-300",
                          isCollapsed && "hidden"
                        )}
                      >
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 w-full transition-all duration-300",
                        isCollapsed ? "justify-center px-2" : "px-4",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )
                    }
                  >
                    <Settings className="h-4 w-4 shrink-0" />
                    <span
                      className={cn(
                        "transition-all duration-300",
                        isCollapsed && "hidden"
                      )}
                    >
                      Settings
                    </span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className={cn(
                    "flex items-center gap-3 w-full text-destructive hover:text-destructive/90 transition-all duration-300",
                    isCollapsed ? "justify-center px-2" : "px-4"
                  )}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span
                    className={cn(
                      "transition-all duration-300",
                      isCollapsed && "hidden"
                    )}
                  >
                    Logout
                  </span>
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

