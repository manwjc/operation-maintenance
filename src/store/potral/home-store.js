import cookieService from 'src/services/cookie.service.js'
export default {
  state: {
    dictObj: {},
    breadcrumb: [],
    project: cookieService.getCookie('project'),
    // mirror新增
    // inspectItems: [],
    // devices: [],
    // 任务增改时所用
    template: {},
    template_id: '',
    update_template_id: '',
    // 批量关联巡检项
    batch: false,
    // 任务详情跳转到任务运行管理
    task_id: '',
    // 用于任务修改
    update_task_id: '',
    // 是展示列表还是单个区分进入任务运行
    task_state: false,
    // 报告详情
    report_id: '',
    // 模板新增设备巡检业务通用
    temDevi: [],
    // 设备新增后模板实时获取巡检业务通用
    temState: false,
    // 主题修改
    update_theme_id: '',
    // 业务模板设备新增
    bizTemDevices: [],
    operResource: [],
    loginValid: false,
    bizSystemList: [],
    podList: [],
    idcTypeList: [],
    onlineTopoMap: {}
  },
  mutations: {
    modifyLogValid(state, obj) {
      state.loginValid = obj
    },
    modifyOperResource(state, obj) {
      state.operResource = obj
    },
    modifyDictObj(state, obj) {
      state.dictObj = obj
    },
    modifyBreadcrumb(state, array) {
      state.breadcrumb = array
    },
    setProject(state, project) {
      state.project = project
      cookieService.setCookie('project', project)
    },
    // 新增
    // 批次增加模板修改
    batchItem(state, str) {
      state.template_id = str
    },
    changeBatch(state, bool) {
      state.batch = bool
    },
    updateTemplate(state, str) {
      state.update_template_id = str
    },
    // 增加巡检项设备 未联调
    // addItems (state, array) {
    //   state.inspectItems = array
    // },
    // deleteItems (state, obj) {
    //   let index = state.inspectItems.indexOf(obj)
    //   state.inspectItems.splice(index, 1)
    // },
    // adDevices (state, array) {
    //   state.devices = array
    // },
    // deleteDevices (state, obj) {
    //   let index = state.devices.indexOf(obj)
    //   state.devices.splice(index, 1)
    // },
    // 任务编辑模板设备
    editTemplate(state, obj) {
      state.template = obj
    },
    editTemplate1(state, obj) {
      state.template.template_name = obj.name
      state.template.template_id = obj.template_id
      state.template.mon_type = obj.mon_type
    },
    editDevices(state, obj) {
      state.template = obj
    },
    editDevices1(state, arr) {
      // 名称
      state.template.devices_ip_more = arr[0]
      state.template.instanceId = arr[1]
    },
    // 任务详情修改及报告
    // 从任务列表中进入到任务运行
    taskDetail(state, str) {
      state.task_id = str
    },
    // 区分直接进入任务运行
    taskState(state, bool) {
      state.task_state = bool
    },
    updateDetail(state, str) {
      state.update_task_id = str
    },
    reportDetail(state, str) {
      state.report_id = str
    },
    // 模板新增设备
    temDevices(state, arr) {
      state.temDevi = arr
    },
    // 模板与业务模板共同state
    temDevState(state, bool) {
      state.temState = bool
    },
    // 修改主题
    updateTheme(state, str) {
      state.update_theme_id = str
    },
    // 业务模板新增设备
    bizTemDevi(state, arr) {
      state.bizTemDevices = arr
    },
    idcTypeList(state, arr) {
      state.idcTypeList = arr
    },
    podList(state, arr) {
      state.podList = arr
    },
    bizSystemList(state, arr) {
      state.bizSystemList = arr
    },
    onlineTopoMap(state, obj) {
      state.onlineTopoMap = obj
    },
  }

}
