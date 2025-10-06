import { Outlet } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import VLibras from './components/VLibras/VLibras'
import WatsonChat from './components/Watson/Watson'

function App () {
  return (
    <div
      id='App'
      className='flex flex-col justify-between items-center min-h-[100vh] bg-cc-cinza'
    >
      <WatsonChat/>
      <VLibras />
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App