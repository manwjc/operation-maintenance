<template>
    <div class="poolTypeColumn">
        <div class="tenantTypeColumnTitle">资源池设备类型分布</div>
        <div id="myChartpoolTypeColumn" style="width:100%;height:100%;"></div>
    </div>
</template>

<script>

import echarts from 'echarts'

import PoolBus from './middleKey/poolBus'
import iframe from 'src/services/iframe/iframe.js'

export default {
  data() {
      return {
          sendAnnular: true,

          Port: {
              IdcType: [], // 资源池名字
              NetworkNumber: [], // 网络设备
              PhyNumber: [], // 物理机
              SafeNumber: [], // 安全设备
              StorageNumber: [], // 存储设备
              Total: [], // 总数
              VmNumber: [] // 虚拟机
            }
        }
    },
  components: {
    },
  mounted() {
    },
  created() {
      this.getCountByIdcDevCT()
    },
  methods: {
      resetData() {
        this.Port = {
          IdcType: [], // 资源池名字
          NetworkNumber: [], // 网络设备
          PhyNumber: [], // 物理机
          SafeNumber: [], // 安全设备
          StorageNumber: [], // 存储设备
          Total: [], // 总数
          VmNumber: [] // 虚拟机
        }
      },
      getCountByIdcDevCT() {
          iframe.getCountByIdcDevCT().then((res) => {
              this.resetData()
              res.forEach(item => {
                this.Port.NetworkNumber.push(item.networkNumber)
                this.Port.PhyNumber.push(item.phyNumber)
                this.Port.SafeNumber.push(item.safeNumber)
                this.Port.StorageNumber.push(item.storageNumber)
                this.Port.VmNumber.push(item.vmNumber)
                this.Port.IdcType.push(item.idcType)
              })
              this.echartsTypeColumn()
            })
        },
      echartsTypeColumn() {
          let that = this
          let myChart = echarts.init(document.getElementById('myChartpoolTypeColumn'))
            myChart.setOption({
              title: {
                  text: ''
                },
              tooltip: {},
              grid: {
                  top: '60',
                  bottom: '30',
                  right: '30',
                  left: '70'
                },
              legend: {
                  data: ['物理服务器', '虚拟服务器', '网络', '安全', '存储'],
                  icon: 'circle',
                  right: '20',
                  itemHeight: 9, // 改变圆圈大小
                  textStyle: { // 图例文字的样式
                      color: '#666666'
                    },
                  y: '10'
                },
              xAxis: {
                  data: that.Port.IdcType,
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
              series: [{
                  name: '物理服务器',
                  type: 'bar',
                  data: that.Port.PhyNumber,
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
                }, {
                  name: '虚拟服务器',
                  type: 'bar',
                  data: that.Port.VmNumber,
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
                                  offset: 1, color: '#0DA8FF' // 0% 处的颜色
                                }, {
                                  offset: 0, color: '#1DDCEE' // 100% 处的颜色
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
                },
                {
                  name: '网络',
                  type: 'bar',
                  barWidth: 15, // 柱图宽度
                  label: {
                      normal: {
                          show: false,
                          position: ''
                        }
                    },
                  itemStyle: {
                      normal: {
                          color: {
                              type: 'linear',
                              x: 0,
                              y: 0,
                              x2: 0,
                              y2: 1,
                              colorStops: [{
                                  offset: 1, color: '#18DAAA' // 0% 处的颜色
                                }, {
                                  offset: 0, color: '#3CFFB3' // 100% 处的颜色
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
                  data: that.Port.NetworkNumber
                },
                {
                  name: '安全',
                  type: 'bar',
                  barWidth: 15, // 柱图宽度
                  label: {
                      normal: {
                          show: false,
                          position: ''
                        }
                    },
                  itemStyle: {
                      normal: {
                          color: {
                              type: 'linear',
                              x: 0,
                              y: 0,
                              x2: 0,
                              y2: 1,
                              colorStops: [{
                                  offset: 1, color: '#FFBC07' // 0% 处的颜色
                                }, {
                                  offset: 0, color: '#FFDF61' // 100% 处的颜色
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
                  data: that.Port.SafeNumber
                },
                {
                  name: '存储',
                  type: 'bar',
                  barWidth: 15, // 柱图宽度
                  label: {
                      normal: {
                          show: false,
                          position: ''
                        }
                    },
                  itemStyle: {
                      normal: {
                          color: {
                              type: 'linear',
                              x: 0,
                              y: 0,
                              x2: 0,
                              y2: 1,
                              colorStops: [{
                                  offset: 1, color: '#FF6600' // 0% 处的颜色
                                }, {
                                  offset: 0, color: '#FF862D' // 100% 处的颜色
                                }]
                                // barBorderRadius:[5, 5, 0, 0], // 柱状图圆角设置
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
                  data: that.Port.StorageNumber
                }
                ]
            }),
            myChart.on('click', function(params) {
                // PoolBus.$emit('txt1',that.sendAnnular);
            })
        }
    }
}
</script>
<style lang="stylus">
.poolTypeColumn {
    position relative;
    width:100%;
    height:100%;
    .tenantTypeColumnTitle {
        position:absolute;
        line-height:30px;
        left:40px;
        top:10px;
    }
    .myChartpoolTypeColumn {
        div {
            width:100%;
            canvas {
                width:100%;
            }
        }
    }
}
</style>
