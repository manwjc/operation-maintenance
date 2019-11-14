<template>
  <!-- 配置文件详情 -->
  <el-dialog class="yw-dialog"
             width="600px"
             title="配置信息"
             :visible.sync="dialogMsg.dialogVisible">
    <div class="yw-content space-pre"
         v-html="result"></div>
  </el-dialog>

</template>
<script>
export default {
  props: ['dialogMsg'],
  watch: {
    dialogMsg: {
      handler (val, oldVal) {
        if (val.dialogVisible) {
          this.query();
        }

      },
      deep: true
    }
  },
  data () {
    return {
      // dialogMsg: {
      //   id: '',//每个弹窗数据的唯一标识
      //   dialogVisible: false,
      // }
      result: ''
    }
  },
  methods: {
    query () {
      this.result = this.dialogMsg.data.massage;
      this.result = this.result.replace(/\n/g, '<br />')

      // let queryParams = {
      //   'idc': this.dialogMsg.data.pool,
      //   'deviceIp': this.dialogMsg.data.ip,
      // };
      // this.rbHttp.sendRequest({
      //   method: 'GET',
      //   url: `/v1/cmdb/instance/queryDeviceByRoomAndIP`,
      //   params: queryParams,
      // }).then((res) => {
      //   this.result = res;
      //   return res
      // });
    },

  }
}

</script>
<style lang="scss" scoped>
.yw-dialog {
  /deep/ .yw-form {
    max-height: 400px;
    overflow-y: auto;
    .el-form-item {
      display: block;
      border-bottom: 1px dashed #eee;
    }
    .el-form-item__label {
      font-weight: bold;
      min-width: 82px;
      text-align: left;
    }
    .el-form-item__content {
      width: 80%;
    }
  }

  .yw-content {
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>
