<template>
    <el-dialog class="yw-dialog"
               :title="dialogMsg.dialogTitle"
               :visible.sync="dialogMsg.dialogVisible"
               width="720px"
               :close-on-click-modal="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :model="objModel"
                 :rules="rules"
                 :validate-on-rule-change = true
                 ref="updateForm"
                 :inline="true"
                 label-width="130px">
          <el-form-item label="项目" required>
            <el-select  v-model="objModel.project_name"
                        filterable
                        clearable
                        @change="changeDeviceSnSelect">
              <el-option v-for="(project, index) in projectList"
                        :key = "index"
                        :label="project.projectName"
                        :value="project.projectName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备序列号" prop="device_serial_number">
            <el-select v-model="objModel.device_serial_number"
                       filterable
                       clearable
                       @change="packageAllData">
              <el-option v-for="(item, index) in deviceSnList"
                        :key = "index"
                        :label="item.deviceSn"
                        :value="item.deviceSn">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源池"
                        prop="resource_pool">
            <el-input v-model="objModel.resource_pool"
                      :disabled="true" />
          </el-form-item>
          <el-form-item label="一级部门">
            <el-input v-model="objModel.department1"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="二级部门">
            <el-input v-model="objModel.department2"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="业务系统">
            <el-input v-model="objModel.system_name"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="设备分类"
                        prop="device_classify">
            <el-input v-model="objModel.device_classify"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="设备类型"
                        prop="device_type">
            <el-input v-model="objModel.device_type"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="设备型号"
                        prop="device_model">
            <el-input v-model="objModel.device_model"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="设备名称"
                        prop="device_name">
            <el-input v-model="objModel.device_name"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="IP"
                        prop="assets_number">
            <el-input v-model="objModel.ip"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="资产编号"
                        prop="assets_number">
            <el-input v-model="objModel.assets_number"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="出保时间"
                        prop="warranty_date">
            <el-input v-model="objModel.warranty_date"
                      :disabled="true"></el-input>

          </el-form-item>
          <el-form-item label="服务供应商"
                        prop="produceName">
            <el-input v-model="objModel.produce_name"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="服务联系人"
                        prop="mainten_supply_contact">
            <el-input v-model="objModel.produce_concat"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="服务联系人电话"
                        prop="mainten_factory_contact">
            <el-input v-model="objModel.produce_phone"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="是否购买维保"
                        prop="buy_mainten">
            <el-select v-model="objModel.buy_mainten"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 180px "
                       clearable>
              <el-option v-for="(item, index) in optionsTrueFalseList"
                         :key="index"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否原厂维保">
            <el-select v-model="objModel.origin_buy"
                       placeholder="请选择"
                       class="list-sel"
                       @change="originBuyChange"
                       style="width: 180px "
                       clearable>
              <el-option v-for="(item,index) in optionsTrueFalseList"
                         :key="index"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原厂维保购买必要性"
                        prop="origin_buy_explain">
            <el-select v-model="objModel.origin_buy_explain"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 180px "
                       clearable>
              <el-option key="1"
                         label="一旦发生故障容易影响多个业务线"
                         value="一旦发生故障容易影响多个业务线"></el-option>
              <el-option key="2"
                         label="承载业务的重要数据"
                         value="承载业务的重要数据"></el-option>
              <el-option key="3"
                         label="关键且无冗余"
                         value="关键且无冗余"></el-option>
              <el-option key="4"
                         label="小众且缺乏第三方维保支持"
                         value="小众且缺乏第三方维保支持"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维保管理员"
                        prop="admin">
            <el-input v-model="objModel.admin"></el-input>
          </el-form-item>
          <el-form-item label="税前(万)"
                        prop="pre_tax">
            <el-input v-model="objModel.pre_tax"></el-input>
          </el-form-item>
          <el-form-item label="税后(万)"
                        prop="after_tax">
            <el-input v-model="objModel.after_tax"></el-input>
          </el-form-item>
          <el-form-item label="单价(万)"
                        prop="unit_price">
            <el-input v-model="objModel.unit_price"></el-input>
          </el-form-item>
          <el-form-item label="总价(万)"
                        prop="total_price">
            <el-input v-model="objModel.total_price"></el-input>
          </el-form-item>
          <el-form-item label="结算方式"
                        prop="pay_method">
            <el-select v-model="objModel.pay_method"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 180px "
                       clearable>
              <el-option v-for="(item, index) in payMethodList"
                         :key="index"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="折扣后金额(万)"
                        prop="discount_amount">
            <el-input v-model="objModel.discount_amount"></el-input>
          </el-form-item>
          <el-form-item label="折扣率(%)"
                        prop="discount_rate">
            <el-input v-model="objModel.discount_rate"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="addCommit">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </section>
    </el-dialog>
</template>

<script>
import rbmaintenanceServiceFactory from 'src/services/cmdb/rb-maintenance-services.factory.js'
import rbmaintenHardServiceFactory from 'src/services/cmdb/rb-maintenhard-services.factory.js'
export default {
    props: ['dialogMsg'],
    data () {
        return {
          projectMap: {},
          // 对象实体
          objModel: {
            id: '',
            project_instance_id: '',
            resource_pool: '',
            department1: '',
            department2: '',
            system_name: '',
            device_classify: '',
            device_type: '',
            device_model: '',
            device_name: '',
            ip: '',
            device_serial_number: '',
            assets_number: '',
            project_no: '',
            project_name: '',
            produce_name: '',
            produce_concat: '',
            produce_phone: '',
            warranty_date: '',
            buy_mainten: '',
            origin_buy: '',
            origin_buy_explain: '',
            admin: '',
            pre_tax: '',
            after_tax: '',
            unit_price: '',
            total_price: '',
            pay_method: '',
            discount_amount: '',
            discount_rate: ''
          },
          // 硬件项目列表
          projectList: [],
          // 序列号列表
          deviceSnList: [],
          optionsTrueFalseList: [],
          // 结算方式列表
          payMethodList: [],
          rules: {
            device_serial_number: [{ required: true, message: '请输选择序列号', trigger: 'change' }],
            admin: [{ required: true, message: '请输入维保管理员', trigger: 'blur' }],
            buy_mainten: [{ required: true, message: '是否购买维保', trigger: 'change' }],
            origin_buy_explain: [{ required: true, message: '请输入原厂维保购买必要性说明', trigger: 'change' }],
            pre_tax: [{validator: (rule, value, callback) => this.validMoneyNumber(rule, value, callback), trigger: 'change'}],
            after_tax: [{validator: (rule, value, callback) => this.validMoneyNumber(rule, value, callback), trigger: 'change'}],
            unit_price: [{validator: (rule, value, callback) => this.validMoneyNumber(rule, value, callback), trigger: 'change'}],
            total_price: [{validator: (rule, value, callback) => this.validMoneyNumber(rule, value, callback), trigger: 'change'}],
            discount_amount: [{validator: (rule, value, callback) => this.validMoneyNumber(rule, value, callback), trigger: 'change'}],
            discount_rate: [{validator: (rule, value, callback) => this.validPercentage(rule, value, callback), trigger: 'change'}]
          },
          isExist: false,
        }
    },
    mounted() {
      this.getOptionsTrueFalseList()
      this.listHardwareProject()
      this.getPayMethodList()
    },
    methods: {
      // 表单提交
      addCommit(){
        if(this.isExist) {
          this.$message({
            showClose: true,
            message: '该项目和序列号的数据已存在,请重新选择',
            type: 'error'
          })
          return
        }
        var obj = {
          'projectInstanceId': this.objModel.project_instance_id,
          'buyMainten': this.objModel.buy_mainten,
          'originBuy': this.objModel.origin_buy,
          'originBuyExplain': this.objModel.origin_buy_explain,
          'admin': this.objModel.admin,
          'preTax': this.objModel.pre_tax,
          'afterTax': this.objModel.after_tax,
          'unitPrice': this.objModel.unit_price,
          'totalPrice': this.objModel.total_price,
          'payMethod': this.objModel.pay_method,
          'discountAmount': this.objModel.discount_amount,
          'discountRate': this.objModel.discount_rate
        }
        rbmaintenHardServiceFactory.updateMaintenance(obj).then((res) => {
          if(res.success){
            this.$message.success('新增成功')
          } else {
            this.$message.error('新增失败')
          }
          this.closeDialog()
        })
      },
      validPercentage(rule, value, callback) {
        if(value == null || value == '') {
          return callback()
        }
        const regex = /^([1-9]\d?|100)$/
        if (value && !regex.test(value)) {
          return callback(new Error('请输入[1,100]之间的整数'))
        }
        return callback()
      },
      validMoneyNumber (rule, value, callback) {
        if(value == null || value == '') {
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
      getPayMethodList(){
        var option = [{
          name: '人/天',
          value: '人/天'
        }, {
          name: '月',
          value: '月'
        }, {
          name: '年',
          value: '年'
        }]
        this.payMethodList = option
      },
      getOptionsTrueFalseList(){
        var options = [{
          name: '是',
          value: '是'
        },{
          name: '否',
          value: '否'
        }]
        this.optionsTrueFalseList = options
      },
      // 内容置空
      resetModel () {
        this.objModel.id = '',
          this.objModel.project_instance_id = '',
          this.objModel.resource_pool = '',
          this.objModel.department1 = '',
          this.objModel.department2 = '',
          this.objModel.system_name = '',
          this.objModel.device_classify = '',
          this.objModel.device_type = '',
          this.objModel.device_model = '',
          this.objModel.device_name = '',
          this.objModel.ip = '',
          this.objModel.device_serial_number = '',
          this.objModel.assets_number = '',
          this.objModel.project_no = '',
          this.objModel.produce_name = '',
          this.objModel.produce_concat = '',
          this.objModel.produce_phone = '',
          this.objModel.warranty_date = '',
          this.objModel.pre_tax = '',
          this.objModel.after_tax = '',
          this.objModel.unit_price = '',
          this.objModel.total_price = '',
          this.objModel.pay_method = '',
          this.objModel.discount_amount = '',
          this.objModel.discount_rate = ''
      },
      // 获取硬件项目列表的方法
      listHardwareProject () {
        var params = {
          maintenanceProjectType: '硬件'
        }
        rbmaintenanceServiceFactory.listMaintenanceProject(params).then((res) => {
          this.projectList = res.data
          this.projectList.forEach(item => {
            this.$set(this.projectMap, item.projectName, item)
          })
        })
      },
      // 序列号随着项目更改
      changeDeviceSnSelect(row){
        this.deviceSnList = []
        var pojo = this.projectMap[row]
        var deviceSnList = pojo.projectInstanceList
        if(deviceSnList != null || deviceSnList.length > 0) {
          deviceSnList.forEach(item => {
            this.deviceSnList.push(item)
          })
        }
        this.resetModel()
      },
      // 填充级联的数据
      packageAllData(row) {
        var obj = {
          // 表示不采取分页
          pageSize: 0,
          device_sn: row,
          project_name: this.objModel.project_name
        }
        rbmaintenHardServiceFactory.listMaintenanceByPage(obj).then( (res) => {
          var str = res.data[0]
          // 填空级联的数据
          this.objModel.project_instance_id = str.projectInstanceId
          this.objModel.resource_pool = str.resourcePool
          this.objModel.department1 = str.department1
          this.objModel.department2 = str.department2
          this.objModel.system_name = str.systemName
          this.objModel.device_classify = str.deviceClassify
          this.objModel.device_type = str.deviceType
          this.objModel.device_model = str.deviceModel
          this.objModel.device_name = str.deviceName
          this.objModel.ip = str.ip
          this.objModel.assets_number = str.assetsNumber
          this.objModel.warranty_date = str.warranty_date
          this.objModel.produceName = str.produceName
          this.objModel.produce_concat = str.produceConcat
          this.objModel.produce_phone = str.producePhone
          
          var params = {
            deviceSerialNumber: row,
            warrantyDate: str.warranty_date
          }
          this.queryIsExist(params)
        })
      },
      // 查询是否已经存在数据库中
      queryIsExist(params) {
        rbmaintenHardServiceFactory.queryMaintenanceHardwareIsExist(params).then( (res) => {
          this.isExist = res.success
          if(res.success) {
            this.$message({
              showClose: true,
              message: '该项目和序列号的数据已存在,请重新选择',
              type: 'error'
            })
          }
        })
      },
      // 点击窗口的取消
      closeDialog(){
        this.dialogMsg.dialogVisible = false
      },
      originBuyChange (value) {
        if (value === '是') {
          this.rules.origin_buy_explain = [{ required: true, message: '请输入原厂维保购买必要性说明', trigger: 'change' }]
        } else {
          this.rules.origin_buy_explain = [{ required: false, trigger: 'change' }]
        }
      }
    }
}
</script>

<style scoped>

</style>