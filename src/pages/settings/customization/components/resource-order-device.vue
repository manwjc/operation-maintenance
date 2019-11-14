<template>
  <!-- 资源：设备量 -->
  <div class="content-order"
       style="width:69%;height:90px;">
    <div class="fast-wrap">
      <div class="fast-item"
           style="width:25%"
           v-for="(item,index) in orderData"
           :key="index">
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
import iframe from 'src/services/iframe/iframe.js'

export default {
  props: {
    data: {}
  },
  data () {
    return {
      orderData: [{
        status: 'orange',
        name: '服务器设备 的等待',
        icon: require('./img/flag-resource-server.png'),
        num: '0'
      }, {
        status: 'red',
        name: '网络设备',
        icon: require('./img/flag-resource-network.png'),
        num: '0'
      }, {
        status: 'red',
        name: '存储设备',
        icon: require('./img/flag-resource-memory.png'),
        num: '0'
      }, {
        status: 'red',
        name: '安全设备',
        icon: require('./img/flag-resource-safe.png'),
        num: '0'
      }
      ]
    }
  },
  mounted () {
    this.getData()
  },

  methods: {
    getData () {
      iframe.getCountDeviceByDeviceClass().then((res) => {
        this.orderData[0].num = res.serverNumber
        this.orderData[1].num = res.networkNumber
        this.orderData[2].num = res.safeNumber
        this.orderData[3].num = res.storageNumber
      })
    }
}
}
</script>
<style lang='scss' scoped>
@import "./scss/chart.scss";
</style>
