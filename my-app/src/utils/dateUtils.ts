export const getWeeksInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const totalDays = lastDay.getDate()
  
    const startWeekDay = (firstDay.getDay() + 6) % 7 // Ajustar para que Lunes sea 0
    const monthName = firstDay.toLocaleString('es-ES', { month: 'long' })
  
    const weeks = []
    let day = 1
    let weekNumber = getWeekNumber(firstDay)
  
    while (day <= totalDays) {
      const week = Array(7).fill(null)
      for (let i = 0; i < 7 && day <= totalDays; i++) {
        const date = new Date(year, month, day)
        const dayOfWeek = (date.getDay() + 6) % 7
        if ((weeks.length === 0 && dayOfWeek >= startWeekDay) || weeks.length > 0) {
          week[dayOfWeek] = day
          day++
        }
      }
      weeks.push({ weekNumber: weekNumber++, days: week })
    }
  
    return { weeks, monthName: capitalize(monthName) }
  }
  
  const getWeekNumber = (date: Date): number => {
    const temp = new Date(date.getFullYear(), 0, 1)
    const diff = date.getTime() - temp.getTime()
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1
  }
  
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
  