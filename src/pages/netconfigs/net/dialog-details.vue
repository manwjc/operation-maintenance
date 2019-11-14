<template>
  <el-dialog class="yw-dialog"
             width="600px"
             title="基本信息"
             :visible.sync="dialogMsg.dialogVisible">
    <el-form class="yw-form"
             :inline="true"
             :model="result"
             v-if="result">
      <el-form-item label="IP地址:">
        {{result.ip}}
      </el-form-item>
      <!-- <el-form-item label="是否资源池:">
        {{result.isPool}}
      </el-form-item> -->
      <el-form-item label="资源池:">
        {{result.idcType}}
      </el-form-item>
      <el-form-item label="设备名称:">
        {{result.deviceName}}
      </el-form-item>
      <el-form-item label="运行状态:">
        {{result.deviceStatus}}
      </el-form-item>
      <el-form-item label="是否分配:">
        {{result.isAssigned}}
      </el-form-item>
      <el-form-item label="业务系统:">
        {{result.bizSystem}}
      </el-form-item>
      <el-form-item label="ansible管理:">
        {{result.isAnsible}}
      </el-form-item>

      <el-form-item label="设备类型:">
        {{result.deviceClass}} - {{result.deviceType}} - {{result.deviceClass3}}
      </el-form-item>
      <el-form-item label="设备厂商:">
        {{result.deviceMfrs}}
      </el-form-item>
      <el-form-item label="设备位置:">
        {{result.roomId}} - {{result.idcCabinet}}
      </el-form-item>

      <el-form-item label="系统类型:">
        {{result.deviceOsType}}
      </el-form-item>
      <el-form-item label="系统版本:">
        {{result.osDetailVersion}}
      </el-form-item>
      <el-form-item label="项目名称:">
        {{result.projectName}}
      </el-form-item>
      <el-form-item label="POD名称:">
        {{result.podName}}
      </el-form-item>
      <el-form-item label="应用部门:">
        {{result.department1}} - {{result.department2}}
      </el-form-item>

      <el-form-item label="维护部门:">
        {{result.deptOperation}}
      </el-form-item>
      <el-form-item label="维护人员:">
        {{result.ops}}
      </el-form-item>
      <el-form-item label="录入人员:">
        {{result.insertPerson}}
      </el-form-item>
      <el-form-item label="录入时间:">
        {{result.insertTime}}
      </el-form-item>
      <el-form-item label="更新人员:">
        {{result.updatePerson}}
      </el-form-item>
      <el-form-item label="更新时间:">
        {{result.updateTime}}
      </el-form-item>
    </el-form>
    <div class="dialog-empty"
         v-else>暂无数据</div>
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
      let queryParams = {
        'idc': this.dialogMsg.data.pool,
        'deviceIp': this.dialogMsg.data.ip,
        // 'idc': '',
        // 'deviceIp': '10.12.70.38'
      };
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/instance/queryDeviceByRoomAndIP`,
        params: queryParams,
      }).then((res) => {
        this.result = res;
        return res
      });
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
  }
}
</style>
