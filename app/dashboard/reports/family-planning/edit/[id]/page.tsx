"use client";

import { useEffect, useState } from "react";
import { updateFamilyPlanningInfo } from "@/app/actions/family-planning-response";
import SubmitButton from "@/components/SubmitButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTROL_TYPE, fetchUsersData, PUROKS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface FamilyPlanningData {
  firstName: string;
  lastName: string;
  controlType: string;
  birthDate: Date | null;
  assignedStaff: string;
  address: string;
}

export default function FamilyPlanningEdit({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffList, setStaffList] = useState<string[]>([]);
  const [formData, setFormData] = useState<FamilyPlanningData>({
    firstName: "",
    lastName: "",
    controlType: "",
    birthDate: null,
    assignedStaff: "",
    address: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const staffData = await fetchUsersData();
        setStaffList(staffData);

        const response = await fetch(`/api/family-planning/${params.id}`);
        const result = await response.json();
        if (result.success) {
          const {
            firstName,
            lastName,
            controlType,
            birthDate,
            assignedStaff,
            address,
          } = result.data;
          setFormData({
            firstName,
            lastName,
            controlType,
            birthDate: new Date(birthDate),
            assignedStaff,
            address,
          });
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "birthDate") {
      setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      formData.append("_id", params.id); // Add the ID to the FormData

      const res = await updateFamilyPlanningInfo(formData);
      if (res instanceof Error) {
        throw res;
      }
      if (!res.success) {
        throw new Error(res.message || "Update failed");
      }
      router.push("/dashboard/reports/family-planning");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/reports/family-planning/">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Family-Planning Records
          </Button>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="max-w-7xl mt-2 mx-auto bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700"
            >
              First name
            </label>
            <input
              id="first-name"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-gray-700"
            >
              Last name
            </label>
            <input
              id="last-name"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter last name"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="birthday"
              className="block text-sm font-medium text-gray-700"
            >
              Birthday
            </label>
            <input
              id="birthday"
              name="birthDate"
              type="date"
              required
              value={
                formData.birthDate
                  ? formData.birthDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="control-type"
              className="block text-sm font-medium text-gray-700"
            >
              Family Planning Control Type
            </label>
            <Select
              name="controlType"
              value={formData.controlType}
              onValueChange={(value) =>
                handleSelectChange("controlType", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {CONTROL_TYPE.map((type, i) => (
                  <SelectItem key={i + 1} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="staff"
              className="block text-sm font-medium text-gray-700"
            >
              Assigned Staff
            </label>
            <Select
              name="assignedStaff"
              value={formData.assignedStaff}
              onValueChange={(value) =>
                handleSelectChange("assignedStaff", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Assigned Staff" />
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
          <div className="space-y-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <Select
              name="address"
              value={formData.address}
              onValueChange={(value) => handleSelectChange("address", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Purok" />
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

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() =>
              setFormData({
                firstName: "",
                lastName: "",
                controlType: "",
                birthDate: null,
                assignedStaff: "",
                address: "",
              })
            }
          >
            Reset
          </button>
          <SubmitButton />
        </div>
      </form>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg font-semibold">Submitting form...</p>
          </div>
        </div>
      )}
    </div>
  );
}
