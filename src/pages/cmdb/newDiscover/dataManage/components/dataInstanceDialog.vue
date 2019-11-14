<template>
    <el-dialog :visible.sync="currentShow" @close="resetDialog">
      <add-instance :discoveryModuleId="currentModuleId"
                    :discoveryLog="detail"
                    :type="'discovery'"
                    :show="currentShow"
                    @childBindAdd="resetDialog"
                    ref="addInstance"></add-instance>
    </el-dialog>
</template>

<script>
  import addInstance from './addInstance'

  export default {
    name: 'dataInstanceDialog',
    props: ['show', 'detail', 'moduleId'],
    components: {
      addInstance
    },
    data () {
      return {
        currentDetail: this.detail,
        currentShow: this.show,
        currentModuleId: this.moduleId
      }
    },
    watch: {
      show (val) {
        this.currentShow = val
      },
      detail (val) {
        this.currentDetail = val
      },
      moduleId (val) {
        this.currentModuleId = val
      }
    },
    methods: {
      resetDialog () {
        this.currentShow = false
        this.$emit('setShow', 'instance')
      }
    }
  }
</script>

<style scoped>

</style>
