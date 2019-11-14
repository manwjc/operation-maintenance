function rbDelay (milliseconds) {
  return new Promise(res => {
    return setTimeout(res, milliseconds)
  }, () => {})
}
export default rbDelay
