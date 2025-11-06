import React, { createContext, useContext, useEffect, useState } from 'react'
import type { tipoContext } from '../types/tipoContext'
import type { tipoTokenPayload } from '../types/tipoPaciente'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext<tipoContext | undefined>(undefined)

export function AuthProvider ({ children }: { children: React.ReactNode }) {
  const [paciente, setPaciente] = useState<tipoTokenPayload | null>(null)
  const [, setToken] = useState<string | null>(null)

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token')

    if (tokenSalvo) {
      try {
        const decoded = jwtDecode<tipoTokenPayload>(tokenSalvo)

        if (Number(decoded.exp) > Math.floor(Date.now() / 1000)) {
          setToken(tokenSalvo)
          setPaciente({
            sub: decoded.sub,
            nome: decoded.nome,
            email: decoded.email,
            telefone: decoded.telefone,
            acompanhantes: decoded.acompanhantes
          } as tipoTokenPayload)
        } else {
          localStorage.removeItem('token')
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
        }
        localStorage.removeItem('token')
      }
    }
  }, [])

  const login = (data: string) => {
    try {
      const decoded = jwtDecode<tipoTokenPayload>(data)
      if (!decoded) return

      setToken(data)
      setPaciente({
        sub: decoded.sub,
        nome: decoded.nome,
        email: decoded.email,
        telefone: decoded.telefone,
        acompanhantes: decoded.acompanhantes
      } as tipoTokenPayload)
      localStorage.setItem('token', data)

    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
      }
    }
  }

  const logout = () => {
    setToken(null)
    setPaciente(null)
    localStorage.removeItem('token')
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
