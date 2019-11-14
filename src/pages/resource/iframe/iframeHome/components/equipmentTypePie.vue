<template>
    <div class="equipmentTypePie">
        <div class="equipmentPieTitle">
            <div>各资源池租户分布</div>
            <!-- <div><img src="../iframeImg/homeIcon7.png" alt=""></div> -->
        </div>
        <div class="pie">
            <div id="myTypePie" style="width:100%;height:100%;"></div>
        </div>
        <div class="column">
            <div class="line"></div>
            <DetailsColumn
              ref="detailColumn"
              :zuInfo="zuInfo"
              @showDep2="showDep2">
            </DetailsColumn>
        </div>
    </div>
</template>

<script>

import echarts from 'echarts'

import DetailsColumn from '../components/detailsColumn'

import iframe from 'src/services/iframe/iframe.js'

export default {
  props: ['zuInfo'],
  data() {
    return {
      sendSonMessage: true,
      sendSonMessage0: false,
      pieList: [],
      column: {
        numberList: [],
        department1List: []
      }
    }
  },
  components: {
    DetailsColumn
  },
  mounted() {
    this.getCountBizByIdc()
  },
  methods: {
    showDep2() {
      this.$emit('showDep2')
    },
    getCountBizByIdc() {
      iframe.getCountBizByIdc().then((res) => {
        for (let item in res) {
          this.pieList.push({
            value: res[item].number,
            name: res[item].idcType ? res[item].idcType : '未知'
          })
        }
        this.drawPie()
      })
    },
    getCountBizByIdcDep1() {
      this.column.numberList = []
      this.column.department1List = []

      iframe.getCountBizByIdcDep1().then((res) => {
        for (let item in res) {
          this.column.numberList.push(res[item].number)
          this.column.department1List.push(res[item].department1)
        }
      })
    },
    drawPie() {
      let that = this
      let times = 0
          // 基于准备好的dom，初始化echarts实例
      let myPie = echarts.init(document.getElementById('myTypePie'))
          // 绘制图表
      myPie.setOption({
              // 如果下列没有设置颜色，则从列表中依次取值
        color: ['#00a9ff', '#fe608b', '#fea636', '#00cd43', '#9664e1', '#fdb3b4'], // 配置颜色
        tooltip: {
                  // 提示事件类型和格式
          trigger: 'item',
          formatter: '{b} <br/>业务系统数: {c} '
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
            name: '资源池租户分布',
            type: 'pie',
            radius: '70%',
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                position: 'outer',
                formatter: '{b} : {c}',
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
                show: true,
                color: '#696969' // 指示线颜色
              }
            },
            data: that.pieList
          }
        ]

      }),

          myPie.on('click', function(params) {
            that.zuInfo.idcType = params.name === '未知' ? '' : params.name
            // that.$refs['detailColumn'].getCountBizByIdcDep1()
            that.$refs['detailColumn'].resetEchart()
            that.$emit('closeDep2')
          })
    }
  }
}
</script>
<style lang="scss" scoped>

@import "./rem";

.equipmentTypePie {
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
