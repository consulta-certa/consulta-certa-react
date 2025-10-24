import { Link } from 'react-router-dom'
import Linha from '../../components/Linha/Linha'
import Titulo from '../../components/Titulo/Titulo'

function Informacoes () {
  const m = [
    {
      titulo: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci, quisquam!',
      texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, facilis! Neque placeat quidem similique, ipsa voluptates nobis nesciunt culpa fugit soluta in, error voluptate architecto distinctio, nam consequuntur porro earum. Harum ut vitae in quasi tenetur provident, nostrum amet saepe sed earum numquam mollitia quae officiis deleniti, doloremque aliquam quaerat! Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, facilis! Neque placeat quidem similique, ipsa voluptates nobis nesciunt culpa fugit soluta in, error voluptate architecto distinctio, nam consequuntur porro earum. Harum ut vitae in quasi tenetur provident, nostrum amet saepe sed earum numquam mollitia quae officiis deleniti, doloremque aliquam quaerat!',
      imagem: ''
    },
    {
      titulo: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci, quisquam!',
      texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, facilis! Neque placeat quidem similique, ipsa voluptates nobis nesciunt culpa fugit soluta in, error voluptate architecto distinctio, nam consequuntur porro earum. Harum ut vitae in quasi tenetur provident, nostrum amet saepe sed earum numquam mollitia quae officiis deleniti, doloremque aliquam quaerat! Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, facilis! Neque placeat quidem similique, ipsa voluptates nobis nesciunt culpa fugit soluta in, error voluptate architecto distinctio, nam consequuntur porro earum. Harum ut vitae in quasi tenetur provident, nostrum amet saepe sed earum numquam mollitia quae officiis deleniti, doloremque aliquam quaerat!',
      imagem: ''
    },
    {
      titulo: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci, quisquam!',
      texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, facilis! Neque placeat quidem similique, ipsa voluptates nobis nesciunt culpa fugit soluta in, error voluptate architecto distinctio, nam consequuntur porro earum. Harum ut vitae in quasi tenetur provident, nostrum amet saepe sed earum numquam mollitia quae officiis deleniti, doloremque aliquam quaerat! Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, facilis! Neque placeat quidem similique, ipsa voluptates nobis nesciunt culpa fugit soluta in, error voluptate architecto distinctio, nam consequuntur porro earum. Harum ut vitae in quasi tenetur provident, nostrum amet saepe sed earum numquam mollitia quae officiis deleniti, doloremque aliquam quaerat!',
      imagem: ''
    },
    {
      titulo: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci, quisquam!',
      texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, facilis! Neque placeat quidem similique, ipsa voluptates nobis nesciunt culpa fugit soluta in, error voluptate architecto distinctio, nam consequuntur porro earum. Harum ut vitae in quasi tenetur provident, nostrum amet saepe sed earum numquam mollitia quae officiis deleniti, doloremque aliquam quaerat! Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, facilis! Neque placeat quidem similique, ipsa voluptates nobis nesciunt culpa fugit soluta in, error voluptate architecto distinctio, nam consequuntur porro earum. Harum ut vitae in quasi tenetur provident, nostrum amet saepe sed earum numquam mollitia quae officiis deleniti, doloremque aliquam quaerat!',
      imagem: ''
    }
  ]

  return (
    <main className='main'>
      <Titulo titulo='Saiba mais' />
      <section>
        <h2 className='titulo-2'>Saiba mais sobre sua teleconsulta</h2>
        <Linha />
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur eum
          similique tempora commodi beatae rerum debitis in inventore ipsum,
          laboriosam nostrum esse.
        </p>
      </section>
      <section>
        <ul className='flex w-[60vw] max-lg:w-[80vw] min-w-[280px] flex-wrap justify-center mt-[4vh] gap-x-[2%] gap-y-[4vh] [&_li]:p-4 [&_li]:bg-cc-azul [&_li]:text-white [&_li]:rounded-xl [&_li]:max-w-[48%] [&_p]:text-sm [&_p]:opacity-75'>
          <li>
            <Link to='/informacao/:name'>
              <img src={m[0].imagem} alt='' className='h-40 w-full object-cover' />
              <h3>{m[0].titulo}</h3>
              <p>{m[0].texto.slice(0, 100)}...</p>
            </Link>
          </li>
          <li>
            <Link to='/informacao/:name'>
              <img src={m[1].imagem} alt='' className='h-40 w-full object-cover' />
              <h3>{m[1].titulo}</h3>
              <p>{m[1].texto.slice(0, 100)}...</p>
            </Link>
          </li>
        </ul>
      </section>
      <section className='w-full'>
        {m.length ? (
          <ul className='gap-4 [&_li]:p-4 [&_li]:shadow-md [&_li]:rounded-lg'>
            {m.map((n, index) => (
              <li key={index}>
                <Link to='/informacao/:name' className='flex gap-4 items-center'>
                  <img src={m[0].imagem} alt='' className='size-20 object-cover' />
                  <div>
                    <h3>{n.titulo}</h3>
                    <p>{n.texto.slice(0, 50)}...</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className='server-error'>Conteúdo indisponível, servidor fora do ar.</p>
        )}
      </section>
    </main>
  )
}

export default Informacoes
