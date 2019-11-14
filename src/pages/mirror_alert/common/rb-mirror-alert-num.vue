<template>
  <span v-rubick-status-icon="{status:statusCssMap[status],status_text: '',status_class: statusClass}">
  </span>
</template>
<script>
import Directives from 'src/utils/directives.js'
import { ALERT_LEVEL_CSS_MAP } from 'src/pages/mirror_alert/main/rb-alert.constants.js'
export default {
  mixins: [Directives],
  components: {
  },
  props: [
    'status'
  ],
  data () {
    return {
      statusClass: 'status',
      statusCssMap: ALERT_LEVEL_CSS_MAP
    }
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
.status {
  display: inline-block;
  vertical-align: middle;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;

  &.status-serious {
    background-color: $color-tip-red;
  }
  &.status-high {
    background-color: $color-tip-orange;
  }
  &.status-medium {
    background-color: $color-tip-yellow;
  }
  &.status-low {
    background-color: $color-tip-blue;
  }
}
</style>
