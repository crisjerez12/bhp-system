"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Baby,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type React from "react";
import { SeniorCitizenPDFGenerator } from "@/components/SeniorCitizenPDFGenerator";
import { PregnantPDFGenerator } from "@/components/PregnantPDFGenerator";
import { FamilyPlanningPDFGenerator } from "@/components/FamilyPlanningPDFGenerator";
import { HouseholdPDFGenerator } from "@/components/HouseholdPDFGenerator";


interface ReportCategory {
  title: string;
  actionText: string;
  link: string;
  color: string;
  icon: React.ElementType;
  description: string;
  analytics: string;
  count: number;
}

interface AnalyticsData {
  households: number;
  pregnants: number;
  seniorCitizens: number;
  familyPlannings: number;
  monthlyResponse: {
    [key: string]: number;
  };
}

export default function ReportsPageComponent() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-store",
          },
        });
        const data = await response.json();
        if (data.success) {
          setAnalyticsData(data.data);
        } else {
          console.error("Error fetching analytics:", data.message);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const categories: ReportCategory[] = [
    {
      title: "Household",
      actionText: "View Household Reports",
      link: "/dashboard/reports/household",
      color: "bg-blue-200",
      icon: Home,
      description: "Access comprehensive household data and statistics",
      analytics: analyticsData
        ? `${analyticsData.households} households registered`
        : "Loading...",
      count: analyticsData ? analyticsData.households : 0,
    },
    {
      title: "Family Planning",
      actionText: "Check Family Planning Data",
      link: "/dashboard/reports/family-planning",
      color: "bg-green-200",
      icon: Users,
      description: "Review family planning trends and effectiveness",
      analytics: analyticsData
        ? `${analyticsData.familyPlannings} families enrolled in planning programs`
        : "Loading...",
      count: analyticsData ? analyticsData.familyPlannings : 0,
    },
    {
      title: "Pregnant",
      actionText: "Monitor Pregnancy Reports",
      link: "/dashboard/reports/pregnant",
      color: "bg-pink-200",
      icon: Baby,
      description: "Track pregnancy statistics and maternal health data",
      analytics: analyticsData
        ? `${analyticsData.pregnants} active pregnancies monitored`
        : "Loading...",
      count: analyticsData ? analyticsData.pregnants : 0,
    },
    {
      title: "Senior Citizen",
      actionText: "Analyze Senior Citizen Data",
      link: "/dashboard/reports/senior-citizen",
      color: "bg-purple-200",
      icon: UserPlus,
      description: "Examine data related to senior citizen welfare and health",
      analytics: analyticsData
        ? `${analyticsData.seniorCitizens} senior citizens registered`
        : "Loading...",
      count: analyticsData ? analyticsData.seniorCitizens : 0,
    },
  ];

  const downloadRecords = [
    {
      title: "DOWNLOAD HOUSEHOLD RECORDS",
      color: "bg-blue-600 hover:bg-blue-700",
      component:HouseholdPDFGenerator,
    },
    {
      title: "DOWNLOAD SENIOR CITIZEN RECORDS",
      color: "bg-orange-600 hover:bg-orange-700",
      component: SeniorCitizenPDFGenerator,
    },
    {
      title: "DOWNLOAD PREGNANT RECORDS",
      color: "bg-green-600 hover:bg-green-700",
      component: PregnantPDFGenerator,
    },
    {
      title: "DOWNLOAD FAMILY PLANNING RECORDS",
      color: "bg-emerald-600 hover:bg-emerald-700",
      component: FamilyPlanningPDFGenerator,
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          {loading && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-8 w-8 rounded-full border-4 border-gray-200">
                  <div className="absolute top-0 left-0 h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              </div>
              <span className="text-sm text-gray-600 font-medium">Loading data...</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              className={cn(
                "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300",
                category.color
              )}
            >
              <Link href={category.link}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <category.icon className="text-gray-700" />
                      <h2 className="text-lg font-semibold">
                        {category.title}
                      </h2>
                    </div>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-16 animate-pulse bg-gray-200 rounded-full"></div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600 font-medium">
                        {category.count} records
                      </span>
                    )}
                  </div>
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 animate-pulse bg-gray-200 rounded-full"></div>
                      <div className="h-4 w-1/2 animate-pulse bg-gray-200 rounded-full"></div>
                    </div>
                  ) : (
                    <p className="text-gray-600 mb-4">{category.description}</p>
                  )}
                  <div className="mt-auto flex items-center text-primary hover:text-primary-dark transition-colors duration-200">
                    <span className="mr-2">View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <h3 className="mt-8 mb-4 font-bold text-xl">DOWNLOAD RECORDS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {downloadRecords.map((record, index) => (
            <motion.div
              key={record.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <record.component />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
