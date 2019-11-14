<template>
  <div class="component-container">
    <!-- <keep-alive v-if="!this.$store.state.homeStore.refresh">
      <commonview></commonview>
    </keep-alive>
    <commonview v-if="this.$store.state.homeStore.refresh"
                :key="$route.fullPath"></commonview> -->
    <commonview></commonview>

  </div>
</template>
<script>
import commonview from 'src/pages/iframe/components/common-view.vue'

export default {
  // name: '/iframe/report/big-screen',
  components: {
    commonview,

  },
  data () {
    return {
      keepAliveIframe: ''
    }
  },
  created () {

  },
  methods: {},



}
</script>
<style lang="scss" scoped>
.iframe {
  width: 100%;
  border-width: 0;
  height: calc(100vh);
}
</style>
