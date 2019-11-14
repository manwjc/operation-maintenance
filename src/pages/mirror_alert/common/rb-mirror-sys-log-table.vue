<template>
  <div>
    <div>
      <div>
        <el-row :gutter="20" type="flex" justify="space-between">
          <el-col :span="5"><div><span style="font-size:18px;">日志记录总数:{{total}}</span></div></el-col>
          <el-col :span="14">
            <div>
              <el-form :inline="true" >
                <el-form-item label="日志时间范围:">
                  <el-date-picker v-model="search.dateTimeRange"
                                  type="datetimerange"
                                  align="right"
                                  unlink-panels
                                  range-separator="至"
                                  start-placeholder="开始时间"
                                  end-placeholder="结束时间"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  :picker-options="pickerOptions24">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="关键字:">
                  <YwInputAdd :keys="keys"
                              :activeKey="activeKey"
                              @changeKey="changeKey"
                              style="width: 300px"></YwInputAdd>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="5">
            <div>
              <el-button type="primary"  size="mini" plain @click="toSearch()">高级搜索</el-button>
              <el-button type="primary"  size="mini" plain @click="searchData()">查询</el-button>
              <el-button type="primary"  size="mini" plain @click="reset()">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- table -->
      <div class="yw-el-table-wrap" style="padding-top:10px;">
        <el-table class="yw-el-table"
                  :data="result"
                  height="calc(100vh - 310px)"
                  v-loading="loading"
                  stripe
                  border>
          <el-table-column label="资源池"
                           width="160">
            <template slot-scope="scope">
              {{ scope.row.pool_name }}
            </template>
          </el-table-column>
          <el-table-column label="设备IP"
                           prop="ip"
                           sortable
                           width="140">
            <template slot-scope="scope">
              <!--{{ scope.row.ip }}-->
              <a class="table-link" @click="getDetails(scope.row)">{{ scope.row.ip }}</a>
            </template>
          </el-table-column>
          <el-table-column label="日志生成时间"
                           prop="log_create_time"
                           sortable
                           width="160">
            <template slot-scope="scope">
              {{ scope.row.log_create_time | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="日志内容">
            <template slot-scope="scope">
              <span class="pre-wrap">{{ scope.row.massage }}</span>
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
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <!-- dialog -->
    <el-dialog class="yw-dialog"
               width="600px"
               title="基本信息"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               :visible.sync="dialogMsg.dialogVisible"
               v-if="dialogMsg.dialogVisible">
      <DialogDeviceDetails :obj="dialogMsg.data"
                           @closeDialog="closeDialog"></DialogDeviceDetails>
    </el-dialog>
  </div>
</template>
<script>
  import {formatDate} from 'src/assets/js/utility/rb-filters.js'
  import QueryObject from 'src/utils/queryObject.js'
  export default {
    mixins: [QueryObject],
    components: {
      YwSelectResource: () => import('src/components/common/yw-select-resource.vue'),
      DialogDeviceDetails: () => import('src/pages/logs/device/dialog-device-details.vue'),
      YwInputAdd: () => import('src/components/common/yw-input-add.vue'),
    },
    props: [
      'obj'
    ],
    data () {
      return {
        search: {
          dateTimeRange: []
        },
        result: [],
        loading: false,
        //查询条件
        queryParams: {},
        currentPage: 1, // 当前页
        pageSize: 50, // 分页每页多少行数据
        pageSizes: [20, 50, 100], // 每页多少行数组
        total: 0, // 总共多少行数据
        dialogMsg: {
          dialogVisible: false,
          data: {} //数据(暂时没有详情接口，从列表数据携带)
        },
      }
    },
    mounted: function () {
      this.searchData(true)
    },
    methods: {
      //初始化
      initDate () {
        let now = new Date()
        let before = now.getTime() - 1000 * 60 * 60
        this.search.dateTimeRange = [formatDate(before), formatDate(now)]
      },
      // 分页改变尺寸
      handleSizeChange (val) {
        this.pageSize = val
        this.init_()
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.init_()
      },
      //设置参数
      setParams (activePagination) {
        if (activePagination) {
          this.queryParams['page_no'] = this.currentPage;
          this.queryParams['page_size'] = this.pageSize;
        } else {
          this.queryParams = {
            'create_time_start': this.search.dateTimeRange ? this.search.dateTimeRange[0] : '',
            'create_time_end': this.search.dateTimeRange ? this.search.dateTimeRange[1] : '',
            'ip': this.obj.device_ip,
            'pool': this.obj.idc_type,
            'page_no': this.initPageChange(),
            'page_size': this.pageSize,
            'params': this.keys
          }
        }

      },
      init_ (val) {
        if (val) {
          this.initDate()
        }
        this.loading = true
        this.searchDialog = false
        this.setParams(false)
        this.rbHttp.sendRequest({
          method: 'POST',
          url: `/v1/log/getLogData`,
          data: this.queryParams
        }).then((res) => {
          this.total = res.count
          this.result = res.result
          return res
        }).catch((res) => {
          this.$message.error(res.statusText);
        }).finally(() => {
          this.loading = false
        })
      },
      searchData (val = false) {
        this.init_(val)
      },
      reset () {
        this.search.dateTimeRange = []
        this.keys = []
      },
      // 详情
      getDetails (row) {
        this.dialogMsg.data = row
        this.dialogMsg.dialogVisible = true
      },
      closeDialog (val) {
        this.dialogMsg.dialogVisible = val
      },
      toSearch () {
        this.setParams(false)
        this.$router.push({
          path: '/logs/device/list',
          query: {
            searchData: this.queryParams
          }
        })
      },
    },
    watch: {
      obj: {
        handler: function () {
          if (obj) {
            this.searchData(true)
          }
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  /deep/ .el-table {
    overflow: auto;
    .el-table__body-wrapper {
      overflow: auto !important;
    }
  }
</style>
