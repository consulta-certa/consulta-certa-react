import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Titulo from '../../components/Titulo/Titulo'
import Linha from '../../components/Linha/Linha'
import { BsFillPersonVcardFill } from 'react-icons/bs'
import { FaSquarePhone } from 'react-icons/fa6'
import { IoMdClose, IoMdExit, IoMdMail } from 'react-icons/io'
import { RiParentFill } from 'react-icons/ri'
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type { tipoAcompanhante } from '../../types/tipoAcompanhante'
import MensagemErro from '../../components/MensagemErro/MensagemErro'
const URL_ACOMPANHANTES = import.meta.env.VITE_API_BASE_ACOMPANHANTES
const URL_PACIENTES = import.meta.env.VITE_API_BASE_PACIENTES

function Perfil () {
  const { paciente, logout } = useAuth()
  const [aberto, setAberto] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [serverError, setServerError] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    reset
  } = useForm<tipoAcompanhante>()

  const watchEmail = watch('email')

  const fechar = () => {
    reset()
    setAberto(false)
  }

  const onSubmit: SubmitHandler<tipoAcompanhante> = async data => {
    try {
      setLoading(true)
      const responseAcompanhante = await fetch(URL_ACOMPANHANTES)
      const acompanhantes: tipoAcompanhante[] =
        await responseAcompanhante.json()

      const emailExistente = acompanhantes.some(
        (a: tipoAcompanhante) => a.email === data.email
      )

      const emailIndevido = paciente?.email === data.email

      const telefoneExistente = acompanhantes.some(
        (a: tipoAcompanhante) => a.telefone == data.telefone
      )

      const telfoneIndevido = paciente?.telefone === data.telefone

      if (emailExistente) {
        setError('email', {
          type: 'manual',
          message: 'Acompanhante já cadastrado com esse email'
        })
        return
      }

      if (emailIndevido) {
        setError('email', {
          type: 'manual',
          message: 'Você já foi cadastrado com esse email'
        })
        return
      }

      if (telefoneExistente) {
        setError('telefone', {
          type: 'manual',
          message: 'Acompanhante já cadastrado com esse telefone'
        })
        return
      }

      if (telfoneIndevido) {
        setError('telefone', {
          type: 'manual',
          message: 'Você já foi cadastrado com esse telefone'
        })
        return
      }

      const response = await fetch(`${URL_ACOMPANHANTES}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.nome,
          telefone: data.telefone,
          email: data.email,
          parentesco: data.parentesco,
          idPaciente: paciente?.sub
        })
      })

      if (response.ok) {
        await fetch(`${URL_PACIENTES}/${paciente && paciente.sub}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: paciente?.nome,
            telefone: paciente?.telefone,
            email: paciente?.email,
            acompanhantes: 's',
            dadosSaude: paciente?.dadosSaude
          })
        })

        if (paciente) paciente.acompanhantes = 's'

        fechar()
        setEnviado(true)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao cadastrar acompanhante.', error)
        setServerError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <Titulo titulo='Perfil' />
      <section className='flex max-md:flex-col w-full min-h-[50vh] justify-center items-center gap-[2vw] max-md:gap-[2vh]'>
        <div className='w-[44%] max-md:w-[80%] max-sm:w-[100%] min-w-[240px]'>
          <h2 className='titulo-2'>Suas informações de perfil</h2>
          <Linha />
          <p>Deseja registrar seu acompanhante? acesse o botão abaixo</p>
          <button
            className='botao max-md:mx-auto'
            onClick={() => setAberto(true)}
          >
            <RiParentFill />
            <p>Registrar</p>
          </button>
        </div>
        <div className='p-4 bg-cc-cinza rounded-2xl w-[44%] max-md:w-[80%] max-sm:w-[100%] min-w-[240px]'>
          <ul className='flex flex-col gap-[2vh] w-full'>
            <li className='flex gap-2 items-center p-2 rounded-lg bg-white shadow-md'>
              <BsFillPersonVcardFill className='text-lg' />
              <span className='text-lg font-bold'>Nome:</span>{' '}
              {paciente && paciente.nome}
            </li>
            <li className='flex gap-2 items-center p-2 rounded-lg bg-white shadow-md'>
              <IoMdMail className='text-lg' />
              <span className='text-lg font-bold'>Email:</span>{' '}
              {paciente && paciente.email}
            </li>
            <li className='flex gap-2 items-center p-2 rounded-lg bg-white shadow-md'>
              <FaSquarePhone className='text-lg' />
              <span className='text-lg font-bold'>Telefone:</span>{' '}
              {paciente &&
                paciente.telefone.replace(
                  /^(\d{2})(\d{5})(\d{4})$/,
                  '($1) $2-$3'
                )}
            </li>
          </ul>
          <button className='botao' onClick={() => logout()}>
            <IoMdExit className='-ml-4' />
            <p>Sair</p>
          </button>
        </div>
      </section>

      {enviado && (
        <ModalConfirmar
          operacao={() => setEnviado(false)}
          mensagem='Acompanhante Registrado!'
          descricao='Agora o seu acompanhante também irá receber as informações de lembrete.'
          confirmacao={enviado}
        />
      )}

      <section
        className={`form fixed shadow-2xl max-sm:-mt-[10vh] transition-transform duration-300 ease-in ${
          aberto ? 'translate-y-0' : 'translate-y-[150vh]'
        }`}
      >
        <div
          className='w-fit rounded-full p-2 bg-cc-azul text-white text-xl absolute right-2 top-2 hover:scale-105 hover:bg-cc-azul-escuro cursor-pointer transition-all duration-300 ease-in'
          onClick={() => fechar()}
        >
          <IoMdClose />
        </div>
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
            <div className='input-container'>
              <label htmlFor='idParentesco'>
                Parentesco <span className='text-red-500 font-bold'>*</span>
              </label>
              <select
                id='idParentesco'
                {...register('parentesco', { required: 'Campo obrigatório' })}
                defaultValue=''
              >
                <option value='' disabled>
                  Selecione uma opção
                </option>
                <option value='filho/a'>Filho/a</option>
                <option value='cuidador/a'>Cuidador/a</option>
                <option value='neto/a'>Neto/a</option>
                <option value='amigo/a'>Amigo/a</option>
                <option value='conjuge'>
                  Cônjuge (marido/esposa, namorado/a )
                </option>
                <option value='segundo_grau'>
                  Parentes de 2º Grau (pesquisar)
                </option>
                <option value='terceiro_grau'>
                  Parentes de 2º Grau (pesquisar)
                </option>
                <option value='outro'>Outro</option>
              </select>
              <MensagemErro error={errors.parentesco} />
            </div>
          </fieldset>
          <button type='submit'>
            {loading ? 'Carregando...' : 'Registrar'}
          </button>
        </form>
      </section>

      <ModalConfirmar
        operacao={() => setServerError(false)}
        mensagem='Erro ao acessar servidor'
        descricao='Aguarde um pouco e tente novamente.'
        confirmacao={serverError}
      />
    </main>
  )
}

export default Perfil
