<!--
@author huangzhijie
@date   19.2.27
@description 人员管理页面
-->
<template>
  <div class="components-container yw-dashboard">
    <el-form ref="departmentform"
             class="yw-form components-condition is-required"
             label-width="70px"
             :rules="departmentRules"
             :inline="true"
             :model="departmentForm">
      <el-form-item style="display:none;">
        <el-input hidden
                  v-model="departmentForm.parent"></el-input>
      </el-form-item>
      <el-form-item label="部门名称"
                    prop="name">
        <el-input v-model="departmentForm.name"
                  placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="上级部门"
                    prop="parentName">
        <el-input readonly
                  v-model="departmentForm.parentName"
                  placeholder="请输入部门"></el-input>
      </el-form-item>
      <el-form-item label="部门类型"
                    prop="type">
        <el-select v-model="departmentForm.type"
                   placeholder="请选择">
          <el-option v-for="item in depTypeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
            <i :class="item.label=='正式部门'?'el-icon-star-on' : 'el-icon-star-off'"
               style="color: #409EFF;"></i>
            <span>{{item.label}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门描述">
        <el-input v-model="departmentForm.descr"
                  placeholder="请输入描述内容"></el-input>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="handleAddDepartment">增加部门</el-button>
      </section>
    </el-form>

    <el-form class="yw-form"
             :inline="true">
      <el-row :gutter="22">
        <el-col :span="6">
          <comtree :ref="treeName"
                   class="person-manage__tree"
                   :data="departmentData"
                   :props="departmentTreeDefault"
                   :draggable="false"
                   node-key="uuid"
                   :default-expanded-keys="deviceAuthDataExpanded"
                   :exId="treeName"
                   ex-show-search
                   :ex-control="true"
                   :ex-control-opt="customControl"
                   @node-click="handleNodeClick"
                   @node-drop="handleDrop"></comtree>
        </el-col>
        <el-col :span="18">
          <div class="person-manage__bar">
            <div class="person-manage__bar-left">
              <el-input class="search-box"
                        v-model="searchText"
                        placeholder="请输入用户名/真实姓名/手机号/邮箱">
                <i slot="suffix"
                   class="el-input__icon el-icon-search"
                   @click="searchData"></i>
              </el-input>

            </div>
            <div class="person-manage__bar-right">
              <el-button type="text"
                         @click="handleExport"
                         icon="el-icon-upload2">导出</el-button>
              <el-upload class="person-manage__bar-import"
                         :action="importUrl"
                         :on-success="handleUpSuccess"
                         :on-error="handleUpError"
                         :headers="importHeader"
                         :show-file-list="false"
                         :multiple="false">
                <el-button type="text"
                           @click="handleExport"
                           icon="el-icon-download">导入</el-button>

              </el-upload>
              <el-button type="text"
                         @click="handleDownload"
                         icon="fa fa-download">模板下载</el-button>
              <el-button type="text"
                         @click="handleAddPerson"
                         icon="el-icon-plus">增加人员</el-button>
              <el-button type="text"
                         @click="batchHandleDept"
                         icon="el-icon-edit">修改用户归属</el-button>
            </div>
          </div>
          <person-list ref="personlist"
                       :searchText="searchText"
                       :dictionary="personDic"
                       :selectedDepartmentId="selectedDepartmentId"
                       @detial-click="handleUpdatePerson"></person-list>
        </el-col>
      </el-row>
    </el-form>

    <!-- dialog -->
    <person-dialog :visible="personDialogVisible"
                   :dictionary="personDicOption"
                   :uuid="selectedPersonId"
                   :departmentType="clickParentNode"
                   :departmentId="departmentForm.parent"
                   :departmentName="departmentForm.parentName"
                   @add-done="handlePersonAddDone"
                   @dialog-close="handlePersonDialogClose"></person-dialog>

    <batchmod-dept-dialog :visible="batchModDeptDialogVisible"
                          :dictionary="personDicOption"
                          @add-done="handleModDeptAddDone"
                          @dialog-close="handleModDeptDialogClose">
    </batchmod-dept-dialog>
    <el-dialog class="yw-dialog"
               title="编辑"
               :visible.sync="departmentDialogVisible"
               :modal="false"
               :modal-append-to-body="false"
               width="410px"
               :before-close="handleDepartmentDialogClose">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 ref="departmentupdateform"
                 :model="departmentUpdateForm"
                 :rules="departmentRules"
                 label-width="70px">
          <el-form-item label="部门名称"
                        prop="name">
            <el-input v-model="departmentUpdateForm.name"></el-input>
          </el-form-item>
          <el-form-item label="部门描述">
            <el-input v-model="departmentUpdateForm.descr"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="handleUpdateDepartment">确定</el-button>
        <el-button @click="departmentDialogVisible = false">取消</el-button>
      </section>
    </el-dialog>
    <el-dialog class="yw-dialog"
               title="移动"
               :visible.sync="departmentMoveDialogVisible"
               :modal="false"
               :modal-append-to-body="false"
               width="500px"
               :before-close="handleDepartmentMoveDialogClose">
      <section class="yw-dialog-main">
        <comtree :ref="treeName1"
                 :data="moveDepartmentData"
                 :props="departmentTreeDefault"
                 node-key="uuid"
                 :default-expand-all="true"
                 :exId="treeName1"
                 ex-show-search
                 :ex-control="true"
                 :ex-control-opt="[]"></comtree>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="handleMoveDepartment">确定</el-button>
        <el-button @click="departmentMoveDialogVisible = false">取消</el-button>
      </section>
    </el-dialog>
    <!-- dialog -->
  </div>
</template>
<script>
import personDataService from 'src/services/sys/person-services.js'
import comtree from 'src/pages/system_manage/components/tree.vue'
import personDialog from 'src/pages/system_manage/components/addPersonDialog.vue'
import batchmodDeptDialog from 'src/pages/system_manage/components/batchmodDeptDialog.vue'
import personList from 'src/pages/system_manage/components/personList.vue'
import { dictionaryService, DIC_KEY } from 'src/services/sys/dictionary-service.js'

export default {
  name: 'person',
  components: {
    comtree,
    personDialog,
    personList,
    batchmodDeptDialog
  },
  data () {
    const that = this
    return {
      prepareMoveData: {},
      departmentForm: {
        name: '',
        parent: '',
        parentName: '',
        type: '',
        descr: ''
      },
      departmentRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '请输入上级部门', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入部门类型', trigger: 'blur' }
        ]
      },
      departmentUpdateForm: {
        id: '',
        name: '',
        descr: ''
      },
      treeName: 'persontree',
      treeName1: 'departmenttree',
      depTypeOptions: [],
      personTypeOptions: [],
      personSexalOptions: [],
      personDic: {},
      personDicOption: {},
      dictionary: {},
      departmentData: [],
      moveDepartmentData: [],
      departmentTreeDefault: {
        label: 'name',
        children: 'childList'
      },
      deviceAuthDataExpanded: [],
      searchText: '',
      customControl: [
        {
          title: '移动至',
          icon: 'el-icon-rank',
          callback: that.customMove
        },
        {
          title: '编辑',
          icon: 'el-icon-edit-outline',
          callback: that.customEdit
        },
        {
          title: '删除',
          icon: 'el-icon-delete',
          callback: that.customDelete
        }
      ],
      selectedDepartmentId: '',
      selectedDepartmentName: '',
      personDialogVisible: false,
      departmentDialogVisible: false,
      departmentMoveDialogVisible: false,
      batchModDeptDialogVisible: false,
      selectedPersonId: '',
      importUrl: '',
      importHeader: {},
      clickParentNode: '1'
    }
  },
  // watch: {
  //   searchText (newValue) {
  //     this.searchData()
  //   }
  // },
  methods: {
    // myUpload (content) {
    //   personDataService.excelImport().then((res) => {
    //     this.$message({
    //       message: '操作成功',
    //       type: 'success'
    //     })
    //   }).catch((res) => {
    //     this.$message({
    //       message: '操作失败',
    //       type: 'error'
    //     })
    //   })
    // },
    handleMoveDepartment () {
      let data = this.prepareMoveData
      let parentId = this.$refs[this.treeName1].getCurrentKey()
      this.departmentMoveDialogVisible = false
      personDataService.updateDepartment({ id: data.uuid, name: data.name, 'parent_id': parentId }).then((res) => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.getDepartment()
      }).catch((res) => {
        var message
        if (res.data.errors[0]) {
          message = res.data.errors[0].message
        }
        this.$message({
          message: message ? message.toString() : '操作失败',
          type: 'error'
        })
      })
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      personDataService.updateDepartment({ id: draggingNode.data.uuid, name: draggingNode.data.name, 'parent_id': dropNode.data.uuid }).then((res) => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.getDepartment()
      }).catch(() => {
        this.$message({
          message: '操作失败',
          type: 'error'
        })
      })
    },
    handleUpSuccess (response, file, fileList) {
      this.$message({
        message: response,
        type: 'success'
      })
      this.getPersonList()
    },
    handleUpError (response, file, fileList) {
      this.$message({
        message: '操作失败',
        type: 'error'
      })
    },
    // 修改
    customEdit (node, data, event) {
      // console.log('customEdit', node, data, event)
      this.departmentDialogVisible = true
      this.departmentUpdateForm.id = data.uuid
      this.departmentUpdateForm.name = data.name
      this.departmentUpdateForm.descr = data.descr
    },
    customMove (node, data, event) {
      // console.log('customEdit', node, data, event)
      this.prepareMoveData = data
      this.moveDepartmentData = JSON.parse(JSON.stringify(this.departmentData))
      this.dealData(this.moveDepartmentData, data)
      this.departmentMoveDialogVisible = true
    },
    dealData (departmentData, data) {
      for (let index = 0; index < departmentData.length; index++) {
        if (departmentData[index].uuid === data.uuid) {
          departmentData.splice(index, 1)
          break
        }
        if (departmentData[index].childList && departmentData[index].childList.length > 0) {
          this.dealData(departmentData[index].childList, data)
        }
      }
    },
    // 删除
    customDelete (node, data) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        personDataService.deleteDepartment(data.uuid).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$refs[this.treeName].remove(node)
          this.resetDepartmentForm()
        }).catch((res) => {
          var message
          if (res.data.errors[0].code === 'The_father_departemnt_not_delete' || res.data.errors[0].code === 'Departemnt_exist_user_not_delete') {
            message = res.data.errors[0].message
          }
          this.$message({
            message: message ? message.toString() : '操作失败',
            type: 'error'
          })
        })
      })
    },
    resetSelectedDepartment () {
      this.selectedDepartmentId = ''
      this.selectedDepartmentName = ''
      this.departmentForm.parent = ''
      this.departmentForm.parentName = ''
    },
    // 点击部门
    handleNodeClick (data) {
      // console.log(data,data1)
      if (data.parent_id === '') {
        this.selectedDepartmentId = ''
      } else {
        this.selectedDepartmentId = data.uuid
      }
      this.selectedDepartmentName = data.name
      this.departmentForm.parent = data.uuid
      this.departmentForm.parentName = data.name
      // 用于对父节点的类型判断
      this.clickParentNode = data.dept_type + ''

      this.getPersonList(this.selectedDepartmentId)
    },
    // 点新增人员
    handleAddPerson () {
      this.selectedPersonId = ''
      this.showPersonDialog()
      // if (this.selectedDepartmentId) {
      //   this.showPersonDialog()
      // } else {
      //   this.$confirm('当前没有选择部门，请先选中一个部门。', '提示', {
      //     showConfirmButton: false,
      //     type: 'warning'
      //   })
      // }
    },
    batchHandleDept () {
      this.showUpdateDeptPersonDialog()
    },
    showUpdateDeptPersonDialog () {
      this.batchModDeptDialogVisible = true
    },
    handleModDeptDialogClose () {
      this.batchModDeptDialogVisible = false
    },
    // 处理修改人员
    handleUpdatePerson (data) {
      // console.log('handleUpdatePerson', data)
      this.selectedPersonId = data
      this.resetSelectedDepartment()
      this.showPersonDialog()
    },
    // 关闭新增人员
    handlePersonDialogClose () {
      this.personDialogVisible = false
    },
    // 关闭新增人员
    handlePersonAddDone (departmentId) {
      this.getPersonList(departmentId.split(',')[0])
      this.handlePersonDialogClose()
    },
    handleModDeptAddDone () {
      this.getPersonList()
      this.handleModDeptDialogClose()
    },

    // 修改部门
    handleUpdateDepartment () {
      this.$refs['departmentupdateform'].validate((valid) => {
        if (valid) {
          personDataService.updateDepartment(this.departmentUpdateForm).then((res) => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getDepartment()
            this.resetDepartmentUpdateForm()
            this.handleDepartmentDialogClose()
          }).catch(() => {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    },
    // 关闭弹窗
    handleDepartmentDialogClose () {
      this.departmentDialogVisible = false
    },
    handleDepartmentMoveDialogClose () {
      this.departmentMoveDialogVisible = false
    },
    // 新增部门
    handleAddDepartment () {
      this.$refs['departmentform'].validate((valid) => {
        if (valid) {
          if (this.departmentForm.type === 1 && !this.clickParentNode) {
            this.$message({
              message: '请勿在临时部门下创建正式部门',
              type: 'error'
            })
            return false
          } else {
            personDataService.addDepartment(this.departmentForm).then((res) => {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.getDepartment()
              this.resetDepartmentForm()
            }).catch((res) => {
              var message
              if (res.data.errors[0].code === 'Temp_department_is_not_allowed') {
                message = res.data.errors[0].message
              } else if (res.data.errors[0].code === 'The_name_is_already_exists') {
                message = '部门名称已经存在'
              }
              this.$message({
                message: message ? message.toString() : '创建失败',
                type: 'error'
              })
            })
          }
        } else {
          return false
        }
      })
    },
    showPersonDialog () {
      this.personDialogVisible = true
    },
    // 模糊查询方法
    searchData () {
      this.$refs['personlist'].searchData()
    },
    // 导出
    handleExport () {
      personDataService.persionExport(this.selectedDepartmentId, this.searchText).then((res) => {
        try {
          const link = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }))
          // console.log('personExport link ', link)
          let downLoadElement = document.createElement('a')
          downLoadElement.href = link
          downLoadElement.download = '用户列表数据.xls'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(link)
        } catch (err) {
          this.$message({
            message: '导出失败',
            type: 'warning'
          })
        }
      })
    },
    // 下载模板
    handleDownload () {
      // alert("sss")
      personDataService.personmodDownload().then((res) => {
        try {
          const link = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }))
          // console.log('personExport link ', link)
          // window.location.href = link
          let downLoadElement = document.createElement('a')
          downLoadElement.href = link
          downLoadElement.download = '人员导入模板.xls'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(link)
        } catch (err) {
          this.$message({
            message: '模板下载失败',
            type: 'warning'
          })
        }
      })
    },
    resetDepartmentForm () {
      this.departmentForm = {
        name: '',
        parent: '',
        parentName: '',
        type: '',
        desc: ''
      }
      this.selectedDepartmentId = ''
      this.selectedDepartmentName = ''
    },
    resetDepartmentUpdateForm () {
      this.departmentUpdateForm = {
        id: '',
        name: '',
        descr: ''
      }
      this.selectedDepartmentId = ''
      this.selectedDepartmentName = ''
    },
    getPersonList (id) {
      this.$refs['personlist'].getPersonList(id)
    },
    // 获取部门树
    getDepartment () {
      personDataService.getDepartmentTree().then((res) => {
        // console.log('getDepartmentTree', res)
        this.departmentData = res
        if (res.length > 0) {
          this.deviceAuthDataExpanded = [res[0].uuid]
        }
      })
    },
    setImportOptions () {
      const params = personDataService.personImport()
      this.importUrl = params.url
      this.importHeader = params.header
    },
    // 获取字典
    getDictonary () {
      const key = [DIC_KEY.DEPARTMENT, DIC_KEY.PERSON, DIC_KEY.SEX].join(',')
      const depTypes = []
      const sexTypes = []
      const personTypes = []
      const sexDic = {}
      const personDic = {}
      let res = dictionaryService.getDictionary(key)
      if (res && res[DIC_KEY.DEPARTMENT]) {
        res[DIC_KEY.DEPARTMENT].map((item) => {
          depTypes.push({
            value: item.dictCode,
            label: item.dictNote
          })
        })
      }
      if (res && res[DIC_KEY.SEX]) {
        res[DIC_KEY.SEX].map((item) => {
          sexTypes.push({
            value: item.dictCode,
            label: item.dictNote
          })
          sexDic[item.dictCode] = item.dictNote
        })
      }
      if (res && res[DIC_KEY.PERSON]) {
        res[DIC_KEY.PERSON].map((item) => {
          personTypes.push({
            value: item.dictCode,
            label: item.dictNote
          })
          personDic[item.dictCode] = item.dictNote
        })
      }
      this.depTypeOptions = depTypes
      this.personTypeOptions = personTypes
      this.personSexalOptions = sexTypes

      personDataService.getDepartmentAllList().then((res) => {
        if (res && res.length > 0) {
          const dic = {}
          res.map((item) => {
            dic[item.uuid] = item.name
          })

          this.personDic = {
            userType: personDic,
            sexal: sexDic,
            department: dic
          }
          this.personDicOption = {
            department: dic,
            userType: personTypes,
            sexal: sexTypes
          }
        }
      })
    }
  },
  mounted () {
    this.getDepartment()
    this.getPersonList()
    this.getDictonary()
    this.setImportOptions()
  }
}
</script>

<style lang="scss" scoped>
/deep/.components-condition {
  padding-right: 90px;
}
.person-manage__tree {
  /deep/ .el-tree {
    height: 480px;
    overflow: auto;
  }
}

.person-manage__bar {
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  margin-bottom: 6px;
  .person-manage__bar-left {
    display: inline-block;
    width: 250px;
    vertical-align: top;
  }
  .person-manage__bar-right {
    display: inline-block;
    vertical-align: top;
    .person-manage__bar-import {
      display: inline-block;
      margin-right: 5px;
      margin-left: 5px;
    }
  }
}
</style>
