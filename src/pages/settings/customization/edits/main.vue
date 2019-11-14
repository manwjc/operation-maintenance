<template>
  <!-- 定制化：内容 -->
  <div class="container-main">
    <!-- 后续内容多样化扩展 -->
    <component :is="activeComponent"></component>
  </div>
</template>

<script>
export default {
  // mixins: [DrawChart],
  components: {
    CommonDrag: () => import('./commonDrag.vue'),
  },
  data () {
    return {
      //活动组件
      activeComponent: 'CommonDrag'
    }
  },
  computed: {
    dragOptionsMain () {
      return {
        animation: 0,
        group: "chartGroup",
      };
    }
  },
  methods: {

  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
.container-main {
  width: 100%;
  min-height: 100%;
}
</style>
