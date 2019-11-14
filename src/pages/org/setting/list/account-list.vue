<template>
  <div class="component-container">
    <div>
      <el-row>
        <el-col :span="5" v-show="subaccountView">
          <el-input v-model="search" placeholder="用户名关键字检索" size="small"  style="width: 340px;">
            <!--<el-button slot="append" icon="el-input__icon el-icon-search" type="primary"-->
                       <!--@click="onSearchChanged"></el-button>-->
          </el-input>
        </el-col>
        <el-col :span="19">
          <el-button type="primary" class="confirm-add-new-user pull-right"
                     @click="createAccount('form')"
                     v-show="subaccountCreate">创建用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表-->
      <el-row  v-show="this.subaccountView">
          <el-table :data="accounts" size="normal" stripe style="width: 100%">
            <el-table-column prop="username" label="用户名" width="750px">
              <template slot-scope="scope">
                {{scope.row.username}}
                <el-popover placement="top-start" trigger="hover" @show="getUserRoles(scope.row)"
                            v-show="subaccountView">
                  <el-tag v-for="role in userRoles" v-if="userRolesIsExist" :key="role.role_name"
                          :disable-transitions="true" :closable="roleAssign"
                          size="small" type="info" style="margin-right: 5px;"
                          @close="revokeUserRoles(role)">
                    <a @click="getRoleDetail(role.role_name)">{{role.role_name}}</a>
                  </el-tag>
                  <el-button v-if="!userRolesIsExist" type="text"
                             style="color: black;cursor: text;margin: 0px;padding: 0px;">该用户暂未分配任何角色
                  </el-button>
                  <i slot="reference" class="fa fa-group" style="cursor: pointer;color: #428bca;"></i>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="270px">
              <template slot-scope="scope">
                <div>{{scope.row.created_at | formatDate}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="80px">
              <template slot-scope="scope">
                <!--<el-tooltip prop="update_password" content="更改密码" placement="top">-->
                  <i class="el-icon-edit" @click="showPasswordView(scope.row.username)"
                     v-show="subaccountUpdatePassword"></i>
                <!--</el-tooltip>-->
                <!--<el-tooltip prop="add_role" content="添加角色" placement="top">-->
                  <i class="el-icon-circle-plus" @click="showRoleView(scope.row.username)"
                     v-show="roleAssign"></i>
                <!--</el-tooltip>-->
                <!--<el-tooltip prop="delete" content="删除" placement="top" :hide-after="3000">-->
                  <i class="el-icon-delete" @click="accountDelete(scope.$index, scope.row.username)"
                     @mouseover="viewDelete" @mouseout="unviewDelete"
                     v-show="subaccountDelete"></i>
                <!--</el-tooltip>-->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="subaccountView"
            class="pull-right"
            @size-change="sizeChange"
            @current-change="pageChange"
            :page-sizes="[20, 40, 60, 80]"
            :page-size="pagination.page_size"
            :current-page="pagination.current_page"
            :total="pagination.count"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
      </el-row>
      <!--对话框-->
      <el-dialog  title="创建用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <!--<div>新创建的子账号密码将会发送到邮箱: alauda@migutest.cn</div>-->
        <el-form :model="form" ref="form" :label-width="'120px'" :rules="rules">
          <el-form-item label="用户名" prop="usernames">
            <el-input v-model="form.usernames" auto-complete="off" placeholder="多个用户名请以逗号分隔"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roles">
            <el-select v-model="form.rolesForm" filterable multiple placeholder="请选择角色">
              <el-option  v-for="role in roles" :label="role.name" :value="role.name" :key="role.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-checkbox v-model="checked">预览密码</el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button class="cancle-commit" @click="dialogFormVisible = false">取消</el-button>
          <el-button class="confirm-add-new-user" type="primary" @click="submitForm('form')">创建</el-button>
        </div>
      </el-dialog>
      <el-dialog title="更改密码" :visible.sync="updatePassword" :close-on-click-modal="false">
        <el-form :model="formPassword" ref="formPassword" :label-width="'120px'" :rules="rules2">
          <el-form-item label="用户名" prop="usernames">{{username}}</el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input type="password" v-model="formPassword.password" auto-complete="off" placeholder="密码长度需6位以上"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="passwordCheck">
            <el-input type="password" v-model="formPassword.passwordCheck" auto-complete="off" placeholder="密码长度需6位以上"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelUpdatePass('formPassword')">取 消</el-button>
          <el-button type="primary" @click="updateUserPassword('formPassword')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAddRole" :close-on-click-modal="false">
        <span>用户名{{username}}</span><br>
        <br>角色
        <el-select v-model="name" multiple filterable placeholder="选择要添加的角色">
          <el-option v-for="role in rolesForUser" :key="role.name" :label="role.name" :value="role.name">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAddRole = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="创建用户密码信息" :visible.sync="viewPassWord" :close-on-click-modal="false">
        <el-row>已创建的子账号</el-row>
        <el-row>
          <el-table :data="subaccountInfo" size="small" style="width: 100%">
            <el-table-column prop="username" label="用户名">
              <template slot-scope="scope">
                {{scope.row.username}}
              </template>
            </el-table-column>
            <el-table-column prop="password" label="密码">
              <template slot-scope="scope">
                <div>{{scope.row.password}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="viewPassWord = false">好</el-button>
        </span>
      </el-dialog>
      <el-dialog title="删除用户" :visible.sync="deleteUserDialog" :close-on-click-modal="false">
        <span>确定删除用户:{{deleteUserParam}}</span><br>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="deleteUserMethod()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import orgService from 'src/services/org.js'
  import rbRoleService from 'src/services/rb-role-service.factory'
  import permissionService from 'src/services/rb-permission-data-service.factory.js'

  export default {
    data () {
      var validatePass = (rule, value1, callback) => {
        if (value1 === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.formPassword.passwordCheck !== '') {
            this.$refs.formPassword.validateField('passwordCheck')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value1, callback) => {
        if (value1 === '') {
          callback(new Error('请再次输入密码'))
        } else if (value1 !== this.formPassword.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        deleteUserDialog: false,
        deleteUserParam: '',
        checked: false,
        viewPassWord: false,
        subaccountInfo: [],
        userRoles: [],
        userRolesIsExist: true,
        username: '',
        tableData: [],
        roles: [],
        rolesForUser: [],
        name: '',
        search: '',
        accounts: [],
        dialogFormVisible: false,
        edit: false,
        dialogFormVisibleAddRole: false,
        updatePassword: false,
        pagination: {
          page_size: 20,
          current_page: 1,
          count: 0
        },
        formPassword: {
          password: '',
          passwordCheck: ''
        },
        rules2: {
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {min: 6, max: 20, message: '密码长度控制在6 到 20 个字符', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          passwordCheck: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {min: 6, max: 20, message: '密码长度控制在6 到 20 个字符', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
          ]
        },
        form: {
          // usernames: [],
          usernames: '',
          password: '',
          roles: [],
          rolesForm: []
        },
        rules: {
          usernames: [
            {required: true, message: '用户名必填', trigger: 'blur'},
            {min: 5, max: 20, message: '长度为 5 到 20 个字符', trigger: 'blur'},
            {pattern: /^[a-zA-Z][A-Za-z0-9,]+$/, message: '只接受字母开头的字母和数字', trigger: 'blur'}
          ]
          // password: [
          //   {required: true, message: '密码必填', trigger: 'blur'},
          //   {min: 6, max: 20, message: '密码长度控制在6 到 20 个字符', trigger: 'blur'}
          // ]
        },
        isAdmin: false,
        subaccountCreate: false,
        subaccountDelete: false,
        subaccountUpdatePassword: false,
        subaccountView: false,
        subaccountUpdate: false,
        roleAssign: false,
        roleView: false
      }
    },
    mounted: function () {
      this.initPermission()
      this.initRolePermission()
      this.fetchAccountList()
      this.loadData()
    },
    computed: {},
    methods: {
      initPermission () {
        permissionService.getPermission({
          resource_type: 'subaccount'
        }).then((data) => {
          for (let item of data) {
            if (item === 'subaccount:create') {
              this.subaccountCreate = true
            } else if (item === 'subaccount:delete') {
              this.subaccountDelete = true
            } else if (item === 'subaccount:update_password') {
              this.subaccountUpdatePassword = true
            } else if (item === 'subaccount:view') {
              this.subaccountView = true
            } else if (item === 'subaccount:update') {
              this.subaccountUpdate = true
            }
          }
        })
      },
      initRolePermission () {
        this.namespace = sessionStorage.getItem('namespace')
        this.username = sessionStorage.getItem('username')
        if (this.namespace === this.username) {
          this.isAdmin = true
        } else {
          this.isAdmin = false
        }
        permissionService.getPermission({
          resource_type: 'role'
        }).then((data) => {
          for (let item of data) {
            if (item === 'role:assign') {
              this.roleAssign = true
            } else if (item === 'role:view') {
              this.roleView = true
            }
          }
        })
      },
      fetchAccountList () {
        return orgService.listOrgAccounts({
          search: this.search,
          page: this.pagination.current_page,
          page_size: this.pagination.page_size
        }).then((data) => {
          this.accounts = data.results
          this.pagination.count = data.count
        }).catch(() => {
          this.accounts = []
        })
      },
      createAccount (formRule) {
        this.dialogFormVisible = true
        this.subaccountInfo = []
        // this.form.usernames = []
        this.form.usernames = ''
        this.form.password = ''
        this.form.rolesForm = []
      },
      // onSearchChanged () {
      //   this.pagination.page = 1
      //   this.fetchAccountList()
      // },
      submitForm (formName) {
        var users = this.form.usernames.split(',')
        this.subaccountInfo = []
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 判断密码是否随机生成
            if (this.form.password === '') {
              // 因为随机生成密码，为了满足多用户多密码，需要将用户一一随机分配密码，需要多次调用创建接口
              for (let i = 0; i < users.length; i++) {
                let user = users[i]
                let pass = this.randomPassWord(true, 6, 6)
                let data = {
                  usernames: [],
                  password: pass,
                  roles: []
                }
                data.usernames.push(user)
                // 封装显示密码的参数
                if (this.checked) {
                  let userInfo = {
                    username: user,
                    password: pass
                  }
                  this.subaccountInfo.push(userInfo)
                }
                // 获取角色信息
                if (this.form.rolesForm.length > 0) {
                  for (let item of this.form.rolesForm) {
                    for (let item1 of this.roles) {
                      if (Object.is(item, item1.name)) {
                        let role = {
                          name: item,
                          uuid: item1.uuid
                        }
                        data.roles.push(role)
                      }
                    }
                  }
                }
                // 一个一个调用创建接口
                orgService.createAccount(data).then((data) => {
                  // 如果是最后一个创建成功，弹出成功提示
                  if (i === (users.length - 1)) {
                    this.$message({
                      type: 'success',
                      message: '创建成功!'
                    })
                    this.fetchAccountList()
                  }
                }, (data) => {
                  this.$message({
                    type: 'error',
                    message: data.response.data.errors[0].fields[0]['0.username'][0]
                  })
                })
              }
              this.dialogFormVisible = false
              // 判断是否显示密码
              if (this.checked) {
                this.viewPassWord = true
              }
            }
            // 未随机生成密码新建一个创建用到的请求入参body
            if (this.form.password !== '') {
              let data = {
                usernames: users,
                password: this.form.password,
                roles: []
              }
              // 判断是否显示密码
              if (this.checked) {
                this.viewPassWord = true
                // 显示密码信息
                for (let user of users) {
                  let userInfo = {
                    username: user,
                    password: this.form.password
                  }
                  this.subaccountInfo.push(userInfo)
                }
              }
              // 获取角色信息
              if (this.form.rolesForm.length > 0) {
                for (let item of this.form.rolesForm) {
                  for (let item1 of this.roles) {
                    if (Object.is(item, item1.name)) {
                      let role = {
                        name: item,
                        uuid: item1.uuid
                      }
                      data.roles.push(role)
                    }
                  }
                }
              }
              // 调用创建接口
              orgService.createAccount(data).then((data) => {
                this.dialogFormVisible = false
                this.$message({
                  type: 'success',
                  message: '创建成功!'
                })
                this.fetchAccountList()
                // location.reload()
              }, (data) => {
                this.$message({
                  type: 'error',
                  message: data.response.data.errors[0].fields[0]['0.username'][0]
                })
              })
            }
          } else {
            return false
          }
        })
      },
      accountDelete (index, name) {
        this.deleteUserDialog = true
        this.deleteUserParam = name
      },
      deleteUserMethod () {
        orgService.deleteAccount(this.deleteUserParam).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 该注释掉的代码已失效
          // this.accounts.splice(index, 1, this.accounts)
          this.deleteUserDialog = false
          this.deleteUserParam = ''
          this.fetchAccountList()
        })
      },
      addRole () {
        let addRoles = this.name
        let username = this.username
        let roleArray = []
        for (let item of addRoles) {
          roleArray.push({'name': item})
        }
        try {
          orgService.addAccountRoles(username, roleArray).then(() => {
            this.$message({
              type: 'success',
              message: '添加角色成功!'
            })
            this.fetchAccountList()
            // 角色列表恢复所有角色，便于其它地方继续调用
            this.loadData()
          })
        } catch (e) {
          console.error('Failed to add role to account', e)
        }
        this.dialogFormVisibleAddRole = false
      },
      updateUserPassword (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let username = this.username
            let data = {
              password: this.formPassword.passwordCheck
            }
            try {
              orgService.updateAccountPassword(username, data).then(() => {
                this.$message({
                  type: 'success',
                  message: '密码修改成功!'
                })
              })
            } catch (e) {
              console.error('Failed to update account password', e)
            }
            this.updatePassword = false
          } else {
            return false
          }
        })
      },
      cancelUpdatePass (formName) {
        this.updatePassword = false
        this.$refs[formName].resetFields()
      },
      loadData () {
        rbRoleService.roleList({}).then((data) => {
          let count = data.count
          rbRoleService.roleList({page_size: count}).then((data) => {
            this.roles = data.results
          })
        })
      },
      showRoleView (username) {
        this.name = []
        this.dialogFormVisibleAddRole = true
        this.username = username
        // 用户已经存在的角色需要先从roles列表过滤掉
        this.userRoles = []
        orgService.getUserRoles({username: username}).then((data) => {
          this.userRoles = data
          if (this.userRoles.length) {
            let arr = []
            this.rolesForUser = []
            // for循环去除已经关联给用户的角色
            for (let i = 0; i < this.roles.length; i++) {
              let flag = false
              for (let j = 0; j < this.userRoles.length; j++) {
                if (Object.is(this.roles[i].name, this.userRoles[j].role_name)) {
                  flag = true
                  break
                }
              }
              if (flag === false) {
                arr.push(this.roles[i])
              }
            }
            this.rolesForUser = arr
          } else {
            // 如果用户无关联角色，则获取全部角色列表
            this.rolesForUser = this.roles
          }
        })
      },
      showPasswordView (username) {
        this.updatePassword = true
        this.formPassword = {}
        this.username = username
      },
      getUserRoles (row) {
        this.userRoles = []
        orgService.getUserRoles({username: row.username}).then((data) => {
          this.userRoles = data
          if (data.length) {
            this.userRolesIsExist = true
          } else {
            this.userRolesIsExist = false
          }
        })
      },
      revokeUserRoles (role) {
        const data = [{user: role.user}]
        orgService.revokeRoleUsers(data, {role_name: role.role_name}).then((data) => {
          this.userRoles.splice(this.userRoles.indexOf(role), 1)
        }, (data) => {
          this.$message({
            type: 'error',
            message: data.response.data.errors
          })
        })
      },
      getRoleDetail (roleName) {
        // 跳转到角色详情页面
        this.$router.push({
          path: '/org/setting/role_detail',
          query: {name: roleName}
        })
      },
      viewDelete () {
        this.disabled = false
      },
      unviewDelete () {
        this.disabled = true
      },
      sizeChange (val) {
        this.pagination.page_size = val
        this.fetchAccountList()
      },
      pageChange (val) {
        this.pagination.current_page = val
        this.fetchAccountList()
      },
      randomPassWord (randomFlag, min, max) {
        let str = ''
        let range = min
        let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
          'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
          'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        // 随机产生
        if (randomFlag) {
          range = Math.round(Math.random() * (max - min)) + min
        }
        for (var i = 0; i < range; i++) {
          let pos = Math.round(Math.random() * (arr.length - 1))
          str += arr[pos]
        }
        return str
      }
    },
    watch: {
      search: 'fetchAccountList'
    }
  }
</script>

<style scoped>
@import './account-list.scss';
</style>
