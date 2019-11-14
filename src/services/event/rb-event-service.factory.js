/**
 * Created by jiangfuyi on 2018-1-9.
 */
import rbHttp from 'assets/js/utility/rb-http.factory.js'
import rbAccountService from '../rb-account-service.factory.js'

const namespace = rbAccountService.getCurrentNamespace()
const URL = `/v1/events/${namespace}/`

export default class eventService {
  // params: namespace, event_type, pk, start_time, end_time, pageno
  static async eventList (params) {
    let endpoint
    const reqParams = {
      start_time: params.start_time / 1000,
      end_time: params.end_time / 1000,
      pageno: params.pageno,
      query_string: params.query_string,
      size: params.size
    }

    const event_pk = params.event_pk
    const event_type = params.event_type
    const event_types = params.event_types

    if (!event_types) {
      if (!event_pk) {
        endpoint = URL
      } else {
        endpoint = URL + event_type + '/' + event_pk
      }
    } else {
      endpoint = URL
      if (!event_pk) {
        reqParams.resource_type = event_types
      } else {
        reqParams.resource_type = event_types
        reqParams.resource_id = event_pk
      }
    }

    return rbHttp.sendRequest({
      method: 'GET',
      url: endpoint,
      params: reqParams
    })
  }
}
