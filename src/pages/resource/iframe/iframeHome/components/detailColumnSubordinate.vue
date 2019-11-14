<template>
    <div class="detailsColumn">
        <div class="titleContent">
            <div class="equipmentPieTitle">
                <div>{{zuInfo.idcType}}{{zuInfo.department1}}二级租户业务系统分布</div>
            </div>
        </div>

        <div id="myAnnular" style="float:left;width:34.5%;height:calc(100% - 42px);"></div>
        <div class="column">
            <div class="line"></div>
            <div class="title">{{zuInfo.department2}}业务系统设备分布</div>
            <div id="myDetailsColumnSubordinate" style="width:100%;height:100%;"></div>
        </div>
    </div>
</template>

<script>

import echarts from 'echarts'

import Zbus2 from './middleKey/Zbus2'

import KeyBus from './middleKey/keyBus'
import iframe from 'src/services/iframe/iframe.js'
import {setSessionStorage, removeSessionStorage, getSessionStorage} from '../components/middleKey/storage'

import ZuhuPie from './middleKey/ZuhuPie'

export default {
  props: ['zuInfo'],
  data() {
    return {
      p1: true,
      p2: false,
      p3: false,
      bizSystemList: [],
      sendSonMessage: false,
      sendSonMessage0: true,

      Zu2: [],
      Total: '',
      department2List: [],
      numberList: [],
      aaa: '',
      bbb: '',
      ccc: ''
    }
  },
  components: {
  },
  mounted() {
    this.getCountBizByIdcDep2()
    this.getCountByIdcDep2Biz()
  },
  created() {
  },
  methods: {
    getCountByIdcDep2Biz() {
      let data = {
        idcType: this.zuInfo.idcType,
        department1: this.zuInfo.department1,
        department2: this.zuInfo.department2
      }
      iframe.getCountByIdcDep2Biz(data).then((res) => {
        this.bizSystemList = []
        this.numberList = []
        for (let item in res) {
          this.bizSystemList.push(res[item].bizSystem)
          this.numberList.push(res[item].number)
        }
        this.drawPie()
        this.echartsTypeColumn()
      })
    },
    getCountBizByIdcDep2() {
      let data = {
        department1: this.zuInfo.department1,
        idcType: this.zuInfo.idcType
      }
      iframe.getCountBizByIdcDep2(data).then((res) => {
          // this.department2List = []
          // this.numberList = []
        let dataList = res.dataList
        this.Zu2 = []
        this.Total = ''
        this.Total = res.total
        for (let item in dataList) {
            // this.department2List.push(res[item].department2)
            // this.numberList.push(res[item].number)
          this.Zu2.push({
            name: dataList[item].department2 ? dataList[item].department2 : '未知',
            value: dataList[item].number
          })
        }
        this.drawPie()
        this.echartsTypeColumn()
      })
    },
    echartsTypeColumn() {
      let that = this
      let myChart = echarts.init(document.getElementById('myDetailsColumnSubordinate'))
      myChart.off('click')
      myChart.setOption({
        title: {
          text: ''
        },
        tooltip: {
              // 提示事件类型和格式
          trigger: 'item',
          formatter: '{b}业务系统 <br/>设备数: {c}'
        },

        grid: {
          top: '40',
          left: '40',
          right: '30',
          bottom: '0',
          containLabel: true
        },
        legend: {
                // data: ['九月份','八月份','七月份'],
          icon: 'circle',
          right: '30',
          itemHeight: 9, // 改变圆圈大小
          textStyle: { // 图例文字的样式
            color: '#666'
          },
          y: '20'
        },
        xAxis: {
          show: false,
          data: that.bizSystemList,
          axisLabel: {
            textStyle: { // 改变刻度字体样式
                color: '#5E6D82'
              }
                // interval: 0,
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
            //     color:'#666',
            //     rotate:30
            //   },
            //   triggerEvent: true
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
            data: that.numberList,
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
            }
          }
        ]
      }),
        myChart.on('click', function(params) {
          that.zuInfo.bizSystem = params.name
          that.$router.push({
            path: '/resource/iframe/list',
            query: {
              parentParams: {
                idcType: that.zuInfo.idcType,
                department1: that.zuInfo.department1,
                department2: that.zuInfo.department2,
                bizSystem: that.zuInfo.bizSystem
              }
            }
          })
        })
    },

    drawPie() {
      let that = this
            // 基于准备好的dom，初始化echarts实例
      let myPie = echarts.init(document.getElementById('myAnnular'))
      myPie.off('click')
            // 绘制图表
      myPie.setOption({
                // 如果下列没有设置颜色，则从列表中依次取值
        color: ['#5B94FF', '#1DDCEE', '#FFDF61', '#F8475C', '#FF862D', '#4FFF57', '#DFFF70', '#FFE823', '#607FF1',
          '#305BFF', '#0DA8FF', '#FFBC07', '#DD0F2C', '#FF6600', '#18DAAA', '#31D550', '#AFF800', '#1C56D9'], // 配置颜色
        tooltip: {
                    // 提示事件类型和格式
          trigger: 'item',
          formatter: '{b} <br/>业务系统数: {c} ({d}%)'
        },
        title: {
          text: that.zuInfo.department1,
          subtext: that.Total,
          width: 300,
          textStyle: {
            color: 'blue',
            fontSize: 12,
            width: 300,
            textAlign: 'center'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#ff9d19',
            textAlign: 'center'
          },
          x: 'center',
          y: '38%'
        },
        legend: {
          type: 'scroll', // 设置legend滚动轴的出现
          orient: 'vertical', // horizontal
          x: '65%',
          icon: 'circle',
          right: 0,
          itemHeight: 9, // 改变圆圈大小
          textStyle: { // 图例文字的样式
            color: '#666666'
          },
          align: 'left', // icon 在文字的位置
          y: 'center'
        },
        grid: {
          top: '0',
          left: '3%',
          right: '10%',
          bottom: '30',
          containLabel: true
        },
        series: [
          {
            name: that.zuInfo.department1,
            type: 'pie',
            radius: ['50%', '70%'],
                        // center:['30%','50%'],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: 'inner',
              normal: {
                  show: false,
                  position: 'inner' // 配合show: false,隐藏掉指示线
                }
            },

            emphasis: {
              label: {
                  show: false
                }
            },
            labelLine: {
              normal: {
                  show: true,
                  color: '#666' // 指示线颜色
                }
            },
            data: that.Zu2
          }
        ]

      }),

            myPie.on('click', function(params) {
              that.zuInfo.department2 = params.name === '未知' ? '' : params.name
              that.getCountByIdcDep2Biz()
            })
    }
  }
}
</script>
<style lang="scss" scoped>

@import "./rem";
.detailsColumn {
    position:relative;
    width:100%;
    height:100%;
    .titleContent {
        overflow: hidden;
    }
    .equipmentPieTitle {
        position:relative;
        line-height:rem(48);
        height:rem(48);
        padding-left:10px;
        color:#273437;
        font-weight:400;
        font-size:rem(16);
        background:#f5f8f8;
        font-weight:bold;
        border-radius: 6px 6px 0 0;
        div {
            display:inline-block;
        }
        div:nth-child(2) img {
            position:absolute;
            cursor: pointer;
            top:rem(15);
            left:rem(350);
            width:rem(22);
            height:rem(17);
        }
    }
    .column {
        float:left;
        height:calc(100% - 42px);
        width:calc(65.5% - 1px)
    }
    .line {
        position:absolute;
        height:65%;
        width:1px;
        float:left;
        border-left:solid 1px #ccc;
        top:0;
        bottom:0;
        left:34.5%;
        margin:auto;
    }
    .title {
            position:absolute;
            left:36.5%;;
            top:rem(58);

    }
    .myDetailsColumnSubordinate {
        div {
            width:100%;
            canvas {
                width:100%;
            }
        }
    }
}
</style>
