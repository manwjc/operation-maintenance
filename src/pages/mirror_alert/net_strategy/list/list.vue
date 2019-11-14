<template>
  <div class="components-container yw-dashboard">
    <!-- 搜索框 -->
    <section class="yw-search-wrap">
      <YwSearch :searchParams="searchParams"
                @changeSearch="changeSearch"></YwSearch>
    </section>
    <!-- 搜索框 -->

    <!-- tab -->
    <el-tabs class="yw-tabs"
             v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane :label="`${item.label}${item.data}`"
                   tabindex="-1"
                   :name="item.name"
                   v-for="(item,index) in tabData"
                   :key="index">
      </el-tab-pane>
    </el-tabs>
    <!-- tab -->

    <!-- 内容 -->
    <component :is="currentTabComponent"
               :keyword="searchParams.keyword"
               :key="searchParams.keyword"
               :searchParams="searchParams"
               @updateTabData="updateTabData"></component>
    <!-- 内容 -->

  </div>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'
import rbAlertNetworkStrategyFactory from 'src/services/alert/rb-alert-network-strategy.factory'

export default {
  name: '/mirror_alert/net_strategy/list',
  mixins: [QueryObject],
  components: {
    YwSearch: () => import('src/components/common/yw-search.vue'),
    fireWall: () => import('../list/fire-wall.vue'),
    loadBalance: () => import('../list/load-balance.vue'),
    publicNet: () => import('../list/public-net.vue'),
  },
  data () {
    return {
      // tab
      activeName: 'fireWall',
      tabData: [
        { label: '防火墙', data: '(0)', name: 'fireWall' },
        { label: '负载均衡', data: '(0)', name: 'loadBalance' },
        { label: '公网内外映射', data: '(0)', name: 'publicNet' }],

      //组件
      currentTabComponent: 'fireWall',

      //搜索框参数
      searchParams: {
        keyword: '',
        desc: {
          placeholder: '请输入防火墙IP、负载IP、公网IP、内网IP或设备IP',
          bgcolor: '#eff5fc'
        }
      }


    }
  },
  created () {
    this.queryLoadBalance();
    this.queryPublicNet();
  },
  methods: {
    //tab切换
    handleClick (tab, event) {
      this.currentTabComponent = tab.name;
    },

    //搜索框查询
    changeSearch (val) {
      this.searchParams.keyword = val;
      if (this.currentTabComponent !== 'fireWall') {
        this.queryFillWall()
      }
      if (this.currentTabComponent !== 'loadBalance') {
        this.queryLoadBalance()
      }
      if (this.currentTabComponent !== 'publicNet') {
        this.queryPublicNet()
      }
    },

    //更新tab数据
    updateTabData (val, curTab) {
      this.tabData.some((item, index) => {
        if (item.name === curTab) {
          item.data = `(${val})`;
          return true;
        }
      })

    },

    //负载均衡
    queryLoadBalance () {
      //自己查询接口
      rbAlertNetworkStrategyFactory.getLoadBalancerData({ 'keyword': this.searchParams.keyword }).then((res) => {
        this.updateTabData(res.count, 'loadBalance')
      }).finally(() => {
      })
    },

    //公网
    queryPublicNet () {
      rbAlertNetworkStrategyFactory.getPublicNetData({ 'keyword': this.searchParams.keyword }).then((res) => {
        this.updateTabData(res.count, 'publicNet')
      }).finally(() => {
      })
    },
    queryFillWall () {
      let param = {}
      param.keyword = this.searchParams.keyword
      param.name = this.searchParams.name
      param.sourceZone = this.searchParams.sourceZone
      param.destinationZone = this.searchParams.destinationZone
      param.action = this.searchParams.action
      param.destinationAddress = this.searchParams.destinationAddress
      param.sourceAddress = this.searchParams.sourceAddress
      param.servicePort = this.searchParams.servicePort
      rbAlertNetworkStrategyFactory.getFillWallData(param).then((res) => {
        this.updateTabData(res.count, 'fireWall')
      }).finally(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .yw-search-wrap {
  width: 390px;
  margin: 0 auto;
}
/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
}
</style>
