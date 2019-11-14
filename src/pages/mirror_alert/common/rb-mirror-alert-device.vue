<template>
  <div  class="components-container yw-dashboard">
    <el-form class="yw-form form-details"
             :inline="true" label-width="100px">
      <el-form-item label="设备序列号">
        {{instanceDetail.device_sn}}
      </el-form-item>
      <el-form-item label="资产编号">
        {{instanceDetail.asset_number}}
      </el-form-item>
      <el-form-item label="维保厂家">
        {{instanceDetail.mainten_factory}}
      </el-form-item>
      <br/>
      <el-form-item label="维保厂商人员">
        {{instanceDetail.mainten_employee}}
      </el-form-item>
      <el-form-item label="维护人员电话">
        {{instanceDetail.ops_phone}}
      </el-form-item>
      <el-form-item label="支持电话">
        {{instanceDetail.mainten_phone}}
      </el-form-item>
      <br/>
      <el-form-item label="维护部门">
        {{instanceDetail.dept_operation}}
      </el-form-item>
      <el-form-item label="服务开始时间">
        {{instanceDetail.online_time}}
      </el-form-item>
      <el-form-item label="服务到期时间">
        {{instanceDetail.maintenance_time}}
      </el-form-item>
      <br/>
      <el-form-item label="使用年限">
        {{instanceDetail.life_period}}
      </el-form-item>
      <el-form-item label="维护人员">
        {{instanceDetail.ops}}
      </el-form-item>
      <el-form-item label="巡检人员">
        {{instanceDetail.inspectors}}
      </el-form-item>
      <br/>
      <el-form-item label="巡检人员电话">
        {{instanceDetail.inspectors_phone}}
      </el-form-item>
      <el-form-item label="业务人员">
        {{instanceDetail.biz_employee}}
      </el-form-item>
      <el-form-item label="业务人员电话">
        {{instanceDetail.biz_employee_phone}}
      </el-form-item>
      <br/>
      <el-form-item label="磁盘大小">
        {{instanceDetail.disk_size}}
      </el-form-item>
      <el-form-item label="外挂磁盘大小">
        {{instanceDetail.mount_disk_size}}
      </el-form-item>
      <el-form-item label="CPU型号和频率">
        {{instanceDetail.cpu_type}}
      </el-form-item>
      <br/>
      <el-form-item label="CPU个数">
        {{instanceDetail.cpu_number}}
      </el-form-item>
      <el-form-item label="CPU核数">
        {{instanceDetail.cpu_core_number}}
      </el-form-item>
      <el-form-item label="内存型号">
        {{instanceDetail.memory_model}}
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {
  },
  props: [
    'instanceDetail'
  ],
  data () {
    return {
    }
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
/deep/ .form-details {
  .el-form-item {
    width:30%;
  }
}
</style>
