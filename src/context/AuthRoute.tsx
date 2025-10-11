import type React from "react"
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function AuthRoute({children, restrito}:{children:React.ReactElement; restrito:boolean}) {
    const { paciente } = useAuth();

    if (restrito && !paciente) {
        return <Navigate to='/entrar' replace/>
    }
    
    if (!restrito && paciente) {
        return <Navigate to='/' replace/>
    }

    return children
}

export default AuthRoute