import { useState, useEffect } from 'react'
import './index.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('income'); // 'income' or 'expense'
  const [editingId, setEditingId] = useState(null); // track if we are editing an existing item
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState = {
    name: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchData = async () => {
    try {
      const [expenseRes, incomeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/expenses`),
        fetch(`${API_BASE_URL}/income`)
      ]);

      const expenseData = await expenseRes.json();
      const incomeData = await incomeRes.json();

      setExpenses(expenseData);
      setIncomes(incomeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (type) => {
    setTransactionType(type);
    setEditingId(null);
    setFormData(initialFormState);
    setApiError('');
    setIsModalOpen(true);
  };

  const openEditModal = (type, item) => {
    setTransactionType(type);
    setEditingId(item.id);
    setFormData({
      name: item.name,
      amount: item.amount,
      category: item.category,
      date: item.date // assuming date format matches 'YYYY-MM-DD'
    });
    setApiError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    const url = type === 'income'
      ? `${API_BASE_URL}/income/removeIncome/${id}`
      : `${API_BASE_URL}/expenses/removeExpense/${id}`;

    try {
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete item.');
      await fetchData(); // refresh data
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError('');

    // If editingId exists, we PUT, otherwise POST
    const method = editingId ? 'PUT' : 'POST';
    let url = '';

    if (transactionType === 'income') {
      url = editingId ? `${API_BASE_URL}/income` : `${API_BASE_URL}/income/addIncome`;
    } else {
      url = editingId ? `${API_BASE_URL}/expenses` : `${API_BASE_URL}/expenses/addExpense`;
    }

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingId) {
      payload.id = editingId; // attach ID for PUT request
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const firstErrorKey = Object.keys(errorData)[0];
        throw new Error(errorData[firstErrorKey] || 'Something went wrong. Check your inputs.');
      }

      await fetchData(); // Refresh data
      closeModal();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <>
      <div className="glass-container">
        <h1 className="title">BudgetGo</h1>
        <p className="subtitle">Your premium financial dashboard</p>

        {loading ? (
          <div className="loading">Connecting to server...</div>
        ) : (
          <div className="dashboard-grid">

            {/* Balance Card */}
            <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <h2 className="card-title">Total Balance</h2>
              <div className="card-amount" style={{ fontSize: '3.5rem', color: balance >= 0 ? '#52b788' : '#ff4d6d' }}>
                ${balance.toFixed(2)}
              </div>
            </div>

            {/* Income Column */}
            <div className="glass-card">
              <h2 className="card-title">Income</h2>
              <div className="card-amount income">+${totalIncome.toFixed(2)}</div>

              <div style={{ marginTop: '1.5rem', flexGrow: 1 }}>
                {incomes.map(income => (
                  <div key={income.id} className="item-row">
                    <div>
                      <div className="item-name">{income.name}</div>
                      <div className="item-category">{income.category}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="card-amount income" style={{ fontSize: '1.2rem' }}>
                        +${income.amount.toFixed(2)}
                      </div>
                      <div className="item-actions">
                        <button className="action-btn edit" onClick={() => openEditModal('income', income)}>✏️</button>
                        <button className="action-btn delete" onClick={() => handleDelete('income', income.id)}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
                {incomes.length === 0 && <div className="item-category" style={{ marginTop: '1rem' }}>No income recorded.</div>}
              </div>

              <button onClick={() => openModal('income')} className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
                + Add Income
              </button>
            </div>

            {/* Expense Column */}
            <div className="glass-card">
              <h2 className="card-title">Expenses</h2>
              <div className="card-amount expense">-${totalExpense.toFixed(2)}</div>

              <div style={{ marginTop: '1.5rem', flexGrow: 1 }}>
                {expenses.map(expense => (
                  <div key={expense.id} className="item-row">
                    <div>
                      <div className="item-name">{expense.name}</div>
                      <div className="item-category">{expense.category}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="card-amount expense" style={{ fontSize: '1.2rem' }}>
                        -${expense.amount.toFixed(2)}
                      </div>
                      <div className="item-actions">
                        <button className="action-btn edit" onClick={() => openEditModal('expense', expense)}>✏️</button>
                        <button className="action-btn delete" onClick={() => handleDelete('expense', expense.id)}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
                {expenses.length === 0 && <div className="item-category" style={{ marginTop: '1rem' }}>No expenses recorded.</div>}
              </div>

              <button onClick={() => openModal('expense')} className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
                - Add Expense
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Glassmorphism Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>

            <h2 style={{ marginBottom: '1.5rem' }}>
              {editingId ? 'Edit' : 'Add'} {transactionType === 'income' ? 'Income' : 'Expense'}
            </h2>

            {apiError && <div className="error-message">{apiError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g. Groceries"
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g. Food"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default App
