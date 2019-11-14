<template>
  <div>
    <el-form class="yw-form is-required"
             ref="addForm"
             :model="addForm"
             :rules="addFormRules"
             label-width="100px">
      <el-form-item label="规则名称"
                    prop="name">
        <el-input v-model="addForm.name"></el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="addForm.isOpen"
                   :disabled="isDisabled"></el-switch>
      </el-form-item>
      <el-form-item label="告警筛选器"
                    prop="alertFilter">
        <el-select v-model="addForm.alertFilter"
                   placeholder="请选择"
                   filterable
                   clearable
                   @change="getAlertFilterScenes()"
                   @clear="clearAlertFilter()">
          <el-option v-for="(val, valIndex) in filterData"
                     :key="val.id"
                     :label="val.name"
                     :value="val.id"></el-option>
        </el-select>
        <el-button v-if="addForm.detailShow"
                   type="text"
                   size="mini"
                   @click="goFilter()">添加筛选</el-button>
      </el-form-item>
      <el-form-item label="告警筛选场景"
                    prop="alertFilterScene">
        <el-select v-model="addForm.alertFilterScene"
                   placeholder="请选择"
                   filterable
                   clearable>
          <el-option v-for="(val, valIndex) in alertFilterScenes"
                     :key="val.sceneId"
                     :label="val.sceneName"
                     :value="val.sceneId"></el-option>
        </el-select>
        <el-button v-if="addForm.detailShow"
                   type="text"
                   size="mini"
                   @click="goAlertFilterScene()">添加场景</el-button>
      </el-form-item>
      <el-form-item label="通知类型配置:"
                    prop="notifyAlertType">
        <el-checkbox-group v-model="addForm.notifyAlertType">
          <el-checkbox label="-1"
                       name="type">告警产生</el-checkbox>
          <el-checkbox label="0"
                       name="type">告警转派</el-checkbox>
          <el-checkbox label="1"
                       name="type">告警确认</el-checkbox>
          <el-checkbox label="2"
                       name="type">告警派单</el-checkbox>
          <el-checkbox label="3"
                       name="type">告警清除</el-checkbox>
          <el-checkbox label="4"
                       name="type">告警通知</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="通知发送对象:"
                    prop="addTableData">
        <div class="send-wrap">
          <div v-if="addForm.detailShow">
            <el-checkbox v-model="addForm.addPersonalChecked">个人</el-checkbox>
            <el-input v-model="addForm.addPersonalInput"
                      disabled=""
                      style="width: 150px"></el-input>
            <el-button type="text"
                       @click="clickPersonalCheck()">个人选择器</el-button>
            <span>通知方式:</span>
            <el-select v-model="addForm.notifyType"
                       placeholder="请选择"
                       filterable
                       style="width: 120px"
                       @change="notifyTypeChange()">
              <el-option value="0"
                         label="邮件/短信"></el-option>
              <el-option value="1"
                         label="邮件"></el-option>
              <el-option value="2"
                         label="短信"></el-option>
            </el-select>
            <el-button class="icon-input-add"
                       type="text"
                       @click="addNotifyObj()"
                       icon="el-icon-circle-plus-outline"></el-button>
          </div>
          <div class="yw-el-table-wrap">
            <el-table class="yw-el-table"
                      :data="addForm.addTableData"
                      stripe
                      border
                      tooltip-effect="dark"
                      height="170px">
              <el-table-column prop="notifyObjType"
                               label="通知对象类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.notifyObjType = 2">个人</span>
                  <span v-else-if="scope.row.notifyObjType = 1">团队</span>
                </template>
              </el-table-column>
              <el-table-column prop="notifyObjInfo"
                               label="通知对象信息"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="notifyType"
                               label="通知方式"></el-table-column>
              <el-table-column prop="operation"
                               label="操作"
                               v-if="addForm.detailShow">
                <template slot-scope="scope">
                  <el-button type="text"
                             size="small"
                             @click="deleteUser(scope.row.uuid)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="重发策略配置:">
        <span>是否重发:</span>
        <span style="padding-left: 5px;">
          <el-switch v-model="addForm.isRecurrenceInterval"></el-switch>
        </span>
        <span v-if="addForm.isRecurrenceInterval">
          <span style="padding-left: 20px;">重发间隔:</span>
          <span style="padding-left: 5px;">
            <el-input v-model="addForm.recurrenceInterval"
                      style="width: 50px;"></el-input>
          </span>
          <span style="padding-left: 5px;">
            <el-select v-model="addForm.recurrenceIntervalUtil"
                       placeholder=""
                       class="list-sel"
                       style="width: 60px">
              <el-option value="m"
                         label="分"></el-option>
              <el-option value="h"
                         label="时"></el-option>
            </el-select>
          </span>
        </span>
      </el-form-item>
      <el-form-item label="邮件发送方式:"
                    v-if="addForm.emailTypeShow">
        <el-radio-group v-model="addForm.emailType">
          <el-radio label="1">合并</el-radio>
          <el-radio label="2">单条</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发送时间段:">
        <span>
          <el-radio-group v-model="addForm.period" size="mini" @change="periodChange()">
            <el-radio label="0">全天</el-radio>
            <el-radio label="1">自定义时段</el-radio>
          </el-radio-group>
        </span>
        <span style="padding-left: 20px;" v-if="addForm.periodFlag">
          <el-select v-model="addForm.startPeriod" style="width: 60px;">
            <el-option
              v-for="item in period_option"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </span>
        <span v-if="addForm.periodFlag">-</span>
        <span style="padding-left: 20px;" v-if="addForm.periodFlag">
          <el-select v-model="addForm.endPeriod" style="width: 60px;">
            <el-option
              v-for="item in period_option"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </span>
      </el-form-item>

    </el-form>

    <!-- dialog -->
    <!-- 个人用户选择器 -->
    <el-dialog class="yw-dialog"
               title="用户选择"
               :visible.sync="personalChooseDialog"
               width="700px"
               :modal="false"
               :close-on-click-modal="false">
      <section class="yw-dialog-main">
        <el-row>
          <el-col :span="6">
            <div class="com-tree">
              <div>
                <el-input placeholder="输入关键字进行过滤"
                          class="search-box"
                          v-model="filterText"></el-input>
              </div>
              <div class="yw-el-tree">
                <el-tree ref="departmentTree"
                         :data="data"
                         :filter-node-method="filterNode"
                         node-key="uuid"
                         :props="defaultProps"
                         :default-checked-keys="defaultCheckedKeys"
                         :default-expanded-keys="deviceAuthDataExpanded"
                         @node-click="handleNodeClick">
                </el-tree>
              </div>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="com-tree">
              <el-row>
                <el-col :span="18">
                  <el-input class="search-box"
                            style="width: 300px;"
                            v-model="searchText"
                            placeholder="请输入用户名/真实姓名/手机号/邮箱">
                    <i slot="suffix"
                       class="el-input__icon el-icon-search"
                       @click="searchPersionList"></i></el-input>
                </el-col>
                <el-col :span="6">
                  <el-button type="text"
                             icon="el-icon-plus"
                             @click="customizeUserDialog = true">自定义用户</el-button>
                </el-col>
              </el-row>
              <div class="yw-el-table-wrap">
                <el-table class="yw-el-table"
                          :data="userData"
                          stripe
                          border
                          tooltip-effect="dark"
                          @selection-change="handleSelectionChange">
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column prop="name"
                                   label="姓名"></el-table-column>
                  <el-table-column prop="mobile"
                                   label="手机号"
                                   width="100"></el-table-column>
                  <el-table-column show-overflow-tooltip
                                   prop="mail"
                                   label="邮箱"></el-table-column>
                  <el-table-column prop="post"
                                   label="职责"></el-table-column>
                </el-table>
              </div>

            </div>
          </el-col>
        </el-row>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="personalChooseSubmit()">确定</el-button>
        <el-button @click="personalChooseCancel()">取消</el-button>
      </section>
    </el-dialog>

    <el-dialog class="yw-dialog"
               title="自定义用户"
               :visible.sync="customizeUserDialog"
               width="380px"
               :modal="false"
               :close-on-click-modal="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :model="customizeUserFrom"
                 :rules="customizeUserFromRules"
                 ref="customizeUserFrom"
                 label-width="70px">
          <el-form-item label="姓名"
                        prop="name">
            <el-input v-model="customizeUserFrom.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号"
                        prop="mobile">
            <el-input v-model="customizeUserFrom.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="mail">
            <el-input v-model="customizeUserFrom.mail"></el-input>
          </el-form-item>
          <el-form-item label="职责"
                        prop="post">
            <el-input v-model="customizeUserFrom.post"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="customizeUserSubmit('customizeUserFrom')">确定</el-button>
        <el-button @click="resetCustomizeUserForm('customizeUserFrom')">取消</el-button>
      </section>
    </el-dialog>
  </div>
</template>

<script>
import personDataService from 'src/services/sys/person-services.js'
import rbAlertFilterServicesFactory from 'src/services/alert/rb-alertFilter-services.factory.js'
import rbAlertFilterSceneServicesFactory from 'src/services/alert/rb-alertFilterScene-services.factory.js'
import { period_option } from 'src/pages/mirror_alert/alert/config/options.js'
export default {
  components: {
  },
  props: [
    'type', 'alertNotifyConfigDetail'
  ],
  data () {
    return {
      isDisabled: false,
      period_option: period_option,
      addForm: {
        uuid: '',
        name: '',
        isOpen: false,
        alertFilter: '',
        alertFilterScene: '',
        notifyAlertType: [],
        detailShow: true,
        addPersonalChecked: false,
        addPersonalInput: '',
        notifyType: '',
        userList: [],
        addTableData: [],
        isRecurrenceInterval: false,
        recurrenceInterval: '',
        recurrenceIntervalUtil: 'm',
        emailType: '1',
        emailTypeShow: false,
        period: '0',
        periodFlag: false,
        startPeriod: '0',
        endPeriod: '23'
      },
      addFormRules: {
        name: [
          { required: true, message: '请先输入告警通知配置名称!', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符!', trigger: 'blur' }
        ],
        alertFilter: [
          { required: true, message: '请先选择告警过滤配置!' }
        ],
        alertFilterScene: [
          { required: true, message: '请先选择告警过滤场景!' }
        ],
        notifyAlertType: [
          { required: true, message: '请输入告警通知配置名称!', trigger: 'blur' }
        ]
        //          addTableData: [
        //            { required: true, message: '请输入告警通知配置名称!' }
        //          ]
      },
      personalChooseDialog: false,
      data: [],
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      defaultCheckedKeys: [],
      deviceAuthDataExpanded: [],
      userData: [],
      userList: [],
      multipleSelection: [],
      filterData: [],
      alertFilterScenes: [],
      customizeUserDialog: false,
      customizeUserList: [],
      customizeUserFrom: {
        uuid: '',
        post: '',
        name: '',
        mobile: '',
        mail: ''
      },
      customizeUserFromRules: {
        //          post: [
        //            { required: true, message: '请输入用户名称(代号)!', trigger: 'blur' }
        //          ],
        name: [
          { required: true, message: '请输入用户真是名称!', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机号码!', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入用户邮箱!', trigger: 'blur' }
        ]
      },
      selectedDepartmentId: '',
      filterText: '',
      searchText: ''
    }
  },
  mounted () {
    this.getDepartment()
    this.initFilter()
  },
  methods: {
    // 1 element相关方法 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleNodeClick (data, node, arr) {
      //        if (data.parent_id === '') {
      //          this.selectedDepartmentId = ''
      //        } else {
      //          this.selectedDepartmentId = data.uuid
      //        }
      this.selectedDepartmentId = data.uuid
      this.getPersionList(data.uuid)
    },
    filterNode (value, data, node) {
      if (!value) return true
      return node.label.indexOf(value) !== -1
    },
    getDepartment () {
      personDataService.getDepartmentTree().then((res) => {
        this.data = res
        if (res.length > 0) {
          this.deviceAuthDataExpanded = [res[0].uuid]
          this.selectedDepartmentId = res[0].uuid
          this.getPersionList(res[0].uuid)
        }
      })
    },
    searchPersionList () {
      if (!this.selectedDepartmentId) {
        this.$alert('请先选择部门!', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      personDataService.getPersonList(this.selectedDepartmentId, 10000, 1, this.searchText).then((res) => {
        if (res) {
          this.userData = res.result
        }
      })
    },
    getPersionList (deptId) {
      personDataService.getPersonList(deptId, 10000, 1, '').then((res) => {
        if (res) {
          this.userData = res.result
        }
      })
      //        personDataService.getPersonLists(obj).then((res) => {
      //          if (res) {
      //            this.userData = res
      //          }
      //        })
    },
    initFilter () {
      rbAlertFilterServicesFactory.getAll(true).then((res) => {
        if (res) {
          this.filterData = res
        }
      })
    },
    goFilter () {
      this.$router.push({ path: '/mirror_alert/filter/list/' })
    },
    goAlertFilterScene () {
      this.$router.push({ path: '/mirror_alert/filter/scene/list/' })
    },
    getAlertFilterScenes () {
      rbAlertFilterServicesFactory.getFilterScene(this.addForm.alertFilter).then((res) => {
        this.alertFilterScenes = res
      })
    },
    getByKey (id) {
      rbAlertFilterSceneServicesFactory.getByKey(id).then((res) => {
        this.addForm.alertFilterScene = res.name
      })
    },
    getFilterByFilterId (id) {
      rbAlertFilterServicesFactory.getByKey(id).then((res) => {
        this.addForm.alertFilter = res.name
      })
    },
    clearAlertFilter () {
      if (!this.addForm.alertFilter) {
        this.addForm.alertFilterScene = ''
      }
    },
    notifyTypeChange () {
      if (this.addForm.notifyType === '1' || this.addForm.notifyType === '0') {
        this.addForm.emailTypeShow = true
      } else {
        this.addForm.emailTypeShow = false
      }
    },
    clickPersonalCheck () {
      if (!this.addForm.addPersonalChecked) {
        this.$alert('请先确认是否已选择用户类型(个人)', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.personalChooseDialog = true
    },
    personalChooseSubmit () {
      if (this.multipleSelection === 0) {
        this.$alert('请先选择用户!', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.userList = []
      let users = []
      this.multipleSelection.forEach((item) => {
        this.userList.push(item)
        users.push(item.name)
      })
      this.addForm.addPersonalInput = users.toString()
      this.personalChooseDialog = false
    },
    personalChooseCancel () {
      this.personalChooseDialog = false
      this.userData = []
    },
    getUuid () {
      let s = []
      let hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = '-'
      return s.join('')
    },
    validateMobile () {
      let reg = /^1[0-9][0-9]\d{8}$/
      return reg.test(this.customizeUserFrom.mobile)
    },
    validateEmail () {
      let reg = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/
      return reg.test(this.customizeUserFrom.mail)
    },
    customizeUserSubmit (formName) {
      if (!this.validateMobile()) {
        this.$alert('请输入正确的11位手机号码!', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      if (!this.validateEmail()) {
        this.$alert('请输入正确的邮箱!', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {
            'uuid': this.getUuid(),
            'post': this.customizeUserFrom.post,
            'name': this.customizeUserFrom.name,
            'mobile': this.customizeUserFrom.mobile,
            'mail': this.customizeUserFrom.mail
          }
          //            this.userData.push(obj)
          this.userData.splice(0, 0, obj)
          this.resetCustomizeUserForm('customizeUserFrom')
        } else {
          return false
        }
      })
    },
    resetCustomizeUserForm (formName) {
      this.customizeUserDialog = false
      this.$refs[formName].resetFields()
    },
    addNotifyObj () {
      if (!this.addForm.addPersonalChecked) {
        this.$alert('请先确认是否已选择用户类型(个人)', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      if (!this.addForm.notifyType) {
        this.$alert('请先选择告警通知类型!', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      if (!this.userList.length > 0) {
        this.$alert('请先选择告警通知人!', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      let userData = []
      if (this.addForm.addTableData) {
        userData = this.addForm.addTableData
      }
      this.userList.forEach((item) => {
        let obj = {}
        obj.uuid = item.uuid
        obj.notifyObjType = this.addForm.addPersonalChecked ? '2' : '1'
        if (this.addForm.notifyType === '0') {
          obj.notifyObjInfo = item.name + '-' + item.mail + '-' + item.mobile
          obj.notifyType = '邮件/短信'
        } else if (this.addForm.notifyType === '1') {
          obj.notifyObjInfo = item.name + '-' + item.mail
          obj.notifyType = '邮件'
        } else if (this.addForm.notifyType === '2') {
          obj.notifyObjInfo = item.name + '-' + item.mobile
          obj.notifyType = '短信'
        }
        userData.push(obj)
      })
      let filterUserData = {}
      userData.forEach((item) => {
        if (filterUserData[item.uuid]) {
          let obj = filterUserData[item.uuid]
          if (obj.notifyType !== '邮件/短信' && obj.notifyType !== item.notifyType) {
            let objInfo = obj.notifyObjInfo.split('-')
            let objInfoName = ''
            for (let i = 0; i < objInfo.length - 1; i++) {
              objInfoName = objInfoName + '-' + objInfo[i]
            }
            let itemInfo = item.notifyObjInfo.split('-')
            if (obj.notifyType === '邮件') {
              obj.notifyObjInfo = objInfoName.substring(1, objInfoName.length) + '-' + objInfo[objInfo.length - 1] + '-' + itemInfo[itemInfo.length - 1]
            } else {
              obj.notifyObjInfo = objInfoName.substring(1, objInfoName.length) + '-' + itemInfo[itemInfo.length - 1] + '-' + objInfo[objInfo.length - 1]
            }
            obj.notifyType = '邮件/短信'
            filterUserData[item.uuid] = obj
          }
        } else {
          filterUserData[item.uuid] = item
        }
      })
      this.addForm.addTableData = []
      for (let i in filterUserData) {
        this.addForm.addTableData.push(filterUserData[i])
      }
      let user = []
      let type = []
      this.addForm.addTableData.forEach((item) => {
        let userSplit = item.notifyObjInfo.split('-')
        let userSplitLength = item.notifyType === '邮件/短信' ? userSplit.length - 2 : userSplit.length - 1
        let userSplitName = ''
        for (let i = 0; i < userSplitLength; i++) {
          userSplitName = userSplitName + '-' + userSplit[i]
        }
        user.push(userSplitName.substring(1, userSplitName.length))
        type.push(item.notifyType)
      })
      this.addForm.addPersonalInput = user.toString()
      if (type.indexOf('邮件/短信') > -1 || type.indexOf('邮件') > -1) {
        this.addForm.emailTypeShow = true
      }
      this.userList = []
    },
    deleteUser (id) {
      this.$confirm('确认删除?').then(() => {
        if (this.addForm.addTableData.length > 0) {
          for (let i = 0; i < this.addForm.addTableData.length; i++) {
            if (this.addForm.addTableData[i].uuid === id) {
              this.addForm.addTableData.splice(i, 1)
            }
          }
          let user = []
          this.addForm.addTableData.forEach(item => {
            let userSplit = item.notifyObjInfo.split('-')
            let userSplitLength = item.notifyType === '邮件/短信' ? userSplit.length - 2 : userSplit.length - 1
            let userSplitName = ''
            for (let i = 0; i < userSplitLength.length - 1; i++) {
              userSplitName = userSplitName + '-' + userSplit[i]
            }
            user.push(userSplitName.substring(1, userSplitName.length))
          })
          this.addForm.addPersonalInput = user.toString()
        }
      })
    },
    resetAddTableData () {
      this.addForm.addTableData = []
    },
    periodChange () {
      this.addForm.periodFlag = this.addForm.period === '1'
    }
  },
  watch: {
    alertNotifyConfigDetail: {
      handler: function () {
        if (this.alertNotifyConfigDetail) {
          this.addForm.uuid = this.alertNotifyConfigDetail.uuid
          this.addForm.name = this.alertNotifyConfigDetail.name
          if (this.alertNotifyConfigDetail.isOpen === 1) {
            this.addForm.isOpen = true
          }
          if (this.type === 'detail') {
            this.getFilterByFilterId(this.alertNotifyConfigDetail.alertFilterId)
            this.getByKey(this.alertNotifyConfigDetail.alertFilterSceneId)
          } else {
            this.addForm.alertFilterScene = this.alertNotifyConfigDetail.alertFilterSceneId
            this.addForm.alertFilter = this.alertNotifyConfigDetail.alertFilterId
            this.getAlertFilterScenes()
          }
          this.addForm.notifyAlertType = this.alertNotifyConfigDetail.notifyAlertType.split(',')
          this.addForm.addPersonalChecked = this.alertNotifyConfigDetail.personalNotifyObjFlag
          this.addForm.addPersonalInput = this.alertNotifyConfigDetail.personalNotifyObjLists
          this.addForm.addTableData = this.alertNotifyConfigDetail.notifyObjInfo
          if (this.alertNotifyConfigDetail.notifyType === '0') {
            this.addForm.emailTypeShow = true
            this.addForm.notifyType = '0'
          } else if (this.alertNotifyConfigDetail.notifyType === '1') {
            this.addForm.emailTypeShow = true
            this.addForm.notifyType = '1'
          } else if (this.alertNotifyConfigDetail.notifyType === '2') {
            this.addForm.notifyType = '2'
          }
          if (this.alertNotifyConfigDetail.isRecurrenceInterval === 1) {
            this.addForm.isRecurrenceInterval = true
            this.addForm.recurrenceInterval = this.alertNotifyConfigDetail.recurrenceInterval
            this.addForm.recurrenceIntervalUtil = this.alertNotifyConfigDetail.recurrenceIntervalUtil
          }
          this.addForm.emailType = this.alertNotifyConfigDetail.emailType.toString()
          this.addForm.period = this.alertNotifyConfigDetail.period
          if (this.addForm.period === '1') {
            this.addForm.periodFlag = true
            this.addForm.startPeriod = this.alertNotifyConfigDetail.startPeriod
            this.addForm.endPeriod = this.alertNotifyConfigDetail.endPeriod
          }
        }
      },
      immediate: true
    },
    type: {
      handler: function () {
        if (this.type === 'add') {
          this.isDisabled = true
        } else if (this.type === 'detail') {
          this.addForm.detailShow = false
        }
      },
      immediate: true
    },
    filterText (val) {
      this.$refs['departmentTree'].filter(val)
    }
  }
}
</script>


<style lang="scss" scoped>
.send-wrap {
  padding: 0 10px;
  border: 1px solid $color-border;
  .icon-input-add {
    font-size: 24px;
    vertical-align: middle;
  }
}
.com-tree {
  padding-right: 20px;
  .search-box {
    margin-bottom: 14px;
    font-size: 12px;
  }
  .yw-el-tree {
    height: 270px;
  }
  .el-tree {
    /deep/ .el-tree-node__content {
      .buss {
        display: none;
      }
    }
    /deep/ .el-tree-node__content:hover {
      .buss {
        display: inline-block;
      }
    }
  }
  .el-table {
    border-radius: 8px;
    font-size: 12px;
    height: 270px;
  }
}
</style>
