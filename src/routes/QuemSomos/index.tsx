import Linha from '../../components/Linha/Linha'
import Titulo from '../../components/Titulo/Titulo'
import quemSomosBanner from '../../assets/images/carrossel-template3.png'
import { TbTargetArrow } from 'react-icons/tb'
import { RiTreasureMapFill } from 'react-icons/ri'
import { FaGithub, FaHiking, FaLinkedin } from 'react-icons/fa'
import dev1 from '../../assets/images/FelipeFerrete.jpeg'
import dev2 from '../../assets/images/GustavoBosak.jpeg'
import dev3 from '../../assets/images/NikolasBrisola.jpeg'

const textoHistoriaCC =
           `Tudo começou com uma pergunta simples:
            por que tantos pacientes faltam às consultas?

            Descobrimos que não era por má vontade.
            Muitos esquecem a data, não sabem como acessar a teleconsulta ou ficam inseguros em usar tecnologia.
            Isso gera filas maiores, exames desperdiçados e médicos esperando sem poder atender.

            Foi aí que pensamos:
            E se existisse um canal simples, que lembrasse o paciente no momento certo e desse o passo a passo de forma clara e acessível?

            Assim nasceu o Consulta Certa.

            Uma plataforma feita para acolher o paciente desde antes da consulta, com lembretes, vídeos tutoriais, chatbot inclusivo e design pensado para ser usado por qualquer pessoa — seja no celular simples ou no computador.

            O objetivo é um só:
            diminuir o absenteísmo e garantir que mais pessoas recebam o atendimento que precisam, no tempo certo.`

function QuemSomos () {
  return (
    <main>
      <Titulo titulo='Quem somos' />
      <section className='flex max-md:flex-col-reverse items-center justify-between min-h-[66vh] pb-[4vh]'>
        <div className='w-[50%] min-w-[280px]'>
          <div>
            <h2 className='titulo-2'>A história por trás do Consulta Certa</h2>
            <Linha />
          </div>
          <p className='texto-com-quebra'>
            {textoHistoriaCC}
          </p>
        </div>
        <img src={quemSomosBanner} alt='' className='w-[30%] max-md:mb-[2vh]' />
      </section>
      <section className='flex flex-col items-center justify-center min-h-[70vh] my-[10vh] bg-cc-cinza py-[4vh] w-[112%] px-4'>
        <h2 className='titulo-2'>E por que estamos aqui?</h2>
        <div className='flex flex-wrap gap-[4vw] max-lg:gap-[2vh] items-center justify-between w-[90%] mt-[4vh]'>
          <div className='flex flex-col justify-center basis-[28%] mr-auto max-lg:basis-2/4 max-sm:basis-4/5 bg-white min-h-[28vh] rounded-2xl p-4 relative detalhes-laterais text-center items-center'>
            <div className='flex items-center'>
              <TbTargetArrow className='text-4xl mr-2' />
              <h3 className='text-2xl font-bold flex items-center'>
                Motivação
              </h3>
            </div>
            <p>Reduzir significativamente o absenteísmo nas teleconsultas.</p>
          </div>
          <div className='flex flex-col justify-center basis-[28%] mx-auto max-lg:basis-2/4 max-sm:basis-4/5 bg-white min-h-[40vh] rounded-2xl p-4 relative detalhes-laterais text-center items-center'>
            <div className='flex items-center'>
              <FaHiking className='text-4xl mr-2' />
              <h3 className='text-2xl font-bold flex items-center'>Metas</h3>
            </div>
            <ul>
              <li>Reduzir as faltas nas teleconsultas</li>
              <li>Ser uma ponte entre paciente e HC</li>
              <li>Ajudar pacientes a se manterem saudáveis</li>
            </ul>
          </div>
          <div className='flex flex-col justify-center basis-[28%] ml-auto max-lg:basis-2/4 max-sm:basis-4/5 bg-white min-h-[30vh] rounded-2xl p-4 relative detalhes-laterais text-center items-center'>
            <div className='flex items-center'>
              <RiTreasureMapFill className='text-4xl mr-2' />
              <h3 className='text-2xl font-bold flex items-center'>Meios</h3>
            </div>
            <p>Textos simples e acessibilidade</p>
          </div>
        </div>
      </section>
      <section className='flex max-md:flex-col items-center justify-between min-h-[70vh] w-full gap-8 px-4'>
        <div>
          <h2 className='titulo-2'>Nossa equipe</h2>
          <Linha />
          <div>
            <h3 className='text-xl font-semibold'>Consulta Certa</h3>
            <p>1TDSPF - ADS FIAP Paulista</p>
          </div>
        </div>
        <ul className='flex max-md:flex-col justify-between items-center gap-4 w-2/3 min-w-[280px] min-h-[50vh]'>
          <li className='flex flex-col items-center justify-center p-4 rounded-2xl bg-cc-cinza-escuro min-h-[40vh] text-center basis-[30%] max-md:w-[80%]'>
            <img src={dev1} alt='Foto do desenvolvedor Felipe Ferrete Soares Lemes' className='size-32 object-cover' />
            <p className='mt-4'>Felipe Ferrete Soares Lemes</p>
            <p className='text-sm opacity-70'>RM562999</p>
            <ul className='flex gap-4 mt-4 text-2xl'>
              <li>
                <a href='https://github.com/FelipeFerrete'>
                  <FaGithub />
                </a>
              </li>
              <li>
                <a href='https://www.linkedin.com/in/felipe-ferrete-ab63a318a'>
                  <FaLinkedin />
                </a>
              </li>
            </ul>
          </li>
          <li className='flex flex-col items-center justify-center p-4 rounded-2xl bg-cc-cinza-escuro min-h-[40vh] text-center basis-[30%] max-md:w-[80%]'>
            <img src={dev2} alt='Foto do desenvolvedor Gustavo Bosak Santos' className='size-32 object-cover' />
            <p className='mt-4'>Gustavo Bosak Santos</p>
            <p className='text-sm opacity-70'>RM566315</p>
            <ul className='flex gap-4 mt-4 text-2xl'>
              <li>
                <a href='https://github.com/Gustavo-Bosak'>
                  <FaGithub />
                </a>
              </li>
              <li>
                <a href='https://www.linkedin.com/in/gustavo-bosak-santos'>
                  <FaLinkedin />
                </a>
              </li>
            </ul>
          </li>
          <li className='flex flex-col items-center justify-center p-4 rounded-2xl bg-cc-cinza-escuro min-h-[40vh] text-center basis-[30%] max-md:w-[80%]'>
            <img src={dev3} alt='Foto do desenvolvedor Nikolas Henrique de Souza Lemes Brisola' className='size-32 object-cover' />
            <p className='mt-4'>Nikolas Henrique de Souza Lemes Brisola</p>
            <p className='text-sm opacity-70'>RM564371</p>
            <ul className='flex gap-4 mt-4 text-2xl'>
              <li>
                <a href='https://github.com/NikolasBrisola'>
                  <FaGithub />
                </a>
              </li>
              <li>
                <a href='https://www.linkedin.com/in/nikolas-brisola-ab3588353'>
                  <FaLinkedin />
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </main>
  )
}

export default QuemSomos
