import ItemLista from '../../components/ItemLista/ItemLista'
import Titulo from '../../components/Titulo/Titulo'
import imageTest from '../../assets/images/carrossel-template2.png'
import { useEffect, useState } from 'react'
import type { tipoConteudo } from '../../types/tipoConteudo'
import { converterPath } from '../../utils/converterPath'
import LoadingElement from '../../components/LoadingElement/LoadingElement'
const URL_CONTEUDOS = import.meta.env.VITE_API_BASE_CONTEUDOS

function ListaGuias () {
  const [categoria, setCategoria] = useState(0)
  const [guiasPortal, setGuiasPortal] = useState<tipoConteudo[]>([])
  const [guiasTeleconsulta, setGuiasTeleconsulta] = useState<tipoConteudo[]>([])
  const [guiasGerais, setGuiasGerais] = useState<tipoConteudo[]>([])
  const [loading, setLoading] = useState(false)

  const fetchGuias = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${URL_CONTEUDOS}`)
      const data: tipoConteudo[] = await response.json()

      const guiasPortalSelecionados = data.filter(
        (conteudo: tipoConteudo) => conteudo.tipo === 'p'
      )
      setGuiasPortal(guiasPortalSelecionados)

      const guiasTeleconsultaSelecionados = data.filter(
        (conteudo: tipoConteudo) => conteudo.tipo === 't'
      )
      setGuiasTeleconsulta(guiasTeleconsultaSelecionados)

      const guiasGeraisSelecionados = data.filter(
        (conteudo: tipoConteudo) => conteudo.tipo === 't'
      )
      setGuiasGerais(guiasGeraisSelecionados)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao buscar os dados dos guias', error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuias()
  }, [])

  return (
    <main>
      <Titulo titulo='Guias'></Titulo>
      <h2 className='titulo-2'>Qual tipo de ajuda você gostaria?</h2>

      <section className='flex max-md:flex-col justify-between w-6/8 min-w-[280px] px-[1vw] mt-[2vh]'>
        <div className='flex items-center max-md:items-end flex-col max-md:flex-row gap-[2vh] max-md:gap-[2vw] md:mt-[1vh] max-md:px-[2vw]'>
          {['Portal do Paciente', 'Teleconsulta', 'Geral']}
          <button
            className={`text-xl max-md:text-md font-semibold text-center w-full p-4 md:rounded-l-xl max-md:rounded-t-xl transition-all ease-in duration-200 cursor-pointer ${
              categoria == 0
                ? 'bg-cc-cinza'
                : 'bg-cc-azul text-white font-bold scale-105'
            }`}
            onClick={() => setCategoria(0)}
          >
            Portal do Paciente HC
          </button>
          <button
            className={`text-xl max-md:text-md font-semibold text-center w-full p-4 md:rounded-l-xl max-md:rounded-t-xl transition-all ease-in duration-200 cursor-pointer ${
              categoria == 1
                ? 'bg-cc-cinza'
                : 'bg-cc-azul text-white font-bold scale-105'
            }`}
            onClick={() => setCategoria(1)}
          >
            Teleconsulta
          </button>
          <button
            className={`text-xl max-md:text-md font-semibold text-center w-full p-4 md:rounded-l-xl max-md:rounded-t-xl transition-all ease-in duration-200 cursor-pointer ${
              categoria == 2
                ? 'bg-cc-cinza'
                : 'bg-cc-azul text-white font-bold scale-105'
            }`}
            onClick={() => setCategoria(2)}
          >
            Geral
          </button>
        </div>
        <div className='rounded-lg bg-cc-azul p-8 h-[44vh] w-full'>
          {guiasPortal.length > 0 ? (
            <ul className='flex flex-col items-center overflow-y-scroll gap-[2vh] h-full'>
              {(categoria == 0
                ? guiasPortal
                : categoria == 1
                ? guiasTeleconsulta
                : guiasGerais
              ).map(guia => (
                <ItemLista
                  path={converterPath(guia.titulo)}
                  titulo={guia.titulo}
                  image={imageTest}
                />
              ))}
            </ul>
          ) : loading ? (
            <LoadingElement />
          ) : (
            <p className='server-error'>
              Conteúdo indisponível, servidor fora do ar.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default ListaGuias
