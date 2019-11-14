<template>
  <div class="components-container yw-dashboard">
    <el-collapse class="yw-dashboard-section"
                 v-model="activeCollapseNames">
      <el-collapse-item name="1">
        <template slot="title">
          衍生规则
        </template>
        <el-form class="yw-form components-condition"
                 label-width="75px"
                 :model="formData"
                 :inline="true">
          <el-form-item label="规则名称">
            <el-input v-model="formData.name"
                      placeholder="" disabled></el-input>
          </el-form-item>
          <el-form-item label="生效时间">
            <el-date-picker v-model="formData.effectiveDate"
                            type="datetime"
                            placeholder="选择日期" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="失效时间">
            <el-date-picker v-model="formData.expireDate"
                            type="datetime"
                            placeholder="选择日期" disabled>
            </el-date-picker>
          </el-form-item>
          <br/>
          <el-form-item label="规则描述">
            <el-input type="textarea"
                      :rows="2"
                      placeholder=""
                      v-model="formData.description" disabled></el-input>
          </el-form-item>
          <br/>
          <el-form-item label="维护用户">
            <el-checkbox label="当前用户" v-model="currentUserFlag" disabled></el-checkbox>
            <el-checkbox label="其他用户" v-model="otherUserFlag" disabled></el-checkbox>
            <el-input v-model="formData.operateUser"
                      placeholder=""
                      :disabled="true"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="收敛类型">
            <el-radio v-model="formData.deviceRelationType" label="1" @change="changeSameDevice" disabled>同一设备衍生一条</el-radio>
            <el-radio v-model="formData.deviceRelationType" label="2" disabled>不同设备</el-radio>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          衍生条件
        </template>
        <YwFilterOrder :dataList="optionData"
                       :detailFlag="detailFlag"
                       v-if="showFilterFlag"></YwFilterOrder>
      </el-collapse-item>
      <el-collapse-item class="data-div-boarder" name="3">
        <template slot="title">
          触发条件设置
        </template>
        <el-form class="yw-form is-required"
                 :inline="true"
                 :model="formData"
                 label-width="110px"
                 ref="formData"
                 :rules="rules">
          <el-form-item label="关联时间窗(m)" prop="deriveActiveTimeout">
            <el-input v-model="formData.deriveActiveTimeout"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="告警阈值个数" prop="alertThreshold">
            <el-input v-model="formData.alertThreshold"
                      disabled></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item class="data-div-boarder" name="4">
        <template slot="title">
          告警生成设置
        </template>
        <el-form class="yw-form is-required"
                 :inline="true"
                 :model="alertSetting"
                 label-width="85px">
          <el-form-item label="告警来源">
            <el-input v-model="alertSetting.source"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="告警等级" prop="alertLevel">
            <el-select v-model="alertSetting.alertLevel" clearable disabled>
              <el-option v-for="item in alert_level"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="告警分类" prop="objectType">
            <el-select v-model="alertSetting.objectType" clearable disabled>
              <el-option v-for="item in alert_type"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="监控对象">
            <el-input v-model="alertSetting.moniObject" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="告警设备IP" v-if="formData.deviceRelationType !== '1'">
            <el-input v-model="alertSetting.deviceIp"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="资源池" v-if="formData.deviceRelationType !== '1'">
            <el-input v-model="alertSetting.idcType" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="工程期数" v-if="formData.deviceRelationType !== '1'">
            <el-input v-model="alertSetting.projectName" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="POD池" v-if="formData.deviceRelationType !== '1'">
            <el-input v-model="alertSetting.podName" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="机房" v-if="formData.deviceRelationType !== '1'">
            <el-input v-model="alertSetting.sourceRoom" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="设备分类" v-if="formData.deviceRelationType !== '1'">
            <el-input v-model="alertSetting.deviceClass" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="设备类型" v-if="formData.deviceRelationType !== '1'">
            <el-input v-model="alertSetting.deviceType" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="设备厂商" v-if="formData.deviceRelationType !== '1'">
            <el-input v-model="alertSetting.deviceMfrs" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="设备型号" v-if="formData.deviceRelationType !== '1'">
            <el-input v-model="alertSetting.deviceModel" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="业务系统" v-if="formData.deviceRelationType !== '1'">
            <el-input v-model="alertSetting.bizSys" disabled>
            </el-input>
          </el-form-item>
          <!--            <el-form-item label="告警名称">-->
          <!--              <el-input v-model="alertSetting.moni_object">-->
          <!--              </el-input>-->
          <!--            </el-form-item>-->
          <el-form-item label="告警内容">
            <el-input type="textarea"
                      :rows="2"
                      v-model="alertSetting.moniIndex" disabled></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template slot="title">
          操作记录
        </template>
        <el-form class="yw-form">
          <div class="yw-el-table-wrap">
            <el-table :data="result"
                      class="yw-el-table"
                      stripe
                      tooltip-effect="dark"
                      border
                      height="300px">
              <el-table-column prop="receiver"
                               label="操作人">
                <template slot-scope="scope">
                  {{scope.row.operater}}
                </template>
              </el-table-column>
              <el-table-column prop="mail_server"
                               label="操作类型">
                <template slot-scope="scope">
                  {{scope.row.operateTypeDesc}}
                </template>
              </el-table-column>
              <el-table-column prop="receive_port"
                               label="操作时间">
                <template slot-scope="scope">
                  {{scope.row.operateTime | formatDate}}
                </template>
              </el-table-column>
              <el-table-column prop="active"
                               label="操作内容">
                <template slot-scope="scope">
                  {{scope.row.operateContent}}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <YwPagination @handleSizeChange="handleSizeChange"
                        @handleCurrentChange="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        :total="total"></YwPagination>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import QueryObject from 'src/utils/queryObject.js'
  import rbAlertIsolateServiceFactory from 'src/services/alert/rb-alert-isolate-service.factory'
  import rbAlertDeriveServiceFactory from 'src/services/alert/rb-alert-derive-service.factory'
  import {alert_level, alert_type} from "../../alert/config/options"

  export default {
    name: '/mirror_alert/derive',
    mixins: [QueryObject],
    components: {
      YwFilterOrder: () => import('src/components/common/yw-filter-order.vue'),
      YwPagination: () => import('src/components/common/yw-pagination.vue'),
    },
    data() {
      return {
        id: '',
        activeCollapseNames: ['1', '2', '3', '4', '5'],
        //表单数据
        formData: {
          name: '*****衍生规则',
          user: ['当前用户'],
          startTime: '2019-08-13',
          endTime: '2019-08-13',
        },
        optionData: {},
        detailFlag: true,
        showFilterFlag: false,
        //结果
        result: [],
        currentUserFlag: false,
        otherUserFlag: false,
        alertSetting: {},
        alert_level: [],
        alert_type: []
      }
    },
    created() {
      this.id = this.$route.query.id
      this.alert_level = alert_level
      this.alert_type = alert_type
      this.queryDetail()
      this.query()
    },
    methods: {
      queryDetail() {
        rbAlertDeriveServiceFactory.getDetail(this.id).then((date) => {
          this.formData = date
          let myuser = sessionStorage.getItem('username')
          let users = this.formData.operateUser.split(',')
          users.forEach((user) => {
            if (user === myuser) {
              this.currentUserFlag = true
            } else {
              this.otherUserFlag = true
            }
          })
          this.optionData = JSON.parse(date.optionCondition)
          this.alertSetting = JSON.parse(date.alertSetting)
          this.showFilterFlag = true
        }).catch(() => {
          this.showFilterFlag = true
        })

        //工单数据
      },
      //设置参数
      setParams(activePagination) {

        if (activePagination) {
          this.queryParams['pageNum'] = this.currentPage;
          this.queryParams['pageSize'] = this.pageSize;
        } else {
          this.queryParams = {
            'relationId': this.id,
            'operateModel': 'alert_derive',
            'pageNum': this.initPageChange(),
            'pageSize': this.pageSize
          }
        }

      },
      query(activePagination = false) {
        this.setParams(activePagination);
        rbAlertIsolateServiceFactory.getOperateLogList(this.queryParams).then((data) => {
          this.result = data.result
          this.total = data.count
        }).catch(() => {
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .data-div-boarder {
    border: 1px solid #eeeeee;
    border-radius: 3px;
  }
</style>
