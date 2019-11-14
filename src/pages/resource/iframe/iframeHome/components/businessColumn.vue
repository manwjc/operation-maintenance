<template>
    <div class="businessColumn">
        <div class="titleContent">
            <div class="tenantTypeColumnTitle">各一级租户新增设备量趋势分布TOP5</div>
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
        <div id="myChartBusinessColumn" style="width:100%;height:calc(100% - 42px);"></div>
    </div>
</template>

<script>

import echarts from 'echarts'
import rbHomeService from 'src/services/iframe/rb-home-service.js'
export default {
    data() {
        return {
            p1: false,
            p2: true,
            p3: false,
            FirstList: [],  // 第一条柱子
            SecondList: [], // 第二条柱子
            ThirdList: [],  // 第三条柱子
            depList: [],
            dateFlag: [],   // 日和月的标识
        }
    },
    components: {
    },
    mounted() {
        this.countDevClsByDepWith('p2')
    },
    methods: {
        countDevClsByDepWith(flag){
            if(flag == 'p1') {
                rbHomeService.countDevClsByDepWithDay().then((res) => {
                    var flag = this.getLastThreeDay()
                    this.packageData(flag,res)
                    this.setDateFlag(flag,'day')
                    this.echartsTypeColumn()

                })
            } else {
                rbHomeService.countDevClsByDepWithMonth().then((res) => {
                    var flag = this.getLastThreemMonth()
                    this.packageData(flag,res)
                    this.setDateFlag(flag,'month')
                    this.echartsTypeColumn()
                })
            }
        },
        // 封装数据
        packageData(flag,res) {
            var FirstList = []
            var SecondList = []
            var ThirdList = []
            var depList = []
            for(var i=0;i<res.length;i++){
                var crtObj = res[i]
                var zero = flag[0]
                var one = flag[1]
                var two = flag[2]
                depList.push(crtObj.department)
                FirstList.push(crtObj[zero])
                SecondList.push(crtObj[one])
                ThirdList.push(crtObj[two])
            }
            this.depList = depList
            this.FirstList = FirstList
            this.SecondList = SecondList
            this.ThirdList = ThirdList
        },
        // 获取时间分类标识
        setDateFlag(flag,date){
            var dateFlag = []   
            if(date == 'day'){
                for(var i=0;i<flag.length;i++){
                    dateFlag.push(flag[i])
                }
            } else {
                var monthName = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
                for(var i=0;i<flag.length;i++){
                    var monthIndex = flag[i].split("-")[1]
                    dateFlag.push(monthName[parseInt(monthIndex)-1] + '月份')
                }
            }
            this.dateFlag = dateFlag
        },
        annularBotton(data) {
            this.p1 = false
            this.p2 = false
            this.p3 = false
            this[data] = true
            this.countDevClsByDepWith(data)
        },
        // 获取最近的三天日期
        getLastThreeDay(){
            var rs = []
            for(var i=-2;i<=0;i++) {
                var today = new Date()
                var targetday_milliseconds=today.getTime() + 1000*60*60*24*i
                today.setTime(targetday_milliseconds)
                var tYear = today.getFullYear()
                var tMonth = today.getMonth()
                var tDate = today.getDate()
                tMonth = tMonth + 1 >=10 ? tMonth + 1 : '0' + (tMonth + 1)
                tDate = tDate.toString().length == 1 ? "0" + tDate : tDate
                rs.push(tYear+"-"+tMonth+"-"+tDate)
            }
            return rs
        },
        // 获取最近三月的月份
        getLastThreemMonth(){
            var rs = []
            for(var i=-2;i<=0;i++) {
                var today = new Date()
                var tYear = today.getFullYear()
                var tMonth = today.getMonth()
                today.setMonth(tMonth + i)
                tMonth = today.getMonth()
                tMonth = tMonth + 1 >=10 ? tMonth + 1 : '0' + (tMonth + 1)
                rs.push(tYear+"-"+tMonth)
            }
            return rs
        },
        echartsTypeColumn() {
            let that = this
            let myChart = echarts.init(document.getElementById('myChartBusinessColumn'));
            myChart.setOption({
                title: {
                    text: ''
                },
                tooltip: {},
                grid: {
                    top:'35',
                    left: '20',
                    right: '30',
                    bottom: '10',
                    containLabel: true
                },
                legend: {
                    data: this.dateFlag,
                    icon: "circle",
                    right: '30',
                    itemHeight  :9,//改变圆圈大小
                    textStyle: { //图例文字的样式
                        color: '#666'
                    },
                    y: '10',
                },
                xAxis: {
                        data: this.depList,
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
                series: [{
                    name: this.dateFlag[2],
                    type: 'bar',
                    data: this.ThirdList,
                    barWidth: 15,//柱图宽度
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
                },{
                    name: this.dateFlag[1],
                    type: 'bar',
                    data: this.SecondList,
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
                                    offset: 1, color: '#0DA8FF' // 0% 处的颜色
                                }, {
                                    offset: 0, color: '#1DDCEE' // 100% 处的颜色
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
                },
                {
                    name: this.dateFlag[0],
                    type: 'bar',
                    barWidth : 15,//柱图宽度
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
                    },
                    data: this.FirstList,
                }
                ]
            }),
            myChart.on('click', function (params) {
                var monthList = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
                var monthFlag = ['31','28','31','30','31','30','31','31','30','31','30','31']
                var start='',end=''
                // 日
                var flagName = params.seriesName
                if(this.p1) {
                    start = flagName
                    end = flagName
                } else {
                    var index = -1
                    for(;index<monthList.length;index++) {
                        var c = monthList[index] + '月份'
                        if(c == flagName) {
                            break
                        }
                    }
                    var today = new Date()
                    var tYear = today.getFullYear()
                    var tickMonth = (index+1) > 10 ?  (index+1) : '0' + (index + 1)
                    var flag = parseInt(tickMonth)
                    var monthEndDay = monthFlag[flag-1]
                    if(flag == 2) {
                        if(tYear%4 == 0 && tYear % 100 != 0 || tYear % 400 == 0) {
                            monthEndDay = monthEndDay + 1
                        }
                    }
                    start = tYear + "-" + tickMonth + "-01"
                    end =  tYear + "-" + tickMonth + "-" + monthEndDay
                }

                that.$router.push({
                    path: "/resource/iframe/list",
                    query: {
                        parentParams: {
                            "department1": params.name,
                            "startInsertTime": start,
                            "endInsertTime": end
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
.businessColumn {
    position:relative;
    width:100%;
    height:100%;
    .titleContent {
        overflow: hidden;
        height:rem(48);
        width:100%;
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
    .myChartBusinessColumn {
        div {
            width:100%;
            canvas {
                width:100%;
            }
        }
    }
}
</style>