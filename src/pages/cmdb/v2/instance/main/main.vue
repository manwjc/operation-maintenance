<template>
  <el-container class="components-container" v-loading="loading" :element-loading-text="loading_text">
    <el-aside class="yw-dashboard" width="260px">
      <module-tree @changeModuleId="changeModuleId" @showLoading="showLoading" @hideLoading="hideLoading"></module-tree>
    </el-aside>
    <el-main class="yw-dashboard">
      <instance-grid :moduleCondition="moduleCondition"
                     :queryType="queryType" @showLoading="showLoading" @hideLoading="hideLoading"></instance-grid>
    </el-main>
  </el-container>
</template>
<script>
import moduleTree from 'src/pages/cmdb/v2/module/module-tree.vue'
import instanceGrid from 'src/pages/cmdb/v2/instance/list/instance-list.vue'
export default {
  components: {
    moduleTree,
    instanceGrid
  },
  data () {
    return {
      loading: false,
      loading_text: '正在加载数据...',
      moduleCondition: {
        moduleId: '',
        moduleName: ''
      },
      queryType: 'module'
    }
  },
  watch: {
  },
  mounted: function () {
  },
  methods: {
    changeModuleId (val) {
      this.moduleCondition = {
        moduleId: val.module.id,
        moduleName: val.module.name
      }
    },
    showLoading (loading_text) {
      this.loading = true
      if (loading_text) {
        this.loading_text = loading_text
      }
    },
    hideLoading () {
      this.loading = false
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
