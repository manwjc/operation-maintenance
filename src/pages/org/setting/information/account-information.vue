<template>
  <div class="component-container">
    <!--修改密码-->
      <div style="margin-left: 50px;margin:20px">
        <span class="ng-binding">密码</span>
        <a class="rb-btn-link" style="margin-left: 10px">
          <i class="fa fa-key"></i>
          <span class="ng-binding" @click="updatePwd()">更改密码</span>
        </a>
      </div>
    <el-dialog title="更改密码" :visible.sync="updatePassword" :close-on-click-modal="false">
      <el-form :model="formPassword" ref="formPassword" :label-width="'120px'" :rules="rules2">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="formPassword.oldPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="formPassword.password" auto-complete="off"
                    placeholder="仅支持字母数字特殊符号等字符"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="passwordCheck">
          <el-input type="password" v-model="formPassword.passwordCheck" auto-complete="off"
                    placeholder="仅支持字母数字特殊符号等字符"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdatePass('formPassword')">取 消</el-button>
        <el-button type="primary" @click="submitUpdatePass('formPassword')">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改邮箱-->
    <div style="margin-left: 50px;margin:20px">
      <span class="ng-binding">邮箱</span>
      <span class="ng-binding" style="margin-left: 10px">{{this.emailShow}}</span>
      <a class="rb-btn-link" style="margin-left: 10px">
        <i class="el-icon-edit" @click="updateEmail = true" v-show="isAdmin"></i>
      </a>
    </div>
    <el-dialog title="修改邮箱" :visible.sync="updateEmail" :close-on-click-modal="false">
      <el-form :model="emailForm" :rules="emailRule" ref="emailForm" :label-width="'120px'">
        <el-form-item label="邮箱" prop="emailName">
          <el-input type="text" v-model="emailForm.emailName" auto-complete="off"
                    placeholder="请输入正确的邮箱格式（例：alaudalfa@ala.com)"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateEmail = false">取 消</el-button>
        <el-button type="primary" @click="submitEmail ('emailForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import orgService from 'src/services/org.js'
    export default {
      data () {
        var validateOldPass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入原始密码'))
          } else {
            callback()
          }
        }
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入新密码'))
          } if (value.length < 6) {
            callback(new Error('密码长度不足6位'))
          } else {
            if (this.formPassword.passwordCheck !== '') {
              this.$refs.formPassword.validateField('passwordCheck')
            }
            callback()
          }
        }
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入新密码'))
          } else if (value !== this.formPassword.password) {
            callback(new Error('新密码两次输入不一致!'))
          } else {
            callback()
          }
        }
        var validateEmail = (rule, value, callback) => {
          // let emailRule = /^([a-zA-Z0-9_.-]{2,58})@([a-zA-Z0-9_-]){1,20}((\.[a-zA-Z0-9_-]+){1,3})$/
          let emailRule = /^\w{2,58}([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
          if (value === '') {
            callback(new Error('请输入邮箱'))
          } else if (!emailRule.test(value)) {
            callback(new Error('邮箱格式不正确'))
          } else {
            callback()
          }
        }
        return {
          updatePassword: false,
          updateEmail: false,
          emailShow: '',
          formPassword: {
            oldPassword: '',
            password: '',
            passwordCheck: ''
          },
          emailForm: {
            emailName: ''
          },
          rules2: {
            oldPassword: [
              {validator: validateOldPass, trigger: 'blur'},
              {required: true, message: '请输入原密码', trigger: 'blur'}
            ],
            password: [
              {validator: validatePass, trigger: 'blur'},
              {min: 6, max: 20, message: '长度在 6 到 20 个字符'},
              {required: true, message: '请输入原密码', trigger: 'blur'}
            ],
            passwordCheck: [
              {validator: validatePass2, trigger: 'blur'},
              {min: 6, max: 20, message: '长度在 6 到 20 个字符'},
              {required: true, message: '请输入原密码', trigger: 'blur'}
            ]
          },
          emailRule: {
            emailName: [
              { validator: validateEmail, trigger: 'blur' },
              {min: 8, max: 64, message: '邮箱长度8-64位'}
            ]
          },
          organizationSync_users: false,
          organizationUpdate: false,
          organizationView: false,
          isAdmin: false
        }
      },
      mounted: function () {
        this.initEmail()
        this.initPermission()
      },
      methods: {
        updatePwd () {
          this.updatePassword = true
          this.formPassword.oldPassword = ''
          this.formPassword.password = ''
          this.formPassword.passwordCheck = ''
        },
        initPermission () {
          this.namespace = sessionStorage.getItem('namespace')
          this.username = sessionStorage.getItem('username')
          if (this.namespace === this.username) {
            this.isAdmin = true
          } else {
            this.isAdmin = false
          }
        },
        initEmail () {
          orgService.getCompanyInformation().then((data) => {
            this.emailShow = this.emailForm.emailName = data.email
          })
        },
        submitUpdatePass (formName) {
          const namespace = sessionStorage.getItem('namespace')
          const username = sessionStorage.getItem('username')
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let data = {
                old_password: this.formPassword.oldPassword,
                password: this.formPassword.password
              }
              if (namespace === username) {
                // 根账号调用此接口修改密码
                orgService.updateCompanyNameEmailPassword(data).then(() => {
                  this.$message({
                    type: 'success',
                    message: '根账号密码修改成功'
                  })
                }, (data) => {
                  this.$message({
                    type: 'error',
                    message: data.response.data.errors[0].fields[0].old_password[0]
                  })
                })
              } else {
                // 子账号调用此接口修改密码
                orgService.updateUserPassword(data, username).then(() => {
                  this.$message({
                    type: 'success',
                    message: '密码修改成功'
                  })
                }, (data) => {
                  this.$message({
                    type: 'error',
                    // message: '子账号密码修改错误'
                    message: data.response.data.errors[0].fields[0].old_password[0]
                  })
                })
              }
              this.updatePassword = false
            } else {
              return false
            }
          })
        },
        submitEmail (formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              try {
                let data = {
                  email: this.emailForm.emailName
                }
                orgService.updateCompanyNameEmailPassword(data).then(() => {
                  this.$message({
                    type: 'success',
                    message: '邮箱修改成功'
                  })
                  orgService.getOrganizationInfo().then((data) => {
                    this.emailShow = data.email
                  })
                  this.initEmail()
                })
              } catch (e) {
                console.error('Failed to update email', e)
              }
              this.updateEmail = false
            } else {
              console.log('error submit!!')
              return false
            }
          })
        },
        cancelUpdatePass (formName) {
          this.updatePassword = false
          this.$refs[formName].resetFields()
        },
        unopen () {
          this.$alert('此功能尚未开放', '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      watch: {
      }
    }
</script>

<style scoped>

</style>
