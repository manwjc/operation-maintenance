<template>
  <div class="site">
    <section class="body">
      <components :defaultOptions="defaultOptions"
                  :is="activeName"></components>
    </section>
  </div>
</template>

<script>
import SiteTopo from '../components/site-topo'

export default {
  // props: ['defaultOptions'],
  watch: {
    defaultOptions () {
      this.activeName = 'site-topo'
    }
  },
  data () {
    return {
      // defaultOptions: JSON.parse(this.$route.query.defaultOptions),
      // defaultOptions: JSON.parse(this.$route.query.defaultOptions),
      activeName: 'site-topo'
    }
  },
  computed: {
    title () {
      return this.defaultOptions.name
    },
    defaultOptions () {
      return this.$route.query
    }
  },
  mounted: function () {
    // console.log(this.$route.query)
  },
  components: {
    SiteTopo
  },
  methods: {
    handleClick () {
    }
  }
}
</script>

<style lang="scss" scoped>
.site {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.body {
    flex: 1;
    width: 100%;
    height: 100%;
    & > * {
      padding: 10px 0;
    }
  }
</style>
