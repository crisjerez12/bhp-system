"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface HouseholdData {
  id: number;
  lastName: string;
  members: number;
  assignedStaff: string;
  address: string;
}

interface FamilyPlanningData {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  controlType: string;
  assignedStaff: string;
  address: string;
}

interface SeniorCitizenData {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  weight: number;
  bp: string;
  assignedStaff: string;
  address: string;
}
type ReportData = HouseholdData | FamilyPlanningData | SeniorCitizenData;
interface HouseholdItem {
  id: number;
  lastName: string;
  members: number;
  assignedStaff: string;
  address: string;
}

interface FamilyPlanningItem {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  controlType: string;
  assignedStaff: string;
  address: string;
}

interface SeniorCitizenItem {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  weight: number;
  bp: string;
  assignedStaff: string;
  address: string;
}

type Item = HouseholdItem | FamilyPlanningItem | SeniorCitizenItem;

// Mock data generation function
const generateMockData = (category: string, count: number) => {
  const data = [];
  for (let i = 1; i <= count; i++) {
    if (category === "Household") {
      data.push({
        id: i,
        lastName: `LastName${i}`,
        members: Math.floor(Math.random() * 10) + 1,
        assignedStaff: `Staff${(i % 4) + 1}`,
        address: `Purok ${Math.floor(Math.random() * 10) + 1}`,
      });
    } else if (category === "Family Planning") {
      data.push({
        id: i,
        firstName: `FirstName${i}`,
        lastName: `LastName${i}`,
        age: Math.floor(Math.random() * 50) + 18,
        controlType: ["Pill", "IUD", "Implant", "Injection"][i % 4],
        assignedStaff: `Staff${(i % 4) + 1}`,
        address: `Purok ${Math.floor(Math.random() * 10) + 1}`,
      });
    } else if (category === "Senior Citizen") {
      data.push({
        id: i,
        firstName: `FirstName${i}`,
        lastName: `LastName${i}`,
        age: Math.floor(Math.random() * 30) + 60,
        weight: Math.floor(Math.random() * 50) + 50,
        bp: `${Math.floor(Math.random() * 40) + 100}/${
          Math.floor(Math.random() * 40) + 60
        }`,
        assignedStaff: `Staff${(i % 4) + 1}`,
        address: `Purok ${Math.floor(Math.random() * 10) + 1}`,
      });
    }
  }
  return data;
};

export default function ReportsPage() {
  const [category, setCategory] = useState("Household");
  const [data, setData] = useState<ReportData[]>([]);
  const [filteredData, setFilteredData] = useState<ReportData[]>([]);
  const [lastName, setLastName] = useState("");
  const [assignedStaff, setAssignedStaff] = useState("");
  const [sortBy, setSortBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (data.length > 0) {
      let filtered = [...data];
      if (lastName) {
        filtered = filtered.filter((item) =>
          item.lastName.toLowerCase().includes(lastName.toLowerCase())
        );
      }
      if (assignedStaff) {
        filtered = filtered.filter(
          (item) => item.assignedStaff === assignedStaff
        );
      }
      if (sortBy === "A-Z") {
        filtered.sort((a, b) => a.lastName.localeCompare(b.lastName));
      } else if (sortBy === "Z-A") {
        filtered.sort((a, b) => b.lastName.localeCompare(a.lastName));
      } else if (sortBy === "female") {
        // This is a placeholder as we don't have gender in our mock data
        filtered = filtered;
      } else if (sortBy === "date-asc" || sortBy === "date-desc") {
        // This is a placeholder as we don't have date in our mock data
        filtered = filtered;
      }
      setFilteredData(filtered);
    }
  }, [data, lastName, assignedStaff, sortBy]);

  const loadData = () => {
    const newData = generateMockData(category, 30);
    setData(newData);
    setFilteredData(newData);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setLastName("");
    setAssignedStaff("");
    setSortBy("all");
    setData([]);
    setFilteredData([]);
    setCurrentPage(1);
  };

  const renderTableHeaders = () => {
    if (category === "Household") {
      return [
        "ID",
        "Last Name",
        "# of Members",
        "Assigned Staff",
        "Address",
        "Action",
      ];
    } else if (category === "Family Planning") {
      return [
        "ID",
        "First Name",
        "Last Name",
        "Age",
        "Control Type",
        "Assigned Staff",
        "Address",
        "Action",
      ];
    } else if (category === "Senior Citizen") {
      return [
        "ID",
        "First Name",
        "Last Name",
        "Age",
        "Weight",
        "BP",
        "Assigned Staff",
        "Address",
        "Action",
      ];
    }
  };
  const renderTableRow = (item: Item) => {
    if (category === "Household" && "members" in item) {
      return (
        <>
          <TableCell>{item.id}</TableCell>
          <TableCell>{item.lastName}</TableCell>
          <TableCell>{item.members}</TableCell>
          <TableCell>{item.assignedStaff}</TableCell>
          <TableCell>{item.address}</TableCell>
          <TableCell>
            <Button
              variant="outline"
              size="sm"
              className="mr-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              See Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="mr-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Delete
            </Button>
          </TableCell>
        </>
      );
    } else if (category === "Family Planning" && "controlType" in item) {
      return (
        <>
          <TableCell>{item.id}</TableCell>
          <TableCell>{item.firstName}</TableCell>
          <TableCell>{item.lastName}</TableCell>
          <TableCell>{item.age}</TableCell>
          <TableCell>{item.controlType}</TableCell>
          <TableCell>{item.assignedStaff}</TableCell>
          <TableCell>{item.address}</TableCell>
          <TableCell>
            <Button
              variant="outline"
              size="sm"
              className="mr-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Delete
            </Button>
          </TableCell>
        </>
      );
    } else if (category === "Senior Citizen" && "bp" in item) {
      return (
        <>
          <TableCell>{item.id}</TableCell>
          <TableCell>{item.firstName}</TableCell>
          <TableCell>{item.lastName}</TableCell>
          <TableCell>{item.age}</TableCell>
          <TableCell>{item.weight}</TableCell>
          <TableCell>{item.bp}</TableCell>
          <TableCell>{item.assignedStaff}</TableCell>
          <TableCell>{item.address}</TableCell>
          <TableCell>
            <Button
              variant="outline"
              size="sm"
              className="mr-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Delete
            </Button>
          </TableCell>
        </>
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-full">
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div className="w-full sm:w-auto">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Household">Household</SelectItem>
              <SelectItem value="Family Planning">Family Planning</SelectItem>
              <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={loadData}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          Load Data
        </Button>
      </div>
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Enter Lastname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Select value={assignedStaff} onValueChange={setAssignedStaff}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Staff1">Staff1</SelectItem>
              <SelectItem value="Staff2">Staff2</SelectItem>
              <SelectItem value="Staff3">Staff3</SelectItem>
              <SelectItem value="Staff4">Staff4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="A-Z">A-Z</SelectItem>
            <SelectItem value="Z-A">Z-A</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="date-asc">Date Modified (Asc)</SelectItem>
            <SelectItem value="date-desc">Date Modified (Desc)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {renderTableHeaders()?.map((header, index) => (
                <TableHead key={index} className="bg-blue-600 text-white">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((item, index) => (
                  <TableRow key={index}>
                    {item ? (
                      renderTableRow(item)
                    ) : (
                      <TableCell colSpan={renderTableHeaders()?.length || 1}>
                        No valid data
                      </TableCell>
                    )}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={renderTableHeaders()?.length || 1}>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredData.length / itemsPerPage)
                )
              )
            }
            disabled={
              currentPage === Math.ceil(filteredData.length / itemsPerPage)
            }
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
