/*
* Mirror 项目
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class rbAlertNetworkStrategyFactory {
  static async getFillWallData (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/network/fillWall`,
      params: req
    }).then(function (data) {
      return data
    })
  }

  static async getLoadBalancerData (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/network/loadBalancer`,
      params: req
    }).then(function (data) {
      return data
    })
  }

  static async getPublicNetData (req) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/alerts/network/publicNet`,
      params: req
    }).then(function (data) {
      return data
    })
  }

  static async exportFillWallData (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/network/fillWall/export`,
      binary: true,
      params: req
    }).then(function (data) {
      return data
    })
  }

  static async exportLoadBalancerData (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/network/loadBalancer/export`,
      binary: true,
      params: req
    }).then(function (data) {
      return data
    })
  }

  static async exportPublicNetData (req) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `/v1/alerts/network/publicNet/export`,
      binary: true,
      params: req
    }).then(function (data) {
      return data
    })
  }
}
