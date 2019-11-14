/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertThirdServiceFactory {
  static async createSydLogAlert (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/third/create`,
      data: req
    }).then(function (data) {
      return data
    })
  }
}
