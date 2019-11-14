<template>
    <div class="components-container yw-dashboard">
      <el-tabs class="yw-tabs"
               v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane :key="index"
                     :label="item.label"
                     :name="item.name"
                     v-loading="loadingInfo.loading"
                     v-for="(item,index) in tabData">
        </el-tab-pane>
      </el-tabs>

      <component :is="currentTabComponent"></component>
    </div>
</template>

<script>
  import rbConfigServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
  export default {
    components: {
      instanceDetail: () => import('src/pages/resource/iframe/add/instance-add.vue'),
      changeInfo: () => import('src/pages/resource/iframe/detail/changeInfo.vue'),
      instancePortRelation: () => import('src/pages/resource/iframe/detail/portRelation.vue'),
      alertProgram: () => import('src/pages/resource/iframe/detail/alertProgram.vue'),
      networkCard: () => import('src/pages/resource/iframe/detail/networkCard.vue'),
      approvalInfo: () => import('src/pages/resource/iframe/detail/approval.vue')
    },
    data () {
      return {
        //触发刷新
        triggerQuery: '',
        loadingInfo: {
          loading: false
        },
        activeName: 'instanceDetail',
        nameList: [],
        name: this.$route.query.name,
        tabData: [
          { label: '基本属性信息', name: 'instanceDetail', index: 0 },
          { label: '变更流程管理', name: 'changeInfo', index: 1 },
          { label: '资源关系管理', name: 'instancePortRelation', index: 2 },
          { label: '告警管理信息', name: 'alertProgram', index: 3 },
          { label: '配置项变更记录', name: 'approvalInfo', index: 4 }],
        currentTabComponent: 'instanceDetail',
      }
    },
    mounted () {
      this.getDeviceTypeWithDisplay()
    },
    methods: {
      // 根据实况显示对应的tab页
      showCurrentTab(){
        var flag = false
        var list = this.nameList
        var name = this.name
        for(var i=0;i<list.length;i++) {
          if(name == list[i].value) {
            flag = true
            break
          }
        }
        if(flag) {
          if(name == '物理机') {
            this.tabData.push({ label: '网卡信息', name: 'networkCard', index: 5 })
          } else if(name == '虚拟机') {
            this.tabData.push({ label: '端口信息', name: 'networkCard', index: 5 })
          } else {
            this.tabData.push({ label: '相关信息管理', name: 'networkCard', index: 5 })
          }
        }
      },
      // 获取tab要显示的设备类型
      getDeviceTypeWithDisplay(){
        var params = {
          type: 'device_type_display'
        }
        rbConfigServiceFactory.getDictsByType(params).then((res) => {
          this.nameList = res
          this.showCurrentTab()
        })
      },
      handleClick (tab, event) {
        this.currentTabComponent = tab.name;
        this.activeIndex = tab.index;
      },
      //上一步
      goPrev () {
        if (this.activeIndex > 0) {
          --this.activeIndex;
          this.activeName = this.tabData[this.activeIndex].name;
          this.currentTabComponent = this.tabData[this.activeIndex].name;
        }
      },

      //下一步
      goNext () {
        if (this.activeIndex < this.tabData.length - 1) {
          ++this.activeIndex;
          this.activeName = this.tabData[this.activeIndex].name;
          this.currentTabComponent = this.tabData[this.activeIndex].name;
        }
      },
    }
  }
</script>

<style scoped>

</style>
