export default class rbAccountServiceFactory {
  static getCurrentNamespace () {
    return sessionStorage.getItem('namespace')
  }

  static getCurrentUsername () {
    return sessionStorage.getItem('username')
  }
}
