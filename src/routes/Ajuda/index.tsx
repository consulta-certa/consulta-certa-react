import { Link } from 'react-router-dom'
import Titulo from '../../components/Titulo/Titulo'
import Linha from '../../components/Linha/Linha'
import { useEffect, useState } from 'react'
import ItemFaq from '../../components/ItemFaq/ItemFaq'
import type { tipoConteudo } from '../../types/tipoConteudo'
const URL_CONTEUDO = import.meta.env.VITE_API_BASE_CONTEUDOS;

function Ajuda () {
  const [faqs, setFaqs] = useState<tipoConteudo[]>([])
  const [aberto, setAberto] = useState<number | null>(null)

  const fetchFaqs = async () => {
    try {
      const response = await fetch(`${URL_CONTEUDO}`)
      const data = await response.json();
      
			const faqsSelecionadas = data.filter(
        (conteudo: tipoConteudo) => conteudo.tipo == 'f'
      )
      setFaqs(faqsSelecionadas)

    } catch {
      console.error('Erro ao buscar os dados de FAQ')
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  const handleToggle = (index: number): void => {
    setAberto(aberto === index ? null : index)
  }

  return (
    <main>
      <Titulo titulo='Ajuda' />
      <div className='flex max-md:flex-col gap-[5vw] max-md:gap-[2vh] justify-center items-center w-full mx-[2vw] my-auto'>
        <section className='w-[40%] min-w-[280px]'>
          <h2 className='titulo-2'>Continua com dúvidas?</h2>
          <Linha />
          <p>
            Clique abaixo para falar com o HC diretamente e resolver sua
            questão.
          </p>
          <Link to='/contato' className='botao block max-w-fit'>
            Fale com o HC
          </Link>
        </section>
        <section className='w-[50%] min-w-[280px] h-[60vh] pr-[1vw] overflow-y-scroll'>
          <ul className='flex flex-col gap-4'>
            {faqs.map((faq, index) => (
              <ItemFaq
                key={faq.id}
                index={index}
                duvida={faq.titulo}
                resposta={faq.texto}
                aberto={aberto}
                onToggle={handleToggle}
              />
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}

export default Ajuda
