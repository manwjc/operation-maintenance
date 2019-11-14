<template>
  <el-dialog class="yw-dialog" :title="title" :visible.sync="show"  @close="resetDialog" width="450px" v-loading="loading">
    <section class="yw-dialog-main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="yw-form is-required" label-width="120px">
        <el-form-item prop="controlCode" label="控件编码">
          <el-input v-model="ruleForm.controlCode" :disabled="controlId !== ''"></el-input>
        </el-form-item>
        <el-form-item prop="controlName" label="显示名称">
          <el-input v-model="ruleForm.controlName"></el-input>
        </el-form-item>
        <el-form-item prop="isBindSource" label="是否绑定字典值">
          <el-switch v-model="dictSwitch" active-color="#13ce66" active-text="是" inactive-text="否" active-value="是" inactive-value="否"></el-switch>
        </el-form-item>
        <el-form-item prop="sortIndex" label="排序" placeholder="请输入排序序号">
          <el-input-number v-model="ruleForm.sortIndex" :min="1" :max="999999"></el-input-number>
        </el-form-item>
      </el-form>
    </section>
    <section class="btn-wrap">
      <el-button type="primary" @click="submit()">保存</el-button>
      <el-button @click="resetDialog()">取消</el-button>
    </section>
  </el-dialog>
</template>

<script>
  import cmdbCodeService from 'src/services/cmdb/rb-cmdb-code-services.factory'
  import {uniqueControlCodeOrName, isEmptyOrInteger} from '../valid/validate.js'
  export default {
    name: 'control-edit',
    props: ['display', 'controlId'],
    data () {
      return {
        show: this.display,
        title: this.controlId === '' ? '新增控件' : '修改控件',
        dictSwitch: false,
        loading: false,
        dictList: [],
        oldControlName: '',
        ruleForm: {
          controlId: '',
          controlCode: '',
          controlName: '',
          sortIndex: 0,
          isBindSource: ''
        },
        rules: {
          controlCode: [
            { required: true, message: '请输入控件编码', trigger: 'blur' },
            { validator: (rule, value, callback) => uniqueControlCodeOrName(rule, value, callback, value, this.controlId === '' ? 'insert' : 'update'), trigger: 'blur' }
          ],
          controlName: [
            { required: true, message: '请输入控件名称', trigger: 'blur' },
            { validator: (rule, value, callback) => uniqueControlCodeOrName(rule, value, callback, this.oldControlName, this.controlId === '' ? 'insert' : 'update'), trigger: 'blur' }
          ],
          sortIndex: [{ validator: isEmptyOrInteger, trigger: 'blur' }]
        }
      }
    },
    watch: {
      dictSwitch (val) {
        this.ruleForm.isBindSource = val
      }
    },
    methods: {
      getControlInfo () {
        let _t = this
        this.loading = true
        cmdbCodeService.getControlById(this.controlId).then((item) => {
          _t.ruleForm = item
          _t.oldControlName = item.controlName
          _t.dictSwitch = item.isBindSource
        }).catch((item) => {
          _t.$message.error('获取控件详细信息失败')
        }).finally(() => {
          this.loading = false
        })
      },
      resetDialog () {
        this.$refs['ruleForm'].resetFields()
        this.$emit('setDisplay', false)
      },
      submit () {
        let _t = this
        this.$refs['ruleForm'].validate(valid => {
          if (!valid) {
            return false
          }
          _t.loading = true
          cmdbCodeService.saveCodeControl(this.ruleForm).then(function (data) {
            _t.$message.success('保存成功')
            _t.resetDialog()
          }).catch(function (data) {
            _t.$message.error('保存失败')
          }).finally(() => {
            this.loading = false
          })
        })
      }
    },
    mounted: function () {
      if (this.controlId !== '') {
        this.getControlInfo()
      }
    }
  }
</script>
<style lang="scss" scoped>
  /*.el-row {*/
    /*margin-bottom: 5px !important;*/
  /*}*/
  /*.el-form-item {*/
    /*margin-bottom: 0px !important;*/
  /*}*/
  /*.el-dialog__body {*/
    /*padding-top: 5px !important;*/
    /*padding-left: 30px !important;*/
    /*padding-right: 50px !important;*/
    /*padding-bottom: 20px !important;*/
  /*}*/
  /*.el-input {*/
    /*width: 193px !important;*/
  /*}*/
</style>
