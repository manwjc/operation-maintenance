<template>
  <div class="topo">
    <div class="viewer">
      <ViewerSite :defaultOptions="defaultOptions"></ViewerSite>
    </div>
  </div>
</template>

<script>
import ViewerSite from './viewer-site'

export default {
  props: ['defaultOptions'],
  data () {
    return {
      infoList: {}
    }
  },
  components: {
    ViewerSite
  }
}
</script>

<style lang="scss" scoped>
.topo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.viewer {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #e1e1e1;
  overflow: hidden;
}
</style>
