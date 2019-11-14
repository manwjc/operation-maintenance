<template>
    <div class="equipmentPie">

        <div class="equipmentPieTitle">
            <div>各资源池设备量分布</div>
        </div>
        <div class="pie">
            <div id="myChartPie" style="width:100%;height:100%;"></div>
        </div>
        <div class="column">
            <div class="line"></div>
            <PoolTypeColumn></PoolTypeColumn>
        </div>
    </div>
</template>

<script>

import echarts from 'echarts'

import PoolTypeColumn from '../components/poolTypeColumn'

import iframe from 'src/services/iframe/iframe.js'
import {setSessionStorage, removeSessionStorage, getSessionStorage} from '../components/middleKey/storage'

import ZYBus2 from './middleKey/ZYBus2'

import ZYBus3 from './middleKey/ZYBus3'
export default {

  props: ['deviceInfo'],
  data() {
    return {
        sendAnnular: true,
        sendAnnular1: false,
        pieList: [],

        pieList2: [],

        cloumn2Object: {
            device_type: [],
            NameList: [],
            numberlist: []
          },
        aaaa: []
      }
  },
  components: {
    PoolTypeColumn
  },
  mounted() {
    this.getCountByIdcDevCT()
  },
  created() {
  },
  methods: {
    getCountByIdcDevCT() {
        iframe.getCountByIdcDevCT().then((res) => {
            this.pieList = []
            for (let item in res) {
                this.pieList.push({
                    value: res[item].total,
                    name: res[item].idcType === '' ? '未知' : res[item].idcType
                  })
              }
            setTimeout(() => {
                this.drawPie()
              }, 500)
          })
      },
        // getCountByIdcPro() {
        //     let that = this
        //     iframe.getCountByIdcPro().then((res) => {
        //         this.cloumn2Object.device_type = []
        //         this.cloumn2Object.NameList = []
        //         this.cloumn2Object.numberlist = []
        //         for(let item in res) {
        //             this.cloumn2Object.device_type.push(res[item].device_type)
        //             this.cloumn2Object.NameList = Object.keys(res[item])
        //             this.cloumn2Object.numberlist = Object.values(res[item])
        //
        //             for(var i = 0; i < this.cloumn2Object.numberlist.length; i++){
        //                 if(this.cloumn2Object.numberlist[i] == '存储设备' || this.cloumn2Object.NameList[i] == "安全设备" || this.cloumn2Object.NameList[i] == "物理机" || this.cloumn2Object.NameList[i] == "网络设备" || this.cloumn2Object.NameList[i] == "虚拟机"){
        //                     this.cloumn2Object.numberlist.splice(i,1)
        //                     i = i-1
        //                     }
        //                 }
        //             for(var i = 0; i < this.cloumn2Object.NameList.length; i++){
        //                 if(this.cloumn2Object.NameList[i] == '' || this.cloumn2Object.NameList[i] == "device_type"){
        //                     this.cloumn2Object.NameList.splice(i,1)
        //                     i = i-1
        //                     }
        //                 }
        //         }
        //                 console.log('=====ddddddd', this.cloumn2Object.NameList)
        //                 console.log('=====wwwwww', this.cloumn2Object.device_type)
        //     })
        //
        //     console.log('xxxccc', this.cloumn2Object.device_type)
        // },
        // getCountByIdcDevCT2 (){
        //     iframe.getCountByIdcDevCT2().then((res) => {
        //         this.pieList2 = []
        //         for(let item in res) {
        //             this.pieList2.push({
        //                 value: res[item].total,
        //                 name: res[item].idcType
        //             })
        //         }
        //     })
        // },

    drawPie() {
        let that = this
        let times = 0
            // 基于准备好的dom，初始化echarts实例
        let myPie = echarts.init(document.getElementById('myChartPie'))
            // 绘制图表
        myPie.setOption({
                // 如果下列没有设置颜色，则从列表中依次取值
            color: ['#00a9ff', '#fe608b', '#fea636', '#00cd43', '#9664e1', '#fdb3b4'], // 配置颜色
            tooltip: {
                    // 提示事件类型和格式
                trigger: 'item',
                formatter: '{b} <br/>设备数: {c} ({d}%)'
              },
            grid: {
                top: '100px',
                left: '3%',
                right: '100px',
                bottom: '30%',
                containLabel: true
              },
            series: [
                {
                  name: '资源池设备量分布',
                  type: 'pie',
                  radius: '70%',
                  avoidLabelOverlap: true,
                  label: {
                      normal: {
                            show: true,
                            position: 'outer',
                            formatter: '{b}  {d}%',
                            color: '#696969', // 指示文字颜色
                            fontSize: '12'
                          },
                      emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '13'
                              }
                          }
                    },
                  labelLine: {
                      normal: {
                            length: 1,
                            show: true,
                            color: '#666' // 指示线颜色
                          }
                    },
                  data: that.pieList
                }
              ]
          }),

            myPie.on('click', function(params) {
              that.deviceInfo.idcType = params.name
              that.$emit('refreshSecond')
              that.$emit('closeThird')
                    // removeSessionStorage('idcType')
                    // setSessionStorage('idcType', params.name)

                    // that.$emit('func',that.sendAnnular)
                // let x = times++
                // console.log('www', x % 2)
                // if( x % 2 === 0 ){
                //     that.$emit('func',that.sendAnnular)

                // } else {
                //     that.$emit('func',that.sendAnnular1)
                // }
                // that.getCountByIdcDevCT2()
                //
                // setTimeout(() => {
                //     ZYBus2.$emit('ZYBus2txt1',that.pieList2, that.cloumn2Object,params.name);
                // }, 1000);
                //
                // that.getCountByIdcPro()
            })
      }
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
