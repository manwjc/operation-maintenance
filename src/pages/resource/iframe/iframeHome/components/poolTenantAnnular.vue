<template>
    <div class="poolTenantAnnular">
        <div class="titleContent">
            <div class="equipmentPieTitle">设备子类型分布</div>
            <div class="poolTenantAnnularBotton">
                <div @click="annularBotton('p1')">
                    <p :class="{activeAnnular:p1}">服务器</p>
                </div>
                <div @click="annularBotton('p2')">
                    <p :class="{activeAnnular:p2}">网络</p>
                </div>
                <div @click="annularBotton('p3')">
                    <p :class="{activeAnnular:p3}">安全</p>
                </div>
                <div @click="annularBotton('p4')">
                    <p :class="{activeAnnular:p4}">存储</p>
                </div>
            </div>
        </div>
        <div id="myChartTenantAnnular" style="width:100%;height:calc(100% - 42px);"></div>
    </div>
</template>

<script>

import echarts from 'echarts'
import rbHomeService from 'src/services/iframe/rb-home-service.js'
export default {
  data() {
    return {
      p1: true,
      p2: false,
      p3: false,
      p4: false,
      title: '服务器',
      subTotal: '',
      showData: []
    }
  },
  components: {
  },
  mounted() {
    this.countDeviceTypeByDeviceClass('服务器')
  },
  methods: {
        // 设备子类型分布
    countDeviceTypeByDeviceClass(deviceClass) {
      var params = {
        deviceClass: deviceClass
      }
      rbHomeService.countDeviceTypeByDeviceClass(params).then((res) => {
        var rs = []
        var sum = 0
        for (var i = 0; i < res.length; i++) {
          var obj = {
            name: (res[i].device_type == null ? '未知' : res[i].device_type),
            value: res[i].num
          }
          sum += res[i].num
          rs.push(obj)
        }
        this.subTotal = sum
        this.showData = rs
        this.drawPie()
      })
    },
        // 选中某个device_class
    changeToDeviceClass(data) {
      var name = ''
      switch (data) {
      case 'p1': name = '服务器'; break
      case 'p2': name = '网络设备'; break
      case 'p3': name = '安全设备'; break
      case 'p4': name = '存储设备'; break
      default:
        break
      }
      return name
    },
    annularBotton(data) {
      this.p1 = false
      this.p2 = false
      this.p3 = false
      this.p4 = false
      this[data] = true
      var deviceClass = this.changeToDeviceClass(data)
      this.title = deviceClass
      this.countDeviceTypeByDeviceClass(deviceClass)
    },
    drawPie() {
      let that = this
            // 基于准备好的dom，初始化echarts实例
      let myPie = echarts.init(document.getElementById('myChartTenantAnnular'))
            // 绘制图表
      myPie.setOption({
        title: {
          text: this.title,
          subtext: this.subTotal,
          textStyle: {
            color: 'blue',
            fontSize: 12
          },
          subtextStyle: {
            fontSize: 14,
            color: ['#ff9d19']
          },
          x: 'center',
          y: '37%'
        },
        color: ['#5B94FF', '#1DDCEE', '#FFDF61', '#F8475C', '#FF862D', '#4FFF57', '#DFFF70', '#FFE823', '#607FF1',
          '#305BFF', '#0DA8FF', '#FFBC07', '#DD0F2C', '#FF6600', '#18DAAA', '#31D550', '#AFF800', '#1C56D9'], // 配置颜色
        tooltip: {
                    // 提示事件类型和格式
          trigger: 'item',
          formatter: '{b} <br/>设备数量:{c} ({d}%)'
        },
                // legend: {
                //     type: 'scroll',
                //     orient: 'vertical', // horizontal vertical
                //     x: '70%',
                //     icon: "circle",
                //     right: 0,
                //     itemHeight :9,//改变圆圈大小
                //     textStyle: { //图例文字的样式
                //         color: '#666666'
                //     },
                //     align:"left", // icon 在文字的位置
                //     y: 'center',
                //     height:'40'
                // },
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
                show: false
                                // position: 'center',
              }
            },
            emphasis: {
              label: {
                show: false
              }
            },
                        // labelLine: {
                        //     normal: {
                        //         show: true,
                        //         color:'#666' // 指示线颜色
                        //     }
                        // },
            data: this.showData
          }
        ]

      }),

            myPie.on('click', function(params) {
              var deviceType = params.name
              that.$router.push({
                path: '/resource/iframe/list',
                query: {
                  parentParams: {
                    'deviceType': deviceType
                  }
                }
              })
            })
    }
  }
}
</script>
<style lang="scss" scoped>

@import "./rem";
.poolTenantAnnular {
    position:relative;
    width:100%;
    height:100%;
    .titleContent {
        overflow: hidden;
        width:100%;
        height:rem(48);
        background:#f5f8f8;
        padding-left:10px;
        border-radius: 6px 6px 0 0;
    }
    .equipmentPieTitle {
        display: contents;
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
    .myChartTenantAnnular {
        div {
            width:100%;
            canvas {
                width:100%;
            }
        }
    }
}
</style>