<template>
  <div class="component-container">
    <el-form :model="form1" ref="form1" :label-width="'120px'">

      <el-form-item label="角色名称" prop="name" style="width: 90%"
                    :rules="[{ required: true,message: '角色名不能为空'},{min: 1, max: 20, message: '长度在 1 到 20 个字符'},{pattern: /^[A-Za-z0-9\-_]+$/, message: '只接受A-Za-z0-9-_'}]">
        <el-input v-model="form1.name" placeholder="接受A-Za-z0-9-_等字符"></el-input>
      </el-form-item>
      <hr style= "border:1px dashed  #dcdcdc">

      <el-form-item label="父角色" prop="spaces">
        <span>名称</span>
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
          <!--动态添加父角色的选择列表-->
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.domains"
            :key="domain.key"
            :prop="'domains.' + index + '.value'">
            <!--选择父角色-->
              <el-select v-model="domain.selectRole" placeholder="请选择父角色" filterable style="width: 90%">
                <el-option v-for="role in roleList"
                           :key="role.name"
                           :label="role.name"
                           :value="role.name">
                </el-option>
              </el-select>
              <i class="el-icon-view" @click="loadParentRoleDetailPermission(domain.selectRole)"/>
              <i class="el-icon-remove" @click="removeDomain(domain)"></i>
          </el-form-item>
          <el-form-item>
            <el-row>
              <div align="center" @click="addDomain" style="background-color: silver; width: 90%;cursor: pointer">
                <i class="el-icon-circle-plus"></i>
              </div>
            </el-row>
          </el-form-item>
        </el-form>
      </el-form-item>
      <hr style= "border:1px dashed  #dcdcdc">

      <el-form-item label="权限" prop="description">
        <el-tag type="info" color="#f0fff0">
          <i class="el-icon-warning"></i>
          如果您没有选择父角色，则请主动为角色添加权限。
        </el-tag>
        <!--添加权限完成显示位置-->
        <el-row id="row2" style="display:block;margin-top:7px;">
          <el-col :span="24">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="resour" label="资源" width="180">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.resour">{{item}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="actionName" label="操作" width="180">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.actionName">{{item}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="con" label="约束条件">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.con">{{item}}</div>
                </template>
              </el-table-column>
              <el-table-column  prop="actions" label="操作">
                <template slot-scope="scope">
                  <el-button @click="updatePermissions(scope.$index, scope.row)" size="small"><i  class="el-icon-edit"></i></el-button>
                  <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"  size="small"><i class="el-icon-close"></i></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div>
      <el-button size="mini" plain class="pull-right" @click="getAllRoleSchemas()">添加</el-button>
      <br/>
    </div>

    <div slot="footer" class="pull-right"><br/>
      <el-button class="create-role" type="primary" @click="createRole('form1')">创 建</el-button>
      <el-button class="cancel-add-permission" @click="cancleCreateRole">取 消</el-button>
    </div>

    <el-dialog class="add-permission-dialog" :title="this.showName"
               :visible.sync="permissionVisible" :close-on-click-modal="false">
      <el-form :model="form" ref="form" :label-width="'120px'">
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

        <el-form-item label="资源" prop="space">
          <el-input v-model="form.resourceName" auto-complete="off" placeholder="资源名请用逗号分离"></el-input>
        </el-form-item>

        <el-form-item label="操作" prop="actions" :rules="{required: true}">
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
              class="add-constraint-group-item"
              v-for="(group, index) in constraintForm.groups"
              :key="group.key"
              :prop="'groups.' + index + '.value'"
            >
              <div class="demo-rangs" style="border:1px solid gainsboro">
                <el-row>
                  <el-col :span="11"><div style="text-indent: 5px;">字段</div></el-col>
                  <el-col :span="11"><div >值</div></el-col>
                  <el-col :span="2" class="pull-right">
                    <i class="el-icon-delete" @click.prevent="deleteGroup(group)"></i>
                  </el-col>
                </el-row>
                <!--资源约束条件选择列表区域-->
                <el-row style="height:auto">
                  <el-col :span="10" class="row-col-rource-constraint list-demo-range">
                    <el-select v-model="group.constraintSelect" @change="getProjectList" placeholder="选择约束条件类型">
                      <el-option v-for="constraint in constraints"
                                 :key="constraint.label"
                                 :label="constraint.label"
                                 :value="constraint.label">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="10" class="row-col-rource-constraint">
                    <el-input v-show=isProjectInput v-model="group.constraintName" type="text"></el-input>
                    <!--修改成下拉列表的形式-->
                    <el-select v-show=isProjectSelect v-model="group.constraintName" filterable allow-create default-first-option
                               placeholder="project约束请在列表选择">
                      <el-option
                        v-for="item in projectList"
                        :key="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="2">
                    <el-button class="showConstraint" @click="openConDataView()" type="info" size="mini" plain>添加</el-button>
                  </el-col>
                </el-row>
                <el-row v-if="conIsView">
                  <el-col class="con-is-view" :span="10"><div>{{constraintForm.groups[index].constraintSelect}}</div></el-col>
                  <el-col class="con-is-view" :span="10"><div>{{constraintForm.groups[index].constraintName}}</div></el-col>
                  <el-col class="pull-right" :span="2"><i class="el-icon-close" @click="closeView()"></i></el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-form>
          <div class="add-group-range">
            <el-button size="mini" type="info" class="pull-right add-one-group-constraint" @click="addGroup()" plain>添加一组约束条件</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="">
        <el-button class="cancel-add-permission" @click="permissionVisible = false">取消</el-button>
        <el-button class="confirm-add-permission" type="primary" @click="addPermissions('constraintForm')">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="父角色详情预览" :visible.sync="parentPermissionView" :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :span="4"><div class="pull-right">角色</div></el-col>
        <el-col :span="20">{{this.parentRoleName}}</el-col>
      </el-row><br/>
      <el-row :gutter="20">
        <el-col :span="4"><div class="pull-right">权限</div></el-col>
        <el-col :span="20">
          <div style="border:1px solid #dcdcdc">
            <el-table :data="parentRoleDetail" stripe="true"  style="width: 100%">
              <el-table-column prop="resource" label="资源" width="100"></el-table-column>
              <el-table-column prop="actions" label="操作" width="180"></el-table-column>
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
  </div>
</template>


<script>
  import rbRoleService from 'src/services/rb-role-service.factory'
  import rbProjectDataService from 'src/services/rb-project-data-service.factory.js'
  import cookieService from 'src/services/cookie.service.js'
  export default {
    data () {
      return {
        projectName: this.$route.query.projectName,
        // 新增角色参数类型
        createRoleInFormation: {
          name: '',
          parents: [],
          permissions: []
        },
        copyRoleName: this.$route.query.name,
        copyInfo: {},
        permissionsData: [],
        // 动态添加父角色列表数据
        dynamicValidateForm: {
          domains: []
        },
        // selectRole: [],
        roleList: [],
        // 父角色数据
        parentPermissionView: false,
        parentRoleName: '',
        parentRoleDetail: [],
        // 动态添加资源操作数据
        resourceTypes: [],
        // 操作类型
        allActions: [],
        actions: [],
        space: '',
        // 添加约束数据
        constraintForm: {
          groups: []
        },
        // constraints: [{
        //   label: 'project'
        // }],
        constraints: [],
        filterKey: '',
        permissionVisible: false,
        form: {
          name: '',
          resourceName: '',
          type: '',
          actions: []
        },
        form1: {
          name: ''
        },
        // 添加权限预览数据
        tableData: [],
        tableDataListen: false,
        // 约束条件预览数据
        conIsView: false,
        conType: '',
        conName: '',
        showName: '',
        updateIndex: 0,
        projectList: [],
        isProjectSelect: false,
        isProjectInput: true,
        rulesRoleName: {
          name: [
            {required: true, message: '角色名不能为空', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
            {pattern: /^[A-Za-z0-9\-_]+$/, message: '只接受A-Za-z0-9-_', trigger: 'blur'}
          ]
        }
      }
    },
    mounted: function () {
      this.getCopyedRoleDetail()
      this.getRoleList()
      // this.copyRole()
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
      createRole (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 1.父角色和权限必须添加一项，否则无法创建角色
            // 待添加判断代码
            // 2.如果父角色名称不为空，获取uuid，并添加父角色信息到createRoleInFormation中
            this.createRoleInFormation.name = this.form1.name
            this.createRoleInFormation.parents = []
            this.createRoleInFormation.permissions = []
            let demains = this.dynamicValidateForm.domains
            if (demains.length > 0) {
              for (let demain of demains) {
                let parent = {
                  name: '',
                  uuid: ''
                }
                parent.name = demain.selectRole
                for (let role of this.roleList) {
                  if (role.name === demain.selectRole) {
                    parent.uuid = role.uuid
                    // 将parent添加到新增角色的父角色中
                    this.createRoleInFormation.parents.push(parent)
                  }
                }
              }
            }
            // 3.添加权限信息到新增角色数据中
            // TODO this.permissionsData被修改成 tableData，解决添加权限又删除，权限仍然存在的问题；
            for (let perItem of this.tableData) {
              let permissionItem = {
                resource: [],
                actions: [],
                constraints: []
              }
              // 判断是否是String类型
              if (Object.prototype.toString.call(perItem.resour) === '[object String]') {
                // 将逗号分隔的字符串拆分成数组给创建角色接口入参
                let array = perItem.resour.split(',')
                permissionItem.resource = array
                // permissionItem.resource.push(perItem.resour)
              } else if (Object.prototype.toString.call(perItem.resour) !== '[object String]') {
                permissionItem.resource = perItem.resour
              }
              permissionItem.actions = perItem.actionName
              for (let item of perItem.con) {
                if (Object.prototype.toString.call(item) === '[object String]') {
                  // 如果是字符串,分隔数据封装层接口入参
                  // 'a:b:c'   => {'a:b' : 'c'}
                  let constraint = {}
                  let conArray = []
                  conArray = item.split(':')
                  let key = conArray[0] + ':' + conArray[1]
                  constraint[key] = conArray[2]
                  permissionItem.constraints.push(constraint)
                } else if (Object.prototype.toString.call(item) !== '[object String]') {
                  // 如果是对象{a: 'b:c'}
                  permissionItem.constraints.push(item)
                }
              }
              // 封装好的约束条件放入创建角色的数据createRoleInFormation中
              this.createRoleInFormation.permissions.push(permissionItem)
            }
            // 调用创建角色的接口
            if (this.createRoleInFormation.parents.length === 0 && this.createRoleInFormation.permissions.length === 0) {
              this.$message({
                message: '至少需要添加一条权限'
              })
            } else {
              rbRoleService.createRole(this.createRoleInFormation).then((data) => {
                this.$message({
                  type: 'success',
                  message: '角色创建成功'
                })
                this.$router.push({
                  path: '/org/setting/role_detail',
                  query: {name: this.createRoleInFormation.name}
                })
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      copyRole () {
        if (this.copyInfo) {
          // 复制父角色信息
          if (this.copyInfo.parents.length !== 0) {
            for (let parent of this.copyInfo.parents) {
              let selected = {
                selectRole: parent.name
              }
              this.dynamicValidateForm.domains.push(selected)
            }
          }
          // 复制权限信息
          if (this.copyInfo.permissions.length !== 0) {
            for (let permission of this.copyInfo.permissions) {
              let item = {
                resour: [],
                actionName: [],
                con: []
              }
              item.resour = permission.resource
              item.actionName = permission.actions
              item.con = permission.constraints
              this.tableData.push(item)
              // 给对话框输入的资源使用，resour需要为字符串
              let item2 = {
                resour: '',
                actionName: [],
                con: []
              }
              if (item2.resour) {
                // 通过if判断是否存在，防止控制台报join方法错误
                item2.resour = permission.resource.join(',')
              }
              item2.actionName = permission.actions
              item2.con = permission.constraints
              this.permissionsData.push(item2)
            }
          }
        }
      },
      cancleCreateRole () {
        this.$router.push({path: '/org/setting/detail'})
      },
      getCopyedRoleDetail () {
        if (this.copyRoleName) {
          rbRoleService.roleDetail(this.copyRoleName).then((data) => {
            this.copyInfo.name = data.name
            this.copyInfo.parents = data.parents
            this.copyInfo.permissions = data.permissions
            this.copyRole()
          })
        }
      },
      addDomain () {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        })
      },
      removeDomain (item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      getRoleList () {
        rbRoleService.roleList({}).then((data) => {
          let count = data.count
          rbRoleService.roleList({page_size: count}).then((data) => {
            this.roleList = data.results
          })
        })
      },
      loadParentRoleDetailPermission (parentRoleName) {
        if (parentRoleName) {
          this.parentPermissionView = true
          rbRoleService.roleDetail(parentRoleName).then((data) => {
            this.parentRoleName = parentRoleName
            this.parentRoleDetail = data.permissions
          })
        } else {
          this.$message({
            type: 'warn',
            message: '请先选择一个角色!'
          })
        }
      },
      // 添加权限区域begin
      // 1.资源类型：获取所有资源类型，封装数据到资源类型列表resourceTypes
      getAllRoleSchemas () {
        this.conIsView = false
        this.showName = '添加权限'
        this.permissionVisible = true
        // 清空对话框内原有数据
        this.form.type = ''
        this.form.resourceName = ''
        this.form.actions = []
        this.constraintForm = {
          groups: []
        }
        // 获取资源类型
        this.resourceTypes = []
        rbRoleService.getAllRoleSchemas().then((data) => {
          for (let item of data) {
            let resource = {label: item.resource}
            this.resourceTypes.push(resource)
          }
        })
      },
      // 2.操作allActions：根据类别所选资源类型，获取该资源的操作操作列表和约束条件列表（调用获取某个资源信息的url）
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
      addPermissions (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            /* 将添加表单的选择的数据封装到权限表单的数据中预览的数据中 */
            // 1.循环遍历约束条件列表：自定义约束名
            let conItem = ''
            if (cookieService.getCookie('project')) {
              this.projectName = cookieService.getCookie('project')
            }
            // a.如果项目名存在，但是未添加项目，则默认给其约束条件添加一条项目约束
            if (this.projectName) {
              let projectObject = {
                constraintSelect: 'project',
                constraintName: this.projectName
              }
              this.constraintForm.groups.push(projectObject)
              conItem = 'res:' + 'project' + ':' + this.projectName
            }
            let constraintList = this.constraintForm.groups
            // b.如果项目名存在，且添加项目，则过滤掉项目名，只使用传进来的项目名
            let item = {
              resour: [],
              actionName: this.form.actions,
              con: []
            }
            let item2 = {
              resour: '',
              actionName: this.form.actions,
              con: []
            }
            for (let i = 0; i < constraintList.length; i++) {
              let conselect = this.constraintForm.groups[i].constraintSelect
              let consName = this.constraintForm.groups[i].constraintName
              // 如果项目名不为空，则所有project的值（constraintName）只能为projectName
              if (this.projectName) {
                if (conselect === 'project') {
                  consName = this.projectName
                }
              }
              if (consName) {
                conItem = 'res:' + conselect + ':' + consName
                if (this.conIsView === true || (this.projectName !== undefined && this.projectName !== '')) {
                  item.con.push(conItem)
                }
                item2.con.push(conItem)
              } else {
                conItem = 'res:' + conselect
                if (this.conIsView === true || (this.projectName !== undefined && this.projectName !== '')) {
                  item.con.push(conItem)
                }
                item2.con.push(conItem)
              }
            }
            if (this.form.resourceName) {
              // 将表单的字符串形式的资源名根据逗号分隔成数组，并传给item，加入到创建页面权限tableData显示列中
              item.resour = this.form.resourceName.split(',')
              item2.resour = this.form.resourceName
            } else {
              // 如果资源为空，则默认所有资源'*'
              item.resour = ['*']
              item2.resour = '*'
            }
            // 4.引入一个变量,方便给创建角色遍历权限的数据permissionsData
            if (this.showName === '添加权限') {
              this.tableData.push(item)
              this.permissionsData.push(item2)
              this.permissionVisible = false
            } else if (this.showName === '修改权限') {
              this.tableData.splice(this.updateIndex, 1, item)
              this.permissionsData[this.updateIndex] = item2
              this.permissionVisible = false
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      openConDataView () {
        this.conIsView = true
      },
      closeView () {
        this.conIsView = false
      },
      updatePermissions (index, row) {
        // 获取该更新数据到对话框中
        this.form.type = row.actionName[0].split(':')[0]
        // this.form.resourceName是字符串格式，row.resour是数组格式，需要转化成字符串
        this.form.resourceName = ''
        if (row.resour.length > 0) {
          // join方法将数组转化为dialog对话框要的字符串
          this.form.resourceName = row.resour.join(',')
        }
        this.form.actions = row.actionName
        this.constraintForm = {
          groups: []
        }
        // 同步约束条件数据,if判断为防止控制台报item.split方法错误
        if (row.con.length > 0) {
          for (let item of row.con) {
            let body = {
              constraintSelect: item.split(':')[1],
              constraintName: item.split(':')[2]
            }
            this.constraintForm.groups.push(body)
          }
        }
        this.updateIndex = index
        this.showName = '修改权限'
        this.permissionVisible = true
        // this.$forceUpdate()
      },
      deleteGroup (item) {
        var index = this.constraintForm.groups.indexOf(item)
        if (index !== -1) {
          this.constraintForm.groups.splice(index, 1)
        }
      },
      addGroup () {
        this.constraintForm.groups.push({
          value: '',
          key: Date.now()
        })
      },
      // 添加权限区域end
      deleteRow (index, rows) {
        rows.splice(index, 1)
      },
      clearSelectAction () {
        if (this.form.actions.length > 0) {
          if (this.form.type !== this.form.actions[0].split(':')[0]) {
            this.form.actions = []
          }
        }
      }
    },
    watch: {
      'form.type': function (val, oldval) {
        this.getConstraints()
        this.getOneResourceActions()
        this.clearSelectAction()
      }
    }
  }
</script>
<style lang="scss" scoped>
@import './create-role.scss';
</style>
