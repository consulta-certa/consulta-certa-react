import Titulo from '../../components/Titulo/Titulo'
import type { tipoConteudo } from '../../types/tipoConteudo'
import { useParams } from 'react-router-dom'
import { converterPath } from '../../utils/converterPath'
import { useEffect, useState } from 'react'
import LoadingElement from '../../components/LoadingElement/LoadingElement'
import { limparData } from '../../utils/gerarData'
import { FaPen } from 'react-icons/fa'
const URL_CONTEUDOS = import.meta.env.VITE_API_BASE_CONTEUDOS

function Guia () {
  const { name } = useParams<string>()
  const [guia, setGuia] = useState<tipoConteudo>()
  const [loading, setLoading] = useState(false)

  const fetchGuia = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${URL_CONTEUDOS}`)
      const data: tipoConteudo[] = await response.json()

      const guiaSelecionado = data.find(
        (conteudo: tipoConteudo) => converterPath(conteudo.titulo) === name
      )
      setGuia(guiaSelecionado)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao buscar os dados do guia', error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuia()
  }, [name])

  const descricao = guia && guia.texto.split('\n')

  return guia && descricao ? (
    <main>
      <Titulo titulo='Guia' />
      <h2 className='titulo-2'>{guia.titulo}</h2>
      <div className='flex gap-4 my-2 self-start items-center ml-8 opacity-75'>
        <FaPen/>
        <p className=''>Publicado em: {limparData(guia.dataPublicacao)}</p>
      </div>
      <div className='flex max-md:flex-col max-md:gap-[4vh] gap-[2vw] justify-center items-center min-h-[60vh] mt-[2vh]'>
        <section className='w-[20vw] max-md:w-[80vw] min-w-[280px] p-4 rounded-2xl bg-cc-azul'>
          {guia.video ? (
            <video controls className='bg-black h-[50vh]'>
              <source src={`/media/${guia.video}`} type='video/mp4' />
            </video>
          ) : guia.imagem ? (
            <img src={`/media/${guia.imagem}`} alt='' className='h-[50vh]' />
          ) : (
            ''
          )}
        </section>
        <section className='[&_p]:my-4 [&_p]:text-justify w-[50%] max-lg:w-[100%] h-[50vh] overflow-y-scroll pr-[2vw]'>
          <h3 className='text-xl font-bold'>Descrição</h3>
          {descricao.map((p, index) => (
            <p key={index}>{p}</p>
          ))}
        </section>
      </div>
    </main>
  ) : loading ? (
    <LoadingElement />
  ) : (
    <p className='server-error'>Conteúdo indisponível, servidor fora do ar.</p>
  )
}

export default Guia
