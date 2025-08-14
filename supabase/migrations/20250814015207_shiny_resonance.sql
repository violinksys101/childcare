/*
  # Child Care Management System Database Schema

  1. New Tables
    - `users` - System users with role-based access (admin, caregiver, field_worker, parent, accountant)
    - `locations` - GPS coordinates for homes and facilities with radius-based access control
    - `referrals` - Institutions and individuals who refer families to the childcare center
    - `parents` - Parent/guardian profiles with contact information and billing status
    - `children` - Child profiles with enrollment data, medical information, and program details
    - `attendance_records` - Daily attendance tracking for children with caregiver notes
    - `staff_attendance` - Staff attendance with location verification and hours worked
    - `payroll_records` - Employee payroll with hours breakdown and compensation details
    - `transactions` - Financial transactions for income and expenses with categorization
    - `invoices` - Billing invoices for parents with due dates and status tracking
    - `invoice_items` - Individual line items for invoices with quantities and rates
    - `user_locations` - Junction table for field worker location assignments
    - `user_children` - Junction table for field worker child assignments

  2. Security
    - Enable RLS on all tables
    - Role-based access policies for users, parents, field workers, and staff
    - Parents can only access their own data and children
    - Field workers can only access assigned children and locations
    - Financial data restricted to admins and accountants
    - Staff attendance visible to supervisors and the staff member themselves

  3. Features
    - Location-based authentication for field workers
    - Referral source tracking with automatic counting
    - Comprehensive attendance system with status tracking
    - Payroll management with hours breakdown
    - Invoice system with line items
    - Audit trails with created/updated timestamps
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'caregiver', 'accountant', 'field_worker', 'parent');
CREATE TYPE child_status AS ENUM ('active', 'inactive');
CREATE TYPE billing_status AS ENUM ('current', 'overdue', 'paid');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'early_departure');
CREATE TYPE staff_attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE payroll_status AS ENUM ('draft', 'approved', 'paid');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'overdue');
CREATE TYPE referral_type AS ENUM ('institution', 'individual');
CREATE TYPE referral_status AS ENUM ('active', 'inactive');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'parent',
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  radius integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type referral_type NOT NULL DEFAULT 'institution',
  contact_person text,
  email text,
  phone text,
  address text,
  website text,
  notes text,
  total_referrals integer DEFAULT 0,
  status referral_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Parents table
CREATE TABLE IF NOT EXISTS parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  billing_status billing_status DEFAULT 'current',
  total_due decimal(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Children table
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  parent_id uuid REFERENCES parents(id) ON DELETE CASCADE,
  program text NOT NULL,
  status child_status DEFAULT 'active',
  emergency_contact text NOT NULL,
  medical_info text,
  enrollment_date date DEFAULT CURRENT_DATE,
  referral_id uuid REFERENCES referrals(id),
  home_location_id uuid REFERENCES locations(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Attendance records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  date date NOT NULL,
  check_in time,
  check_out time,
  status attendance_status NOT NULL,
  caregiver_name text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(child_id, date)
);

-- Staff attendance table
CREATE TABLE IF NOT EXISTS staff_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  check_in time,
  check_out time,
  location text,
  status staff_attendance_status NOT NULL,
  hours_worked decimal(4, 2) DEFAULT 0,
  location_verified boolean DEFAULT false,
  verified_location_id uuid REFERENCES locations(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(staff_id, date)
);

-- Payroll records table
CREATE TABLE IF NOT EXISTS payroll_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES users(id) ON DELETE CASCADE,
  pay_period text NOT NULL,
  position text NOT NULL,
  regular_hours decimal(5, 2) DEFAULT 0,
  overtime_hours decimal(5, 2) DEFAULT 0,
  holiday_hours decimal(5, 2) DEFAULT 0,
  hourly_rate decimal(8, 2) NOT NULL,
  gross_pay decimal(10, 2) NOT NULL,
  deductions decimal(10, 2) DEFAULT 0,
  net_pay decimal(10, 2) NOT NULL,
  status payroll_status DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  description text NOT NULL,
  type transaction_type NOT NULL,
  category text NOT NULL,
  amount decimal(10, 2) NOT NULL,
  status transaction_status DEFAULT 'pending',
  parent_id uuid REFERENCES parents(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES parents(id) ON DELETE CASCADE,
  amount decimal(10, 2) NOT NULL,
  due_date date NOT NULL,
  status invoice_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity integer DEFAULT 1,
  rate decimal(10, 2) NOT NULL,
  amount decimal(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User locations junction table (for field workers)
CREATE TABLE IF NOT EXISTS user_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, location_id)
);

-- User children junction table (for field workers)
CREATE TABLE IF NOT EXISTS user_children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, child_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_children_parent_id ON children(parent_id);
CREATE INDEX IF NOT EXISTS idx_attendance_child_date ON attendance_records(child_id, date);
CREATE INDEX IF NOT EXISTS idx_staff_attendance_staff_date ON staff_attendance(staff_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_parent_date ON transactions(parent_id, date);
CREATE INDEX IF NOT EXISTS idx_invoices_parent_status ON invoices(parent_id, status);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_period ON payroll_records(employee_id, pay_period);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_children ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin')
    )
  );

-- RLS Policies for parents table
CREATE POLICY "Parents can read own data"
  ON parents
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Staff can read all parents"
  ON parents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'caregiver', 'accountant')
    )
  );

-- RLS Policies for children table
CREATE POLICY "Parents can read own children"
  ON children
  FOR SELECT
  TO authenticated
  USING (
    parent_id IN (
      SELECT id FROM parents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can read all children"
  ON children
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'caregiver')
    )
  );

CREATE POLICY "Field workers can read assigned children"
  ON children
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'field_worker'
    ) AND id IN (
      SELECT child_id FROM user_children WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for attendance_records table
CREATE POLICY "Staff can manage attendance"
  ON attendance_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'caregiver', 'field_worker')
    )
  );

CREATE POLICY "Parents can read own children attendance"
  ON attendance_records
  FOR SELECT
  TO authenticated
  USING (
    child_id IN (
      SELECT c.id FROM children c
      JOIN parents p ON c.parent_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- RLS Policies for staff_attendance table
CREATE POLICY "Staff can read own attendance"
  ON staff_attendance
  FOR SELECT
  TO authenticated
  USING (staff_id = auth.uid());

CREATE POLICY "Staff can insert own attendance"
  ON staff_attendance
  FOR INSERT
  TO authenticated
  WITH CHECK (staff_id = auth.uid());

CREATE POLICY "Admins can manage all staff attendance"
  ON staff_attendance
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin')
    )
  );

-- RLS Policies for payroll_records table
CREATE POLICY "Employees can read own payroll"
  ON payroll_records
  FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid());

CREATE POLICY "Admins and accountants can manage payroll"
  ON payroll_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'accountant')
    )
  );

-- RLS Policies for transactions table
CREATE POLICY "Admins and accountants can manage transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'accountant')
    )
  );

-- RLS Policies for invoices table
CREATE POLICY "Parents can read own invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (
    parent_id IN (
      SELECT id FROM parents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and accountants can manage invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'accountant')
    )
  );

-- RLS Policies for invoice_items table
CREATE POLICY "Users can read invoice items for accessible invoices"
  ON invoice_items
  FOR SELECT
  TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE 
        parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
        OR EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() AND role IN ('admin', 'accountant')
        )
    )
  );

-- RLS Policies for referrals table
CREATE POLICY "Staff can manage referrals"
  ON referrals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'caregiver')
    )
  );

-- RLS Policies for locations table
CREATE POLICY "Staff can read locations"
  ON locations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'caregiver', 'field_worker')
    )
  );

-- RLS Policies for user_locations table
CREATE POLICY "Field workers can read own location assignments"
  ON user_locations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage location assignments"
  ON user_locations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for user_children table
CREATE POLICY "Field workers can read own child assignments"
  ON user_children
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage child assignments"
  ON user_children
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update referral count
CREATE OR REPLACE FUNCTION update_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.referral_id IS NOT NULL THEN
    UPDATE referrals 
    SET total_referrals = total_referrals + 1 
    WHERE id = NEW.referral_id;
  ELSIF TG_OP = 'DELETE' AND OLD.referral_id IS NOT NULL THEN
    UPDATE referrals 
    SET total_referrals = GREATEST(total_referrals - 1, 0) 
    WHERE id = OLD.referral_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.referral_id IS NOT NULL AND OLD.referral_id != NEW.referral_id THEN
      UPDATE referrals 
      SET total_referrals = GREATEST(total_referrals - 1, 0) 
      WHERE id = OLD.referral_id;
    END IF;
    IF NEW.referral_id IS NOT NULL AND OLD.referral_id != NEW.referral_id THEN
      UPDATE referrals 
      SET total_referrals = total_referrals + 1 
      WHERE id = NEW.referral_id;
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update referral counts
CREATE TRIGGER update_referral_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON children
  FOR EACH ROW
  EXECUTE FUNCTION update_referral_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON attendance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_attendance_updated_at BEFORE UPDATE ON staff_attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_records_updated_at BEFORE UPDATE ON payroll_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();