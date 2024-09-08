"use client";

import { useState, useEffect } from "react";
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

export default function SeniorCitizenForm() {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [age, setAge] = useState<number>(0);

  const staffMembers = [
    "Maria Santos",
    "Juana Dela Cruz",
    "Rosario Fernandez",
    "Lourdes Garcia",
    "Carmela Reyes",
  ];

  const puroks = Array.from({ length: 10 }, (_, i) => `Purok ${i + 1}`);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) =>
    (currentYear - i).toString()
  );

  const getDaysInMonth = (month: string, year: string) => {
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1 || !year) return 31;
    return new Date(parseInt(year), monthIndex + 1, 0).getDate();
  };

  useEffect(() => {
    if (day && month && year) {
      const birthDate = new Date(`${month} ${day}, ${year}`);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(0);
    }
  }, [day, month, year]);

  const handleReset = () => {
    setDay("");
    setMonth("");
    setYear("");
    setAge(0);
    // Reset other form fields here
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Submit form logic here
  };

  return (
    <form onSubmit={handleSubmit} className=" mx-auto p-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="text-gray-700">
            First name
          </Label>
          <Input
            id="firstName"
            placeholder="Enter first name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-gray-700">
            Last name
          </Label>
          <Input id="lastName" placeholder="Enter last name" className="mt-1" />
        </div>
        <div>
          <Label className="text-gray-700">Birthday</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger>
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: getDaysInMonth(month, year) }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="age" className="text-gray-700">
            Age
          </Label>
          <Input id="age" value={age} disabled className="mt-1 bg-gray-200" />
        </div>
        <div>
          <Label htmlFor="weight" className="text-gray-700">
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder="Enter weight"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="bloodPressure" className="text-gray-700">
            Blood Pressure
          </Label>
          <Input id="bloodPressure" placeholder="Enter BP" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="assignedStaff" className="text-gray-700">
            Assigned Staff
          </Label>
          <Select>
            <SelectTrigger className="mt-1">
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
        <div>
          <Label htmlFor="address" className="text-gray-700">
            Address
          </Label>
          <Select>
            <SelectTrigger className="mt-1">
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
      <div className="mt-6 flex justify-between">
        <Button
          type="button"
          onClick={handleReset}
          variant="outline"
          className="bg-white  border-blue-600 text-blue-600 hover:bg-gray-100"
        >
          Reset
        </Button>
        <Button
          type="submit"
          className=" bg-blue-700 hover:bg-blue-800 text-white "
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
