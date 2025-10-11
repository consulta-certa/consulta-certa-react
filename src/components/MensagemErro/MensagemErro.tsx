import type { FieldError } from 'react-hook-form'

function MensagemErro ({ error }: { error?: FieldError }) {
  if (!error) return null
  
  return <p className='mt-4 p-1 bg-red-50 outline-1 outline-red-400 text-red-500 rounded-full text-center font-semibold w-full'>{error.message}</p>
}

export default MensagemErro