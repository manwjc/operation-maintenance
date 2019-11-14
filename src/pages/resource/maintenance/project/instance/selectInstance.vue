<template>
  <el-dialog class="yw-dialog"
             width="1000px"
             title="新增关联设备"
             :visible.sync="dialogMsg.dialogVisible">
    <section class="yw-dialog-main">
      <el-form class="yw-form components-condition"
               :inline="true"
               :model="formData"
               label-width="80px">
        <el-form-item label="设备序列号">
          <el-input v-model="formData.deviceSn"
                    placeholder="请输入设备序列号"></el-input>
          <el-button type="primary"
                     @click="queryDeviceSn()"
                     :disabled="can_search">查询</el-button>
        </el-form-item>
      </el-form>
      <el-form class="yw-form"
               :inline="true">
        <div class="table-operate-wrap clearfix">
          <el-button class="btn-icons-wrap"
                     type="text"
                     icon="el-icon-check"
                     @click="commit">提交</el-button>
          <el-button class="btn-icons-wrap"
                     type="text"
                     icon="el-icon-delete"
                     @click="removeBind">移除</el-button>
          <el-button class="btn-icons-wrap fr"
                     type="text"
                     icon="el-icon-download"
                     @click="importProjectDeviceSn">导入设备序列号</el-button>
        </div>
        <div class="yw-el-table-wrap">
          <el-table class="yw-el-table"
                    :data="result"
                    height="300px"
                    v-loading="loading"
                    stripe
                    tooltip-effect="dark"
                    border
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             min-width="20px"
                             fixed="left"></el-table-column>
            <el-table-column label="设备序列号"
                             align="left"
                             min-width="120"
                             prop="deviceSn"
                             fixed="left"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="设备名称"
                             align="left"
                             min-width="120"
                             prop="deviceName"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="设备IP"
                             align="left"
                             min-width="120"
                             prop="ip"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="资源池"
                             align="left"
                             min-width="80"
                             prop="idcType"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="一级部门"
                             align="left"
                             min-width="100"
                             prop="department1"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="二级部门"
                             align="left"
                             min-width="100"
                             prop="department2"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="业务系统"
                             align="left"
                             min-width="120"
                             prop="bizSystem"
                             :show-overflow-tooltip="true"></el-table-column>
          </el-table>
        </div>
      </el-form>
    </section>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogMsg'],
  components: {
  },
  data () {
    return {
      can_search: true,
      formData: {
        deviceSn: ''
      },
      result: [],
      selectDeviceSn: [],
      addDeviceSn: [],
      loading: false,
      importProjectBindDeviceData: {
        isImport: false,
        importType: 'maintenance_project_bind_device'
      },
      project: []
    }
  },
  created () {
    let _t = this
    this.rbHttp.sendRequest({
      method: 'GET',
      url: `/v1/cmdb/maintenance/project/get`,
      params: { 'projectId': _t.dialogMsg.data.id }
    }).then((res) => {
      if (res) {
        _t.project = res
      }
    }).finally(() => {
      this.can_search = false
    });
  },
  methods: {
    // 导入设备序列号
    importProjectDeviceSn () {
      this.$emit('setShowImportDeviceSnDialog', this.dialogMsg.data)
    },
    queryDeviceSn () {
      if (this.addDeviceSn.indexOf(this.formData.deviceSn) > -1) {
        this.$message.error('设备序列号[' + this.formData.deviceSn + ']已在待提交列表中.')
        return false
      }
      // 查询数据中信息
      this.loading = true
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/maintenance/project/getValidProjectByDeviceSn`,
        params: { 
          device_sn: this.formData.deviceSn
        }
      }).then((res) => {
        if (res) {
          this.$message.error('设备序列号已与项目[' + res.projectName + ']绑定.')
        } else {
          this.queryInstance()
        }
      }).finally(() => {
        this.loading = false
      })

    },
    queryInstance () {
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/instance/queryDeviceByDeviceSn`,
        params: { 
          deviceSn: this.formData.deviceSn,
          deviceArea: this.project.deviceArea == null ? '' : this.project.deviceArea
        }
      }).then((res) => {
        if (res) {
          this.result.push({
            id: res.id,
            deviceSn: res.deviceSn,
            deviceName: res.deviceName,
            ip: res.ip,
            idcType: res.idcType,
            department1: res.department1,
            department2: res.department2,
            bizSystem: res.bizSystem
          })
        } else {
          this.result.push({
            id: '',
            deviceSn: this.formData.deviceSn,
            deviceName: '',
            ip: '',
            idcType: '',
            department1: '',
            department2: '',
            bizSystem: ''
          })
        }
        this.addDeviceSn.push(this.formData.deviceSn)
      }).finally(() => {
        this.loading = false;
      });
    },
    commit () {
      if (this.addDeviceSn && this.addDeviceSn.length < 1) {
        this.$message.error('请先关联需要绑定的设备序列号.')
        return false;
      }
      this.$confirm('确定提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let commitData = []
        this.result.forEach((item) => {
          commitData.push({
            projectId: this.dialogMsg.data.id,
            deviceSn: item.deviceSn,
            instanceId: item.id
          })
        })
        this.rbHttp.sendRequest({
          method: 'POST',
          url: `/v1/cmdb/maintenance/project/bindInstance?project_id=${this.dialogMsg.data.id}`,
          data: commitData
        }).then((res) => {
          if (res && res.flag === 'success') {
            this.$message.success('绑定成功')
            this.dialogMsg.dialogVisible = false
          } else {
            this.$message.error('绑定失败')
            console.error(res.msg)
          }
        }).finally(() => {
          this.loading = false;
        })
      }).catch(() => {
      });
    },
    handleSelectionChange (val) {
      this.addDeviceSn = []
      this.selectDeviceSn = val
      val.forEach((item) => {
        this.addDeviceSn.push(item.deviceSn)
      })
    },
    removeBind () {
      if (this.selectDeviceSn && this.selectDeviceSn.length < 1) {
        this.$message.error('请先选择需要移除的设备序列号')
        return false;
      }
      if (this.selectDeviceSn && this.selectDeviceSn.length > 0) {
        //移除addDeviceSn
        this.selectDeviceSn.forEach((item) => {
          this.addDeviceSn.forEach((item2, index) => {
            console.log(item2 === item.deviceSn)
            if (item2 === item.deviceSn) {
              this.addDeviceSn.splice(index, 1)
            }
          })
        })
        this.selectDeviceSn.forEach((item) => {
          this.result.forEach((item2, index) => {
            if (item.deviceSn === item2.deviceSn) {
              this.result.splice(index, 1)
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
