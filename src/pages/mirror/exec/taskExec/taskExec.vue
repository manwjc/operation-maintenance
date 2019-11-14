<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="65px">
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
      <el-form-item label="任务状态">
        <el-select v-model="task_status"
                   placeholder="请选择"
                   clearable>
          <el-option v-for="item in task_state"
                     :key="item"
                     :label="item"
                     :value="item">
          </el-option>
        </el-select>
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
                  :default-sort="{prop: 'finish_time', order: 'descending'}">
          <el-table-column prop="task_name"
                           label="任务名称"
                           sortable>
          </el-table-column>
          <el-table-column prop="template_names"
                           label="巡检模板">
          </el-table-column>
          <el-table-column prop="create_time"
                           label="开始时间"
                           sortable>
          </el-table-column>
          <el-table-column prop="finish_time"
                           label="结束时间"
                           sortable>
          </el-table-column>
          <el-table-column prop="status"
                           label="任务状态"
                           sortable>
          </el-table-column>
          <el-table-column prop="result"
                           label="巡检结果">
          </el-table-column>
          <el-table-column prop="report"
                           label="巡检报告">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="reportDetails(scope.row)">巡检报告</el-button>
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
import { taskState } from '../config/options.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'

export default {
  data () {
    return {
      name: '',
      time_range: [],
      task_state: [],
      task_status: '',
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
    reset () {
      this.task_status = ''
      this.name = ''
      this.time_range = []
    },
    search (num) {
      if (num !== 1) {
        // 搜索前将当前页置为1
        this.currentPage = 1
      }
      let status1 = ''
      if (this.task_status !== '') {
        status1 = rbMirrorCommonService.getDaoTaskStatus(this.task_status)
      }
      let obj = {
        inspection_time_start: this.time_range ? formatDate(this.time_range[0]) : '',
        inspection_time_end: this.time_range ? formatDate(this.time_range[1]) : '',
        name: this.name,
        status: status1,
        page_no: this.currentPage,
        page_size: this.pageSize
      }
      rbProjectDataServiceFactory.getTaskReport(obj).then((res) => {
        this.tableData = this.packData(res.result)
        this.total = res.count
      })
    },
    reportDetails (obj) {
      this.$store.commit('reportDetail', obj.report_id)
      this.$router.push('/mirror/report/reportDetails')
    },
    // 封装数据
    packData (arr) {
      arr.forEach((item) => {
        item.status = rbMirrorCommonService.getTaskStatus(item.status)
        item.create_time = formatDate(item.create_time)
        item.finish_time = formatDate(item.finish_time)
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
    },
    selectData () {
      if (this.$store.state.homeStore.task_state) {
        let id = Object.assign(this.$store.state.homeStore.task_id, {})
        let obj = {
          task_id: id,
          page_no: this.currentPage,
          page_size: this.pageSize
        }
        rbProjectDataServiceFactory.getTaskReport(obj).then((res) => {
          this.tableData = this.packData(res.result)
          this.total = res.count
          this.$store.commit('taskState', false)
        })
      } else {
        this.tableData = this.getTableData()
      }
    }
  },
  mounted () {
    this.selectData()
    this.task_state = taskState
  }
}
</script>

<style lang="scss" scoped>
</style>
