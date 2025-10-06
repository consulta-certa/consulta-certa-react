import Titulo from '../../components/Titulo/Titulo'
import type { tipoConteudo } from '../../types/tipoConteudo'
import { useParams } from 'react-router-dom'
import { converterPath } from '../../utils/converterPath'
import { useEffect, useState } from 'react'
import Erro from '../Erro'
const URL_CONTEUDOS = import.meta.env.VITE_API_BASE_CONTEUDOS;

function Guia () {
  const { name } = useParams<string>()
  const [guia, setGuia] = useState<tipoConteudo>()

  const fetchGuia = async () => {
    try {
      const response = await fetch(`${URL_CONTEUDOS}`)
      const data = await response.json()

      const guiaSelecionado = data.find(
        (conteudo: tipoConteudo) => converterPath(conteudo.titulo) === name
			)
      setGuia(guiaSelecionado)
    } catch {
      console.error('Erro ao buscar os dados do guia')
    }
  }

  useEffect(() => {
    fetchGuia()
  })

  if (!guia) {
    return <Erro/>
  }

  const descricao = guia.texto.split('\n')

  return (
    <main>
      <Titulo titulo='Guia' />
      <h2 className='titulo-2'>{guia.titulo}</h2>
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
  )
}

export default Guia
