<template>
    <div class="equipmentPie">
        <div class="equipmentPieTitle">
            <!-- 呼哧哈池三级跳转 -->
            <div>{{deviceInfo.idcType}}{{deviceInfo.deviceType}}工期分布</div>
        </div>
        <div class="pie">
            <div id="annular" style="width:100%;height:100%;"></div>
        </div>
        <div class="column">
            <div class="line"></div>
            <EqAnColumn ref="thirdColumn" :deviceInfo="deviceInfo"></EqAnColumn>
        </div>
    </div>
</template>

<script>

import echarts from 'echarts'
import iframe from 'src/services/iframe/iframe.js'
import EqAnColumn from "../components/eqAnColumn"

import AnBus from './middleKey/anBus'

import ZYBus2 from './middleKey/ZYBus2'
import ZYBus3 from './middleKey/ZYBus3'
import {setSessionStorage, removeSessionStorage, getSessionStorage} from "../components/middleKey/storage";

export default {
  props: ['deviceInfo'],
    data() {
        return {
            sendAnnular: false,
            type: '',
            NameZy3: '',
          projectData: [],
        }
    },
    components: {
        EqAnColumn
    },
    mounted() {
      this.getCountByIdcPro()
    },
    methods: {
      getCountByIdcPro() {

        this.$refs['thirdColumn'].getCountByIdcDevPro()
        let data = {
          idcType: this.deviceInfo.idcType,
          deviceType: this.deviceInfo.deviceType
        }
        iframe.getCountByIdcPro(data).then((res) => {
          this.projectData = []
          res.forEach(item => {
            for (let key in item) {
              if (key !== 'device_type') {
                this.projectData.push({value: item[key], name: key === '' ? '未知': key})
              }
            }
          })

          this.drawPie()
        })
      },
        drawPie(){
            let that = this
            // 基于准备好的dom，初始化echarts实例
            let myPie = echarts.init(document.getElementById('annular'));
            // 绘制图表
            myPie.setOption({
                // 如果下列没有设置颜色，则从列表中依次取值
                color:['#00a9ff','#fe608b','#fea636','#00cd43'],//配置颜色
                tooltip: {
                    // 提示事件类型和格式
                    trigger: 'item',
                    formatter: "{b} <br/>设备数: {c} ({d}%)"
                },
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
                        radius: ['50%','70%'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'outer',
                                formatter: "{b}  {d}%",
                                color:'#696969', // 指示文字颜色
                                fontSize: '12'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '13',
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                color:'#666', // 指示线颜色,
                                length:5
                            }
                        },
                        data: that.projectData
                    }
                ]

            }),
            myPie.on('click', function (params) {
                // console.log('909090909', params.name)
                // ZYBus3.$emit('txtZy3',params.name);
                that.deviceInfo.projectName = params.name
                that.$refs['thirdColumn'].getCountByIdcDevPro()
            })
        },
    }
}

</script>
<style lang="scss" scoped>

@import "./rem";
.equipmentPie {
    position:relative;
    width:100%;
    height:100%;
    .pie {
        float:left;
        width:34.5%;
        height:calc(100% - 42px);
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
            left:rem(160);
            width:rem(22);
            height:rem(17);
        }
    }
    .column {
        position: relative;
        float:right;
        height:calc(100% - 42px);
        width:calc(65.5% - 1px)
    }
    .line {
        position:absolute;
        height:80%;
        width:1px;
        float:left;
        border-left:solid 1px #ccc;
        top:0;
        bottom:0;
        left:0;
        margin:auto;
    }
}
</style>
