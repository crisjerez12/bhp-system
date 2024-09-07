"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  Heart,
  UserPlus,
  FileText,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Household", icon: Users, path: "/dashboard/household" },
    {
      name: "Family Planning",
      icon: Heart,
      path: "/dashboard/family-planning",
    },
    {
      name: "Senior Citizen",
      icon: UserPlus,
      path: "/dashboard/senior-citizen",
    },
    { name: "Reports", icon: FileText, path: "/dashboard/reports" },
    { name: "My Account", icon: User, path: "/dashboard/my-account" },
  ];

  const currentPage =
    menuItems.find((item) => item.path === pathname)?.name || "Dashboard";

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen ">
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 bg-[#1e1e2d] text-white w-64 min-h-screen p-4 transform transition-transform duration-200 ease-in-out z-30 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold ml-5">BHP SYSTEM</h1>
          <button onClick={toggleSidebar} className="md:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center py-2 px-4 mb-2 rounded hover:bg-[#2d2d3f] transition-colors ${
                  pathname === item.path
                    ? "bg-[#f1416c] hover:bg-[#f1416c]"
                    : ""
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconComponent className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#6366f1] text-white shadow-md">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="md:hidden mr-4">
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="font-semibold sm:text-md md:text-lg lg:text-2xl">
                {currentPage}
              </h2>
            </div>
            <div className="flex items-center">
              <span className="mr-4">ADMIN</span>
              <button className="bg-[#1e1e2d] text-white px-3 py-1 rounded flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
