<template>
  <!-- 工单 -->
  <div class="yw-order-wrap">
    <section class="yw-order"
             v-for="(item,index) in datas"
             :key="index">
      <div class="fast-img"><img :src="item.icon"
             alt=""></div>
      <div class="fast-content">
        <p class="fast-name text-ellipse">{{item.name}}</p>
        <p class="fast-num text-ellipse">{{item.num}}<span class="fast-desc">/{{item.timeDesc}}</span><span class="fast-time">{{item.date}}</span></p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: ['datas'],
  data () {
    return {
      // datas: [
      //   {
      //     name: '待处理',
      //     icon: '',
      //     num: 150,
      //     time: 20
      //   }
      // ],
    }
  },
  methods: {

  },

}
</script>
<style lang="scss" scoped>
.yw-order-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  .yw-order {
    display: inline-block;
    width: 160px;
    .fast-img {
      display: inline-block;
      vertical-align: middle;
      width: rem(60);
      height: auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .fast-content {
      display: inline-block;
      vertical-align: middle;
      width: rem(160 - 65);
    }
    .fast-name {
      font-size: $font-16;
      color: $color-base;
    }
    .fast-num {
      font-size: $font-24;
      color: $color-tip-blue-light;
    }
    .fast-desc {
      font-size: $font-14;
      color: $color-base;
    }
    .fast-time {
      font-size: $font-14;
      color: $color-tip-red;
    }
  }
}
</style>
