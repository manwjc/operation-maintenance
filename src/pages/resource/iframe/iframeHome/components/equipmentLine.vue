<template>
<div class="eLine">
    <div class="titleContent">
        <div class="tenantTypeColumnTitle">各设备类型新增设备量趋势分布</div>
        <div class="poolTenantAnnularBotton">
            <div @click="annularBotton('p1')">
                <p :class="{activeAnnular:p1}">日</p>
            </div>
            <div @click="annularBotton('p2')">
                <p :class="{activeAnnular:p2}">月</p>
            </div>
            <!-- <div @click="annularBotton('p3')">
                <p :class="{activeAnnular:p3}">年</p>
            </div> -->
        </div>
    </div>
    <div id="equipmentLine" style="width: 100%;height: calc(100% - 42px);"></div>
</div>
</template>
<script>
import echarts from 'echarts'
import rbHomeService from 'src/services/iframe/rb-home-service.js'
export default {
    props: ["lineData"],
    name: '',
    data() {
        return {
            p1: false,
            p2: true,
            p3: false,
            xAxis: [],
            serverCountList: [],
            networkCountList: [],
            safeCountList: [],
            storageCountList: [],
        }
    },
    methods: {
        countDeviceClassTrend(flag){
            if(flag == 'p1') {
                rbHomeService.countDeviceClassTrendWithDay().then((res) => {
                    this.packageData(res)
                    this.drawLine('equipmentLine')
                })
            } else {
                rbHomeService.countDeviceClassTrendWithMonth().then((res) => {
                    this.packageData(res)
                    this.drawLine('equipmentLine')
                })
            }
        },
        // 封装数据
        packageData(data){
            var xAxis = []
            var safeNumber = []
            var networkNumber = []
            var storageNumber = []
            var serverNumber = []
            for(var i=0;i<data.length;i++){
                xAxis.push(data[i].currentDate)
                safeNumber.push(data[i].safeNumber)
                networkNumber.push(data[i].networkNumber)
                storageNumber.push(data[i].storageNumber)
                serverNumber.push(data[i].serverNumber)
            }
            this.xAxis = xAxis
            this.safeCountList = safeNumber
            this.networkCountList = networkNumber
            this.storageCountList = storageNumber
            this.serverCountList = serverNumber
        },
        annularBotton(data) {
            this.p1 = false
            this.p2 = false
            this.p3 = false
            this[data] = true
            this.countDeviceClassTrend(data)
        },
        drawLine(id) {
            let that = this
            let myChart = echarts.init(document.getElementById(id))
            myChart.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['服务器','网络','安全','存储'],
                    icon: "circle",   //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none
                    // textStyle:{
                    //     fontSize: 12,//字体大小
                    //     color: '#66666'//字体颜色
                    // },
                    itemHeight  :9,//改变圆圈大小
                    right:'30',
                    y:'10'
                },
                grid: {
                    top:'35',
                    left: '20',
                    right: '30',
                    bottom: '10',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLabel:{
                        // interval: 0,  
                        textStyle:{
                        fontSize:10, // 让字体变小
                        color:'#666666'
                        }
                        // rotate: 45 // 字体倾斜45度
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#E5E8ED',
                        }
                     },
                    data: this.xAxis
                },
                yAxis: {
                    minInterval: 1,
                    type: 'value',
                    splitLine: {
                        show: true, 
                         //  改变轴线颜色
                        lineStyle: {
                            // 使用深浅的间隔色
                             type: 'dashed'
                         }                            
                    },
                    axisLine:{
                        show: false,
                        lineStyle:{
                            color:'#E5E8ED',
                        }
                     },
                     //调整x轴的lable
                     axisLabel:{ 
                        textStyle:{
                        fontSize:10, // 让字体变小
                        color:'#666666'
                        },
                        // formatter: function (v) {
                        //     return parseInt(v)//表示整数。其他数值类型以此类推
                        // }
                    }, 
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
                                width: 3, //  折线图的粗细
                                color: '#6178ff' // 折线的颜色
                                }
                            }
                        },
                    data: this.serverCountList,
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
                                width: 3, //  折线图的粗细
                                color: '#03d9f6' // 折线的颜色
                                }
                            }
                        },
                    data: this.networkCountList,
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
                                width: 3, //  折线图的粗细
                                color: '#00ffac' // 折线的颜色
                                }
                            }
                        },
                    data: this.safeCountList,
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
                                width: 3, //  折线图的粗细
                                color: '#ffd91f' // 折线的颜色
                                }
                            }
                        },
                    data: this.storageCountList,
                }]
            }),

            myChart.getZr().on('click', function (params) {
                var monthList = ['0','31','28','31','30','31','30','31','31','30','31','30','31']
                var pointInPixel= [params.offsetX, params.offsetY];
                if (myChart.containPixel('grid',pointInPixel)) {
                    var xIndex=myChart.convertFromPixel({seriesIndex:0},[params.offsetX, params.offsetY])[0]
                    var ds = myChart.getOption().xAxis[0].data[xIndex]
                    var start,end
                    if(that.p1) {
                        start = ds
                        end = ds
                    } else {
                        var date = ds.split('-')
                        var year = parseInt(date[0])
                        var month = parseInt(date[1])
                        var monthEndDay = monthList[month]
                        if(month == 2) {
                            if(year%4 == 0 && year % 100 != 0 || year % 400 == 0) {
                                monthEndDay = monthEndDay + 1
                            }
                        }
                        start = ds + '-01'
                        end = ds + '-' + monthEndDay
                    }
                    that.$router.push({
                    path: "/resource/iframe/list",
                    query: {
                        parentParams: {
                            "startInsertTime": start,
                            "endInsertTime": end
                        }
                    }
                });
                }
            })
        }
    },
    mounted() {
        this.countDeviceClassTrend('p2')
    },
}
</script>
<style lang="scss" scoped>

@import "./rem";

.eLine {
    position:relative;
    width:100%;
    height:100%;
    .titleContent {
        overflow: hidden;
        width:100%;
        height:rem(48);
        background:#f5f8f8;
        border-radius: 6px 6px 0 0;
    }
    .tenantTypeColumnTitle {
        position:absolute;
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
    #equipmentLine{
        z-index: 99999
    }
    .equipmentLine {
        div {
            width:100%;
            canvas {
                width:100%;
            }
        }
    }
}
</style>
