export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidCpf(cpf: string): boolean {
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i)
  let r = 11 - (sum % 11)
  if (r >= 10) r = 0
  if (r !== parseInt(d[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i)
  r = 11 - (sum % 11)
  if (r >= 10) r = 0
  return r === parseInt(d[10])
}

export function isAdult(birthDate: string): boolean {
  const parts = birthDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!parts) return false
  const [, day, month, year] = parts
  const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  if (isNaN(birth.getTime())) return false
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  const dayDiff = today.getDate() - birth.getDate()
  return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
}
