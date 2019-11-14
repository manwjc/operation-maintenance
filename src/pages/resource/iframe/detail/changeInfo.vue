<template>
  <div v-loading="loading">
    <el-form class="yw-form" >
      <el-form class="components-condition yw-form"
               :inline="true"
               label-width="100px"
               v-model="queryForm">
        <el-form-item label="工单类型">
          <el-select v-model="queryForm.procDefKey"
                     clearable>
            <el-option v-for="(item, index) in procTypeList"
                       :key="index"
                       :label="item.flow_name"
                       :value="item.flow_key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程开始时间">
          <el-date-picker
            v-model="queryForm.startTime"
            type="datetime"
            :picker-options="startDatePicker()"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="流程结束时间">
          <el-date-picker
            v-model="queryForm.endTime"
            type="datetime"
            :picker-options="endDatePicker()"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59">
          </el-date-picker>
        </el-form-item>
        <section class="btn-wrap">
          <el-button type="primary"
                     @click="getChangeData()">查询</el-button>
          <el-button @click="resetQueryForm()">重置</el-button>
        </section>
      </el-form>
      <!--数据表单开始-->
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 280px)">
          <el-table-column
            label="工单编号"
            prop="instId">
            <template slot-scope="scope">
              <el-button type="text" @click="toBpmTask(scope.row.instId)">{{scope.row.instId}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="工单类型"
            prop="procDefName">
          </el-table-column>
          <el-table-column
            label="流程开始时间"
            prop="createTime">
          </el-table-column>
          <el-table-column
            label="流程结束时间"
            prop="endTime">
          </el-table-column>
        </el-table>
      </div>
      <!--数据表单结束-->
      <div class="yw-page-wrap">
        <YwPagination @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="pageSizes"
                      :page-size="pageSize"
                      :total="total"></YwPagination>
      </div>
    </el-form>
  </div>

</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  export default {
    name: 'changeInfo',
    components: {
      YwPagination: () => import('src/components/common/yw-pagination.vue')
    },
    data () {
      return {
        tableData: [],  //工单详情数据
        procTypeList: [], //所有工单类型
        queryForm: {},
        currentPage: 1, // 当前页
        pageSize: 50, // 分页每页多少行数据
        pageSizes: [10, 20, 50, 100], // 每页多少行数组
        total: 0, // 总共多少行数据
        instanceId: this.$route.query.instanceId,
        loading: false,
      }
    },
    mounted () {
      this.getChangeData()
    },
    methods: {
      startDatePicker () {
        const self = this
        return {
          disabledDate (time) {
            if (self.queryForm.startTime) {  //如果结束时间不为空，则小于结束时间
              return new Date(self.queryForm.endTime).getTime() < time.getTime()
            }
          }
        }
      },
      endDatePicker () {
        const self = this
        return {
          disabledDate (time) {
            if (self.queryForm.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(self.queryForm.startTime).getTime() > time.getTime()
            }
          }
        }
      },
      resetQueryForm () {
        this.queryForm = {}
      },
      // 打开工单详情窗口
      toBpmTask(id) {
        const url = `${sessionStorage.getItem('X7_SERVER_URL')}/front/inst/${id}?mirrorToken=${sessionStorage.getItem('mirror')}`
//        let url =sessionStorage.getItem('BPMX_SERVER_URL');
//        url = url.replace('BPMX_SERVER_URL', sessionStorage.getItem('BPMX_SERVER_URL'))
//        url = url.replace('home', 'inst')
        // window.open(url + '/' + id + '?mirrorToken=' + sessionStorage.getItem('mirror'), "_blank", "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes,top=" + top + ",left="+ left +", width=" + width +",height=" + height);
        window.open(url, "_blank");
      },
      // 分页改变尺寸
      handleSizeChange (val) {
        this.pageSize = val
        this.getChangeData()
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.getChangeData()
      },
      //获取变更信息数据
      getChangeData () {
        this.loading = true
        let data = {
          deviceId: this.instanceId,
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          procDefKey: this.queryForm.procDefKey,
          startTime: this.queryForm.startTime,
          endTime: this.queryForm.endTime
          // startTime: this.queryForm.queryDate ? this.queryForm.queryDate[0] : undefined,
          // endTime: this.queryForm.queryDate ? this.queryForm.queryDate[1] : undefined,
        }
        rbCmdbServiceFactory.findInstListByDeviceId(data).then((data) => {
          this.getProcTypeList()
          this.loading = false
          this.tableData = data.value.rows
          this.total = data.value.total
        })
      },
      getProcTypeList () {
        rbCmdbServiceFactory.getAllFlowDefList().then((data) => {
          this.procTypeList = data
        })
      }
    }
  }
</script>

<style scoped>

</style>
