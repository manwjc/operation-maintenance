<template>
  <!-- 新增工单 -->
  <div class="content-order"
       style="width:66.2%;height:90px;">
    <div class="fast-wrap">
      <div class="fast-item"
           style="width:32%"
           v-for="(item,index) in orderData"
           :key="index">
        <div class="fast-img"><img :src="item.icon"
               alt=""></div>
        <div class="fast-content">
          <p class="fast-title text-ellipse">{{item.name}}</p>

          <p class="fast-num text-ellipse"
             :class=" `color-${item.status}`"
             @click="goto(item.menu)">{{item.num}}</p>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import rbBpmServiceFactory from 'src/services/bpm/rb-bpm-services.factory.js'
export default {
  props: {
    data: {}
  },
  data () {
    return {
      orderData: [{
        status: 'blue-light',
        name: '今日新增工单',
        menu: '/front/flow/request',
        icon: require('./img/flag-order-new.png'),
        num: '0'
      }, {
        status: 'blue',
        name: '待处理工单',
        menu: '/front/flow/todo',
        icon: require('./img/flag-order-waitResult.png'),
        num: '0'
      }, {
        status: 'blue-dark',
        name: '本周已关闭工单',
        menu: '/front/flow/done',
        icon: require('./img/flag-order-close.png'),
        num: '0'
      }
      ],
    }
  },
  mounted () {
    this.initData()
  },
  beforeDestroy () {
  },
  methods: {
    goto (menu) {
      if (menu !== undefined && menu !== '') {
        let url = sessionStorage.getItem('X7_SERVER_URL');
        url = url.replace('X7_SERVER_URL', sessionStorage.getItem('X7_SERVER_URL'))
        url = url + menu
        window.open(url + '?mirrorToken=' + sessionStorage.getItem('mirror'), '_blank')
        //  window.open('http://10.12.8.194:8085/front/inst/1909041351407025213'+'?mirrorToken=' + sessionStorage.getItem('mirror'), '_blank')
      }
    },
    initData () {
      this.getAccountByParam()
    },
    getAccountByParam () {
      rbBpmServiceFactory.getAccountByParam().then((res) => {
        this.alertNum = res;
        this.orderData[0].num = res.inc;
        this.orderData[1].num = res.todo;
        this.orderData[2].num = res.end;
      })
    }
  }
}
</script>
<style lang='scss' scoped>
@import "./scss/chart.scss";
</style>
