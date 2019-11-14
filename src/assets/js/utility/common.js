import errorResponseHelper from 'src/services/util/error-response-helper.factory.js'
import {rbCapitalizeAll} from 'src/assets/js/utility/rb-filters.js'
import CN from 'src/assets/js/constant/rb_zh_cn.i18n.constant.js'
import Message from 'element-ui/packages/message'
import _ from 'lodash'
export default class Common {
  static _genericErrorMessage (message) {
    Message.error({
      dangerouslyUseHTMLString: true,
      message: message
    })
  }

  static _genericWarningMessage (message) {
    Message.warning({
      dangerouslyUseHTMLString: true,
      message: message
    })
  }

  static ajaxGenericOnError (response) {
    const errors = (response.data && response.data.errors) || []
    let fatalErrorMessage
    let fieldErrorMessage
    let fatalErrors = []
    let fieldErrors = []

    if (_.isEmpty(errors)) {
      // If no error presents, use the http status code instead
      const errorCode = errorResponseHelper.httpCodeMapper(response.status)
      fatalErrorMessage = CN[errorCode]
    } else {
      // ********** fatalErrors ********** //
      // filter out non-fatal errors
      fatalErrors = _.filter(errors, (error) => {
        return !_.includes(errorResponseHelper.nonFatalErrorCodes, error.code)
      })
      // filter out field errors, field errors should be handled in each biz-controller
      fatalErrors = _.filter(fatalErrors, (error) => {
        return _.isEmpty(error.fields)
      })
      // filter out duplicated error code
      fatalErrors = _.uniq(fatalErrors, (fatalError) => {
        return fatalError.code
      })
      fatalErrorMessage = _.map(fatalErrors, (fatalError) => {
        // code 'server_error' / 'unknown_issue' is not clear , use error message instead
        if ([ 'unknown_issue', 'server_error', 'invalid_args' ].includes(fatalError.code)) {
          return fatalError.message
        }
        // TODO: message parse for particular error code
        // code 'partial_permission_denied' used for rbac, parse message instead
        if (fatalError.code === 'partial_permission_denied') {
          const messageFields = JSON.parse(fatalError.message)
          const message = messageFields.map((field) => {
            return `${field.action} (${field.name})`
          }).join('<br>')
          return CN[fatalError.code] + '<br>' + message
        }
        // code 'dns_error ' used for set custom domain suffix
        if (fatalError.code === 'dns_error') {
          const messageFields = JSON.parse(fatalError.message)
          const message = messageFields.map((field) => {
            return `${field.domain} (${field.error})`
          }).join('<br>')
          return CN[fatalError.code] + '<br>' + message
        }
        // code 'project_resources_exist' used for project delete, parse message instead
        // code 'child_resources_exist' used for resource delete (when sub resources exist)
        if (['project_resources_exist', 'child_resources_exist'].includes(fatalError.code)) {
          let messageFields = JSON.parse(fatalError.message)
          messageFields = _.sortBy(messageFields, (item) => {
            return item.type
          })
          const message = messageFields.map((field) => {
            return `${rbCapitalizeAll(CN[field.type.toLowerCase()])}: ${field.name}`
          }).join('<br>')
          return CN[fatalError.code] + '<br>' + message
        }
        const translatedCode = CN[fatalError.code]
        // If the code is not translated, use the message instead
        return translatedCode || fatalError.message
      }).join('<br>')

      // ********** fieldErrors ********** //
      fieldErrors = _.filter(errors, (error) => {
        return !_.isEmpty(error.fields)
      })

      fieldErrorMessage = _.map(fieldErrors, (fieldError) => {
        const translatedCode = CN[fieldError.code]
        const field = _.get(fieldError.fields, '[0]', {}) // only deals with the first field object
        const message = Object.keys(field).map((key) => {
          const _message = _.isArray(field[ key ]) ? _.get(field[ key ], '[0]', 'field error') : field[ key ]
          return _message
        }).join('<br>')
        return (translatedCode || fieldErrors.message) + '<br>' + message
      }).join('<br>')
    }

    // Log out the user when API returns 401
    if (response.status === 401) {
      // setTimeout(() => $window.location.href = '/ap/logout', 0);
      // modify
      // const message = CN['logging_out']
      // this._genericErrorMessage(message)
      return
    }

    const errorMessage = fieldErrorMessage || fatalErrorMessage
    if (errorMessage !== '') {
      // For GET requests, we should not display the messages.
      // Except that the http status code in the blacklist:
      // 403 for permission denied, 502 for bad gateway such as Nginx crashed.
      if (!response.config ||
        response.config.method !== 'GET' ||
        [ 403, 502 ].includes(response.status)) {
        if (response.status === 409) {
          this._genericWarningMessage(errorMessage)
        } else {
          // this._genericErrorMessage(errorMessage)
        }
      }
    }
  }
}
