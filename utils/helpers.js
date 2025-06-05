export const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const getDayKeyFromDate = (dateString) => {
  const date = new Date(dateString)
  const dayOfWeek = date.getDay() // 0 (Domingo) a 6 (Sábado)

  const dayMap = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
    7: 'everyday',
  }

  return dayMap[dayOfWeek]
}
