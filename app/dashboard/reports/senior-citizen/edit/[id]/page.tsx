"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { updateSeniorCitizenRecord } from "@/app/actions/senior-response";

type SeniorCitizen = {
  _id?: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  age: number;
  weight: number;
  systolic: number;
  diastolic: number;
  assignedStaff: string;
  address: string;
  medicines?: string[];
};

const staffMembers = [
  "Maria Santos",
  "Juana Dela Cruz",
  "Rosario Fernandez",
  "Lourdes Garcia",
  "Carmela Reyes",
];

const puroks = Array.from({ length: 10 }, (_, i) => `Purok ${i + 1}`);

export default function SeniorCitizenForm() {
  const params = useParams();
  const id = params?.id as string;
  const [formData, setFormData] = useState<SeniorCitizen>({
    _id: id || undefined,
    firstName: "",
    lastName: "",
    birthDate: new Date(),
    age: 0,
    weight: 0,
    systolic: 0,
    diastolic: 0,
    assignedStaff: "",
    address: "",
    medicines: [],
  });
  const [medicineName, setMedicineName] = useState("");

  useEffect(() => {
    if (id) {
      fetchSeniorCitizen(id);
    }
  }, [id]);

  const fetchSeniorCitizen = async (id: string) => {
    try {
      const response = await fetch(`/api/senior-citizen/${id}`);
      const result = await response.json();
      if (result.success) {
        const data = result.data;
        setFormData({
          ...data,
          _id: id,
          birthDate: new Date(data.birthDate),
          medicines: data.medicines || [],
        });
      }
    } catch (error) {
      console.error("Error fetching senior citizen data:", error);
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "birthDate") {
      const newBirthDate = new Date(value);
      setFormData((prev) => ({
        ...prev,
        birthDate: newBirthDate,
        age: calculateAge(newBirthDate),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedicine = () => {
    if (
      medicineName.trim() !== "" &&
      formData.medicines &&
      !formData.medicines.includes(medicineName.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        medicines: [...(prev.medicines || []), medicineName.trim()],
      }));
      setMedicineName("");
    }
  };

  const handleRemoveMedicine = (medicine: string) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines?.filter((m) => m !== medicine) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateSeniorCitizenRecord(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="_id" value={formData._id || ""} />
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
            value={formData.firstName}
            onChange={handleInputChange}
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
            value={formData.lastName}
            onChange={handleInputChange}
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
            value={formData.birthDate.toISOString().split("T")[0]}
            onChange={handleInputChange}
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
            value={formData.age}
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
            value={formData.weight}
            onChange={handleInputChange}
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
              value={formData.systolic}
              onChange={handleInputChange}
              placeholder="Systolic"
              className="w-1/2"
              required
            />
            <span>/</span>
            <Input
              id="bloodPressureDiastolic"
              name="diastolic"
              type="number"
              value={formData.diastolic}
              onChange={handleInputChange}
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
          <Select
            name="assignedStaff"
            value={formData.assignedStaff}
            onValueChange={(value) =>
              handleSelectChange("assignedStaff", value)
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
        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-sm font-medium text-gray-700"
          >
            Address
          </Label>
          <Select
            name="address"
            value={formData.address}
            onValueChange={(value) => handleSelectChange("address", value)}
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
          {formData.medicines?.map((medicine, index) => (
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
            setFormData({
              _id: id || undefined,
              firstName: "",
              lastName: "",
              birthDate: new Date(),
              age: 0,
              weight: 0,
              systolic: 0,
              diastolic: 0,
              assignedStaff: "",
              address: "",
              medicines: [],
            });
            setMedicineName("");
          }}
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {formData._id ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
