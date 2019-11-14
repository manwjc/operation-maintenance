<template>
  <div>
    <div class="rb-page-heading2">
      <h1 class="ng-binding2">
        <i class="project-icon fa fa-th-large"></i>
        <span>{{project_name}}</span>
      </h1>
      <div class="rb-heading-button-group2">
        <el-button size="small" @click="queryResourceDetail">查看资源详情</el-button>
        <el-button size="small" @click="projectModify">更新</el-button>
        <el-button v-show="projectDelete" size="small" type="info" @click="deleteProject">删除</el-button>
      </div>
    </div>

    <el-card style="margin-bottom: 15px">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="2" style="margin-left: 100px;margin-top: -10px;" align="right"><div style="color: #A1A1A1;">创建者</div></el-col>
        <el-col :span="2"><div style="color: #666;margin-top: -10px;">{{project_detail.created_by}}</div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" style="margin-left: 100px" align="right"><div style="color: #A1A1A1">创建时间</div></el-col>
        <el-col :span="10"><div style="color: #666">{{project_detail.created_at	| formatUtcStr}}</div></el-col>
        <el-col :span="2" align="right"><div style="color: #A1A1A1">更新时间</div></el-col>
        <el-col :span="6"><div style="color: #666">{{project_detail.updated_at | formatUtcStr}}</div></el-col>
      </el-row>
    </el-card>

    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="角色" name="first">
        <el-input v-model="roleSearch" placeholder="关键字" style="width: 300px;" size="small">
          <el-button slot="append" icon="el-icon-search"  @click="getProjectRoles"></el-button>
        </el-input>
        <el-button v-show="roleCreate" size="mini" type="primary" @click="" style="float: right" @click="createRoleFun">创建角色</el-button>
        <el-table v-show="roleView" :data="roleData" stripe style="width: 100%">
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span @click="toRoleDetailFun(scope.row.name)" class="spanTo">{{ scope.row.name }}</span>
              <el-popover placement="top-start" trigger="click" @show="getRoleUsers(scope.row)">
                <el-tag v-for="user in roleUsers" v-if="roleUsersIsExist" :key="user.user" :disable-transitions="true"
                        :closable="roleRevoke" size="small" type="info"
                        style="margin-right: 5px;" @close="revokeRoleUsers(user)">{{user.user}}</el-tag>
                <el-button  v-if="!roleUsersIsExist" type="text" style="color: black;cursor: text;margin: 0px;padding: 0px;">该角色下暂无用户</el-button >
                <i slot="reference" class="fa fa-group" style="cursor: pointer;color: #428bca;"></i>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="项目" prop="project_name" width="230"></el-table-column>
          <el-table-column label="创建时间" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at | formatUtcStr}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button v-show="roleDelete" size="mini" type="primary" icon="el-icon-delete" style="padding: 3px 5px" @click="handleDeleteRole(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="成员" name="second">
        <el-input v-model="userSearch" placeholder="关键字" style="width: 300px;" size="small">
          <el-button slot="append" icon="el-icon-search" @click="getProjectAccounts"></el-button>
        </el-input>
        <el-button v-show="userCreate" size="mini" type="primary" @click="openAssignRoleToUsers" style="float: right">添加用户</el-button>
        <el-table v-show="userView" :data="userData" stripe style="width: 100%">
          <el-table-column label="用户名" prop="username">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
              <el-popover v-show="userView" placement="top-start" trigger="click" @show="getUserRoles(scope.row)">
                <el-tag v-for="role in userRoles" v-if="userRolesIsExist" :key="role.role_name" :disable-transitions="true"
                        :closable="roleAssign" size="small" type="info" style="margin-right: 5px;" @close="revokeUserRoles(role)">
                  <a @click="toRoleDetailFun(role.role_name)" style="cursor: pointer;text-decoration: none;">{{role.role_name}}</a>
                </el-tag>
                <el-button  v-if="!userRolesIsExist" type="text" style="color: black;cursor: text;margin: 0px;padding: 0px;">该用户暂未分配任何角色</el-button >
                <i slot="reference" class="fa fa-group" style="cursor: pointer;color: #428bca;"></i>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at | formatUtcStr}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button v-show="roleAssign" size="mini" type="primary" icon="el-icon-plus" style="padding: 3px 5px" @click="openAssignRoles(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="事件" name="third">
        <event-list v-show="eventView" type="'organization'" :noMassage="true"></event-list>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="添加角色"
      :visible.sync="assignRolesDialogVisible"
      width="40%" top="30vh">
      <table width="100%">
        <tr>
          <td align="right" width="20%">用户名</td>
          <td style="padding-left: 20px">{{username}}</td>
        </tr>
        <tr style="height: 20px;"></tr>
        <tr>
          <td align="right" width="20%">角色</td>
          <td style="padding-left: 20px">
            <div>
              <el-select v-model="selectedRoleOptions" multiple placeholder="选择要添加的角色" style="width: 90%">
                <el-option v-for="item in roleOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </div>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="selectedRoleOptions.length" @click="assignRolesConfirm">确 定</el-button>
        <el-button type="primary" v-else disabled>确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加用户"
      :visible.sync="assignRoleToUsersDialogVisible"
      width="40%" top="30vh">
      <table width="100%">
        <tr>
          <td align="right" width="20%">角色名称</td>
          <td style="padding-left: 20px">
            <div>
              <el-select v-model="selectedRoleOneOption" placeholder="选择要添加的角色" style="width: 90%">
                <el-option v-for="item in roleListOptions" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </div>
          </td>
        </tr>
        <tr style="height: 20px;"></tr>
        <tr>
          <td align="right" width="20%">用户名</td>
          <td style="padding-left: 20px">
            <div>
              <el-select filterable v-model="selectedUserListOptions" multiple placeholder="选择要添加的用户" style="width: 90%">
                <el-option v-for="item in userListOptions" :key="item.username" :label="item.username" :value="item.username"></el-option>
              </el-select>
            </div>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRoleToUsersDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="selectedRoleOneOption && selectedUserListOptions.length" @click="assignRoleToUsersConfirm">确 定</el-button>
        <el-button type="primary" v-else disabled>确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import rbProjectDataService from 'src/services/rb-project-data-service.factory.js'
  import eventList from 'src/pages/event/list/event-list.vue'
  import rbRoleUtilities from 'src/services/rbac_role/rb-role-utilities.factory.js'
  export default {
    components: {
      eventList
    },
    watch: {
      '$route' () {
        this.getProjectDetail()
        this.getProjectRoles()
        this.getProjectAccounts()
      },
      roleSearch: function (newValue) {
        this.getProjectRoles()
      },
      userSearch: function (newValue) {
        this.getProjectAccounts()
      }
    },
    data () {
      return {
        project_name: '',
        project_detail: {},
        activeName: 'first',
        roleSearch: '',
        userSearch: '',
        roleData: [],
        userData: [],
        usernameData: [],
        roleUsers: [],
        userRoles: [],
        userRolesIsExist: true,
        roleUsersIsExist: true,
        assignRolesDialogVisible: false,
        username: '',
        roleOptions: [],
        selectedRoleOptions: [],
        alreadyAssignRoles: [],
        assignRoleToUsersDialogVisible: false,
        roleListOptions: [],
        selectedRoleOneOption: '',
        userListOptions: [],
        selectedUserListOptions: [],
        projectView: false,
        projectCreate: false,
        projectDelete: false,
        projectUpdate: false,
        roleCreate: false,
        roleDelete: false,
        roleRevoke: false,
        roleView: false,
        roleAssign: false,
        userCreate: false,
        userView: false,
        userDelete: false,
        userUpdate: false,
        eventView: false
      }
    },
    mounted: function () {
      this.getProjectPermission()
      this.getProjectDetail()
      this.getProjectRoles()
      this.getProjectAccounts()
    },
    methods: {
      getProjectPermission () {
        rbRoleUtilities.resourceTypeSupportPermissions('project', 'view')
          .then((data) => {
            this.projectView = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('project', 'create')
          .then((data) => {
            this.projectCreate = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('project', 'delete')
          .then((data) => {
            this.projectDelete = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('project', 'update')
          .then((data) => {
            this.projectUpdate = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('role', 'create')
          .then((data) => {
            this.roleCreate = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('role', 'delete')
          .then((data) => {
            this.roleDelete = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('role', 'revoke')
          .then((data) => {
            this.roleRevoke = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('role', 'view')
          .then((data) => {
            this.roleView = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('role', 'assign')
          .then((data) => {
            this.roleAssign = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('subaccount', 'create')
          .then((data) => {
            this.userCreate = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('subaccount', 'view')
          .then((data) => {
            this.userView = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('subaccount', 'delete')
          .then((data) => {
            this.userDelete = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('subaccount', 'update')
          .then((data) => {
            this.userUpdate = data
          })
        rbRoleUtilities.resourceTypeSupportPermissions('event', 'view')
          .then((data) => {
            this.eventView = data
          })
      },
      getProjectDetail () {
        this.project_name = this.$route.query.project_name
        rbProjectDataService.getProjectDetail({project_name: this.project_name}).then((data) => {
          this.project_detail = data
        })
      },
      getProjectRoles () {
        rbProjectDataService.getProjectRoles({project_name: this.project_name, search: this.roleSearch}).then((data) => {
          this.roleData = []
          data.results && data.results.forEach(item => {
            this.roleData.push({
              project_name: item.project_name,
              name: item.name,
              created_at: item.created_at
            })
          })
        })
      },
      getProjectAccounts () {
        rbProjectDataService.getProjectAccounts({project_name: this.project_name, search: this.userSearch}).then((data) => {
          this.userData = []
          this.usernameData = []
          data.results && data.results.forEach(item => {
            this.userData.push({
              username: item.username,
              created_at: item.created_at
            })
            this.usernameData.push(item.username)
          })
        })
      },
      projectModify () {
        this.$router.push({path: '/project/modify', query: {project_name: this.project_name}})
      },
      deleteProject () {
        this.$confirm(`确定要删除项目${this.project_name}?`, '删除项目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rbProjectDataService.deleteProject({project_name: this.project_name}).then((data) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.$store.commit('setProject', '')
            this.$router.push('/app_service/app_service/list')
          }, (data) => {
            this.$message({
              type: 'error',
              message: data.response.data.errors
            })
          })
        })
      },
      handleDeleteRole (index, row) {
        this.$confirm(`确定要删除角色${row.name}?`, '删除角色', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rbProjectDataService.deleteRole({role_name: row.name, project_name: this.project_name}).then((data) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.roleData = []
            this.getProjectRoles()
          }, (data) => {
            this.$message({
              type: 'error',
              message: data.response.data.errors
            })
          })
        })
      },
      getRoleUsers (row) {
        this.roleUsers = []
        rbProjectDataService.getRoleUsers({role_name: row.name, project_name: this.project_name}).then((data) => {
          this.roleUsers = data
          if (data.length) {
            this.roleUsersIsExist = true
          } else {
            this.roleUsersIsExist = false
          }
        })
      },
      revokeRoleUsers (user) {
        const data = [{user: user.user}]
        rbProjectDataService.revokeRoleUsers(data, {role_name: user.role_name, project_name: this.project_name}).then((data) => {
          this.roleUsers.splice(this.roleUsers.indexOf(user), 1)
        }, (data) => {
          this.$message({
            type: 'error',
            message: data.response.data.errors
          })
        })
      },
      getUserRoles (row) {
        this.userRoles = []
        rbProjectDataService.getUserRoles({username: row.username, project_name: this.project_name}).then((data) => {
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
        rbProjectDataService.revokeRoleUsers(data, {role_name: role.role_name, project_name: this.project_name}).then((data) => {
          this.userRoles.splice(this.userRoles.indexOf(role), 1)
        }, (data) => {
          this.$message({
            type: 'error',
            message: data.response.data.errors
          })
        })
      },
      openAssignRoles (user) {
        this.username = user.username
        this.roleOptions = []
        this.selectedRoleOptions = []
        this.assignRolesDialogVisible = true
        rbProjectDataService.getUserRoles({username: user.username, project_name: this.project_name}).then((data) => {
          this.alreadyAssignRoles = data
          rbProjectDataService.getProjectRoles({project_name: this.project_name, search: this.roleSearch, action: 'assign'}).then((data) => {
            data.results.forEach(item => {
              this.roleOptions.push(item.name)
            })
            this.alreadyAssignRoles.forEach(item => {
              const index = this.roleOptions.indexOf(item.role_name)
              if (index !== -1) {
                this.roleOptions.splice(index, 1)
              }
            })
          })
        })
      },
      assignRolesConfirm () {
        this.assignRolesDialogVisible = false
        const data = []
        this.selectedRoleOptions.forEach(item => {
          data.push({
            name: item
          })
        })
        rbProjectDataService.assignUserRoles(data, {username: this.username, project_name: this.project_name}).then((data) => {
        })
      },
      queryResourceDetail () {
        this.$router.push({path: '/project/resource_list', query: {project_name: this.project_name}})
      },
      openAssignRoleToUsers () {
        this.roleListOptions = []
        this.userListOptions = []
        this.selectedRoleOneOption = ''
        this.selectedUserListOptions = []
        rbProjectDataService.getProjectRoles({page: 1, page_size: 0, project_name: this.project_name, action: 'assign'}).then((data) => {
          data.results.forEach(item => {
            this.roleListOptions.push({name: item.name})
          })
          this.selectedRoleOneOption = this.roleListOptions[0].name
        })
        rbProjectDataService.getProjectAccounts({page: 1, page_size: 0, project_name: this.project_name, assign: true}).then((data) => {
          data.results.forEach(item => {
            if (this.usernameData.indexOf(item.username) === -1) {
              this.userListOptions.push({username: item.username})
            }
          })
        })
        this.assignRoleToUsersDialogVisible = true
      },
      assignRoleToUsersConfirm () {
        this.assignRoleToUsersDialogVisible = false
        const data = []
        this.selectedUserListOptions.forEach(item => {
          data.push({
            user: item
          })
        })
        rbProjectDataService.assignRoleUsers(data, {role_name: this.selectedRoleOneOption, project_name: this.project_name}).then((data) => {
          this.getProjectAccounts()
        })
      },
      createRoleFun () {
        this.$router.push({path: '/org/setting/create_role', query: {projectName: this.$route.query.project_name}})
      },
      toRoleDetailFun (roleName) {
        this.$router.push({path: '/org/setting/role_detail', query: {name: roleName, projectName: this.$route.query.project_name}})
      }
    }
  }
</script>
<style>
  .rb-page-heading2{
    min-height: 32px;
    margin: 0px 0px 20px 0px;
  }
  .ng-binding2{
    float: left;
    margin: 0px;
    font-size: 24px;
  }
  .rb-heading-button-group2{
    float: right;
  }
  #my-el-collapse .el-collapse-item__content{
    padding-bottom: 0px;
  }
  /*#my-el-collapse .el-collapse, #my-el-collapse .el-collapse-item__header, #my-el-collapse .el-collapse-item__wrap {*/
    /*border-bottom: 0px solid #e6ebf5;*/
  /*}*/
  #my-el-collapse .el-collapse-item__header:hover{
    background-color: #F4F4F4;
  }
  .spanTo {
    cursor: pointer;
    color:#428BCA;
  }
  .spanTo:hover {
    color: #494949;;
  }
</style>
