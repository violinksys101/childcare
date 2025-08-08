export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'caregiver' | 'accountant' | 'field_worker' | 'parent';
  avatar?: string;
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  parentId: string;
  parentName: string;
  program: string;
  status: 'active' | 'inactive';
  emergencyContact: string;
  medicalInfo?: string;
  enrollmentDate: string;
}

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  children: string[];
  billingStatus: 'current' | 'overdue' | 'paid';
  totalDue: number;
}

export interface AttendanceRecord {
  id: string;
  childId: string;
  childName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'early_departure';
  caregiverName: string;
  notes?: string;
}

export interface StaffAttendance {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  location?: string;
  status: 'present' | 'absent' | 'late';
  hoursWorked: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  payPeriod: string;
  regularHours: number;
  overtimeHours: number;
  holidayHours: number;
  hourlyRate: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: 'draft' | 'approved' | 'paid';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Invoice {
  id: string;
  parentId: string;
  parentName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}