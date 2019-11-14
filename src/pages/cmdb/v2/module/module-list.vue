<template>
  <div class="component-container yw-dashboard" style=" height: 100%">
    <div v-if="showList">
      <el-form class="yw-form">
        <div class="table-operate-wrap clearfix">
          <el-button type="text" @click="addModule">
            <i class="el-icon-plus"></i>
            添加
          </el-button>
        </div>
        <div class="yw-el-table-wrap">
          <el-table ref="singleTable"
                    :data="tableData"
                    border
                    class="yw-el-table"
                    row-key="id"
                    @selection-change="handleSelectionChange"
                    highlight-current-row
                    @current-change="handleCurrentChange">
            <el-table-column  prop="name" label="模型名称" width="180"></el-table-column>
            <el-table-column prop="code" label="模型编码" width="180">
            </el-table-column>
            <el-table-column prop="iconUrl" label="模型图标">
              <template slot-scope="scope">
                <img width="30" height="30" :src="scope.row.iconUrl" class="image"/>
              </template>
            </el-table-column>
            <el-table-column prop="disabled" label="是否禁用">
              <template slot-scope="scope">
                {{scope.row.disabled === 'true' ? '是' : '否'}}
              </template>
            </el-table-column>
            <el-table-column prop="module.builtin" label="是否内置">
              <template slot-scope="scope">
                {{scope.row.builtin === 'true' ? '是' : '否'}}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope" v-if="!scope.row.children">
                <el-button @click="editModule(scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
                <el-button @click="copyModule(scope.row)" type="text" icon="el-icon-document-copy">复制</el-button>
                <el-button @click="deleteModule(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>

      <div>

      </div>
    </div>
    <add-module v-if="showAdd" @setShow="setShow" :moduleId="moduleId" :parentId="parentId" :state="state"></add-module>
    </div>
</template>

<script>
  import rbCmdbModuleServiceFactory from '../../../../services/cmdb/rb-cmdb-module-service.factory'
  import rbCmdbServiceFactory from '../../../../services/cmdb/rb-cmdb-service.factory'

  import AddModule from './components/add-module'
  export default {
    name: 'module-list',
    components: {AddModule},
    data () {
      return {
        moduleData: [],
        showList: true,
        showAdd: false,
        openRow: ['e05ca831eeda43f4b41835442bd77c55'],
        tableData: [],
        moduleId: '',
        parentId: '',
        state: '',
        loading: function () {}
      }
    },
    mounted () {
      this.getModule()
    },
    methods: {
      expandAll () {
      },
      showFullScreenLoading (state) {
        this.loading = this.$loading({
          lock: true,
          text: state === 'delete' ? '正在删除数据...' : '正在拼命加载数据...',
          spinner: 'el-icon-loading'
        })
      },
      setShow (val) {
        this.showAdd = val
        this.showList = !this.showAdd
        if (this.showList) {
          this.getModule()
        }
      },
      handleSelectionChange (val) {
      },
      handleCurrentChange (val) {
//        if (val && !val.children) {
//          this.$refs.singleTable.setCurrentRow()
//        }
//        if (val && val.children) {
//          this.parentId = val.id
//        }
      },
      formatData (data) {
        if (data.children !== null && data.children) {
          data.children.forEach(item => {
            let tmp = JSON.parse(JSON.stringify(item))
            item = tmp.module
            item['groupList'] = tmp.groupList
          })
        }
      },
      getModule () {
        this.showFullScreenLoading()
        this.tableData = []
        rbCmdbModuleServiceFactory.getModuleTree().then((data) => {
          this.moduleData = data
          data.forEach((item, index) => {
            item.children = item.childModules
            this.tableData.push(item)
          })
          this.tableData.forEach(item => {
            item.children.forEach((x, index) => {
//              let groupList = x.groupList
              item.children[index] = x
//              item.children[index]['groupList'] = groupList
            })
          })
          this.loading.close()
        }).catch(() => {
          this.loading.close()
          this.$notify({
            title: '提示',
            message: '查询模型信息失败',
            type: 'error',
            duration: 3000
          })
        })
      },
      addModule () {
        this.state = 'add'
        this.showAdd = true
        this.showList = false
      },
      editModule (row) {
        this.parentId = row.parentId
        this.moduleId = row.id
        this.state = 'edit'
        this.showAdd = true
        this.showList = false
      },
      copyModule (row) {
        this.parentId = row.parentId
        this.moduleId = row.id
        this.state = 'copy'
        this.showAdd = true
        this.showList = false
      },
      deleteModule (row) {
        this.$confirm('确认删除' + row.name + '？').then(() => {
          var query_data = {
            'pageNumber': 1,
            'pageSize': 10,
            'moduleId': row.id,
            'queryType': 'normal'
          }
          rbCmdbServiceFactory.getInstanceList(query_data).then((data) => {
            if (data.totalSize > 0) {
              this.$notify({
                title: '提示',
                message: '模型下尚存在实例，不能删除当前模型',
                type: 'warning',
                duration: 3000
              })
            } else {
              this.showFullScreenLoading()
              rbCmdbModuleServiceFactory.deleteModule(row.id).then((data) => {
                if (data.success) {
                  this.$notify({
                    title: '提示',
                    message: '删除成功',
                    type: 'success',
                    duration: 3000
                  })
                  this.getModule()
                } else {
                  this.$notify({
                    title: '提示',
                    message: '删除失败',
                    type: 'error',
                    duration: 3000
                  })
                }
              }).catch((e) => {
                this.$notify({
                  title: '提示',
                  message: '删除失败',
                  type: 'error',
                  duration: 3000
                })
              })
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image {
    width: 24px;
    height: 24px;
    background-color: gray;
  }
  /*.module-table {*/
    /*width: 100%;*/
    /*min-height:calc(100vh - 196px);*/
    /*margin-bottom: 20px;*/
    /*/deep/.el-table td{*/
      /*padding: 5px 0;*/
    /*}*/
    /*/deep/ .el-table__body-wrapper{*/
      /*height: calc(100vh - 196px - 48px);*/
      /*overflow-y: auto;*/
    /*}*/
  /*}*/
</style>
