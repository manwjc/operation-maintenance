<template>
    <div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  height="calc(100vh - 185px)"
                  border
                  :data="historyAlertData"
                  style="cursor: pointer;"
                  stripe
                  tooltip-effect="dark"
                  @selection-change="handleSelectionChange"
                  v-loading="loading"
                  @row-dblclick="dblhandleCurrentChange($event)">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="级别"
                           width="80px">
            <template slot-scope="scope">
              <rb-mirror-alert-status :mode="'list'"
                                      :status="scope.row.alert_level"></rb-mirror-alert-status>
            </template>
          </el-table-column>
          <el-table-column prop="device_ip"
                           label="设备IP"
                           width="115px"></el-table-column>
          <el-table-column prop="idc_type"
                           label="资源池"
                           width="110px"
                           :show-overflow-tooltip="true"> </el-table-column>
          <el-table-column prop="pod_name"
                           label="pod池"
                           width="85px"
                           :show-overflow-tooltip="true"> </el-table-column>
          <el-table-column prop="biz_sys"
                           label="业务线"
                           width="150px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="device_class"
                           label="设备分类"
                           width="100px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="device_type"
                           label="设备类型"
                           width="100px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="moni_index"
                           label="告警内容"
                           width="250px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="alert_start_time"
                           label="告警开始时间"
                           width="150px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="clear_time"
                           label="清除时间"
                           width="150px"
                           :show-overflow-tooltip="true"></el-table-column>
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
</template>

<script>
  import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
  import rbMirrorAlertStatus from 'src/pages/mirror_alert/common/rb-mirror-alert-status.vue'
  import rbAlertServiceFactory from 'src/services/alert/rb-alert-services.factory.js'
  import { formatDate } from 'src/assets/js/utility/rb-filters.js'
  
  export default {
    components: {
      rbMirrorAlertStatus
    }, 
    data() {
      return {
        historyAlertData: [], // 数据
        currentPage: 1, // 当前页
        pageSize: 50, // 分页每页多少行数据
        pageSizes: [20, 50, 100], // 每页多少行数组
        total: 0, // 总共多少行数据
        instanceId: this.$route.query.instanceId,
        //instanceId: '',
      };
    },
    mounted: function() {
      this.getCurrentAlertByInstanceId(this.instanceId)
    },
    methods: {
      // 根据实例Id查询告警列表
      getCurrentAlertByInstanceId(instanceId) {
        var params = {
            'page_size': this.pageSize,
            'page_no': this.currentPage,
            'instanceId': instanceId 
        }
        rbAlertServiceFactory.getHistoryAlertByInstanceId(params).then((res) => {
          this.historyAlertData = this.parseTableData(res.result)
          this.total = res.count
        })
      },
      parseTableData (result) {
        let list = []
        result.forEach((item) => {
          item.alert_start_time = formatDate(item.alert_start_time)
          item.clear_time = formatDate(item.clear_time)
          list.push(item)
        })
        return list
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getCurrentAlertByInstanceId(this.instanceId)
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.getCurrentAlertByInstanceId(this.instanceId)
      },
    }
    
  };
</script>

<style scoped>

</style>