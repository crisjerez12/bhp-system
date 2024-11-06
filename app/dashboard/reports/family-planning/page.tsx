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
import Link from "next/link";
import { deleteFamilyPlanningRecord } from "@/app/actions/family-planning-response";
import { useRouter } from "next/navigation";
type FamilyPlanningRecord = {
  _id: string;
  lastName: string;
  firstName: string;
  age: number;
  controlType: string;
  assignedStaff: string;
  address: string;
};

const purokOptions = Array.from({ length: 10 }, (_, i) => `Purok ${i + 1}`);
const staffOptions = ["Nurse Garcia", "Midwife Lim", "Dr. Tan"];

export default function FamilyPlanningReports() {
  const [lastNameSearch, setLastNameSearch] = useState("");
  const [addressFilter, setAddressFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [records, setRecords] = useState<FamilyPlanningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;
  const router = useRouter();
  useEffect(() => {
    fetchFamilyPlanningData();
  }, []);

  const fetchFamilyPlanningData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/family-planning");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError(
        "An error occurred while fetching data. Please try again later."
      );
      console.error("Error fetching family planning data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(
    (record) =>
      record.lastName.toLowerCase().includes(lastNameSearch.toLowerCase()) &&
      (addressFilter === "all" || record.address === addressFilter) &&
      (staffFilter === "all" || record.assignedStaff === staffFilter)
  );

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    await deleteFamilyPlanningRecord(id);
    router.push("/dashboard/reports/family-planning");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search by last name"
            value={lastNameSearch}
            onChange={(e) => setLastNameSearch(e.target.value)}
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
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={fetchFamilyPlanningData}
          >
            Refresh Data
          </Button>
        </div>
        {loading ? (
          <SkeletonTable />
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-100">
                  <TableHead className="font-bold">Last Name</TableHead>
                  <TableHead className="font-bold">First Name</TableHead>
                  <TableHead className="font-bold text-center">Age</TableHead>
                  <TableHead className="font-bold">
                    Family Planning Control Type
                  </TableHead>
                  <TableHead className="font-bold">Assigned Staff</TableHead>
                  <TableHead className="font-bold">Address</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record) => (
                  <TableRow key={record._id} className="hover:bg-blue-50">
                    <TableCell className="font-medium">
                      {record.lastName}
                    </TableCell>
                    <TableCell>{record.firstName}</TableCell>
                    <TableCell className="text-center">{record.age}</TableCell>
                    <TableCell>{record.controlType}</TableCell>
                    <TableCell>{record.assignedStaff}</TableCell>
                    <TableCell>{record.address}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link
                          href={
                            "/dashboard/reports/family-planning/" + record._id
                          }
                        >
                          <Button size="sm" variant="outline" className="p-1">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">See Data</span>
                          </Button>
                        </Link>
                        <Link
                          href={
                            "/dashboard/reports/family-planning/edit/" +
                            record._id
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
                          onClick={() => handleDelete(record._id)}
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
            {Math.min(filteredRecords.length, currentPage * itemsPerPage)} of{" "}
            {filteredRecords.length} entries
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
          {[...Array(7)].map((_, j) => (
            <div
              key={j}
              className="h-8 bg-blue-200 rounded w-1/7 animate-pulse"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
