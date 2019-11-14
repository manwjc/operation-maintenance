export default {
  /** 图表option配置**/

  // 饼图
    'pie-option': {
        textStyle: {
            color: '#666',
            fontSize: 12
        },
        tooltip: {
            trigger: 'item',
      // formatter: '{b}\n{d}%'
            formatter: ''
        },
        series: [{
            name: '工单分布',
            type: 'pie',
            radius: '70%',
            label: {
                formatter: '{b}\n{c} {d}%'
            },
            labelLine: {
                normal: {
                    length: 1,
                    show: true
                }
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
            data: [{
                value: 0,
                name: '暂无'
            }]
        }]
    },

  // 折线线图
    'line-option': {
        color: ['#17C8AD', '#00c6ff', '#876EFF', '#03d9f6'],
        textStyle: {
            color: '#666',
            fontSize: 12
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['服务器', '网络', '安全', '存储'],
            icon: 'circle',
            right: '30',
            itemHeight: 9, // 改变圆圈大小
            textStyle: { // 图例文字的样式
                color: '#666'
            },
            y: '5'
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
            data: ['暂无数据']
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
            name: '服务器',
            type: 'line',
            symbol: '0',
      // stack: '总量', // 默认叠加上一条折线的数据
            smooth: true, // 设置光滑曲线
            symbolSize: 0, // 转折点大小
            itemStyle: {
                normal: {
                    borderColor: '#6178ff', // 边框颜色
                    color: '#6178ff', // 折线上标记点的颜色 和 图例的颜色
                    lineStyle: {
                        width: 3, // 折线图的粗细
                        color: '#6178ff' // 折线的颜色
                    }
                }
            },
            data: []
        }, {
            name: '网络',
            type: 'line',
            smooth: true, // 设置光滑曲线
            symbolSize: 0, // 转折点大小
            itemStyle: {
                normal: {
                    borderColor: '#03d9f6', // 边框颜色
                    color: '#03d9f6', // 折线上标记点的颜色 和 图例的颜色
                    lineStyle: {
                        width: 3, // 折线图的粗细
                        color: '#03d9f6' // 折线的颜色
                    }
                }
            },
            data: []
        }, {
            name: '安全',
            type: 'line',
            smooth: true, // 设置光滑曲线
            symbolSize: 0, // 转折点大小
            itemStyle: {
                normal: {
                    borderColor: '#00ffac', // 边框颜色
                    color: '#00ffac', // 折线上标记点的颜色 和 图例的颜色
                    lineStyle: {
                        width: 3, // 折线图的粗细
                        color: '#00ffac' // 折线的颜色
                    }
                }
            },
            data: []
        }, {
            name: '存储',
            type: 'line',
            smooth: true, // 设置光滑曲线
            symbolSize: 0, // 转折点大小
            itemStyle: {
                normal: {
                    borderColor: '#ffd91f', // 边框颜色
                    color: '#ffd91f', // 折线上标记点的颜色 和 图例的颜色
                    lineStyle: {
                        width: 3, // 折线图的粗细
                        color: '#ffd91f' // 折线的颜色
                    }
                }
            },
            data: []
        }]
    },

  // 柱状图
    'bar-option': {
        textStyle: {
            color: '#666',
            fontSize: 14
        },
        legend: {
            show: true,
            data: [],
            icon: 'circle',
            right: '0',
            itemHeight: 9, // 改变圆圈大小
            textStyle: { // 图例文字的样式
                color: '#666666'
            },
            y: '0'
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
            data: ['暂无数据'],
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
            nameTextStyle: {
                fontSize: 12,
                padding: [0, 0, 0, 0]
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
        }
        ],
        series: [{
            name: '',
            type: 'bar',
            data: [],
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
                    }
                }
            }
        }, {
            name: '',
            type: 'bar',
            data: [],
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
                    }
                }
            }
        },
        {
            name: '',
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
                    }
                }
            },
            data: []
        },
        {
            name: '',
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
                    }
                }
            },
            data: []
        },
        {
            name: '',
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
                    }
                }
            },
            data: []
        }
        ]
    },

  // 租户柱状图单柱子
    'Zbar-option': {
        title: {
            text: ''
        },
        tooltip: {
  // 提示事件类型和格式
            trigger: 'item',
            formatter: '{b} <br/>业务系统数: {c} '
        },
        grid: {
            top: '35',
            left: '40',
            right: '30',
            bottom: '1',
            containLabel: true
        },
        xAxis: {
            show: true,
            data: [],
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
            name: '',
            axisLabel: {
                textStyle: { // 改变刻度字体样式
                    color: '#5E6D82'
                }
            },
            nameTextStyle: {
                fontSize: 12,
                padding: [0, 0, 0, 80]
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
                data: []
            }
        ]
    },

  // 叠加的柱子
    'trenantBar-option': {
        textStyle: {
            color: '#666',
            fontSize: 14
        },
        legend: {
            show: true,
            data: [],
            icon: 'circle',
            right: '0',
            itemHeight: 9, // 改变圆圈大小
            textStyle: { // 图例文字的样式
                color: '#666666'
            },
            y: '0'
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
            data: ['暂无数据'],
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
            minInterval: 1,
            name: '',
            nameTextStyle: {
                fontSize: 12,
                padding: [0, 0, 0, 0]
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
        }],
        series: [
            {
                name: '服务器',
                type: 'bar',
                stack: '总量',
                data: [],
                barWidth: 15, // 柱图宽度
                itemStyle: {
                    normal: {
                        color: '#3464fd',
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
                stack: '总量',
                label: {
                    normal: {
                        show: false,
                        position: ''
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#00b7fe'
                    }
                },
                data: []
            },
            {
                name: '安全',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: false,
                        position: ''
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#00eda8'
                    }
                },
                data: []
            },
            {
                name: '存储',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: false,
                        position: ''
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#fec300'
            // barBorderRadius:[5, 5, 0, 0], // 柱状图圆角设置
                    }
                },
                data: []
            }
        ]

    },

  // 设备子类型环形图
    'ring-option': {
        title: {
            text: '',
            subtext: '',
            textStyle: {
                color: 'blue',
                fontSize: 14
            },
            subtextStyle: {
                fontSize: 18,
                color: ['#ff9d19']
            },
            x: 'center',
            y: '40%'
        },
        color: ['#5B94FF', '#1DDCEE', '#FFDF61', '#F8475C', '#FF862D', '#4FFF57', '#DFFF70', '#FFE823', '#607FF1',
            '#305BFF', '#0DA8FF', '#FFBC07', '#DD0F2C', '#FF6600', '#18DAAA', '#31D550', '#AFF800', '#1C56D9'], // 配置颜色
        tooltip: {
      // 提示事件类型和格式
            trigger: 'item',
            formatter: '{b} <br/>设备数量:{c} ({d}%)'
        },
        legend: {
            show: false,
            type: 'scroll',
            orient: 'vertical', // horizontal vertical
            x: '70%',
            icon: 'circle',
            right: 0,
            itemHeight: 9, // 改变圆圈大小
            textStyle: { // 图例文字的样式
                color: '#666666'
            },
            align: 'left', // icon 在文字的位置
            y: 'center',
            height: '40'
        },
        grid: {
            top: '30',
            left: '3%',
            right: '10%',
            bottom: '30',
            containLabel: true
        },
        series: [
            {
                name: '设备类型',
                type: 'pie',
                radius: ['50%', '70%'],
          // center:['30%','50%'],
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        formatter: '{b}\n{c} {d}%',
                        show: false
                  // position: 'center',
                    }
                },
                emphasis: {
                    label: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        length: 1,
                        show: false,
                        color: '#666' // 指示线颜色
                    }
                },
                data: []
            }
        ]
    },

// 各一级租户新增设备量趋势分布TOP5
    'TOPbar-option': {
        textStyle: {
            color: '#666',
            fontSize: 14
        },
        legend: {
            show: true,
            data: [],
            icon: 'circle',
            right: '0',
            itemHeight: 9, // 改变圆圈大小
            textStyle: { // 图例文字的样式
                color: '#666666'
            },
            y: '0'
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
            data: ['暂无数据'],
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
            minInterval: 1,
            name: '',
            nameTextStyle: {
                fontSize: 12,
                padding: [0, 0, 0, 0]
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
        }],
        series: [{
            name: '',
            type: 'bar',
            data: [],
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
                    }
                }
            }
        }, {
            name: '',
            type: 'bar',
            data: [],
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
                    }
                }
            }
        },
        {
            name: '',
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
                    }
                }
            },
            data: []
        }
        ]
    }
}
