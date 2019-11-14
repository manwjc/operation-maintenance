/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertVoiceNotifyServicesFactory {
  static async getAlertVoiceNotify () {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/voiceNotify/getAlertVoiceNotify`
    }).then(function (data) {
      return data
    })
  }
  static async createdAlertVoiceNotify (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: req,
      url: `/v1/alerts/voiceNotify/createdAlertVoiceNotify`
    }).then(function (data) {
      return data
    })
  }
  static async getAlertVoiceNotifyContent (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      data: req,
      url: `/v1/alerts/voiceNotify/getAlertVoiceNotifyContent`
    }).then(function (data) {
      return data
    })
  }
}
