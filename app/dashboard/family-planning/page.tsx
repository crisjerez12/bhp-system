"use client";

import { useEffect, useState } from "react";
import { submitFamilyPlanningInfo } from "@/app/actions/family-planning-response";
import SubmitButton from "@/components/SubmitButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTROL_TYPE, fetchUsersData, PUROKS } from "@/lib/constants";

export default function FamilyPlanning() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [key, setKey] = useState(+new Date());
  const [staffList, setStaffList] = useState<string[]>([]);

  useEffect(() => {
    const loadStaffData = async () => {
      const data = await fetchUsersData();
      setStaffList(data);
    };
    loadStaffData();
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      const res = await submitFamilyPlanningInfo(formData);
      if (!res.success) {
        throw new Error("Submission Failed");
      }
      setKey(+new Date());
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen p-4">
      <form
        key={key}
        action={handleSubmit}
        className="max-w-7xl mx-auto bg-white  "
      >
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
            <Select name="controlType">
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
            <Select name="assignedStaff">
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
          <div className="space-y-2 ">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <Select name="address">
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
            type="reset"
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => setKey(+new Date())}
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
