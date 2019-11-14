<template>
  <div class="iframe-wrap">
    <iframe :src="page"
            v-if="page"
            class="iframe"
            scrolling="no"></iframe>
    <div v-else>没找到可用视图</div>
  </div>
</template>
<script>
import iframeObject from 'src/pages/iframe/iframe.js'

export default {
  data () {
    return {
      page: ''
    }
  },
  created () {
    this.page = iframeObject[this.$route.path].page;
  },
  methods: {}
}
</script>
<style>
.iframe {
  width: 100%;
  border-width: 0;
  height: calc(100vh);
}
</style>
