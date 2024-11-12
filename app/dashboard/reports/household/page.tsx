"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { deleteHousehold } from "@/app/actions/household-response";
import { HouseholdType } from "@/lib/models/households";
import {
  FAMILY_TYPE,
  fetchUsersData,
  NHTS_STATUS,
  PUROKS,
} from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function HouseholdReportComponent() {
  const [nameSearch, setNameSearch] = useState("");
  const [addressFilter, setAddressFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("All");
  const [nhtsFilter, setNhtsFilter] = useState("all");
  const [households, setHouseholds] = useState<HouseholdType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [staffList, setStaffList] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const response = await fetch("/api/household");
        const data = await response.json();
        setHouseholds(data.data);
      } catch (error) {
        console.error("Failed to fetch households:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadStaffData = async () => {
      const data = await fetchUsersData();
      setStaffList(data);
    };
    fetchHouseholds();
    loadStaffData();
  }, []);

  const itemsPerPage = 10;

  const filteredHouseholds = households.filter(
    (household) =>
      household.householdName
        .toLowerCase()
        .includes(nameSearch.toLowerCase()) &&
      (addressFilter === "all" || household.address === addressFilter) &&
      (staffFilter === "all" || household.assignedStaff === staffFilter) &&
      (typeFilter === "All" || household.householdType === typeFilter) &&
      (nhtsFilter === "all" || household.nhtsStatus === nhtsFilter)
  );

  const paginatedHouseholds = filteredHouseholds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredHouseholds.length / itemsPerPage);

  const handleDeleteClick = (id: string | undefined) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      const res = await deleteHousehold(deleteId);
      if (res?.success) {
        console.log("Successfully deleted!");
        setHouseholds(households.filter((h) => h._id !== deleteId));
      }
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/reports/">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Button>
        </Link>
      </div>
      <main className="flex-grow p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search by household name"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="w-full"
          />
          <Select value={addressFilter} onValueChange={setAddressFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Purok" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Puroks</SelectItem>
              {PUROKS.map((purok) => (
                <SelectItem key={purok} value={purok}>
                  {purok}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={staffFilter} onValueChange={setStaffFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staffList.map((staff) => (
                <SelectItem key={staff} value={staff}>
                  {staff}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {FAMILY_TYPE.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={nhtsFilter} onValueChange={setNhtsFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by NHTS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All NHTS</SelectItem>
              {NHTS_STATUS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Search
          </Button>
        </div>
        {loading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-100">
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold text-center">
                    # of members
                  </TableHead>
                  <TableHead className="font-bold">Assigned Staff</TableHead>
                  <TableHead className="font-bold">Address</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedHouseholds.map((household) => (
                  <TableRow key={household._id} className="hover:bg-blue-50">
                    <TableCell className="font-medium">
                      {household.householdName}
                    </TableCell>
                    <TableCell>{household.householdType}</TableCell>
                    <TableCell className="text-center">
                      {household.members.length}
                    </TableCell>
                    <TableCell>{household.assignedStaff}</TableCell>
                    <TableCell>{household.address}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link
                          href={"/dashboard/reports/household/" + household._id}
                        >
                          <Button size="sm" variant="outline" className="p-1">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">See Data</span>
                          </Button>
                        </Link>
                        <Link
                          href={
                            "/dashboard/reports/household/edit/" + household._id
                          }
                        >
                          <Button size="sm" variant="outline" className="p-1">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(household._id)}
                          className="p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="mt-4 flex justify-between items-center">
          <div>
            Showing{" "}
            {Math.min(filteredHouseholds.length, currentPage * itemsPerPage)} of{" "}
            {filteredHouseholds.length} entries
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this household record? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          {[...Array(8)].map((_, j) => (
            <div
              key={j}
              className="h-8 bg-blue-200 rounded w-1/8 animate-pulse"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
