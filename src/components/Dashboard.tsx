import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  })

  useEffect(() => {
    const storedTransactions = localStorage.getItem(`transactions_${user?.id}`)
    if (storedTransactions) {
      const trans = JSON.parse(storedTransactions)
      setTransactions(trans)
      
      const income = trans
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
      
      const expenses = trans
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
      
      setSummary({
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses
      })
    }
  }, [user])

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category)
      if (existing) {
        existing.value += t.amount
      } else {
        acc.push({ name: t.category, value: t.amount })
      }
      return acc
    }, [])

  const monthlyData = transactions
    .reduce((acc: any[], t) => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short' })
      const existing = acc.find(item => item.month === month)
      if (existing) {
        if (t.type === 'income') {
          existing.income += t.amount
        } else {
          existing.expense += t.amount
        }
      } else {
        acc.push({
          month,
          income: t.type === 'income' ? t.amount : 0,
          expense: t.type === 'expense' ? t.amount : 0
        })
      }
      return acc
    }, [])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>
      
      <div className="dashboard-grid">
        <div className="summary-card">
          <h3>Total Income</h3>
          <div className="amount income">${summary.totalIncome.toFixed(2)}</div>
        </div>
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <div className="amount expense">${summary.totalExpenses.toFixed(2)}</div>
        </div>
        <div className="summary-card">
          <h3>Balance</h3>
          <div className="amount balance">${summary.balance.toFixed(2)}</div>
        </div>
      </div>

      {categoryData.length > 0 && (
        <div className="card">
          <h3>Expense Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {monthlyData.length > 0 && (
        <div className="card">
          <h3>Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#28a745" name="Income" />
              <Bar dataKey="expense" fill="#dc3545" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {transactions.length === 0 && (
        <div className="card">
          <p>No transactions yet. <a href="/transactions">Add your first transaction</a> to see your financial overview.</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard