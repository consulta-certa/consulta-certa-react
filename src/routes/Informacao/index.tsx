import { useEffect, useState } from "react"
import Titulo from "../../components/Titulo/Titulo"
import { useParams } from "react-router-dom"
import type { tipoConteudo } from "../../types/tipoConteudo"
import { converterPath } from "../../utils/converterPath";
import Erro from "../Erro";
const URL_CONTEUDOS = import.meta.env.VITE_API_BASE_CONTEUDOS;

function Informacao() {
  const { name } = useParams<string>()
  const [info, setInfo] = useState<tipoConteudo>()

  const fetchGuia = async () => {
    try {
      const response = await fetch(`${URL_CONTEUDOS}`)
      const data = await response.json()

      const infoSelecionado = data.find(
        (conteudo: tipoConteudo) => converterPath(conteudo.titulo) === name
			)
      setInfo(infoSelecionado)
    } catch {
      console.error('Erro ao buscar os dados da página de informação')
    }
  }

  useEffect(() => {
    fetchGuia()
  })

  if (!info) {
    return <Erro/>
  }

  const descricao = info.texto.split('\n')

  return (
    <main>
      <Titulo titulo='Guia' />
      <h2 className='titulo-2'>{info.titulo}</h2>
      <section className='flex max-md:flex-col max-md:gap-[4vh] gap-[2vw] justify-center items-center min-h-[60vh] mt-[2vh]'>
				<img src={`/media/${info.imagem}`} alt='' className='h-[50vh]' />
          {descricao.map((p, index) => (
            <p key={index}>{p}</p>
          ))}
      </section>
    </main>
  )
}

export default Informacao