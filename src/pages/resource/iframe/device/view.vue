<template>
  <div class="component-container">
    <commonview :page="page"></commonview>
  </div>
</template>
<script>
  import commonview from 'src/pages/iframe/components/common-view.vue'
  export default {
    components: {
      commonview
    },
    data () {
      return {
        page: this.$route.query.page
      }
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
