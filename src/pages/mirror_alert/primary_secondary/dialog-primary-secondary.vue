<template>
  <!-- 告警衍生规则 -->
  <div>
    <el-dialog class="yw-dialog"
               width="800px"
               title="主次告警规则设置"
               :visible.sync="dialogMsg.dialogVisible">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :inline="true"
                 :model="formData"
                 label-width="100px"
                 ref="formData"
                 :rules="rules">
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item><br/>
          <el-form-item label="规则描述">
            <el-input type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="formData.description">
            </el-input>
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
          <el-form-item label="设备关联类型">
            <el-radio v-model="formData.deviceRelationType" label="1">相同设备</el-radio>
            <el-radio v-model="formData.deviceRelationType" label="2">不同设备</el-radio>
          </el-form-item>
        </el-form>
        <span><b>主要告警设置</b></span>
        <YwFilterOrder :dataList="primaryConditionData"
                       :detailFlag="detailFlag"
                       :queryType="'1'"
                       ref="primaryFilterOrder"
                       @changeFilterOrder="changeFilterOrder"
                       v-if="showFilterFlag && formData.deviceRelationType === '1'"></YwFilterOrder>

        <el-form class="yw-form is-required"
                 :inline="true"
                 :model="formData"
                 label-width="110px"
                 ref="formData1"
                 :rules="rules1">
          <div class="data-div-boarder" v-if="formData.deviceRelationType === '2'">
            <span>设备过滤</span><br>
            <el-form-item label="资源池" prop="primaryIdc">
              <el-select v-model="formData.primaryIdc"
                         placeholder="请选择"
                         clearable
                         filterable>
                <el-option v-for="item in resourcePoors"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备IP" prop="primaryIp">
              <el-input v-model="formData.primaryIp"
              ></el-input>
            </el-form-item>
          </div>
          <br>
          <div class="data-div-boarder">
            <span>监控项</span><br>
            <el-form-item label="告警内容" prop="primaryMoniIndex">
              <el-input v-model="formData.primaryMoniIndex" placeholder="模糊匹配"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警等级">
              <el-radio v-model="formData.primaryAlertLevel" v-for="(item,index) in alert_level" :key="index"
                        :label="item.value">{{item.label}}
              </el-radio>
            </el-form-item>
          </div>
        </el-form>


<!--          <el-form class="yw-form is-required"-->
<!--                   :inline="true"-->
<!--                   :model="formData"-->
<!--                   label-width="110px"-->
<!--                   ref="formData2"-->
<!--                   :rules="rules2">-->

<!--          </el-form>-->

        <span><b>次要告警设置</b></span>
        <YwFilterOrder :dataList="secondaryConditionData"
                       :detailFlag="detailFlag"
                       :queryType="formData.deviceRelationType === '1'? '2':'3'"
                       ref="filterOrder"
                       @changeFilterOrder="changeFilterOrder"
                       v-if="showFilterFlag"></YwFilterOrder>
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
  import rbAlertPrimarySecondaryServiceFactory from "src/services/alert/rb-alert-primary-secondary-service.factory"
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
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
        if (this.formData.deviceRelationType === '2') {
          if (!value || value === '') {
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
            rbAlertPrimarySecondaryServiceFactory.checkName(value2).then((date) => {
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
          description: '',
          operateUser: '',
          user: [],
          deviceRelationType: '2',
          primaryAlertLevel: '5'
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
          primaryIdc: [
            {required: true, message: '必填项'},
          ],
          primaryIp: [
            {required: true, message: '必填项'},
            {validator: checkIp, trigger: 'blur'}
          ],
          primaryMoniIndex: [
            {required: true, message: '必填项'}
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
        primaryConditionData: {},
        secondaryConditionData: {},
        detailFlag: false,
        updateFlag: false,
        // 资源池
        resourcePoors: [],
        alert_level: [],
        alert_type: [],
        currentList: [],
        pod_names: [],
        ipLoading: false,
        ruleName: '',
      }
    },
    mounted() {
      this.getResourcePoor()
      this.alert_level = alert_level
      this.alert_type = alert_type
      if (this.dialogMsg.data && this.dialogMsg.data.id) {
        this.queryDetail(this.dialogMsg.data.id)
        this.updateFlag = true
      } else {
        this.initUser()
        this.showFilterFlag = true
      }
      //工单数据
    },
    methods: {
      queryDetail(id) {
        rbAlertPrimarySecondaryServiceFactory.getDetail(id).then((date) => {
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
          if (this.formData.deviceRelationType === '1') {
            this.primaryConditionData = JSON.parse(date.primaryOptionCondition)
          }
          this.secondaryConditionData = JSON.parse(date.secondaryOptionCondition)
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
              if (valid && valid1) {
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
                this.formData.secondaryOptionCondition = JSON.stringify(dataFilterJson)
                if (this.formData.deviceRelationType === '1') {
                  let primaryDataFilterJson = {data: []}
                  let primaryDataFilterList = JSON.parse(JSON.stringify(this.$refs.primaryFilterOrder.dataFilterList))

                  for (let i = 0; i < primaryDataFilterList.length; i++) {
                    let rowList = primaryDataFilterList[i].rowList
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
                    primaryDataFilterJson['data'].push(andData)
                  }
                  this.formData.primaryOptionCondition = JSON.stringify(primaryDataFilterJson)
                }

                if (this.updateFlag) {
                  rbAlertPrimarySecondaryServiceFactory.update(this.formData).then((date) => {
                    this.$emit('closeDialog', 'update');
                  })
                } else {
                  rbAlertPrimarySecondaryServiceFactory.insert(this.formData).then((date) => {
                    this.$emit('closeDialog', 'update');
                  })
                }

              } else {
                return false;
              }
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
      changeFilterOrder(val) {
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
