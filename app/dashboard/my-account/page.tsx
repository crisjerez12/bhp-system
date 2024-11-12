"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
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
import { Eye, EyeOff } from "lucide-react";
import {
  addStaff,
  deleteUser,
  editCredentials,
  updateUsers,
} from "@/app/actions/my-account-actions";

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface User extends Omit<UserData, "password"> {
  _id: string;
  role: string;
}

export default function Component() {
  const [page, setPage] = useState("myAccount");
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: "Juan",
    lastName: "Dela Cruz",
    username: "juandelacruz",
    password: "password123",
  });
  const [newStaffData, setNewStaffData] = useState<UserData>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updatedUserData, setUpdatedUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const result = await response.json();
        if (result.success) {
          setUsers(result.data);
        } else {
          console.error("Failed to fetch users:", result.message);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editing) {
      const formData = new FormData(e.currentTarget);
      const updatedUserData: UserData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      };
      try {
        await editCredentials(formData);
        setUserData(updatedUserData);
      } catch (error) {
        console.error("Failed to update credentials:", error);
      }
    }
    setEditing(!editing);
    setShowPassword(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddStaff = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await addStaff(formData);

    setNewStaffData({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    });
  };

  const handleUpdateUser = async (id: string) => {
    if (updatedUserData) {
      await updateUsers(id, updatedUserData);
      setUsers(
        users.map((u) => (u._id === id ? { ...u, ...updatedUserData } : u))
      );
      setDialogOpen(false);
      setSelectedUser(null);
      setUpdatedUserData(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user._id !== id));
  };

  const handleUpdateInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  return (
    <div className="p-4">
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
        <form onSubmit={handleEdit} className="space-y-4">
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
            {editing && (
              <div>
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={userData.password}
                    onChange={handleInputChange}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {editing ? "Save" : "Edit Credentials"}
          </Button>
        </form>
      )}

      {page === "addStaff" && (
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newFirstName">First Name</Label>
              <Input
                id="newFirstName"
                name="firstName"
                value={newStaffData.firstName}
                onChange={(e) =>
                  setNewStaffData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="newLastName">Last Name</Label>
              <Input
                id="newLastName"
                name="lastName"
                value={newStaffData.lastName}
                onChange={(e) =>
                  setNewStaffData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="newUsername">Username</Label>
              <Input
                id="newUsername"
                name="username"
                value={newStaffData.username}
                onChange={(e) =>
                  setNewStaffData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Password</Label>
              <Input
                id="newPassword"
                name="password"
                type="password"
                value={newStaffData.password}
                onChange={(e) =>
                  setNewStaffData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Create
          </Button>
        </form>
      )}

      {page === "manageUsers" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => {
                          setSelectedUser(user);
                          setUpdatedUserData(user);
                        }}
                      >
                        Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Update User</DialogTitle>
                      </DialogHeader>
                      {selectedUser && (
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
                              name="firstName"
                              value={updatedUserData?.firstName || ""}
                              onChange={handleUpdateInputChange}
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
                              name="lastName"
                              value={updatedUserData?.lastName || ""}
                              onChange={handleUpdateInputChange}
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
                              name="username"
                              value={updatedUserData?.username || ""}
                              onChange={handleUpdateInputChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="updatePassword"
                              className="text-right"
                            >
                              New Password
                            </Label>
                            <Input
                              id="updatePassword"
                              name="password"
                              type="password"
                              placeholder="Enter new password"
                              onChange={handleUpdateInputChange}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                      )}
                      <Button
                        onClick={() =>
                          selectedUser && handleUpdateUser(selectedUser._id)
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Update
                      </Button>
                    </DialogContent>
                  </Dialog>
                  <Button
                    onClick={() => handleDeleteUser(user._id)}
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
    </div>
  );
}
