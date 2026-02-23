"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Users, Candy, MessageSquare, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Sweets",
    url: "/sweets",
    icon: Candy,
  },
  {
    title: "Testimonials",
    url: "/testimonials",
    icon: MessageSquare,
  },
];

import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { authActions } from "@/store/slices/auth";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  const nameInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-xl font-bold tracking-tight">Sanwariya Admin</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-4">
        <Separator />
        <div className="flex items-center gap-3 px-2 py-1">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">{nameInitial}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@sanwariya.com"}</p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full transition-colors" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
