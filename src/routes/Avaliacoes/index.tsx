import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Titulo from '../../components/Titulo/Titulo'
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar'
import { formatarData } from '../../utils/formatarData'
const URL_AVALIACOES = import.meta.env.VITE_API_BASE_AVALIACOES;

function Avaliacoes () {
  const [enviado, setEnviado] = useState(false)
  const [dataSelecionada, setDataSelecionada] = useState('')
  const [especialidade, setEspecialidade] = useState('')
  const [nota, setNota] = useState(1)
  const [comentario, setComentario] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro('')

    const data = new Date(dataSelecionada)
    const hoje = new Date()
    const limite = new Date()
    limite.setDate(hoje.getDate() - 14)

    if (data < limite) {
      setErro('Avaliação expirada. Selecione uma data válida.')
      return
    }

    if (data > hoje) {
      setErro('Data inválida. É preciso fazer a teleconsulta antes de avaliar.')
      return
    }

    try {
      const avaliacaoPayload = {
        nota,
        comentario,
        data_valiacao: formatarData(dataSelecionada)
      }

      const response = await fetch(`${URL_AVALIACOES}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avaliacaoPayload)
      })

      if (!response.ok) throw new Error('Erro ao registrar avaliação.')

      setEnviado(true)
    } catch {
      setErro('Erro ao enviar avaliação. Tente novamente.')
    }
  }

  return (
    <main>
      <Titulo titulo='Avaliação' />
      <section className='form'>
        {erro && <p className='form-erro'>{erro}</p>}
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div>
              <div className='input-container'>
                <label htmlFor='idConsulta'>
                  Qual foi sua teleconsulta?{' '}
                  <span className='text-red-500 font-bold'>*</span>
                </label>
                <select
                  name='consulta'
                  id='idConsulta'
                  value={especialidade}
                  onChange={e => setEspecialidade(e.target.value)}
                  required
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
              </div>
              <div className='input-container'>
                <label htmlFor='idDataConsulta'>
                  Quando foi sua teleconsulta?{' '}
                  <span className='text-red-500 font-bold'>*</span>
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
            </div>
            <div className='input-container'>
              <label htmlFor='idNota'>
                Deixe a nota aqui{' '}
                <span className='text-red-500 font-bold'>*</span>
              </label>
              <div className='flex items-center justify-evenly w-[50%]'>
                {[1, 2, 3, 4, 5].map(estrela => (
                  <label key={estrela} className='cursor-pointer'>
                    <input
                      type='radio'
                      name='rating'
                      value={estrela}
                      className='sr-only peer'
                      onChange={() => setNota(estrela)}
                    />
                    <FaStar
                      className={`text-4xl transition-all ease-in duration-200 ${
                        estrela <= nota
                          ? 'text-cc-azul scale-125'
                          : 'text-cc-cinza-escuro'
                      }`}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className='input-container'>
              <label htmlFor='idComentario'>
                Algum comentário sobre sua teleconsulta?
              </label>
              <textarea
                id='idComentario'
                name='comentario'
                rows={2}
                onChange={e => setComentario(e.target.value)}
              />
            </div>
          </fieldset>
          <button type='submit'>Enviar avaliação</button>
        </form>
      </section>

      <ModalConfirmar
        operacao={() => navigate('/')}
        mensagem='Obrigado pela sua avaliação!'
        descricao='Clique em OK para voltar à página inicial.'
        confirmacao={enviado}
      />
    </main>
  )
}

export default Avaliacoes
