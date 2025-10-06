import { BiSolidDownArrow } from 'react-icons/bi'

function ItemFaq(props:{ duvida:string, resposta:string, index:number, aberto:number | null, onToggle:(e:number) => void}) {
  const aberto = props.aberto === props.index;

  return (
    <li
      className={`p-4 rounded-2xl cursor-pointer transition-colors duration-200 ease-in ${
        aberto ? 'bg-cc-azul text-white' : 'bg-cc-cinza'
      }`}
      onClick={() => props.onToggle(props.index)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{props.duvida}</h3>
        <BiSolidDownArrow
          className={`text-lg transition-transform duration-300 ${aberto ? 'rotate-180' : ''}`}
        />
      </div>
      <p
        className={`transition-[max-height] duration-300 ease-in-out overflow-y-scroll pr-[1vw] ${aberto ? 'visible max-h-[40vh] mt-2' : 'invisible max-h-0'}`}
      >
        {props.resposta}
      </p>
    </li>
  )
}

export default ItemFaq
