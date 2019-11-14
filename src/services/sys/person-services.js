/*
* @author huangzhijie
* @date   19.3.14
* @description 系统管理-人员、部门请求接口
*/
import rbHttp from 'assets/js/utility/rb-http.factory'

export default class PersonServiceFactory {
  // 3.3.1	新增部门
  static addDepartment (obj) {
    const params = {
      parentId: obj.parent,
      name: obj.name,
      // no: 110,
      deptType: obj.type,
      descr: obj.descr
      // level: 0
    }
    return rbHttp.sendRequest({
      method: 'POST',
      params: params,
      url: '/v1/department/insert'
    })
  }
  // 3.3.2	修改部门
  static updateDepartment (obj) {
    const params = {
      name: obj.name,
      descr: obj.descr,
      departmentId: obj.id,
      parentId: obj.parent_id
    }
    return rbHttp.sendRequest({
      method: 'PUT',
      params: params,
      url: `/v1/department/${obj.id}`
    }).then(function (data) {
      return data
    })
  }
  // 3.3.3	删除部门
  static deleteDepartment (id) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: {
        departmentId: id
      },
      url: `/v1/department/${id}`
    })
  }
  // 3.3.4	部门列表查询
  static getDepartmentTree () {
    const params = {}
    return rbHttp.sendRequest({
      method: 'POST',
      params: params,
      addNamespace: false,
      url: '/v1/department/queryTree'
    })
  }
  // 3.3.4-2	部门列表查询
  static getDepartmentAllList () {
    return rbHttp.sendRequest({
      method: 'POST',
      addNamespace: false,
      url: '/v1/department/queryList'
    })
  }

  // 3.3.5	部门详细信息查询
  static getDepartmentDetail (id) {
    const params = {}
    return rbHttp.sendRequest({
      method: 'GET',
      params: params,
      url: `/v1/department/${id}`
    })
  }
  // 3.4.1	新增人员
  static addPerson (obj, picture) {
    const params = {
      name: obj.name,
      userType: parseInt(obj.userType),
      deptIds: obj.departid,
      // deptIds: obj.deptIds,
      no: obj.no,
      sex: obj.sex,
      mail: obj.mail,
      address: obj.address,
      phone: obj.phone,
      mobile: obj.mobile,
      fax: obj.fax,
      code: obj.code,
      descr: obj.descr,
      post: obj.post,
      relationPerson: obj.relationPerson
      // ldapId: 889234
    }
    const formData = new FormData()
    formData.append('picture', picture)
    return rbHttp.sendRequest({
      method: 'POST',
      params: params,
      data: formData,
      useFormData: true,
      url: '/v1/user/insert'
    })
  }
  // 3.4.2	修改人员
  static updatePerson (id, obj, picture) {
    const params = {
      user_id: id,
      name: obj.name,
      userType: obj.userType,
      deptIds: obj.departid,
      // deptIds: obj.deptIds,
      no: obj.no,
      sex: obj.sex,
      mail: obj.mail,
      address: obj.address,
      phone: obj.phone,
      mobile: obj.mobile,
      fax: obj.fax,
      code: obj.code,
      descr: obj.descr,
      post: obj.post,
      relationPerson: obj.relationPerson
      // ldapId: 889234
    }

    const formData = new FormData()
    formData.append('picture', picture)
    return rbHttp.sendRequest({
      method: 'POST',
      params: params,
      data: formData,
      useFormData: true,
      url: `/v1/user/update/${id}`
    })
  }
  // 3.4.3	删除人员
  static deletePerson (id) {
    return rbHttp.sendRequest({
      method: 'DELETE',
      params: {
        userId: id
      },
      url: `/v1/user/${id}`
    })
  }
  // 3.4.4	列表查询
  static getPersonListAll (userType = 1, isNull) {
    const params = isNull ? { userType: userType, ldapId: isNull } : { userType: userType }
    return rbHttp.sendRequest({
      method: 'POST',
      params: params,
      addNamespace: false,
      url: '/v1/user/queryList'
    })
  }

  static getPersonLists (data) {
    return rbHttp.sendRequest({
      method: 'POST',
      params: data,
      addNamespace: false,
      url: '/v1/user/queryList'
    })
  }
  // 3.4.5	分页列表查询
  static getPersonList (deptId, pageSize = 10, pageNo = 1, search) {
    const params = {
      pageSize: pageSize,
      pageNo: pageNo
    }
    if (deptId) {
      params.deptId = deptId
    }
    if (search) {
      params.search = search
    }
    return rbHttp.sendRequest({
      method: 'POST',
      params: params,
      addNamespace: false,
      url: '/v1/user/pageList'
    })
  }
  // 3.4.6	人员详细信息查询
  static getPersonDetail (id) {
    return rbHttp.sendRequest({
      method: 'GET',
      params: {
        userId: id
      },
      url: `/v1/user/${id}`
    })
  }
  static batchModifyDeptIdByUserId (deptId, userIds) {
    return rbHttp.sendRequest({
      method: 'PUT',
      params: {
        dept_id: deptId,
        user_ids: userIds
      },
      url: `/v1/user/batchModifyDeptId`
    })
  }
  // 3.4.7	人员批量导入
  static personImport () {
    return {
      url: '/zuul/v1/user/importExcel',
      header: {
        method: 'POST',
        head_orgAccount: 'alauda',
        head_userName: sessionStorage.getItem('username'),
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      }
    }
  }
  // static excelImport () {
  //   return rbHttp.sendRequest({
  //     method: 'POST',
  //     // params: {
  //     //   userId: id
  //     // },
  //     url: `/v1/user/importExcel`
  //   })
  // }
  // 3.4.8	人员批量导出
  static persionExport (deptId, searchText) {
    let param = {}
    if (deptId) {
      param.deptId = deptId
    }
    if (searchText) {
      param.code = searchText
    }
    return rbHttp.sendRequest({
      method: 'POST',
      params: param,
      binary: true,
      url: '/v1/user/exportExcel'
    })
  }
  // 3.4.9	导入人员模块下载
  static personmodDownload () {
    return rbHttp.sendRequest({
      method: 'POST',
      binary: true,
      url: '/v1/user/excel/import/template'
    })
  }
}
