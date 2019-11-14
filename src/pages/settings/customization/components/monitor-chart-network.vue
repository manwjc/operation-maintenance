<template>
  <!-- 监控：资源池网络宽带资源 -->
  <div class="content-chart"
       style="width: 100%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <i class="chart-icon icon-rate"></i>
      <span class="chart-title">{{chartData.name}}</span>
      <div class="chart-filter">
        <el-button class="btn-icons-wrap"
                   icon="el-icon-upload2"
                   @click="exportOut">导出</el-button>
      </div>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <div class="chart-box-wrap">
        <div class="chart-box-item"
             style="width:100%"
             v-for="(subItem,subIndex) in chartData.chartList"
             :key="subIndex">
          <div class="yw-el-table-wrap">
            <el-table class="yw-el-table"
                      :data="subItem.tableDatas"
                      height="250px"
                      stripe
                      border>
              <el-table-column :label="titleItem.title"
                               v-for="(titleItem,index) in subItem.tableTitle"
                               :key="index">
                <template slot-scope="scope">
                  <span>{{ scope.row[titleItem.name] }}</span>
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
        </div>
      </div>
    </section>
    <!-- 多图表 -->
  </div>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'
import echarts from 'echarts'
import ChartOption from 'src/utils/chartOption.js'
import DrawChart from 'src/utils/drawCharts.js'

export default {
  mixins: [QueryObject, DrawChart],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
  },
  data () {
    return {
      chartData: {
        name: '资源池网络宽带资源',
        filter: [{ name: '-1', label: '物理机' }, { name: '0', label: '虚拟机' }],
        activeFilter: '物理机',
        chartList: [{ tableTitle: [], tableDatas: [] }],
      },
      //查询条件
      queryParams: {

      },
    }
  },
  methods: {
    //设置参数
    setParams (activePagination) {

      if (activePagination) {
        this.queryParams['page_no'] = this.currentPage;
        this.queryParams['page_size'] = this.pageSize;
      } else {
        this.initPageChange(this.staticCurrentPage, this.staticPageSize);

        this.queryParams = {
          'page_no': this.initPageChange(),
          'page_size': this.pageSize,
        }
      }
    },

    //获得数据
    getDatas (activePagination = false) {
      this.setParams(activePagination);

      //请求方法在这里写
      // let queryParams = {
      //   time: this.chartData.activeFilter,
      // };
      // this.$http.sendRequest({
      //   method: 'POST',
      //   url: `/v1/config/getConfigData`,
      //   data: this.queryParams
      // }).then((res) => {
      //   this.chartData.chartList.chartDatas = res.data;
      //   this.drawCharts();
      //   return res
      // }).catch((res) => {
      //   this.$message.error(res.statusText);
      // }).finally(() => {

      // });
      this.chartData.chartList[0].tableTitle = [
        { name: 'pool', title: '资源池' },
        { name: 'type', title: '资源类型' },
        { name: 'exportNetwork', title: '出口设计带宽（G）' },
        { name: 'exportMaxRate', title: '出口带宽本月峰值利用率（%）' },
        { name: 'exportAverageRate', title: '出口带宽本月均值利用率（%）' },
        { name: 'exportFlow', title: '出口流量总量（G）' },
        { name: 'importNetwork', title: '入口设计带宽（G）' },
        { name: 'importMaxRate', title: '入口带宽本月峰值利用率（%）' },
        { name: 'importAverageRate', title: '入口带宽本月均值利用率（%）' },
        { name: 'importFlow', title: '入口流量总量（G）' },

      ];
      this.chartData.chartList[0].tableDatas = [
        { pool: '呼和浩特资源池', type: 'IP承载网', exportNetwork: '200', exportMaxRate: '<0.01', exportAverageRate: '<0.01', exportFlow: '3.47', importNetwork: '216', importMaxRate: '<0.01', importAverageRate: '<0.01', importFlow: '3.47' },
        { pool: '呼和浩特资源池', type: 'IP承载网', exportNetwork: '200', exportMaxRate: '<0.01', exportAverageRate: '<0.01', exportFlow: '3.47', importNetwork: '216', importMaxRate: '<0.01', importAverageRate: '<0.01', importFlow: '3.47' },
        { pool: '呼和浩特资源池', type: 'IP承载网', exportNetwork: '200', exportMaxRate: '<0.01', exportAverageRate: '<0.01', exportFlow: '3.47', importNetwork: '216', importMaxRate: '<0.01', importAverageRate: '<0.01', importFlow: '3.47' },
        { pool: '呼和浩特资源池', type: 'IP承载网', exportNetwork: '200', exportMaxRate: '<0.01', exportAverageRate: '<0.01', exportFlow: '3.47', importNetwork: '216', importMaxRate: '<0.01', importAverageRate: '<0.01', importFlow: '3.47' },
        { pool: '呼和浩特资源池', type: 'IP承载网', exportNetwork: '200', exportMaxRate: '<0.01', exportAverageRate: '<0.01', exportFlow: '3.47', importNetwork: '216', importMaxRate: '<0.01', importAverageRate: '<0.01', importFlow: '3.47' },
        { pool: '呼和浩特资源池', type: 'IP承载网', exportNetwork: '200', exportMaxRate: '<0.01', exportAverageRate: '<0.01', exportFlow: '3.47', importNetwork: '216', importMaxRate: '<0.01', importAverageRate: '<0.01', importFlow: '3.47' },
      ];
    },

    //导出
    exportOut () {

    },

  },
  mounted () {
    this.getDatas();
  }

}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";
</style>

