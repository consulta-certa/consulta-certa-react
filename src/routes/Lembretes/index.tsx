import Titulo from '../../components/Titulo/Titulo'
import ItemLembrete from '../../components/ItemLembrete/ItemLembrete'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar'
import { formatarData } from '../../utils/formatarData'
import type { tipoConsulta } from '../../types/tipoConsulta'
import { useForm, type SubmitHandler } from 'react-hook-form'
import MensagemErro from '../../components/MensagemErro/MensagemErro'

const URL_CONSULTAS = import.meta.env.VITE_API_BASE_CONSULTAS
const URL_API_LEMBRETES = import.meta.env.VITE_API_ENVIAR_LEMBRETES

function Lembretes () {
  const navigate = useNavigate()
  const { paciente } = useAuth()
  const [enviado, setEnviado] = useState(false)
  const [listaLembretes, setListaLembretes] = useState<tipoConsulta[]>([])
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<tipoConsulta>()

  useEffect(() => {
    const buscarConsultas = async () => {
      try {
        const response = await fetch(
          `${URL_CONSULTAS}?id_paciente=${paciente?.id}`
        )
        const dados = await response.json()
        console.log(dados)
        setListaLembretes(dados)
      } catch {
        console.error('Erro ao carregar seus lembretes.')
      }
    }

    buscarConsultas()
  }, [navigate, paciente])

  const onSubmit: SubmitHandler<tipoConsulta> = async data => {
    setEnviado(false)

    try {
      const consultaPayload = {
        // id: data.id,
        especialidade: data.especialidade,
        data_consulta: formatarData(data.data_consulta),
        status: 'A',
        id_paciente: paciente?.id
      }

      const consultaRes = await fetch(`${URL_CONSULTAS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultaPayload)
      })

      if (!consultaRes.ok) throw new Error('Erro ao registrar consulta.')

      const jsonPayload = {
        // id: data.id,
        nome: paciente?.nome,
        email: paciente?.email,
        telefone: paciente?.telefone,
        especialidade: data.especialidade,
        data_consulta: formatarData(data.data_consulta),
        id_paciente: paciente?.id
      }

      console.log(jsonPayload)

      fetch(`${URL_API_LEMBRETES}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonPayload)
      })

      setEnviado(true)
    } catch {
      console.error('Erro ao acessar servidor')
    }
  }

  return (
    <main>
      <Titulo titulo='Lembrete' />
      <div className='flex max-md:flex-col max-md:gap-[4vh] gap-[2vw] justify-center items-center w-full'>
        <section className='w-[50%] max-md:w-full'>
          <h2 className='titulo-2'>Seus lembretes</h2>
          <ul className='flex flex-col-reverse gap-[2vh] w-full mt-[4vh] h-[40vh] pr-[2vw] overflow-y-scroll'>
            {listaLembretes.length == 0 ? (
              <li>Você ainda não registrou nenhum lembrete.</li>
            ) : (
              listaLembretes.map(lembrete => (
                <ItemLembrete
                  key={lembrete.id}
                  especialidade={lembrete.especialidade}
                  horario={lembrete.data_consulta
                    .replace(':', 'h')
                    .replace(' ', ' às ')}
                  status={lembrete.status}
                />
              ))
            )}
          </ul>
        </section>
        <section className='w-[32%] max-md:w-full'>
          <h2 className='titulo-2'>Criar novo lembrete?</h2>
          <section className='form'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                <div className='input-container'>
                  <label htmlFor='idConsulta'>
                    Qual é sua teleconsulta?{' '}
                    <span className='text-red-500 font-bold'>*</span>
                  </label>
                  <select
                    id='idConsulta'
                    defaultValue=''
                    {...register('especialidade', {
                      required: 'Campo obrigatório'
                    })}
                  >
                    <option value='' disabled>
                      Selecione uma opção
                    </option>
                    <option value='fisioterapeuta'>Fisioterapeuta</option>
                    <option value='cardiologista'>Cardiologista</option>
                    <option value='neurologista'>Neurologista</option>
                    <option value='optometrista'>Optometrista</option>
                    <option value='ortopedista'>Ortopedista</option>
                  </select>
                  <MensagemErro error={errors.especialidade} />
                </div>
                <div className='input-container'>
                  <label htmlFor='idDataConsulta'>
                    Quando será sua teleconsulta?{' '}
                    <span className='text-red-500 font-bold'>*</span>
                  </label>
                  <input
                    type='datetime-local'
                    id='idDataConsulta'
                    {...register('data_consulta', {
                      required: 'Campo obrigatório',
                      validate: valor => {
                        const dataMinima = new Date()
                        const data = new Date(valor)
                        const dataMaxima = new Date()
                        dataMaxima.setMonth(dataMinima.getMonth() + 1)

                        if (data < dataMinima)
                          return 'Sua consulta já aconteceu'
                        if (data >= dataMaxima)
                          return 'Não são marcadas consultas tão afrente'
                        return true
                      }
                    })}
                  />
                  <MensagemErro error={errors.data_consulta} />
                </div>
              </fieldset>
              <button type='submit'>Registrar</button>
            </form>
          </section>
        </section>
      </div>

      <ModalConfirmar
        operacao={() => navigate('/')}
        mensagem='Lembrete Registrado! Ele será enviado por email'
        descricao='Clique em OK para voltar à página inicial.'
        confirmacao={enviado}
      />
    </main>
  )
}

export default Lembretes
