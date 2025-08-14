/*
  # Child Care Management System Database Schema

  1. New Tables
    - `locations` - Physical locations with GPS coordinates
    - `users` - System users (admin, caregiver, field_worker, parent)
    - `referrals` - Institutions and individuals who refer families
    - `parents` - Parent/guardian information
    - `children` - Child profiles and enrollment data
    - `attendance_records` - Daily attendance tracking for children
    - `staff_attendance` - Staff attendance and location verification
    - `payroll_records` - Employee payroll and compensation
    - `transactions` - Financial transactions (income/expenses)
    - `invoices` - Billing invoices for parents
    - `invoice_items` - Line items for invoices

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure sensitive financial and personal data

  3. Relationships
    - Foreign key constraints between related tables
    - Proper indexing for performance
    - Default values and constraints for data integrity
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  radius integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'caregiver', 'accountant', 'field_worker', 'parent')),
  avatar text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_locations junction table for field workers
CREATE TABLE IF NOT EXISTS user_locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, location_id)
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('institution', 'individual')),
  contact_person text,
  email text,
  phone text,
  address text,
  website text,
  notes text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  total_referrals integer DEFAULT 0,
  date_added date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create parents table
CREATE TABLE IF NOT EXISTS parents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  billing_status text DEFAULT 'current' CHECK (billing_status IN ('current', 'overdue', 'paid')),
  total_due decimal(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create children table
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  parent_id uuid REFERENCES parents(id) ON DELETE CASCADE,
  referral_id uuid REFERENCES referrals(id) ON DELETE SET NULL,
  home_location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  program text NOT NULL DEFAULT 'Full Day Care',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  emergency_contact text NOT NULL,
  medical_info text,
  enrollment_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_children junction table for field worker assignments
CREATE TABLE IF NOT EXISTS user_children (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, child_id)
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  date date NOT NULL,
  check_in time,
  check_out time,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'early_departure')),
  caregiver_id uuid REFERENCES users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(child_id, date)
);

-- Create staff_attendance table
CREATE TABLE IF NOT EXISTS staff_attendance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  check_in time,
  check_out time,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  hours_worked decimal(4, 2) DEFAULT 0,
  verified_location boolean DEFAULT false,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(staff_id, date)
);

-- Create payroll_records table
CREATE TABLE IF NOT EXISTS payroll_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id uuid REFERENCES users(id) ON DELETE CASCADE,
  pay_period_start date NOT NULL,
  pay_period_end date NOT NULL,
  position text NOT NULL,
  regular_hours decimal(5, 2) DEFAULT 0,
  overtime_hours decimal(5, 2) DEFAULT 0,
  holiday_hours decimal(5, 2) DEFAULT 0,
  hourly_rate decimal(8, 2) NOT NULL,
  gross_pay decimal(10, 2) NOT NULL,
  deductions decimal(10, 2) DEFAULT 0,
  net_pay decimal(10, 2) NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'paid')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  amount decimal(10, 2) NOT NULL,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  parent_id uuid REFERENCES parents(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id uuid REFERENCES parents(id) ON DELETE CASCADE,
  amount decimal(10, 2) NOT NULL,
  due_date date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity integer DEFAULT 1,
  rate decimal(8, 2) NOT NULL,
  amount decimal(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_children_parent_id ON children(parent_id);
CREATE INDEX IF NOT EXISTS idx_children_referral_id ON children(referral_id);
CREATE INDEX IF NOT EXISTS idx_attendance_child_date ON attendance_records(child_id, date);
CREATE INDEX IF NOT EXISTS idx_staff_attendance_staff_date ON staff_attendance(staff_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_parent_id ON transactions(parent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_invoices_parent_id ON invoices(parent_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Locations policies
CREATE POLICY "Users can view locations" ON locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage locations" ON locations FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins can view all users" ON users FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "Admins can manage users" ON users FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- User locations policies
CREATE POLICY "Field workers can view their locations" ON user_locations FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'caregiver'))
);

-- Referrals policies
CREATE POLICY "Authenticated users can view referrals" ON referrals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can manage referrals" ON referrals FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'caregiver'))
);

-- Parents policies
CREATE POLICY "Parents can view their own data" ON parents FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'caregiver', 'accountant'))
);
CREATE POLICY "Staff can manage parents" ON parents FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'caregiver'))
);

-- Children policies
CREATE POLICY "Parents can view their children" ON children FOR SELECT TO authenticated USING (
  parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'caregiver')) OR
  EXISTS (SELECT 1 FROM user_children WHERE user_children.user_id = auth.uid() AND user_children.child_id = children.id)
);
CREATE POLICY "Staff can manage children" ON children FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'caregiver'))
);

-- User children policies
CREATE POLICY "Field workers can view their assignments" ON user_children FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'caregiver'))
);

-- Attendance records policies
CREATE POLICY "Staff can view attendance records" ON attendance_records FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'caregiver', 'field_worker'))
);
CREATE POLICY "Staff can manage attendance records" ON attendance_records FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'caregiver', 'field_worker'))
);

-- Staff attendance policies
CREATE POLICY "Staff can view their own attendance" ON staff_attendance FOR SELECT TO authenticated USING (
  staff_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'caregiver'))
);
CREATE POLICY "Staff can manage attendance" ON staff_attendance FOR ALL TO authenticated USING (
  staff_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'caregiver'))
);

-- Payroll records policies
CREATE POLICY "Employees can view their payroll" ON payroll_records FOR SELECT TO authenticated USING (
  employee_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant'))
);
CREATE POLICY "Admins and accountants can manage payroll" ON payroll_records FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant'))
);

-- Transactions policies
CREATE POLICY "Staff can view transactions" ON transactions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant', 'caregiver'))
);
CREATE POLICY "Admins and accountants can manage transactions" ON transactions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant'))
);

-- Invoices policies
CREATE POLICY "Parents can view their invoices" ON invoices FOR SELECT TO authenticated USING (
  parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant', 'caregiver'))
);
CREATE POLICY "Staff can manage invoices" ON invoices FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant'))
);

-- Invoice items policies
CREATE POLICY "Users can view invoice items" ON invoice_items FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM invoices 
    WHERE invoices.id = invoice_items.invoice_id 
    AND (
      invoices.parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant', 'caregiver'))
    )
  )
);
CREATE POLICY "Staff can manage invoice items" ON invoice_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant'))
);

-- Create functions for updating referral counts
CREATE OR REPLACE FUNCTION update_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE referrals 
    SET total_referrals = total_referrals + 1 
    WHERE id = NEW.referral_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE referrals 
    SET total_referrals = GREATEST(total_referrals - 1, 0) 
    WHERE id = OLD.referral_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.referral_id IS DISTINCT FROM NEW.referral_id THEN
      IF OLD.referral_id IS NOT NULL THEN
        UPDATE referrals 
        SET total_referrals = GREATEST(total_referrals - 1, 0) 
        WHERE id = OLD.referral_id;
      END IF;
      IF NEW.referral_id IS NOT NULL THEN
        UPDATE referrals 
        SET total_referrals = total_referrals + 1 
        WHERE id = NEW.referral_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral count updates
CREATE TRIGGER trigger_update_referral_count
  AFTER INSERT OR UPDATE OR DELETE ON children
  FOR EACH ROW EXECUTE FUNCTION update_referral_count();

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON attendance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_attendance_updated_at BEFORE UPDATE ON staff_attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_records_updated_at BEFORE UPDATE ON payroll_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();