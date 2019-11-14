<template>
  <div class="iframeHome">
    <div class="component-edit-button"
         @click="goEdit">
      <i class="el-icon-edit-outline"></i>定制首页看板
    </div>
    <div class="iframeHomeUp">
      <div class="iframeHomeUpLeft">
        <div class="up borderRadius">
          <Pool></Pool>
        </div>
      </div>
      <div class="iframeHomeUpRight">
        <div class="down borderRadius">
          <Equipment></Equipment>
        </div>
      </div>
    </div>

    <!--<div class="poolEquipment borderRadius">-->
    <!--<EquipmentPie @func="getMsgFormSon"></EquipmentPie>-->
    <!--</div>-->
    <!-- 各资源池设备分布下钻 -->
    <!--<div class="poolEquipment borderRadius" v-if="sendAnnular">-->
    <!--<EquipmentPieAnnular0  @func0="getMsgFormSon0"></EquipmentPieAnnular0>-->
    <!--</div>-->
    <!--<div class="poolEquipment borderRadius" v-if="sendAnnular0">-->
    <!--<EquipmentPieAnnular></EquipmentPieAnnular>-->
    <!--</div>-->

    <DeviceMain></DeviceMain>
    <!--各资源池租户分布-->
    <BizMain></BizMain>

    <div class="iframeHomeDown">
      <div class="iframeHomeDownLeft">
        <div class="up borderRadius">
          <div :is="leftUp"></div>
        </div>
        <div class="down borderRadius">
          <div :is="leftDown"></div>
        </div>
      </div>
      <div class="iframeHomeDownRight">
        <div class="up borderRadius">
          <div :is="rightUp"></div>
        </div>
        <div class="down borderRadius">
          <div :is="rightDown"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>


import Pool from './components/pool'
import Equipment from './components/equipment'
import EquipmentPie from './components/equipmentPie'
import EquipmentPieAnnular from './components/equipmentPieAnnular'
import EquipmentPieAnnular0 from './components/equipmentPieAnnular0'
import TenantTypeColumn from './components/tenantTypeColumn'
import PoolTypeColumn from './components/poolTypeColumn'
import PoolTenantPie from './components/poolTenantPie'
import PoolTenantAnnular from './components/poolTenantAnnular'
import EquipmentLine from './components/equipmentLine'
import BusinessColumn from './components/businessColumn'

import Bus from '../iframeHome/components/middleKey/bus'
import Bus0 from '../iframeHome/components/middleKey/bus0'
import EBus from '../iframeHome/components/middleKey/eBus'
import PoolBus from '../iframeHome/components/middleKey/poolBus'
import AnBus from '../iframeHome/components/middleKey/anBus'
import KeyBus from '../iframeHome/components/middleKey/keyBus'

export default {
  name: '/resource/iframe/iframeHome',
  data () {
    return {
      sendSonMessage: false,
      sendAnnular: false,
      sendAnnular0: false,
      sendSonMessage0: false,
      leftUp: EquipmentLine,
      leftDown: BusinessColumn,
      rightUp: TenantTypeColumn,
      rightDown: PoolTenantAnnular
    }
  },
  components: {
    Pool,
    Equipment,
    EquipmentPie,
    EquipmentPieAnnular,
    EquipmentPieAnnular0,
    TenantTypeColumn,
    PoolTypeColumn,
    PoolTenantPie,
    PoolTenantAnnular,
    EquipmentLine,
    BusinessColumn,
    BizMain: () => import('src/pages/resource/iframe/iframeHome/components/bizMain.vue'),
    DeviceMain: () => import('src/pages/resource/iframe/iframeHome/components/deviceMain.vue')
  },
  created () {
  },
  mounted () {
    let that = this
    Bus.$on('txt', function (val) {//监听first组件的txt事件  // 父到子
      that.sendSonMessage = val
    })
    EBus.$on('txt1', function (val) {//监听first组件的txt事件  // 子到父
      that.sendSonMessage = val
    })
    PoolBus.$on('txt0', function (val) {//监听first组件的txt事件  // 父到子
      that.sendSonMessage0 = val
    })
    AnBus.$on('txt1', function (val) {//监听first组件的txt事件  // 子到父
      that.sendAnnular = val
    })
    Bus0.$on('txt', function (val) {//监听first组件的txt事件  // 子到父
      that.sendAnnular0 = val
    })
    KeyBus.$on('txt', function (val) {//监听first组件的txt事件  // 子到父
      that.sendSonMessage0 = val
    })
  },
  methods: {
    //编辑页
    goEdit () {
      this.$router.push({ path: '/settings/customization/edits' })
    },
    getMsgFormSon (val) {
      this.sendAnnular = val
    },
    getMsgFormSon0 (val) {
      this.sendAnnular0 = val
    },
  }
}

</script>
<style lang="scss" scoped>
.body {
  background: red;
}
.iframeHome {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-box-shadow: rgba(4, 0, 0, 0.13) 0px 0px 8px;
  -moz-box-shadow: rgba(4, 0, 0, 0.13) 0px 0px 8px;
  box-shadow: rgba(4, 0, 0, 0.13) 0px 0px 10px;
  .borderRadius {
    border-radius: 6px;
    border: 0.5px solid rgba(4, 0, 0, 0.13);
    -webkit-box-shadow: rgba(4, 0, 0, 0.13) 0px 0px 8px;
    -moz-box-shadow: rgba(4, 0, 0, 0.13) 0px 0px 8px;
    box-shadow: rgba(4, 0, 0, 0.13) 0px 0px 10px;
  }
  .iframeHomeUp {
    width: 100%;
    height: 15%;
    .iframeHomeUpLeft {
      float: left;
      width: 34%;
      height: 100%;
      .up {
        height: 100%;
        width: 100%;
        background: #fff;
      }
    }
    .iframeHomeUpRight {
      float: right;
      width: 65%;
      height: 100%;
      .down {
        height: 100%;
        width: 100%;
        background: #fff;
      }
    }
  }

  /*.poolEquipment {*/
  /*height:40%;*/
  /*width:100%;*/
  /*margin-top: 10px;*/
  /*background:#fff;*/
  /*}*/
  /*.tenantsEquipment {*/
  /*height:40%;*/
  /*width:100%;*/
  /*margin-top: 10px;*/
  /*background:#fff;*/
  /*}*/
  .iframeHomeDown {
    width: 100%;
    height: 70%;
    margin-top: 1%;
    margin-bottom: 2%;
    .iframeHomeDownLeft {
      float: left;
      width: 65%;
      height: 100%;
      .up {
        width: 100%;
        height: 49.5%;
        background: #fff;
      }
      .down {
        width: 100%;
        height: 49.5%;
        background: #fff;
        margin-top: 10px;
      }
    }
    .iframeHomeDownRight {
      float: right;
      width: 34%;
      height: 100%;
      .up {
        width: 100%;
        height: 49.5%;
        background: #fff;
      }
      .down {
        width: 100%;
        height: 49.5%;
        background: #fff;
        margin-top: 10px;
      }
    }
  }
}
</style>
