import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import Titulo from '../../components/Titulo/Titulo'
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type { tipoAvaliacao } from '../../types/tipoAvaliacao'
import MensagemErro from '../../components/MensagemErro/MensagemErro'
const URL_AVALIACOES = import.meta.env.VITE_API_BASE_AVALIACOES

function Avaliacoes () {
  const [nota, setNota] = useState<number>(0)
  const [enviado, setEnviado] = useState<boolean>(false)
  const [serverError, setServerError] = useState<boolean>(false)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<tipoAvaliacao>()

  const onSubmit: SubmitHandler<tipoAvaliacao> = async data => {
    const avaliacao = {
      especialidade: data.especialidade,
      nota: data.nota,
      comentario: data.comentario,
      data_avaliacao: new Date().toISOString().slice(0, 19)
    }

    try {
      await fetch(URL_AVALIACOES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avaliacao)
      })
      setEnviado(true)
    } catch {
      console.error('Erro ao enviar avaliação.')
      serverError ? setServerError(true) : setServerError(true)
    }
  }

  return (
    <main>
      <Titulo titulo='Avaliação' />
      <section className='form'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className='input-container'>
              <label htmlFor='idEspecialidade'>
                Qual foi sua teleconsulta?
              </label>
              <select
                id='idEspecialidade'
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
              <label htmlFor='idNota'>Dê uma nota a sua teleconsulta</label>
              <div className='flex items-center justify-evenly w-full'>
                {[1, 2, 3, 4, 5].map(estrela => (
                  <label key={estrela} className='cursor-pointer'>
                    <input
                      type='radio'
                      value={estrela}
                      className='sr-only peer'
                      {...register('nota', { required: 'Campo obrigatório' })}
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
              <MensagemErro error={errors.nota} />
            </div>
            <div className='input-container'>
              <label htmlFor='idComentario'>Algum comentário?</label>
              <input
                type='text'
                id='idComentario'
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

      <ModalConfirmar
        operacao={() => setServerError(false)}
        mensagem='Erro ao acessar servidor'
        descricao='Aguarde um pouco e tente novamente.'
        confirmacao={serverError}
      />
    </main>
  )
}

export default Avaliacoes
