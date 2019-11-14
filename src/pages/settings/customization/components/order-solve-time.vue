<template>

  <div class="content-chart"
       style="width: 24.2%;">
    <section class="chart-title-wrap clearfix">
      <i class="chart-icon icon-rate"></i>
      <span class="chart-title">{{chartData.name}}</span>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <el-table class="yw-rank-table"
                height="100%"
                :data="chartData.chartList[0].tableDatas">
        <el-table-column label="排名"
                         :width="45">
          <template slot-scope="scope">
            <span :class="rankColor(scope.$index+1)">
              {{ scope.$index+1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="工单类型"
                         :width="70">
          <template slot-scope="scope">
            <span class="text-ellipse">
              {{ scope.row.type}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="最长处理 时长(小时)"
                         :width="80">
          <template slot-scope="scope">
            <span class="text-ellipse">
              {{ scope.row.maxTime}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="平均处理时长(小时)"
                         :min-width="150">
          <!-- <template slot-scope="scope">
            <span class="text-ellipse">
              {{ scope.row.avgTime}}
            </span>
          </template> -->
          <template slot-scope="scope">
            <section class="yw-progress ">
              <el-progress :percentage="80"
                           :stroke-width="12"
                           :class="scope.row.status"
                           :color="progressColorMethod(scope.$index)"></el-progress>
            </section>
          </template>
        </el-table-column>
        <el-table-column label="超SLA 工单量"
                         :width="60">
          <template slot-scope="scope">
            <span class="text-ellipse">
              {{ scope.row.SLA}}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 多图表 -->
  </div>
</template>

<script>
import DrawChart from 'src/utils/drawCharts.js'

export default {
  mixins: [DrawChart],
  components: {
    YwProgress: () => import('src/components/common/yw-progress.vue'),
  },
  data () {
    return {
      chartData: {
        name: '工单分类处理时长分析',
        filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
        activeFilter: '物理机',
        chartList: [{ tableTitle: [], tableDatas: [] }],
      }
    }
  },
  methods: {
    //获得数据
    getDatas () {

      // let params = {
      //   'idcType': this.conditionParams.poolActive,
      //   'startDate': this.conditionParams.dateRange[0],
      //   'endDate': this.conditionParams.dateRange[1],
      //   'deviceType': this.chartData.activeFilter,
      //   'sourceType': 'cpu',
      // };
      // this.$api.queryPoolRate(params).then((res) => {
      //   this.chartData.chartList[0].chartDatas = res;//对象
      //   this.drawCharts();
      // })


      this.chartData.chartList[0].tableDatas = new Array(5);
      this.chartData.chartList[0].tableDatas.fill({
        type: '告警工单',
        maxTime: '500',
        avgTime: '80',
        SLA: '34',
        rate: '80',//(80%)
        status: ''
      }, 0, 5);
      this.chartData.chartList[0].tableDatas[0] = {
        type: '告警工单',
        maxTime: '500',
        avgTime: '80',
        SLA: '34',
        rate: '80',//(80%)
        status: 'red'
      }
      this.chartData.chartList[0].tableDatas[1] = {
        type: '告警工单',
        maxTime: '500',
        avgTime: '80',
        SLA: '34',
        rate: '80',//(80%)
        status: 'orange'
      }
      this.chartData.chartList[0].tableDatas[2] = {
        type: '告警工单',
        maxTime: '500',
        avgTime: '80',
        SLA: '34',
        rate: '80',//(80%)
        status: 'yellow'
      }
      this.chartData.chartList[0].tableTitle = [
        { name: 'index', title: '排名' },
        { name: 'type', title: '工单类型' },
        { name: 'maxTime', title: '最长处理 时长(小时)' },
        { name: 'avgTime', title: '平均处理时长(小时)' },
        { name: 'SLA', title: '超SLA 工单量' },
      ];

    },


  },
  mounted () {
    this.getDatas();
  }

}
</script>

<style lang="scss" scoped>
/deep/ .yw-rank-table {
  &.el-table {
    thead {
      th {
        font-size: $font-12;
      }
    }
    tbody {
      td {
        padding: 4px 0;
      }
    }
  }
}
</style>

