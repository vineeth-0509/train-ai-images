"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  Plus,
  Presentation,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

const projects = [
  { name: "project 1" },
  { name: "project 2" },
  { name: "project 3" },
  { name: "project 4" },
];
export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src='/logo.png' alt='logo' width={50} height={50}/>
          {open && (
            <h1 className="text-2xl font-bold text-primary hover:scale-150 hover:text-blue-700">
              Analysis
            </h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>Application</SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      {
                        "!bg-primary !text-white": pathname === item.url,
                      },
                      "list-none",
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => {
                  return (
                    <SidebarMenuItem key={project.name}>
                      <SidebarMenuButton asChild>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex size-6 items-center justify-center rounded-sm border bg-white text-sm text-primary",
                              {
                                "bg-primary text-white": true,
                              },
                            )}
                          >
                            {project.name[0]}
                          </div>
                          <span>{project.name}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                <div className="h-2">
                  {open && (
                    <SidebarMenuItem>
                      <Link href="/create">
                        <Button className="w-fit bg-blue-700 text-white">
                          <Plus size={5} strokeWidth={3} />
                          Create Project
                        </Button>
                      </Link>
                    </SidebarMenuItem>
                  )}
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarGroupContent>
      </SidebarContent>
    </Sidebar>
  );
}
