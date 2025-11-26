import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const { login, register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      let success
      if (isLogin) {
        success = await login(formData.email, formData.password)
      } else {
        success = await register(formData.name, formData.email, formData.password)
      }

      if (!success) {
        setError(isLogin ? 'Invalid credentials' : 'Email already exists')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            marginLeft: '5px'
          }}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  )
}

export default Login