<template>
  <div class="components-container yw-dashboard">
    <!-- tab -->
    <el-tabs class="yw-tabs"
             v-model="activeNames"
             @tab-click="handleClick">
      <el-tab-pane label="待确认告警"
                   name="first">
        <alert-list v-if="activity" :alertType="'activity'"  ></alert-list>
      </el-tab-pane>
      <el-tab-pane label="已确认告警"
                   name="second">
        <alert-list v-if="confirm" :alertType="'confirm'" ></alert-list>
      </el-tab-pane>
    </el-tabs>
    <!-- tab -->
  </div>
</template>
<script>
  import alertList from 'src/pages/mirror_alert/alert/list/alert-list.vue'
  export default {
    mixins: [],
    components: {
      alertList
    },
    props: [
    ],
    data () {
      return {
        activeNames: 'first',
        activity: true,
        confirm: false,
      }
    },
    mounted: function () {
    },
    methods: {
      handleClick () {
        if (this.activeNames === 'first') {
          this.activity = true
          this.confirm = false
        } else if (this.activeNames === 'second') {
          this.activity = false
          this.confirm = true
        }
      },
      alertStart () {
        if (this.$route.query.type === 'toBeConfirmed') {
          this.activeNames = 'first'
        } else if (this.$route.query.type === 'toBeResolved') {
          this.activeNames = 'second'
        }
        this.handleClick()
      }
    },
    watch: {
    }
  }
</script>
<style scoped lang="scss">
</style>
