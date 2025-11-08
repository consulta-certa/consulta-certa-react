const formatador = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
})

const dataSplit = Object.fromEntries(formatador.formatToParts(new Date()).map(p => [p.type, p.value]))

export const agora = `${dataSplit.year}-${dataSplit.month}-${dataSplit.day}T${dataSplit.hour}:${dataSplit.minute}:${dataSplit.second}`

export const limparData = (data:string) => {
    const dia = data.substring(8, 10)
    const mes = data.substring(5, 7)
    const hora = data.substring(11, 13)
    const minuto = data.substring(14, 16)
    const dataLimpa = `${dia}/${mes} às ${hora}h${minuto}`

    return dataLimpa;
}