"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "January", profiles: 120 },
  { month: "February", profiles: 180 },
  { month: "March", profiles: 220 },
  { month: "April", profiles: 250 },
  { month: "May", profiles: 280 },
  { month: "June", profiles: 310 },
];

const profileData = [
  { title: "Total Profiles", value: 1360, color: "bg-blue-500" },
  { title: "Active Profiles", value: 1050, color: "bg-red-500" },
  { title: "Inactive Profiles", value: 310, color: "bg-green-500" },
  { title: "New Profiles", value: 180, color: "bg-violet-500" },
];

export default function HealthDashboard() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="p-4 sm:p-6 md:p-8  min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {profileData.map((item, index) => (
          <Card
            key={item.title}
            className={`transition-transform ${
              item.color
            } duration-300 ease-in-out  ${
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
            Barangay Health Profiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
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
                  dataKey="profiles"
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
