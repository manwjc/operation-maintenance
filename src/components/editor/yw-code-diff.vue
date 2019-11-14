<template>
  <!-- 内容对比 -->
  <vueCodeDiff :old-string="oldStr"
               :new-string="newStr"
               :context="10"
               :outputFormat="outputFormat" />
</template>
<script>
import vueCodeDiff from 'vue-code-diff'
export default {
  components: { vueCodeDiff },
  data () {
    return {
      oldStr: 'old code',
      newStr: 'new code',
      outputFormat: 'side-by-side'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
