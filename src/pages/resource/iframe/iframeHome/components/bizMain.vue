<template>
  <div>
    <div class="tenantsEquipment borderRadius">
      <!--租户分布一级（饼图 柱状）-->
      <EquipmentTypePie
        :zuInfo="zuInfo"
        @closeDep2="closeDep2"
        @showDep2="showDep2">
      </EquipmentTypePie>
    </div>
    <div class="tenantsEquipment borderRadius" v-if="show">
      <DetailColumnSubordinate
        ref="dep2"
        :zuInfo="zuInfo"
        >
      </DetailColumnSubordinate>
    </div>
  </div>
  <!--<div class="tenantsEquipment borderRadius">-->
    <!--&lt;!&ndash;租户分布一级（饼图 柱状）&ndash;&gt;-->
    <!--<EquipmentTypePie-->
      <!--:zuInfo="zuInfo"-->
      <!--@closeDep2="closeDep2"-->
      <!--@showDep2="showDep2">-->
    <!--</EquipmentTypePie>-->
    <!--&lt;!&ndash; 租户分布二级（点击一级部门下钻） &ndash;&gt;-->
    <!--<DetailColumnSubordinate-->
      <!--v-if="show"-->
      <!--ref="dep2"-->
      <!--:zuInfo="zuInfo">-->
    <!--</DetailColumnSubordinate>-->
    <!--&lt;!&ndash;<div class="tenantsEquipment borderRadius">&ndash;&gt;-->
    <!--&lt;!&ndash;&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
  <!--</div>-->
</template>

<script>
  export default {
    // name: 'BizMain'
    components: {
      EquipmentTypePie: () => import('src/pages/resource/iframe/iframeHome/components/equipmentTypePie.vue'),
      DetailColumnSubordinate: () => import('src/pages/resource/iframe/iframeHome/components/detailColumnSubordinate.vue'),
    },
    data () {
      return {
        zuInfo: {
          idcType: '',
          department1: '',
          department2: '',
          bizSystem: ''
        },
        show: false
      }
    },
    mounted () {
      // let that = this
      // Bus.$on('txt',function(val){//监听first组件的txt事件  // 父到子
      //   that.sendSonMessage = val
      // })
      // EBus.$on('txt1',function(val){//监听first组件的txt事件  // 子到父
      //   that.sendSonMessage = val
      // })
    },
    methods: {
      closeDep2() {
       this.show = false
      },
      showDep2 () {
        this.show = true
        if (this.$refs['dep2']) {
          this.$refs['dep2'].getCountBizByIdcDep2()
          this.$refs['dep2'].getCountByIdcDep2Biz()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .borderRadius {
    border-radius: 6px;
    border:0.5px solid rgba(4,0,0,0.13);
    -webkit-box-shadow: rgba(4,0,0,0.13) 0px 0px 8px;
    -moz-box-shadow: rgba(4,0,0,0.13) 0px 0px 8px;
    box-shadow: rgba(4,0,0,0.13) 0px 0px 10px;

  }

  .tenantsEquipment {
    height: 203px;
    width:100%;
    margin-top: 10px;
    overflow: hidden;
    background:#fff;
  }

</style>
