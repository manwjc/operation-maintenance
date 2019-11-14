<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="85px">
      <el-form-item label="过滤器名称">
        <el-input v-model="filterName"
                  placeholder="请输入内容"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="场景名称">
        <el-input v-model="filterSceneName"
                  placeholder="请输入内容"
                  clearable></el-input>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="create()">新增场景</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <!-- <el-button class="btn-icons-wrap"
                   type="text"
                   icon="el-icon-setting"
                   @click="addLogBookConfig=true">值班设置</el-button> -->
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 245px)">
          <el-table-column type="index"
                           label="序号"
                           width="50">
          </el-table-column>
          <el-table-column prop="name"
                           label="场景名称">
          </el-table-column>
          <el-table-column prop="filter_name"
                           label="告警过滤器名称">
          </el-table-column>
          <el-table-column prop="creater"
                           label="创建人">
          </el-table-column>
          <el-table-column prop="editer"
                           label="最后修改人">
          </el-table-column>
          <el-table-column prop="updated_at"
                           label="最后修改时间">
          </el-table-column>
          <el-table-column prop="note"
                           label="备注">
          </el-table-column>
          <el-table-column prop="region"
                           label="操作">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           title="查看"
                           @click="detail(scope.row.id)"
                           icon="el-icon-tickets"></el-button>
                <el-button type="text"
                           title="编辑"
                           @click="openUpdate(scope.row.id)"
                           icon="el-icon-edit"
                           :disabled="checkUse(scope.row)"></el-button>
                <el-button type="text"
                           title="复制"
                           @click="copy(scope.row.id)"
                           icon="fa fa-clone">
                </el-button>
                <el-button type="text"
                           title="删除"
                           @click="deleteFilterScene(scope.row.id, scope.row.name)"
                           icon="el-icon-delete"
                           :disabled="checkUse(scope.row)"></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </el-form>
  </div>
</template>

<script>
import rbAlertFilterSceneServicesFactory from 'src/services/alert/rb-alertFilterScene-services.factory.js'
export default {
  name: '/mirror_alert/filter/scene/list',
  data () {
    return {
      detailFlag: false,
      editFlag: false,
      edit: false,
      form: {},
      filterName: '',
      filterSceneName: '',
      tableData: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [30, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据,
      rules: {
        name: [
          { required: true, message: '必填项' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符' },
          { pattern: /^[a-z][a-z0-9\\-]*[a-z0-9]$/, message: '格式错误' }
        ]
      }
    }
  },
  mounted () {
    let opt = this.$route.query.filterNameParam
    let filterId = this.$route.query.filterId
    if (opt) {
      this.filterName = opt
      this.searchByFilter(filterId)
    } else {
      this.search()
    }
  },
  methods: {
    checkUse (rowData) {
      let createUser = rowData.creater
      let operateUser = rowData.operate_user
      let userName = sessionStorage.getItem('username')
      let namespace = sessionStorage.getItem('namespace')
      if (userName === createUser || userName === namespace) {
        return false
      }
      if (operateUser !== null) {
        let userArray = operateUser.split(',')
        for (var i = 0; i < userArray.length; i++) {
          if (userArray[i] === userName) {
            return false
          }
        }
      }
      return true
    },
    openUpdate (id) {
      this.$router.push({ path: '/mirror_alert/filter/scene/add/', query: { sceneId: id } })
    },
    copy (id) {
      this.$router.push({ path: '/mirror_alert/filter/scene/add/', query: { sceneId: id, oper: 'copy' } })
    },
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.search()
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.search()
    },
    searchByFilter (filterId) {
      let page = {
        order: 'DESC',
        page_no: this.currentPage,
        page_size: this.pageSize,
        sort_name: 'updated_at',
        name: this.filterSceneName,
        filterName: this.filterName,
        filterId: filterId
      }

      rbAlertFilterSceneServicesFactory.getList(page).then((res) => {
        this.tableData = res.result
        this.total = res.count
      }).catch(() => {
        this.$message.error('查询失败')
      })
    },
    search () {
      let page = {
        order: 'DESC',
        page_no: this.currentPage,
        page_size: this.pageSize,
        sort_name: 'updated_at',
        name: this.filterSceneName,
        filterName: this.filterName
      }

      rbAlertFilterSceneServicesFactory.getList(page).then((res) => {
        this.tableData = res.result
        this.total = res.count
      }).catch(() => {
        this.$message.error('查询失败')
      })
    },
    deleteFilterScene (id, name) {
      this.$confirm('删除场景 ' + name + '?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rbAlertFilterSceneServicesFactory.delete(id).then((res) => {
          this.$message.success('删除成功')
          this.search()
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    },
    detail (id) {
      this.$router.push({ path: '/mirror_alert/filter/scene/add/', query: { sceneId: id, detail: 'detail' } })
    },
    create () {
      this.$router.push({ path: '/mirror_alert/filter/scene/add/' })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .components-condition {
  padding-right: 168px;
}
</style>
