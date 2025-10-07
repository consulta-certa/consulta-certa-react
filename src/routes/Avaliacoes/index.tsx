import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import Titulo from '../../components/Titulo/Titulo'
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type { tipoAvaliacao } from '../../types/tipoAvaliacao'
// const URL_AVALIACOES = import.meta.env.VITE_API_BASE_AVALIACOES;

function Avaliacoes() {
  const [nota, setNota] = useState<number>(1)
  const [enviado, setEnviado] = useState<boolean>(false)

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
  } = useForm<tipoAvaliacao>();
  /*
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
  */

  const onSubmit: SubmitHandler<tipoAvaliacao> = async (data) => {
    const avaliacao = {
      id: "abc",
      especialidade: data.especialidade,
      nota: data.nota,
      comentario: data.comentario,
      data_avaliacao: new Date()
    }
    console.log(avaliacao)
    setEnviado(true)
  }

  return (
    <main>
      <Titulo titulo='Avaliação' />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className='form-field'>
              <label htmlFor="idEspecialidade">Qual foi sua teleconsulta?</label>
              <select
                id="idEspecialidade"
                defaultValue=''
                {...register('especialidade', { required: true })}
              >
                <option value='' disabled>Selecione uma opção</option>
                <option value='fisioterapeuta'>Fisioterapeuta</option>
                <option value='cardiologista'>Cardiologista</option>
                <option value='neurologista'>Neurologista</option>
                <option value='optometrista'>Optometrista</option>
                <option value='ortopedista'>Ortopedista</option>
              </select>
            </div>
            <div className='form-field'>
              <label htmlFor="idNota">Dê uma nota a sua teleconsulta</label>
              <div className='flex items-center justify-evenly w-[50%]'>

                {[1, 2, 3, 4, 5].map(estrela => (
                  <div key={estrela} className='cursor-pointer'>
                    <input
                      type='radio'
                      value={estrela}
                      className='sr-only peer'
                      {...register('nota', { required: true })}
                      onChange={()=> setNota(estrela)}
                    />
                    <FaStar
                      className={`text-4xl transition-all ease-in duration-200 ${estrela <= nota
                        ? 'text-cc-azul scale-125'
                        : 'text-cc-cinza-escuro'
                        }`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className='form-field'>
              <label htmlFor="idComentario">Algum comentário?</label>
              <input
                type="text"
                id="idComentario"
                {...register('comentario')}
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
