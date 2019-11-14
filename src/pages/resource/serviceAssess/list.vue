<template>
  <el-container class="components-container"
                v-loading="loading">
    <el-aside class="yw-dashboard"
              width="260px">
      <section class="search-wrap">
        <el-input placeholder="筛选"
                  v-model="filterText">
        </el-input>
        <el-button type="text"
                   icon="el-icon-refresh"
                   @click="refresh()"></el-button>
      </section>
      <el-scrollbar class="aside-main"
                    style="height: calc(100% - 60px)">
        <ul class="select-section">
          <li class="select-item"
              :class="{active: item.name === provinceObj.name}"
              v-for="(item,index) in repeatDeviceResult"
              v-if="!filterText || item.name.indexOf(filterText.trim()) > -1 "
              @click="queryByDeviceType(item)"
              :key="index">{{item.name}}
            <span
            class="wait"
            v-if="scoreStatus[item.name] > 0">待评分</span>
            <span
              class="approved"
              v-if="scoreStatus[item.name] === 0">已评分</span>
          </li>
        </ul>
      </el-scrollbar>
    </el-aside>
    <el-main class="yw-dashboard">
      <el-form class="components-condition yw-form"
               :inline="true"
               label-width="60px">

        <el-form-item label="评估周期">
          <el-date-picker
            v-model="quarter.year"
            style="width: 90px"
            type="year"
            @change="queryDevices()"
            value-format="yyyy"
            :clearable="false"
            placeholder="年">
          </el-date-picker>
          <el-select
            v-model="quarter.quarter"
            @change="queryDevices()"
            style="width: 100px">
            <el-option v-for="(item, index) in quarters"
                       :key="index"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <section class="btn-wrap">
          <el-button type="primary"
                     @click="save()">保存</el-button>
        </section>
      </el-form>
        <!--<div class="table-operate-wrap clearfix">-->
          <!--<el-button type="text"-->
                     <!--icon="el-icon-s-order"-->
                     <!--@click="save()">保存</el-button>-->
        <!--</div>-->
        <div class="yw-el-table-wrap">
          <el-table class="yw-el-table"
                    height="calc(100vh - 98px - 130px)"
                    border
                    :data="result">
            <el-table-column label="序号"
                             align="center"
                             width="80">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column label="厂家名称"
                             align="center">
              <template slot-scope="scope">
                {{scope.row.produce}}
              </template>
            </el-table-column>
            <el-table-column label="设备质量"
                             align="center">
              <el-table-column label="维修事件数"
                               align="center">
                <el-table-column label="事件数"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.eventCount}}
                  </template>
                </el-table-column>
                <el-table-column label="事件占比"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.eventRate ? (scope.row.eventRate + '%') : ''}}
                  </template>
                </el-table-column>
                <el-table-column label="设备占比"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.eventDeviceRate}}%
                  </template>
                </el-table-column>
                <el-table-column label="指标值"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.eventTargetValue}}
                  </template>
                </el-table-column>
                <el-table-column label="得分"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.eventScore}}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="故障事件数"
                               align="center">
                <el-table-column label="故障数"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.problemCount}}
                  </template>
                </el-table-column>
                <el-table-column label="得分"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.problemScore}}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="设备问题占比"
                               align="center">
                <el-table-column label="问题数"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.equipmentProblemCount}}
                  </template>
                </el-table-column>
                <el-table-column label="问题占比"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.equipmentProblemRate}}%
                  </template>
                </el-table-column>
                <el-table-column label="设备占比"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.equipmentProblemDeviceRate}}%
                  </template>
                </el-table-column>
                <el-table-column label="指标值"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.equipmentProblemTargetValue}}
                  </template>
                </el-table-column>
                <el-table-column label="得分"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.equipmentProblemScore}}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="故障处理平均时长"
                               align="center">
                <el-table-column label="总时长（小时）"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.eventProblemHandleLong}}
                  </template>
                </el-table-column>
                <el-table-column label="事件数"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.eventCount}}
                  </template>
                </el-table-column>
                <el-table-column label="指标值"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.problemHandleTargetValue}}
                  </template>
                </el-table-column>
                <el-table-column label="得分"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.problemHandleScore}}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="业务恢复处理平均时长"
                               align="center">
                <el-table-column label="总时长（小时）"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.bizRepairLong}}
                  </template>
                </el-table-column>
                <el-table-column label="事件数"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.problemCount}}
                  </template>
                </el-table-column>
                <el-table-column label="指标值"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.bizRepairTargetValue}}
                  </template>
                </el-table-column>
                <el-table-column label="得分"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.bizRepairScore}}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column label="服务满意度"
                             align="center">
              <el-table-column label="服务评估得分"
                               align="left">
                <el-table-column label="指标值"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.serviceScore}}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="综合满意度"
                               align="center">
                <el-table-column label="指标值"
                                 width="160px"
                                 align="center">
                  <template slot-scope="scope">
                    <input class="edit-input"
                           type="number"
                            v-model="scope.row.satisfactionScore"
                           min="0.00"
                           max="10.00"
                           size="mini"
                           style="width: 100%;"
                           @change="changeResult(scope.row.satisfactionScore,scope)">
                    </input>

                    <!--<el-input-number v-model="scope.row.satisfactionScore"-->
                                     <!--:precision="2"-->
                                     <!--:step="0.1"-->
                                     <!--:min="0"-->
                                     <!--:max="10"-->
                                     <!--size="mini"-->
                                     <!--style="width: 100%;"-->
                                     <!--@change="changeResult(scope.row.satisfactionScore,scope)"></el-input-number>-->
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column label="最终得分"
                             align="left">
              <template slot-scope="scope">
                {{scope.row.score}}
              </template>
            </el-table-column>
            <el-table-column label="总设备量"
                             align="left">
              <template slot-scope="scope">
                {{scope.row.totalDeviceCount}}
              </template>
            </el-table-column>
          </el-table>
        </div>
    </el-main>
  </el-container>

</template>

<script>
import QueryObject from 'src/utils/queryObject.js'
import rbAssessmentServiceFactory from 'src/services/cmdb/rb-assessment-services.factory.js'

export default {
  mixins: [QueryObject],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
  },
  data () {
    return {
      //过滤
      filterText: '',
      // 表单数据
      formData: {
      },
      //查询条件
      queryParams: {
      },
      //保存参数
      saveParams: [],
      // 查询结果
      result: [],
      repeatDeviceResult: [],//设备类型
      provinceObj: {},
      quarters: ['第一季度', '第二季度', '第三季度', '第四季度'],
      quarter: {},
      loading: false,
      scoreStatus: {}
    }
  },
  mounted () {
    this.initQuarter()
    this.queryDevices();
  },
  methods: {
    //初使化评估周期
    initQuarter() {
      this.$set(this.quarter, 'quarter', this.getQuarter())
      if (this.quarter.quarter === '第四季度') {
        this.$set(this.quarter, 'year', (new Date().getFullYear() - 1).toString())
      } else {
        this.$set(this.quarter, 'year',new Date().getFullYear().toString())
      }
    },
    //设置查询参数
    setParams () {
      this.queryParams = {
        "device_type": this.provinceObj.name ? this.provinceObj.name : '',
        "quarter": this.quarter.year + this.quarter.quarter,
      }
    },
    //查询下拉框-deviceType(解决循环加载问题)
    queryDevices () {
      this.repeatDeviceResult = []
      this.loading = true
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/type/list`,
        params: this.queryParams,
      }).then((res) => {
        this.repeatDeviceResult = res;
        // this.provinceObj = this.repeatDeviceResult[0];
        // this.query();
        this.getScoreStatus()
        return res
      }).finally(() => {
        this.loading=false
      });
    },
    query () {
      this.setParams();
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/serviceAssess/queryAllData`,
        params: this.queryParams
      }).then((res) => {
        this.loading = false
        this.result = res
      }).finally(() => {
        this.loading = false
      });
    },
    getScoreStatus () {
      let that = this
      this.scoreStatus = {}
      let data = {
        quarter: this.quarter.year + this.quarter.quarter
      }
      this.provinceObj = this.repeatDeviceResult[0]
      rbAssessmentServiceFactory.getScoreDeviceTypeStatus(data).then((res) => {
        res.forEach(item => {
          that.$set(that.scoreStatus, item.device_type, item.unScored)
        })
        let waitData = []
        let scoredData = []
        let otherData = []
        let copyData = JSON.parse(JSON.stringify(that.repeatDeviceResult))
          copyData.forEach((item,index) => {
            if (!that.scoreStatus[item.name]) {
              otherData.push(item)
              return true
            }
            for (let i in that.scoreStatus) {
              // 拿出待评分数据
              if (i === item.name && that.scoreStatus[i] > 0){
                waitData.push(item)
              } else if (i === item.name && that.scoreStatus[i] === 0) {
                scoredData.push(item)
              }
            }

          })
        that.repeatDeviceResult = (waitData.concat(scoredData)).concat(otherData)
        that.provinceObj = that.repeatDeviceResult[0];
        that.query()
      })
    },
    changeResult (r1, scope) {
      if (r1 > 10.00) {
        r1 = 10.00
        scope.row.satisfactionScore = 10.00
      }
      let rule = /^(?!0(\.0{1,2})?$)(\d(\.\d{1,2})?|10)$/
      if (!rule.test(r1)) {
        scope.row.satisfactionScore = Math.floor(scope.row.satisfactionScore * 100) / 100
        r1 =  Math.floor(r1 * 100) / 100
      }
      let num = 0
      let falseNum = 0
      num += scope.row.eventScore === 'FALSE' ? 0 : Number(scope.row.eventScore)
      falseNum += scope.row.eventScore === 'FALSE' ?  1 : 0
      num += scope.row.problemScore ? Number(scope.row.problemScore) : 0
      num += scope.row.equipmentProblemScore ? Number(scope.row.equipmentProblemScore) : 0
      num += scope.row.problemHandleScore === 'FALSE' ? 0 : Number(scope.row.problemHandleScore)
      falseNum += scope.row.problemHandleScore === 'FALSE' ?  1 : 0
      num += scope.row.bizRepairScore === 'FALSE' ? 0 : Number(scope.row.bizRepairScore)
      falseNum += scope.row.bizRepairScore === 'FALSE' ?  1 : 0
      num += scope.row.serviceScore ? Number(scope.row.serviceScore) : 0
      num += Number(r1)
      if (falseNum > 1) {
        num = num / 0.4
      } else {
        num = num / 0.9
      }
      scope.row.score = parseFloat(num).toFixed(2)
    },
    queryByDeviceType (val) {
      this.provinceObj = val;
      this.query();
    },
    save () {
      let that = this
      this.$confirm('确认保存？').then(() => {
        that.rbHttp.sendRequest({
          method: 'POST',
          url: `/v1/cmdb/device/serviceAssess/saveScore`,
          data: this.result
        }).then((res) => {
          if (res.flag === 'success') {
            that.$message.success('保存成功');
            that.queryDevices()
          } else {
            that.$message.success(res.msg);
          }
        });
      })
    },

    //刷新
    refresh () {
      this.filterText = ''
    }

  }
}
</script>

<style lang="scss" scoped>

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
  .btn-wrap {
    text-align: center;
  }
  .components-condition {
    padding-right: 60px;
  }
  .wait {
    color: white;
    border-radius: 10px;
    padding: 2px 10px;
    background-color: #F56C6C;
  }
  .approved {
    color: white;
    border-radius: 10px;
    padding: 2px 10px;
    background-color: #67C23A;
  }
</style>
