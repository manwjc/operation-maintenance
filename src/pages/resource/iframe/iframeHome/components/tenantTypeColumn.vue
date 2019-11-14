<template>
    <div class="tenantTypeColumn">
        <div class="tenantTypeColumnTitle">各一级租户设备分类分布TOP5</div>
        <div id="myChartTypeColumn" style="width:100%;height:calc(100% - 42px);"></div>
    </div>
</template>

<script>

import echarts from 'echarts'
import rbHomeService from 'src/services/iframe/rb-home-service.js'
export default {
    data() {
        return {
            xAxis: [],
            serverCountList: [],
            networkCountList: [],
            safeCountList: [],
            storageCountList: []
        }
    },
    components: {
    },
    mounted() {
        this.countDeviceClassByDepartment1()
    },
    methods: {
        //各一级租户设备类型分布
        countDeviceClassByDepartment1() {
            rbHomeService.countDeviceClassByDepartment1().then((res) => {
                var xAxis = []
                var safeNumber = []
                var networkNumber = []
                var storageNumber = []
                var serverNumber = []
                for(var i=0;i<res.length;i++){
                    xAxis.push(res[i].orgName)
                    safeNumber.push(res[i].safeNumber)
                    networkNumber.push(res[i].networkNumber)
                    storageNumber.push(res[i].storageNumber)
                    serverNumber.push(res[i].serverNumber)
                }
                this.xAxis = xAxis
                this.safeCountList = safeNumber
                this.networkCountList = networkNumber
                this.storageCountList = storageNumber
                this.serverCountList = serverNumber
                this.echartsTypeColumn()
            })
        },
        echartsTypeColumn() {
                
            let myChart = echarts.init(document.getElementById('myChartTypeColumn'));
            myChart.setOption({
                title: {
                    text: ''
                },
                tooltip: {},
                grid: {
                    top:'35',
                    bottom:'40',
                    right:'30',
                    left: '60'
                },
                legend: {
                    data: ['服务器','网络','安全','存储'],
                    icon: "circle",
                    right: '30',
                    itemHeight  :9,//改变圆圈大小
                    textStyle: { //图例文字的样式
                        color: '#666'
                    },
                    y: '5',
                },
                xAxis: {
                        data: this.xAxis,
                        axisLabel : {
                            rotate:15,
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
                    axisLabel : {
                        textStyle: { //改变刻度字体样式
                            color: '#5E6D82'
                        }
                    },
                    splitLine :{    //网格线
                        lineStyle:{
                            type: 'dashed'   //设置网格线类型 dotted：虚线   solid:实线
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
                    name: '服务器',
                    type: 'bar',
                    stack: '总量',
                    data: this.serverCountList,
                    barWidth: 15,//柱图宽度
                    itemStyle: {
                        normal: {
                            color:'#3464fd',
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
                            color:'#00b7fe'
                        }
                    },
                    data: this.networkCountList,
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
                            color:'#00eda8'
                        }
                    },
                    data: this.safeCountList,
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
                            color:'#fec300',
                            // barBorderRadius:[5, 5, 0, 0], // 柱状图圆角设置
                        }
                    },
                    data: this.storageCountList,
                }
                ]
            }),

            myChart.on('click', function (params) {
    
                that.$router.push({
                    path: "/resource/iframe/list",
                    query: {
                        parentParams: {
                            "department1": params.name
                        }
                    }
                });

            })
        }
    }
}

</script>
<style lang="scss" scoped>

@import "./rem";

.tenantTypeColumn {
    position:relative;
    width:100%;
    height:100%;
    .tenantTypeColumnTitle {
        line-height:rem(48);
        height:rem(48);
        padding-left:10px;
        color:#273437;
        font-weight:400;
        font-size:rem(16);
        background:#f5f8f8;
        font-weight:bold;
        border-radius: 6px 6px 0 0;
    }
    .myChartTypeColumn {
        div {
            width:100%;
            canvas {
                width:100%;
            }
        }
    }
}
</style>