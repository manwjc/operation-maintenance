import cookieService from './cookie.service'

export default class ProjectService {
  static get () {
    return cookieService.getCookie('project')
  }

  static set (project) {
    cookieService.setCookie('project', project)
  }
}
