<template>
  <el-container class="components-container" v-loading="loadingInfo.loading" :element-loading-text="loadingInfo.loading_text">
    <el-aside class="yw-dashboard"
              width="260px">
      <section class="search-wrap">
        <el-input placeholder="筛选"
                  v-model="filterText">
        </el-input>
        <!--<el-button type="text"-->
                   <!--icon="el-icon-refresh"-->
                   <!--@click="refresh()"></el-button>-->
      </section>
      <el-scrollbar class="aside-main"
                    style="height: calc(100% - 60px)">
        <ul class="select-section">
          <li class="select-item"
              :class="{active: item.name === provinceObj.name}"
              v-for="(item,index) in provinceData"
              v-if="!filterText || item.name.indexOf(filterText.trim()) > -1 "
              @click="queryByProvince(item)"
              :key="index">{{item.name}}
            <span
              class="wait"
              v-if="provinceStatus[item.name] === -1">待审批</span>
            <span
              class="approved"
              v-if="provinceStatus[item.name] === 1">已审批</span>
          </li>
        </ul>
      </el-scrollbar>
    </el-aside>
    <el-main class="yw-dashboard">
      <el-form class="components-condition yw-form" :inline="true" label-width="60px">
        <el-form-item label="评估周期">
          <el-date-picker v-model="quarter.year"
                          style="width: 90px"
                          type="year"
                          value-format="yyyy"
                          @change="query()"
                          :clearable="false"
                          placeholder="年"></el-date-picker>
          <el-select v-model="quarter.quarter" @change="query()" style="width: 100px">
            <el-option v-for="(item, index) in quarters" :key="index" :label="item" :value="item"></el-option>
          </el-select>
          <span style="width: 6px;">&nbsp;</span>
          <el-button type="primary" @click="approve()">审核通过</el-button>
          <el-button @click="reject()">审核驳回</el-button>
        </el-form-item>
        <el-form-item label="生成评分类型" label-width="85px">
          <el-select v-model="evaluateDeviceType" style="width: 120px;" filterable>
            <el-option v-for="(item, index) in deviceTypeData" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
          <span style="width: 6px;">&nbsp;</span>
          <el-button type="primary" @click="makeEvaluate()">生成评分</el-button>
        </el-form-item>
      </el-form>

      <!-- tab -->
      <section class="yw-tab-section">
        <el-tabs class="yw-tabs"
                 v-model="activeName"
                 @tab-click="handleClick">
          <el-tab-pane :label="item.label"
                       tabindex="-1"
                       :name="item.name"
                       v-for="(item,index) in tabData"
                       :key="index">
          </el-tab-pane>
        </el-tabs>
        <!--<el-form class="yw-tab-right">-->
          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
          <!--<el-button type="text"-->
                     <!--icon="el-icon-circle-check"-->
                     <!--@click="approve()">审核通过</el-button>-->
          <!--<el-button type="text"-->
                     <!--icon="el-icon-circle-close"-->
                     <!--@click="reject()">审核驳回</el-button>-->

        <!--</el-form>-->
      </section>
      <!-- tab -->

      <component v-if="provinceObj.name" :ref="currentTabComponent"
                 :is="currentTabComponent"
                 :provinceObj="provinceObj"
                 :quarter="quarter "
                 :loadingInfo="loadingInfo"
                 :provinceStatus="provinceStatus"
                 @resolveProvince="resolveProvince"
                 :key="provinceObj.name"></component>

    </el-main>
  </el-container>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'
import rbAssessmentServiceFactory from 'src/services/cmdb/rb-assessment-services.factory.js'

export default {
  name: '/resource/check',
  mixins: [QueryObject],
  components: {
    deviceInfo: () => import('src/pages/resource/deviceInfo/list.vue'),
    repairInfo: () => import('src/pages/resource/repairInfo/list.vue'),
    problemEvent: () => import('src/pages/resource/problemEvent/list.vue'),
    equipmentProblem: () => import('src/pages/resource/equipmentProblem/list.vue'),
    evaluate: () => import('src/pages/resource/evaluate/list.vue')
  },
  data () {
    return {
      //过滤
      filterText: '',
      //province
      provinceData: [],
      deviceTypeData: [],
      provinceObj: {},
      hackReset: false,
      // tab
      activeName: 'deviceInfo',
      activeIndex: 0,
      tabData: [
        { label: 'IT设备量信息审核', name: 'deviceInfo', index: 0 },
        { label: '维修事件信息审核', name: 'repairInfo', index: 1 },
        { label: '故障事件信息审核', name: 'problemEvent', index: 2 },
        { label: '设备问题信息审核', name: 'equipmentProblem', index: 3 },
        { label: '评估得分信息审核', name: 'evaluate', index: 4 }],
      currentTabComponent: 'deviceInfo',
      quarters: ['第一季度', '第二季度', '第三季度', '第四季度'],
      quarter: {
        year: '',
        quarter: ''
      },
      //需要生成评分的设备类型
      evaluateDeviceType: '全部',
      loadingInfo: {
        loading: false,
        loading_text: ''
      },
      provinceStatus: {}
    }
  },
  created () {
    this.$nextTick(() => {
      this.hackReset = true
    })
  },
  mounted () {
    this.initQuarter()
    this.queryProvince()
    this.queryDeviceType()
  },
  methods: {
    initQuarter() {
      let that = this
      this.$set(that.quarter, 'quarter', this.getQuarter())
      // this.$set(this.quarter, 'year', new Date().getFullYear().toString())
      if (this.quarter.quarter === '第四季度') {
        that.quarter.year = (new Date().getFullYear() - 1).toString()
        // this.$set(that.quarter, 'year', (new Date().getFullYear() - 1).toString())
      } else {
        // that.quarter.year = new Date().getFullYear().toString()
        this.$set(that.quarter, 'year',new Date().getFullYear().toString())
      }
    },
    handleClick (tab, event) {
      this.currentTabComponent = tab.name;
      this.activeIndex = tab.index;
    },
    //查询
    async query () {
      this.loadingInfo.loading = true;
      this.queryProvince()
      this.queryDeviceType()
      if (this.currentTabComponent ==='deviceInfo' || this.currentTabComponent ==='evaluate') {
        await this.$refs[this.currentTabComponent].init()
      } else {
        await this.$refs[this.currentTabComponent].query()
      }
    },
    //驳回
    reject () {
      this.$confirm('确认驳回？').then(() => {
        this.loadingInfo.loading = true
        this.rbHttp.sendRequest({
          method: 'PUT',
          url: `/v1/cmdb/assessment/assessment/approval`,
          params: {
            province: this.provinceObj.name || '',
            status: 0,
            quarter: this.quarter.year + this.quarter.quarter
          },
        }).then((res) => {
          if (res.success) {
            this.activeIndex = 0;
            this.activeName = 'deviceInfo';
            this.currentTabComponent = 'deviceInfo';
            this.$refs['deviceInfo'].init()
            this.queryProvince()
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
          return res
        }).finally(() => {
          this.loadingInfo.loading = false
        });
      })

    },

    //通过
    approve () {
      this.$confirm('确认通过？').then(() => {
        this.rbHttp.sendRequest({
          method: 'PUT',
          url: `/v1/cmdb/assessment/assessment/approval`,
          params: {
            province: this.provinceObj.name || '',
            status: 1,
            quarter: this.quarter.year + this.quarter.quarter
          },
        }).then((res) => {
          if (res.success) {
            this.queryProvince()
            this.activeIndex = 0;
            this.activeName = 'deviceInfo';
            this.currentTabComponent = 'deviceInfo';
            this.$refs['deviceInfo'].init()
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
          return res
        });
      })
    },

    // 生成评分信息
    makeEvaluate () {
      this.$confirm('生成评分信息前,请确保所有参与评分的省份数据都已提交且审核通过, 确认生成评分？').then(() => {
        let deviceType = this.evaluateDeviceType === '全部' ? '' : this.evaluateDeviceType
        this.loadingInfo.loading = true
        this.loadingInfo.loading_text = '系统正在生成['+this.evaluateDeviceType+']类型评分信息, 处理可能需要稍长时间, 请耐心等待...'
        this.rbHttp.sendRequest({
          method: 'POST',
          url: `/v1/cmdb/assessment/assessment/makeevaluate`,
          params: {
            quarter: this.quarter.year + this.quarter.quarter,
            deviceType: deviceType
          },
        }).then((res) => {
          if (res.flag === 'success') {
            this.$message.success('评分生成成功')
          } else {
            this.$message.error(res.msg)
          }
        }).finally(() => {
          this.loadingInfo.loading = false
          this.loadingInfo.loading_text = ''
        });
      })
    },

    //查询类型
    queryDeviceType () {
      this.deviceTypeData = [{'name': '全部'}]
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/type/list`,
        params: this.queryParams,
      }).then((res) => {
        if (res) {
          res.forEach((item) => {
            this.deviceTypeData.push(item)
          })
        }
        return res
      });
    },

    //查询省市
    queryProvince () {
      this.provinceData = []
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/department/queryList`,
        data: {},
      }).then((res) => {
        this.provinceData = res;
        this.gerProvinceStatus()
      })
    },
    gerProvinceStatus () {
      this.provinceStatus = {}
      let data = {
        quarter: this.quarter.year + this.quarter.quarter
      }
      rbAssessmentServiceFactory.getProvinceStatus(data).then((res) => {
        res.forEach(item => {
          this.$set(this.provinceStatus, item.province, item.status)
        })
        this.resolveProvince()
      })
    },
    resolveProvince () {
      let that = this
      let waitData = []
      let appData = []
      let otherData = []
      let copyData = JSON.parse(JSON.stringify(this.provinceData))
        copyData.forEach((item,index) => {
          if (!that.provinceStatus[item.name]) {
            otherData.push(item)
            return true
          }
          for (let i in this.provinceStatus) {
            // 拿出待审批数据
            if (i === item.name && that.provinceStatus[i] === -1){
              waitData.push(item)
            }else if (i === item.name && that.provinceStatus[i] === 1){
              appData.push(item)
            }
          }
        })
      that.provinceData = (waitData.concat(appData)).concat(otherData)
      that.provinceObj = that.provinceData[0];
    },
    //通过省市查询数据
    queryByProvince (val) {
      if (val.name === this.provinceObj.name) {
        return
      }
      this.loadingInfo.loading = true
      this.provinceObj = val;
    },

    //刷新
    refresh () {
      this.filterText = ''
    }

  }
}
</script>

<style lang="scss" scoped>
  .btn-wrap {
    text-align: center;
  }
  .components-condition {
    padding-right: 200px;
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
