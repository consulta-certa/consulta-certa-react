import { Link } from 'react-router-dom'
import Titulo from '../../components/Titulo/Titulo'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type { tipoPaciente } from '../../types/tipoPaciente'
import MensagemErro from '../../components/MensagemErro/MensagemErro'
import { ImEye, ImEyeBlocked } from 'react-icons/im'
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar'
const URL_PACIENTES = import.meta.env.VITE_API_BASE_PACIENTES

function Entrada () {
  const { login } = useAuth()
  const [mostrar, setMostrar] = useState<boolean>(false)
  const [serverError, setServerError] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<tipoPaciente>()

  const onSubmit: SubmitHandler<tipoPaciente> = async data => {
    try {
      const jsonPayload = {
        email: data.email,
        senha: data.senha
      }

      const response = await fetch(`${URL_PACIENTES}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonPayload)
      })

      if (!response.ok) {
        if (response.status == 404) {
          setError('email', { type: 'manual', message: 'Email não cadastrado' })
        }

        if (response.status == 401) {
          setError('senha', { type: 'manual', message: 'Senha incorreta' })
        }

        if (response.status == 500) {
          serverError ? setServerError(true) : setServerError(true)
        }

        return
      }

      const { token } = await response.json()
      login(token)

    } catch (error) {
      if (error instanceof Error) {
        serverError ? setServerError(true) : setServerError(true)
      }
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

      <ModalConfirmar
        operacao={() => setServerError(false)}
        mensagem='Erro ao acessar servidor'
        descricao='Aguarde um pouco e tente novamente.'
        confirmacao={serverError}
      />
    </main>
  )
}

export default Entrada
