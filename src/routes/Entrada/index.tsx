import { Link, useNavigate } from 'react-router-dom'
import Titulo from '../../components/Titulo/Titulo'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'

function Entrada () {
  const { paciente } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (paciente) {
      navigate('/', { replace: true })
    }
  }, [paciente, navigate])

  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErro('')

    try {
      const response = await fetch(
        `http://localhost:3001/pacientes?email=${email}`
      )
      if (!response.ok) throw new Error()

      const pacientes = await response.json()
      const paciente = pacientes[0]

      if (!paciente || paciente.senha !== senha) {
        setErro('Email ou senha incorretos.')
        return
      }

      login(paciente)
      navigate('/lembretes', { replace: true })
    } catch {
      setErro('Erro ao verificar as credenciais.')
    }
  }

  return (
    <main>
      <Titulo titulo='Entrar' />
      <section className='form'>
        {erro && <p className='form-erro'>{erro}</p>}
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div>
              <div className='input-container'>
                <label htmlFor='idEmail'>
                  Email <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  type='email'
                  name='email'
                  id='idEmail'
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className='input-container'>
                <label htmlFor='idSenha'>
                  Senha <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  type='password'
                  name='senha'
                  id='idSenha'
                  onChange={e => setSenha(e.target.value)}
                />
              </div>
            </div>
          </fieldset>
          <button type='submit'>Entrar</button>
        </form>
      </section>
      <p className='mb-[2vh]'>
        Não tem um perfil?{' '}
        <Link to='/cadastrar' className='font-bold'>
          Cadastrar
        </Link>
      </p>
    </main>
  )
}

export default Entrada
