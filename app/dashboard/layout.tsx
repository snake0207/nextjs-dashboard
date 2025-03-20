import SideNav from "@/app/ui/dashboard/sidenav";
import { Metadata } from "next";
import ThemeToggle from "@/app/ui/themeToggle";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "The official Next.js Course Dashboard, built with App Router.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-menu-primary flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex flex-col">
        <div className="h-20 flex justify-end items-center p-[8px]">
          <ThemeToggle />
        </div>
        <div className="bg-page-primary flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
