export const setSessionStorage = (key, value) => {
  if (!key) return
  let val = value
  if (typeof value !== 'string') {
    val = JSON.stringify(value)
  }
  window.sessionStorage.setItem(key, val)
}

export const getSessionStorage = (key) => {
  if (!key) return
  if (!window.sessionStorage.getItem(key)) return ''
  return window.sessionStorage.getItem(key)
}

export const removeSessionStorage = (key) => {
  if (!key) return
  window.sessionStorage.removeItem(key)
}
