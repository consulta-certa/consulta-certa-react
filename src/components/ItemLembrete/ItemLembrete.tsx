function ItemLembrete ({especialidade, horario, status}:{especialidade: string, horario: string, status: string}) {
  return (
    <li className={`p-4 rounded-2xl bg-cc-cinza gap-2 ${status == 'I'? 'brightness-80 opacity-70' : 'brightness-100'}`}>
      <h3 className='text-lg font-bold'>Consulta com {especialidade}</h3>
      <div className='h-0.5 w-full bg-cc-cinza-escuro my-2'></div>
      <p>
        <span className='font-bold'>Horário:</span> {horario}
      </p>
      <p>
        <span className='font-bold'>Enviado:</span> {status == 'A' ? 'será enviado' : 'já enviado'}
      </p>
    </li>
  )
}

export default ItemLembrete
