import React, { createContext, useContext, useEffect, useState } from 'react'
import type { tipoContext } from '../types/tipoContext'
import type { tipoPaciente } from '../types/tipoPaciente'

const AuthContext = createContext<tipoContext | undefined>(undefined)

export function AuthProvider ({ children }:{ children: React.ReactNode }) {
  const [paciente, setPaciente] = useState<tipoPaciente | null>(null)

  useEffect(() => {
    const pacienteSalvo = localStorage.getItem('paciente')

    if (pacienteSalvo) {
      setPaciente(JSON.parse(pacienteSalvo))
    }
  }, [])

  const login = (data: tipoPaciente) => {
    setPaciente(data)
    localStorage.setItem('paciente', JSON.stringify(data))
  }

  const logout = () => {
    setPaciente(null)
    localStorage.removeItem('paciente')
  }

  return (
    <AuthContext.Provider value={{ paciente, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): tipoContext => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth precisa estar dentro de um AuthProvider')
  }

  return context
}
