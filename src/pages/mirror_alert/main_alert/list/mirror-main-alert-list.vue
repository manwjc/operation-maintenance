<template>
  <div class="components-container yw-dashboard">
    <!-- tab -->
    <el-tabs class="yw-tabs"
             v-model="activeNames"
             @tab-click="handleClick">
      <el-tab-pane label="活动告警"
                   name="first">
        <mirror-activity-alert v-if="activity"
                               :activity="activity"></mirror-activity-alert>
      </el-tab-pane>
      <el-tab-pane label="确认告警"
                   name="second">
        <mirror-confirm-alert v-if="confirm"
                              :confirmed="confirm"></mirror-confirm-alert>
      </el-tab-pane>
      <el-tab-pane label="解除告警"
                   name="three">
        <mirror-clear-alert v-if="clean"
                            :clean="clean"></mirror-clear-alert>
      </el-tab-pane>
    </el-tabs>
    <!-- tab -->
  </div>
</template>

<script>
import mirrorActivityAlert from 'src/pages/mirror_alert/main_alert/alert/mirror-activity-alert.vue'
import mirrorConfirmAlert from 'src/pages/mirror_alert/main_alert/alert/mirror-confirm-alert.vue'
import mirrorClearAlert from 'src/pages/mirror_alert/main_alert/alert/mirror-clear-alert.vue'
export default {
  name: '/mirror_alert/main_alert/list',
  components: {
    mirrorActivityAlert, mirrorConfirmAlert, mirrorClearAlert
  },
  data () {
    return {
      activeNames: 'first',
      activity: true,
      confirm: false,
      clean: false
    }
  },
  mounted () {
    this.homeStart()
  },
  destroyed () {
  },
  methods: {
    handleClick () {
      if (this.activeNames === 'first') {
        this.activity = true
        this.confirm = false
        this.clean = false
      } else if (this.activeNames === 'second') {
        this.activity = false
        this.confirm = true
        this.clean = false
      } else if (this.activeNames === 'three') {
        this.activity = false
        this.confirm = false
        this.clean = true
      }
    },
    homeStart () {
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

<style lang="scss" scoped>
</style>
