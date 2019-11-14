<template>
  <!-- 资源：设备子类型分布 -->
  <div class="content-chart"
       style="width:39%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <span class="chart-title">{{chartData.name}}</span>

            <!-- <div class="poolTenantAnnularBotton">
                <div @click="annularBotton('p1')">
                    <p :class="{activeAnnular:p1}">服务器</p>
                </div>
                <div @click="annularBotton('p2')">
                    <p :class="{activeAnnular:p2}">网络</p>
                </div>
                <div @click="annularBotton('p3')">
                    <p :class="{activeAnnular:p3}">安全</p>
                </div>
                <div @click="annularBotton('p4')">
                    <p :class="{activeAnnular:p4}">存储</p>
                </div>
            </div> -->
        <el-radio-group class="yw-radio-button-wrap chart-filter-item" style="float:right"
                        v-model="chartData.activeFilter"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter"
                           :key="tabIndex">{{tabItem.label}}</el-radio-button>
        </el-radio-group>
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
            p1: true,
            p2: false,
            p3: false,
            p4: false,
            title: '服务器',
            subTotal: '',
            showData: [],
            chartData: {
                name: '设备子类型分布',
                filter: [{ name: '-1', label: '服务器' }, { name: '0', label: '网络' }, { name: '1', label: '安全' }, { name: '3', label: '存储' }],
                activeFilter: '服务器',
                chartList: [{ id: 'equipment', resourceOption: 'ring-option', chartDatas: '' }]
            }
        }
    },

    methods: {
        getDatas() {
            this.chartData.chartList.chartDatas = []
        },
        changeTab(val) {
            var valName = ''
            if (val === '服务器') {
                valName = val
            } else if (val === '网络') {
                valName = '网络设备'
                this.title = '网络设备'
            } else if (val === '安全') {
                valName = '安全设备'
                this.title = '安全设备'
            } else if (val === '存储') {
                valName = '存储设备'
                this.title = '存储设备'
            }
            var params = {
                deviceClass: valName
            }
            rbHomeService.countDeviceTypeByDeviceClass(params).then((res) => {
                var rs = []
                var sum = 0
                for (var i = 0; i < res.length; i++) {
                    var obj = {
                        name: (res[i].device_type == null ? '未知' : res[i].device_type),
                        value: res[i].num
                    }
                    sum += res[i].num
                    rs.push(obj)
                }
                this.subTotal = sum
                this.showData = rs
                this.drawCharts()
            })
        },
        // 设备子类型分布
        // countDeviceTypeByDeviceClass(deviceClass) {
        //     console.log('deviceClass', deviceClass)
        //     var params = {
        //         deviceClass: deviceClass
        //     }
        //     rbHomeService.countDeviceTypeByDeviceClass(params).then((res) => {
        //         var rs = []
        //         var sum = 0
        //         for (var i = 0; i < res.length; i++) {
        //             var obj = {
        //                 name: (res[i].device_type == null ? '未知' : res[i].device_type),
        //                 value: res[i].num
        //             }
        //             sum += res[i].num
        //             rs.push(obj)
        //         }
        //         this.subTotal = sum
        //         this.showData = rs
        //         this.drawCharts()
        //     })
        // },
        // // 选中某个device_class
        // changeToDeviceClass(data) {
        //     var name = ''
        //     switch (data) {
        //     case 'p1': name = '服务器'; break
        //     case 'p2': name = '网络设备'; break
        //     case 'p3': name = '安全设备'; break
        //     case 'p4': name = '存储设备'; break
        //     default:
        //         break
        //     }
        //     return name
        // },
        // annularBotton(data) {
        //     this.p1 = false
        //     this.p2 = false
        //     this.p3 = false
        //     this.p4 = false
        //     this[data] = true
        //     var deviceClass = this.changeToDeviceClass(data)
        //     this.title = deviceClass
        //     this.countDeviceTypeByDeviceClass(deviceClass)
        // },
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

                    option.title.text = _this.title
                    option.title.subtext = _this.subTotal
                    option.series[0].data = _this.showData
          // option.legend.show = false

                    myChart.setOption(option, true)

          // resize自适应
                    _this.setResizeFun(myChart)

                    myChart.on('click', function(params) {
                        var deviceType = params.name
                        _this.$router.push({
                            path: '/resource/iframe/list',
                            query: {
                                parentParams: {
                                    'deviceType': deviceType
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
        // this.countDeviceTypeByDeviceClass('服务器')
        this.changeTab('服务器')
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

