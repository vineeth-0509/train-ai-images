import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { AppSidebar } from "./dashboard/app-sidebar";
interface Props {
  children: React.ReactNode;
}

const sidebarLayout = ({ children }: Props) => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar/>
        <main className="m-2 w-full">
          <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar p-2 px-4 shadow">
            {/* <SearchBar/> */}
            <div className="ml-auto">
              <UserButton />
            </div>
          </div>
          <div className="h-4"> </div>


            {/* <MainContent/> */}
            <div className="border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)]">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default sidebarLayout;
