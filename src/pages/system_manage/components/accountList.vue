<template>
  <div class="yw-el-table">
    <el-table :data="accountList"
              class="yw-el-table"
              stripe
              tooltip-effect="dark"
              border
              height="calc(100vh - 220px)">
      <el-table-column prop="account"
                       label="账号"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name"
                       label="用户名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="status"
                       :formatter="formStatus"
                       label="状态">
      </el-table-column>
      <el-table-column prop="role"
                       label="功能角色">
      </el-table-column>
      <el-table-column prop="desc"
                       label="描述"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作"
                       width="120">
        <template slot-scope="scope">
          <div class="yw-table-operator">
            <el-button @click="handleDetail(scope.row)"
                       title="查看"
                       type="text"><i class="el-icon-tickets"></i></el-button>
            <el-button @click="handleUpdate(scope.row)"
                       title="切换"
                       type="text"><i :class="[ scope.row.status === 1 ? 'el-icon-check' : 'el-icon-close']"></i></el-button>
            <el-button @click="handleDelete(scope.row)"
                       title="删除"
                       type="text"><i class="el-icon-delete"></i></el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <div class="yw-page-wrap">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-size="pagesize"
                     :page-sizes="[5, 10, 50]"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import systemAccountService from 'src/services/sys/account-services.js'

export default {
  data () {
    return {
      currentPage: 1,
      total: 5,
      pagesize: 10,
      accountList: []
    }
  },
  props: {
    searchText: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.getAccountList(val)
    },
    handleCurrentChange (val) {
      // console.log(this.pagesize)
      if (this.searchText) {
        this.getAccountList(this.pagesize, val, this.searchText)
      } else {
        this.getAccountList(this.pagesize, val)
      }
    },
    // 获取账户列表
    getAccountList (pageSize, pageNo, searchData) {
      this.accountList = []
      systemAccountService.getAccountList(pageSize, pageNo, searchData, undefined).then((res) => {
        if (res) {
          res.results.map((item) => {
            if (item.userInfo) {
              let roleName = []
              if (item.roles) {
                item.roles.forEach(function (subitem) {
                  if (subitem['role_type'] === 0) {
                    roleName.push(subitem.name)
                  }
                })
              }
              this.accountList.push({
                account: item.username,
                name: item.userInfo.name,
                status: item.userInfo.ldap_status,
                role: roleName.join(','),
                desc: item.description
              })
            }
          })
          this.total = res.count
        }
      })
    },
    // 状态转换为文字
    formStatus (row, column) {
      return row.status === 1 ? '启用' : '禁用'
    },
    // 账户详情
    handleDetail (row) {
      this.$emit('detail-click', row.account)
    },
    // 是否启用账户
    handleUpdate (row) {
      this.$confirm('此操作将切换用户状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const status = Boolean(row.status)
        systemAccountService.toggleType(row.account, !status).then((res) => {
          if (row.status === 1) {
            row.status = 0
          } else {
            row.status = 1
          }
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败！'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    // 删除方法
    handleDelete (row) {
      this.$emit('delete-click', row.account)
    },
    // 查询方法
    searchData () {
      // alert("s")
      this.currentPage = 1
      this.getAccountList(this.pagesize, this.currentPage, this.searchText)
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
</style>
