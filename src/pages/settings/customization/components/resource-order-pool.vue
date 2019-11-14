<template>
  <!-- 资源：资源池 -->
  <div class="content-order"
       style="width:30%;height:90px;">
    <div class="fast-wrap">
      <div class="fast-item"
           style="width:50%"
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
        name: '资源池',
        icon: require('./img/flag-resource-pool.png'),
        num: '0'
      }, {
        status: 'red',
        name: 'pool池',
        icon: require('./img/pool池.png'),
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
      iframe.getCountIdcAndPod().then((res) => {
        this.orderData[0].num = res.idcCount
        this.orderData[1].num = res.podCount
      })
    }
  }
}
</script>
<style lang='scss' scoped>
@import "./scss/chart.scss";
</style>
