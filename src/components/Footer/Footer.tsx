import { Link } from "react-router-dom"

function Footer() {    return (
        <footer className="flex gap-[2vw] justify-between items-center bg-cc-azul w-[80vw] max-lg:w-[96vw] my-[2vh] rounded-2xl py-[1vh] px-[2vw] min-h-[10vh] text-white max-lg:mb-[14vh]">
            <p>&copy; 2025 Consulta Certa</p>
            <Link to={'/termos'} className="hover:font-bold hover:translate-x-0.5">Termos de uso e Políticas de Privacidade</Link>
        </footer>
    )
}

export default Footer