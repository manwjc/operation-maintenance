<template>
  <div>
    <div class="poolEquipment borderRadius">
      <EquipmentPie
        @refreshSecond="refreshSecond"
        @closeThird="closeThird"
      :deviceInfo="deviceInfo"></EquipmentPie>
    </div>
    <div class="poolEquipment borderRadius"  v-if="deviceInfo.showSecond">
      <EquipmentPieAnnular0
        ref="second"
        :deviceInfo="deviceInfo"
        @refreshThird="refreshThird">
      </EquipmentPieAnnular0>
    </div>
    <div class="poolEquipment borderRadius"  v-if="deviceInfo.showThird">
      <EquipmentPieAnnular
        :deviceInfo="deviceInfo"
        ref="third" >
      </EquipmentPieAnnular>
    </div>
  </div>
</template>

<script>
  export default {
    // name: 'deviceMain'
    components: {
      EquipmentPie: () => import('src/pages/resource/iframe/iframeHome/components/equipmentPie.vue'),
      EquipmentPieAnnular0: () => import('src/pages/resource/iframe/iframeHome/components/equipmentPieAnnular0.vue'),
      EquipmentPieAnnular: () => import('src/pages/resource/iframe/iframeHome/components/equipmentPieAnnular.vue')

    },
    data () {
      return {
        deviceInfo: {
          idcType: '',
          deviceType: '',
          projectName: '',
          pod: '',
          showSecond: false,
          showThird: false
        },
      }
    },
    mounted () {
    },
    methods: {
      refreshSecond () {
        this.deviceInfo.showSecond = true
        if (this.$refs['second']) {
          this.$refs['second'].getCountByIdcDevCT()
        }
        // this.$refs['secondColumn'].getCountByIdcPro()
      },
      refreshThird () {
        this.deviceInfo.showThird = true
        if (this.$refs['third']) {
          this.$refs['third'].getCountByIdcPro()
        }
      },
      closeThird() {
        this.deviceInfo.showThird = false
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
  .poolEquipment {
    /*height:40%;*/
    height: 203px;
    width:100%;
    margin-top: 10px;
    background:#fff;
  }

</style>
