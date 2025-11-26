import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        
        if (parsed && typeof parsed === 'object' && parsed.id && parsed.email) {
          setUser(parsed)
        } else {
          localStorage.removeItem('user')
        }
      } catch (e) {
        
        localStorage.removeItem('user')
        setUser(null)
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    let users: any[] = []
    try {
      users = JSON.parse(localStorage.getItem('users') || '[]')
      if (!Array.isArray(users)) users = []
    } catch {
      users = []
      localStorage.removeItem('users')
    }
    const user = users.find((u: any) => u.email === email && u.password === password)
    
    if (user) {
      const userData = { id: user.id, name: user.name, email: user.email }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    let users: any[] = []
    try {
      users = JSON.parse(localStorage.getItem('users') || '[]')
      if (!Array.isArray(users)) users = []
    } catch {
      users = []
      localStorage.removeItem('users')
    }
    
    if (users.find((u: any) => u.email === email)) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    login,
    logout,
    register
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}