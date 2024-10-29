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
import { Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Household = {
  id: number;
  name: string;
  type: string;
  members: number;
  nhts: boolean;
  assignedStaff: string;
  address: string;
  toilet: boolean;
};

const purokOptions = Array.from({ length: 10 }, (_, i) => `Purok ${i + 1}`);
const staffOptions = [
  "Maria Cruz",
  "Juana Dela Cruz",
  "Rosa Fernandez",
  "Elena Santos",
  "Isabel Ramos",
];
const householdTypes = ["All", "Nuclear", "Extended", "Single Parent"];

export function HouseholdReportComponent() {
  const [nameSearch, setNameSearch] = useState("");
  const [addressFilter, setAddressFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("All");
  const [nhtsFilter, setNhtsFilter] = useState("all");
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const response = await fetch("/api/household");

        const data = await response.json();
        setHouseholds(data);
      } catch (error) {
        console.error("Failed to fetch households:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholds(); // Call the fetch function
  }, []);

  // const filteredHouseholds = households.filter(
  //   (household) =>
  //     // household.name.toLowerCase().includes(nameSearch.toLowerCase()) &&
  //     (addressFilter === "all" || household.address === addressFilter) &&
  //     (staffFilter === "all" || household.assignedStaff === staffFilter) &&
  //     (typeFilter === "All" || household.type === typeFilter) &&
  //     (nhtsFilter === "all" ||
  //       (nhtsFilter === "poor" ? household.nhts : !household.nhts))
  // );

  // const paginatedHouseholds = filteredHouseholds.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );
  const paginatedHouseholds = households.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // const totalPages = Math.ceil(filteredHouseholds.length / itemsPerPage);
  const totalPages = Math.ceil(households.length / itemsPerPage);

  const handleSeeData = (id: number) => {
    console.log(`See data for household ${id}`);
  };

  const handleEdit = (id: number) => {
    console.log(`Edit household ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete household ${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <main className="flex-grow p-4 ">
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
              {purokOptions.map((purok) => (
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
              {staffOptions.map((staff) => (
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
              {householdTypes.map((type) => (
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
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
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
                  <TableHead className="font-bold">NHTS</TableHead>
                  <TableHead className="font-bold">Assigned Staff</TableHead>
                  <TableHead className="font-bold">Address</TableHead>
                  <TableHead className="font-bold">Toilet</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedHouseholds.map((household) => (
                  <TableRow key={household.id} className="hover:bg-blue-50">
                    <TableCell className="font-medium">
                      {household.name}
                    </TableCell>
                    <TableCell>{household.type}</TableCell>
                    <TableCell className="text-center">
                      {household.members}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          household.nhts ? "bg-green-600" : "bg-red-600"
                        }
                      >
                        {household.nhts ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>{household.assignedStaff}</TableCell>
                    <TableCell>{household.address}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          household.toilet ? "bg-green-600" : "bg-red-600"
                        }
                      >
                        {household.toilet ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSeeData(household.id)}
                          className="p-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">See Data</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(household.id)}
                          className="p-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(household.id)}
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
            {/* {Math.min(filteredHouseholds.length, currentPage * itemsPerPage)} of{" "}
            {filteredHouseholds.length} entries */}{" "}
            {Math.min(households.length, currentPage * itemsPerPage)} of{" "}
            {households.length} entries
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
