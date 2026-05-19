export const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]

export function getCurrentMonthKey() {
  const date = new Date()

  return formatMonthKey(
    date.getFullYear(),
    date.getMonth() + 1
  )
}

export function formatMonthKey(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

export function getMonthDifference(start, end) {
  const [y1, m1] = start.split('-').map(Number)
  const [y2, m2] = end.split('-').map(Number)

  return (y2 - y1) * 12 + (m2 - m1)
}

export function generateMonthOptions() {
  const result = []

  const currentYear = new Date().getFullYear()

  for (let year = currentYear - 1; year <= currentYear + 2; year++) {
    for (let month = 1; month <= 12; month++) {
      result.push({
        key: formatMonthKey(year, month),
        label: `${months[month - 1]} ${year}`
      })
    }
  }

  return result
}