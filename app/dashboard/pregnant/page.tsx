"use client";

import { submitMotherInfo } from "@/app/actions/pregnant-response";
import React, { useState, useEffect } from "react";

export default function MothersForm() {
  const [age, setAge] = useState<number | string>("");
  const [birthDate, setBirthDate] = useState<string>("");

  useEffect(() => {
    if (birthDate) {
      const today = new Date();
      const birthDateObj = new Date(birthDate);
      const ageDiff = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        setAge(Math.max(0, ageDiff - 1));
      } else {
        setAge(Math.max(0, ageDiff));
      }
    }
  }, [birthDate]);

  return (
    <div className="min-h-screen   p-4">
      <div className="w-full space-y-8 bg-white  ">
        <form action={submitMotherInfo} className="space-y-6">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="ferrous"
                className="block text-sm font-medium text-gray-700"
              >
                Taking Ferrous
              </label>
              <select
                id="ferrous"
                name="takingFerrous"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
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
              <select
                id="staff"
                name="assignedStaff"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Assigned Staff</option>
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
                Address (Purok)
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

          <div className="flex items-center justify-end space-x-4 mt-6">
            <button
              type="reset"
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
    </div>
  );
}
