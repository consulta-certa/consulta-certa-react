import { Link } from 'react-router-dom'
import Titulo from '../../components/Titulo/Titulo'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type { tipoPaciente } from '../../types/tipoPaciente'
import MensagemErro from '../../components/MensagemErro/MensagemErro'
import { ImEye, ImEyeBlocked } from 'react-icons/im'
const URL_PACIENTES = import.meta.env.VITE_API_BASE_PACIENTES

function Entrada () {
  const { login } = useAuth()
  const [mostrar, setMostrar] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<tipoPaciente>()

  const onSubmit: SubmitHandler<tipoPaciente> = async data => {
    try {
      const response = await fetch(URL_PACIENTES)
      const dataPaciente = await response.json()

      const emailExiste = dataPaciente.some(
        (p: tipoPaciente) => p.email === data.email
      )
      const senhaIncorreta = dataPaciente.some(
        (p: tipoPaciente) => p.senha != data.senha
      )

      if (!emailExiste) {
        setError('email', { type: 'manual', message: 'Email não cadastrado' })
      }

      if (senhaIncorreta) {
        setError('senha', {
          type: 'manual',
          message: 'Senha incorreta'
        })
      }

      if (emailExiste && !senhaIncorreta) {
        login(dataPaciente.find((p: tipoPaciente) => p.email === data.email))
      }
    } catch {
      console.error('Erro ao acessar servidor')
    }
  }

  return (
    <main>
      <Titulo titulo='Entrar' />
      <section className='form'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div>
              <div className='input-container'>
                <label htmlFor='idEmail'>
                  Email <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  className={
                    errors.email ? 'outline-1 outline-red-500' : 'outline-none'
                  }
                  type='email'
                  id='idEmail'
                  {...register('email', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Email inválido'
                    }
                  })}
                />
                <MensagemErro error={errors.email} />
              </div>
            </div>
            <div>
              <div className='input-container'>
                <label
                  htmlFor='id
                Senha'
                >
                  Senha <span className='text-red-500 font-bold'>*</span>
                </label>
                <div>
                  <input
                    className={
                      errors.senha
                        ? 'outline-1 outline-red-500'
                        : 'outline-none'
                    }
                    type={mostrar ? 'text' : 'password'}
                    id='idSenha'
                    {...register('senha', {
                      required: 'Campo obrigatório',
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$/,
                        message:
                          'Precisa ter pelo menos um número, uma letra maiúscula, uma letra minúscula, um número e um símbolo'
                      },
                      minLength: {
                        value: 6,
                        message: 'Precisa de pelo menos 6 caracteres'
                      }
                    })}
                  />
                  <div
                    onClick={() =>
                      mostrar ? setMostrar(false) : setMostrar(true)
                    }
                    className='text-lg right-4 flex cursor-pointer w-fit'
                  >
                    <p className='text-sm'>Mostrar senhas</p>
                    {mostrar ? <ImEye /> : <ImEyeBlocked />}
                  </div>
                </div>
                <MensagemErro error={errors.senha} />
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
