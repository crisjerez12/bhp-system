"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Member {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  occupation: string;
}

interface HouseholdData {
  householdName: string;
  householdType: string;
  nhtsStatus: string;
  toilet: string;
  assignedStaff: string;
  address: string;
  createdAt: string;
  members: Member[];
}

export default function SeeHouseholdData() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<HouseholdData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/household/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch household data");
        }
        const householdData: HouseholdData = await response.json();
        setData(householdData);
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
          <Link href="/dashboard/reports/household/">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Household Reports
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
              <p>No data found for this household.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border-t-4 border-t-primary">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  <CardTitle className="text-2xl font-semibold">
                    Household Information
                  </CardTitle>
                </div>
                <Separator />
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <DataItem
                      label="Household Name"
                      value={data.householdName}
                    />
                    <DataItem
                      label="Household Type"
                      value={data.householdType}
                    />
                    <DataItem label="NHTS Status" value={data.nhtsStatus} />
                    <DataItem label="Toilet Facility" value={data.toilet} />
                  </div>
                  <div className="space-y-4">
                    <DataItem
                      label="Assigned Staff"
                      value={data.assignedStaff}
                    />
                    <DataItem label="Complete Address" value={data.address} />
                    <DataItem
                      label="Registration Date"
                      value={new Date(data.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle className="text-2xl font-semibold">
                    Household Members
                  </CardTitle>
                </div>
                <Separator />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Birthdate</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Occupation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.members.map((member, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {member.firstName} {member.lastName}
                        </TableCell>
                        <TableCell>
                          {new Date(member.birthdate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell>{member.gender}</TableCell>
                        <TableCell>{member.occupation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
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
    <>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </>
  );
}
