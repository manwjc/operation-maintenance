<template>
  <!-- 告警：已解决 -->
  <div class="content-order"
       style="width:49.5%;height:90px;">
    <div class="fast-wrap">
      <div class="fast-item"
           style="width:100%"
           v-for="(item,index) in orderData"
           :key="index">
        <section class="fast-order"
                 style="width:40%">
          <div class="fast-img"><img :src="item.icon"
                 alt=""></div>
          <div class="fast-content">
            <p class="fast-title text-ellipse">{{item.name}}</p>

            <p class="fast-num text-ellipse"
               :class=" `color-${item.status}`"
               @click="goto(item.menu)">{{item.num}}</p>
          </div>
        </section>
        <section class="fast-details"
                 style="width:60%">
          <a class="fast-details-item"
             v-for="(detailItem,detailIndex) in item.numList"
             :key="detailIndex">
            <p class="fast-details-status"
               :class=" `bg-${detailItem.status}`"></p>
            <p class="fast-details-num text-ellipse"
               :class=" `color-${detailItem.status}`">{{detailItem.num}}</p>
          </a>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import DrawChart from 'src/utils/drawCharts.js'
export default {
  mixins: [DrawChart],
  data () {
    return {
      orderData: [{
        status: 'orange',
        name: '已解决告警',
        menu: '/front/flow/request',
        icon: require('./img/flag-alert-finish.png'),
        num: '0',
        numList: [
          { status: 'red', num: '0' },
          { status: 'orange', num: '0' },
          { status: 'yellow', num: '0' },
          { status: 'blue', num: '0' },
        ]
      }
      ],
    }
  },
  mounted () {
    this.getDatas();
  },
  beforeDestroy () {
  },
  methods: {
    //获得数据
    getDatas () {
      let params = {
        'idcType': this.conditionParams.poolActive,
      };
      this.$api.queryAlertStatus(params).then((res) => {
        this.orderData[0].num = res.resolved.summary;
        this.orderData[0].numList[0].num = res.resolved.serious;
        this.orderData[0].numList[1].num = res.resolved.high;
        this.orderData[0].numList[2].num = res.resolved.medium;
        this.orderData[0].numList[3].num = res.resolved.low;
      })
    }
  }
}
</script>
<style lang='scss' scoped>
@import "./scss/chart.scss";
</style>
