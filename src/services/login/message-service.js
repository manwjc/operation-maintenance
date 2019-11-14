import rbHttp from 'assets/js/utility/rb-http.factory'
export default class messageService {
  static async sendSmsCaptcha (param) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: param,
      url: `/v1/user/sendSmsCaptcha`
    })
  }
  static async validSmsCaptcha (param) {
    return rbHttp.sendRequest({
      method: 'PUT',
      params: param,
      url: `/v1/user/validSmsCaptcha`
    })
  }
}
