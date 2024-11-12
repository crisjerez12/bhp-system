export const PUROKS = [
  "Purok 1-A",
  "Purok 1-B",
  "Purok 2",
  "Purok 3",
  "Purok 4",
  "Purok 5-Upper",
  "Purok 5-Lower",
  "Purok 6-Upper",
  "Purok 6-Lower",
  "Purok 7",
] as const;
export const FAMILY_TYPE: string[] = [
  "Nuclear Family",
  "Extended Family",
  "Single Person",
  "Other",
];
let usersData: string[] | null = null;

interface User {
  firstName: string;
  lastName: string;
}

interface ApiResponse {
  success: boolean;
  data: User[];
}

export const fetchUsersData = async (): Promise<string[]> => {
  if (!usersData) {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: ApiResponse = await response.json();

      usersData = result.success
        ? result.data.map((user) => `${user.firstName} ${user.lastName}`)
        : [];
    } catch (error) {
      console.error("Error fetching users data:", error);
      usersData = [];
    }
  }
  return usersData;
};
export const CONTROL_TYPE = ["Pills", "IUD", "Implant"];
export const NHTS_STATUS = ["Poor", "Non-Poor"];
export const WITH_TOILET = ["Yes", "No"];
