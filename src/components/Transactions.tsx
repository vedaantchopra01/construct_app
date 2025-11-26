import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
}

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Other Income'],
  expense: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other']
}

const Transactions: React.FC = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const storedTransactions = localStorage.getItem(`transactions_${user?.id}`)
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    }
  }, [user])

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions)
    localStorage.setItem(`transactions_${user?.id}`, JSON.stringify(newTransactions))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.amount || !formData.description) {
      alert('Please fill in all fields')
      return
    }

    const transaction: Transaction = {
      id: editingId || Date.now().toString(),
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date
    }

    if (editingId) {
      const updatedTransactions = transactions.map(t => t.id === editingId ? transaction : t)
      saveTransactions(updatedTransactions)
      setEditingId(null)
    } else {
      saveTransactions([...transactions, transaction])
    }

    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    })
    setShowForm(false)
  }

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date
    })
    setEditingId(transaction.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions.filter(t => t.id !== id)
      saveTransactions(updatedTransactions)
    }
  }

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData({
      ...formData,
      type,
      category: ''
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Transactions</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          Add Transaction
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingId ? 'Edit' : 'Add'} Transaction</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={`btn ${formData.type === 'income' ? 'btn-success' : ''}`}
                  style={{ backgroundColor: formData.type === 'income' ? '#28a745' : '#ccc' }}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={`btn ${formData.type === 'expense' ? 'btn-danger' : ''}`}
                  style={{ backgroundColor: formData.type === 'expense' ? '#dc3545' : '#ccc' }}
                >
                  Expense
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories[formData.type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Add'} Transaction
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({
                    type: 'expense',
                    category: '',
                    amount: '',
                    description: '',
                    date: new Date().toISOString().split('T')[0]
                  })
                }}
                className="btn"
                style={{ backgroundColor: '#ccc' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet. Add your first transaction above!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Description</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(transaction => (
                    <tr key={transaction.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: transaction.type === 'income' ? '#d4edda' : '#f8d7da',
                            color: transaction.type === 'income' ? '#155724' : '#721c24',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {transaction.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>{transaction.category}</td>
                      <td style={{ padding: '10px' }}>{transaction.description}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <span className={transaction.type === 'income' ? 'income' : 'expense'}>
                          ${transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="btn"
                          style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '5px 10px',
                            marginRight: '5px',
                            fontSize: '12px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="btn"
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '5px 10px',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions