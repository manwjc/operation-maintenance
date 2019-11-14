<template>
    <div class="components-container yw-dashboard" style="padding-left: 0px;padding-right: 0px;">
      <el-tabs class="yw-tabs"
               v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane :key="index"
                     :label="item.label"
                     :name="item.name"
                     v-for="(item,index) in tabData">
        </el-tab-pane>
      </el-tabs>

      <component :is="currentTabComponent"></component>
    </div>
</template>

<script>
  export default {
    components: {
      alertHistory: () => import('src/pages/resource/iframe/detail/alert/alertHistory.vue'),
      alertCurrent: () => import('src/pages/resource/iframe/detail/alert/alertCurrent.vue'),
    },
    data() {
      return {
        activeName: 'alertCurrent',
        tabData: [
          { label: '当前告警', name: 'alertCurrent', index: 0 },
          { label: '历史告警', name: 'alertHistory', index: 1 }],
        currentTabComponent: 'alertCurrent',
      };
    },
    methods: {
      handleClick (tab, event) {
        this.currentTabComponent = tab.name;
      },
    }
  };
</script>

<style scoped>

</style>
