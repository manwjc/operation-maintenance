<template>
    <div class="poolTenantPie">
        <div class="equipmentPieTitle">各资源池租户量分布fff</div>
        <div id="myChartTenantPie" style="width:100%;height:100%;"></div>
    </div>
</template>

<script>

import echarts from 'echarts'

export default {
    data() {
        return {
        }
    },
    components: {
    },
    mounted() {
        this.drawPie()
    },
    created() {
        this.drawPie()
    },
    methods: {
        drawPie(){
            // 基于准备好的dom，初始化echarts实例
            let myPie = echarts.init(document.getElementById('myChartTenantPie'))
            // 绘制图表
            myPie.setOption({
                // 如果下列没有设置颜色，则从列表中依次取值
                color:['#2F55FF','#D327D7','#FF517D','#FF3437'],//配置颜色
                tooltip: {
                    // 提示事件类型和格式
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                // legend: {
                //     orient: 'horizontal',
                //     x: 'center',
                // },
                grid: {
                    top:'100px',
                    left: '3%',
                    right: '100px',
                    bottom: '30%',
                    containLabel: true
                },
                series: [
                    {
                        name:'',
                        type:'pie',
                        radius: '50%',
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'outer',
                                formatter: "{b}  {d}%",
                                color:'#666' // 指示文字颜色
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '15',
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                color:'#666' // 指示线颜色
                            }
                        },
                        data: [
                            {value: 10, name: '南方基地'},
                            {value: 30, name: '呼和浩特资源池'},
                            {value: 70, name: '哈尔滨资源池'},
                            {value: 40, name: '信息港'},
                            ]
                    }
                ]

            })
        },
    }
}

</script>
<style lang="stylus">
.poolTenantPie {
    position relative;
    width:100%;
    height:100%;
    .equipmentPieTitle {
        position:absolute;
        line-height:30px;
        margin-left:10px
    }
    .myChartTenantPie {
        div {
            width:100%;
            canvas {
                width:100%;
            }
        }
    }
}
</style>