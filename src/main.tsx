import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App'
import Ajuda from './routes/Ajuda'
import Avaliacoes from './routes/Avaliacoes'
import ListaGuias from './routes/ListaGuias'
import Contato from './routes/Contato'
import Erro from './routes/Erro'
import Guia from './routes/Guia'
import Home from './routes/Home'
import Lembretes from './routes/Lembretes'
import Perfil from './routes/Perfil'
import QuemSomos from './routes/QuemSomos'
import Termos from './routes/Termos'
import Cadastro from './routes/Cadastro'
import Entrada from './routes/Entrada'
import { AuthProvider } from './context/AuthContext'
import AuthRoute from './context/AuthRoute'
import Informacoes from './routes/Informacoes'
import Informacao from './routes/Informacao'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Erro />,
    children: [
      { path: '/ajuda', element: <Ajuda /> },
      { path: '/avaliar-teleconsulta', element: <Avaliacoes /> },
      {
        path: '/cadastrar',
        element: (
          <AuthRoute restrito={false}>
            <Cadastro />
          </AuthRoute>
        )
      },
      { path: '/contato', element: <Contato /> },
      {
        path: '/entrar',
        element: (
          <AuthRoute restrito={false}>
            <Entrada />
          </AuthRoute>
        )
      },
      { path: '/guias/guia/:name', element: <Guia /> },
      { path: '/', element: <Home /> },
      {
        path: '/lembretes',
        element: (
          <AuthRoute restrito>
            <Lembretes />
          </AuthRoute>
        )
      },
      { path: '/guias', element: <ListaGuias /> },
      {
        path: '/perfil',
        element: (
          <AuthRoute restrito>
            <Perfil />
          </AuthRoute>
        )
      },
      { path: '/quem-somos', element: <QuemSomos /> },
      { path: '/termos', element: <Termos /> },
      { path: '/informacao', element: <Informacoes /> },
      { path: '/informacao/:name', element: <Informacao /> }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
