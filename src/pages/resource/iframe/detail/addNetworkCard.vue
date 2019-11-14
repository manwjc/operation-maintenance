<template>
    <el-dialog
    class="yw-dialog"
    width="340px"
    :close-on-click-modal="false"
    :title="dialogMsg.dialogTitle"
    :show-close="false"
    :visible.sync="dialogMsg.showDialog">
    <section class="yw-dialog-main">
      <el-form
        :rules="rules"
        :model="form"
        ref="form"
        label-width="100px"
        class="yw-form is-required">
        <el-form-item label="名称" prop="networkCardName">
          <el-input v-model="form.networkCardName"></el-input>
        </el-form-item>
        <el-form-item label="链接状态">
          <el-select v-model="form.networkCardStatus">
            <el-option v-for="(item, index) in statusList"
                  :key="index"
                  :label="item.name"
                  :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="端口类型" prop="portType">
          <el-select v-model="form.portType">
            <el-option v-for="(item, index) in portTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="端口速率" prop="portRate">
          <el-select v-model="form.portRate">
            <el-option v-for="(item, index) in portRateList"
                  :key="index"
                  :label="item.name"
                  :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IPv4地址" prop="ipv4Address">
          <el-input v-model="form.ipv4Address"></el-input>
        </el-form-item>
        <el-form-item label="IPv6地址" prop="ipv6Address">
          <el-input v-model="form.ipv6Address"></el-input>
        </el-form-item>
        <el-form-item label="mac地址" prop="macAddress">
          <el-input v-model="form.macAddress" placeholder="请以:或者-分隔"></el-input>
        </el-form-item>
        <el-form-item label="默认网关" prop="defaultGateway">
          <el-input v-model="form.defaultGateway"></el-input>
        </el-form-item>
        <el-form-item label="是否DHCP" prop="isDhcp">
          <el-select v-model="form.isDhcp">
            <el-option v-for="(item, index) in isDhcpList"
                  :key="index"
                  :label="item.name"
                  :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="DHCP地址" prop="dhcpAddress">
          <el-input v-model="form.dhcpAddress"></el-input>
        </el-form-item>
        <el-form-item label="DNS服务器" prop="dnsServer">
          <el-input v-model="form.dnsServer"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" style="width: 178px" v-model="form.remark">
          </el-input>
        </el-form-item>
      </el-form>
    </section>
    <section class="btn-wrap">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
    </section>
  </el-dialog>
</template>

<script>
import rbConfigServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
export default {
    props: ['dialogMsg', 'instanceId','formData'],
    data () {
      return {
        rules: {
          networkCardName: [
            {required: true, message: '请填写网卡名称', trigger: 'blur'},
            {validator: (rule, value, callback) => this.validName(rule, value, callback), trigger: 'blur' }],
          ipv4Address: [
            {validator: (rule, value, callback) => this.validIPFormate(rule, value, callback), trigger: 'blur' }
          ],
          ipv6Address: [{validator: (rule, value, callback) => this.validIPFormate(rule, value, callback), trigger: 'blur' }],
          macAddress: [{validator: (rule, value, callback) => this.validMacFormate(rule, value, callback), trigger: 'blur' }],
          defaultGateway: [{validator: (rule, value, callback) => this.validIPFormate(rule, value, callback), trigger: 'blur' }],
          dhcpAddress: [{validator: (rule, value, callback) => this.validIPFormate(rule, value, callback), trigger: 'blur' }],
          dnsServer: [{validator: (rule, value, callback) => this.validIPFormate(rule, value, callback), trigger: 'blur' }],
          portType: [{required: true, message: '请选择端口类型', trigger: 'blur'}],
          portRate: [{required: true, message: '请选择端口速率', trigger: 'blur'}],
          isDhcp: [{required: true, message: '请选择是否DHCP', trigger: 'blur'}],
        },
        form: this.formData,
        statusList: [],
        portTypeList: [],
        portRateList: [],
        isDhcpList: [],
      }
    },
    mounted (){
      this.getNetworkCardStatus()
      this.getPortType()
      this.getPortRate()
      this.getIsDHCP()
    },
    methods: {
      // 验证IPv4和IPv6的格式
      validIPFormate(rule, value, callback){
        var pattern = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
        if(value && !pattern.test(value)) {
          return callback(new Error(value + '的IP格式有误'))
        }
        return callback()
      },
      // 验证MAC地址格式
      validMacFormate(rule, value, callback){
        var pattern = /^([A-Fa-f0-9]{2}-){5,7}[A-Fa-f0-9]{2}$|^([A-Fa-f0-9]{2}){5,7}[A-Fa-f0-9]{2}$|^([A-Fa-f0-9]{2}:){5,7}[A-Fa-f0-9]{2}$|^([A-Fa-f0-9]{2} ){5,7}[A-Fa-f0-9]{2}$/
        if(value && !pattern.test(value)) {
          return callback(new Error(value + '的MAC格式有误'))
        }
        return callback()
      },
      // 验证名称是否重复
      validName (rule, value, callback) {
        if(this.dialogMsg.add) {
          var params = {
            name: value
          }
          rbCmdbServiceFactory.getNetworkCardByName(params).then((res) => {
            if(res){
              return callback('\'' + value + '\'名称已使用')
            }
            return callback()
          })
        } else {
          return callback()
        }
      },
      // 取消
      cancel(){
        this.dialogMsg.showDialog = false
        this.$emit('reload')
      },
      // 保存网卡信息
      submit(){
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let data = {
              id: this.form.id,
              instanceId: this.instanceId,
              networkCardName: this.form.networkCardName,
              networkCardStatus: this.form.networkCardStatus,
              portType: this.form.portType,
              portRate: this.form.portRate,
              ipv4Address: this.form.ipv4Address,
              ipv6Address: this.form.ipv6Address,
              macAddress: this.form.macAddress,
              defaultGateway: this.form.defaultGateway,
              isDhcp: this.form.isDhcp,
              dhcpAddress: this.form.dhcpAddress,
              dnsServer: this.form.dnsServer,
              remark: this.form.remark
            }
            if(this.dialogMsg.add) {
              rbCmdbServiceFactory.insertNetworkCard(data).then((res) => {
                if (res.success) {
                  this.dialogMsg.showDialog = false
                  this.$message.success(res.msg)
                  this.$emit('reload')
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else {
              rbCmdbServiceFactory.updateNetworkCard(data).then((res) => {
                if (res.success) {
                  this.dialogMsg.showDialog = false
                  this.$message.success(res.msg)
                  this.$emit('reload')
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
            
          }
        })
      },
      // 根据类型获取字典数据
      getDictDataByType(type){
        var params = {
          type: type
        }
        return rbConfigServiceFactory.getDictsByType(params)
      },
      // 获取网卡状态
      getNetworkCardStatus(){
        this.getDictDataByType('network_card_status').then((res) => {
          this.statusList = this.packageSelectData(res)
        })
      },
      // 获取端口类型
      getPortType(){
        this.getDictDataByType('port_type').then((res) => {
          this.portTypeList = this.packageSelectData(res)
        })
      },
      // 获取端口速率
      getPortRate(){
        this.getDictDataByType('port_rate').then((res) => {
          this.portRateList = this.packageSelectData(res)
        })
      },
      // 获取是否DHCP
      getIsDHCP(){
        this.getDictDataByType('is_dhcp').then((res) => {
          this.isDhcpList = this.packageSelectData(res)
        })
      },
      // 封装下拉框数据
      packageSelectData(data){
        var result = []
        for(var i=0;i<data.length;i++){
          var obj = {
            name: data[i].name,
            value: data[i].value
          }
          result.push(obj)
        }
        return result
      }
    }
}
</script>

<style scoped>

</style>