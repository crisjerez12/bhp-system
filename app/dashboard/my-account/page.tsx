"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

// interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   username: string;
//   email: string;
// }
interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  onToggle: () => void;
  disabled?: boolean;
}
export default function MyAccountPage() {
  const [page, setPage] = useState("myAccount");
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: "Juan",
    lastName: "Dela Cruz",
    username: "juandelacruz",
    email: "juan@example.com",
    password: "password123",
  });

  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: "Maria",
      lastName: "Santos",
      username: "msantos",
      email: "maria@example.com",
    },
    {
      id: 2,
      firstName: "Jose",
      lastName: "Reyes",
      username: "jreyes",
      email: "jose@example.com",
    },
  ]);

  const handleEdit = () => {
    if (editing) {
      // Save logic here
    }
    setEditing(!editing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleAddStaff = () => {
    // Add staff logic here
  };

  const handleUpdateUser = (id: number) => {
    // Update user logic here
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const PasswordInput = ({
    value,
    onChange,
    show,
    onToggle,
    disabled = false,
  }: PasswordInputProps) => (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-teal-50 p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-teal-700">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setPage(value)}>
            <SelectTrigger className="w-full md:w-[200px] mb-4">
              <SelectValue placeholder="My Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="myAccount">My Account</SelectItem>
              <SelectItem value="addStaff">Add Staff</SelectItem>
              <SelectItem value="manageUsers">Manage Users</SelectItem>
            </SelectContent>
          </Select>

          {page === "myAccount" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    value={userData.password}
                    onChange={(e) => handleInputChange(e)}
                    show={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                    disabled={!editing}
                  />
                </div>
              </div>
              <Button
                onClick={handleEdit}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {editing ? "Save" : "Edit Credentials"}
              </Button>
            </div>
          )}

          {page === "addStaff" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newFirstName">First Name</Label>
                  <Input id="newFirstName" name="newFirstName" />
                </div>
                <div>
                  <Label htmlFor="newLastName">Last Name</Label>
                  <Input id="newLastName" name="newLastName" />
                </div>
                <div>
                  <Label htmlFor="newUsername">Username</Label>
                  <Input id="newUsername" name="newUsername" />
                </div>
                <div>
                  <Label htmlFor="newEmail">Email</Label>
                  <Input id="newEmail" name="newEmail" type="email" />
                </div>
                <div>
                  <Label htmlFor="newPassword">Password</Label>
                  <PasswordInput
                    value=""
                    onChange={() => {}}
                    show={showNewPassword}
                    onToggle={() => setShowNewPassword(!showNewPassword)}
                  />
                </div>
              </div>
              <Button
                onClick={handleAddStaff}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Create
              </Button>
            </div>
          )}

          {page === "manageUsers" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="mr-2">
                            Update
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <DialogHeader>
                            <DialogTitle>Update User</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="updateFirstName"
                                className="text-right"
                              >
                                First Name
                              </Label>
                              <Input
                                id="updateFirstName"
                                defaultValue={user.firstName}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="updateLastName"
                                className="text-right"
                              >
                                Last Name
                              </Label>
                              <Input
                                id="updateLastName"
                                defaultValue={user.lastName}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="updateUsername"
                                className="text-right"
                              >
                                Username
                              </Label>
                              <Input
                                id="updateUsername"
                                defaultValue={user.username}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="updateEmail"
                                className="text-right"
                              >
                                Email
                              </Label>
                              <Input
                                id="updateEmail"
                                defaultValue={user.email}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <Button
                            onClick={() => handleUpdateUser(user.id)}
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            Update
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
