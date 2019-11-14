
<template>
    <div class="detailsColumn">
        <div class="titleContent">
            <div class="tenantTypeColumnTitle">{{deviceInfo.projectName}}POD池分布</div>
            <div class="poolTenantAnnularBotton">
            </div>
        </div>
        <div id="eqAnColumn" style="width:100%;height:100%;"></div>
    </div>
</template>

<script>


import echarts from 'echarts'
import iframe from 'src/services/iframe/iframe.js'


import Bus from './middleKey/bus'
import ZYBus3 from './middleKey/ZYBus3'

export default {
  props: ['deviceInfo'],
    data() {
        return {
          podList: [],
          podData: [],
          deviceClass: ['安全设备', '网络设备', '存储设备'],
          deviceType: ['物理机', '虚拟机']
        }
    },
    components: {
    },
    mounted() {
        this.getCountByIdcDevPro()
    },
    created() {
    },
    methods: {
      getCountByIdcDevPro () {
        let data = {
          idcType: this.deviceInfo.idcType,
          deviceType: this.deviceInfo.deviceType,
          projectName: this.deviceInfo.projectName
        }
        iframe.getCountByIdcDevPro(data).then((res) => {
          this.podList = []
          this.podData = []
          res.forEach(item => {
            this.podList.push(item.pod_name)
            this.podData.push(item.number)
          })
            this.echartsTypeColumn()
        })
      },
        echartsTypeColumn() {
            let that = this
            let myChart = echarts.init(document.getElementById('eqAnColumn'));
            myChart.setOption({
                title: {
                    text: ''
                },
                tooltip: {
                  // 提示事件类型和格式
                  trigger: 'item',
                  formatter: "{b} <br/>设备数: {c}"
                },
                grid: {
                    top:'55',
                    left: '40',
                    right: '30',
                    bottom: '10',
                    containLabel: true
                },
                // legend: {
                //     // data: that.podList,
                //     icon: "circle",
                //     right: '20',
                //     itemHeight  :9,//改变圆圈大小
                //     textStyle: { //图例文字的样式
                //         color: '#666'
                //     },
                //     y: '10',
                // },
                xAxis: {
                        data: that.podList,
                        axisLabel : {
                            textStyle: { //改变刻度字体样式
                                color: '#5E6D82'
                            }
                        },
                        axisLine: {
                            show:true,
                            lineStyle: {
                                color:'#E5E8ED',
                                width: 1
                            }
                        },
                        axisTick: {
                            show:false
                        }
                },
                yAxis: {
                    minInterval: 1,
                    type: 'value',
                    axisLabel : {
                        textStyle: { //改变刻度字体样式
                            color: '#5E6D82'
                        }
                    },
                    splitLine :{    //网格线
                        lineStyle:{
                            type: 'dashed'    //设置网格线类型 dotted：虚线   solid:实线
                        },
                        show:true //隐藏或显示
                    },
                    axisLine: {
                        show:false
                    },
                    axisTick: {
                        show:false
                    }
                },
                series: [
                    {
                    name: '',
                    type: 'bar',
                    // data: ['10','100','10','10','100','100'],
                    data: that.podData,
                    barWidth : 15,//柱图宽度
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
                                }],
                            },
                            label: {
                                show: false, //开启显示
                                position: '', //在上方显示
                                textStyle: { //数值样式
                                    color: '#fff',
                                    fontSize: 12,
                                }
                            },
                        }
                    }
                }
                ]
            }),
            myChart.on('click', function (params) {
              that.deviceInfo.pod = params.name
              that.$router.push({
                path: "/resource/iframe/list",
                query: {
                  parentParams: {
                    deviceProject: that.deviceInfo.projectName,
                    pod: that.deviceInfo.pod,
                    deviceType: that.deviceType.indexOf(that.deviceInfo.deviceType) > -1 ? that.deviceInfo.deviceType : undefined,
                    deviceClass: that.deviceClass.indexOf(that.deviceInfo.deviceType) > -1 ? that.deviceInfo.deviceType : undefined,
                    idcType: that.deviceInfo.idcType
                  }
                }
              });
                // Bus.$emit('txt',that.detailSubordinate);

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
    .eqAnColumn {
        div {
            width:100%;
            canvas {
                width:100%;
            }
        }
    }
}
</style>
