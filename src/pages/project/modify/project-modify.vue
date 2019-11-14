<template>
  <div class="component-container" style="height: auto">
    <el-form :model="form" ref="form" :label-width="'120px'">
      <el-form-item label="项目名称">
        <span>{{project_name}}</span>
      </el-form-item>

      <hr style="border:1px dashed  #dcdcdc">

      <el-form-item label="命名空间">
        <el-table ref="knamespacesTable" :data="knamespaces" stripe @selection-change="knamespacesSelectionChange" style="border: 1px solid #F4F4F4">
          <el-table-column type="selection" width="55" :selectable="unChecked"></el-table-column>
          <el-table-column prop="parent_name" label="集群" width="180"></el-table-column>
          <el-table-column prop="name" label="命名空间"></el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="镜像项目">
        <el-table ref="registryProjectsTable" :data="registry_projects" stripe  @selection-change="registryProjectsSelectionChange" style="border: 1px solid #F4F4F4">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="parent_name" label="镜像中心" width="180"></el-table-column>
          <el-table-column prop="name" label="镜像项目"></el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" @click="submitForm('form')">更新</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
  import rbAccountService from 'src/services/rb-account-service.factory.js'
  import rbProjectDataService from 'src/services/rb-project-data-service.factory.js'
  export default {
    data () {
      return {
        projectKnamespaceList: [],
        form: {},
        project_name: this.$route.query.project_name,
        namespace: rbAccountService.getCurrentNamespace(),
        knamespaces: [],
        registry_projects: [],
        selected_knamespaces: [],
        selected_registry_projects: []
      }
    },
    mounted: function () {
      this.getProjectResources()
    },
    methods: {
      unChecked (row, index) {
        let isContain = this.containName(row.name)
        if (isContain) {
          return false
        } else {
          return true
        }
      },
      containName (name) {
        let flag = false
        for (let item of this.projectKnamespaceList) {
          if (Object.is(item, name)) {
            flag = true
          }
        }
        return flag
      },
      getProjectDetailStatus () {
        rbProjectDataService.getProjectDetailStatus({project_name: this.project_name}).then((data) => {
          data.resources.forEach(row => {
            this.knamespaces.forEach(item => {
              if (row.type === item.type && row.parent_name === item.parent_name && row.name === item.name) {
                this.$refs.knamespacesTable.toggleRowSelection(item, false)
              }
            })
            this.registry_projects.forEach(item => {
              if (row.type === item.type && row.parent_name === item.parent_name && row.name === item.name) {
                this.$refs.registryProjectsTable.toggleRowSelection(item, true)
              }
            })
          })
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
          // 如果项目中存在项目名称，需要将项目中私有的命名空间名称添加的到this.knamespaces
          if (this.project_name) {
            rbProjectDataService.getProjectDetailStatus({project_name: this.project_name}).then((data) => {
              data.resources.forEach(item => {
                this.knamespaces.push({
                  parent_name: item.parent_name,
                  name: item.name,
                  type: item.type
                })
                this.projectKnamespaceList.push(item.name)
              })
            })
          }
          data.registry_projects.forEach(item => {
            this.registry_projects.push({
              parent_name: item.parent_name,
              name: item.name,
              type: item.type
            })
          })
          this.getProjectDetailStatus()
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
              project_name: this.project_name,
              resources: selectedResources,
              namespace: this.namespace
            }
            rbProjectDataService.modifyProject(data).then((data) => {
              this.$message({
                type: 'success',
                message: '更新成功'
              })
              this.$router.push({path: '/project/detail', query: {project_name: this.project_name}})
            }, (data) => {
              this.$message({
                type: 'success',
                message: data.response.data.errors
              })
            })
          } else {
            return false
          }
        })
      },
      cancel () {
        this.$router.push({path: '/project/detail', query: {project_name: this.project_name}})
      },
      knamespacesSelectionChange (val) {
        this.selected_knamespaces = val
      },
      registryProjectsSelectionChange (val) {
        this.selected_registry_projects = val
      }
    }
  }
</script>
<style scoped>
  .el-table .odd-row {
    background: #F1F1F1;
  }
  .el-table .even-row {
    background: #ffffff;
  }
</style>
