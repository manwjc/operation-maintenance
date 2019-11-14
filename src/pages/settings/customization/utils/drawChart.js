// 绘制图表不再使用此方法（后面删掉），请参考告警首页使用公共图表方法

import echarts from 'echarts'
export default {
  // 图表
  data() {
      return {
          chartNodeMap: {},
          chartNodeList: [],
          chartData: []
        }
    },
  methods: {
    // 图表resize
      handleChartResize() {
          window.addEventListener('resize', this.chartResize)
        },
      clearChartResize() {
          window.removeEventListener('resize', this.chartResize)
      // console.log('clearChart',)
        },
      chartResize() {
          Object.keys(this.chartNodeMap).forEach(item => {
            if (this.chartNodeMap[item]) {
          // echart resize
              this.chartNodeMap[item].resize()
            }
          })
        },
    // 绘制图表
      drawChart() {
          this.$nextTick(() => {
            this.chartData.forEach((item, index) => {
              item.chartList.forEach((subItem, subIndex) => {
                let myChart = echarts.init(document.getElementById(subItem.id))
            // myChart.resize();
                myChart.clear()
                myChart.setOption(this.getOption(subItem), true)
              })
            })
          })
        },

    /** 获得图表配置
     * params:optionObj.chartOption --图表类型
     * params:optionObj.chartDatas --数据集
     *  */
      getOption(optionObj) {
          let type = optionObj.chartOption
          let datas = optionObj.chartDatas
          let option = this[type](datas)
          return option
        },

    // 柱状图：告警数
      barAlert(datas) {
          let option = {
            textStyle: {
              color: '#666',
              fontSize: 14
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: 40,
              right: 30,
              top: 40,
              bottom: 10,
              containLabel: true
            },
            xAxis: {
              data: datas.deviceClass && datas.deviceClass.length > 0 ? datas.deviceClass : ['暂无数据'],
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#C1C6CC'
                }
              }
            },
            yAxis: [{
              name: '设备数量',
              nameTextStyle: {
                fontSize: 12,
                padding: [0, 62, 0, 0]
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dotted'
                }
              }
            },
            {
              name: '告警数',
              nameTextStyle: {
                fontSize: 12,
                padding: [0, 0, 0, 50]
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true
              },
              splitLine: {
                show: false
              }
            }
            ],
            series: [{
              name: '设备数量',
              type: 'bar',
              itemStyle: {
              // barBorderRadius: [6, 6, 0, 0],
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#5B94FF' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#305BFF' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }
              },
              barWidth: 15,
              data: datas.sum && datas.sum.length > 0 ? datas.sum : [0]
            },
            {
              name: '严重',
              type: 'bar',
              yAxisIndex: 1,
              stack: 'alert',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#F8475C' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#DD0F2C' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }
              },
              barWidth: 15,
              data: datas.serious && datas.serious.length > 0 ? datas.serious : [0]
            },
            {
              name: '高',
              type: 'bar',
              yAxisIndex: 1,
              stack: 'alert',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#FF862D' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FF6600' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }
              },
              barWidth: 15,
              data: datas.high && datas.high.length > 0 ? datas.high : [0]
            },
            {
              name: '中',
              type: 'bar',
              yAxisIndex: 1,
              stack: 'alert',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#FFDF61' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFBC07' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }
              },
              barWidth: 15,
              data: datas.medium && datas.medium.length > 0 ? datas.medium : [0]
            },
            {
              name: '低',
              type: 'bar',
              stack: 'alert',
              itemStyle: {
              // barBorderRadius: [6, 6, 0, 0],
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#1CCBF0' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0DA8FF' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }
              },
              barWidth: 15,
              data: datas.low && datas.low.length > 0 ? datas.low : [0]
            }
            ]
          }
          return option
        },

    // 饼图：工单分布
      pieDistribute(datas = []) {
      // 数据为空处理
          if (datas.length < 1) {
            datas = [{
              name: '暂无数据',
              value: 0
            }]
          }
          let option = {
            textStyle: {
              color: '#666',
              fontSize: 12
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}\n{d}%'
            },
            series: [{
              name: '工单分布',
              type: 'pie',
              radius: ['35%', '60%'],
              label: {
                formatter: '{b}\n{d}%'
              },
              itemStyle: {
                color(param) {
              // 调色盘
                  let colorList = [
                ['#4AA9FA', '#1F7BDA'],
                ['#1DDCEE', '#0DA8FF'],
                ['#3CFFB3', '#18DAAA'],
                ['#4FFF57', '#31D550'],
                ['#DFFF70', '#AFF800'],
                ['#FFE823', '#F4C22B'],
                ['#607FF1', '#1C56D9']
                  ]
                  let selfColor = {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0,
                      color: '#1F7BDA' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#4AA9FA' // 100% 处的颜色
                    }
                    ],
                    global: false // 缺省为 false
                  }

                  if (param.data.name === '暂无数据') {
                    selfColor.colorStops = [{
                      offset: 0,
                      color: '#E6E6E6' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#E6E6E6' // 100% 处的颜色
                    }
                    ]
                  } else if (colorList[param.dataIndex]) {
                  selfColor.colorStops = [{
                    offset: 0,
                    color: colorList[param.dataIndex][0] // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: colorList[param.dataIndex][1] // 100% 处的颜色
                  }
                  ]
                }
                  return selfColor
                }

              },
              data: datas
            }]
          }

          return option
        },

    // 线图：工单趋势
      lineTrend(datas = {}) {
          let option = {
            color: ['#17C8AD', '#00c6ff', '#876EFF'],
            textStyle: {
              color: '#666',
              fontSize: 12
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              top: 0,
              right: 0,
              icon: 'rect',
              itemWidth: 24,
              itemHeight: 3,
              data: ['总数', '完成数', '逾期数']
            },
            grid: {
              top: 30,
              left: '3%',
              right: '4%',
              bottom: 0,
              containLabel: true
            },
            xAxis: {
              type: 'category',
              axisLabel: {
                rotate: 30
              },
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#C1C6CC'
                }
              },
          // data: ['2019-02-14', '2019-02-15', '2019-02-16', '2019-02-17', '2019-02-18', '2019-02-19', '2019-02-20']
              data: datas.dateStrs ? datas.dateStrs : ['暂无数据']
            },
            yAxis: {
              type: 'value',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dotted'
                }
              }
            },
            series: [{
              name: '总数',
              type: 'line',
              smooth: true,
              showSymbol: false,
              lineStyle: {
                width: 4,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#18DAAA' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#3CFFB3' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }

              },
            // data: [310, 320, 330, 350, 360, 370, 450]
              data: datas.alls ? datas.alls : [0]
            },
            {
              name: '完成数',
              type: 'line',
              smooth: true,
              showSymbol: false,
              lineStyle: {
                width: 4,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#0DA8FF' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#1DDCEE' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                },
                shadowOffsetY: 4,
                shadowColor: '#F3FCFD',
                shadowBlur: 8
              },
              data: datas.ends
            },
            {
              name: '逾期数',
              type: 'line',
              smooth: true,
              showSymbol: false,
              lineStyle: {
                width: 4,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#4440DF' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#647EFF' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }
              },
              data: datas.overdues
            }
            ]
          }

          return option
        },

    // 圆环：设备利用率
      pieUse(datas = []) {
      // //计算
      // datas = [{
      //   value: 310,
      //   name: '虚拟机'
      // }, {
      //   value: 335,
      //   name: '物理机'
      // }];

      // 数据为空处理
          if (datas.length < 1) {
            datas = [{
              name: '暂无数据',
              value: 0
            }]
          }

      // 求和
          let total = datas.reduce((prev, cur) => {
            return parseInt(prev) + parseInt(cur.value)
          }, 0)

      // 数据过多处理（也可其他处理）
          datas.forEach((item, index) => {
            let valueInt = parseInt(item.value)
            if (valueInt > 9999) {
              item.valueFilter = (valueInt / 10000).toFixed(1) + '万+'
            } else if (valueInt > 999) {
            item.valueFilter = (valueInt / 1000).toFixed(1) + '千+'
          } else {
            item.valueFilter = item.value
          }
          })

          if (total > 9999) {
            total = (total / 10000).toFixed(1) + '万+'
          }

          let option = {
            color: ['#0089d9', '#46BAFE'],
            textStyle: {
              color: '#666',
              fontSize: 12
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}:{d}%'
            },
            legend: {
              orient: 'vertical',
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
          // left: 10,
          // right: '2%',
              top: '70%',
          // bottom: '10%',
          // width: '50%',
          // height: 70,
          // x: 'center',
          // y: '80%',
          // textStyle: {
          //   fontSize: 12,
          // },
              data: ['虚拟机', '物理机'],
              formatter: function(param) {
                let index = 0
                datas.forEach(function(item, i) {
                  if (item.name === param) {
                    index = i
                  }
                })
                return '{legendName|' + param + '}{legendTotal|' + datas[index].valueFilter + '}{legendCell|台}'
              },
              textStyle: {
                rich: {
                  legendName: {
                    color: '#666',
                    fontSize: 12
                  },
                  legendTotal: {
                    color: '#46BAFE',
                    fontSize: 12
                  }
                }
              }

            },
            series: [{
              center: ['50%', '38%'],
              name: '访问来源',
              type: 'pie',
              radius: ['45%', '62%'],
              label: {
                show: true,
                position: 'center',
                formatter: function(param) {
              //   return `服务器\n${total}台`
                  return '{labelname|服务器\n}{labelTotal|' + total + '\n}{labelCell|台}'
                },
                rich: {
                  labelname: {
                    color: '#666',
                    fontSize: 16
                  },
                  labelTotal: {
                    color: '#46BAFE',
                    fontSize: 20
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              itemStyle: {
                color(param) {
                  let selfColor = {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0,
                      color: '#1C56D9' // 0% 处的颜色
                    }, {
                    offset: 1,
                    color: '#607FF1' // 100% 处的颜色
                  }],
                    global: false // 缺省为 false
                  }
                  if (param.data.name === '暂无数据') {
                    selfColor.colorStops = [{
                      offset: 0,
                      color: '#E6E6E6' // 0% 处的颜色
                    }, {
                    offset: 1,
                    color: '#E6E6E6' // 100% 处的颜色
                  }]
                  } else if (param.dataIndex === 1) {
                  selfColor.colorStops = [{
                    offset: 0,
                    color: '#1DDCEE' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#0DA8FF' // 100% 处的颜色
                  }]
                }
                  return selfColor
                }

              },
              data: datas
            }]
          }

          return option
        },

    // 仪表盘：设备利用率
      gaugeUse(datas = []) {
      /* datas = [{
        value: 80, //百分比
        total: 256, //总数
        average: 56, //平均百分比
        cell: 'TB', //单位
        name: '块存储',
      }]; */
      // 数据过多处理（也可其他处理）
          if (datas[0]) {
            let totalFloat = parseFloat(datas[0].total)
            if (totalFloat > 999) {
              datas[0].total = (totalFloat / 1000).toFixed(1) + 'k'
            }
          }

          let option = {
            textStyle: {
              color: '#666',
              fontSize: 14
            },
            tooltip: {
              formatter: '{b}：{c}%(最大利用率)'
            },
            series: [{
              name: 'datas[0].name',
              type: 'gauge',
              radius: '58%',
              center: ['50%', '36%'],
              axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                  color: [
                    [datas[0].value / 100, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ // 右/下/左/上
                      offset: 0,
                      color: '#186FFF'
                    },
                    {
                      offset: 1,
                      color: '#3EAAF6'
                    }
                    ])],
                [1, '#E6E6E6']
                  ],

                  width: 14
                }
              },
              axisLabel: {
                show: false
              },
              startAngle: 215,
              endAngle: -35,
              pointer: {
                width: 3,
                length: '75%'
              },
              splitNumber: 5,
              splitLine: {
                length: 14,
                lineStyle: {
                  width: 1
                }
              },
              itemStyle: {
                color: '#667C92'
              },
              markPoint: {
                symbol: 'circle',
                symbolSize: 10,
                data: [{
                  x: 'center',
                  y: '36%',
                  itemStyle: {
                    color: '#FFF'
                  }
                }],
                itemStyle: {
                  borderWidth: 2,
                  borderColor: '#667C92'
                }
              },
              title: {
                show: false,
                offsetCenter: [0, '30%']
              },
              detail: {
                show: true,
                color: '#666',
                fontSize: 12,
            // offsetCenter: [0, '80%'],
            // formatter: '{value}%',
                formatter: (param) => {
                  return '{detailName|' + datas[0].name + '\n}{detailNum|' + datas[0].total + '}{detailCell|' +
                datas[0].cell + '}{maxUseName|\n最大利用率\n}{maxUseNum|' +
                datas[0].value + '}{cell|%}{averageName|\n平均}{averageNum|' +
                datas[0].average + '}{cell|%}'
                },
                height: 140,
                rich: {
                  detailNum: {
                    color: '#1974EF',
                    fontSize: 20,
                    verticalAlign: 'bottom'
                  },
                  detailCell: {
                    fontSize: 10
                  },
                  maxUseName: {
                    padding: [0, 0, 15, 0]
                  },
                  maxUseNum: {
                    color: '#1974EF',
                    fontSize: 20,
                    lineHeight: 28
                  },
                  averageNum: {
                    color: '#1974EF',
                    fontSize: 14
                  }
                },
                offsetCenter: [0, 90]
              },
              data: datas
            }]
          }

          return option
        },

    // 混合图表（线图、柱状图）：工单统计
      barAndlineStatis(datas = {}) {
          let option = {
            textStyle: {
              color: '#666',
              fontSize: 12
            },
            legend: {
              itemWidth: 8,
              itemHeight: 8,
              right: 15,
              icon: 'circle',
              data: ['今日逾期', '今日新增', '今日完成']
            },
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              top: 30,
              left: 28,
              right: 20,
              bottom: 2,
              containLabel: true
            },
            xAxis: {
          // data: ['2019-02-14', '2019-02-15', '2019-02-16', '2019-02-17', '2019-02-18', '2019-02-19', '2019-02-20'],
              data: datas.dateStrs ? datas.dateStrs : ['暂无数据'],
              type: 'category',
              axisLabel: {
                rotate: 30
              },
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#C1C6CC'
                }
              }
            },
            yAxis: [{
              name: '',
            // name: '统计量',
            // offset: 15,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dotted'
                }
              }
            },
            {
              name: '',
            // name: '完成率',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              }
            }
            ],
            series: [{
              name: '完成率',
              type: 'line',

              yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            // smooth: true, //平滑曲线显示
              showSymbol: false,
              showAllSymbol: true, // 显示所有图形。
            // symbol: "circle", //标记的图形为实心圆
            // symbolSize: 10, //标记的大小
              itemStyle: {
              // 折线拐点标志的样式
              // color: "#058cff"
              },
              lineStyle: {
                width: 3,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#FFBC07' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFDF61' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }
              },
              pointer: {
                width: 4
              },
            // data: [0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 0.7, 0.5]
              data: datas.rates ? datas.rates : [0]
            },
            {
              name: '今日逾期',
              type: 'bar',
              stack: 'time',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#5B94FF' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#305BFF' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }
              },
              pointer: {
                width: 4
              },
            // data: [15, 25, 30, 5, 15, 25, 30],
              data: datas.overdues ? datas.overdues : [0]
            },
            {
              name: '今日新增',
              type: 'bar',
              stack: 'time',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#1DDCEE' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0DA8FF' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }
              },
            // data: [16, 25, 30, 5, 16, 25, 30]
              data: datas.alls
            },
            {
              name: '今日完成',
              type: 'bar',
              stack: 'time',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#3CFFB3' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#18DAAA' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }
              },
              barWidth: 20,
              barCategoryGap: '0',
            // data: [17, 25, 30, 5, 17, 25, 30]
              data: datas.ends
            },
            {
              name: '合计最大值', // 灰色背景
              type: 'bar',
              barGap: '-100%',
            // 这是合计最大值（值相同，保证灰色背景同等高度）
            // data:  datas.totals,
              data: datas.maxs,
              itemStyle: {
                color: '#F4F6F9'
              },
              barWidth: 20,
              zlevel: -1
            }
            ]
          }

          return option
        }

    }

}
