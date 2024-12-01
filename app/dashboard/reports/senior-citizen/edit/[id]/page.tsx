"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { fetchUsersData, PUROKS } from "@/lib/constants";
import SubmitButton from "@/components/SubmitButton";
import { updateSeniorCitizen } from "@/app/actions/senior-response";

export default function SeniorCitizenForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    weight: "",
    systolic: "",
    diastolic: "",
    assignedStaff: "",
    address: "",
  });
  const [medicines, setMedicines] = useState<string[]>([]);
  const [medicineName, setMedicineName] = useState("");
  const [staffList, setStaffList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [staffData, seniorData] = await Promise.all([
          fetchUsersData(),
          id
            ? fetch(`/api/senior-citizen/${id}`).then((res) => res.json())
            : null,
        ]);

        setStaffList(staffData);

        if (seniorData && seniorData.success) {
          const { data } = seniorData;
          setFormData({
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: new Date(data.birthDate).toISOString().split("T")[0],
            weight: data.weight.toString(),
            systolic: data.systolic.toString(),
            diastolic: data.diastolic.toString(),
            assignedStaff: data.assignedStaff,
            address: data.address,
          });
          setMedicines(data.medicines);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
      setIsLoading(false);
    };

    loadData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submitData = new FormData(e.currentTarget);
    medicines.forEach((medicine) => submitData.append("medicines[]", medicine));

    try {
      if (id) submitData.append("_id", id as string);
      const res = await updateSeniorCitizen(submitData);
      if (!res.success) {
        throw new Error("Failed to update");
      }
      router.push("/dashboard/reports/senior-citizen");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
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
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="weight"
              className="text-sm font-medium text-gray-700"
            >
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
              defaultValue={formData.assignedStaff}
              onValueChange={(value) =>
                handleSelectChange("assignedStaff", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Staff" />
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
                {PUROKS.map((purok, index) => (
                  <SelectItem key={index} value={purok}>
                    {purok}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="medicine"
              className="text-sm font-medium text-gray-700"
            >
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
        </div>

        <div className="flex justify-end">
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
    </>
  );
}
