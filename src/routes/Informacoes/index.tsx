import Linha from "../../components/Linha/Linha"
import Titulo from "../../components/Titulo/Titulo"

function Informacoes() {
  return (
    <main className="main">
        <Titulo titulo="Saiba mais"/>
        <section>
            <h2 className="titulo-2">Saiba mais sobre sua teleconsulta</h2>
            <Linha/>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur eum similique tempora commodi beatae rerum debitis in inventore ipsum, laboriosam nostrum esse.</p>
        </section>
        <ul className="flex w-[60vw] max-lg:w-[80vw] min-w-[280px] flex-wrap justify-center mt-[4vh] gap-x-[2%] gap-y-[4vh] [&_li]:p-4 [&_li]:bg-cc-azul [&_li]:text-white [&_li]:rounded-xl [&_li]:max-w-[25vw] [&_p]:text-sm [&_p]:opacity-75">
            <li>
                <img src="" alt="" className="h-40 w-full object-cover"/>
                <h3>Lorem ipsum dolor sit amet consectetur.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, iure.</p>
            </li>
            <li>
                <img src="" alt="" className="h-40 w-full object-cover"/>
                <h3>Lorem ipsum dolor sit amet consectetur.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, iure.</p>
            </li>
            <li>
                <img src="" alt="" className="h-40 w-full object-cover"/>
                <h3>Lorem ipsum dolor sit amet consectetur.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, iure.</p>
            </li>
            <li>
                <img src="" alt="" className="h-40 w-full object-cover"/>
                <h3>Lorem ipsum dolor sit amet consectetur.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, iure.</p>
            </li>
        </ul>
    </main>
  )
}

export default Informacoes