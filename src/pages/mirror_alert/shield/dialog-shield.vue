<template>
  <!-- 告警屏蔽规则 -->
  <div>
    <el-dialog class="yw-dialog"
               width="900px"
               title="告警屏蔽规则设置"
               :visible.sync="dialogMsg.dialogVisible">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :inline="true"
                 :model="formData"
                 label-width="80px"
                 ref="formData"
                 :rules="rules">
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="formData.name"
                      clearable></el-input>
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

        </el-form>
        <YwFilterOrder :dataList="conditionData"
                       :detailFlag="detailFlag"
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
  import rbAlertFilterSceneServicesFactory from 'src/services/alert/rb-alertFilterScene-services.factory.js'
  import rbAlertIsolateServiceFactory from "src/services/alert/rb-alert-isolate-service.factory"

  export default {
    props: ['dialogMsg'],
    mixins: [],
    components: {
      YwFilterOrder: () => import('src/components/common/yw-filter-order.vue'),
      DialogUser: () => import('src/components/common/yw-dialog-user.vue'),
    },
    data() {
      return {
        //表单数据
        formData: {
          name: '',
          effectiveDate: '',
          expireDate: '',
          description: '',
          operateUser: '',
          user: [],
          optionCondition: ''
        },
        rules: {
          name: [
            {required: true, message: '必填项'},
            {min: 1, max: 64, message: '长度在 1 到 64 个字符'},
            {pattern: /^[A-Za-z\u4e00-\u9fa5][A-Za-z0-9\u4e00-\u9fa5\\-]*$/, message: '格式错误'}
          ],
          // effectiveDate: [
          //   {required: true, message: '必填项'},
          // ],
          // expireDate: [
          //   {required: true, message: '必填项'},
          // ]
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
        updateFlag: false
      }
    },
    mounted() {
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
        rbAlertIsolateServiceFactory.getDetail(id).then((date) => {
          this.formData = date
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

          if (valid) {
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
            if (this.updateFlag) {
              rbAlertIsolateServiceFactory.update(this.formData).then((date) => {
                this.$emit('closeDialog', 'update');
              })
            } else {
              rbAlertIsolateServiceFactory.insert(this.formData).then((date) => {
                this.$emit('closeDialog', 'update');
              })
            }

          } else {
            return false;
          }
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
      changeEffectiveTime () {
        this.formData.effectiveDate.setSeconds(0)
        this.formData.effectiveDate.setMinutes(0)
      },
      changeExpireTime () {
        this.formData.expireDate.setSeconds(0)
        this.formData.expireDate.setMinutes(0)
      }
    }
  }

</script>
<style lang="scss" scoped>
</style>
