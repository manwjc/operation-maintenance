<template>
  <div class="component-container">
    <iframe :src="page"
            v-if="page"
            class="iframe"
            scrolling="no"></iframe>
    <div v-else>没找到可用视图</div>
  </div>
</template>
<script>
  import commonview from 'src/pages/iframe/components/common-view.vue'
  export default {
    props: ['page'],
    components: {
      commonview
    },
    data () {
      return {
        page: this.page
      }
    },
    mounted () {
      this.page = this.$route.query.page
//      console.log(this.page);
    }
  }
</script>
<style>
  .iframe {
    width: 100%;
    border-width: 0;
    height: calc(100vh);
  }
</style>
