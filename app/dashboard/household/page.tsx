"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createHousehold } from "@/app/actions/household-response";

type HouseholdMember = {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: "Male" | "Female";
  occupation: string;
};

type FormData = {
  householdName: string;
  householdType: "nuclear" | "extended" | "single" | "other" | "";
  nhtsStatus: "poor" | "non-poor" | "";
  toilet: "yes" | "no" | "";
  assignedStaff: "maria" | "isabel" | "andrea" | "sofia" | "";
  address: string;
  members: HouseholdMember[];
};

const initialFormData: FormData = {
  householdName: "",
  householdType: "",
  nhtsStatus: "",
  toilet: "",
  assignedStaff: "",
  address: "",
  members: [],
};

export default function HouseholdFormComponent() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await createHousehold(formData);
      if (res.success) setFormData(initialFormData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = (member: HouseholdMember) => {
    setFormData((prev) => ({ ...prev, members: [...prev.members, member] }));
    setAddMemberDialogOpen(false);
  };

  const handleEditMember = (index: number) => {
    setEditingIndex(index);
    setEditDialogOpen(true);
  };

  const handleSaveChanges = (member: HouseholdMember) => {
    if (editingIndex !== null) {
      const updatedMembers = [...formData.members];
      updatedMembers[editingIndex] = member;
      setFormData((prev) => ({ ...prev, members: updatedMembers }));
      setEditDialogOpen(false);
      setEditingIndex(null);
    }
  };

  const handleDeleteMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const handleResetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="min-h-screen  p-8">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label
              htmlFor="householdName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Household Name
            </Label>
            <input
              id="householdName"
              type="text"
              value={formData.householdName}
              onChange={(e) =>
                handleInputChange("householdName", e.target.value)
              }
              placeholder="Enter household surname"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Label
              htmlFor="householdType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Household Type
            </Label>
            <Select
              value={formData.householdType}
              onValueChange={(value) =>
                handleInputChange(
                  "householdType",
                  value as FormData["householdType"]
                )
              }
            >
              <SelectTrigger
                id="householdType"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <SelectValue placeholder="Select household type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nuclear">Nuclear Family</SelectItem>
                <SelectItem value="extended">Extended Family</SelectItem>
                <SelectItem value="single">Single Person</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Household Members
          </h2>
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-100">
                <TableHead className="font-bold text-blue-800">
                  First Name
                </TableHead>
                <TableHead className="font-bold text-blue-800">
                  Last Name
                </TableHead>
                <TableHead className="font-bold text-blue-800">
                  Birthdate
                </TableHead>
                <TableHead className="font-bold text-blue-800">
                  Gender
                </TableHead>
                <TableHead className="font-bold text-blue-800">
                  Occupation
                </TableHead>
                <TableHead className="font-bold text-blue-800">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.members.map((member, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-sky-50"}
                >
                  <TableCell>{member.firstName}</TableCell>
                  <TableCell>{member.lastName}</TableCell>
                  <TableCell>{member.birthdate}</TableCell>
                  <TableCell>{member.gender}</TableCell>
                  <TableCell>{member.occupation}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                      onClick={() => handleEditMember(index)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteMember(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setAddMemberDialogOpen(true)}
          >
            Add Member
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label
              htmlFor="nhtsStatus"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              NHTS Status
            </Label>
            <Select
              value={formData.nhtsStatus}
              onValueChange={(value) =>
                handleInputChange("nhtsStatus", value as FormData["nhtsStatus"])
              }
            >
              <SelectTrigger
                id="nhtsStatus"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <SelectValue placeholder="Select NHTS status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="non-poor">Non-Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="toilet"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Toilet
            </Label>
            <Select
              value={formData.toilet}
              onValueChange={(value) =>
                handleInputChange("toilet", value as FormData["toilet"])
              }
            >
              <SelectTrigger
                id="toilet"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <SelectValue placeholder="Select toilet status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label
              htmlFor="assignedStaff"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assigned Staff
            </Label>
            <Select
              value={formData.assignedStaff}
              onValueChange={(value) =>
                handleInputChange(
                  "assignedStaff",
                  value as FormData["assignedStaff"]
                )
              }
            >
              <SelectTrigger
                id="assignedStaff"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <SelectValue placeholder="Select assigned staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maria">Maria Santos</SelectItem>
                <SelectItem value="isabel">Isabel Cruz</SelectItem>
                <SelectItem value="andrea">Andrea Reyes</SelectItem>
                <SelectItem value="sofia">Sofia Gonzales</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </Label>
            <Select
              value={formData.address}
              onValueChange={(value) => handleInputChange("address", value)}
            >
              <SelectTrigger
                id="address"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <SelectValue placeholder="Select address" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i} value={`purok-${i + 1}`}>
                    Purok {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetForm}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit
          </Button>
        </div>
      </form>

      <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <MemberForm
            onSubmit={handleAddMember}
            onCancel={() => setAddMemberDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          {editingIndex !== null && (
            <MemberForm
              onSubmit={handleSaveChanges}
              onCancel={() => setEditDialogOpen(false)}
              initialData={formData.members[editingIndex]}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

type MemberFormProps = {
  onSubmit: (data: HouseholdMember) => void;
  onCancel: () => void;
  initialData?: HouseholdMember;
};

function MemberForm({ onSubmit, onCancel, initialData }: MemberFormProps) {
  const [member, setMember] = useState<HouseholdMember>(
    initialData || {
      firstName: "",
      lastName: "",
      birthdate: "",
      gender: "Male",
      occupation: "",
    }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(member);
  };

  const handleInputChange = (name: keyof HouseholdMember, value: string) => {
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <input
          type="text"
          id="firstName"
          value={member.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <input
          type="text"
          id="lastName"
          value={member.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <Label htmlFor="birthdate">Birthdate</Label>
        <input
          type="date"
          id="birthdate"
          value={member.birthdate}
          onChange={(e) => handleInputChange("birthdate", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <Label>Gender</Label>
        <RadioGroup
          value={member.gender}
          onValueChange={(value: "Male" | "Female") =>
            handleInputChange("gender", value)
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor="occupation">Occupation</Label>
        <input
          type="text"
          id="occupation"
          value={member.occupation}
          onChange={(e) => handleInputChange("occupation", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-between space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
