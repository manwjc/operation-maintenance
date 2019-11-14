<template>
  <div class="components-container yw-dashboard">
    <el-collapse class="yw-dashboard-section"
                 v-model="activeCollapseNames">
      <el-collapse-item name="1">
        <template slot="title">
          衍生规则
        </template>
        <el-form class="yw-form components-condition"
                 label-width="90px"
                 :model="formData"
                 :inline="true">
          <el-form-item label="规则名称">
            <el-input v-model="formData.name"
                      placeholder="" disabled></el-input>
          </el-form-item>
          <el-form-item label="维护用户">
            <el-checkbox label="当前用户" v-model="currentUserFlag" disabled></el-checkbox>
            <el-checkbox label="其他用户" v-model="otherUserFlag" disabled></el-checkbox>
            <el-input v-model="formData.operateUser"
                      placeholder=""
                      :disabled="true"></el-input>
          </el-form-item>
          <br/>
          <el-form-item label="规则描述">
            <el-input type="textarea"
                      :rows="2"
                      placeholder=""
                      v-model="formData.description" disabled></el-input>
          </el-form-item>
          <br/>
          <el-form-item label="设备关联类型">
            <el-radio v-model="formData.deviceRelationType" label="1" disabled>相同设备</el-radio>
            <el-radio v-model="formData.deviceRelationType" label="2" disabled>不同设备</el-radio>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          主要告警设置
        </template>
        <YwFilterOrder :dataList="primaryConditionData"
                       :detailFlag="detailFlag"
                       v-if="showFilterFlag && formData.deviceRelationType === '1'"></YwFilterOrder>
        <div class="data-div-boarder" v-if="formData.deviceRelationType === '2'">
          <span>设备过滤</span><br>
          <el-form class="yw-form is-required"
                   :inline="true"
                   :model="formData"
                   label-width="110px">
            <el-form-item label="资源池" prop="primaryIdc">
              <el-input v-model="formData.primaryIdc" disabled>
              </el-input>
            </el-form-item>
            <el-form-item label="设备IP" prop="primaryIp">
              <el-input v-model="formData.primaryIp" disabled
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <br>
        <div class="data-div-boarder">
          <span>监控项</span><br>
          <el-form class="yw-form is-required"
                   :inline="true"
                   :model="formData"
                   label-width="110px">
            <el-form-item label="告警内容" prop="primaryMoniIndex">
              <el-input v-model="formData.primaryMoniIndex" placeholder="模糊匹配" disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="告警等级">
              <el-radio v-model="formData.primaryAlertLevel" v-for="(item,index) in alert_level" :key="index" :label="item.value" disabled>{{item.label}}</el-radio>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          次要告警设置
        </template>
        <YwFilterOrder :dataList="secondaryConditionData"
                       :detailFlag="detailFlag"
                       v-if="showFilterFlag"></YwFilterOrder>
      </el-collapse-item>
      <el-collapse-item name="4">
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
  import rbAlertPrimarySecondaryServiceFactory from "src/services/alert/rb-alert-primary-secondary-service.factory"
  import {alert_level, alert_type} from "../../alert/config/options"

  export default {
    // name: '/mirror_alert/primary_secondary',
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
        primaryConditionData: {},
        secondaryConditionData: {},
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
        rbAlertPrimarySecondaryServiceFactory.getDetail(this.id).then((date) => {
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
      //设置参数
      setParams(activePagination) {

        if (activePagination) {
          this.queryParams['pageNum'] = this.currentPage;
          this.queryParams['pageSize'] = this.pageSize;
        } else {
          this.queryParams = {
            'relationId': this.id,
            'operateModel': 'alert_primary_secondary',
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
