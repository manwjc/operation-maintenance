<template>
  <div class="components-container yw-dashboard" v-loading="loadingInfo.loading">
    <el-tabs class="yw-tabs"
             v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane :label="item.label"
                   :name="item.name"
                   :statusInfo="statusInfo"
                   v-loading="loadingInfo.loading"
                   v-for="(item,index) in tabData"
                   :key="index">
      </el-tab-pane>
    </el-tabs>

    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="分支机构">
        <YwSelect :SelectData="SelectData.province"
                  disabled="disabled"
                  :result="selectProvince"
                  @changeSelect="changeSelect({obj:SelectData,key:'province'},arguments)"></YwSelect>
      </el-form-item>
      <el-form-item label="评估周期">
        <el-date-picker
          v-model="SelectData.year"
          style="width: 90px"
          type="year"
          value-format="yyyy"
          :clearable="false"
          placeholder="选择年">
        </el-date-picker>
        <el-select
          v-model="SelectData.quarter"
          style="width: 100px">
          <el-option v-for="(item, index) in quarters"
                     :key="index"
                     :label="item"
                     :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="填报人">
        <YwSelectPerson :SelectData="SelectData.person"
                        @changeSelect="changeSelect({obj:SelectData,key:'person'},arguments)">
        </YwSelectPerson>
        <el-input v-model="SelectData.mobile"
                  placeholder="联系方式"
                  disabled></el-input>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="query()">查询</el-button>
        <el-button @click="submit()">提交</el-button>
      </section>
    </el-form>

    <component :is="currentTabComponent"
               :ref="currentTabComponent"
               :statusInfo="statusInfo"
               :SelectProps="SelectData"
               :loadingInfo="loadingInfo"
               :key="triggerQuery"></component>

    <!-- <ul class="step-wrap">
      <li class="step-item"
          @click="goPrev()">上一步</li>
      <li v-if="currentTabComponent !== 'evaluate'"
          class="step-item"
          @click="goNext()">下一步</li>
      <li v-if="currentTabComponent === 'evaluate'"
          class="step-item"
          @click="submit()">提交数据</li>
      <li class="step-item"
          @click="submit()">提交数据</li>
    </ul> -->

  </div>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'

export default {
  name: '/resource/itInput',
  mixins: [QueryObject],
  components: {
    YwSelectPerson: () => import('src/components/common/yw-select-person.vue'),
    YwSelect: () => import('src/components/common/yw-select.vue'),
    deviceInfo: () => import('src/pages/resource/deviceInfo/add.vue'),
    repairInfo: () => import('src/pages/resource/repairInfo/add.vue'),
    problemEvent: () => import('src/pages/resource/problemEvent/add.vue'),
    equipmentProblem: () => import('src/pages/resource/equipmentProblem/add.vue'),
    evaluate: () => import('src/pages/resource/evaluate/add.vue')

  },
  data () {
    return {
      //触发刷新
      triggerQuery: '',
      loadingInfo: {
        loading: false
      },
      quarters: ['第一季度', '第二季度', '第三季度', '第四季度'],
      provinceObj: {},
      // tab
      statusInfo: {
        status: null
      },
      activeName: 'deviceInfo',
      activeIndex: 0,
      tabData: [
        { label: 'IT设备量信息录入', name: 'deviceInfo', index: 0 },
        { label: '维修事件信息录入', name: 'repairInfo', index: 1 },
        { label: '故障事件信息录入', name: 'problemEvent', index: 2 },
        { label: '设备问题信息录入', name: 'equipmentProblem', index: 3 },
        { label: '评估得分信息录入', name: 'evaluate', index: 3 }],
      currentTabComponent: 'deviceInfo',
      //分支机构
      selectProvince: [],

    }
  },
  mounted () {
    this.loadingInfo.loading = true
    this.SelectData.quarter = this.getQuarter()
    if (this.SelectData.quarter === '第四季度') {
      this.SelectData.year = (new Date().getFullYear() - 1).toString()
    } else {
      this.SelectData.year = new Date().getFullYear().toString()
    }
    this.init();
  },
  methods: {
    //初始数据
    async init () {
      await this.queryUser();
      await this.queryProvinces();
      this.query();
    },
    handleClick (tab, event) {
      this.currentTabComponent = tab.name;
      this.activeIndex = tab.index;
    },
    //查询
    query () {
      if (this.currentTabComponent ==='deviceInfo' || this.currentTabComponent ==='evaluate') {
        this.$refs[this.currentTabComponent].init()
      } else {
        this.$refs[this.currentTabComponent].query()
      }
      // this.triggerQuery = `${this.SelectData.province},${this.SelectData.person},${this.SelectData.year},${this.SelectData.quarter}`;
    },

    //上一步
    goPrev () {
      if (this.activeIndex > 0) {
        --this.activeIndex;
        this.activeName = this.tabData[this.activeIndex].name;
        this.currentTabComponent = this.tabData[this.activeIndex].name;
      }

    },

    //下一步
    goNext () {
      if (this.activeIndex < this.tabData.length - 1) {
        ++this.activeIndex;
        this.activeName = this.tabData[this.activeIndex].name;
        this.currentTabComponent = this.tabData[this.activeIndex].name;
      }
    },

    //提交
    submit () {
      this.$confirm('确认提交？').then(() => {
        this.loadingInfo.loading = true
        this.rbHttp.sendRequest({
          method: 'PUT',
          url: `/v1/cmdb/assessment/assessment/approval`,
          params: {
            status: -1,
            province: this.SelectData.province,
            quarter: this.SelectData.year + this.SelectData.quarter
          }
        }).then((res) => {
          if (res.success) {
            this.activeIndex = 0;
            this.activeName = 'deviceInfo';
            this.currentTabComponent = 'deviceInfo';
            this.$refs['deviceInfo'].init()
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
          return res
        }).finally(() => {
          this.loadingInfo.loading = false
        })
      })

    },

    //分支机构
    queryProvinces () {
      return this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/department/queryList`,
        data: { name: sessionStorage.getItem('userInfo') },
      }).then((res) => {
        this.selectProvince = res;
        this.selectProvince.some((item, index) => {

          if (item.uuid === this.SelectData.province) {
            this.SelectData.province = item.name;
            return;
          }
        })

        return res
      });

    },
  }
}
</script>

<style lang="scss" scoped>
</style>
