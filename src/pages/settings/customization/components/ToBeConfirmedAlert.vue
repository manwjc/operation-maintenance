<template>
  <!-- 待办工单 -->
  <div class="content-order"
       style="width:32.5%;height:90px;">
    <div class="fast-wrap">
      <div class="fast-item"
           style="width:49%"
           v-for="(item,index) in orderData"
           :key="index"
           @click="toHomeAlert(item.name)">
        <div class="fast-img"><img :src="item.icon"
               alt=""></div>
        <div class="fast-content">
          <p class="fast-title text-ellipse">{{item.name}}</p>
          <p class="fast-num text-ellipse"
             :class=" `color-${item.status}`">{{item.num}}</p>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import rbAlertServicesFactory from 'src/services/alert/rb-alert-services.factory.js'
export default {
  props: {
    data: {}
  },
  data () {
    return {
      orderData: [
        {
          status: 'orange',
          name: '活动告警',
          icon: require('./img/flag-alert-waitResult.png'),
          num: '0'
        }, {
          status: 'red',
          name: '确认告警',
          icon: require('./img/flag-alert-finish.png'),
          num: '0'
        }
      ]
    }
  },
  mounted () {
    this.int()
  },
  beforeDestroy () {
  },
  methods: {
    int () {
      this.getAlertNum()
    },
    getAlertNum () {
      rbAlertServicesFactory.getAlertSummary().then((res) => {
        this.orderData[0].num = res.toBeConfirm ? res.toBeConfirm : 0
        this.orderData[1].num = res.confirmed ? res.confirmed : 0

      })
    },
    toHomeAlert (type) {
      let alertType = ''
      if (type === '活动告警') {
        alertType = 'toBeConfirmed'
      } else if (type === '确认告警') {
        alertType = 'toBeResolved'
      }
      this.$router.push({
        path: '/mirror_alert/main_alert/list',
        query: {
          type: alertType
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
@import "./scss/chart.scss";
</style>
