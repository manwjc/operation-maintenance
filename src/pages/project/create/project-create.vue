<template>
  <div class="component-container" style="height: auto">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="form.name" placeholder="字母开头，字母/数字/中横线， 最多36个字符" size="small"></el-input>
      </el-form-item>

      <hr style="border:1px dashed  #dcdcdc">

      <el-form-item label="项目模板" prop="template">
        <el-select style="width: 250px;" v-model="form.template" placeholder="请选择模板" @change="changeProjectTemplates" size="small">
          <el-option v-for="item in projectTemplates" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="命名空间">
        <el-table :data="knamespaces" stripe @selection-change="knamespacesSelectionChange" style="border: 1px solid #F4F4F4">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="parent_name" label="集群" width="180"></el-table-column>
          <el-table-column prop="name" label="命名空间"></el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="镜像项目">
        <el-table :data="registry_projects" stripe @selection-change="registryProjectsSelectionChange" style="border: 1px solid #F4F4F4">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="parent_name" label="镜像中心" width="180"></el-table-column>
          <el-table-column prop="name" label="镜像项目"></el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="角色">
        <el-table :data="roles" stripe @selection-change="rolesSelectionChange" style="border: 1px solid #F4F4F4">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="名称" >
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
              <i class="el-icon-view" style="margin-left: 90%;cursor: pointer" @click="openRolePermissionsPanelDialog(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm('form')">创建</el-button>
        <el-button type="primary" size="small" @click="submitFormForTemplate('form')">另存为模板</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="角色" :visible.sync="viewRolePermissionsPanelDialogVisible" width="50%" top="5vh">
      <table>
        <tr>
          <td style="padding: 0px 0px 13px 40px;">角色</td>
          <td style="padding: 0px 0px 13px 40px;">{{roleDetailName}}</td>
        </tr>
        <tr>
          <td style="padding: 13px 0px 0px 40px;vertical-align: top;">权限</td>
          <td style="padding-left: 40px">
            <el-table :data="roleDetailPermissions" border>
              <el-table-column label="资源" width="50">
                <template slot-scope="scope">
                  <div v-html="scope.row.resource"></div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <div v-html="scope.row.actions"></div>
                </template>
              </el-table-column>
              <el-table-column label="约束条件" width="250">
                <template slot-scope="scope">
                  <div v-html="scope.row.constraints"></div>
                </template>
              </el-table-column>
            </el-table>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewRolePermissionsPanelDialogVisible = false">好</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import rbAccountService from 'src/services/rb-account-service.factory.js'
  import rbProjectDataService from 'src/services/rb-project-data-service.factory.js'
  import cookieService from 'src/services/cookie.service.js'
  export default {
    data () {
      return {
        form: {
          name: '',
          template: '',
          roles: [],
          resources: [],
          namespace: rbAccountService.getCurrentNamespace()
        },
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            { min: 3, max: 36, message: '长度在 3 到 36 个字符', trigger: 'blur' }
          ],
          template: [
            { required: true, message: '请选择模板', trigger: 'blur' }
          ]
        },
        projectTemplatesData: [],
        projectTemplates: [],
        knamespaces: [],
        registry_projects: [],
        roles: [],
        selected_knamespaces: [],
        selected_registry_projects: [],
        viewRolePermissionsPanelDialogVisible: false,
        roleDetailName: '',
        roleDetailPermissions: []
      }
    },
    mounted: function () {
      this.getProjectTemplates()
      this.getProjectResources()
    },
    methods: {
      getProjectTemplates () {
        rbProjectDataService.getProjectTemplates().then((data) => {
          this.projectTemplatesData = data
          data.forEach(item => {
            this.projectTemplates.push({
              value: item.name,
              label: item.name
            })
          })
          this.form.template = this.projectTemplates[0].value
          this.changeProjectTemplates(this.form.template)
        })
      },
      changeProjectTemplates (value) {
        this.projectTemplatesData.forEach(item => {
          if (value === item.name) {
            this.roles = []
            item.roles.forEach(item => {
              this.roles.push({
                name: item.name,
                id: item.id,
                permissions: item.permissions
              })
            })
          }
        })
      },
      getProjectResources () {
        rbProjectDataService.getProjectResources().then((data) => {
          data.knamespaces.forEach(item => {
            this.knamespaces.push({
              parent_name: item.parent_name,
              name: item.name,
              type: item.type
            })
          })
          data.registry_projects.forEach(item => {
            this.registry_projects.push({
              parent_name: item.parent_name,
              name: item.name,
              type: item.type
            })
          })
        })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const selectedResources = []
            this.selected_knamespaces.forEach(item => {
              selectedResources.push(item)
            })
            this.selected_registry_projects.forEach(item => {
              selectedResources.push(item)
            })
            const data = {
              template: this.form.template,
              name: this.form.name,
              roles: this.form.roles,
              resources: selectedResources,
              namespace: this.form.namespace
            }
            rbProjectDataService.createProject(data).then((data) => {
              this.$message({
                type: 'success',
                message: '创建成功'
              })
              cookieService.setCookie('project', this.form.name)
              this.$router.push({path: '/project/detail', query: {project_name: this.form.name}})
            }, (data) => {
              this.$message({
                type: 'error',
                message: data.response.data.errors
              })
            })
          } else {
            return false
          }
        })
      },
      submitFormForTemplate (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const selectedResources = []
            this.selected_knamespaces.forEach(item => {
              selectedResources.push(item)
            })
            this.selected_registry_projects.forEach(item => {
              selectedResources.push(item)
            })
            const data = {
              template: this.form.template,
              name: this.form.name,
              roles: this.form.roles,
              resources: selectedResources,
              namespace: this.form.namespace
            }
            rbProjectDataService.saveAsTemplate(data, {project_name: this.$route.query.project_name}).then((data) => {
              this.$message({
                type: 'success',
                message: '另存为模板成功'
              })
            })
          } else {
            return false
          }
        })
      },
      cancel () {
        history.go(-1)
      },
      knamespacesSelectionChange (val) {
        this.selected_knamespaces = val
      },
      registryProjectsSelectionChange (val) {
        this.selected_registry_projects = val
      },
      rolesSelectionChange (val) {
        this.form.roles = []
        val.forEach(item => {
          this.form.roles.push({
            id: item.id
          })
        })
      },
      openRolePermissionsPanelDialog (role) {
        this.viewRolePermissionsPanelDialogVisible = true
        this.roleDetail = role
        this.roleDetailName = role.name
        if (role.permissions && role.permissions.length) {
          role.permissions.forEach(permission => {
            let resource = ''
            let actions = ''
            let constraints = ''
            if (permission.resource && permission.resource.length) {
              for (let key in permission.resource) {
                resource += permission.resource[key] + '<br>'
              }
            }
            if (permission.actions && permission.actions.length) {
              for (let key in permission.actions) {
                actions += permission.actions[key] + '<br>'
              }
            }
            if (permission.constraints && permission.constraints.length) {
              permission.constraints.forEach(item => {
                for (let key in item) {
                  constraints += key + ':' + item[key] + '<br>'
                }
              })
            }
            this.roleDetailPermissions.push({
              resource: resource,
              actions: actions,
              constraints: constraints
            })
          })
        }
      }
    }
  }
</script>
<style scoped>
</style>
