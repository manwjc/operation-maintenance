<template>
  <div>dddddddddddddd</div>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'

export default {
  // name: '/logs/device/list',
  mixins: [QueryObject],
  components: {
    // DialogDetails: () => import('../dialog-details.vue'),
  },
  data () {
    return {

    }
  },
  created () {

    this.query()
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>
