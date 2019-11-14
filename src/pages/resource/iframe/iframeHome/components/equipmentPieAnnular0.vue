<template>
    <div class="equipmentPie">
        <div class="equipmentPieTitle">
            <div> {{deviceInfo.idcType}}设备分类分布</div>
        </div>
        <div class="pie">
            <div id="annular0" style="width:100%;height:100%;"></div>
        </div>
        <div class="column">
            <div class="line"></div>
            <EqAnColumn0
              ref="secondColumn"
              :deviceInfo="deviceInfo"
              @refreshThird="refreshThird">
            </EqAnColumn0>
        </div>
    </div>
</template>

<script>

import echarts from 'echarts'
import EqAnColumn0 from '../components/eqAnColumn0'
import iframe from 'src/services/iframe/iframe.js'

import {setSessionStorage, removeSessionStorage, getSessionStorage} from '../components/middleKey/storage'

export default {
  props: ['deviceInfo'],
  data() {
    return {
      sendAnnular: false,
      pieList: [],
      NameZ: '',
      nameList: {
        phyNumber: '物理机',
        vmNumber: '虚拟机',
        networkNumber: '网络设备',
        storageNumber: '存储设备',
        safeNumber: '安全设备'
      }
    }
  },
  components: {
    EqAnColumn0
  },
  mounted() {
    this.getCountByIdcDevCT()
  },
  created() {
  },
  methods: {
    refreshThird() {
      this.$emit('refreshThird')
    },
    getCountByIdcDevCT() {
      this.$refs['secondColumn'].getCountByIdcPro()
      let data = {
        idcType: this.deviceInfo.idcType
      }
      iframe.getCountByIdcDevCT(data).then((res) => {
        this.pieList = []
        res.forEach(item => {
          for (let key in item) {
            if (this.nameList[key]) {
              this.pieList.push({
                value: item[key],
                name: this.nameList[key]
              })
            }
          }
        })
        this.drawPie()
      })
    },
    drawPie() {
      let that = this
      let myPie = echarts.init(document.getElementById('annular0'))
      // 绘制图表
      myPie.setOption({
        // 如果下列没有设置颜色，则从列表中依次取值
        // color:['#00a9ff','#fe608b','#fea636','#00cd43'],//配置颜色
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
            name: that.deviceInfo.idcType,
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
        // removeSessionStorage('idcType')
        // setSessionStorage('idcType', params.name)
        // that.$emit('func0',that.sendAnnular)
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
