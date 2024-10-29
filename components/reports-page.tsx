"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Users, Baby, UserPlus, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface ReportCategory {
  title: string;
  actionText: string;
  link: string;
  color: string;
  icon: React.ElementType;
  description: string;
  analytics: string;
}
export function ReportsPageComponent() {
  const [analyticsData, setAnalyticsData] = useState({
    familyPlanningCount: 0,
    householdsCount: 0,
    pregnantsCount: 0,
    seniorCitizenCount: 0,
  });
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);
  const categories: ReportCategory[] = [
    {
      title: "Household",
      actionText: "View Household Reports",
      link: "/reports/household",
      color: "bg-blue-600",
      icon: Home,
      description: "Access comprehensive household data and statistics",
      analytics: analyticsData.householdsCount + " households registered",
    },
    {
      title: "Family Planning",
      actionText: "Check Family Planning Data",
      link: "/reports/family-planning",
      color: "bg-green-600",
      icon: Users,
      description: "Review family planning trends and effectiveness",
      analytics:
        analyticsData.familyPlanningCount +
        " families enrolled in planning programs",
    },
    {
      title: "Pregnant",
      actionText: "Monitor Pregnancy Reports",
      link: "/reports/pregnant",
      color: "bg-pink-600",
      icon: Baby,
      description: "Track pregnancy statistics and maternal health data",
      analytics: analyticsData.pregnantsCount + " active pregnancies monitored",
    },
    {
      title: "Senior Citizen",
      actionText: "Analyze Senior Citizen Data",
      link: "/reports/senior-citizen",
      color: "bg-purple-700",
      icon: UserPlus,
      description: "Examine data related to senior citizen welfare and health",
      analytics:
        analyticsData.seniorCitizenCount + " senior citizens registered",
    },
  ];

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={"/dashboard" + category.link} passHref>
                <motion.div
                  className={`${category.color} rounded-lg shadow-lg p-6 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <category.icon className="w-8 h-8 text-white" />
                    <Info className="w-5 h-5 text-white opacity-70" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {category.actionText}
                  </h2>
                  <p className="text-sm text-white opacity-90">
                    {category.analytics}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
