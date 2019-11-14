<template>
  <div class="component-container">
    <div class="alertNum">
      <div class="alertNumContent">已确认:&nbsp;&nbsp;{{alertNum.confirmCount}}</div>
      <div class="alertNumContent">
        <span><rb-mirror-alert-num :status="1"></rb-mirror-alert-num></span>
        <span class="total">{{alertNum.tip}}</span>
      </div>
      <div class="alertNumContent">
        <span><rb-mirror-alert-num :status="2"></rb-mirror-alert-num></span>
        <span class="total">{{alertNum.low}}</span>
      </div>
      <div class="alertNumContent">
        <span><rb-mirror-alert-num :status="3"></rb-mirror-alert-num></span>
        <span class="total">{{alertNum.medium}}</span>
      </div>
      <div class="alertNumContent">
        <span><rb-mirror-alert-num :status="4"></rb-mirror-alert-num></span>
        <span class="total">{{alertNum.high}}</span>
      </div>
      <div class="alertNumContent">
        <span><rb-mirror-alert-num :status="5"></rb-mirror-alert-num></span>
        <span class="total">{{alertNum.serious}}</span>
      </div>
      <div class="alertNumContent">告警总数:&nbsp;&nbsp;{{alertNum.sum}}</div>
    </div>
    <div style="z-index: 51; margin-top: -12px;">
      <el-tabs v-model="activeNames" @tab-click="handleClick">
        <el-tab-pane label="活动告警" name="first">
          <activity-alert :activity="activity" :alertType="alertType" :operationStatus="operation_status" :alert_Level="activity_alert_level" :requestData="requestData"></activity-alert>
        </el-tab-pane>
        <el-tab-pane label="确认告警" name="second">
          <confirm-alert :confirm="confirm" :alertType="alertType" :operationStatus="operation_status" :alert_Level="confirm_alert_level" :requestData="requestData"></confirm-alert>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import ActivityAlert from 'src/pages/mirror_alert/alert_his/alert/activity-alert.vue'
  import confirmAlert from 'src/pages/mirror_alert/alert_his/alert/confirm-alert.vue'
  import rbMirrorAlertNum from 'src/pages/mirror_alert/common/rb-mirror-alert-num.vue'
  import rbAlertServiceFactory from 'src/services/alert/rb-alert-services.factory.js'
  export default {
    components: {
      ActivityAlert, confirmAlert, rbMirrorAlertNum
    },
    data () {
      return {
        activeNames: 'first',
        confirm: false,
        activity: true,
        operation_status: this.activeNames === 'first' ? 0 : 1,
        confirm_alert_level: 0,
        activity_alert_level: 0,
        alertType: '',
        requestData: {},
        alertNum: {
          sum: 0,
          serious: 0,
          high: 0,
          medium: 0,
          low: 0,
          tip: 0,
          confirmCount: 0
        }
      }
    },
    mounted () {
      if (this.$route.query.alertType === 'main' || this.$route.query.alertType === 'detail') {
        this.alertType = this.$route.query.alertType === 'main' ? 'main' : 'detail'
        this.activeNames = this.$route.query.activeName
        this.operation_status = this.$route.query.operation_status === 2 ? 0 : this.$route.query.operation_status
        this.requestData = this.$route.query.requestData
        if (this.activeNames === 'first') {
          this.confirm = false
          this.activity = true
          this.activity_alert_level = this.$route.query.alert_level
        } else if (this.activeNames === 'second') {
          this.confirm = true
          this.activity = false
          this.confirm_alert_level = this.$route.query.alert_level
        }
      }
      this.getAlertSum()
      if (this.timer) {
        clearInterval(this.timer)
      } else {
        this.timer = setInterval(() => {
          this.getAlertSum()
        }, 30000)
      }
    },
    destroyed () {
      clearInterval(this.timer)
      this.timer = null
    },
    methods: {
      handleClick (tab, event) {
        if (tab.name === 'first') {
          this.confirm = false
          this.activity = true
        } else if (tab.name === 'second') {
          this.confirm = true
          this.activity = false
        }
      },
      getAlertSum () {
        let code = '0,1'
        rbAlertServiceFactory.getAlertCount(code).then((res) => {
          this.alertNum.sum = res.summary
          this.alertNum.serious = res.serious
          this.alertNum.high = res.high
          this.alertNum.medium = res.medium
          this.alertNum.low = res.low
          this.alertNum.tip = res.tip
          this.alertNum.confirmCount = res.confirmed
        })
      }
    },
    watch: {
    }
  }
</script>

<style lang="scss" scoped>
  .alertNum {
    position: relative ;
    top: 3px;
    z-index: 50;
    .alertNumContent {
      float: right;
      padding-left: 20px;
      border-bottom: 2px solid #E5E6E8;
      height: 25px;
      .total {
        margin-left: 4px;
      }
    }
  }
</style>
