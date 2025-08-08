import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TrendingUp, TrendingDown, DollarSign, FileText, Plus, Download } from 'lucide-react'
import { mockTransactions, mockInvoices } from '@/data/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'

export function Accounting() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'invoices'>('overview')

  const totalRevenue = mockTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const netProfit = totalRevenue - totalExpenses

  const outstandingInvoices = mockInvoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + i.amount, 0)

  const getTransactionBadge = (type: string, status: string) => {
    if (status === 'pending') return <Badge variant="warning">Pending</Badge>
    if (status === 'cancelled') return <Badge variant="destructive">Cancelled</Badge>
    if (type === 'income') return <Badge variant="success">Income</Badge>
    return <Badge variant="secondary">Expense</Badge>
  }

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounting Management</h1>
          <p className="text-gray-600 mt-2">Track finances, invoices, and business performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('overview')}
          size="sm"
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'transactions' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('transactions')}
          size="sm"
        >
          Transactions
        </Button>
        <Button
          variant={activeTab === 'invoices' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('invoices')}
          size="sm"
        >
          Invoices
        </Button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-full">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Profit</p>
                    <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(netProfit)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <DollarSign className={`h-6 w-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Outstanding</p>
                    <p className="text-2xl font-bold text-warning-600">{formatCurrency(outstandingInvoices)}</p>
                  </div>
                  <div className="p-3 bg-warning-50 rounded-full">
                    <FileText className="h-6 w-6 text-warning-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{formatDate(transaction.date)}</span>
                        <span>{transaction.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                      {getTransactionBadge(transaction.type, transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'transactions' && (
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{formatDate(transaction.date)}</span>
                      <span>{transaction.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                    {getTransactionBadge(transaction.type, transaction.status)}
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'invoices' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Invoices</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Invoice #{invoice.id}</h3>
                    <p className="text-sm text-gray-600 mt-1">{invoice.parentName}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Due: {formatDate(invoice.dueDate)}</span>
                      <span>{invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </span>
                    {getInvoiceStatusBadge(invoice.status)}
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}