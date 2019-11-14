<template>
  <!-- 资源：各一级租户新增设备量趋势分布TOP5 -->
  <div class="content-chart"
       style="width:60%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <span class="chart-title">{{chartData.name}}</span>
            <!-- <div class="poolTenantAnnularBotton">
                <div @click="annularBotton('p1')">
                    <p :class="{activeAnnular:p1}">日</p>
                </div>
                <div @click="annularBotton('p2')">
                    <p :class="{activeAnnular:p2}">月</p>
                </div>
            </div> -->
      <div class="chart-filter">
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter"
                           :key="tabIndex">{{tabItem.label}}</el-radio-button>
        </el-radio-group>
      </div>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <div class="chart-box-wrap">
        <div class="chart-box-item"
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
import ResourceOption from '../utils/resourceOption.js'
import DrawChart from 'src/utils/drawCharts.js'

import rbHomeService from 'src/services/iframe/rb-home-service.js'

export default {
    mixins: [DrawChart],
    components: {

    },
    data() {
        return {
            tabPosition: 'right',
            p1: false,
            p2: true,
            p3: false,
            FirstList: [],  // 第一条柱子
            SecondList: [], // 第二条柱子
            ThirdList: [],  // 第三条柱子
            depList: [],
            dateFlag: [],   // 日和月的标识
            chartData: {
                name: '各一级租户新增设备量趋势分布TOP5',
                filter: [{ name: '-1', label: '日' }, { name: '0', label: '月' }],
                activeFilter: '日',
                chartList: [{ id: '123', resourceOption: 'TOPbar-option', chartDatas: '' }]
            }
        }
    },

    methods: {
        getDatas() {
            this.chartData.chartList.chartDatas = []
        },
        changeTab(val) {
            if (val === '日') {
                rbHomeService.countDevClsByDepWithDay().then((res) => {
                    var flag = this.getLastThreeDay()
                    this.packageData(flag, res)
                    this.setDateFlag(flag, 'day')
                    this.drawCharts()
                })
            } else {
                rbHomeService.countDevClsByDepWithMonth().then((res) => {
                    var flag = this.getLastThreemMonth()
                    this.packageData(flag, res)
                    this.setDateFlag(flag, 'month')
                    this.drawCharts()
                })
            }
        },
        // countDevClsByDepWith(flag) {
        //     if (flag === 'p1') {
        //         rbHomeService.countDevClsByDepWithDay().then((res) => {
        //             var flag = this.getLastThreeDay()
        //             this.packageData(flag, res)
        //             this.setDateFlag(flag, 'day')
        //             this.drawCharts()
        //         })
        //     } else {
        //         rbHomeService.countDevClsByDepWithMonth().then((res) => {
        //             var flag = this.getLastThreemMonth()
        //             this.packageData(flag, res)
        //             this.setDateFlag(flag, 'month')
        //             this.drawCharts()
        //         })
        //     }
        // },
        // 封装数据
        packageData(flag, res) {
            var FirstList = []
            var SecondList = []
            var ThirdList = []
            var depList = []
            for (var i = 0; i < res.length; i++) {
                var crtObj = res[i]
                var zero = flag[0]
                var one = flag[1]
                var two = flag[2]
                depList.push(crtObj.department)
                FirstList.push(crtObj[zero])
                SecondList.push(crtObj[one])
                ThirdList.push(crtObj[two])
            }
            this.depList = depList
            this.FirstList = FirstList
            this.SecondList = SecondList
            this.ThirdList = ThirdList
        },
        // 获取时间分类标识
        setDateFlag(flag, date) {
            var dateFlag = []
            if (date === 'day') {
                for (var i = 0; i < flag.length; i++) {
                    dateFlag.push(flag[i])
                }
            } else {
                var monthName = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
                for (let i = 0; i < flag.length; i++) {
                    var monthIndex = flag[i].split('-')[1]
                    dateFlag.push(monthName[parseInt(monthIndex) - 1] + '月份')
                }
            }
            this.dateFlag = dateFlag
        },
        // annularBotton(data) {
        //     this.p1 = false
        //     this.p2 = false
        //     this.p3 = false
        //     this[data] = true
        //     this.countDevClsByDepWith(data)
        // },
        // 获取最近的三天日期
        getLastThreeDay() {
            var rs = []
            for (var i = -2; i <= 0; i++) {
                var today = new Date()
                let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * i
                today.setTime(targetday_milliseconds)
                let tYear = today.getFullYear()
                let tMonth = today.getMonth()
                let tDate = today.getDate()
                tMonth = tMonth + 1 >= 10 ? tMonth + 1 : '0' + (tMonth + 1)
                tDate = tDate.toString().length == 1 ? '0' + tDate : tDate
                rs.push(tYear + '-' + tMonth + '-' + tDate)
            }
            return rs
        },
        // 获取最近三月的月份
        getLastThreemMonth() {
            var rs = []
            for (var i = -2; i <= 0; i++) {
                let today = new Date()
                let tYear = today.getFullYear()
                let tMonth = today.getMonth()
                today.setMonth(tMonth + i)
                tMonth = today.getMonth()
                tMonth = tMonth + 1 >= 10 ? tMonth + 1 : '0' + (tMonth + 1)
                rs.push(tYear + '-' + tMonth)
            }
            return rs
        },
    // 绘制饼图表
        drawCharts() {
            let _this = this
            _this.$nextTick(() => {
                _this.chartData.chartList.forEach((subItem, subIndex) => {
                    let myChart = echarts.init(document.getElementById(subItem.id))
                    myChart.clear()
          // 数据格式处理
                    let option = { ...ResourceOption[subItem.resourceOption] }
                    let chartDatas = [..._this.chartData.chartList.chartDatas]

                    option.xAxis.data = _this.depList
                    option.legend.data = _this.dateFlag
                    option.series[0].data = _this.FirstList
                    option.series[1].data = _this.SecondList
                    option.series[2].data = _this.ThirdList
                    option.series[0].name = _this.dateFlag[0]
                    option.series[1].name = _this.dateFlag[1]
                    option.series[2].name = _this.dateFlag[2]

                    myChart.setOption(option, true)

          // resize自适应
                    _this.setResizeFun(myChart)

                    myChart.on('click', function(params) {

                    })
                    myChart.on('click', function(params) {
                        var monthList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
                        var monthFlag = ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31']
                        let start = ''
                        var end = ''
                // 日
                        var flagName = params.seriesName
                        if (_this.p1) {
                            start = flagName
                            end = flagName
                        } else {
                            var index = -1
                            for (;index < monthList.length; index++) {
                                var c = monthList[index] + '月份'
                                if (c === flagName) {
                                    break
                                }
                            }
                            var today = new Date()
                            var tYear = today.getFullYear()
                            var tickMonth = (index + 1) > 10 ? (index + 1) : '0' + (index + 1)
                            var flag = parseInt(tickMonth)
                            var monthEndDay = monthFlag[flag - 1]
                            if (flag === 2) {
                                if (tYear % 4 === 0 && tYear % 100 !== 0) {
                                    monthEndDay = monthEndDay + 1
                                } else if (tYear % 4 === 0 && tYear % 400 === 0) {
                                    monthEndDay = monthEndDay + 1
                                }
                            }
                            start = tYear + '-' + tickMonth + '-01'
                            end = tYear + '-' + tickMonth + '-' + monthEndDay
                        }

                        _this.$router.push({
                            path: '/resource/iframe/list',
                            query: {
                                parentParams: {
                                    'department1': params.name,
                                    'startInsertTime': start,
                                    'endInsertTime': end
                                }
                            }
                        })
                    })
                })
            })
        }

    },

    mounted() {
        this.getDatas()
        // this.countDevClsByDepWith('p2')
        this.changeTab('日')
    },
    beforeDestroy() {

    }
}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";
    .poolTenantAnnularBotton {
        float:right;
        line-height:rem(48);
        margin-right:10px;
        div {
            float:left;
            cursor: pointer;
            width:55px;
            height:rem(20);
            line-height:rem(20);
            text-align:center;
            font-size: rem(14);
            p {
                display:inline-block;
                margin-top:14px;
            }
        }
        .activeAnnular {
            border-bottom: 2px solid #028ded;
            color: #028ded;
        }
    }
</style>

