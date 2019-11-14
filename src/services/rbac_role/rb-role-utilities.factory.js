import _ from 'lodash'
import rbRoleDataService from './rb-role-data-service.factory.js'
export default class rbRoleUtilities {
  static async resourceTypeSupportPermissions (resource_type, action = 'create') {
    if (_.isArray(action)) {
      const permissions = await rbRoleDataService.getContextPermissions(resource_type)
      return action.map((item) => {
        return permissions.includes(`${resource_type}:${item}`)
      })
    } else {
      return (await rbRoleDataService.getContextPermissions(resource_type))
        .includes(`${resource_type}:${action}`)
    }
  }
  static async resourceHasPermission (resource_obj, resource_type, action) {
    if (!resource_obj) {
      return false
    }
    if (action === 'permission') {
      return false
    } else {
      const resource_actions = _.get(resource_obj, 'resource_actions') || []
      return resource_actions.includes(`${resource_type}:${action}`)
    }
  }
  // function getPermissionResourceDisplay(resource) {
  //   if (!resource || !_.isArray(resource)) {
  //     return translateFilter('none');
  //   }
  //   return ('<div>' + resource.join('</div><div>') + '</div>');
  // }
  //
  // function getPermissionActionsDisplay(actions) {
  //   if (!actions || !_.isArray(actions)) {
  //     return translateFilter('none');
  //   }
  //   return ('<div>' + actions.join('</div><div>') + '</div>');
  // }
  //
  // function getPermissionConstraintsDisplay(constraints) {
  //   if (!constraints || !_.isArray(constraints) || !constraints.length) {
  //     return translateFilter('none');
  //   }
  //   const arr = [];
  //   constraints.forEach((constraintObject) => {
  //     const _str = Object.keys(constraintObject).map((key) => {
  //       return `<div>${key}:${constraintObject[key]}</div>`;
  //     }).join('');
  //     arr.push(_str);
  //   });
  //
  //   return arr.map((block) => {
  //     return `<div class="rb-permission-constraints-block">${block}</div>`;
  //   }).join('');
  // }
  //
  // /**
  //  * check if a specified resource has a particular permission
  //  * @param resource_obj
  //  * @param resource_type eg: notification, service
  //  * @param permission eg: create, view, update ...
  //  */

  //
  // function getGlobalResourceTypes(schemaList) {
  //   return schemaList.filter((item) => {
  //     const constraintKeys = Object.keys(item.constraints);
  //     return item.resource !== '*' && !constraintKeys.includes('res:project');
  //   }).map((item) => {
  //     return item.resource;
  //   });
  // }
}
