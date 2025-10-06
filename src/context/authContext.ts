import { createContext } from 'react'
import type { tipoPaciente } from '../types/tipoPaciente'

export type AuthContextType = {
  paciente: tipoPaciente | null;
  login: (p: tipoPaciente) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)