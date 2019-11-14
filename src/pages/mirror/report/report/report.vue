<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="70px">
      <el-form-item label="任务名称">
        <el-input v-model="name"
                  placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="time_range"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="reset()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <!-- <el-button type="text"
                   icon="el-icon-plus"
                   @click="create">新增</el-button>
        <el-button type="text"
                   icon="el-icon-delete"
                   @click="deleteFilterBatch">清除</el-button> -->
      </div>
      <div class="yw-el-table-wrap">

        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 275px)"
                  @selection-change="handleSelectionChange"
                  :default-sort="{prop: 'create_time', order: 'descending'}">
          <el-table-column prop="task_name"
                           label="报表名称"
                           sortable>
          </el-table-column>
          <el-table-column prop="task_type"
                           label="报表类型">
          </el-table-column>
          <el-table-column prop="create_time"
                           label="巡检时间"
                           sortable>
          </el-table-column>
          <el-table-column prop="result"
                           label="巡检结果">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="observes(scope.row)">查看</el-button>
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

    <!-- dialog -->
    <!-- dialog -->
  </div>
</template>

<script>
// import rbHttp from '../../../../assets/js/utility/rb-http.factory.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'
export default {
  data () {
    return {
      name: '',
      time_range: [],
      // 多选框模板存放的值
      multipleSelection: [],
      tableData: [],
      // 当前页
      currentPage: 1,
      // 分页每页多少行数据
      pageSize: 5,
      // 每页多少行数组
      pageSizes: [5, 10, 20],
      // 总共多少行数据
      total: 0
    }
  },
  methods: {
    // 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.search(1)
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.search(1)
    },
    // 业务逻辑
    search (num) {
      if (num !== 1) {
        // 搜索前将当前页置为1
        this.currentPage = 1
      }
      let obj = {
        inspection_time_start: this.time_range ? formatDate(this.time_range[0]) : '',
        inspection_time_end: this.time_range ? formatDate(this.time_range[1]) : '',
        name: this.name,
        page_no: this.currentPage,
        page_size: this.pageSize
      }
      rbProjectDataServiceFactory.getTaskReport(obj).then((res) => {
        this.tableData = this.packData(res.result)
        this.total = res.count
      })
    },
    reset () {
      this.name = ''
      this.time_range = []
    },
    observes (obj) {
      this.$store.commit('reportDetail', obj.report_id)
      this.$router.push('reportDetails')
    },
    // 封装数据
    packData (arr) {
      arr.forEach((item) => {
        item.create_time = formatDate(item.create_time)
        item.task_type = rbMirrorCommonService.getTaskType(item.task_type)
      })
      return arr
    },
    // 数据来源
    getTableData () {
      let obj = {
        page_no: this.currentPage,
        page_size: this.pageSize
      }
      rbProjectDataServiceFactory.getTaskReport(obj).then((res) => {
        this.tableData = this.packData(res.result)
        this.total = res.count
      })
    }
  },
  mounted () {
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
</style>
