<template>
    <div style="height: 100%">
      <el-steps :active="active" simple>
        <el-step title="基本属性" icon="el-icon-edit"></el-step>
        <el-step title="字段设置" icon="el-icon-upload"></el-step>
      </el-steps>
        <base-field ref="base" style="height: calc(100vh - 200px)"  @next="next"  @setShow="setShow" :parentForm="form" v-if="active === 1"></base-field>
        <other-fields style="height: calc(100vh - 200px)"  ref="otherField" @setShow="setShow" :parentForm="form" v-if="active === 2"></other-fields>
    </div>
</template>

<script>
// import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
import BaseField from './base-field'
import OtherFields from './other-field'
import ModuleReltaion from './module-relation'
import rbCmdbModuleServiceFactory from 'src/services/cmdb/rb-cmdb-module-service.factory.js'

export default {
  name: 'test',
  components: {ModuleReltaion, OtherFields, BaseField},
  props: ['parentId', 'state', 'moduleId'],
  data () {
    return {
      active: 1,
      loading: false,
      testForm: '',
      moduleInfo: {},
      form: {
        state: this.state,
        baseFields: {
          id: this.state === 'edit' || this.state === 'copy' ? this.moduleId : '',
          parentId: this.state === 'edit' || this.state === 'copy' ? this.parentId : '',
          name: '',
          code: '',
          iconUrl: '',
          tags: []
        },
        otherFields: {
          module: {id: this.state === 'edit' || this.state === 'copy' ? this.moduleId : ''},
          groupList: []
        }
      }
    }
  },
  watch: {
  },
  methods: {
    save () {
    },
    setShow (val) {
      this.$emit('setShow', val)
    },
    submit () {
      switch (this.active) {
        case 1 : this.$refs['base'].onSubmit()
          this.next()
          break
      }
    },
    reset () {
      switch (this.active) {
        case 1 : this.$refs['base'].resetForm()
      }
    },
    back () {
      this.active--
    },
    next (val) {
      this.active = val
      // if (this.active < 2) {
      //   this.active++
      // }
    }
  },
  mounted: function () {
    if (this.state === 'edit' || this.state === 'copy') {
      rbCmdbModuleServiceFactory.getModuleDetail(this.moduleId).then((data) => {
        this.moduleInfo = data
        let module = this.moduleInfo.module
        if (this.state === 'copy') {
          this.form.baseFields.tags = []
          this.form.baseFields.id = module.id
          this.form.baseFields.parentId = module.parentId
        } else {
          this.form.baseFields.tags = []
          this.form.baseFields.id = module.id
          this.form.baseFields.code = module.code
          this.form.baseFields.iconUrl = module.iconUrl
          this.form.baseFields.parentId = module.parentId
          this.form.baseFields.name = module.name
          this.form.otherFields.module.id = this.moduleInfo.module.id
          this.form.otherFields.groupList = this.moduleInfo.groupList
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
