<template>
  <!-- 告警所有状态总数组件 -->
  <div class="yw-alert-status-wrap">
    <section class="yw-alert"
             v-for="(item,index) in datas"
             :key="index">
      <div class="fast-order"
           style="width:30%">
        <p class="fast-img"><img :src="item.icon"
               alt=""></p>
        <div class="fast-content">
          <p class="fast-name text-ellipse">{{item.name}}</p>
          <p class="fast-num text-ellipse">{{item.num + ''}}</p>
        </div>
      </div>
      <div class="fast-details"
           style="width:70%">
        <a class="fast-details-item"
           v-for="(subItem,subIndex) in item.numList"
           :key="subIndex">
          <span class="fast-status"
                :class=" `bg-${subItem.status}`"></span>
          <span class="fast-status-num text-ellipse"
                :class=" `color-${subItem.status}`">{{subItem.num}}</span>
        </a>
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
      //  {          name: '已解除',
      //       icon: require('src/assets/theme/dark/img/alert-finish-release.png'),
      //       num: 0,
      //       numList: [
      //         { status: 'red', num: '0' },
      //         { status: 'orange', num: '0' },
      //         { status: 'yellow', num: '0' },
      //         { status: 'blue', num: '0' },
      //       ]
      //     }
      // ],
    }
  },
  methods: {

  },

}
</script>
<style lang="scss" scoped>
.yw-alert-status-wrap {
  width: 100%;
  height: 100%;
  .yw-alert {
    display: flex;
    justify-content: center;
    height: 24%;
    padding: 10px 0;
    // padding: 15px 0;
    color: $color-base;
    &:nth-child(even) {
      background: $color-blue;
    }
    .fast-order {
      text-align: center;
    }
    .fast-img {
      display: inline-block;
      vertical-align: middle;
      width: rem(24);
      height: auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .fast-content {
      display: inline-block;
      vertical-align: middle;
      width: 60%;
      text-align: left;
    }
    .fast-details {
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-left: 1px solid $color-tip-blue;
      .fast-details-item {
        display: inline-block;
        width: 20%;
      }
    }
    .fast-status {
      display: inline-block;
      vertical-align: middle;
      width: 8px;
      height: 8px;
      border-radius: 100%;
    }
    .fast-status-num {
      width: 70%;
      font-size: $font-14;
    }
    .fast-name {
      font-size: $font-14;
    }
    .fast-num {
      font-size: $font-16;
    }
  }
}
</style>
