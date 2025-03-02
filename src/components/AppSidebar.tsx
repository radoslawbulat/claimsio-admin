
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  AlertCircle,
  CreditCard,
  Settings,
  Folder,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const collectionsSubMenu = [
  { title: "Debtors", icon: Users, path: "/debtors" },
  { title: "Disputes", icon: AlertCircle, path: "/disputes" },
  { title: "Payments", icon: CreditCard, path: "/payments" },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
        <div className="flex items-center h-14 px-4 border-b">
          <h1 className="text-2xl font-bold">Claimsio</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-2 w-full ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`
                    }
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="text-sm">Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="flex flex-col items-center gap-2 w-full text-muted-foreground">
                  <Folder className="h-5 w-5" />
                  <span className="text-sm">Collections</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {collectionsSubMenu.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2 ${
                              isActive ? "text-primary" : "text-muted-foreground"
                            }`
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-2 w-full ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`
                    }
                  >
                    <Settings className="h-5 w-5" />
                    <span className="text-sm">Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex flex-col items-center gap-2 w-full text-destructive hover:text-destructive/90"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm">Logout</span>
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

