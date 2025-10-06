import { Link } from "react-router-dom"

function ItemLista(props:{path:string, titulo:string, image:string}) {
    return (
        <li className="bg-white p-4 rounded-2xl shadow-md hover:scale-105 w-[60vw] max-w-[600px] min-w-[240px]">
            <Link to={`/guias/guia/${props.path}`} className="flex items-center gap-[1vw]">
                <img src={props.image} className="h-[10vh]"/>
                <p>{props.titulo}</p>
            </Link>
        </li>
    )
}

export default ItemLista