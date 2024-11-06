"use client";

import { updateMotherInfo } from "@/app/actions/pregnant-response";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IPregnant } from "@/lib/models/pregnant";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const staffMembers = [
  "Maria Santos",
  "Juana Dela Cruz",
  "Rosario Fernandez",
  "Lourdes Garcia",
  "Carmela Reyes",
];
const puroks = Array.from({ length: 10 }, (_, i) => `Purok ${i + 1}`);

export default function MothersForm() {
  const [age, setAge] = useState<number | string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [formData, setFormData] = useState<IPregnant | undefined>();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (birthDate) {
      const today = new Date();
      const birthDateObj = new Date(birthDate);
      let calculatedAge = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        calculatedAge--;
      }
      setAge(calculatedAge.toString());
    }
  }, [birthDate]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/pregnant/${id}`);
          const data = await response.json();
          if (data.success) {
            setFormData(data.data);
            const date = new Date(data.data.birthDate);
            const formattedDate = date.toISOString().split("T")[0];
            setBirthDate(formattedDate);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [id]);

  const updateFormData = (name: keyof IPregnant, value: string | boolean) => {
    setFormData((prev) => {
      if (!prev) return undefined;
      if (name === "takingFerrous") {
        return { ...prev, [name]: value === "true" };
      }
      return { ...prev, [name]: value };
    });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="w-full space-y-8 bg-white">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formData.append("_id", id);
            const birthDate = formData.get("birthDate");
            if (birthDate && typeof birthDate === "string") {
              formData.set("birthDate", new Date(birthDate).toISOString());
            }
            await updateMotherInfo(formData);
          }}
          className="space-y-6"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                defaultValue={formData?.firstName || ""}
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                defaultValue={formData?.lastName || ""}
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
                value={birthDate}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700"
              >
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={age}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="ferrous"
                className="block text-sm font-medium text-gray-700"
              >
                Taking Ferrous
              </label>
              <Select
                name="takingFerrous"
                value={formData?.takingFerrous ? "true" : "false"}
                onValueChange={(value) =>
                  updateFormData("takingFerrous", value)
                }
              >
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
                defaultValue={formData?.weight || ""}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                  defaultValue={formData?.systolic || ""}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Systolic"
                />
                <input
                  id="diastolic"
                  name="diastolic"
                  type="number"
                  required
                  defaultValue={formData?.diastolic || ""}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                  defaultValue={formData?.months || ""}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Months"
                />
                <input
                  id="weeks"
                  name="weeks"
                  type="number"
                  min="0"
                  max="3"
                  required
                  defaultValue={formData?.weeks || ""}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
              <Select
                name="assignedStaff"
                value={formData?.assignedStaff}
                onValueChange={(value) =>
                  updateFormData("assignedStaff", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff, index) => (
                    <SelectItem
                      key={index}
                      value={staff.toLowerCase().replace(" ", "-")}
                    >
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
              <Select
                name="address"
                value={formData?.address}
                onValueChange={(value) => updateFormData("address", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Purok" />
                </SelectTrigger>
                <SelectContent>
                  {puroks.map((purok, index) => (
                    <SelectItem
                      key={index}
                      value={purok.toLowerCase().replace(" ", "-")}
                    >
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
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              Reset
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
