<template>
    <div class="detailsColumn">
        <div class="titleContent">

            <div class="equipmentPieTitle">
                <div>第三级</div>
                <!-- <div @click="goBack()"><img src="../iframeImg/homeIcon7.png" alt=""></div> -->
            </div>
        </div>
        <div id="subordinate0" style="width:100%;height:100%;"></div>
    </div>
</template>

<script>

import echarts from 'echarts'

import KeyBus from './middleKey/keyBus'

export default {
    data() {
        return {
            p1: true,
            p2: false,
            p3: false,
            dataList: ['10','30','10','50','66','66','50','40','66'],

            sendSonMessage: false
        }
    },
    components: {
    },
    mounted() {
        this.echartsTypeColumn()
    },
    created() {
    },
    methods: {
        goBack() {

            EBus.$emit('txt1',this.sendSonMessage);
        },
        echartsTypeColumn() {
            let that = this
            let myChart = echarts.init(document.getElementById('subordinate0'));
            myChart.setOption({
                title: {
                    text: ''
                },
                tooltip: {},
                grid: {
                    top:'30',
                    left: '40',
                    right: '30',
                    bottom: '50',
                    containLabel: true
                },
                legend: {
                    // data: ['九月份','八月份','七月份'],
                    icon: "circle",
                    right: '30',
                    itemHeight  :9,//改变圆圈大小
                    textStyle: { //图例文字的样式
                        color: '#666'
                    },
                    y: '20',
                },
                xAxis: {
                        data: ['呼和浩特设备','呼和浩特设备','呼和浩特设备','呼和浩特设备','呼和浩特设备','呼和浩特设备','呼和浩特设备','呼和浩特设备','呼和浩特设备'],
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
                    data: that.dataList,
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

                    that.$router.push({
                        path: "/resource/iframe/list",
                        query: {
                            name: params.name,
                            value: params.value
                        }
                    });
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
    .subordinate0 {
        div {
            width:100%;
            canvas {
                width:100%;
            }
        }
    }
}
</style>