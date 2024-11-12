"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IPregnant } from "@/lib/models/pregnant";
import { fetchUsersData, PUROKS } from "@/lib/constants";
import { updateMotherInfo } from "@/app/actions/pregnant-response";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Component({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffList, setStaffList] = useState<string[]>([]);
  const [formData, setFormData] = useState<IPregnant | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/pregnant/${params.id}`);
        const result = await response.json();
        if (result.success) {
          setFormData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadStaffData = async () => {
      const data = await fetchUsersData();
      setStaffList(data);
    };

    fetchData();
    loadStaffData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      formData.append("_id", params.id); // Add the ID to the FormData
      const result = await updateMotherInfo(formData);
      if (!result?.success) {
        throw new Error("Update failed");
      }
      router.push("/dashboard/reports/pregnant");
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!formData) {
    return <div className="p-4">No data found</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/reports/pregnant/">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pregnant Records
          </Button>
        </Link>
      </div>
      <div className="mx-auto mt-2 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={formData.firstName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={formData.lastName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birthday</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                defaultValue={(formData.birthDate + "").split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="takingFerrous">Taking Ferrous</Label>
              <Select
                name="takingFerrous"
                defaultValue={formData.takingFerrous.toString()}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                defaultValue={formData.weight}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Blood Pressure</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  name="systolic"
                  placeholder="Systolic"
                  type="number"
                  defaultValue={formData.systolic}
                  required
                />
                <Input
                  name="diastolic"
                  placeholder="Diastolic"
                  type="number"
                  defaultValue={formData.diastolic}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Pregnancy Duration</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  name="months"
                  placeholder="Months"
                  type="number"
                  min="0"
                  max="9"
                  defaultValue={formData.months}
                  required
                />
                <Input
                  name="weeks"
                  placeholder="Weeks"
                  type="number"
                  min="0"
                  max="3"
                  defaultValue={formData.weeks}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedStaff">Assigned Staff</Label>
              <Select
                name="assignedStaff"
                defaultValue={formData.assignedStaff}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map((staff, index) => (
                    <SelectItem key={index} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address (Purok)</Label>
              <Select name="address" defaultValue={formData.address}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PUROKS.map((purok, i) => (
                    <SelectItem key={i} value={purok}>
                      {purok}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg font-semibold">Saving changes...</p>
          </div>
        </div>
      )}
    </div>
  );
}
