
<template>
    <div class="detailsColumn">
        <div class="titleContent">
             <!-- <div class="tenantTypeColumnTitle">资源池第二级柱子</div> -->
            <div class="poolTenantAnnularBotton">
            </div>
        </div>
        <div ref="bar" id="eqAnColumn0" style="width:100%;height:100%;"></div>
    </div>
</template>

<script>

import iframe from 'src/services/iframe/iframe.js'
import echarts from 'echarts'

import Bus0 from './middleKey/bus0'
import ZYBus2 from './middleKey/ZYBus2'

export default {
  props: ['deviceInfo'],
  data() {
      return {
          p1: true,
          p2: false,
          p3: false,

          sendAnnular0: true,
          NameList: [],
          Device_type: [],
          deviceClass: ['安全设备', '网络设备', '存储设备'],
          deviceType: ['物理机', '虚拟机'],
          colors: [
            ['#5B94FF', '#305BFF'],
            ['#1DDCEE', '#0DA8FF'],
            ['#FFDF61', '#FFBC07'],
            ['#F8475C', '#DD0F2C'],
            ['#FF862D', '#FF6600'],
            ['#3CFFB3', '#18DAAA'],
            ['#4FFF57', '#31D550'],
            ['#DFFF70', '#AFF800'],
            ['#FFE823', '#F4C22B'],
            ['#607FF1', '#1C56D9']
          ], // 配置颜色
          columnChart: {},
          xList: [],
          legendList: [],
          seriesList: [],
          seriesData: {
            name: '',
            type: 'bar',
            data: null,
            barWidth: 13, // 柱图宽度
            // barGap: 10 // 柱子间距,
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
        }
    },
  components: {
    },
  mounted() {
    },
  created() {

    },
  methods: {
      getCountByIdcPro() {
        let data = {
          idcType: this.deviceInfo.idcType
        }
        iframe.getCountByIdcPro(data).then((res) => {
          this.columnChart = {}
          this.xList = []
          this.legendList = []
          res.forEach(item => {
            for (let key in item) {
              if (key === '') {
                key = '未知'
                item[key] = item['']
              }
              if (key === 'device_type') {
                this.xList.push(item[key])
              } else {
                if (this.columnChart[key]) {
                  this.columnChart[key].push(item[key])
                } else {
                  this.legendList.push(key)
                  this.columnChart[key] = []
                  this.columnChart[key].push(item[key])
                }
              }
            }
          })
          this.seriesList = []
          this.legendList.forEach((item, index) => {
            let series = JSON.parse(JSON.stringify(this.seriesData))
            series.name = item
            series.data = this.columnChart[item]
            series.itemStyle.normal.color.colorStops[1].color = this.colors[index][0]
            series.itemStyle.normal.color.colorStops[0].color = this.colors[index][1]
            this.seriesList.push(
              series
            )
          })
          setTimeout(() => {
              this.echartsTypeColumn()
            }, 1000)
        })
        //   this.cloumn2Object.device_type = []
        //   this.cloumn2Object.NameList = []
        //   this.cloumn2Object.numberlist = []
        //   for(let item in res) {
        //     this.cloumn2Object.device_type.push(res[item].device_type)
        //     this.cloumn2Object.NameList = Object.keys(res[item])
        //     this.cloumn2Object.numberlist = Object.values(res[item])
        //
        //     for(var i = 0; i < this.cloumn2Object.numberlist.length; i++){
        //       if(this.cloumn2Object.numberlist[i] == '存储设备' || this.cloumn2Object.NameList[i] == "安全设备" || this.cloumn2Object.NameList[i] == "物理机" || this.cloumn2Object.NameList[i] == "网络设备" || this.cloumn2Object.NameList[i] == "虚拟机"){
        //         this.cloumn2Object.numberlist.splice(i,1)
        //         i = i-1
        //       }
        //     }
        //     for(var i = 0; i < this.cloumn2Object.NameList.length; i++){
        //       if(this.cloumn2Object.NameList[i] == '' || this.cloumn2Object.NameList[i] == "device_type"){
        //         this.cloumn2Object.NameList.splice(i,1)
        //         i = i-1
        //       }
        //     }
        //   }
        //   console.log('=====ddddddd', this.cloumn2Object.NameList)
        //   console.log('=====wwwwww', this.cloumn2Object.device_type)
        // })
        //
        // console.log('xxxccc', this.cloumn2Object.device_type)
      },
      echartsTypeColumn() {
          let that = this
          let myChart = echarts.init(document.getElementById('eqAnColumn0'))
            myChart.clear()
          myChart.setOption({
              title: {
                  text: ''
                },
              tooltip: {},
              grid: {
                  top: '50',
                  bottom: '30',
                  right: '30',
                  left: '70'
                },
              legend: {
                  data: that.legendList,
                  icon: 'circle',
                  right: '20',
                  itemHeight: 9, // 改变圆圈大小
                  textStyle: { // 图例文字的样式
                      color: '#666666'
                    },
                  y: '0'
                },
              xAxis: {
                  data: that.xList,
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
                },
              yAxis: {
                    // name:'设备数',
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
              series: this.seriesList
                  // [
                //   {
                //     name: that.legendList[0],
                //     type: 'bar',
                //     data: that.columnChart[that.legendList[0]],
                //     barWidth : 15,//柱图宽度
                //     itemStyle: {
                //         normal: {
                //             color: {
                //                 type: 'linear',
                //                 x: 0,
                //                 y: 0,
                //                 x2: 0,
                //                 y2: 1,
                //                 colorStops: [{
                //                     offset: 1, color: '#305BFF' // 0% 处的颜色
                //                 }, {
                //                     offset: 0, color: '#5B94FF' // 100% 处的颜色
                //                 }],
                //             },
                //             label: {
                //                 show: false, //开启显示
                //                 position: '', //在上方显示
                //                 textStyle: { //数值样式
                //                     color: '#fff',
                //                     fontSize: 12,
                //                 }
                //             },
                //         }
                //     }
                // },{
                //     name: that.legendList[1],
                //     type: 'bar',
                //     // data: ['100','100','100','180','100','100'],
                //     barWidth : 15,//柱图宽度
                //     itemStyle: {
                //         normal: {
                //             color: {
                //                 type: 'linear',
                //                 x: 0,
                //                 y: 0,
                //                 x2: 0,
                //                 y2: 1,
                //                 colorStops: [{
                //                     offset: 1, color: '#0DA8FF' // 0% 处的颜色
                //                 }, {
                //                     offset: 0, color: '#1DDCEE' // 100% 处的颜色
                //                 }],
                //             },
                //             label: {
                //                 show: false, //开启显示
                //                 position: '', //在上方显示
                //                 textStyle: { //数值样式
                //                     color: '#fff',
                //                     fontSize: 12,
                //                 }
                //             },
                //         }
                //     }
                // },
                // {
                //     name: that.legendList[3],
                //     type: 'bar',
                //     barWidth : 15,//柱图宽度
                //     label: {
                //         normal: {
                //             show: false,
                //             position: ''
                //         }
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: {
                //                 type: 'linear',
                //                 x: 0,
                //                 y: 0,
                //                 x2: 0,
                //                 y2: 1,
                //                 colorStops: [{
                //                     offset: 1, color: '#18DAAA' // 0% 处的颜色
                //                 }, {
                //                     offset: 0, color: '#3CFFB3' // 100% 处的颜色
                //                 }],
                //             },
                //             label: {
                //                 show: false, //开启显示
                //                 position: '', //在上方显示
                //                 textStyle: { //数值样式
                //                     color: '#fff',
                //                     fontSize: 12,
                //                 }
                //             },
                //         }
                //     },
                //     // data: ['100','140','100','100','170','200'],
                // },
                // {
                //     name: that.legendList[4],
                //     type: 'bar',
                //     barWidth : 15,//柱图宽度
                //     label: {
                //         normal: {
                //             show: false,
                //             position: ''
                //         }
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: {
                //                 type: 'linear',
                //                 x: 0,
                //                 y: 0,
                //                 x2: 0,
                //                 y2: 1,
                //                 colorStops: [{
                //                     offset: 1, color: '#FFBC07' // 0% 处的颜色
                //                 }, {
                //                     offset: 0, color: '#FFDF61' // 100% 处的颜色
                //                 }],
                //             },
                //             label: {
                //                 show: false, //开启显示
                //                 position: '', //在上方显示
                //                 textStyle: { //数值样式
                //                     color: '#fff',
                //                     fontSize: 12,
                //                 }
                //             },
                //         },
                //     },
                //     // data: ['100','140','100','100','170','200'],
                // },
                // ]
            }),
            myChart.on('click', function(params) {
              console.log('888888sss', params.value)
              that.deviceInfo.projectName = params.seriesName
              that.deviceInfo.deviceType = params.name
              if (that.deviceInfo.idcType === '哈尔滨资源池' || that.deviceInfo.idcType === '呼和浩特资源池') {
                that.$emit('refreshThird')
              } else {
                that.$router.push({
                  path: '/resource/iframe/list',
                  query: {
                    parentParams: {
                      deviceProject: that.deviceInfo.projectName,
                      deviceType: that.deviceType.indexOf(that.deviceInfo.deviceType) > -1 ? that.deviceInfo.deviceType : undefined,
                      deviceClass: that.deviceClass.indexOf(that.deviceInfo.deviceType) > -1 ? that.deviceInfo.deviceType : undefined,
                      idcType: that.deviceInfo.idcType
                    }
                  }
                })
              }
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
    .eqAnColumn0 {
        div {
            width:100%;
            canvas {
                width:100%;
            }
        }
    }
}
</style>
