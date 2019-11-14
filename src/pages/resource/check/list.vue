<template>
  <div class="components-container">
    <!-- tab -->
    <section class="components-section tab-section">
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane :label="item.label"
                     :name="item.name"
                     v-for="(item,index) in tabData"
                     :key="index">
        </el-tab-pane>
      </el-tabs>
      <keep-alive>
        <component :is="currentTabComponent"></component>
      </keep-alive>
      <ul class="step-wrap">
        <li class="step-item"
            @click="goPrev()">上一步</li>
        <li class="step-item"
            @click="goNext()">下一步</li>
      </ul>
    </section>
    <!-- tab -->

  </div>
</template>

<script>

export default {
  name: '/resource/check',
  components: {
    deviceInfo: () => import('src/pages/resource/deviceInfo/list.vue'),
    repairInfo: () => import('src/pages/resource/repairInfo/list.vue'),
    problemEvent: () => import('src/pages/resource/problemEvent/list.vue'),
    equipmentProblem: () => import('src/pages/resource/equipmentProblem/list.vue')

  },
  data () {
    return {
      // tab
      activeName: 'deviceInfo',
      activeIndex: 0,
      tabData: [
        { label: 'IT设备量信息录入', name: 'deviceInfo', index: 0 },
        { label: '维修事件信息录入', name: 'repairInfo', index: 1 },
        { label: '故障事件信息录入', name: 'problemEvent', index: 2 },
        { label: '设备问题信息录入', name: 'equipmentProblem', index: 3 }],
      currentTabComponent: 'deviceInfo'
    }
  },
  created () {

  },
  methods: {
    handleClick (tab, event) {
      this.currentTabComponent = tab.name;
      this.activeIndex = tab.index;
    },
    goPrev () {
      if (this.activeIndex > 0) {
        --this.activeIndex;
        this.activeName = this.tabData[this.activeIndex].name;
        this.currentTabComponent = this.tabData[this.activeIndex].name;
      }

    },
    goNext () {
      if (this.activeIndex < this.tabData.length - 1) {
        ++this.activeIndex;
        this.activeName = this.tabData[this.activeIndex].name;
        this.currentTabComponent = this.tabData[this.activeIndex].name;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step-wrap {
  position: absolute;
  top: 15px;
  right: 20px;
  .step-item {
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
