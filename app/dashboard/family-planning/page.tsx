"use client";

import { submitFamilyPlanningInfo } from "@/app/actions/family-planning-response";
import React, { useState, useEffect } from "react";

export default function FamilyPlanning() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [age, setAge] = useState<string>("");

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

  return (
    <div className="min-h-screen  p-4">
      <form action={submitFamilyPlanningInfo} className="space-y-6">
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              type="text"
              readOnly
              value={age}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="control-type"
              className="block text-sm font-medium text-gray-700"
            >
              Family Planning Control Type
            </label>
            <select
              id="control-type"
              name="controlType"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Type</option>
              <option value="pills">Pills</option>
              <option value="iud">IUD</option>
              <option value="implant">Implant</option>
              <option value="injection">Injection</option>
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="staff"
              className="block text-sm font-medium text-gray-700"
            >
              Assigned Staff
            </label>
            <select
              id="staff"
              name="assignedStaff"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Staff</option>
              <option value="maria">Maria Santos</option>
              <option value="josefina">Josefina Cruz</option>
              <option value="elena">Elena Reyes</option>
              <option value="isabella">Isabella Garcia</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <select
              id="address"
              name="address"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Purok</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={`Purok ${i + 1}`}>
                  Purok {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="reset"
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset
          </button>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
