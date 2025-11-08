function ModalConfirmar (props:{operacao:() => void, mensagem:string, descricao:string, confirmacao:boolean}) {
  return (
    <div
      className={`fixed inset-0 bg-black/30 transition-[opacity,z] duration-1000 ease-in ${
        props.confirmacao ? 'z-50 visible' : '-z-50 invisible'
      } flex items-center justify-center p-4`}
    >
      <div
        className={`bg-white p-4 rounded-lg shadow-md text-center z-50 transition-transform duration-300 ease-in ${
          props.confirmacao ? 'translate-y-0' : 'translate-y-[150vh]'
        }`}
      >
        <h3 className='text-xl font-bold mb-4'>
          {props.mensagem}
        </h3>
        <p className='mb-4'>{props.descricao}</p>
        <button onClick={() => props.operacao()} className='botao'>
          OK
        </button>
      </div>
    </div>
  )
}

export default ModalConfirmar
