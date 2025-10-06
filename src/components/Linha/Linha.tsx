import { GiHealthNormal } from 'react-icons/gi'

function Linha () {
  return (
    <div className='flex gap-1 items-center my-2'>
      <GiHealthNormal className='text-[0.5rem] text-cc-azul' />
      <div className='h-1 w-[8vw] min-w-[100px] bg-cc-azul rounded-2xl'></div>
    </div>
  )
}

export default Linha