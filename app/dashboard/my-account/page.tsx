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
  getCurrentUser,
} from "@/app/actions/my-account-actions";
import { IUser } from "@/lib/models/user";

export default function Component() {
  const [page, setPage] = useState("myAccount");
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<IUser | undefined>();
  const [newStaffData, setNewStaffData] = useState<IUser>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: "staff",
  });
  const [users, setUsers] = useState<IUser[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [updatedUserData, setUpdatedUserData] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserData(user);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

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

    fetchCurrentUser();
    fetchUsers();
  }, []);

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editing && userData) {
      const formData = new FormData(e.currentTarget);
      try {
        const result = await editCredentials(formData);
        if (result.success) {
          const updatedUser = await getCurrentUser();
          if (updatedUser) {
            setUserData(updatedUser);
          }
        }
      } catch (error) {
        console.error("Error updating credentials:", error);
      }
    }
    setEditing(!editing);
    setShowPassword(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) =>
      prevData ? { ...prevData, [name]: value } : undefined
    );
  };

  const handleAddStaff = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await addStaff(formData);
    if (res.success) {
      console.log(res.message);
      setNewStaffData({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        role: "staff",
      });
    } else {
      console.log(res.message);
    }
  };

  const handleUpdateUser = async (id: string | undefined) => {
    if (updatedUserData) {
      const result = await updateUsers(id, updatedUserData);
      if (result.success) {
        setUsers(
          users.map((u) => (u._id === id ? { ...u, ...updatedUserData } : u))
        );
        console.log(result.message);
      } else {
        console.log(result.message);
      }
      setDialogOpen(false);
      setSelectedUser(null);
      setUpdatedUserData(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const result = await deleteUser(id);
    setUsers(users.filter((user) => user._id !== id));
    console.log(result?.message);
  };

  const handleUpdateInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

      {page === "myAccount" && userData && (
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
            <div>
              <Label htmlFor="newRole">Role</Label>
              <Select
                name="role"
                value={newStaffData.role}
                onValueChange={(value) =>
                  setNewStaffData((prev) => ({
                    ...prev,
                    role: value as "admin" | "staff",
                  }))
                }
              >
                <SelectTrigger id="newRole">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
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
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="updateRole" className="text-right">
                              Role
                            </Label>
                            <Select
                              name="role"
                              value={updatedUserData?.role}
                              onValueChange={(value) =>
                                handleUpdateInputChange({
                                  target: { name: "role", value },
                                } as ChangeEvent<HTMLSelectElement>)
                              }
                            >
                              <SelectTrigger
                                id="updateRole"
                                className="col-span-3"
                              >
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                              </SelectContent>
                            </Select>
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
                    onClick={() => user._id && handleDeleteUser(user._id)}
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
