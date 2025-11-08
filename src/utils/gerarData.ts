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