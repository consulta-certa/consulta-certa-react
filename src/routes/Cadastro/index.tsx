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

function Cadastro () {
  const { login } = useAuth()
  const [mostrar, setMostrar] = useState<boolean>(false)
  const [serverError, setServerError] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm<tipoPaciente>()

  const watchEmail = watch('email')
  const watchSenha = watch('senha')

  const onSubmit: SubmitHandler<tipoPaciente> = async data => {
    try {
      const response = await fetch(URL_PACIENTES)
      const dataPaciente = await response.json()

      const emailExiste = dataPaciente.some(
        (p: tipoPaciente) => p.email === data.email
      )
      const telefoneExiste = dataPaciente.some(
        (p: tipoPaciente) => p.telefone === data.telefone
      )

      if (emailExiste) {
        setError('email', { type: 'manual', message: 'Email já cadastrado' })
      }

      if (telefoneExiste) {
        setError('telefone', {
          type: 'manual',
          message: 'Telefone já cadastrado'
        })
      }

      if (!emailExiste && !telefoneExiste) {
        const dataPayload = {
          // id: 'idgerado',
          nome: data.nome.trim(),
          telefone: data.telefone.replace(/\D/g, ''),
          email: data.email,
          senha: data.senha,
          acompanhante: data.acompanhante ? 'S' : 'N'
        }

        const pacResponse = await fetch(URL_PACIENTES, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload)
        })

        const pacRegistro = await pacResponse.json()
        login(pacRegistro)
      }
    } catch {
      console.error('Erro ao cadastrar paciente.')
      serverError ? setServerError(true) : setServerError(true)
    }
  }

  return (
    <main>
      <Titulo titulo='Criar perfil' />
      <section className='form'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div>
              <div className='input-container'>
                <label htmlFor='idNome'>
                  Nome <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  className={
                    errors.nome ? 'outline-1 outline-red-500' : 'outline-none'
                  }
                  type='text'
                  id='idNome'
                  {...register('nome', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/,
                      message: 'Precisa ser apenas letras'
                    },
                    minLength: {
                      value: 3,
                      message: 'Precisa de pelo menos 3 letras'
                    }
                  })}
                />
                <MensagemErro error={errors.nome} />
              </div>
              <div className='input-container'>
                <label htmlFor='idTelefone'>
                  Telefone <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  className={
                    errors.telefone
                      ? 'outline-1 outline-red-500'
                      : 'outline-none'
                  }
                  type='tel'
                  id='idTelefone'
                  {...register('telefone', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value:
                        /^\(?[1-9]{2}\)?[\s-]?(?:9[0-9]{4}|[2-5][0-9]{3})[\s-]?[0-9]{4}$/,
                      message: 'Telefone inválido'
                    }
                  })}
                />
                <MensagemErro error={errors.telefone} />
              </div>
            </div>
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
              <div className='input-container'>
                <label htmlFor='idEmailConfirmado'>
                  Confirmar email{' '}
                  <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  className={
                    errors.emailConfirmado
                      ? 'outline-1 outline-red-500'
                      : 'outline-none'
                  }
                  type='email'
                  id='idEmailConfirmado'
                  {...register('emailConfirmado', {
                    required: 'Campo obrigatório',
                    validate: value => {
                      return value === watchEmail || 'Emails não estão iguais'
                    }
                  })}
                />
                <MensagemErro error={errors.emailConfirmado} />
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
              <div className='input-container'>
                <label htmlFor='idSenhaConfirmada'>
                  Confirmar Senha{' '}
                  <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  className={
                    errors.senhaConfirmada
                      ? 'outline-1 outline-red-500'
                      : 'outline-none'
                  }
                  type={mostrar ? 'text' : 'password'}
                  id='idSenhaConfirmada'
                  {...register('senhaConfirmada', {
                    required: 'Campo obrigatório',
                    validate: value => {
                      return value === watchSenha || 'Senhas não estão iguais'
                    }
                  })}
                />
                <MensagemErro error={errors.senhaConfirmada} />
              </div>
            </div>
            <div className='gap-2 pl-[1vw] my-[2vh]'>
              <div>
                <input
                  type='checkbox'
                  id='idAcompanhante'
                  {...register('acompanhante')}
                />
                <label htmlFor='idAcompanhante'>
                  Tem um cuidador ou acompanhante?
                </label>
              </div>
              <MensagemErro error={errors.acompanhante} />
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

      <ModalConfirmar
        operacao={() => setServerError(false)}
        mensagem='Erro ao acessar servidor'
        descricao='Aguarde um pouco e tente novamente.'
        confirmacao={serverError}
      />
    </main>
  )
}

export default Cadastro
