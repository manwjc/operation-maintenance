<template>
  <div class="component-container">
    <div>
      <el-row>
        <el-col :span="6" >
          <el-input v-model="filterKey" placeholder="角色名关键字检索" style="width: 340px" size="small" id="search">
            <!--<el-button slot="append" icon="el-input__icon el-icon-search" type="primary"-->
                       <!--@click="onSearchChanged"></el-button>-->
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" class="confirm-add-new-role pull-right"
                     v-show="roleCreate" @click="create">创建角色</el-button>
        </el-col>
      </el-row>

      <el-row>
          <el-table v-show="roleView" size="mini" :data="tableData" stripe style="width: 100%">
            <el-table-column label="名称" width="550px">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="roleDetail(scope.$index, scope.row.name)"
                  type="text">
                  {{scope.row.name}}
                </el-button>
                <el-popover placement="top-start" trigger="hover" @show="getRoleUsers(scope.row.name)">
                  <el-tag v-for="user in roleUsers" v-if="roleUsersIsExist" :key="user.user" :disable-transitions="true"
                          :closable="roleRevoke" size="small" type="info" style="margin-right: 5px;"
                          @close="revokeRoleUsers(user)">{{user.user}}</el-tag>
                  <el-button  v-if="!roleUsersIsExist" type="text" style="color: black;cursor: text;margin: 0px;padding: 0px;">该角色下暂无用户</el-button >
                  <i slot="reference" class="fa fa-group" style="cursor: pointer;color: #428bca;"></i>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="project_name" label="项目"width="250px"/>
            <el-table-column prop="created_at" label="创建时间" width="250px">
              <template slot-scope="scope">
                <div>{{scope.row.created_at | formatDate}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="50px">
              <template slot-scope="scope">
                <!--<el-tooltip content="删除" placement="top" :hide-after="3000">-->
                  <i v-show="roleDelete1" class="el-icon-delete" @click="roleDelete(scope.$index, scope.row.name)"></i>
                <!--</el-tooltip>-->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="roleView"
            class="pull-right"
            @size-change="sizeChange"
            @current-change="pageChange"
            :page-sizes="[20, 40, 60, 80]"
            :page-size="page.page_size"
            :current-page="page.current_page"
            :total="page.total"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
      </el-row>
      <el-dialog title="删除角色" :visible.sync="deleteRoleDialog" :close-on-click-modal="false">
        <span>确定删除角色:{{deleteRoleName}}</span><br>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="deleteRoleMethod()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import rbRoleService from 'src/services/rb-role-service.factory'
  import permissionService from 'src/services/rb-permission-data-service.factory.js'
  export default {
    data () {
      return {
        deleteRoleDialog: false,
        deleteRoleName: '',
        roleUsers: [],
        userRolesIsExist: true,
        tableData: [],
        originTableData: [],
        spaces: [],
        filterKey: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        page: {
          page_size: 20,
          current_page: 1,
          total: 0
        },
        roleUsersIsExist: false,
        isPermission: false,
        isAdmin: false,
        roleAssign: false,
        roleCreate: false,
        roleDelete1: false,
        roleRevoke: false,
        roleUpdate: false,
        roleView: false
      }
    },
    mounted: function () {
      this.loadData()
      this.initPermission()
    },
    computed: {
    },
    methods: {
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
              this.roleDelete1 = true
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
      loadData () {
        rbRoleService.roleList({
          filterKey: this.filterKey,
          page: this.page.current_page,
          page_size: this.page.page_size
        }).then((data) => {
          this.tableData = data.results
          this.page.total = data.count
        })
      },
      getRoleUsers (name) {
        this.roleUsers = []
        rbRoleService.getRoleUsers({role_name: name}).then((data) => {
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
        rbRoleService.revokeRoleUsers(data, {role_name: user.role_name}).then((data) => {
          this.roleUsers.splice(this.roleUsers.indexOf(user), 1)
        }, (data) => {
          this.$message({
            type: 'error',
            message: data.response.data.errors
          })
        })
      },
      create: function () {
        this.$router.push('/org/setting/create_role')
      },
      roleDelete (index, name) {
        this.deleteRoleDialog = true
        this.deleteRoleName = name
      },
      deleteRoleMethod () {
        rbRoleService.deleteRoles(this.deleteRoleName).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.deleteRoleName = ''
          this.deleteRoleDialog = false
          this.loadData()
        })
      },
      // roleDelete (index, name) {
      //   this.$confirm('删除角色' + name, '删除', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     rbRoleService.deleteRoles(name).then(() => {
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功!'
      //       })
      //       // this.tableData.splice(index, 1, this.tableData)
      //       this.loadData()
      //     })
      //   })
      // }
      roleDetail ($index, name) {
        sessionStorage.setItem('name', name)
        this.$router.push({path: '/org/setting/role_detail', query: {name: name, total: this.page.total}})
      },
      sizeChange (val) {
        this.page.page_size = val
        this.loadData()
      },
      pageChange (val) {
        this.page.current_page = val
        this.loadData()
      }
      // onSearchChanged () {
      //   this.page.page = 1
      //   this.loadData()
      // }
    },
    watch: {
      filterKey: 'loadData'
    }
  }
</script>
<style lang="scss" scoped>
@import './role-list';
</style>
