import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.svg'
import logoHC from '../../assets/images/logo_hc.svg'
import NavElement from './NavElement'

import { AiFillHome } from 'react-icons/ai'
import { BiSolidBookReader } from 'react-icons/bi'
import { MdLiveHelp } from 'react-icons/md'
import { RiTeamFill } from 'react-icons/ri'
import { IoMdChatboxes } from 'react-icons/io'
import { MdRateReview } from 'react-icons/md'
import { TbBellRingingFilled } from 'react-icons/tb'
import { IoCloseSharp, IoPersonCircle } from 'react-icons/io5'
import { FaBars } from 'react-icons/fa'
import { useState } from 'react'

function Header () {
  const [aberto, setAberto] = useState(false)

  return (
    <header className='header'>
      <div className='flex gap-[1vw]'>
        <a href='https://www.hc.fm.usp.br/hc/portal/' target='_'>
          <img src={logoHC} alt='Logo do HC' className='logo' />
        </a>
        <Link to='/'>
          <img
            src={logo}
            alt='Logo da página Consulta Certa'
            className='logo'
          />
        </Link>
      </div>
      <nav className='block max-lg:hidden'>
        <ul>
          <NavElement path='/' icon={AiFillHome} label='Início' />
          <NavElement path='/guias' icon={BiSolidBookReader} label='Guias' />
          <NavElement path='/ajuda' icon={MdLiveHelp} label='Ajuda' />
          <NavElement path='/quem-somos' icon={RiTeamFill} label='Quem somos' />
          <NavElement path='/contato' icon={IoMdChatboxes} label='Contato' />
          <NavElement path='/avaliar-teleconsulta' icon={MdRateReview} label='Avaliações'
          />
          <NavElement path='/lembretes' icon={TbBellRingingFilled} label='Lembretes' />
          <NavElement path='/perfil' icon={IoPersonCircle} label='Perfil' />
        </ul>
      </nav>
      <nav className='hidden max-lg:block fixed left-0 bottom-0 w-full px-[2vw] z-1000 h-[12vh] text-lg max-md:pr-[25vw]'>
        <ul className='flex w-full justify-evenly h-full gap-4 ml-[1vw]'>
          <NavElement path='/' icon={AiFillHome} label='Início' />
          <NavElement path='/guias' icon={BiSolidBookReader} label='Guias' />
          <NavElement path='/ajuda' icon={MdLiveHelp} label='Ajuda' />
          <button className='flex flex-col items-center' onClick={()=>setAberto(aberto ? false : true)}>
            { aberto ? <IoCloseSharp className='text-2xl text-cc-azul' /> : <FaBars className='text-lg' /> }
            <p>{ aberto ? 'Fechar' : 'Mais'}</p>
          </button>
        </ul>
      </nav>
      <nav className={`hidden max-lg:block fixed bottom-[14vh] p-4 z-1000 text-lg transition-transform duration-300 ease-in rounded-xl shadow-lg ${aberto ? 'translate-y-0' : 'translate-y-[150vh]'}`} onClick={()=>setAberto(aberto ? false : true)}>
        <ul className='flex flex-col w-full items-center h-full gap-4 '>
          <NavElement path='/quem-somos' icon={RiTeamFill} label='Quem somos'/>
          <NavElement path='/contato' icon={IoMdChatboxes} label='Contato'/>
          <NavElement path='/avaliar-teleconsulta' icon={MdRateReview} label='Avaliar'/>
          <NavElement path='/lembretes' icon={TbBellRingingFilled} label='Lembretes'/>
          <NavElement path='/perfil' icon={IoPersonCircle} label='Perfil'/>
        </ul>
      </nav>
    </header>
  )
}

export default Header
