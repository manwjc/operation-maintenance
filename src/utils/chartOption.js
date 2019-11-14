  /**echarts图表option配置**/
  export default {

    // 饼图
    'pie-option': {
      textStyle: {
        color: '#666',
        fontSize: 12,
      },
      tooltip: {
        trigger: 'item',
        formatter: "{b}\n{d}%"
      },
      series: [{
        name: '工单分布',
        type: 'pie',
        radius: ['35%', '60%'],
        label: {
          formatter: "{b}\n{d}%",
        },
        itemStyle: {
          color(param) {

            //调色盘
            let colorList = [
              ['#4AA9FA', '#1F7BDA'],
              ['#1DDCEE', '#0DA8FF'],
              ['#3CFFB3', '#18DAAA'],
              ['#4FFF57', '#31D550'],
              ['#DFFF70', '#AFF800'],
              ['#FFE823', '#F4C22B'],
              ['#607FF1', '#1C56D9'],
            ];
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
            };

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
            return selfColor;
          }

        },
        data: [{
          value: 0,
          name: '暂无'
        }]
      }]
    },

    //线图
    'line-option': {
      //颜色系列
      color: ['#186FFF', '#31D550', '#FF4800'],
      //图表渐变颜色系列[蓝、绿、红]
      selfColors: [
        [{
            offset: 0,
            color: '#186FFF' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#3EAAF6' // 100% 处的颜色
          }
        ],
        [{
            offset: 0,
            color: '#31D550' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#4FFF57' // 100% 处的颜色
          }
        ],
        [{
            offset: 0,
            color: '#FF4800' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#FF632D' // 100% 处的颜色
          }
        ]
      ],
      textStyle: {
        color: '#666',
        fontSize: 12
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        // show: false,
        top: 0,
        right: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        data: ['名称']
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
          rotate: 30,
        },
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#C1C6CC'
          }
        },
        data: ['暂无数据']
        // data: ['2019-02-14', '2019-02-15', '2019-02-16', '2019-02-17', '2019-02-18', '2019-02-19', '2019-02-20']
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
        name: '名称',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 4,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
                offset: 0,
                color: '#186FFF' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#3EAAF6' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          },

        },
        // data: [310, 320, 330, 350, 360, 370, 450]
        data: [0]
      }]
    },

    // 柱状图
    'bar-option': {
      //颜色系列[蓝、绿、红、紫]
      color: ['#186FFF', '#31D550', '#FF4800', '#832EFA'],
      //蓝色系：渐变颜色系列[黄、绿、浅蓝、蓝]
      blueColors: [
        [{
            offset: 0,
            color: '#84BE29' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#CCFF72' // 100% 处的颜色
          }
        ],
        [{
            offset: 0,
            color: '#02BD6C' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#4BFF9B' // 100% 处的颜色
          }
        ],
        [{
            offset: 0,
            color: '#05A7EA' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#3AEFFF' // 100% 处的颜色
          }
        ],
        [{
            offset: 0,
            color: '#004CD8' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#006CFF' // 100% 处的颜色
          }
        ],
      ],
      //图表渐变颜色系列[蓝、绿、红、紫]
      selfColors: [
        [{
            offset: 0,
            color: '#186FFF' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#3EAAF6' // 100% 处的颜色
          }
        ],
        [{
            offset: 0,
            color: '#31D550' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#4FFF57' // 100% 处的颜色
          }
        ],
        [{
            offset: 0,
            color: '#FF4800' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#FF632D' // 100% 处的颜色
          }
        ],
        [{
            offset: 0,
            color: '#832EFA' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#975FE5' // 100% 处的颜色
          }
        ]
      ],
      textStyle: {
        color: '#9597AB',
        fontSize: 14
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: '{b}<br />{c}'
      },
      legend: {
        // show: false,
        top: 0,
        right: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: '#fff',
        },
        data: ['名称']
      },
      grid: {
        left: 10,
        right: 10,
        top: 40,
        bottom: 10,
        containLabel: true
      },
      // dataZoom: {
      //   type: 'slider',
      //   backgroundColor: 'transparent',
      //   fillerColor: 'red',
      //   borderColor: 'transparent',
      //   handleSize: '200px',
      // },
      xAxis: {
        data: ['暂无数据'],
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#C1C6CC'
          }
        },
        axisLabel: {
          rotate: 20
        }
      },
      yAxis: [{
          name: '名称',
          nameTextStyle: {
            fontSize: 14,
            color: '#fff',
            // align: 'left'
            padding: [0, 0, 0, 10],
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#2d315f',
            }
          }
        },

      ],
      series: [{
        name: '名称',
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 1, //由下至上
            x2: 0,
            y2: 0,
            colorStops: [{
                offset: 0,
                color: '#3377FF' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#80E6FF' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          },
          barBorderRadius: [4, 4, 0, 0]
        },
        barWidth: 20,
        data: [0]
      }, ]
    },
  }
