<template>
  <div>
    <rb-mirror-alert-detail :detailType="this.$route.query.detailType"
                            :alertId="this.$route.query.alertId"></rb-mirror-alert-detail>
  </div>
</template>
<script>
  import rbMirrorAlertDetail from 'src/pages/mirror_alert/common/rb-mirror-alert-detail.vue'
  export default {
    components: {
      rbMirrorAlertDetail
    },
    props: [
    ],
    data () {
      return {
      }
    },
    mounted: function () {
    },
    methods: {
    }
  }
</script>
<style scoped lang="scss">
</style>
