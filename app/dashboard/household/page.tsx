"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Member {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  occupation: string;
}
interface EditingMember extends Member {
  index: number;
}
export default function HouseholdForm() {
  const [householdName, setHouseholdName] = useState("");
  const [householdType, setHouseholdType] = useState("");
  const [nhtsStatus, setNhtsStatus] = useState("");
  const [toilet, setToilet] = useState("");

  const [members, setMembers] = useState<Member[]>([
    {
      firstName: "John",
      lastName: "Doe",
      birthdate: "1980-01-01",
      gender: "Male",
      occupation: "Engineer",
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      birthdate: "1982-05-15",
      gender: "Female",
      occupation: "Teacher",
    },
    {
      firstName: "Mike",
      lastName: "Smith",
      birthdate: "1975-11-30",
      gender: "Male",
      occupation: "Doctor",
    },
    {
      firstName: "Emily",
      lastName: "Johnson",
      birthdate: "1990-08-22",
      gender: "Female",
      occupation: "Artist",
    },
    {
      firstName: "David",
      lastName: "Brown",
      birthdate: "1988-03-10",
      gender: "Male",
      occupation: "Lawyer",
    },
  ]);

  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    birthdate: "",
    gender: "",
    occupation: "",
  });

  const [editingMember, setEditingMember] = useState<EditingMember | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleAddMember = () => {
    setMembers([...members, newMember]);
    setNewMember({
      firstName: "",
      lastName: "",
      birthdate: "",
      gender: "",
      occupation: "",
    });
  };

  const handleDeleteMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const handleEditMember = (index: number) => {
    setEditingMember({ ...members[index], index });
    setEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (editingMember !== null) {
      const updatedMembers = [...members];
      updatedMembers[editingMember.index] = {
        firstName: editingMember.firstName,
        lastName: editingMember.lastName,
        birthdate: editingMember.birthdate,
        gender: editingMember.gender,
        occupation: editingMember.occupation,
      };
      setMembers(updatedMembers);
      setEditDialogOpen(false);
    }
  };

  const handleReset = () => {
    setHouseholdName("");
    setHouseholdType("");
    setNhtsStatus("");
    setToilet("");
    setMembers([]);
  };

  return (
    <div className="min-h-screen ">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Household Information Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="householdName">Household Name</Label>
              <Input
                id="householdName"
                placeholder="Enter household surname"
                className="mt-1"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="householdType">Household Type</Label>
              <Select value={householdType} onValueChange={setHouseholdType}>
                <SelectTrigger id="householdType">
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
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Household Members
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-gray-800">
                    First Name
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    Last Name
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    Birthdate
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    Gender
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    Occupation
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
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
                        className="mr-2"
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">Add Member</Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={newMember.firstName}
                      onChange={(e) =>
                        setNewMember({
                          ...newMember,
                          firstName: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={newMember.lastName}
                      onChange={(e) =>
                        setNewMember({ ...newMember, lastName: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="birthdate" className="text-right">
                      Birthdate
                    </Label>
                    <Input
                      id="birthdate"
                      type="date"
                      value={newMember.birthdate}
                      onChange={(e) =>
                        setNewMember({
                          ...newMember,
                          birthdate: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Gender</Label>
                    <RadioGroup
                      value={newMember.gender}
                      onValueChange={(value) =>
                        setNewMember({ ...newMember, gender: value })
                      }
                      className="col-span-3"
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="occupation" className="text-right">
                      Occupation
                    </Label>
                    <Input
                      id="occupation"
                      value={newMember.occupation}
                      onChange={(e) =>
                        setNewMember({
                          ...newMember,
                          occupation: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <Button onClick={handleAddMember}>Submit</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Edit Member</DialogTitle>
              </DialogHeader>
              {editingMember && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editFirstName" className="text-right">
                      First Name
                    </Label>
                    <Input
                      id="editFirstName"
                      value={editingMember.firstName}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          firstName: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editLastName" className="text-right">
                      Last Name
                    </Label>
                    <Input
                      id="editLastName"
                      value={editingMember.lastName}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          lastName: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editBirthdate" className="text-right">
                      Birthdate
                    </Label>
                    <Input
                      id="editBirthdate"
                      type="date"
                      value={editingMember.birthdate}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          birthdate: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Gender</Label>
                    <RadioGroup
                      value={editingMember.gender}
                      onValueChange={(value) =>
                        setEditingMember({ ...editingMember, gender: value })
                      }
                      className="col-span-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Male" id="editMale" />
                        <Label htmlFor="editMale">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Female" id="editFemale" />
                        <Label htmlFor="editFemale">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editOccupation" className="text-right">
                      Occupation
                    </Label>
                    <Input
                      id="editOccupation"
                      value={editingMember.occupation}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          occupation: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="nhtsStatus">NHTS Status</Label>
              <Select value={nhtsStatus} onValueChange={setNhtsStatus}>
                <SelectTrigger id="nhtsStatus">
                  <SelectValue placeholder="Select NHTS status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="non-poor">Non-Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="toilet">Toilet</Label>
              <Select value={toilet} onValueChange={setToilet}>
                <SelectTrigger id="toilet">
                  <SelectValue placeholder="Select toilet status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button>Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
