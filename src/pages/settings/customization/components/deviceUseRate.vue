<template>
  <!-- 设备利用率 -->
  <div class="content-chart"
       style="width:66.2%;height:300px;">
    <section class="chart-title-wrap clearfix">

      <span class="chart-title">{{chartData.name}}</span>
      <div class="chart-filter">
        <el-select class="chart-filter-item"
                   v-model="chartData.filter.activeFilter">
          <el-option v-for="item in selectOptionsDeviceType"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <treeselect class="yw-treeselect chart-filter-item"
                    v-model="bizSysDepChecked"
                    :options="bizDepTreeSelOpts"
                    placeholder="请选择业务系统">
        </treeselect>
      </div>

    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <div class="chart-box-wrap"
           v-if="chartData.chartList.length > 1">
        <div class="chart-box-item"
             style="width:25%"
             v-for="(subItem,subIndex) in chartData.chartList"
             :key="subIndex"
             :id="subItem.id"></div>
      </div>
    </section>
    <!-- 多图表 -->

  </div>
</template>

<script>
import echarts from 'echarts'
import DrawChart from '../utils/drawChart.js'
import messageService from 'src/services/home/device-user-rate-service.js'
import rbAlertKanBanServiceFactory from 'src/services/alert/rb-alert-kanban-services.factory.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  mixins: [DrawChart],
  components: {
    Treeselect
  },
  data () {
    return {
      //echart 的实例节点
      bizSysTree: null,
      bizSysDepChecked: null,
      bizDepTreeSelOpts: [],
      selectOptionsDeviceType: [{ lable: '物理机', value: '物理机' }, { lable: '虚拟机', value: '虚拟机' }],
      defaultChartList: [
        { id: '004_1', chartOption: 'pieUse', chartDatas: [] },
        {
          id: '004_2', chartOption: 'gaugeUse', chartDatas: [{
            value: 0, //百分比
            total: 0, //总数
            average: 0, //平均百分比
            cell: 'GB', //单位
            name: '内存',
            color: ['#876EFF', '#aaa']
          }]
        },
        {
          id: '004_3', chartOption: 'gaugeUse', chartDatas: [{
            value: 0, //百分比
            total: 0, //总数
            average: 0, //平均百分比
            cell: '核', //单位
            name: 'CPU',
            color: ['#ff1244', '#aaa']
          }]
        },
        {
          id: '004_4', chartOption: 'gaugeUse', chartDatas: [{
            value: 0, //百分比
            total: 0, //总数
            average: 0, //平均百分比
            cell: 'GB', //单位
            name: '块存储',
            color: ['#ff7902', '#aaa']
          }]
        }
      ],
      chartData: {
        id: '004',
        name: '设备利用率',
        filterType: ['select'],
        filter: {
          curSelect: '',
          activeFilter: '物理机',
          selectOptions: [],
        },
        chartList: []
      },
    }
  },
  watch: {
    bizSysDepChecked (val) {
      this.queryCharts()
    },
    'chartData.filter.activeFilter' (val) {
      this.queryCharts()
    }
  },
  methods: {
    // 获取业务系统
    getBizSysTreeData () {
      let _this = this
      rbAlertKanBanServiceFactory.bizSysTreeOptions().then(res => {
        if (!_this.bizSysTree) {
          _this.bizSysTree = res
        }
        _this.bizDepTreeSelOpts = res
      })
    },
    //图表查询
    async queryCharts (ifInit = false) {
      let _this = this
      let getBizSysByChecked = function (sysDepChecked) {
        // if (sysDepChecked && sysDepChecked.length === 1 && !sysDepChecked[0]) {
        //   return ''
        // }
        let target = []
        let list = _this.bizSysTree[0].children
        let addEle = function (eles) {
          if (!eles.children || eles.children.length === 0) {
            target.push(eles.id)
          } else {
            _.forEach(eles.children, ele => {
              addEle(ele)
            })
          }
        }
        let findEle = function (_array, _origin) {
          _.forEach(_array, child => {
            if (child.id === _origin) {
              addEle(child)
            } else if (child.children && child.children.length > 0) {
              findEle(child.children, _origin)
            }
          })
        }
        // _(sysDepChecked).forEach(ele => {
        //   findEle(list, ele)
        // })
        findEle(list, sysDepChecked)
        return _(target).uniq().join(',')
      }
      let param = {}
      param.bizSystem = (this.bizSysDepChecked && this.bizSysDepChecked.length > 0) ? getBizSysByChecked(this.bizSysDepChecked) : ''
      param.deviceType = this.chartData.filter.activeFilter
      this.chartData.chartList = JSON.parse(JSON.stringify(this.defaultChartList))
      try {
        let res = await messageService.queryServiceCount(param)
        res.forEach((item, index) => {
          let itemStyle = {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0.2, color: item.deviceType === '虚拟机' ? '#1C56D9' : '#0DA8FF' // 0% 处的颜色
                },
                {
                  offset: 1, color: item.deviceType === '虚拟机' ? '#607FF1' : '#1DDCEE' // 100% 处的颜色
                }],
              globalCoord: true // 缺省为 false
            }
          }
          this.chartData.chartList[0].chartDatas.push({ value: item.count, name: item.deviceType, itemStyle: itemStyle })
          if (this.chartData.filter.activeFilter === '' || this.chartData.filter.activeFilter === item.deviceType) {
            this.chartData.chartList[1].chartDatas[0].total += parseInt(item.memorySize)
            this.chartData.chartList[2].chartDatas[0].total += parseInt(item.cpuCoreNumber)
            this.chartData.chartList[3].chartDatas[0].total += parseInt(item.diskSize)
          }
        })
        if (this.chartData.chartList[1].chartDatas[0].total > 10000) {
          this.chartData.chartList[1].chartDatas[0].total = (this.chartData.chartList[1].chartDatas[0].total / 1024).toFixed(2)
          this.chartData.chartList[1].chartDatas[0].cell = 'TB'
        }
        if (this.chartData.chartList[3].chartDatas[0].total > 10000) {
          this.chartData.chartList[3].chartDatas[0].total = (this.chartData.chartList[3].chartDatas[0].total / 1024).toFixed(2)
          this.chartData.chartList[3].chartDatas[0].cell = 'TB'
        }
      } catch (e) {
        this.$message({
          message: '获取服务器失败',
          type: 'error'
        })
      }
      try {
        let res = await messageService.deviceUsedRate(param)
        if (res['cpu_pused'] !== undefined) {
          this.chartData.chartList[2].chartDatas[0].average = res['cpu_pused'].avg.toFixed(2)
          this.chartData.chartList[2].chartDatas[0].value = res['cpu_pused'].max.toFixed(2)
        }
        if (res['memory_pused'] !== undefined) {
          this.chartData.chartList[1].chartDatas[0].average = res['memory_pused'].avg.toFixed(2)
          this.chartData.chartList[1].chartDatas[0].value = res['memory_pused'].max.toFixed(2)
        }
        if (res['disk_pused'] !== undefined) {
          if (res['disk_pused'].avg <= 100 && res['disk_pused'].max <= 100) {
            this.chartData.chartList[2].chartDatas[0].average = res['disk_pused'].avg.toFixed(2)
            this.chartData.chartList[2].chartDatas[0].value = res['disk_pused'].max.toFixed(2)
          }
        }
      } catch (e) {
        console.warn('获取利用率失败')
        // this.$message({
        //   message: '获取利用率失败',
        //   type: 'error'
        // })
      }
      this.$nextTick(() => {
        this.chartData.chartList.forEach((subItem, subIndex) => {

          let myChart = echarts.init(document.getElementById(subItem.id));
          myChart.clear();
          myChart.setOption(this.getOption(subItem), true);
          //保存echart对象实例
          if (!this.chartNodeMap[subItem.id]) {
            this.chartNodeMap[subItem.id] = myChart
          }
        })
      })
    }
  },

  mounted () {
    this.getBizSysTreeData()
    this.queryCharts();
    this.handleChartResize()
  },
  beforeDestroy () {
    this.clearChartResize()
  }
}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";
</style>

