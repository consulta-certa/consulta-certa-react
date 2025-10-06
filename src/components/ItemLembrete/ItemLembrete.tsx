function ItemLembrete (props: {
  especialidade: string
  horario: string
  canal: string
}) {
  return (
    <li className=' p-4 rounded-2xl bg-cc-cinza gap-2'>
      <h3 className='text-lg font-bold'>Consulta com {props.especialidade}</h3>
      <div className='h-0.5 w-full bg-cc-cinza-escuro my-2'></div>
      <p>
        <span className='font-bold'>Horário:</span> {props.horario}
      </p>
      <p>
        <span className='font-bold'>Enviar por:</span> {props.canal}
      </p>
    </li>
  )
}

export default ItemLembrete
