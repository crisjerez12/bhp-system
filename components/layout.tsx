"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Home,
  Users,
  Heart,
  UserPlus,
  FileText,
  User,
  LogOut,
  BadgePlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/app/actions/my-account-actions";
import { logout } from "@/app/actions/auth";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import Image from "next/image";

type MenuItem = {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
  match?: (path: string) => boolean;
};

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("USER");
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const staffMenuItems: MenuItem[] = [
    { name: "Household", icon: Users, path: "/dashboard/household" },
    {
      name: "Family Planning",
      icon: Heart,
      path: "/dashboard/family-planning",
    },
    { name: "Pregnant", icon: BadgePlus, path: "/dashboard/pregnant" },
    {
      name: "Senior Citizen",
      icon: UserPlus,
      path: "/dashboard/senior-citizen",
    },
    { name: "My Account", icon: User, path: "/dashboard/my-account" },
  ];

  const adminMenuItems: MenuItem[] = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Household", icon: Users, path: "/dashboard/household" },
    {
      name: "Family Planning",
      icon: Heart,
      path: "/dashboard/family-planning",
    },
    { name: "Pregnant", icon: BadgePlus, path: "/dashboard/pregnant" },
    {
      name: "Senior Citizen",
      icon: UserPlus,
      path: "/dashboard/senior-citizen",
    },
    {
      name: "Reports",
      icon: FileText,
      path: "/dashboard/reports",
      match: (path: string) => path.startsWith("/dashboard/reports"),
    },
  ];

  const menuItems = username === "Staff" ? staffMenuItems : adminMenuItems;
  const customPath = pathname.startsWith("/dashboard/reports/");
  let link = "";
  if (customPath) {
    link = pathname.replace("/dashboard/reports/", "").split("/")[0];
  }
  
  const currentPage =
    menuItems.find((item) =>
      item.match ? item.match(pathname) : item.path === pathname
    )?.name || "My Account";

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

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      console.log(user);
      if (user) {
        setUsername(user.firstName + " " + user.lastName);
      }
    };
    fetchUser();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    toast
      .promise(logout(), {
        pending: "Logging out...",
        success: "Logged out successfully",
        error: "Failed to logout",
      })
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

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
        className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 min-h-screen transform transition-transform duration-200 ease-in-out z-30 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="h-full p-4 flex flex-col">
          <Card className="mb-6 bg-blue-800 border-none">
            <div className="flex items-center p-4">
              <Image
                src="/logo.png"
                width={100}
                height={100}
                alt="BHP Logo"
                className="w-14 h-14 mr-2"
              />

              <h1 className="text-md font-bold leading-tight text-white">
                BARANGAY HEALTH PROFILING
              </h1>
            </div>
          </Card>
          <nav className="flex-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center py-2 px-4 mb-2 rounded transition-colors duration-150 ${
                    (item.match ? item.match(pathname) : pathname === item.path)
                      ? "bg-blue-800 hover:bg-blue-900"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <IconComponent className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#5C55BF] text-white shadow-md">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="md:hidden mr-4">
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="font-semibold sm:text-md md:text-lg lg:text-2xl capitalize">
                {link || currentPage}
              </h2>
            </div>
            <div className="flex items-center">
              <Link href="/dashboard/my-account">
                <span className="mr-4 bg-blue-50 font-semibold text-black px-4 py-[6px] hover:bg-blue-200 duration-150 rounded-md shadow-md flex items-center gap-1 hover:scale-110   ">
                  <User className="h-5 w-5" />
                  {username.toUpperCase()}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-[#1e1e2d] text-white px-3 py-1 rounded flex items-center"
              >
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
