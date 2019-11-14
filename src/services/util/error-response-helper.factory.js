// Error codes below will NOT show the error notification toast at the global level
const nonFatalErrorCodes = [
  // Landing:
  'user_not_exist',
  // Profile:
  'invalid_old_password',
  // yaml validation exception
  'yaml_error',
  // check repo exist
  'repo_not_exist',
  // image tag third party api exception
  'tag_list_third_party_api_exception',
  'image_layer_third_party_api_exception',
  // image tag alauda api exception
  'tag_list_alauda_api_exception',
  'image_layer_alauda_api_exception'

  // Backend does not return code correctly sometimes after validating form fields:
  // TODO: There maybe some errors not listed here, append them:
]

// Http code -> error code
function httpCodeMapper (code) {
  if (code === 400) {
    return 'malformed_request'
  } else if (code === 401) {
    return 'incorrect_authentication_credentials'
  } else if (code >= 500) {
    return 'server_error'
  }
}

export default {nonFatalErrorCodes, httpCodeMapper}
