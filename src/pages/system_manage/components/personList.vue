<template>
  <div class="yw-el-table-wrap">
    <el-table class="yw-el-table"
              :data="personList"
              stripe
              tooltip-effect="dark"
              border
              height="420px">
      <el-table-column prop="code"
                       label="用户名称">
      </el-table-column>
      <el-table-column prop="name"
                       label="真实姓名">
      </el-table-column>
      <el-table-column prop="dept_id"
                       show-overflow-tooltip
                       label="部门">
      </el-table-column>
      <el-table-column prop="sex"
                       label="性别">
      </el-table-column>
      <el-table-column prop="user_type"
                       label="用户类型">
      </el-table-column>
      <el-table-column prop="mobile"
                       label="手机号"
                       width="100">
      </el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="mail"
                       label="邮箱">
      </el-table-column>
      <el-table-column prop="no"
                       label="工号">
      </el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="phone"
                       label="办公电话">
      </el-table-column>
      <el-table-column label="操作"
                       width="80">
        <template slot-scope="scope">
          <div class="yw-table-operator">
            <el-button type="text"
                       icon="el-icon-tickets"
                       @click="handleDetail(scope.row)">
            </el-button>
            <el-button type="text"
                       icon="el-icon-delete"
                       @click="handleDelete(scope.row)">
            </el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <div class="yw-page-wrap">
      <el-pagination class="person-manage__pager"
                     @size-change="handleSizeChange"
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
import personDataService from 'src/services/sys/person-services.js'

export default {
  data () {
    return {
      personList: [],
      currentPage: 1,
      total: 1,
      pagesize: 10
    }
  },
  props: {
    dictionary: {
      type: Object,
      default: null
    },
    searchText: {
      type: String,
      default: ''
    },
    selectedDepartmentId: {
      type: String,
      default: ''
    }
  },
  watch: {
    dictionary (val) {
      // console.log('watch dictionary', val)
      this.refreshTableDictionary(val)
    },
    searchText (newValue) {
      this.searchData()
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      // console.log(this.pagesize)
      let deptid = this.selectedDepartmentId
      this.getPersonList(deptid, val)
    },
    handleCurrentChange (val) {
      // console.log(this.pagesize)
      let deptid = this.selectedDepartmentId
      if (this.searchText) {
        this.getPersonList(deptid, this.pagesize, val, this.searchText)
      } else {
        this.getPersonList(deptid, this.pagesize, val)
      }
    },
    handleDetail (data) {
      this.$emit('detial-click', data.uuid)
    },
    handleDelete (data) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        personDataService.deletePerson(data.uuid).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getPersonList()
        }).catch((res) => {
          var message
          if (res.data.errors[0].code === 'User does\'nt have the permission') {
            message = res.data.errors[0].message
          }
          this.$message({
            message: message ? message.toString() : '操作失败',
            type: 'error'
          })
        })
      })
    },
    // 搜索过滤
    // searchFilter (data) {
    //   return !this.searchText || data.code.toLowerCase().includes(this.searchText.toLowerCase())
    // },
    refreshTableDictionary (dictionary) {
      if (dictionary && Object.keys(dictionary).length > 0) {
        if (this.personList && this.personList.length > 0) {
          this.personList.map((item) => {
            item.sex = dictionary.sexal[item.sex]
            item.user_type = dictionary.userType[item.user_type]
            // item.dept_id = dictionary.department[item.dept_id]
          })
        }
      }
    },
    searchData () {
      let deptid = this.selectedDepartmentId
      // alert("s")
      this.currentPage = 1
      this.getPersonList(deptid, this.pagesize, this.currentPage, this.searchText)
    },
    getPersonList (id, page, val, search) {
      // console.log(id, page, val, code)
      personDataService.getPersonList(id, page, val, search).then((res) => {
        if (res) {
          this.currentPage = res.curPage
          this.total = res.count
          this.personList = res.result
          if (this.dictionary) {
            this.refreshTableDictionary(this.dictionary)
          }
        }
      })
    }
  },
  mounted () {

  }
}
</script>
<style lang="scss" scoped>
.el-table th {
  color: #333333;
}
.person-manage__ex-table {
  margin-top: 14px;
  padding: 12px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  height: 480px;
}

.person-manage__table {
  .el-table__body-wrapper {
    height: 450px;
    overflow: auto;
    .el-table__body tr > td {
      padding: 4px 0;
    }
  }
}

.person-manage__pager {
  text-align: right;
  padding-top: 8px;
  // padding-bottom: 14px;
}
</style>
