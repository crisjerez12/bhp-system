"use client";

import { submitMotherInfo } from "@/app/actions/pregnant-response";
import SubmitButton from "@/components/SubmitButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchUsersData, PUROKS } from "@/lib/constants";
import { useState, useEffect } from "react";

export default function MothersForm() {
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
      const res = await submitMotherInfo(formData);
      if (!res?.success) {
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
      <div className="w-full space-y-8 bg-white">
        <form key={key} action={handleSubmit} className="space-y-6">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="ferrous"
                className="block text-sm font-medium text-gray-700"
              >
                Taking Ferrous
              </label>
              <Select name="takingFerrous">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Weight (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="blood-pressure"
                className="block text-sm font-medium text-gray-700"
              >
                Blood Pressure
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="systolic"
                  name="systolic"
                  type="number"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Systolic"
                />
                <input
                  id="diastolic"
                  name="diastolic"
                  type="number"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Diastolic"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="pregnancy-duration"
                className="block text-sm font-medium text-gray-700"
              >
                Pregnancy Duration
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="months"
                  name="months"
                  type="number"
                  min="0"
                  max="9"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Months"
                />
                <input
                  id="weeks"
                  name="weeks"
                  type="number"
                  min="0"
                  max="3"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Weeks"
                />
              </div>
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
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address (Purok)
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

          <div className="flex items-center justify-between space-x-4 mt-6">
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
      </div>
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