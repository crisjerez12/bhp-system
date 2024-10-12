"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  month: z.string().min(1, "Month is required"),
  day: z.string().min(1, "Day is required"),
  year: z.string().min(1, "Year is required"),
  age: z.number().min(0),
  weight: z.string().min(1, "Weight is required"),
  bloodPressureSystolic: z.string().min(1, "Systolic pressure is required"),
  bloodPressureDiastolic: z.string().min(1, "Diastolic pressure is required"),
  assignedStaff: z.string().min(1, "Assigned staff is required"),
  address: z.string().min(1, "Address is required"),
  medicines: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SeniorCitizenForm() {
  const [age, setAge] = useState<number>(0);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<string[]>([]);
  const [medicineName, setMedicineName] = useState<string>("");

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      month: "",
      day: "",
      year: "",
      age: 0,
      weight: "",
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      assignedStaff: "",
      address: "",
      medicines: [],
    },
  });

  const month = watch("month");
  const day = watch("day");
  const year = watch("year");

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
      setValue("age", calculatedAge);
    } else {
      setAge(0);
      setValue("age", 0);
    }
  }, [day, month, year, setValue]);

  const onSubmit = async (data: FormData) => {
    const seniorCitizenData = {
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: {
        month: data.month,
        day: data.day,
        year: data.year,
      },
      age: data.age,
      weight: data.weight,
      bloodPressure: {
        systolic: data.bloodPressureSystolic,
        diastolic: data.bloodPressureDiastolic,
      },
      assignedStaff: data.assignedStaff,
      address: data.address,
      medicines: medicines,
    };

    try {
      const result = await createSeniorCitizen(seniorCitizenData);
      setSubmitStatus(result.message);
      if (result.success) {
        reset();
        setAge(0);
        setMedicines([]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("An error occurred. Please try again.");
    }
  };

  const handleReset = () => {
    reset();
    setAge(0);
    setMedicines([]);
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
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="text-gray-700">
            First name
          </Label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="firstName"
                placeholder="Enter first name"
                className="mt-1"
              />
            )}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName" className="text-gray-700">
            Last name
          </Label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="lastName"
                placeholder="Enter last name"
                className="mt-1"
              />
            )}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
        <div>
          <Label className="text-gray-700">Birthday</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <Controller
              name="month"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              )}
            />
            <Controller
              name="day"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: getDaysInMonth(month, year) },
                      (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              )}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="age" className="text-gray-700">
            Age
          </Label>
          <Controller
            name="age"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="age"
                value={age}
                disabled
                className="mt-1 bg-gray-200"
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-gray-700">
            Weight (kg)
          </Label>
          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="weight"
                type="number"
                placeholder="Enter weight"
                className="mt-1"
              />
            )}
          />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="bloodPressure" className="text-gray-700">
            Blood Pressure
          </Label>
          <div className="flex items-center space-x-2 mt-1">
            <Controller
              name="bloodPressureSystolic"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="bloodPressureSystolic"
                  type="number"
                  placeholder="Systolic"
                  className="w-1/2"
                />
              )}
            />
            <span>/</span>
            <Controller
              name="bloodPressureDiastolic"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="bloodPressureDiastolic"
                  type="number"
                  placeholder="Diastolic"
                  className="w-1/2"
                />
              )}
            />
          </div>
          {errors.bloodPressureSystolic && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bloodPressureSystolic.message}
            </p>
          )}
          {errors.bloodPressureDiastolic && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bloodPressureDiastolic.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="assignedStaff" className="text-gray-700">
            Assigned Staff
          </Label>
          <Controller
            name="assignedStaff"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
            )}
          />
          {errors.assignedStaff && (
            <p className="text-red-500 text-sm mt-1">
              {errors.assignedStaff.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="address" className="text-gray-700">
            Address
          </Label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
            )}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <Label htmlFor="medicine" className="text-gray-700">
          Medicines
        </Label>
        <div className="flex mt-2">
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
            className="ml-2 bg-blue-700 hover:bg-blue-800 text-white"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {medicines.map((medicine, index) => (
            <div
              key={index}
              className="bg-gray-200 text-gray-800 text-sm py-1 px-2 rounded-full flex items-center"
            >
              {medicine}
              <button
                type="button"
                onClick={() => handleRemoveMedicine(medicine)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      {submitStatus && (
        <div
          className={`mt-4 p-2 ${
            submitStatus.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {submitStatus}
        </div>
      )}
      <div className="mt-6 flex justify-between">
        <Button
          type="button"
          onClick={handleReset}
          variant="outline"
          className="bg-white border-blue-600 text-blue-600 hover:bg-gray-100"
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
