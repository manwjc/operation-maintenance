import rbHttp from 'assets/js/utility/rb-http.factory'
const CONFIGURATION_ENDPOINT = '/v1/storage/'
const namespace = sessionStorage.getItem('namespace')
export default class rbStorageVolumeService {
  static async list ({regionId, pageno, size}) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${CONFIGURATION_ENDPOINT}${namespace}/volumes`,
      params: {
        'region_id': regionId,
        'pageno': pageno,
        'size': size
      }
    }).then((data) => {
      return data
    })
  }

  static async deleteVolume (volumeId) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      url: `${CONFIGURATION_ENDPOINT}${namespace}/volumes/${volumeId}`
    })
  }

  static async detailVolume (volume_id) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${CONFIGURATION_ENDPOINT}${namespace}/volumes/${volume_id}`
    }).then((data) => {
      return data
    })
  }

  static async region ({
                         region_id
                       }) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${CONFIGURATION_ENDPOINT}${namespace}/cluster/`,
      params: { 'region_id': region_id }
    }).then((data) => {
      return data
    })
  }

  static async volumeSize ({
                             cluster_id, region_id
                           }) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${CONFIGURATION_ENDPOINT}${namespace}/cluster/${cluster_id}/size`,
      params: { 'region_id': region_id }
    }).then((data) => {
      return data
    })
  }
  static async createVolume (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      url: `${CONFIGURATION_ENDPOINT}${namespace}/volumes`,
      data
    }).then((data) => {
      return data
    })
  }
  static async getDriver (region_name) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `${CONFIGURATION_ENDPOINT}${namespace}/${region_name}/drivers`
    }).then((data) => {
      return data
    })
  }
  static async getSpace (region_name) {
    return rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/regions/${namespace}/region/knamespaces`,
      params: {
        'region_name': region_name
      }
    }).then((data) => {
      return data
    })
  }
}
