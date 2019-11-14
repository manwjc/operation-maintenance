<template>
  <el-dialog class="yw-dialog"
             width="600px"
             title="基本信息"
             :visible.sync="dialogMsg.dialogVisible">
    <el-form class="yw-form"
             :inline="true"
             :model="result">
      <el-form-item label="设备ip:">
        {{result.ip}}
      </el-form-item>
      <el-form-item label="资源池:">
        {{result.pool_name}}
      </el-form-item>
      <el-form-item label="产生时间:">
        {{result.log_create_time}}
      </el-form-item>
      <el-form-item label="详细信息:">
        {{result.message}}
      </el-form-item>
      <!-- <el-form-item label="设备位置:">
        {{result.idcType}}
      </el-form-item>
      <el-form-item label="设备型号:">
        {{result.idcType}}
      </el-form-item>
      <el-form-item label="sys服务地址:">
        {{result.idcType}}
      </el-form-item>
      <el-form-item label="sys服务端口:">
        {{result.idcType}}
      </el-form-item> -->
    </el-form>
  </el-dialog>

</template>
<script>
import { formatDate } from 'src/assets/js/utility/rb-filters.js'
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
      result: {

      }
    }
  },
  methods: {
    query () {
      this.result = {
        ip: this.dialogMsg.data.ip,
        log_create_time: formatDate(this.dialogMsg.data.log_create_time),
        pool_name: this.dialogMsg.data.pool_name,
        message: this.dialogMsg.data.massage,
      };
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
}
</style>
