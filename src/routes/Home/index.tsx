import { useEffect, useState } from 'react'
import Titulo from '../../components/Titulo/Titulo'
import HomeButton from '../../components/HomeButton/HomeButton'
import Linha from '../../components/Linha/Linha'
import { BiSolidBookReader } from 'react-icons/bi'
import { FaLaptopMedical } from 'react-icons/fa'
import { MdMedicalInformation } from 'react-icons/md'
import { FaUserDoctor } from 'react-icons/fa6'
import { RiSpeakAiFill } from 'react-icons/ri'
import { BsFillPinMapFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'

import Ajuda from '../../assets/images/carrossel-template1.png'
import Ajuda2 from '../../assets/images/carrossel-template2.png'
import Ajuda3 from '../../assets/images/carrossel-template3.png'
import logoBID from '../../assets/images/logo_parceiro.png'
import logoBP from '../../assets/images/logo_parceiro1.png'
import logoUmane from '../../assets/images/logo_parceiro2.png'
import logoSSSP from '../../assets/images/logo_parceiro3.png'
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar'
import { useAuth } from '../../context/AuthContext';
import SaudeForm from '../../components/SaudeForm/SaudeForm'

function Home () {
  const [index, setIndex] = useState(0)
  const [hover, setHover] = useState(false)
  const { paciente } = useAuth()
  const [confirmado, setConfirmado] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hover) {
        setIndex(prev => (prev + 1) % 3)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [hover])

  return (
    <main>
      <Titulo titulo='Página Inicial' />

      <section className='flex max-md:flex-col-reverse items-center justify-between min-h-[60vh]'>
        <aside className='flex flex-col items-center w-[30vw] min-w-[280px] px-[2vw]'>
          <div className='relative w-full overflow-hidden'>
            <ul
              className={`flex transition-transform duration-700 ease-in-out ${
                index === 0
                  ? '-translate-x-0'
                  : index === 1
                  ? '-translate-x-full'
                  : '-translate-x-[200%]'
              }`}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <li className='min-w-full'>
                <div className='flex justify-center px-[2vw]'>
                  <Link
                    to='/guias/guia/como-mudar-minha-senha-no-portal-hc'
                    className='card-inicial flex flex-col items-center text-center'
                  >
                    <img src={Ajuda} alt='' aria-hidden='true' />
                    <p>GUIA: Como mudar minha senha no Portal HC</p>
                  </Link>
                </div>
              </li>
              <li className='min-w-full'>
                <div className='flex justify-center px-[2vw]'>
                  <Link
                    to='/guias/guia/como-fazer-login-pelo-govbr-no-portal-hc'
                    className='card-inicial flex flex-col items-center text-center'
                  >
                    <img src={Ajuda2} alt='' aria-hidden='true' />
                    <p>GUIA: Como fazer login pelo gov.br no Portal HC</p>
                  </Link>
                </div>
              </li>
              <li className='min-w-full'>
                <div className='flex justify-center px-[2vw]'>
                  <Link
                    to='/avaliar-teleconsulta'
                    className='card-inicial flex flex-col items-center text-center'
                  >
                    <img src={Ajuda3} alt='' aria-hidden='true' />
                    <p>DICA: Avalie suas teleconsultas</p>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
          <nav className='flex justify-center gap-4 mt-[2vh]'>
            {[0, 1, 2].map(i => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`size-4 rounded-full ${
                  index === i
                    ? 'bg-cc-azul'
                    : 'border-[0.25rem] border-gray-300 bg-gray-400'
                }`}
                aria-label={`Ir para link ${i + 1}`}
              />
            ))}
          </nav>
        </aside>

        <div className='max-w-[450px] min-w-[280px] p-4'>
          <h2 className='titulo-2'>
            Você não está sozinho, estamos aqui para te ajudar.
          </h2>
          <Linha />
          <p>
            Precisando de uma ajuda mais rápida? Veja{' '}
            <span className='inline md:hidden'>abaixo</span>
            <span className='hidden md:inline'>ao lado</span> se sua dúvida se
            encaixa em algum dos guias.
          </p>
        </div>
      </section>

      <section className='flex flex-col items-center justify-center min-h-[70vh] my-[10vh] bg-cc-cinza py-[4vh] w-[112%] px-[2vw]'>
        <h2 className='titulo-2'>Navegue por nossos serviços</h2>
        <ul className='flex w-[60vw] max-lg:w-[80vw] min-w-[280px] flex-wrap justify-center mt-[4vh] gap-x-[2%] gap-y-[4vh]'>
          <HomeButton
            path='/guias/'
            icon={BiSolidBookReader}
            label='Guia do aplicativo'
          />
          <HomeButton
            path='/guias/'
            icon={FaLaptopMedical}
            label='Como será sua consulta'
          />
          <HomeButton
            path='/'
            icon={FaUserDoctor}
            label='Profissionais da saúde'
          />
          <HomeButton
            path='/'
            icon={MdMedicalInformation}
            label='Cuidados pós consulta'
          />
          <HomeButton
            path='/avaliar-teleconsulta'
            icon={RiSpeakAiFill}
            label='Como foi a teleconsulta'
          />
          <HomeButton
            path='/localizar-ubs'
            icon={BsFillPinMapFill}
            label='UBS perto de mim'
          />
          <HomeButton
            path='/TesteEquipamentos'
            icon={BsFillPinMapFill}
            label='Teste Seus Equipamentos'
          />
        </ul>
      </section>

      <section className='flex flex-col items-center justify-center mb-[5vh] py-[2vh] w-full'>
        <h2 className='titulo-2'>Conheça nossos parceiros</h2>
        <div className='flex items-center w-full mt-[4vh] py-[4vh] overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]'>
          <ul className='flex items-center justify-center [&_li]:mx-8 [&_img]:max-w-none [&_img]:h-[10vh] animate-infinite-scroll'>
            <li>
              <a href='https://www.iadb.org/pt-br' target='_blank'>
                <img
                  src={logoBID}
                  alt='Logo do banco interamericano de desenvolvimento'
                />
              </a>
            </li>
            <li>
              <a href='https://www.bp.org.br/' target='_blank'>
                <img
                  src={logoBP}
                  alt='Logo da beneficiência portuguesa de são paulo'
                />
              </a>
            </li>
            <li>
              <a href='https://umane.org.br/' target='_blank'>
                <img src={logoUmane} alt='Logo do grupo umane' />
              </a>
            </li>
            <li>
              <a href='https://saude.sp.gov.br/' target='_blank'>
                <img
                  src={logoSSSP}
                  alt='Logo da secretaria de saúde de são paulo'
                />
              </a>
            </li>
          </ul>
          <ul
            className='flex items-center justify-center [&_li]:mx-8 [&_img]:max-w-none [&_img]:h-[10vh] animate-infinite-scroll'
            aria-hidden
          >
            <li>
              <a href='https://www.iadb.org/pt-br' target='_blank'>
                <img
                  src={logoBID}
                  alt='Logo do banco interamericano de desenvolvimento'
                />
              </a>
            </li>
            <li>
              <a href='https://www.bp.org.br/' target='_blank'>
                <img
                  src={logoBP}
                  alt='Logo da beneficiência portuguesa de são paulo'
                />
              </a>
            </li>
            <li>
              <a href='https://umane.org.br/' target='_blank'>
                <img src={logoUmane} alt='Logo do grupo umane' />
              </a>
            </li>
            <li>
              <a href='https://saude.sp.gov.br/' target='_blank'>
                <img
                  src={logoSSSP}
                  alt='Logo da secretaria de saúde de são paulo'
                />
              </a>
            </li>
          </ul>
        </div>
      </section>

      <SaudeForm />

      {
        paciente?.acompanhantes == 's'?
        <ModalConfirmar operacao={() => setConfirmado(false)} mensagem='Cadastre seu acompanhante!' descricao='Não se esqueça de acessar o perfil e registrar as informações do acompanhante.' confirmacao={confirmado}/> : ''
      }
    </main>
  )
}

export default Home