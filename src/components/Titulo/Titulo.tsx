function Titulo(props: { titulo: string }) {
  return (
    <section>
      <div className="flex flex-col items-center bg-cc-cinza mb-[2vh] min-w-[200px] w-[20vw] pb-[2vh] rounded-b-4xl">
        <h1>{props.titulo}</h1>
      </div>
    </section>
  )
}

export default Titulo