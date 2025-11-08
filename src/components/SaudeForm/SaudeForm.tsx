import { useForm, type SubmitHandler } from 'react-hook-form'
import MensagemErro from '../MensagemErro/MensagemErro'
import { useEffect, useState } from 'react'
import type { tipoSaude } from '../../types/tipoSaude'
import { IoMdClose } from 'react-icons/io'
import ModalConfirmar from '../ModalConfirmar/ModalConfirmar'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { agora } from '../../utils/gerarData'
const URL_API_DADOS_SAUDE = import.meta.env.VITE_API_BASE_PREVER_DADOS_SAUDE
const URL_PACIENTES = import.meta.env.VITE_API_BASE_PACIENTES
const URL_DADOS_SAUDE = import.meta.env.VITE_API_BASE_DADOS_SAUDE

function SaudeForm () {
  const [aberto, setAberto] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [preenchido, setPreenchido] = useState<boolean | null>(null)
  const [semConsulta, setSemConsulta] = useState<boolean | null>(null)
  const [serverError, setServerError] = useState(false)
  const [selected, setSelected] = useState(0)
  const [deficiencia, setDeficiencia] = useState(false)
  const [loading, setLoading] = useState(false)

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
  }, [])

  const onSubmit: SubmitHandler<tipoSaude> = async data => {
    try {
      setLoading(true)
      const pppp = {
        idPaciente: paciente?.sub,
        idade: data.idade,
        sexo: data.sexo,
        temHipertensao: data.temHipertensao ? 's' : 'n',
        temDiabetes: data.temDiabetes ? 's' : 'n',
        consomeAlcool: data.consomeAlcool ? 's' : 'n',
        possuiDeficiencia: data.possuiDeficiencia ? 's' : 'n',
        tipoDeficiencia: data.tipoDeficiencia ? data.tipoDeficiencia : null,
        dataPreenchimento: agora
      }

      const response = await fetch(URL_DADOS_SAUDE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pppp)
      })

      const resp = await fetch(URL_API_DADOS_SAUDE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_paciente: paciente?.sub
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
        setPreenchido(true)
      } else if (response.ok) {
        const idDadosSaude: { id: string } = await response.json()
        const id = idDadosSaude && idDadosSaude.id

        await fetch(`${URL_DADOS_SAUDE}/${id}`, {
          method: 'DELETE'
        })

        if (resp.status == 500) {
          throw new Error(resp.statusText)
        }

        if (resp.status == 404) {
          setSemConsulta(true)
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao cadastrar paciente.', error)
        setServerError(true)
      }
    } finally {
      setLoading(false)
      fechar()
    }
  }

  return (
    <aside className='fixed'>
      {serverError && (
        <ModalConfirmar
          operacao={() => setServerError(false)}
          mensagem='Erro ao acessar servidor'
          descricao='Aguarde um pouco e tente novamente.'
          confirmacao={serverError}
        />
      )}

      {enviado && preenchido && (
        <ModalConfirmar
          operacao={() => setPreenchido(false)}
          mensagem='Cadastro concluido!'
          descricao='Isso será usado para te ajudar ainda mais.'
          confirmacao={preenchido}
        />
      )}

      {semConsulta && (
        <ModalConfirmar
          operacao={() => navigate('/lembretes')}
          mensagem='Sem consulta ativa cadastrada!'
          descricao='Para enviar suas informações de saúde, vá até a página de lembretes e registre um novo lembrete.'
          confirmacao={semConsulta}
        />
      )}

      {!enviado && (
        <button
          className={`flex items-center gap-2 p-2 bg-cc-azul rounded-xl text-white fixed right-[2vw] bottom-[18vh] shadow-md`}
          onClick={() => {
            if (!paciente) {
              navigate('/entrar')
            }
            setAberto(true)
          }}
        >
          {paciente ? 'Termine seu cadastro!' : 'Crie um perfil personalizado'}
        </button>
      )}

      <section
        className={`form fixed shadow-2xl max-sm:-mt-[10vh] transition-transform duration-300 ease-in ${
          aberto && !enviado && !preenchido
            ? 'translate-x-0 right-[4vw]'
            : 'translate-x-[100vw]'
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
                  <div>
                    <label
                      htmlFor='idSexoF'
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
                      Feminino
                    </label>
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
                  <div>
                    <label
                      htmlFor='idSexoM'
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
                      Masculino
                    </label>
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
          <button type='submit'>
            {loading ? 'Carregando...' : 'Concluir'}
          </button>
        </form>
      </section>
    </aside>
  )
}

export default SaudeForm
