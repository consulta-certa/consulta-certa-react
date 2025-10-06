import { useState, useEffect } from 'react'
import { AuthContext } from './authContext'
import type { tipoPaciente } from '../types/tipoPaciente'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [paciente, setPaciente] = useState<tipoPaciente | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('perfilLogado')
    if (stored) {
      try {
        setPaciente(JSON.parse(stored))
      } catch {
        localStorage.removeItem('perfilLogado')
      }
    }
  }, [])

  const login = (p: tipoPaciente) => {
    setPaciente(p)
    localStorage.setItem('perfilLogado', JSON.stringify(p))
  }

  const logout = () => {
    setPaciente(null)
    localStorage.removeItem('perfilLogado')
  }

  return (
    <AuthContext.Provider value={{ paciente, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}