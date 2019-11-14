<template>
  <div class="components-container">
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button class="btn-icons-wrap"
                   type="text"
                   icon="el-icon-upload2"
                   @click="exportOut">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  :data="result"
                  height="calc(100vh - 305px)"
                  v-loading="loading"
                  stripe
                  border
                  size="mini"
                  style="width: 100%">
          <el-table-column label="负载IP"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.loadIp }}
            </template>
          </el-table-column>
          <el-table-column label="负载端口"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.loadPort }}
            </template>
          </el-table-column>
          <el-table-column label="负载模式"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.loadMode }}
            </template>
          </el-table-column>
          <el-table-column label="负载协议"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.loadProtocol }}
            </template>
          </el-table-column>
          <el-table-column label="负载pool"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.loadPool }}
            </template>
          </el-table-column>
          <el-table-column label="内网地址"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.intranetAddr }}
            </template>
          </el-table-column>
          <el-table-column label="内网端口"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.intranetPort }}
            </template>
          </el-table-column>
          <el-table-column label="Snat类型"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.snatType }}
            </template>
          </el-table-column>
          <el-table-column label="设备IP"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.deviceIp }}
            </template>
          </el-table-column>
          <el-table-column label="所属机房"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.roomId }}
            </template>
          </el-table-column>
          <el-table-column label="创建日期"
                           prop="log_create_time"
                           sortable
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.createTime | formatDate}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <YwPagination @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :total="total"></YwPagination>
    </el-form>
  </div>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'
import rbAlertNetworkStrategyFactory from 'src/services/alert/rb-alert-network-strategy.factory'

export default {
  mixins: [QueryObject],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
  },
  //关键字
  props: ['keyword'],
  data () {
    return {
      //查询条件
      queryParams: {

      },
      // 查询结果
      result: [],
    }
  },
  created () {
    console.log(this.keyword);
    this.query()
  },
  methods: {
    //设置参数(参数具体字段名称，自行修改)
    setParams (activePagination) {
      if (activePagination) {
        this.queryParams['pageNum'] = this.currentPage;
        this.queryParams['pageSize'] = this.pageSize;
      } else {
        this.queryParams = {
          'pageNum': this.initPageChange(),
          'pageSize': this.pageSize,
          'keyword': this.keyword
        }
      }

    },

    /**查询
     * activePagination:分页活动下保持先前的查询条件
     */
    query (activePagination = false) {

      this.setParams(activePagination);
      //自己查询接口
      this.setParams(activePagination);
      rbAlertNetworkStrategyFactory.getLoadBalancerData(this.queryParams).then((res) => {
        this.loading = false;
        this.result = res.result
        this.total = res.count
        this.$emit('updateTabData', this.total, 'loadBalance');
      }).finally(() => {
        this.loading = false;
      })
    },

    //导出
    exportOut () {
      rbAlertNetworkStrategyFactory.exportLoadBalancerData({ 'keyword': this.keyword }).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '网络策略-负载均衡.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.loading = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
