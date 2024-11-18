"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FamilyPlanningData {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  age: number;
  controlType: string;
  assignedStaff: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: FamilyPlanningData;
}

export default function FamilyPlanning() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<FamilyPlanningData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/family-planning/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch family planning data");
        }
        const result: ApiResponse = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError("An error occurred while fetching the data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/reports/family-planning/">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Family Planning Records
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <Card>
            <CardContent>
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        ) : !data ? (
          <Card>
            <CardContent>
              <p>No data found for this family planning record.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <UserCircle className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl font-semibold">
                  Family Planning Information
                </CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <DataItem label="First Name" value={data.firstName} />
                  <DataItem label="Last Name" value={data.lastName} />
                  <DataItem
                    label="Birth Date"
                    value={new Date(data.birthDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  />
                  <DataItem label="Age" value={data.age.toString()} />
                </div>
                <div className="space-y-4">
                  <DataItem label="Control Type" value={data.controlType} />
                  <DataItem label="Assigned Staff" value={data.assignedStaff} />
                  <DataItem label="Address" value={data.address} />
                  <DataItem
                    label="Created At"
                    value={new Date(data.createdAt).toLocaleString()}
                  />
                  <DataItem
                    label="Updated At"
                    value={new Date(data.updatedAt).toLocaleString()}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-base">{value}</span>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(9)].map((_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
