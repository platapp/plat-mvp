const MIN_IN_HOUR = 60
export const dateFormat = (date: Date) => {
    const offsetInMinutes = date.getTimezoneOffset()
    const sign = offsetInMinutes < 0 ? "-" : "+"
    const offsetPositiveInMinutes = Math.abs(offsetInMinutes)
    const offsetInHours = Math.floor(offsetPositiveInMinutes / MIN_IN_HOUR)
    const offsetRemainderInMinutes = offsetPositiveInMinutes - offsetInHours * MIN_IN_HOUR
    const offsetStr = offsetInHours.toString().padStart(2, '0') + offsetRemainderInMinutes.toString().padStart(2, '0')
    return date.toISOString().split(".")[0] + sign + offsetStr
}
