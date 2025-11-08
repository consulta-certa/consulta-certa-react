import { CgSpinner } from "react-icons/cg"

function LoadingElement () {
  return (
    <div className='bg-cc-azul rounded-2xl w-fit p-4 text-white flex justify-center items-center gap-4 my-4'>
      <CgSpinner className="text-2xl animate-spin"/>
      <p>Carregando...</p>
    </div>
  )
}

export default LoadingElement
