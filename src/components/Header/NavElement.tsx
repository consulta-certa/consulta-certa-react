import { NavLink } from "react-router-dom"

function NavElement(props:{path:string, icon:React.ComponentType<{ className?: string }>, label:string}) {
  return (
    <li className="flex items-center flex-col min-w-[6vw]">
        <NavLink to={props.path} className={({ isActive }) =>
            isActive
                ? 'text-cc-azul font-bold transition-all duration-300 ease-in-out scale-110 translate-y-[-0.25vh]'
                : 'text-cc-preto transition-all duration-300 ease-in-out'
        }>
            <props.icon className='mx-auto text-2xl'/>
            {props.label}
        </NavLink>
    </li>
  )
}

export default NavElement