'use client'

import { useState, useEffect } from 'react'
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import { DownloadIcon } from 'lucide-react'

interface SeniorCitizen {
  firstName: string
  lastName: string
  birthDate: string
  age: number
  weight: number
  systolic: number
  diastolic: number
  medicines: string[]
  address: string
  assignedStaff: string
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    width: '100%',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 10,
  },
  nameCell: { width: '18%' },
  birthdateCell: { width: '12%' },
  ageCell: { width: '8%' },
  bpCell: { width: '12%' },
  medicinesCell: { width: '22%' },
  addressCell: { width: '15%' },
  staffCell: { width: '13%' },
});

// Create Document Component
const SeniorCitizenPDF = ({ data }: { data: SeniorCitizen[] }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.title}>Senior Citizen Records</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.nameCell]}>Name</Text>
          <Text style={[styles.tableCell, styles.birthdateCell]}>Birthdate</Text>
          <Text style={[styles.tableCell, styles.ageCell]}>Age</Text>
          <Text style={[styles.tableCell, styles.bpCell]}>Blood Pressure</Text>
          <Text style={[styles.tableCell, styles.medicinesCell]}>Maintenances</Text>
          <Text style={[styles.tableCell, styles.addressCell]}>Purok</Text>
          <Text style={[styles.tableCell, styles.staffCell]}>Assigned Staff</Text>
        </View>
        {data.map((citizen, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.nameCell]}>{`${citizen.firstName} ${citizen.lastName}`}</Text>
            <Text style={[styles.tableCell, styles.birthdateCell]}>{new Date(citizen.birthDate).toLocaleDateString()}</Text>
            <Text style={[styles.tableCell, styles.ageCell]}>{citizen.age.toString()}</Text>
            <Text style={[styles.tableCell, styles.bpCell]}>{`${citizen.systolic}/${citizen.diastolic}`}</Text>
            <Text style={[styles.tableCell, styles.medicinesCell]}>{citizen.medicines.join(', ')}</Text>
            <Text style={[styles.tableCell, styles.addressCell]}>{citizen.address}</Text>
            <Text style={[styles.tableCell, styles.staffCell]}>{citizen.assignedStaff}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export function SeniorCitizenPDFGenerator() {
  const [loading, setLoading] = useState(false)
  const [seniorData, setSeniorData] = useState<SeniorCitizen[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/senior-citizen')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch senior citizen data')
      }

      setSeniorData(data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      {seniorData.length === 0 ? (
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex justify-between items-center py-4 px-4 rounded-lg text-white cursor-pointer bg-orange-600 hover:bg-orange-700 w-full"
        >
          <span className="font-semibold">
            {loading ? 'FETCHING DATA...' : 'GENERATE SENIOR CITIZEN RECORDS PDF'}
          </span>
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
          document={<SeniorCitizenPDF data={seniorData} />}
          fileName="senior_citizen_records.pdf"
          className="flex justify-between items-center py-4 px-4 rounded-lg font-semibold text-white cursor-pointer bg-orange-600 hover:bg-orange-700 w-full"
        >
          DOWNLOAD SENIOR CITIZEN RECORDS
          <DownloadIcon/>
        </PDFDownloadLink>
      )}
    </>
  )
}
