"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { useAppSelector } from "@/hooks/store";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!user && !isLoginPage) {
      router.push("/login");
    }
  }, [user, isLoginPage, router]);

  if (isLoginPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
