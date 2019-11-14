<template>
  <!-- 告警最新热点组件 -->
  <el-scrollbar class="yw-scrollbar scroll-y dark"
                style="height:100%">
    <div class="yw-alert-hot-wrap">
      <section class="yw-alert"
               v-for="(item,index) in datas"
               :key="index">
        <div class="fast-order"
             style="width:30%">
          <p class="fast-status"
             :class=" `bg-${item.status}`">{{item.statusName}}</p>
        </div>
        <div class="fast-details"
             style="width:70%">
          <p class="fast-name text-ellipse">{{item.name}}</p>
          <p class="fast-desc text-ellipse">{{item.desc}}</p>
          <p class="fast-date text-ellipse">{{item.date}}</p>
        </div>
      </section>
    </div>
  </el-scrollbar>

</template>

<script>

export default {
  props: ['datas'],
  components: {

  },
  data () {
    return {
      // datas: [
      //  {          name: '待确认',
      //       icon: require('src/assets/theme/dark/img/alert-wait-confirm.png'),
      //       num: 0,
      //       serious: 0,
      //       high: 0,
      //       middle: 0,
      //       low: 0,
      //     }
      // ],
    }
  },
  methods: {

  },

}
</script>
<style lang="scss" scoped>
.yw-alert-hot-wrap {
  width: 100%;
  min-height: 100%;
  .yw-alert {
    display: flex;
    justify-content: center;
    height: 25%;
    padding: 5px 0;
    color: $color-base;
    &:nth-child(even) {
      background: $color-blue;
    }
  }
  .fast-order {
    text-align: center;
  }
  .fast-details {
    padding-right: 15px;
  }
  .fast-status {
    display: inline-block;
    width: 50px;
    height: 24px;
    line-height: 24px;
    border-radius: $border-radius;
    text-align: center;
    font-size: $font-14;
  }
  .fast-name {
    font-size: $font-14;
  }
  .fast-desc {
    font-size: $font-12;
    color: $color-blue-xs;
  }
  .fast-date {
    font-size: $font-12;
    color: $color-blue-xs;
  }
}
</style>
