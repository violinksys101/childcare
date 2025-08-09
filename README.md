# Child Care Management System

A comprehensive web application for managing child care centers, built with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Core Modules

1. **Dashboard Overview**
   - Real-time KPI tracking
   - Financial overview
   - Recent activities
   - Attendance summaries

2. **Children Management**
   - Complete child profiles
   - Age calculation
   - Program enrollment
   - Medical information
   - Emergency contacts

3. **Parent Management**
   - Parent profiles and contact info
   - Multiple children support
   - Billing status tracking
   - Outstanding balance management

4. **Attendance System**
   - Children and staff attendance
   - Date-based tracking
   - Status indicators
   - Location tracking for staff
   - Hours worked calculation

5. **Payroll Management**
   - Employee payroll records
   - Hours breakdown (regular, overtime, holiday)
   - Gross pay, deductions, net pay
   - Payroll status workflow
   - Payslip generation ready

6. **Accounting System**
   - Financial dashboard
   - Transaction management
   - Invoice system
   - Outstanding payments
   - Export functionality

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form components
│   └── layout/       # Layout components
├── pages/            # Page components
├── types/            # TypeScript type definitions
├── data/             # Mock data
├── lib/              # Utility functions
└── App.tsx           # Main application component
```

## Features Ready for Enhancement

- **Database Integration**: Ready for Supabase or other backend
- **Authentication**: Role-based access control
- **Real-time Updates**: WebSocket integration
- **File Uploads**: Document management
- **Notifications**: Email/SMS alerts
- **Payment Processing**: Stripe/PayPal integration
- **Location Services**: GPS tracking
- **Reporting**: Advanced analytics

## User Roles

- **Admin**: Full system access
- **Caregiver**: Child care and attendance
- **Accountant**: Financial management
- **Field Worker**: Mobile attendance tracking
- **Parent**: View child information and billing

## Demo Data

The application includes comprehensive mock data for testing all features:
- Sample children and parent profiles
- Attendance records
- Payroll data
- Financial transactions
- Invoices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.