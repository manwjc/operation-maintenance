<template>
  <!-- 告警：告警级别 -->
  <div class="content-chart"
       style="width: 100%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <span class="chart-title">{{chartData.name}}</span>
      <div class="chart-filter">
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter"
                           :key="tabIndex">{{tabItem.name}}</el-radio-button>
        </el-radio-group>
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter2"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter2"
                           :key="tabIndex">{{tabItem.name}}</el-radio-button>
        </el-radio-group>
        <el-date-picker class="chart-filter-item"
                        v-model="chartData.date"
                        @change="changeTab"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        style="width:174px;"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </section>

    <!-- 多图表 -->
    <!-- <section class="chart-section">
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  :data="chartData.tableList"
                  height="250px"
                  stripe
                  border
                  show-summary>
          <el-table-column label="排名"
                           width="60">
            <template slot-scope="scope">
              <span :class="{'color-red':scope.$index===0,'color-orange':scope.$index===1,'color-yellow':scope.$index===2,}">
                {{ scope.$index + 1 }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="告警内容">
            <template slot-scope="scope">
              {{ scope.row.content }}
            </template>
          </el-table-column>
          <el-table-column label="告警数量"
                           prop="number"
                           width="160">
          </el-table-column>

          <el-table-column label="占比">
            <template slot-scope="scope">
              <el-progress :percentage="Number(scope.row.rate)*100"
                           :color="progressColorMethod(scope.$index)"></el-progress>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section> -->

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
                      border
                      show-summary>
              <el-table-column label="排名"
                               width="60">
                <template slot-scope="scope">
                  <span :class="rankColor(scope.$index+1)">
                    {{ scope.$index + 1 }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="告警内容">
                <template slot-scope="scope">
                  {{ scope.row.colName }}
                </template>
              </el-table-column>
              <el-table-column label="告警数量"
                               prop="count"
                               width="160">
              </el-table-column>

              <el-table-column label="占比">
                <template slot-scope="scope">
                  <el-progress :percentage="Number(scope.row.rate)*100"
                               :color="progressColorMethod(scope.$index)"></el-progress>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </section>
    <!-- 多图表 -->
  </div>
</template>

<script>
import echarts from 'echarts'
import ChartOption from 'src/utils/chartOption.js'
import DrawChart from 'src/utils/drawCharts.js'

export default {
  mixins: [DrawChart],
  data () {
    return {
      chartData: {
        name: '告警内容告警数量Top10',
        filter: [{ name: '全部', label: '' }, { name: '服务器', label: '服务器' }, { name: '防火墙', label: '防火墙' }, { name: '路由器', label: '路由器' }, { name: '交换机', label: '交换机' }],
        activeFilter: '',
        filter2: [{ name: '严重', label: '5' }, { name: '高', label: '4' }, { name: '中', label: '3' }, { name: '低', label: '2' }],
        activeFilter2: '5',
        date: '',
        chartList: [{ tableTitle: [], tableDatas: [], total: 0, }],

      }
    }
  },
  methods: {
    //获得数据
    getDatas () {

      let params = {
        'idcType': this.conditionParams.poolActive,
        'startDate': this.chartData.date[0],
        'endDate': this.chartData.date[1],
        'deviceType': this.chartData.activeFilter,
        'alertLevel': this.chartData.activeFilter2,
      };

      this.$api.queryAlertContent(params).then((res) => {
        this.chartData.chartList[0].tableDatas = res.result;
        this.chartData.chartList[0].total = res.count;
      })

      this.chartData.chartList[0].tableTitle = [
        { name: 'index', title: '排名' },
        { name: 'colName', title: '告警内容' },
        { name: 'count', title: '告警数量' },
        { name: 'rate', title: '占比' },
      ];

    },

    //获得总数
    getSummaries (params) {
      return this.chartData.chartList[0].total;
    },

    changeTab (val) {
      this.getDatas();
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

