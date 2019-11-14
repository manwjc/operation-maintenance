<template>
  <div class="navbar-card">
    <div v-for="(item, index) of menu.children"
         :key="index"
         class="submenu">
      <p class="submenu__title">{{ item.name }}</p>
      <ul class="submenu__list">
        <li v-for="(i, idx) of item.children"
            :key="`${index}${idx}`"
            class="submenu__item"
            @click="toRoute(i, item)">{{ i.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavbarCard',
  props: {
    menu: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {
    toRoute (item, parent) {
      this.$emit('toRoute', { item, parent, menu: this.menu })
    }
  }
}
</script>
<style lang='scss' scoped>
body > .el-menu--horizontal {
  max-width: 100% !important;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.navbar-card {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 10px;
  background: #fff;
  .submenu {
    padding: 0 10px;
    width: 140px;
    box-sizing: border-box;
    &__title {
      color: #1f89da;
      font-size: 14px;
      height: 55px;
      line-height: 55px;
      border-bottom: 1px solid #e1e6ec;
    }
    &__list {
      padding: 10px 0;
    }
    &__item {
      padding: 10px 5px;
      font-size: 12px;
      &:hover {
        color: #1f89da;
        background: #f2f2f2;
        cursor: pointer;
      }
    }
    &__item.active {
      color: #1f89da;
      background: #f2f2f2;
    }
  }
  // .submenu + .submenu {
  //   margin-left: 28px;
  // }
}
</style>
