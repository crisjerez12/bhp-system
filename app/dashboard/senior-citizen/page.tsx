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
import { X } from "lucide-react";
import { createSeniorCitizen } from "@/app/actions/senior-response";

const staffMembers = [
  "Maria Santos",
  "Juana Dela Cruz",
  "Rosario Fernandez",
  "Lourdes Garcia",
  "Carmela Reyes",
];

const puroks = Array.from({ length: 10 }, (_, i) => `Purok ${i + 1}`);

export default function SeniorCitizenForm() {
  const [age, setAge] = useState(0);
  const [medicines, setMedicines] = useState<string[]>([]);
  const [medicineName, setMedicineName] = useState("");
  const formWithMedicine = (formData: FormData) => {
    medicines.forEach((medicine) => formData.append("medicines[]", medicine));
    createSeniorCitizen(formData);
  };
  useEffect(() => {
    const birthdayInput = document.getElementById(
      "birthday"
    ) as HTMLInputElement;
    if (birthdayInput) {
      birthdayInput.addEventListener("change", calculateAge);
    }
    return () => {
      if (birthdayInput) {
        birthdayInput.removeEventListener("change", calculateAge);
      }
    };
  }, []);

  const calculateAge = () => {
    const birthdayInput = document.getElementById(
      "birthday"
    ) as HTMLInputElement;
    if (birthdayInput.value) {
      const birthDate = new Date(birthdayInput.value);
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
  };

  const handleAddMedicine = () => {
    if (
      medicineName.trim() !== "" &&
      !medicines.includes(medicineName.trim())
    ) {
      setMedicines([...medicines, medicineName.trim()]);
      setMedicineName("");
    }
  };

  const handleRemoveMedicine = (medicine: string) => {
    setMedicines(medicines.filter((m) => m !== medicine));
  };

  return (
    <form
      action={formWithMedicine}
      id="seniorCitizenForm"
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700"
          >
            First name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Enter first name"
            className="w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-sm font-medium text-gray-700"
          >
            Last name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Enter last name"
            className="w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="birthday"
            className="text-sm font-medium text-gray-700"
          >
            Birthday
          </Label>
          <Input
            id="birthday"
            name="birthDate"
            type="date"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium text-gray-700">
            Age
          </Label>
          <Input
            id="age"
            name="age"
            value={age}
            readOnly
            className="w-full bg-gray-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
            Weight (kg)
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            placeholder="Enter weight"
            className="w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="bloodPressure"
            className="text-sm font-medium text-gray-700"
          >
            Blood Pressure
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="bloodPressureSystolic"
              name="systolic"
              type="number"
              placeholder="Systolic"
              className="w-1/2"
              required
            />
            <span>/</span>
            <Input
              id="bloodPressureDiastolic"
              name="diastolic"
              type="number"
              placeholder="Diastolic"
              className="w-1/2"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="assignedStaff"
            className="text-sm font-medium text-gray-700"
          >
            Assigned Staff
          </Label>
          <Select name="assignedStaff">
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
        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-sm font-medium text-gray-700"
          >
            Address
          </Label>
          <Select name="address">
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
      <div className="space-y-4">
        <Label htmlFor="medicine" className="text-sm font-medium text-gray-700">
          Medicines
        </Label>
        <div className="flex space-x-2">
          <Input
            id="medicine"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="Enter medicine name"
            className="flex-grow"
          />
          <Button
            type="button"
            onClick={handleAddMedicine}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {medicines.map((medicine, index) => (
            <div
              key={index}
              className="bg-secondary text-secondary-foreground text-sm py-1 px-2 rounded-full flex items-center"
            >
              {medicine}
              <button
                type="button"
                onClick={() => handleRemoveMedicine(medicine)}
                className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="reset"
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
          onClick={() => {
            setAge(0);
            setMedicines([]);
            setMedicineName("");
          }}
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
