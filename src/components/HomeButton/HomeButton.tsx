import { Link } from "react-router-dom"

function HomeButton(props:{path:string, icon:React.ComponentType<{ className?: string }>, label:string}) {
    return (
        <li className="bg-white rounded-2xl shadow-md p-4 basis-[30%] max-sm:basis-[48%] hover:bg-cc-azul group hover:text-white hover:scale-105 transition-all ease-in duration-300">
            <Link to={props.path} className="flex flex-col items-center gap-[2vh]">
                <props.icon className="text-6xl mt-[4vh] text-cc-azul group-hover:text-white"/>
                <p className="text-center">{props.label}</p>
            </Link>
        </li>
    )
}

export default HomeButton