<template>
  <div class="component-container">

    <el-row style="margin-bottom:20px">
      <el-col :span="5">
        <i class="fa fa-users" aria-hidden="true"></i>
        <span>{{name}}</span>
      </el-col>
      <el-col :span="19">
        <el-button v-show="roleCreate" class="pull-right" @click="copyRole">复制角色</el-button>
      </el-col>
    </el-row>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="baseInfo">
        <div class="d2">
          <table style="width:100%;height:calc(100%)">
            <tr>
              <td style="text-align: right;width:15%">创建者</td>
              <td style="padding-left:15px">{{roleData.created_by}}</td>
            </tr>
            <tr>
              <td style="text-align: right">创建时间</td>
              <td style="padding-left:15px">{{roleData.created_at | formatDate}}</td>
            </tr>
          </table>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div style="margin-top:20px;">
      <el-row>
        <div class="">
          <el-row>
            <el-tabs v-model="activeName">

              <el-tab-pane label="权限" name="permission">
                <el-button  type="primary" @click="addPermission()"
                            v-show="roleUpdate" size="small" class="pull-right">添加权限</el-button>
                <el-table :data="permissions" stripe style="width: 100%">
                  <el-table-column prop="resource" label="资源" width="250">
                    <template slot-scope="scope">
                      <div v-for="item in scope.row.resource">{{item}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="actions" label="操作" width="240">
                    <template slot-scope="scope">
                      <div v-for="item in scope.row.actions">{{item}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="constraints" label="约束条件" width="540">
                    <template slot-scope="scope">
                      <div v-for="item in scope.row.constraints">{{item}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="action" label="操作" width="70">
                    <template slot-scope="scope">
                      <el-tooltip prop="update_password" content="更新权限" placement="top">
                        <el-button type="text" @click="updatePermissionFunction(permissions[scope.$index].uuid)">
                          <i v-show="roleUpdate" class="el-icon-edit"></i>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip prop="delete" content="删除权限" placement="top">
                        <el-button type="text" @click="deletePermission (permissions[scope.$index].uuid)">
                          <i v-show="roleUpdate" class="el-icon-delete" ></i>
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <el-tab-pane label="父角色" name="parentRole">
                <input v-model="searchParentRole" placeholder="按名称搜索" width="180"/>
                <el-button  type="primary" @click="getRoleList()" v-show="roleUpdate"
                            class="pull-right" size="small">添加父角色</el-button>
                <el-table :data="searchParents" stripe style="width: 100%">
                  <el-table-column prop="name" label="名称" width="810">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="loadParentRoleDetail(scope.$index, scope.row.name)"
                        type="text"
                        size="small">
                        {{scope.row.name}}
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="assigned_at" label="添加时间" width="220">
                    <template slot-scope="scope">
                      <div>{{scope.row.assigned_at | formatDate}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="action" label="操作" width="70">
                    <template slot-scope="scope">
                      <el-button type="text" @click="loadParentRoleDetailPermission(scope.row.name)">
                        <i v-show="roleView" class="el-icon-view"/>
                      </el-button>
                      <el-tooltip content="删除" placement="top">
                        <el-button type="text" @click="deleteParentRole(scope.row.name,parents[scope.$index].uuid)">
                          <i v-show="roleUpdate" class="el-icon-delete"/>
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <el-tab-pane label="成员" name="account">
                <input v-model="searchUsers" placeholder="按名称搜索" width="180"/>
                <el-button  type="primary" class="pull-right" size="small"
                            @click="addSubaccount()" v-show="roleAssign">添加用户</el-button>
                <el-table :data="searchRoleUsers" stripe style="width: 100%">
                  <el-table-column prop="user" label="用户名" width="850"></el-table-column>
                  <el-table-column prop="assigned_at" label="添加时间" width="220">
                    <template slot-scope="scope">
                      <div>{{scope.row.assigned_at | formatDate}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="action" label="操作" width="60">
                    <template slot-scope="scope">
                      <el-tooltip content="删除" placement="top">
                        <el-button type="text" @click="revokeRoleUsers(scope.row.user)">
                          <i v-show="roleAssign" class="el-icon-delete"></i>
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-row>
        </div>
      </el-row>
    </div>

    <el-dialog title="父角色详情预览" :visible.sync="parentPermissionView" :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :span="4"><div class="pull-right">角色</div></el-col>
        <el-col :span="20">{{this.parentRoleName}}</el-col>
      </el-row><br/>
      <el-row :gutter="20">
        <el-col :span="4"><div class="pull-right">权限</div></el-col>
        <el-col :span="20">
          <div style="border:1px solid #dcdcdc">
            <el-table :data="parentRoleDetail" stripe  style="width: 100%">
              <el-table-column prop="resource" label="资源" width="100"></el-table-column>
              <el-table-column prop="actions" label="操作" width="180">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.actions">{{item}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="constraints" label="约束条件" width="250">
                <template slot-scope="prop">
                  <span>{{prop.row.constraints[0]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="parentPermissionView = false">好</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加父角色" :visible.sync="addParentRole" :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :span="4"><div class="pull-right">父角色</div></el-col>
        <el-col :span="20">
          <el-select v-model="addParentRoleName" filterable placeholder="请选择父角色">
            <el-option
              v-for="role in roleList"
              :key="role.name"
              :value="role.name">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addParentRole = false">取消</el-button>
        <el-button type="primary" @click="addParentRoleForRole ()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="text" :visible.sync="updatePermission" :close-on-click-modal="false">
      <el-form :model="form" ref="form" :rules="rules" :label-width="'120px'">

        <el-form-item label="资源类型" prop="type">
          <el-select v-model="form.type" filterable placeholder="请选择资源类型" style="width: 100%">
            <el-option
              v-for="item in resourceTypes"
              :key="item.label"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="资源" prop="resourceName">
          <el-input v-model="form.resourceName" auto-complete="off" placeholder="资源名称请以逗号分隔"></el-input>
        </el-form-item>

        <el-form-item label="操作" prop="actions" :rules="{required: true, message: '请选择操作'}">
          <el-select v-model="form.actions" multiple  placeholder="请选择操作" style="width: 100%">
            <el-option
              v-for="item in allActions"
              :key="item.label"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="约束条件" prop="name">
          <el-form :model="constraintForm" ref="constraintForm" style="width: 100%" class="demo-dynamic">
            <el-form-item
              v-for="(group, index) in constraintForm.groups"
              :key="group.key"
              :prop="'groups.' + index + '.value'"
            >
              <div style="border:1px solid gainsboro">
                <el-row>
                  <el-col :span="11"><div style="text-indent: 5px;">字段</div></el-col>
                  <el-col :span="11"><div >值</div></el-col>
                  <el-col :span="2" class="pull-right">
                    <i class="el-icon-delete" @click.prevent="deleteGroup(group)"></i>
                  </el-col>
                </el-row>
                <!--资源约束条件选择列表区域-->
                <el-row :gutter="2">
                  <el-col :span="12">
                    <el-select v-model="group.constraintSelect" @change="getProjectList" placeholder="选择约束条件类型">
                      <el-option v-for="constraint in constraints"
                                 :key="constraint.label"
                                 :label="constraint.label"
                                 :value="constraint.label">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="9">
                    <el-input v-show=isProjectInput v-model="group.constraintName" type="text"></el-input>
                    <el-select v-show=isProjectSelect v-model="group.constraintName" filterable allow-create default-first-option
                               placeholder="project约束请在列表选择">
                      <el-option
                        v-for="item in projectList"
                        :key="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="3">
                    <el-button @click="openConDataView()" type="info" size="mini" plain>添加</el-button>
                  </el-col>
                  <div v-if="conIsView">
                    <el-col :span="12"><div align="left">{{constraintForm.groups[index].constraintSelect}}</div></el-col>
                    <el-col :span="9"><div align="left">{{constraintForm.groups[index].constraintName}}</div></el-col>
                    <el-col :span="3"><i class="el-icon-close" @click="closeView"></i></el-col>
                  </div>
                </el-row>
              </div>
            </el-form-item>
          </el-form>
          <div><br/>
            <el-button size="mini" class="pull-right" @click="addGroup" plain>添加一组约束条件</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="background-color: gainsboro">
        <el-button @click="updatePermission = false">取消</el-button>
        <el-button type="primary" @click="signPermission('form')">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加用户" :visible.sync="addAccount" @close="" :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :span="4"><div class="pull-right">用户名</div></el-col>
        <el-col :span="20">
          <el-select v-model="addUsers" filterable multiple placeholder="请选择用户">
            <el-option
              v-for="item in userList"
              :key="item.username"
              :value="item.username">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="addAccount = false">取消</el-button>
        <el-button type="primary" @click="addUsersForRole()">创建</el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除权限" :visible.sync="deletePermissonDialog" :close-on-click-modal="false">
      <span>确定要删除该条权限吗？</span><br>
      <span slot="footer" class="dialog-footer">
          <el-button @click="deletePermissonDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmDeletePermission()">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog title="删除父角色" :visible.sync="deleteParentDialog" :close-on-click-modal="false">
      <span>确定要删除父权限：{{deleteParentParam}}？</span><br>
      <span slot="footer" class="dialog-footer">
          <el-button @click="deleteParentDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmDeleteParent()">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog title="删除父角色" :visible.sync="deleteRoleUserDialog" :close-on-click-modal="false">
      <span>确定要从角色中移除：{{deleteRoleUserParam}}？</span><br>
      <span slot="footer" class="dialog-footer">
          <el-button @click="deleteRoleUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmDeleteRoleUser()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import roleService from 'src/services/rb-role-service.factory.js'
  import rbRoleService from 'src/services/rb-role-service.factory'
  import orgService from 'src/services/org.js'
  import permissionService from 'src/services/rb-permission-data-service.factory.js'
  import rbProjectDataService from 'src/services/rb-project-data-service.factory.js'
  import cookieService from 'src/services/cookie.service.js'

  export default {
    components: {
    },
    data () {
      return {
        projectName: '',
        projectList: [],
        isProjectSelect: false,
        isProjectInput: true,
        deleteRoleUserDialog: false,
        deleteRoleUserParam: '',
        deleteParentDialog: false,
        deleteParentParam: '',
        deleteParentUuid: '',
        deletePermissonDialog: false,
        deletePermissonUuid: '',
        searchParentRole: '',
        searchUsers: '',
        activeNames: ['baseInfo'],
        activeName: 'permission',
        roleData: {},
        permissions: [],
        parents: [],
        searchParents: [],
        roleUsers: [],
        searchRoleUsers: [],
        name: this.$route.query.name,
        total: this.$route.query.total,
        roleSum: 0,
        parentPermissionView: false,
        parentRoleName: '',
        parentRoleDetail: [],
        // 修改权限begin
        rolePermissionUuid: '',
        updatePermission: false,
        constraints: [],
        constraintSelect: [],
        form: {
          name: '',
          resourceName: '',
          type: '',
          actions: []
        },
        resourceTypes: [],
        constraintForm: {
          groups: []
        },
        conIsView: false,
        allActions: [],
        // 修改或添加角色的标记(1:添加；2：修改)
        sign: 1,
        text: '',
        // 修改权限end
        addAccount: false,
        userList: [],
        addUsers: [],
        addParentRole: false,
        roleList: [],
        addParentRoleName: '',
        updatePerDialog: false,
        rules: {
          resourceName: [
            {pattern: /^[A-Za-z0-9\-_\-*\-,]+$/, message: '只接受A-Za-z0-9-_*,', trigger: 'blur'},
            {min: 0, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur'}
          ]
        },
        isAdmin: false,
        roleAssign: false,
        roleCreate: false,
        roleDelete: false,
        roleRevoke: false,
        roleUpdate: false,
        roleView: false
      }
    },
    methods: {
      getProjectList (value) {
        if (Object.is('project', value)) {
          rbProjectDataService.getProjects().then((data) => {
            this.projectList = data
          })
          this.isProjectSelect = true
          this.isProjectInput = false
        } else {
          this.isProjectSelect = false
          this.isProjectInput = true
        }
      },
      initPermission () {
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
            } else if (item === 'role:create') {
              this.roleCreate = true
            } else if (item === 'role:delete') {
              this.roleDelete = true
            } else if (item === 'role:revoke') {
              this.roleRevoke = true
            } else if (item === 'role:update') {
              this.roleUpdate = true
            } else if (item === 'role:view') {
              this.roleView = true
            }
          }
        })
      },
      copyRole: function () {
        this.$router.push({
          path: '/org/setting/create_role',
          query: {name: this.name}
        })
      },
      loadRoleDetail () {
        roleService.roleDetail(this.name).then((data) => {
          this.roleData = data
          this.permissions = data.permissions
          this.searchParents = this.parents = data.parents
        })
      },
      getRoleUsers () {
        rbRoleService.getRoleUsers({role_name: this.name}).then((data) => {
          this.searchRoleUsers = this.roleUsers = data
        })
      },
      revokeRoleUsers (userName) {
        this.deleteRoleUserDialog = true
        this.deleteRoleUserParam = userName
      },
      confirmDeleteRoleUser () {
        const data = [{user: this.deleteRoleUserParam}]
        rbRoleService.revokeRoleUsers(data, {role_name: this.name}).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.deleteRoleUserDialog = false
          this.deleteRoleUserParam = ''
          // this.getRoleUsers()
          rbRoleService.getRoleUsers({role_name: this.name}).then((data) => {
            if (this.searchUsers) {
              this.searchRoleUsers = this.roleUsers = data
              this.searchRoleUsers = this.roleUsers.filter((data) => {
                return data.user.includes(this.searchUsers)
              })
            } else {
              this.searchRoleUsers = this.roleUsers = data
            }
          })
        })
      },
      deleteParentRole (parentRole, parentUuid) {
        this.deleteParentDialog = true
        this.deleteParentParam = parentRole
        this.deleteParentUuid = parentUuid
      },
      confirmDeleteParent () {
        rbRoleService.revokeParentRole(this.name, this.deleteParentUuid).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.deleteParentDialog = false
          this.deleteParentParam = ''
          this.deleteParentUuid = ''
          this.loadRoleDetail()
        })
      },
      loadParentRoleDetailPermission (parentRoleName) {
        roleService.roleDetail(parentRoleName).then((data) => {
          this.parentPermissionView = true
          this.parentRoleName = parentRoleName
          this.parentRoleDetail = data.permissions
        })
      },
      deletePermission (permissionUuid) {
        this.deletePermissonUuid = permissionUuid
        this.deletePermissonDialog = true
      },
      confirmDeletePermission () {
        rbRoleService.revokePermission(this.name, this.deletePermissonUuid).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.deletePermissonDialog = false
          this.deletePermissonUuid = ''
          this.loadRoleDetail()
        })
      },
      // 修改权限
      updatePermissionFunction (permissionUuid) {
        // 触发对话框调用方法的标记
        this.sign = 2
        this.text = '修改权限'
        this.updatePerDialog = true
        // 加载对话初始化列表信息
        this.getAllRoleSchemas()
        // 先清空原有数据
        this.rolePermissionUuid = permissionUuid
        this.constraintForm = {
          groups: []
        }
        // 1.根据传入的权限uuid，将其他信息绑定到dialog对话框form数据中
        for (let permission of this.permissions) {
          if (Object.is(permissionUuid, permission.uuid)) {
            this.form.type = permission.actions[0].split(':')[0]
            this.form.resourceName = ''
            if (permission.resource.length > 0) {
              // 将数组转化为dialog对话框要的字符串
              this.form.resourceName = permission.resource.join(',')
            }
            this.form.actions = permission.actions
            // 将已匹配查询出的约束绑定到页面数据
            for (let con of permission.constraints) {
              // {'res:role':'sss'}
              if (con) {
                // 控制约束条件是否显示添加出来
                this.conIsView = true
              } else {
                this.conIsView = false
              }
              if (JSON.stringify(con) === '') {
                this.constraintForm = {
                  groups: []
                }
              } else {
                for (let key in con) {
                  let group = {}
                  group.constraintSelect = key.split(':')[1]
                  group.constraintName = con[key]
                  this.constraintForm.groups.push(group)
                }
              }
            }
          }
        }
        this.updatePermission = true
      },
      commitUpdatePermission (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let permissonData = {
              resource: [],
              actions: [],
              constraints: []
            }
            if (this.form.resourceName) {
              let array = this.form.resourceName.split(',')
              permissonData.resource = array
              // permissonData.resource.push(this.form.resourceName)
            } else {
              // 资源为空时，则默认为所有资源'*'
              permissonData.resource.push('*')
            }
            // 处理actions，筛选与form.type相匹配的action
            if (Object.is(this.form.type, '*')) {
              permissonData.actions = this.form.actions
            } else {
              let actions = this.form.actions
              let arrayAfterSelect = []
              for (let item of actions) {
                let actionName = item.split(':')[0]
                if (Object.is(actionName, this.form.type)) {
                  arrayAfterSelect.push(item)
                }
              }
              permissonData.actions = arrayAfterSelect
            }
            // permissonData.actions = this.form.actions
            // 封装约束条件的数据到permissionData
            for (let group of this.constraintForm.groups) {
              if (group.constraintSelect) {
                let constraint = {}
                let key = 'res:' + group.constraintSelect
                if (group.constraintName) {
                  let value = group.constraintName + ''
                  constraint[key] = value
                } else {
                  constraint[key] = ''
                }
                // 如果添加约束条件，则添加进约束数据中
                if (this.conIsView) {
                  permissonData.constraints.push(constraint)
                }
              } else {
                this.conIsView = false
              }
            }
            // 如果是在项目中添加角色权限时候，需要默认添加项目约束
            if (cookieService.getCookie('project')) {
              this.projectName = cookieService.getCookie('project')
              let constraint = {}
              let key = 'res:project'
              let value = this.projectName + ''
              constraint[key] = value
              permissonData.constraints.push(constraint)
            }
            try {
              rbRoleService.updatePermission(this.name, this.rolePermissionUuid, permissonData).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.loadRoleDetail()
                this.updatePermission = false
              })
            } catch (e) {
              console.error('Failed to update permisssion', e)
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 添加权限
      addPermission () {
        // 触发对话框调用方法的标记
        this.conIsView = false
        this.sign = 1
        this.text = '添加权限'
        // 清空可能存在的数据
        this.form = {
          name: '',
          resourceName: '',
          type: '',
          actions: []
        }
        this.constraintForm = {
          groups: [{}]
        }
        // 加载列表信息
        this.updatePermission = true
        // this.getAllRoleSchemas()
        // this.getConstraints() 已监听
        // this.getOneResourceActions() 已监听
      },
      commitAddPermission (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let permissonData = {
              resource: [],
              actions: [],
              constraints: []
            }
            if (this.form.resourceName) {
              let array = this.form.resourceName.split(',')
              permissonData.resource = array
            } else {
              // 资源为空时，则默认为所有资源'*'
              permissonData.resource.push('*')
            }
            // 处理actions，筛选与form.type相匹配的action
            if (Object.is(this.form.type, '*')) {
              permissonData.actions = this.form.actions
            } else {
              let actions = this.form.actions
              let arrayAfterSelect = []
              for (let item of actions) {
                let actionName = item.split(':')[0]
                if (Object.is(actionName, this.form.type)) {
                  arrayAfterSelect.push(item)
                }
              }
              permissonData.actions = arrayAfterSelect
            }
            // permissonData.actions = this.form.actions
            // 封装约束条件的数据到permissionData
            if (this.conIsView) {
              for (let group of this.constraintForm.groups) {
                if (group.constraintSelect) {
                  let constraint = {}
                  let key = 'res:' + group.constraintSelect
                  if (group.constraintName) {
                    let value = group.constraintName + ''
                    constraint[key] = value
                  } else {
                    constraint[key] = ''
                  }
                  permissonData.constraints.push(constraint)
                }
              }
            }
            // 如果是在项目中添加角色权限时候，需要默认添加项目约束
            if (cookieService.getCookie('project')) {
              this.projectName = cookieService.getCookie('project')
              let constraint = {}
              let key = 'res:project'
              let value = this.projectName + ''
              constraint[key] = value
              permissonData.constraints.push(constraint)
            }
            try {
              rbRoleService.addPermission(this.name, permissonData).then((data) => {
                this.$message({
                  type: 'success',
                  message: '权限添加成功!'
                })
                this.updatePermission = false
                this.loadRoleDetail()
              })
            } catch (e) {
              console.error('fail to add permission', e)
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 判断对话框是权限添加还是修改
      signPermission (formName) {
        if (this.sign === 1) {
          // 调用添加权限方法
          this.commitAddPermission(formName)
        } else if (this.sign === 2) {
          // 调用修改权限方法
          this.commitUpdatePermission(formName)
        }
      },
      addGroup () {
        this.conIsView = false
        this.constraintForm.groups.push({
          value: '',
          key: Date.now()
        })
      },
      openConDataView () {
        this.conIsView = true
      },
      closeView () {
        this.conIsView = false
      },
      deleteGroup (item) {
        var index = this.constraintForm.groups.indexOf(item)
        if (index !== -1) {
          this.constraintForm.groups.splice(index, 1)
        }
      },
      getUserList () {
        return orgService.listOrgAccounts({assign: true
        }).then((data) => {
          // 先获取用户条目
          let total = data.count
          // 再次调用接口获取所有用户
          let count = {
            page: 1,
            page_size: total,
            assign: true
          }
          orgService.listOrgAccounts(count).then((data) => {
            // this.userList = data.results
            this.userList = []
            let users = data.results
            for (let i = 0; i < users.length; i++) {
              // 根据用户名去掉已经关联的用户
              let same = false
              for (let j = 0; j < this.roleUsers.length; j++) {
                if (this.roleUsers[j].user === users[i].username) {
                  // this.userList.splice(i, 1)
                  same = true
                  break
                }
              }
              if (same === false) {
                this.userList.push(users[i])
              }
            }
          })
        }).catch(() => {
          this.userList = []
        })
      },
      addUsersForRole () {
        let data = []
        let userParam = {}
        for (let user1 of this.addUsers) {
          userParam = {'user': user1}
          data.push(userParam)
        }
        const roleName = this.name
        rbRoleService.addUsersForRole(data, roleName).then((data) => {
          this.$message({
            type: 'success',
            message: '用户关联角色成功!'
          })
          this.addAccount = false
          // this.getRoleUsers()
          // 关键字过滤角色关联的用户
          if (this.searchUsers) {
            rbRoleService.getRoleUsers({role_name: this.name}).then((data) => {
              this.searchRoleUsers = this.roleUsers = data
              this.searchRoleUsers = this.roleUsers.filter((data) => {
                return data.user.includes(this.searchUsers)
              })
            })
          } else {
            this.getRoleUsers()
          }
        })
      },
      getRoleAccount () {
        rbRoleService.roleList({}).then((data) => {
          this.roleSum = data.count
        })
      },
      getRoleList () {
        this.addParentRoleName = ''
        this.addParentRole = true
        let total = {
          page: 1,
          page_size: this.roleSum
        }
        rbRoleService.roleList(total).then((data) => {
          this.roleList = data.results
          for (let i = 0; i < this.roleList.length; i++) {
            // 去掉角色自身
            if (this.name === this.roleList[i].name) {
              this.roleList.splice(i, 1)
            }
            // 去掉已经添加的父角色
            for (let item of this.parents) {
              if (item.name === this.roleList[i].name) {
                this.roleList.splice(i, 1)
              }
            }
          }
        })
      },
      addParentRoleForRole () {
        try {
          // 根据父角色的name获取对应的uuid
          let roleUuid = ''
          let list = this.roleList
          for (let item of list) {
            if (item.name === this.addParentRoleName) {
              roleUuid = item.uuid
            }
          }
          // 封装数据调用添加父角色接口
          let data = {
            uuid: roleUuid,
            name: this.addParentRoleName
          }
          const roleName = this.name
          rbRoleService.addParentForRole(data, roleName).then((data) => {
            this.$message({
              type: 'success',
              message: '添加父角色成功!'
            })
            this.addParentRole = false
            this.loadRoleDetail()
          }, (data) => {
            this.$message({
              type: 'error',
              message: data.response.data.errors[0].fields[0].uuid[0]
            })
          })
        } catch (e) {
          console.error('Failed to add parent role', e)
        }
      },
      loadParentRoleDetail ($index, name) {
        this.name = name
        this.activeName = 'permission'
        this.$router.push({path: '/org/setting/role_detail', query: {name: name, total: this.total}})
      },
      addSubaccount () {
        this.addAccount = true
        this.addUsers = []
      },
      // 以下方法来自create——role
      // 资源类型：获取所有资源类型，封装数据到资源类型列表resourceTypes
      getAllRoleSchemas () {
        this.resourceTypes = []
        rbRoleService.getAllRoleSchemas().then((data) => {
          for (let item of data) {
            let resource = {label: item.resource}
            this.resourceTypes.push(resource)
          }
        })
      },
      // 操作allActions：根据类别所选资源类型，获取该资源的操作操作列表和约束条件列表（调用获取某个资源信息的url）
      getOneResourceActions () {
        this.allActions = []
        this.constraints = []
        let resourceType = this.form.type
        rbRoleService.getOneRoleSchema(resourceType).then((data) => {
          let actionList = data.actions
          for (let action of actionList) {
            this.allActions.push({label: action})
          }
          // 给每个资源添加一个*的action
          let resourceName = actionList[0].split(':')[0]
          if (resourceName !== '*') {
            let actionAll = resourceName + ':*'
            this.allActions.push({label: actionAll})
          }
        })
      },
      // 3.约束条件constraints：根据所选资源类型，获取该资源的约束条件列表（调用获取某个资源信息的url）
      getConstraints () {
        this.constraints = []
        let resourceType = this.form.type
        if (resourceType !== '*') {
          // 获取某种特定资源约束
          rbRoleService.getOneRoleSchema(resourceType).then((data) => {
            let constraintBody = data.constraints
            for (let item in constraintBody) {
              let arrCon = item.split(':')[1]
              let cons = {
                label: arrCon
              }
              this.constraints.push(cons)
            }
          })
        } else if (resourceType === '*') {
          // 如果是*,则获取所有资源的所有约束条件，并且去重
          let allConstraintName = []
          rbRoleService.getAllRoleSchemas().then((data) => {
            for (let resource of data) {
              let constraintBody = resource.constraints
              for (let item in constraintBody) {
                let arrCon = item.split(':')[1]
                allConstraintName.push(arrCon)
              }
            }
            // 将所有资源的约束条件去重过滤
            let noRepeatName = []
            for (var i = 0; i < allConstraintName.length; i++) {
              let isRepeated = false
              for (var j = 0; j < noRepeatName.length; j++) {
                if (allConstraintName[i] === noRepeatName[j]) {
                  isRepeated = true
                  break
                }
              }
              if (!isRepeated) {
                noRepeatName.push(allConstraintName[i])
              }
            }
            // 约束条件去重后赋给绑定参数
            for (let arrCon of noRepeatName) {
              let cons = {
                label: arrCon
              }
              this.constraints.push(cons)
            }
          })
        }
      },
      clearSelectAction () {
        if (this.form.actions.length > 0) {
          if (this.form.type !== this.form.actions[0].split(':')[0]) {
            this.form.actions = []
          }
        }
      }
    },
    mounted: function () {
      this.initPermission()
      this.loadRoleDetail()
      this.getRoleUsers()
      this.getUserList()
      this.getRoleAccount()
      this.getAllRoleSchemas()
    },
    watch: {
      '$route' () {
        this.loadRoleDetail()
        this.getRoleUsers()
        this.getUserList()
      },
      'form.type': function (val, oldval) {
        this.getConstraints()
        this.getOneResourceActions()
        this.clearSelectAction()
      },
      'roleUsers': function (val, oldval) {
        this.getUserList()
      },
      searchParentRole: function (newValue) {
        this.searchParents = this.parents.filter((data) => {
          return data.name.includes(newValue)
        })
      },
      'searchUsers': function (newValue) {
        this.searchRoleUsers = this.roleUsers.filter((data) => {
          return data.user.includes(newValue)
        })
      }
    }
  }
</script>

<style scoped>

</style>
