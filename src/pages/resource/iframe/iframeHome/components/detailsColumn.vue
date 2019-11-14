<template>
    <div class="detailsColumn">
        <div class="titleContent">
            <div class="tenantTypeColumnTitle">{{zuInfo.idcType}}一级租户业务系统分布</div>
            <div class="poolTenantAnnularBotton">
            </div>
        </div>
        <div id="myDetailsColumn" style="width:100%;height:100%;"></div>
    </div>
</template>

<script>

import echarts from 'echarts'

import Bus from './middleKey/bus'
import PoolBus from './middleKey/poolBus'
import iframe from 'src/services/iframe/iframe.js'

import Zbus1 from './middleKey/Zbus1'
import Zbus2 from './middleKey/Zbus2'

import ZuhuPie from './middleKey/ZuhuPie'

import {setSessionStorage, removeSessionStorage, getSessionStorage} from '../components/middleKey/storage';

export default {
  props: ['zuInfo'],
  data() {
    return {
      p1: true,
      p2: false,
      p3: false,
      Number1List: [],
      Department1List: [],
      detailSubordinate: true,
      detailSubordinate0: false,
      Name: '一级',
      Zu2: [],
      Zu2Column: {
        department2List: [],
        numberList: []
      }
    }
  },
  components: {
  },
  mounted() {
      // setTimeout(() => {
      //     this.echartsTypeColumn()
      // }, 1000);
  },
  created() {
    let that = this
    that.getCountBizByIdcDep1()
    setTimeout(() => {
      this.echartsTypeColumn()
    }, 1000)
    // Zbus1.$on('Zu1',function(val,name){
    //     that.Number1List = val.numberList
    //     that.Department1List = val.department1List
    //     that.Name = name
    //     setTimeout(() => {
    //         that.echartsTypeColumn()
    //     }, 1000);
    // })
  },
  watch: {

  },
  methods: {
    resetEchart() {
      this.getCountBizByIdcDep1()
      setTimeout(() => {
        this.echartsTypeColumn()
      }, 250)
    },
    // 统计该一级部门下各二级部门的业务
    // getCountBizByIdcDep2(){
    //   this.Zu2Column.department2List = []
    //   this.Zu2Column.numberList = []
    //   let data = {
    //     idcType: this.zuInfo.idcType,
    //     department1: this.zuInfo.department1
    //   }
    //   iframe.getCountBizByIdcDep2(data).then((res) => {
    //     for(let item in res) {
    //       this.Zu2Column.department2List.push(res[item].department2)
    //       this.Zu2Column.numberList.push(res[item].number)
    //     }
    //   })
    // },
    // 该一级部门下各资源池业务数量(二级柱状图默认)
    // getCountBizByDep1(){
    //   this.Zu2 = []
    //   let data = {
    //     department1: this.zuInfo.department1
    //   }
    //   iframe.getCountBizByDep1(data).then((res) => {
    //     for(let item in res) {
    //       this.Zu2.push({
    //           name: res[item].idcType,
    //           value: res[item].number
    //       })
    //     }
    //   })
    // },
    // 统计该资源池下各一级部门下的业务
    getCountBizByIdcDep1() {
        let data = {
          idcType: this.zuInfo.idcType
        }
        iframe.getCountBizByIdcDep1(data).then((res) => {
          this.Number1List = []
          this.Department1List = []
          for (let item in res) {
            this.Number1List.push(res[item].number)
            this.Department1List.push(res[item].department1)
          }
        })
      },
    echartsTypeColumn() {
        let that = this
        var myChart = echarts.init(document.getElementById('myDetailsColumn'))
          myChart.setOption({
            title: {
                text: ''
              },
            tooltip: {
                // 提示事件类型和格式
                trigger: 'item',
                formatter: '{b} <br/>业务系统数: {c} '
              },
            grid: {
                top: '55',
                left: '40',
                right: '30',
                bottom: '1',
                containLabel: true
              },
            xAxis: {
                show: false,
                data: that.Department1List,
                axisLabel: {
                        textStyle: { // 改变刻度字体样式
                            color: '#5E6D82'
                          }
                      },
                axisLine: {
                        show: true,
                        lineStyle: { color: '#E5E8ED',
                            width: 1
                          }
                      },
                axisTick: {
                        show: false
                      }

                    //   axisLabel: {
                    //       color:'#666',
                    //       rotate:30,
                    //       interval:0,
                    //   }
              },
            yAxis: {
                axisLabel: {
                    textStyle: { // 改变刻度字体样式
                        color: '#5E6D82'
                      }
                  },
                splitLine: {    // 网格线
                    lineStyle: {
                        type: 'dashed'    // 设置网格线类型 dotted：虚线   solid:实线
                      },
                    show: true // 隐藏或显示
                  },
                axisLine: {
                    show: false
                  },
                axisTick: {
                    show: false
                  }
              },
            series: [
                {
                  name: '',
                  type: 'bar',
                  barWidth: 15, // 柱图宽度
                  itemStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 1, color: '#305BFF' // 0% 处的颜色
                              }, {
                                offset: 0, color: '#5B94FF' // 100% 处的颜色
                              }]
                          },
                        label: {
                            show: false, // 开启显示
                            position: '', // 在上方显示
                            textStyle: { // 数值样式
                                color: '#fff',
                                fontSize: 12
                              }
                          }
                      }
                  },
                  data: that.Number1List
                }
              ]
          }),
          myChart.on('click', function(params) {
            that.zuInfo.department1 = params.name
            that.$emit('showDep2')
          })
      }
  }
}
</script>
<style lang="stylus">
.detailsColumn {
    position relative;
    width:100%;
    height:100%;
    .titleContent {
        overflow: hidden;
    }
    .tenantTypeColumnTitle {
        position:absolute;
        line-height:30px;
        left:40px;
        top:10px;
    }
    .myDetailsColumn {
        div {
            width:100%;
            canvas {
                width:100%;
            }
        }
    }
}
</style>
