// file: app/page.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
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
import SubmitButton from "@/components/SubmitButton";
import {
  FAMILY_TYPE,
  fetchUsersData,
  NHTS_STATUS,
  PUROKS,
  WITH_TOILET,
} from "@/lib/constants";
import { Member, HouseholdType } from "@/lib/models/households";
import { toast } from "react-toastify";

export default function HouseholdFormComponent() {
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [key, setKey] = useState(+new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffList, setStaffList] = useState<string[]>([]);
  const [formData, setFormData] = useState<HouseholdType>({
    householdName: "",
    householdType: "",
    nhtsStatus: "",
    toilet: "",
    assignedStaff: "",
    address: "",
    members: [],
  });

  useEffect(() => {
    const loadStaffData = async () => {
      const data = await fetchUsersData();
      setStaffList(data);
    };
    loadStaffData();
  }, []);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addMemberDialogOpen || editDialogOpen) return;
    setIsSubmitting(true);

    const formDataObj = new FormData(e.currentTarget);
    const data: Partial<HouseholdType> = Object.fromEntries(
      formDataObj.entries()
    );

    // Convert members array from FormData
    const membersData = formDataObj
      .getAll("members[]")
      .map((member) => JSON.parse(member as string));
    data.members = membersData;

    const res = await createHousehold(data as HouseholdType);

    if (res?.success) {
      toast.success(res.message);
      setFormData({
        householdName: "",
        householdType: "",
        nhtsStatus: "",
        toilet: "",
        assignedStaff: "",
        address: "",
        members: [],
      });
      setKey(+new Date());
    } else {
      toast.error(res?.error || "Error creating household");
      console.error("Error submitting form:", res?.error);
    }
    setIsSubmitting(false);
  };

  const handleAddMember = (member: Member) => {
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, member],
    }));
    setAddMemberDialogOpen(false);
  };

  const handleEditMember = (index: number) => {
    setEditingIndex(index);
    setEditDialogOpen(true);
  };

  const handleSaveChanges = (member: Member) => {
    if (editingIndex !== null) {
      setFormData((prev) => {
        const updatedMembers = [...prev.members];
        updatedMembers[editingIndex] = member;
        return { ...prev, members: updatedMembers };
      });
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

  const handleInputChange = (name: keyof HouseholdType, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen p-8">
      <form key={key} onSubmit={handleSubmit}>
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
              name="householdName"
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
              name="householdType"
              onValueChange={(value) =>
                handleInputChange("householdType", value)
              }
            >
              <SelectTrigger
                id="householdType"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <SelectValue placeholder="Select household type" />
              </SelectTrigger>
              <SelectContent>
                {FAMILY_TYPE.map((type, i) => (
                  <SelectItem key={i + 1} value={type}>
                    {type}
                  </SelectItem>
                ))}
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
            type="button"
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
              name="nhtsStatus"
              onValueChange={(value) => handleInputChange("nhtsStatus", value)}
            >
              <SelectTrigger
                id="nhtsStatus"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <SelectValue placeholder="Select NHTS status" />
              </SelectTrigger>
              <SelectContent>
                {NHTS_STATUS.map((type, i) => (
                  <SelectItem key={i + 1} value={type}>
                    {type}
                  </SelectItem>
                ))}
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
              name="toilet"
              onValueChange={(value) => handleInputChange("toilet", value)}
            >
              <SelectTrigger
                id="toilet"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <SelectValue placeholder="Select toilet status" />
              </SelectTrigger>
              <SelectContent>
                {WITH_TOILET.map((has, i) => (
                  <SelectItem key={i + 1} value={has}>
                    {has}
                  </SelectItem>
                ))}
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
              name="assignedStaff"
              onValueChange={(value) =>
                handleInputChange("assignedStaff", value)
              }
            >
              <SelectTrigger
                id="assignedStaff"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <SelectValue placeholder="Select assigned staff" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map((name, i) => (
                  <SelectItem key={i + 1} value={name}>
                    {name}
                  </SelectItem>
                ))}
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
              name="address"
              onValueChange={(value) => handleInputChange("address", value)}
            >
              <SelectTrigger
                id="address"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <SelectValue placeholder="Select address" />
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
        <div className="flex justify-between space-x-4">
          <Button
            type="reset"
            variant="outline"
            onClick={() => {
              setFormData({
                householdName: "",
                householdType: "",
                nhtsStatus: "",
                toilet: "",
                assignedStaff: "",
                address: "",
                members: [],
              });
              setKey(+new Date());
            }}
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
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg font-semibold">Submitting form...</p>
          </div>
        </div>
      )}
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
  onSubmit: (data: Member) => void;
  onCancel: () => void;
  initialData?: Member;
};

function MemberForm({ onSubmit, onCancel, initialData }: MemberFormProps) {
  const [member, setMember] = useState<Member>(
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

  const handleInputChange = (name: keyof Member, value: string) => {
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={member.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={member.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <Label htmlFor="birthdate">Birthdate</Label>
        <input
          type="date"
          id="birthdate"
          name="birthdate"
          value={member.birthdate}
          onChange={(e) => handleInputChange("birthdate", e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <Label>Gender</Label>
        <RadioGroup
          value={member.gender}
          onValueChange={(value) =>
            handleInputChange("gender", value as "Male" | "Female")
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
          name="occupation"
          value={member.occupation}
          onChange={(e) => handleInputChange("occupation", e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-between space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}
