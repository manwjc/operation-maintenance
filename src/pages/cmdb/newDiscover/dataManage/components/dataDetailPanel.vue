<template>
    <el-dialog title="新发现数据详情" :visible.sync="currentShow" @close="resetDialog">
      <el-row>
        <el-col :span="12">
          <el-col :span="6">规则名称</el-col>
          <el-col :span="18">{{currentDetail.ruleName}}</el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6">发现类型</el-col>
          <el-col :span="18">{{currentDetail.discoveryType}}</el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-col :span="6">扫描IP</el-col>
          <el-col :span="18">{{currentDetail.instanceName}}</el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6">采集周期</el-col>
          <el-col :span="18">{{currentDetail.collectCycle}}{{currentDetail.cycleUnit}}</el-col>
          </el-col>
      </el-row><el-row>
      <el-col :span="12">
        <el-col :span="6">发现时间</el-col>
        <el-col :span="18">{{currentDetail.createTime}}</el-col>
      </el-col>
      <el-col :span="12">
        <el-col :span="6">更新时间</el-col>
        <el-col :span="18">{{currentDetail.updateTime}}</el-col>
      </el-col>
    </el-row>
      <el-row>
        <el-col :span="24">
          <el-col :span="6">备注</el-col>
          <el-col :span="18">{{currentDetail.remark}}</el-col>
        </el-col>
      </el-row>
    </el-dialog>

</template>

<script>
  export default {
    name: 'dataDetailPanel',
    props: ['show', 'detail'],
    data () {
      return {
        currentDetail: this.detail,
        currentShow: this.show
      }
    },
    watch: {
      show (val) {
        this.currentShow = val
      },
      detail (val) {
        this.currentDetail = val
      }
    },
    methods: {
      resetDialog () {
        this.currentShow = false
        this.$emit('setShow', 'detail')
      }
    }
  }
</script>

<style scoped>

</style>
