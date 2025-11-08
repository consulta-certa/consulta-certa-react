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
        (conteudo: tipoConteudo) => conteudo.tipo === 'i'
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

      <section className='flex max-md:flex-col justify-center items-center gap-4 w-full mt-[5vh]'>
        <div className='flex flex-col items-center gap-4 w-1/4 max-md:w-full'>
          {['Portal do Paciente', 'Teleconsulta', 'Geral'].map(
            (botao, index) => (
              <button
                className={`w-full min-h-10 rounded-full cursor-pointer hover:scale-105 active:bg-cc-azul-escuro active:text-white transition-all duration-200 ease-in ${
                  categoria == index
                    ? 'bg-cc-azul text-white font-bold'
                    : 'bg-cc-cinza'
                }`}
                onClick={() => setCategoria(index)}
                key={index}
              >
                {botao}
              </button>
            )
          )}
        </div>
        <div className='rounded-lg bg-cc-azul p-4 h-[50vh] w-full max-w-fit flex items-center justify-center'>
          {guiasPortal.length > 0 ? (
            <ul className='flex flex-col items-center overflow-y-scroll overflow-x-clip gap-[2vh] h-full p-4 pr-6'>
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
                  key={guia.id}
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
