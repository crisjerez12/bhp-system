"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsData {
  success: boolean;
  message: string;
  totalProfiles: number;
  data: {
    households: number;
    pregnants: number;
    seniorCitizens: number;
    familyPlannings: number;
    monthlyResponse: {
      [key: string]: number;
    };
  };
}

export default function HealthDashboard() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics", {
          next: { revalidate: 0 },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch the Data");
        }
        const data: AnalyticsData = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        setAnalyticsData(data);
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-4xl">Loading...</div>;
  }

  if (error || !analyticsData) {
    return (
      <div className="p-4 text-center text-red-500">
        {error || "No data available"}
      </div>
    );
  }

  const profileData = [
    {
      title: "Total Profiles",
      value: analyticsData.totalProfiles,
      color: "bg-blue-500",
    },
    {
      title: "Households",
      value: analyticsData.data.households,
      color: "bg-green-500",
    },
    {
      title: "Pregnants",
      value: analyticsData.data.pregnants,
      color: "bg-yellow-500",
    },
    {
      title: "Senior Citizens",
      value: analyticsData.data.seniorCitizens,
      color: "bg-purple-500",
    },
    {
      title: "Family Plannings",
      value: analyticsData.data.familyPlannings,
      color: "bg-pink-500",
    },
  ];

  const monthlyData = Object.entries(analyticsData.data.monthlyResponse)
    .map(([month, count]) => ({
      month,
      Profiles: count,
    }))
    .reverse();

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {profileData.map((item, index) => (
          <Card
            key={item.title}
            className={`transition-transform ${
              item.color
            } duration-300 ease-in-out ${
              hoveredCard === index ? "transform -translate-y-1 skew-y-1" : ""
            }`}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">
                {item.value.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Monthly Health Profiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorProfiles"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Profiles"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorProfiles)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
