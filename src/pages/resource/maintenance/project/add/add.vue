<template>
  <el-dialog class="yw-dialog"
             width="700px"
             :title="dialogMsg.dialogTitle"
             :visible.sync="dialogMsg.dialogVisible">
    <section class="yw-dialog-main">
      <el-form class="yw-form is-required"
               :inline="true"
               :model="project"
               ref="projectForm"
               :rules="rules"
               label-width="95px">
        <el-form-item label="项目名称"
                      prop="projectName">
          <el-input v-model="project.projectName"></el-input>
        </el-form-item>
        <el-form-item label="合同编号"
                      prop="projectNo">
          <el-input v-model="project.projectNo"></el-input>
        </el-form-item>
        <el-form-item label="维保类型"
                      prop="maintenanceType">
          <el-select v-model="project.maintenanceType"
                     clearable
                     placeholder="请选择维保类型">
            <el-option v-for="item in maintenanceList"
                       :key="item.name"
                       :label="item.value"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务形式"
                      prop="serviceType">
          <el-select v-model="project.serviceType"
                     filterable
                     placeholder="请选择服务形式">
            <el-option v-for="item in serviceTypeList"
                       :key="item.name"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="数量"
                      prop="serviceNumber">
          <el-input-number v-model="project.serviceNumber"
                           :min="0"></el-input-number>
        </el-form-item> -->
        <el-form-item label="开始时间"
                      prop="serviceStartTime">
          <el-date-picker v-model="project.serviceStartTime"
                          placeholder="选择时间"
                          :picker-options="startDatePicker()"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间"
                      prop="serviceEndTime">
          <el-date-picker v-model="project.serviceEndTime"
                          placeholder="选择时间"
                          :picker-options="endDatePicker()"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="维保对象类型"
                      prop="maintenanceProjectType">
          <el-select v-model="project.maintenanceProjectType"
                     placeholder="请选择维保对象类型"
                     >
            <el-option v-for="item in maintenanceProjectTypeList"
                       :key="item.name"
                       :label="item.value"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购类型"
                      prop="procureType">
          <el-select v-model="project.procureType"
                     placeholder="请选择采购类型"
                     >
            <el-option v-for="item in procureTypeList"
                       :key="item.name"
                       :label="item.value"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额(万)"
                      prop="money">
          <el-input v-model="project.money"></el-input>
        </el-form-item>
        <el-form-item label="设备类型"
                      prop="deviceType">
          <el-select v-model="project.deviceType"
                     filterable
                     clearable
                     placeholder="请选择设备类型">
            <el-option v-for="item in deviceTypeList"
                       :key="item.name"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同供应商"
                      prop="contractProduceInfo.id">
          <el-select v-model="project.contractProduceInfo.id"
                     filterable
                     clearable
                     placeholder="请选择合同供应商">
            <el-option v-for="item in produceList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务供应商"
                      prop="produceInfo.id">
          <el-select v-model="project.produceInfo.id"
                     filterable
                     placeholder="请选择服务厂商">
            <el-option v-for="item in produceList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备区域"
                      prop="localDeviceArea">
          <span slot="label"><font style="color:#F56C6C;margin-left:-10px;">*</font> 设备区域</span>
          <el-select v-model="localDeviceArea"
                     multiple
                     collapse-tags
                     size="mini"
                     filterable
                     placeholder="请选择设备区域">
            <el-option v-for="item in deviceAreaList"
                       :key="item.name"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </section>
    <section class="btn-wrap">
      <el-button type="primary"
                 @click="save()">保存</el-button>
      <el-button @click="cancel()">取消</el-button>
    </section>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogMsg'],
  components: {
    YwInputAdd: () => import('src/components/common/yw-input-add.vue'),
    YwSelect: () => import('src/components/common/yw-select.vue')
  },
  mounted () {
    this.getProduceList()
    this.getServiceType()
    this.getMaintenanceList()
    this.getDeviceAreaList()
    this.getMaintenanceProjectTypeList()
    this.getProcureTypeList()
    this.getDeviceTypeList()
    if (this.dialogMsg.data.id) {
      // 获取维保项目详细信息
      this.getProjectDetail()
    }
  },
  data () {
    return {
      project: {
        id: '',
        projectName: '',
        projectNo: '',
        serviceType: '',
        // serviceNumber: '',
        serviceStartTime: '',
        serviceEndTime: '',
        maintenanceType: '',
        deviceArea:'',
        maintenanceProjectType: '',
        procureType: '',
        money: '',
        deviceType: '',
        contractProduceInfo: {
          id: ''
        },
        produceInfo: {
          id: ''
        }
      },
      // 设备区域
      localDeviceArea: [],
      deviceTypeList: [{
        name:'个人PC',
        value:'个人PC'
      }],
      procureTypeList: [{
        name:'公开招标',
        value:'公开招标'
      }],
      maintenanceProjectTypeList: [{
        name:'硬件',
        value:'硬件'
      },{
        name:'软件',
        value:'软件'
      }],
      deviceAreaList: [{
        name: '哈尔滨资源池',
        value: '哈尔滨资源池'
      },{
        name: '信息港资源池',
        value: '信息港资源池'
      }],
      maintenanceList: [],
      produceList: [{
        id: 'd9c82b22-b1b7-11e9-ace2-0242ac110005',
        name: '华为',
        value: '华为'
      }],
      serviceTypeList: [],
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'change' }
        ],
        serviceType: [
          { required: true, message: '请选择服务类型', trigger: 'change' }
        ],
        serviceStartTime: [
          { required: true, message: '请选择服务开始时间', trigger: 'change' }
        ],
        serviceEndTime: [
          { required: true, message: '请选择服务结束时间', trigger: 'change' }
        ],
        localDeviceArea: [
          { validator: (rule, value, callback) => this.validDeviceArea(rule, value, callback), trigger: 'change' }
        ],
        maintenanceProjectType: [
          { required: true, message: '请选择维保对象类型', trigger: 'change' }
        ],
        money: [
           { validator: (rule, value, callback) => this.validMoneyNumber(rule, value, callback), trigger: 'change' }
        ],
        procureType: [
          { required: true, message: '请选择采购类型', trigger: 'change' }
        ],
        produceInfo: {
          id: [
            { required: true, message: '请选择服务厂商', trigger: 'change' }
          ]
        }
      }
    }
  },
  methods: {
    // 设备区域值，用逗号连成字符串
    changeDeviceArea(val) {
      if(val.length > 0) {
        var area = val[0];
        for(var i=1;i< val.length;i++) {
          area = area + ',' + val[i]
        }
        return area
      }
    },
    getProjectDetail () {
      let _t = this
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/maintenance/project/get`,
        params: { 'projectId': _t.dialogMsg.data.id }
      }).then((res) => {
        if (res) {
          _t.project = res
          // 将设备区域的字符串改为数组
          _t.localDeviceArea = _t.project.deviceArea
          if(_t.project.deviceArea != null) {
             _t.localDeviceArea = _t.project.deviceArea.split(",")
          }
          if(_t.project.contractProduceInfo == null) {
            _t.project.contractProduceInfo = {
              id : ''
            }
          }
          if(_t.project.produceInfo == null) {
            _t.project.produceInfo = {
              id : ''
            }
          }
        }
      });
    },
    startDatePicker () {
      const self = this
      return {
        disabledDate (time) {
          if (self.project.serviceEndTime) {  //如果结束时间不为空，则小于结束时间
            return new Date(self.project.serviceEndTime).getTime() < time.getTime()
          }
        }
      }
    },
    endDatePicker () {
      const self = this
      return {
        disabledDate (time) {
          if (self.project.serviceStartTime) {  //如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.project.serviceStartTime).getTime() > time.getTime()
          }
        }
      }
    },
    // 获取维保厂商列表
    getProduceList () {
      let obj = {
        'type': 'mainten_factory'
      }
      this.rbHttp.sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.produceList = res
        return res
      })
    },
    // 获取维保类型列表
    getMaintenanceList () {
      let obj = {
        'type': 'maintenance_type'
      }
      this.rbHttp.sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.maintenanceList = res
        return res
      })
    },
    // 获取设备区域列表
    getDeviceAreaList () {
      let obj = {
        'type': 'idctype'
      }
      this.rbHttp.sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.deviceAreaList = res
        return res
      })
    },
    // 获取维保对象类型列表
    getMaintenanceProjectTypeList () {
      let obj = {
        'type': 'maintenance_project_type'
      }
      this.rbHttp.sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.maintenanceProjectTypeList = res
        return res
      })
    },
    // 获取采购类型列表
    getProcureTypeList () {
      let obj = {
        'type': 'procure_type'
      }
      this.rbHttp.sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.procureTypeList = res
        return res
      })
    },
    // 获取设备类型列表
    getDeviceTypeList () {
      let obj = {
        'type': 'device_type'
      }
      this.rbHttp.sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.deviceTypeList = res
        return res
      })
    },
    // 获取服务类型列表
    getServiceType () {
      let obj = {
        'type': 'mainten_service_type'
      }
      this.rbHttp.sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.serviceTypeList = res
        return res
      })
    },
    save () {
      console.info("save coming!!!");
      this.$refs['projectForm'].validate((valid) => {
        if (valid) {
          // 检测维保项目是否已经存在
          let _t = this
          this.rbHttp.sendRequest({
            method: 'GET',
            url: `/v1/cmdb/maintenance/project/getByProjectName`,
            params: { 'projectName': _t.project.projectName }
          }).then((res) => {
            if (res && res.id !== _t.project.id) {
              _t.$message.error('维保项目名称已经存在, 请更换后提交')
            } else {
              _t.saveData()
            }
          });
        }
      })
    },
    saveData () {
      let _t = this
      _t.project.deviceArea = this.changeDeviceArea(this.localDeviceArea)
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/maintenance/project/save`,
        data: _t.project
      }).then((res) => {
        if (res && res.flag === 'success') {
          _t.$message.success('保存成功')
          _t.dialogMsg.dialogVisible = false
          _t.reset()
        } else {
          _t.$message.error('保存失败')
          console.error(res.msg)
        }
      });
    },
    // 重置项目信息
    reset () {
      this.project = []
      this.selectConcat = ''
      this.selectConcatPhone = ''
      this.selectConcatEmail = ''
    },
    cancel () {
      this.dialogMsg.dialogVisible = false
    },
    validMoneyNumber (rule, value, callback) {
      if(value == null) {
        return callback()
      }
      // 特殊处理 0 和 0.00
      if(value == '0' || (value.indexOf('.') != -1 && value.charAt(value.length-1) == '0')) {
          return callback(new Error('请输入大于零的正数'))
      }
      const pattern = /^[\+]?(0|[1-9]\d*)(\.\d+)?$/
      if (value && !pattern.test(value)) {
        return callback(new Error('请输入大于零的正数'))
      }
      return callback()
    },
    validDeviceArea (rule, value, callback) {
      if(this.localDeviceArea == null || this.localDeviceArea == 0) {
        return callback(new Error('至少选择一个设备区域'))
      }
      return callback()
    }
  }
}
</script>
<style lang="scss" scoped>
  .tags {
    max-width: 160px;
  }
  /deep/ .el-form-item__content {
    width: 200px;
    div {
      width: 100%;
    }
    .el-input {
      width: 100%;
    }
  }
</style>

