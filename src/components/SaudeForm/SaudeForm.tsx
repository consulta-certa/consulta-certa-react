import { useForm, type SubmitHandler } from 'react-hook-form'
import MensagemErro from '../MensagemErro/MensagemErro'
import { useEffect, useState } from 'react'
import type { tipoSaude } from '../../types/tipoSaude'
import { IoMdClose } from 'react-icons/io'
import ModalConfirmar from '../ModalConfirmar/ModalConfirmar'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { tipoConsulta } from '../../types/tipoConsulta'
const URL_API_DADOS_SAUDE = import.meta.env.VITE_API_BASE_DADOS_SAUDE
const URL_PACIENTES = import.meta.env.VITE_API_BASE_PACIENTES
const URL_CONSULTAS = import.meta.env.VITE_API_BASE_CONSULTAS

function SaudeForm () {
  const [aberto, setAberto] = useState<boolean>(false)
  const [enviado, setEnviado] = useState<boolean>(false)
  const [preenchido, setPreenchido] = useState<boolean | null>(null)
  const [serverError, setServerError] = useState<boolean>(false)
  const [selected, setSelected] = useState(0)
  const [deficiencia, setDeficiencia] = useState<boolean>(false)
  const [semConsulta, setSemConsulta] = useState<boolean>(false)

  const navigate = useNavigate()
  const { paciente } = useAuth()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<tipoSaude>()

  const deficiencias: string[] = [
    'surdez',
    'baixa visão',
    'mobilidade reduzida'
  ]

  const fechar = () => {
    reset()
    setSelected(0)
    setAberto(false)
  }

  useEffect(() => {
    setEnviado(paciente?.dadosSaude == 's')
  }, [enviado, preenchido, semConsulta, aberto])

  const onSubmit: SubmitHandler<tipoSaude> = async data => {
    try {
      const response = await fetch(URL_CONSULTAS)
      const consultas: tipoConsulta[] = await response.json()
      const consulta = consultas.find(
        (c: tipoConsulta) => c.idPaciente === paciente?.sub
      )

      if (consulta) {
        const resp = await fetch(URL_API_DADOS_SAUDE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idade: data.idade,
            genero: data.sexo,
            tem_hipertensao: data.temHipertensao ? 's' : 'n',
            tem_diabetes: data.temDiabetes ? 's' : 'n',
            consome_alcool: data.consomeAlcool ? 's' : 'n',
            possui_deficiencia: data.possuiDeficiencia ? 's' : 'n',
            tipo_deficiencia: data.tipoDeficiencia
              ? data.tipoDeficiencia
              : null,
            data_agendamento: new Date().toISOString().slice(0, 19),
            id_paciente: paciente?.sub,
            id_consulta: consulta?.id,
            data_consulta: consulta?.dataConsulta
          })
        })

        if (resp.ok) {
          await fetch(`${URL_PACIENTES}/${paciente && paciente.sub}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nome: paciente?.nome,
              telefone: paciente?.telefone,
              email: paciente?.email,
              acompanhantes: paciente?.acompanhantes,
              dadosSaude: 's'
            })
          })

          if (paciente) paciente.dadosSaude = 's'
        }
      } else {
        setSemConsulta(true)
        fechar()
      }
      
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao cadastrar paciente.', error)
        serverError ? setServerError(true) : setServerError(true)
      }
    }
  }

  if (!aberto && !enviado && !semConsulta) {
    return (
      <button
        className='p-4 bg-cc-azul rounded-xl text-lg text-white fixed right-8'
        onClick={() => {
          if (!paciente) {
            navigate('/entrar')
          }
          setAberto(true)
        }}
      >
        {paciente ? 'Termine seu cadastro!' : 'Crie um perfil personalizado'}
      </button>
    )
  }

  if (!enviado && !semConsulta) {
    return (
      <article
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
                <label htmlFor='idIdade'>
                  Idade <span className='text-red-500 font-bold'>*</span>
                </label>
                <input
                  className={
                    errors.idade ? 'outline-1 outline-red-500' : 'outline-none'
                  }
                  type='tel'
                  id='idIdade'
                  {...register('idade', {
                    required: 'Campo obrigatório',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Idade mínima é 0'
                    },
                    max: {
                      value: 120,
                      message: 'Idade máxima é 120'
                    },
                    validate: value => {
                      if (
                        value === undefined ||
                        value === null ||
                        isNaN(value)
                      ) {
                        return 'Apenas números'
                      }

                      return Number.isInteger(value) || 'Apenas números'
                    }
                  })}
                />
                <MensagemErro error={errors.idade} />
              </div>
              <div className='input-container'>
                <label htmlFor='idSexo'>
                  Sexo <span className='text-red-500 font-bold'>*</span>
                </label>
                <div className='flex gap-2 items-center'>
                  <div
                    className={`p-2 rounded transition duration-200 ease-in ${
                      selected == 1
                        ? 'bg-cc-azul text-white'
                        : 'bg-cc-cinza-escuro text-cc-preto'
                    } ${
                      errors.sexo
                        ? 'outline-1 outline-red-500 bg-red-200'
                        : 'outline-none bg-none'
                    }`}
                  >
                    <label htmlFor='idSexoF'>Feminino</label>
                    <input
                      className='sr-only peer'
                      type='radio'
                      id='idSexoF'
                      value='f'
                      {...register('sexo', {
                        required: 'Campo obrigatório'
                      })}
                      onClick={() => setSelected(1)}
                    />
                  </div>
                  <div
                    className={`p-2 rounded transition duration-200 ease-in ${
                      selected == 2
                        ? 'bg-cc-azul text-white'
                        : 'bg-cc-cinza-escuro text-cc-preto'
                    } ${
                      errors.sexo
                        ? 'outline-1 outline-red-500 bg-red-200'
                        : 'outline-none bg-none'
                    }`}
                  >
                    <label htmlFor='idSexoM'>Masculino</label>
                    <input
                      className='sr-only peer'
                      type='radio'
                      id='idSexoM'
                      value='m'
                      {...register('sexo', {
                        required: 'Campo obrigatório'
                      })}
                      onClick={() => setSelected(2)}
                    />
                  </div>
                </div>
                <MensagemErro error={errors.sexo} />
              </div>
            </div>
            <div>
              <div className='input-container'>
                <label>Possui alguma condição especial?</label>
                <ul className='flex flex-col gap-2 [&_label]:pl-2'>
                  <li>
                    <input
                      id='idTemHipertensao'
                      type='checkbox'
                      {...register('temHipertensao')}
                    />
                    <label htmlFor='idTemHipertensao'>Hipertensão</label>
                  </li>
                  <li>
                    <input
                      id='idTemDiabetes'
                      type='checkbox'
                      {...register('temDiabetes')}
                    />
                    <label htmlFor='idTemDiabetes'>Diabetes</label>
                  </li>
                  <li>
                    <input
                      id='idConsomeAlcool'
                      type='checkbox'
                      {...register('consomeAlcool')}
                    />
                    <label htmlFor='idConsomeAlcool'>Consome álcool</label>
                  </li>
                  <li>
                    <input
                      id='idPossuiDeficiencia'
                      type='checkbox'
                      {...register('possuiDeficiencia')}
                      onChange={() => {
                        deficiencia
                          ? setDeficiencia(false)
                          : setDeficiencia(true)
                      }}
                    />
                    <label htmlFor='idPossuiDeficiencia'>Deficiência</label>
                  </li>
                </ul>
              </div>
              {deficiencia ? (
                <div className='input-container'>
                  <label htmlFor='idTipoDeficiencia'>
                    Qual seu tipo de deficiencia?{' '}
                    <span className='text-red-500 font-bold'>*</span>
                  </label>
                  <select
                    id='idTipoDeficiencia'
                    defaultValue=''
                    {...register('tipoDeficiencia', {
                      required: 'Campo obrigatório'
                    })}
                  >
                    <option value='' disabled>
                      Selecione uma opção
                    </option>
                    {deficiencias.map((deficiencia, index) => (
                      <option key={index} value={deficiencia}>
                        {deficiencia}
                      </option>
                    ))}
                  </select>
                  <MensagemErro error={errors.tipoDeficiencia} />
                </div>
              ) : (
                ''
              )}
            </div>
          </fieldset>
          <button type='submit'>Concluir</button>
        </form>
      </article>
    )
  }

  if (enviado && preenchido && !semConsulta) {
    return (
      <ModalConfirmar
        operacao={() => setPreenchido(false)}
        mensagem='Cadastro concluido!'
        descricao='Isso será usado para te ajudar ainda mais.'
        confirmacao={preenchido}
      />
    )
  }

  if (semConsulta) {
    return (
      <ModalConfirmar
        operacao={() => setSemConsulta(false)}
        mensagem='Cadastro concluido!'
        descricao='Isso será usado para te ajudar ainda mais.'
        confirmacao={semConsulta}
      />
    )
  }
}

export default SaudeForm
