<template>
  <div class="add-person-dialog">
    <el-dialog title="增加人员"
               :visible.sync="visible"
               width="930px"
               class="yw-dialog person-manage__dialog"
               :before-close="handlePersonDialogClose">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required form-person-add"
                 :inline="true"
                 ref="personform"
                 :model="personForm"
                 :rules="personRules"
                 label-width="70px">
          <el-form-item label="部门"
                        prop="dynamicTags">
            <el-tag :key="tag.uuid"
                    v-for="tag in personForm.dynamicTags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                    size="small">
              {{tag.name}}
            </el-tag>
            <el-popover placement="bottom-start"
                        trigger="click" style="height: 300px;padding: 0px;">
              <comtree class="person-manage__tree" :data="departmentData"
                       :props="departmentTreeDefault"
                       :ex-control="true"
                       node-key="uuid"
                       :default-expand-all="true"
                       :ex-control-opt="[]"
                       @node-click="handleTreeClick">
              </comtree>
              <el-button slot="reference"
                         class="mod-btn"
                         size="small">请选择</el-button>
            </el-popover>
          </el-form-item>
          <el-form-item label="用户名称"
                        prop="code">
            <el-input v-model="personForm.code"
                      placeholder="用户名称"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名"
                        prop="name">
            <el-input v-model="personForm.name"
                      placeholder="真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="personForm.sex"
                       placeholder="请选择">
              <el-option v-for="item in personSexalOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="办公电话"
                        prop="phone">
            <el-input v-model="personForm.phone"
                      placeholder="办公电话"
                      maxlength="13"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="mail">
            <el-input type="email"
                      v-model="personForm.mail"
                      placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="personForm.address"
                      placeholder="地址"></el-input>
          </el-form-item>
          <el-form-item label="用户类型">
            <el-select v-model="personForm.userType"
                       placeholder="请选择">
              <el-option v-for="item in personTypeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="personForm.no"
                      placeholder="工号"></el-input>
          </el-form-item>
          <el-form-item label="手机"
                        prop="mobile">
            <el-input v-model="personForm.mobile"
                      placeholder="手机"
                      type="tel"
                      maxlength="12"></el-input>
          </el-form-item>
          <el-form-item label="关联人">
            <el-button type="primary"
                       @click="handleClickPerson"
                       v-text="personRelationBtnText"></el-button>
            <el-input v-model="personForm.relationPerson"
                      hidden
                      style="display: none;"></el-input>
          </el-form-item>
          <el-form-item label="传真"
                        prop="fax">
            <el-input v-model="personForm.fax"
                      placeholder="传真"></el-input>
          </el-form-item>
          <el-form-item label="职责">
            <el-input v-model="personForm.post"
                      placeholder="职责"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="personForm.descr"
                      placeholder="描述"></el-input>
          </el-form-item>
        </el-form>
        <div class="upload-wrap">
          <div class="person-manage__dialog-img">
            <img :src="personPicture"
                 alt="">
          </div>
          <div class="person-manage__dialog-img-btn">
            <el-upload class="person-manage__dialog-upload-btn"
                       :before-upload="handleBeforeUpload"
                       :show-file-list="false"
                       action="/"
                       name="picture"
                       :multiple="false">
              <el-button class="mod-btn"
                         type="primary"
                         plain>上传</el-button>
            </el-upload>
            <el-button class="mod-btn person-manage__dialog-delete-btn"
                       @click="handleImgDelete">删除</el-button>
          </div>
        </div>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="handlePersonSave">保存</el-button>
        <el-button @click="handlePersonDialogClose">返回</el-button>
      </section>
    </el-dialog>

    <person-dialog user-type="1"
                   :visible="dialogVisible"
                   :dialogStyle="dialogStyle"
                   :depart-dictionary="departDictionary"
                   @dialog-confirm="handleDialogConfirm"
                   @dialog-close="handleDialogClose"></person-dialog>
  </div>
</template>
<script>

import comtree from 'src/pages/system_manage/components/tree.vue'
import personDataService from 'src/services/sys/person-services.js'
import personDialog from 'src/pages/system_manage/components/personListDialog.vue'

import _ from 'lodash'
export default {
  name: 'addPersionDialog',
  components: {
    personDialog,
    comtree
  },
  data () {
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback()
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^(\d{3,4}-)?\d{7,8}$/
      if (!value) {
        return callback()
      }
      setTimeout(() => {
        if (phoneReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的座机号格式'))
        }
      }, 100)
    }
    var checkFax = (rule, value, callback) => {
      const phoneReg = /^(\d{3,4}-)?\d{7,8}$/
      if (!value) {
        return callback()
      }
      setTimeout(() => {
        if (phoneReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的传真号格式'))
        }
      }, 100)
    }
    var checkDept = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('部门不能为空'))
      } else {
        callback()
      }
    }
    return {
      departmentData: [],
      departmentTreeDefault: {
        label: 'name',
        children: 'childList'
      },
      personForm: {
        departid: '',
        department: '',
        code: '',
        name: '',
        sex: '',
        userType: '2',
        fax: '',
        address: '',
        no: '',
        relationPerson: '',
        phone: '',
        mobile: '',
        post: '',
        descr: '',
        dynamicTags: []
      },
      personPicture: '',
      personTypeOptions: [],
      personSexalOptions: [],
      personRules: {
        code: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        dynamicTags: [
          { required: true, validator: checkDept, trigger: 'change,blur' }
        ],
        mobile: [
          { required: true, validator: checkMobile, trigger: 'blur' }
        ],
        mail: [
          { required: true, validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        fax: [
          { validator: checkFax, trigger: 'blur' }
        ]
      },
      personRelationBtnText: '请点击关联人',
      dialogVisible: false,
      dialogStyle: {},
      uploadUrl: '',
      uploadHeader: {},
      updateData: {},
      pictureData: '',
      departDictionary: {}
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    dictionary: {
      type: Object,
      default: []
    },
    departmentId: {
      type: String,
      default: ''
    },
    departmentName: {
      type: String,
      default: ''
    },
    departmentType: {
      type: String,
      default: ''
    },
    uuid: {
      type: String,
      default: ''
    }
  },
  watch: {
    uuid (val) {
      if (val) {
        this.getPersonDetial(val)
      }
    },
    visible (val) {
      // 隐藏时重置
      if (!val) {
        this.resetPersonForm()
      } else {
        this.start()
      }
    },
    dictionary (val) {
      // console.log('watch dictionary', val)
      if (val && val.userType) {
        this.personTypeOptions = val.userType
      }
      if (val && val.sexal) {
        this.personSexalOptions = val.sexal
      }
      if (val && val.department) {
        this.setDepartment(this.personForm.departid)
      }
    },
    departmentId (val) {
      if (val) {
        this.personForm.departid = val
      }
    },
    departmentName (val) {
      if (val) {
        this.personForm.department = val
      }
    },
    'personForm.userType' (val) {
      // console.log(val)
      if (Number(val) === 1) {
        // console.log("ssss")
        this.personForm.relationPerson = ''
        this.personRelationBtnText = '请选择关联人'
      }
    }
  },
  methods: {
    // 获取资源
    getDepartmentTree () {
      personDataService.getDepartmentTree().then((res) => {
        this.departmentData = res
      })
    },
    handleTreeClick (data) {
      // this.accountForm.resoures = data.uuid
      // this.resourceBtnText.name = data.name
      // this.resourceBtnText.uuid = data.uuid
      if (_.map(this.personForm.dynamicTags, 'uuid').indexOf(data.uuid) === -1) {
        this.personForm.dynamicTags.push({ 'name': data.name, 'uuid': data.uuid, 'dept_type': data.dept_type })
        this.personForm.departid = _.map(this.personForm.dynamicTags, 'uuid').join(',')
      }
      this.treeVisible = false
    },
    handleClose (tag) {
      this.personForm.dynamicTags.splice(this.personForm.dynamicTags.indexOf(tag), 1)
      this.personForm.departid = _.map(this.personForm.dynamicTags, 'uuid').join(',')
    },
    // 保存人员
    handlePersonSave () {
      // console.log('addPerson data', this.departmentType)
      this.$refs['personform'].validate((valid) => {
        console.log('valid: ' + valid)
        if (valid) {
          // console.log('addPerson data', this.personForm)
          if (Number(this.personForm.userType) === 2 && this.personForm.relationPerson === '') {
            this.$message({
              message: '临时用户必须选择关联人',
              type: 'warning'
            })
          } else {
            var formalDeptNum = 0
            this.personForm.dynamicTags.forEach((item) => {
              if (item.dept_type === 1) {
                formalDeptNum++
              }
            })
            if (formalDeptNum > 1) {
              this.$message({
                message: '只能有一个正式部门归属',
                type: 'warning'
              })
            }
            this.personForm.deptIds = _.map(this.personForm.dynamicTags, 'uuid')
            console.log(this.personForm.deptIds)
            if (this.uuid) {
              this.updatePerson(this.uuid, this.personForm, this.pictureData)
            } else {
              this.addPerson(this.personForm, this.pictureData)
            }
          }
        }
      })
    },
    // 增加人员
    addPerson (form, pictureData) {
      personDataService.addPerson(form, pictureData).then((res) => {
        // console.log('addPerson', res)
        this.$message({
          message: '创建成功',
          type: 'success'
        })
        this.$emit('add-done', form.departid)
      })
    },
    updatePerson (uuid, form, pictureData) {
      personDataService.updatePerson(uuid, form, pictureData).then((res) => {
        // console.log('updatePerson', res)
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$emit('add-done', form.departid)
      })
    },
    // 点击关联人
    handleClickPerson (event) {
      if (Number(this.personForm.userType) === 1) {
        this.$message({
          message: '正式用户不需要选择关联人',
          type: 'warning'
        })
        return
      }
      this.personForm.userType = '2'
      // let offsetTop = event.clientY
      // let offsetLeft = event.clientX
      // if (event.layerX) {
      //   offsetLeft -= event.layerX
      // }
      // if (event.layerY) {
      //   offsetTop -= event.layerY
      // }
      // this.dialogStyle = {
      //   top: `${offsetTop - 30}px`, // 往下偏移 30
      //   left: `${offsetLeft + 30}px` // 往右偏移 10
      // }
      this.dialogVisible = true
    },
    // 点击确定
    handleDialogConfirm (data) {
      this.personRelationBtnText = data.name
      this.personForm.relationPerson = data.uuid
      this.handleDialogClose()
    },
    // 关闭关联人弹窗
    handleDialogClose () {
      this.dialogVisible = false
    },
    // 关闭弹窗
    handlePersonDialogClose () {
      this.dialogVisible = false
      this.personRelationBtnText = '请点击关联人'
      this.$emit('dialog-close')
    },
    // 点击上传
    handleBeforeUpload (file) {
      // 取图片文件存到内存
      this.pictureData = file
      this.personPicture = window.URL.createObjectURL(file)
      return false
    },
    handleImgDelete () {
      this.pictureData = ''
      this.personPicture = ''
    },
    // 获取人员详细信息
    getPersonDetial (id) {
      personDataService.getPersonDetail(id).then((res) => {
        // console.log('handleDetail', res)
        this.setPersonForm(res)
      })
    },
    // 获取关联人信息
    getRelationPerson (id) {
      personDataService.getPersonDetail(id).then((res) => {
        this.setRelationPerson(res)
      })
    },
    // 重置人员信息
    resetPersonForm () {
      this.personForm = {
        // departid: '',
        // department: '',
        code: '',
        name: '',
        sex: '',
        userType: '2',
        fax: '',
        address: '',
        no: '',
        relationPerson: '',
        phone: '',
        mobile: '',
        post: '',
        descr: '',
        dynamicTags: []
      }
      this.personPicture = ''
    },
    // 设置人员信息
    setPersonForm (data) {
      this.personForm = {
        dynamicTags: data.dept_list,
        departid: _.map(data.dept_list, 'uuid').join(','),
        department: data.dept_id,
        code: data.code,
        name: data.name,
        sex: data.sex ? String(data.sex) : '',
        userType: String(data.user_type),
        fax: data.fax,
        mail: data.mail,
        address: data.address,
        no: data.no,
        relationPerson: '',
        phone: data.phone,
        mobile: data.mobile,
        post: data.post,
        descr: data.descr
      }
      if (data.picture) {
        this.personPicture = `data:image/jpeg;base64,${data.picture}`
      }
      if (data.relation_person) {
        this.getRelationPerson(data.relation_person)
      }
      // this.setDepartment(this.personForm.departid)
    },
    // 设置部门
    setDepartment (departid) {
      // this.departDictionary = this.dictionary.department
      // if (departid === this.personForm.department && this.dictionary.department) {
      //   this.personForm.department = this.dictionary.department[departid]
      // }
    },
    // 设置关联人
    setRelationPerson (data) {
      this.personRelationBtnText = data.name
      this.personForm.relationPerson = data.uuid
    },
    // 初始化
    start () {
      // if (this.departmentId) {
      //   this.personForm.departid = this.departmentId
      // }
      // if (this.departmentName) {
      //   this.personForm.department = this.departmentName
      // }
      if (this.uuid) {
        this.getPersonDetial(this.uuid)
      }
    }
  },
  mounted () {
    this.getDepartmentTree()
  }
}
</script>
<style lang="scss">
input[type="file"] {
  display: none;
}
</style>
<style lang="scss" scoped>
  .person-manage__tree {
    padding-right: 0px;
  /deep/ .el-tree {
    height: 300px;
    overflow: auto;
  }
}
/deep/ .el-popper {
  padding: 0px;
}
/deep/.add-person-dialog {
  .form-person-add {
    width: 80%;
    .el-form-item {
      width: 45%;
    }
  }
  .upload-wrap {
    display: inline-block;
    .person-manage__dialog-img {
      width: 160px;
      height: 190px;
      background: #f4f4f4;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .person-manage__dialog-img-btn {
      margin-top: 15px;
      width: 160px;
    }
    .person-manage__dialog-upload-btn {
      display: inline-block;
      margin-right: 5px;
      .el-button {
        width: 75px;
      }
    }
    .person-manage__dialog-delete-btn {
      width: 75px;
    }
  }
}
</style>
