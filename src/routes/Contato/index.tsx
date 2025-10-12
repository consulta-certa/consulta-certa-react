import Linha from '../../components/Linha/Linha'
import Titulo from '../../components/Titulo/Titulo'
import { MdMail } from 'react-icons/md'
import { FaMapLocationDot, FaSquarePhone } from 'react-icons/fa6'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import type { tipoContato } from '../../types/tipoContato'
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type { tipoMensagem } from '../../types/tipoMensagem'
import MensagemErro from '../../components/MensagemErro/MensagemErro'
import { useAuth } from '../../context/AuthContext'
const URL_CONTATOS = import.meta.env.VITE_API_BASE_CONTATOS
// const URL_API_EMAIL = import.meta.env.VITE_API_ENVIAR_EMAI

function Contato () {
  const { paciente } = useAuth()
  const [enviado, setEnviado] = useState(false)
  const [contatos, setContatos] = useState<tipoContato[]>([])
  const [indiceAtual, setIndiceAtual] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<tipoMensagem>()

  useEffect(() => {
    const buscarContatos = async () => {
      try {
        const response = await fetch(`${URL_CONTATOS}`)
        const dados = await response.json()
        setContatos(dados)
      } catch {
        console.error('Erro ao buscar contatos')
      }
    }

    buscarContatos()
  }, [])

  const onSubmit: SubmitHandler<tipoMensagem> = async data => {
    /*
    // Simulação para envio de emails ao HC
    try {
      await fetch(URL_API_EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    } catch {
      console.error('Erro ao enviar email')
    }
    */
    console.log(data)
    setEnviado(true)
  }

  return (
    <main>
      <Titulo titulo='Contato' />
      <div className='flex max-md:flex-col gap-[5vw] max-md:gap-[2vh] justify-center items-center w-full'>
        <section className='form'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <div className='input-container'>
                <label htmlFor='idNome'>
                  Nome <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
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
                  value={watch('nome') ?? ""}
                />
                <MensagemErro error={errors.nome} />
              </div>
              <div className='input-container'>
                <label htmlFor='idEmail'>
                  Email <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  type='email'
                  id='idEmail'
                  {...register('email', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Email invalido'
                    }
                  })}
                  value={watch('email') ?? ""}
                />
                <MensagemErro error={errors.email} />
              </div>
              <div className='input-container'>
                <label htmlFor='idAssunto'>
                  Assunto <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  type='text'
                  id='idAssunto'
                  {...register('assunto', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[^\s][\p{L}\p{N}\p{P}\s]*[^\s]$/u,
                      message: 'Formatação inválida'
                    },
                    minLength: {
                      value: 10,
                      message: 'Precisa de pelo menos 10 caracteres'
                    }
                  })}
                />
                <MensagemErro error={errors.assunto} />
              </div>
              <div className='input-container'>
                <label htmlFor='idConteudo'>
                  Do que precisa?{' '}
                  <span className='text-red-500 font-bold'>*</span>
                </label>
                <textarea
                  id='idConteudo'
                  rows={2}
                  {...register('conteudo', {
                    required: 'Campo obrigatório',
                    minLength: {
                      value: 30,
                      message: 'Precisa de pelo menos 30 caracteres'
                    }
                  })}
                ></textarea>
                <MensagemErro error={errors.conteudo} />
              </div>
              <div className='input-container'>
                <label htmlFor='idDestinatario'>
                  Para quem enviar?{' '}
                  <span className='text-red-500 font-bold'>*</span>
                </label>
                <select
                  id='idDestinatario'
                  defaultValue=''
                  {...register('destinatario', {
                    required: 'Campo obrigatório'
                  })}
                >
                  <option value='' disabled>
                    Selecione uma opção
                  </option>
                  {contatos.map((contato, index) => (
                    <option key={index} value={contato.email}>
                      {contato.nome}
                    </option>
                  ))}
                </select>
                <MensagemErro error={errors.destinatario} />
              </div>
            </fieldset>
            <div className='flex gap-2'>
              <button type='submit'>Enviar</button>
              <button
                type='reset'
                onClick={() => {
                  setValue('nome', paciente?.nome ?? 'Nome')
                  setValue('email', paciente?.email ?? 'e@mail.com')
                }}
              >
                Usar dados do login
              </button>
            </div>
          </form>
        </section>
        <section className='w-[50%] max-lg:w-[100%] min-w-[280px]'>
          <div className='mb-[2vh]'>
            <h2 className='titulo-2'>Prefere outro jeito?</h2>
            <Linha />
            <p>Veja mais formas de falar com o HC.</p>
          </div>

          {contatos[indiceAtual] && (
            <ul className='flex flex-col gap-[4vh] bg-cc-cinza p-4 rounded-2xl'>
              <li className='flex gap-2 items-center justify-between'>
                <h3 className='text-xl font-bold -mb-[2vh]'>
                  {contatos[indiceAtual].nome}
                </h3>
                <ul className='flex items-center gap-2'>
                  <li>
                    <button
                      onClick={() =>
                        setIndiceAtual(prev => (prev + 1) % contatos.length)
                      }
                      className={`flex items-center rounded-4xl gap-2 p-2 sm:py-1 text-white text-sm
                        ${
                          contatos.length > 1
                            ? 'bg-cc-azul hover:scale-105 hover:bg-cc-azul-escuro'
                            : 'bg-cc-cinza-escuro hover:scale-100 hover:bg-cc-cinza-escuro'
                        }
                      `}
                    >
                      <FaArrowAltCircleLeft />
                      <p className='inline max-sm:hidden'>Voltar</p>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        setIndiceAtual(
                          prev => (prev - 1 + contatos.length) % contatos.length
                        )
                      }
                      className={`flex items-center rounded-4xl gap-2 p-2 sm:py-1 text-white text-sm
                        ${
                          contatos.length > 1
                            ? 'bg-cc-azul hover:scale-105 hover:bg-cc-azul-escuro'
                            : 'bg-cc-cinza-escuro hover:scale-100 hover:bg-cc-cinza-escuro'
                        }`}
                    >
                      <FaArrowAltCircleRight />
                      <p className='inline max-sm:hidden'>Avançar</p>
                    </button>
                  </li>
                </ul>
              </li>
              <li>
                <div className='flex gap-2 items-center'>
                  <MdMail />
                  <h3 className='text-lg font-semibold'>Email</h3>
                </div>
                <p>{contatos[indiceAtual].email}</p>
              </li>
              <li>
                <div className='flex gap-2 items-center'>
                  <FaSquarePhone />
                  <h3 className='text-lg font-semibold'>Telefone</h3>
                </div>
                <p>{contatos[indiceAtual].telefone}</p>
              </li>
              <li>
                <div className='flex gap-2 items-center'>
                  <FaMapLocationDot />
                  <h3 className='text-lg font-semibold'>Endereço</h3>
                </div>
                <p>
                  {`Rua ${contatos[indiceAtual].rua}, ${
                    contatos[indiceAtual].numero
                  } • ${contatos[indiceAtual].bairro}. ${
                    contatos[indiceAtual].cidade
                  } - SP. ${contatos[indiceAtual].cep.replace(
                    /^(\d{5})(\d{3})$/,
                    '$1-$2'
                  )}`}
                </p>
              </li>
            </ul>
          )}
        </section>
      </div>

      <ModalConfirmar
        operacao={() => {
          setEnviado(false)
          reset()
        }}
        mensagem='Dúvida enviada ao HC!'
        descricao='Acompanhe seu email para continuar a conversa por lá.'
        confirmacao={enviado}
      />
    </main>
  )
}

export default Contato
