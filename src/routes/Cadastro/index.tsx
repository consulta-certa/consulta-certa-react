import { Link, useNavigate } from 'react-router-dom'
import Titulo from '../../components/Titulo/Titulo'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'
const URL_PACIENTES = import.meta.env.VITE_API_BASE_PACIENTES;

function Cadastro () {
  const { paciente } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (paciente) {
      navigate('/', { replace: true })
    }
  }, [paciente, navigate])

  const { login } = useAuth()
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [emailConfirmado, setEmailConfirmado] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirmada, setSenhaConfirmada] = useState('')
  const [acompanhante, setAcompanhante] = useState(false)
  const [erro, setErro] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErro('')

    if (!nome.trim() || nome.length < 2) {
      setErro('Nome inválido.')
      return
    }
    if (!telefone.trim() || !/^\d{10,11}$/.test(telefone.replace(/\D/g, ''))) {
      setErro('Telefone inválido. Exemplo de telefone correto: 11999999999).')
      return
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErro('Email inválido.')
      return
    }
    if (email !== emailConfirmado) {
      setErro('Os emails precisam ser iguais.')
      return
    }
    if (senha.length < 6) {
      setErro('Senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (senha !== senhaConfirmada) {
      setErro('As senhas precisam ser iguais.')
      return
    }

    const perfil = { nome, telefone, email, senha, acompanhante }

    try {
      const response = await fetch(`${URL_PACIENTES}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfil)
      })

      if (!response.ok) throw new Error('Erro ao salvar o perfil')

      const data = await response.json()
      login(data)
      navigate('/lembretes', { replace: true })
    } catch {
      setErro('Erro ao enviar os dados. Tente novamente mais tarde.')
    }
  }

  return (
    <main>
      <Titulo titulo='Criar perfil' />
      <section className='form'>
        {erro && <p className='form-erro'>{erro}</p>}
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div>
              <div className='input-container'>
                <label htmlFor='idNome'>
                  Nome <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  type='text'
                  name='nome'
                  id='idNome'
                  required
                  onChange={e => setNome(e.target.value)}
                />
              </div>
              <div className='input-container'>
                <label htmlFor='idTelefone'>
                  Telefone <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  type='tel'
                  name='telefone'
                  id='idTelefone'
                  required
                  onChange={e => setTelefone(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className='input-container'>
                <label htmlFor='idEmail'>
                  Email <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  type='email'
                  name='email'
                  id='idEmail'
                  required
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className='input-container'>
                <label htmlFor='idEmailConfirmado'>
                  Confirmar email{' '}
                  <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  type='email'
                  name='emailConfirmado'
                  id='idEmailConfirmado'
                  required
                  onChange={e => setEmailConfirmado(e.target.value)}
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
                  required
                  onChange={e => setSenha(e.target.value)}
                />
              </div>
              <div className='input-container'>
                <label htmlFor='idSenhaConfirmada'>
                  Confirmar Senha{' '}
                  <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  type='password'
                  name='senhaConfirmado'
                  id='idSenhaConfirmada'
                  required
                  onChange={e => setSenhaConfirmada(e.target.value)}
                />
              </div>
            </div>
            <div className='gap-2 pl-[1vw] my-[2vh]'>
              <input
                type='checkbox'
                name='acompanhante'
                id='idAcompanhante'
                onChange={e => setAcompanhante(e.target.checked)}
              />
              <label htmlFor='idAcompanhante'>
                Tem um cuidador ou acompanhante?
              </label>
            </div>
            <div>
              <p className='mx-auto text-sm opacity-75'>
                Ao criar um perfil você concorda com os{' '}
                <Link to='/termos' className='font-bold'>
                  Termos de Uso e Políticas de Privacidade
                </Link>
                .
              </p>
            </div>
          </fieldset>
          <button type='submit'>Criar um perfil</button>
        </form>
      </section>
      <p className='mb-[2vh]'>
        Já tem um perfil?{' '}
        <Link to='/entrar' className='font-bold'>
          Entrar
        </Link>
      </p>
    </main>
  )
}

export default Cadastro
