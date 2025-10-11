import type React from 'react'
import Titulo from '../../components/Titulo/Titulo'
import ItemLembrete from '../../components/ItemLembrete/ItemLembrete'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar'
import { formatarData } from '../../utils/formatarData'
import type { tipoConsulta } from '../../types/tipoConsulta'
const URL_CONSULTAS = import.meta.env.VITE_API_BASE_CONSULTAS;
const URL_API_LEMBRETES = import.meta.env.VITE_API_ENVIAR_LEMBRETES;

function Lembretes() {
  const navigate = useNavigate()
  const { paciente } = useAuth()
  const [listaLembretes, setListaLembretes] = useState<tipoConsulta[]>([])

  useEffect(() => {
    if (!paciente) {
      navigate('/cadastrar', { replace: true })
      return
    }

    const buscarConsultas = async () => {
      try {
        const response = await fetch(`http://localhost:3001/consultas?id=${paciente.id}`)
        const dados = await response.json()
        console.log(dados)
        setListaLembretes(dados)
      } catch {
        setErro('Erro ao carregar seus lembretes.')
      }
    }

    buscarConsultas()
  }, [navigate, paciente])

  const [dataSelecionada, setDataSelecionada] = useState('')
  const [especialidade, setEspecialidade] = useState('')
  const [erro, setErro] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro('')
    setEnviado(false)

    const data = new Date(dataSelecionada)
    const hoje = new Date()
    const limite = new Date()
    limite.setDate(hoje.getDate() - 14)

    if (data < limite) {
      setErro('Data inválida. Só são feitos lembretes até 14 dias.')
      return
    }

    try {
      const consultaPayload = {
        especialidade,
        data_consulta: formatarData(dataSelecionada),
        status: "A",
        id: paciente?.id
      }

      const consultaRes = await fetch(`${URL_CONSULTAS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultaPayload)
      })

      if (!consultaRes.ok) throw new Error('Erro ao registrar consulta.')

      const consultaCriada = await consultaRes.json()

      const jsonPayload = {
        nome: paciente?.nome,
        email: paciente?.email,
        telefone: paciente?.telefone,
        especialidade: consultaCriada.especialidade,
        data_consulta: consultaCriada.data_consulta,
        id: paciente?.id
      }

      console.log(jsonPayload)

      const lembreteRes = await fetch(`${URL_API_LEMBRETES}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonPayload)
      })

      if (!lembreteRes.ok) throw new Error('Erro ao enviar lembrete.')

      setEnviado(true)
    } catch {
      setErro('Erro ao processar o lembrete. Tente novamente.')
    }
  }

  return (
    <main>
      <Titulo titulo='Lembrete' />
      <div className='flex max-md:flex-col max-md:gap-[4vh] gap-[2vw] justify-center items-center w-full'>
        <section className='w-[50%] max-md:w-full'>
          <h2 className='titulo-2'>Seus lembretes</h2>
          <ul className='flex flex-col gap-[2vh] w-full mt-[4vh] h-[40vh] pr-[2vw] overflow-y-scroll'>
            {
              listaLembretes.length == 0 ? <li>Você ainda não registrou nenhum lembrete.</li> :
                listaLembretes.map((lembrete) => (
                  <ItemLembrete key={lembrete.id} especialidade={lembrete.especialidade} horario={lembrete.data_consulta.replace(':', 'h').replace(' ', ' às ')} canal='email' />
                ))
            }
          </ul>
        </section>
        <section className='w-[32%] max-md:w-full'>
          <h2 className='titulo-2'>Criar novo lembrete?</h2>
          <section className='form'>
            {erro && <p className='text-red-400'>{erro}</p>}
            <form onSubmit={handleSubmit}>
              <fieldset>
                <div className='input-container'>
                  <label htmlFor='idConsulta'>
                    Qual é sua teleconsulta? <span className='text-red-500 font-bold'>*</span>
                  </label>
                  <select
                    name='consulta'
                    id='idConsulta'
                    value={especialidade}
                    onChange={e => setEspecialidade(e.target.value)}
                    required
                  >
                    <option value='' disabled>Selecione uma opção</option>
                    <option value='fisioterapeuta'>Fisioterapeuta</option>
                    <option value='cardiologista'>Cardiologista</option>
                    <option value='neurologista'>Neurologista</option>
                    <option value='optometrista'>Optometrista</option>
                    <option value='ortopedista'>Ortopedista</option>
                  </select>
                </div>
                <div className='input-container'>
                  <label htmlFor='idDataConsulta'>
                    Quando será sua teleconsulta? <span className='text-red-500 font-bold'>*</span>
                  </label>
                  <input
                    type='datetime-local'
                    id='idDataConsulta'
                    name='dataConsulta'
                    value={dataSelecionada}
                    onChange={e => setDataSelecionada(e.target.value)}
                    required
                  />
                </div>
              </fieldset>
              <button type='submit'>Registrar</button>
            </form>
          </section>
        </section>
      </div>

      <ModalConfirmar operacao={() => navigate('/')} mensagem='Lembrete Registrado! Ele será enviado por email' descricao='Clique em OK para voltar à página inicial.' confirmacao={enviado} />
    </main>
  )
}

export default Lembretes