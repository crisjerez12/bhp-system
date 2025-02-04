"use client"

import { useEffect, useState } from "react"
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"
import { DownloadIcon } from "lucide-react"

interface HouseholdMember {
  firstName: string
  lastName: string
  birthdate: string
  gender: string
  occupation: string
}

interface HouseholdRecord {
  householdName: string
  householdType: string
  nhtsStatus: string
  toilet: string
  assignedStaff: string
  address: string
  members: HouseholdMember[]
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    width: "100%",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 8,
  },
  householdNameCell: { width: "15%" },
  membersNameCell: { width: "20%" },
  ageCell: { width: "10%" },
  sexCell: { width: "10%" },
  nhtsCell: { width: "10%" },
  toiletCell: { width: "10%" },
  purokCell: { width: "15%" },
  staffCell: { width: "10%" },
})

// Helper function to calculate age
const calculateAge = (birthdate: string) => {
  const today = new Date()
  const birthDate = new Date(birthdate)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Create Document Component
const HouseholdPDF = ({ data }: { data: HouseholdRecord[] }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.title}>Household Records</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.householdNameCell]}>Household Name</Text>
          <Text style={[styles.tableCell, styles.membersNameCell]}>Members Name</Text>
          <Text style={[styles.tableCell, styles.ageCell]}>Age</Text>
          <Text style={[styles.tableCell, styles.sexCell]}>Sex</Text>
          <Text style={[styles.tableCell, styles.nhtsCell]}>NHTS</Text>
          <Text style={[styles.tableCell, styles.toiletCell]}>Toilet</Text>
          <Text style={[styles.tableCell, styles.purokCell]}>Purok</Text>
          <Text style={[styles.tableCell, styles.staffCell]}>Assigned Staff</Text>
        </View>
        {data.map((record, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.householdNameCell]}>{record.householdName}</Text>
            <Text style={[styles.tableCell, styles.membersNameCell]}>
              {record.members.map((member, index) => `${index + 1}. ${member.firstName} ${member.lastName}\n`)}
            </Text>
            <Text style={[styles.tableCell, styles.ageCell]}>
              {record.members.map((member, index) => `${index + 1}. ${calculateAge(member.birthdate)}\n`)}
            </Text>
            <Text style={[styles.tableCell, styles.sexCell]}>
              {record.members.map((member, index) => `${index + 1}. ${member.gender}\n`)}
            </Text>
            <Text style={[styles.tableCell, styles.nhtsCell]}>{record.nhtsStatus}</Text>
            <Text style={[styles.tableCell, styles.toiletCell]}>{record.toilet}</Text>
            <Text style={[styles.tableCell, styles.purokCell]}>{record.address}</Text>
            <Text style={[styles.tableCell, styles.staffCell]}>{record.assignedStaff}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
)

export function HouseholdPDFGenerator() {
  const [loading, setLoading] = useState(false)
  const [householdData, setHouseholdData] = useState<HouseholdRecord[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/household")
      const data = await response.json()
      console.log(data)
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch household records")
      }

      setHouseholdData(data.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <>
      {householdData.length === 0 ? (
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex justify-between items-center py-4 px-4 rounded-lg text-white cursor-pointer bg-blue-600 hover:bg-blue-700 w-full"
        >
          <span className="font-semibold">{loading ? "FETCHING DATA..." : "GENERATE HOUSEHOLD RECORDS PDF"}</span>
          {!loading && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          )}
        </button>
      ) : (
        <PDFDownloadLink
          document={<HouseholdPDF data={householdData} />}
          fileName="household_records.pdf"
          className="flex justify-between items-center py-4 px-4 rounded-lg font-semibold text-white cursor-pointer bg-blue-600 hover:bg-blue-700 w-full"
        >
          DOWNLOAD HOUSEHOLD RECORDS
          <DownloadIcon />
        </PDFDownloadLink>
      )}
    </>
  )
}

