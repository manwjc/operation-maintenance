<template>
  <!-- 告警衍生规则 -->
  <div>
    <el-dialog class="yw-dialog"
               width="900px"
               title="告警衍生规则设置"
               :visible.sync="dialogMsg.dialogVisible">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :inline="true"
                 :model="formData"
                 label-width="80px"
                 ref="formData"
                 :rules="rules">
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="生效时间">
            <el-date-picker v-model="formData.effectiveDate"
                            type="datetime"
                            placeholder="选择日期"
                            :picker-options="pickerOptions"
                            format="yyyy-MM-dd HH:00:00"
                            @change="changeEffectiveTime()">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="失效时间">
            <el-date-picker v-model="formData.expireDate"
                            type="datetime"
                            placeholder="选择日期"
                            :picker-options="pickerOptions"
                            format="yyyy-MM-dd HH:00:00"
                            @change="changeExpireTime()">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="维护用户">
            <el-checkbox v-model="currentUserFlag" @change="selectCurrent()">当前用户</el-checkbox>
            <el-checkbox label="其他用户" v-model="otherUserFlag" @change="selectOther()"></el-checkbox>
            <el-input v-model="formData.user.join(',')"
                      placeholder=""
                      :disabled="true"></el-input>
            <el-button type="primary"
                       @click="getUser()" :disabled="!otherUserFlag">选择
            </el-button>
          </el-form-item>
          <br/>
          <el-form-item label="规则描述">
            <el-input type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="formData.description">
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="收敛类型">
            <el-radio v-model="formData.deviceRelationType" label="1" @change="changeSameDevice">同一设备衍生一条</el-radio>
            <el-radio v-model="formData.deviceRelationType" label="2">不同设备</el-radio>
          </el-form-item>
        </el-form>
        <YwFilterOrder :dataList="conditionData"
                       :detailFlag="detailFlag"
                       ref="filterOrder"
                       @changeFilterOrder="changeFilterOrder"
                       v-if="showFilterFlag"></YwFilterOrder>
        <div class="data-div-boarder">
          <span>触发条件设置</span><br>
          <el-form class="yw-form is-required"
                   :inline="true"
                   :model="formData"
                   label-width="110px"
                   ref="formData1"
                   :rules="rules1">
            <el-form-item label="关联时间窗(m)" prop="deriveActiveTimeout">
              <el-input v-model="formData.deriveActiveTimeout"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警阈值个数" prop="alertThreshold">
              <el-input v-model="formData.alertThreshold"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="data-div-boarder">
          <span>告警生成设置</span><br>
          <el-form class="yw-form is-required"
                   :inline="true"
                   :model="alertSetting"
                   label-width="85px"
                   ref="formData2"
                   :rules="rules2">
            <el-form-item label="告警来源">
              <el-input v-model="alertSetting.source"
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="告警等级" prop="alertLevel">
              <el-select v-model="alertSetting.alertLevel" clearable>
                <el-option v-for="item in alert_level"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="告警分类" prop="objectType">
              <el-select v-model="alertSetting.objectType" clearable>
                <el-option v-for="item in alert_type"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="监控对象" prop="moniObject">
              <el-input v-model="alertSetting.moniObject">
              </el-input>
            </el-form-item>
            <el-form-item label="告警设备IP" prop="deviceIp" v-if="formData.deviceRelationType !== '1'">
              <!--              <el-input v-model="alertSetting.device_ip"-->
              <!--                        clearable></el-input>-->

              <el-select v-model="alertSetting.deviceIp"
                         remote
                         :remote-method="getList"
                         clearable
                         v-loading="ipLoading"
                         filterable @change="selectIp">
                <el-option v-for="(item, index) in currentList"
                           :key="index"
                           :label="item.ip"
                           :value="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资源池" v-if="formData.deviceRelationType !== '1'">
              <el-select v-model="alertSetting.idcType" clearable>
                <el-option v-for="item in resourcePoors"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="工程期数" v-if="formData.deviceRelationType !== '1'">
              <el-input v-model="alertSetting.projectName">
              </el-input>
            </el-form-item>
            <el-form-item label="POD池" v-if="formData.deviceRelationType !== '1'">
              <el-select v-model="alertSetting.podName" clearable>
                <el-option v-for="(item, index) in pod_names"
                           :key="index"
                           :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="机房" v-if="formData.deviceRelationType !== '1'">
              <el-select v-model="alertSetting.sourceRoom" clearable>
                <el-option v-for="(item, index) in idc_locations"
                           :key="index"
                           :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="设备分类" v-if="formData.deviceRelationType !== '1'">
              <el-select v-model="alertSetting.deviceClass" clearable>
                <el-option v-for="(item, index) in device_classs"
                           :key="index"
                           :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="设备类型" v-if="formData.deviceRelationType !== '1'">
              <el-select v-model="alertSetting.deviceType" clearable>
                <el-option v-for="(item, index) in device_typess"
                           :key="index"
                           :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="设备厂商" v-if="formData.deviceRelationType !== '1'">
              <el-select v-model="alertSetting.deviceMfrs" clearable>
                <el-option v-for="(item, index) in device_mfrss"
                           :key="index"
                           :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="设备型号" v-if="formData.deviceRelationType !== '1'">
              <el-input v-model="alertSetting.deviceModel">
              </el-input>
            </el-form-item>
            <el-form-item label="业务系统" prop="bizSys" v-if="formData.deviceRelationType !== '1'">
              <el-select v-model="alertSetting.bizSys" clearable>
                <el-option v-for="(item, index) in bizSysList"
                           :key="index"
                           :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="告警内容" prop="moniIndex">
              <el-input type="textarea"
                        :rows="2"
                        v-model="alertSetting.moniIndex"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="submit()">确认
        </el-button>
        <el-button @click="cancel()">取消</el-button>
      </section>
    </el-dialog>

    <!-- dialog -->
    <DialogUser :dialogUser="dialogUser"
                @closeDialogUser="closeDialogUser"
                v-if="dialogUser.dialogVisible"></DialogUser>
    <!-- dialog -->
  </div>

</template>

<script>
  import rbAlertDeriveServiceFactory from "src/services/alert/rb-alert-derive-service.factory"
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  import {alert_level, alert_type} from "../alert/config/options"

  export default {
    props: ['dialogMsg'],
    mixins: [],
    components: {
      YwFilterOrder: () => import('src/components/common/yw-filter-order.vue'),
      DialogUser: () => import('src/components/common/yw-dialog-user.vue'),
    },
    data() {
      var checkIp = (rule, value, callback) => {
        if (this.alertSetting.objectType === '1') {
          if (!value || value === '') {
            callback(new Error('必填项'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      var checkBizSys = (rule, value1, callback) => {
        if (this.alertSetting.objectType === '2') {
          if (!value1 || value1 === '') {
            callback(new Error('必填项'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      var checkName = (rule, value2, callback) => {
        if (value2 && value2 !== '') {
          if (!this.updateFlag || value2 !== this.ruleName) {
            rbAlertDeriveServiceFactory.checkName(value2).then((date) => {
              if (date && !date.status) {
                callback(new Error('名称已存在'))
              } else {
                callback()
              }
            })
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        //表单数据
        formData: {
          name: '',
          effectiveDate: '',
          expireDate: '',
          description: '',
          operateUser: '',
          user: [],
          optionCondition: '',
          deriveActiveTimeout: '5',
          alertThreshold: '50',
          deviceRelationType: '2'
        },
        alertSetting: {
          source: '衍生告警'
        },
        rules: {
          name: [
            {required: true, message: '必填项'},
            {min: 1, max: 64, message: '长度在 1 到 64 个字符'},
            {pattern: /^[A-Za-z\u4e00-\u9fa5][A-Za-z0-9\u4e00-\u9fa5\\-]*$/, message: '格式错误'},
            {validator: checkName, trigger: 'blur'}
          ]
        },
        rules1: {
          deriveActiveTimeout: [
            {pattern: /^[1-9][0-9]*$/, message: '必需为数字'},
          ],
          alertThreshold: [
            {pattern: /^[1-9][0-9]*$/, message: '必需为数字'},
          ]
        },
        rules2: {
          alertLevel: [
            {required: true, message: '必填项'},
          ],
          objectType: [
            {required: true, message: '必填项'},
          ],
          moniIndex: [
            {required: true, message: '必填项'},
          ],
          moniObject: [
            {required: true, message: '必填项'},
          ],
          deviceIp: [
            {validator: checkIp, trigger: 'blur'}
          ],
          bizSys: [
            {validator: checkBizSys, trigger: 'blur'},
          ]
        },
        //dialog
        dialogUser: {
          dialogVisible: false,
          date: [] //数据
        },
        currentUserFlag: true,
        otherUserFlag: false,
        showFilterFlag: false,
        myuser: sessionStorage.getItem('username'),
        pickerOptions: { // 限制收货时间不让选择今天以前的
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
          }
        },
        conditionData: {},
        detailFlag: false,
        updateFlag: false,
        // 业务系统
        bizSysList: [],
        // 资源池
        resourcePoors: [],
        // 机房
        idc_locations: [],
        // 设备类型
        device_types: [],
        // 设备分类
        device_classs: [],
        device_typess: [],
        alert_froms: [],
        device_mfrss: [],
        alert_level: [],
        alert_type: [],
        currentList: [],
        pod_names: [],
        ipLoading: false,
        ruleName: ''
      }
    },
    mounted() {
      this.getResourcePoor()
      this.getIdcLocation()
      this.getDeviceType('device_class')
      this.getDeviceMfrss()
      this.getDeviceTypess()
      this.getPodNames()
      this.getBizSysList()
      this.alert_level = alert_level
      this.alert_type = alert_type
      if (this.dialogMsg.data && this.dialogMsg.data.id) {
        this.queryDetail(this.dialogMsg.data.id)
        this.updateFlag = true
      } else {
        this.initUser()
        this.showFilterFlag = true
        this.formData.effectiveDate = this.getDay(0)
        this.formData.expireDate = this.getDay(7)
      }
      //工单数据
    },
    methods: {
      queryDetail(id) {
        rbAlertDeriveServiceFactory.getDetail(id).then((date) => {
          this.formData = date
          this.ruleName = date.name
          this.formData.user = this.formData.operateUser.split(',')
          this.formData.user.forEach((user) => {
            if (user === this.myuser) {
              this.currentUserFlag = true
            } else {
              this.dialogUser.date.push(user)
              this.otherUserFlag = true
            }
          })
          this.conditionData = JSON.parse(date.optionCondition)
          this.alertSetting = JSON.parse(date.alertSetting)
          this.showFilterFlag = true
        }).catch(() => {
          this.showFilterFlag = true
        })

        //工单数据
      },
      //用户信息
      getUser() {
        this.dialogUser.dialogVisible = true;
      },

      //确认
      submit() {
        this.$refs['formData'].validate((valid) => {
          this.$refs['formData1'].validate((valid1) => {
            this.$refs['formData2'].validate((valid2) => {
              if (valid && valid1 && valid2) {
                this.formData.operateUser = this.formData.user.join(',')
                let dataFilterJson = {data: []}
                let dataFilterList = JSON.parse(JSON.stringify(this.$refs.filterOrder.dataFilterList))

                for (let i = 0; i < dataFilterList.length; i++) {
                  let rowList = dataFilterList[i].rowList
                  let andData = {data: []}
                  for (let j = 0; j < rowList.length; j++) {
                    let col0 = rowList[j].colList[0].selectedVal
                    let col1 = rowList[j].colList[1].selectedVal
                    let col2 = rowList[j].colList[2].selectedVal
                    if (col0 === '' || col1 === '' || col2 === '') {
                      // console.log('有数据未填，不能提交')
                      // this.$message.warning(this.validationPhase.errorMsg)
                      // return
                    }
                    let colData = {}
                    if (rowList[j].colList[2].type === 'select' && rowList[j].colList[1].multipleFlag === true) {
                      colData['value'] = col2
                    } else if ((col1 === 'in' || col1.indexOf('not') === 0) && rowList[j].colList[2].type !== 'select') {
                      let vals = col2.split(',')
                      colData['value'] = vals
                    } else {
                      colData['value'] = col2
                    }
                    colData['filterItemName'] = col0
                    colData['operate'] = col1
                    colData['jdbcType'] = rowList[j].colList[0].jdcbType
                    andData['data'].push(colData)
                  }
                  dataFilterJson['data'].push(andData)
                }
                this.formData.optionCondition = JSON.stringify(dataFilterJson)
                this.formData.alertSetting = JSON.stringify(this.alertSetting)
                if (this.updateFlag) {
                  rbAlertDeriveServiceFactory.update(this.formData).then((date) => {
                    this.$emit('closeDialog', 'update');
                  })
                } else {
                  rbAlertDeriveServiceFactory.insert(this.formData).then((date) => {
                    this.$emit('closeDialog', 'update');
                  })
                }

              } else {
                return false;
              }
            })
          })
        })
      },

      //取消
      cancel() {
        this.$emit('closeDialog');
      },

      //关闭用户弹窗
      closeDialogUser(date) {
        this.dialogUser.dialogVisible = false;
        if (date && date.type === 'update') {
          //确认的操作
          this.dialogUser.date = date.userResult
          this.formData.user = Array.from(new Set([this.formData.user, date.userResult]))
        }

      },
      selectCurrent() {
        if (this.currentUserFlag) {
          let containFlag = false
          for (let i = 0; i < this.formData.user.length; i++) {
            if (this.formData.user[i] === this.myuser) {
              containFlag = true
              break
            }
          }
          if (!containFlag) {
            this.formData.user.unshift(this.myuser)
          }
        } else {
          for (let i = 0; i < this.formData.user.length; i++) {
            if (this.formData.user[i] === this.myuser) {
              this.formData.user.splice(i, 1);
            }
          }
        }
      },
      selectOther() {

        if (!this.otherUserFlag) {
          this.dialogUser.date = []
          this.initUser()
        }
      },
      initUser() {
        if (this.currentUserFlag) {
          this.formData.user = [this.myuser]
        }
      },
      getDay(day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        // return tYear + "-" + tMonth + "-" + tDate + " " + hour + ":00:00";
        today.setSeconds(0)
        today.setMinutes(0)
        return today
      },
      changeFilterOrder(val) {
      },
      changeEffectiveTime() {
        this.formData.effectiveDate.setSeconds(0)
        this.formData.effectiveDate.setMinutes(0)
      },
      changeExpireTime() {
        this.formData.expireDate.setSeconds(0)
        this.formData.expireDate.setMinutes(0)
      },
      // 获取资源池
      getResourcePoor() {
        let obj = {
          'type': 'idcType',
          'pid': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.resourcePoors = res
          }
        })
      },
      // 获取机房
      getIdcLocation() {
        let obj = {
          'type': 'roomId',
          'pid': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            let value = []
            res.forEach((item) => {
              if (value.indexOf(item.value) === -1) {
                value.push(item.value)
                this.idc_locations.push(item)
              }
            })
          }
        })
      },
      // 获取设备厂商
      getDeviceMfrss() {
        let obj = {
          'type': 'device_mfrs',
          'pid': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.device_mfrss = res
          }
        })
      },
      // 获取设备分类
      getDeviceType(type) {
        let obj = {
          'type': type,
          'pid': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.device_classs = res
          }
        })
      },
      // 获取设备类型
      getDeviceTypess() {
        let obj = {
          'type': 'device_type',
          'pid': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.device_typess = res
          }
        })
      },
      getPodNames() {
        let obj = {
          'type': 'pod_name',
          'pid': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.pod_names = res
          }
        })
      },
      getBizSysList() {
        let obj = {
          'type': 'bizSystem',
          'pid': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.bizSysList = res
          }
        })
      },
      getList(query) {
        let query_data =  {
          ip: query,
          idcType: this.alertSetting.idc_type,
          queryType: "normal",
          pageNumber: 1,
          pageSize: 50}
        rbCmdbServiceFactory.getInstanceList(query_data).then((res) => {
          this.currentList = res.data
        })
      },
      selectIp(index) {
        if (index !== undefined && index !== null) {
          let selVal = this.currentList[index]
          this.alertSetting.objectId = selVal.id
          this.alertSetting.deviceId = selVal.id
          this.alertSetting.deviceIp = selVal.ip
          this.alertSetting.idcType = selVal.idcType
          this.alertSetting.projectName = selVal.project_name
          this.alertSetting.podName = selVal.pod_name
          this.alertSetting.sourceRoom = selVal.roomId
          this.alertSetting.deviceClass = selVal.device_class
          this.alertSetting.deviceType = selVal.device_type
          this.alertSetting.deviceMfrs = selVal.device_mfrs
          this.alertSetting.deviceModel = selVal.device_model
          this.alertSetting.bizSys = selVal.bizSystem
        } else {
          this.alertSetting.objectId = ''
          this.alertSetting.deviceId = ''
          this.alertSetting.deviceIp = ''
          this.alertSetting.projectName = ''
          this.alertSetting.podName = ''
          this.alertSetting.sourceRoom = ''
          this.alertSetting.deviceClass = ''
          this.alertSetting.deviceType = ''
          this.alertSetting.deviceMfrs = ''
          this.alertSetting.deviceModel = ''
          this.alertSetting.bizSys = ''
        }
      },
      changeSameDevice () {
        if (this.formData.deviceRelationType === '1') {
          this.alertSetting.objectType = '1'
          this.$forceUpdate()
        }
      }
    }
  }

</script>
<style lang="scss" scoped>
  .data-div-boarder {
    border: 1px solid #eeeeee;
    border-radius: 3px;
  }
</style>
