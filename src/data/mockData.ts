import { Child, Parent, AttendanceRecord, StaffAttendance, PayrollRecord, Transaction, Invoice } from '@/types'

export const mockChildren: Child[] = [
  {
    id: '1',
    firstName: 'Emma',
    lastName: 'Johnson',
    dateOfBirth: '2019-03-15',
    parentId: '1',
    parentName: 'Sarah Johnson',
    program: 'Full Day Care',
    status: 'active',
    emergencyContact: '(555) 123-4567',
    enrollmentDate: '2023-01-15'
  },
  {
    id: '2',
    firstName: 'Liam',
    lastName: 'Smith',
    dateOfBirth: '2020-07-22',
    parentId: '2',
    parentName: 'Michael Smith',
    program: 'Half Day Care',
    status: 'active',
    emergencyContact: '(555) 234-5678',
    enrollmentDate: '2023-02-01'
  },
  {
    id: '3',
    firstName: 'Olivia',
    lastName: 'Brown',
    dateOfBirth: '2018-11-08',
    parentId: '3',
    parentName: 'Jennifer Brown',
    program: 'After School',
    status: 'active',
    emergencyContact: '(555) 345-6789',
    enrollmentDate: '2022-09-01'
  }
]

export const mockParents: Parent[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
    children: ['1'],
    billingStatus: 'current',
    totalDue: 0
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Smith',
    email: 'michael.smith@email.com',
    phone: '(555) 234-5678',
    address: '456 Oak Ave, Anytown, ST 12345',
    children: ['2'],
    billingStatus: 'overdue',
    totalDue: 450
  },
  {
    id: '3',
    firstName: 'Jennifer',
    lastName: 'Brown',
    email: 'jennifer.brown@email.com',
    phone: '(555) 345-6789',
    address: '789 Pine Rd, Anytown, ST 12345',
    children: ['3'],
    billingStatus: 'paid',
    totalDue: 0
  }
]

export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    childId: '1',
    childName: 'Emma Johnson',
    date: '2024-01-15',
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'present',
    caregiverName: 'Ms. Anderson'
  },
  {
    id: '2',
    childId: '2',
    childName: 'Liam Smith',
    date: '2024-01-15',
    checkIn: '08:30',
    checkOut: '12:30',
    status: 'late',
    caregiverName: 'Ms. Wilson'
  },
  {
    id: '3',
    childId: '3',
    childName: 'Olivia Brown',
    date: '2024-01-15',
    status: 'absent',
    caregiverName: 'Ms. Davis'
  }
]

export const mockStaffAttendance: StaffAttendance[] = [
  {
    id: '1',
    staffId: '1',
    staffName: 'Ms. Anderson',
    date: '2024-01-15',
    checkIn: '07:45',
    checkOut: '17:15',
    location: 'Main Center',
    status: 'present',
    hoursWorked: 9.5
  },
  {
    id: '2',
    staffId: '2',
    staffName: 'Ms. Wilson',
    date: '2024-01-15',
    checkIn: '08:15',
    checkOut: '16:45',
    location: 'Main Center',
    status: 'late',
    hoursWorked: 8.5
  }
]

export const mockPayroll: PayrollRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Ms. Anderson',
    position: 'Lead Caregiver',
    payPeriod: 'Jan 1-15, 2024',
    regularHours: 80,
    overtimeHours: 5,
    holidayHours: 8,
    hourlyRate: 18.50,
    grossPay: 1851.50,
    deductions: 285.50,
    netPay: 1566.00,
    status: 'approved'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Ms. Wilson',
    position: 'Assistant Caregiver',
    payPeriod: 'Jan 1-15, 2024',
    regularHours: 75,
    overtimeHours: 2,
    holidayHours: 0,
    hourlyRate: 15.00,
    grossPay: 1155.00,
    deductions: 178.50,
    netPay: 976.50,
    status: 'draft'
  }
]

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Tuition Payment - Emma Johnson',
    type: 'income',
    category: 'Tuition',
    amount: 800,
    status: 'completed'
  },
  {
    id: '2',
    date: '2024-01-14',
    description: 'Office Supplies',
    type: 'expense',
    category: 'Supplies',
    amount: 125.50,
    status: 'completed'
  },
  {
    id: '3',
    date: '2024-01-13',
    description: 'Food & Snacks',
    type: 'expense',
    category: 'Food',
    amount: 245.75,
    status: 'completed'
  }
]

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    parentId: '2',
    parentName: 'Michael Smith',
    amount: 450,
    dueDate: '2024-01-20',
    status: 'overdue',
    items: [
      { description: 'Half Day Care - January', quantity: 1, rate: 450, amount: 450 }
    ]
  },
  {
    id: '2',
    parentId: '1',
    parentName: 'Sarah Johnson',
    amount: 800,
    dueDate: '2024-02-01',
    status: 'pending',
    items: [
      { description: 'Full Day Care - February', quantity: 1, rate: 800, amount: 800 }
    ]
  }
]