<template>
  <!-- 监控dashboard -->
  <div class="components-container yw-dashboard">
    <!-- tab -->
    <section class="dashboard-section">
      <h1 class="dashboard-title"><i class="dashboard-icon">1</i>选择图表类型</h1>
      <div class="dashboard-content">
        <el-tabs class="dashboard-tab-wrap"
                 v-model="activeName"
                 @tab-click="handleTab">
          <el-tab-pane :label="item.label"
                       :name="item.name"
                       v-for="(item,index) in tabData"
                       :key="index">
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
    <!-- tab -->

    <!-- form -->
    <section class="dashboard-section">
      <h1 class="dashboard-title"><i class="dashboard-icon">2</i>选择监控项</h1>
      <div class="dashboard-content">
        <el-form class="yw-form yw-select-form"
                 v-for="(formItem,index) in formDatas"
                 :key="index"
                 :inline="true"
                 :model="formItem">
          <el-button class="dashboard-btn"
                     v-if="index > 0"
                     type="primary"
                     size="mini"
                     plain
                     @click="del(index)">删除</el-button>
          <el-form-item label="资源设备">
            <YwSelect :SelectData="formItem"
                      :result="deviceResult"
                      @changeSelect="changeSelect({obj:formItem,key:'device'},arguments)">
            </YwSelect>
            <el-button class="ml-5"
                       type="primary"
                       size="mini"
                       @click="choose()">选择</el-button>
          </el-form-item>
          <el-form-item label="监控项">
            <YwSelect :SelectData="formItem"
                      :result="monitorResult"
                      @changeSelect="changeSelect({obj:formItem,key:'monitor'},arguments)">
            </YwSelect>
          </el-form-item>
          <br />
          <el-form-item label="统计方式">
            <YwSelect :SelectData="formItem"
                      :result="statisResult"
                      @changeSelect="changeSelect({obj:formItem,key:'statisWay'},arguments)">
            </YwSelect>
          </el-form-item>
          <el-form-item label="展示名称">
            <el-input v-model="formItem.name"
                      placeholder=""></el-input>
          </el-form-item>
        </el-form>
        <el-button class="mt-10"
                   type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   plain
                   @click="add()">新增监控指标</el-button>
      </div>
    </section>
    <!-- form -->

    <!-- result -->
    <section class="dashboard-section">
      <h1 class="dashboard-title"><i class="dashboard-icon">3</i>配置图表及预览</h1>
      <div class="dashboard-content">
        <el-form class="components-condition yw-form yw-chart-form"
                 :inline="true"
                 :model="formChart">
          <el-form-item label="图表名称">
            <el-input v-model="formChart.chartName"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="时间刻度">
            <el-input-number class="yw-input-number"
                             v-model="formChart.chartTime"
                             controls-position="right"
                             @change="handleNumber"
                             :precision="0"
                             :min="1"
                             :max="1000"></el-input-number>
            <YwSelect :SelectData="formChart"
                      :result="timeCellResult"
                      @changeSelect="changeSelect({obj:formChart,key:'chartTimeCell'},arguments)">
            </YwSelect>
          </el-form-item>
          <section class="btn-wrap">
            <el-button type="primary"
                       size="mini"
                       @click="save()">保存</el-button>
            <el-button size="mini"
                       @click="cancel()">取消</el-button>
            <el-button size="mini"
                       @click="preview()">预览</el-button>
          </section>
        </el-form>
        <div class="chart-wrap">sssssssss</div>
      </div>
    </section>
    <!-- result -->

    <!-- dialog -->
    <DialogSearch v-if="dialogMsg.dialogVisible"
                  :dialogMsg="dialogMsg"
                  @closeDialog="closeDialog"></DialogSearch>
  </div>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'

export default {
  name: '/mirror_alert/alert/dashboard',
  mixins: [QueryObject],
  components: {
    YwSelect: () => import('src/components/common/yw-select.vue'),
    DialogSearch: () => import('../dashboard/dialog-search.vue'),
  },
  data () {
    return {
      // tab
      activeName: 'line',
      tabData: [
        { label: '折线图', name: 'line' },
        { label: '柱状图', name: 'bar' }],

      // 表单数据
      formDatas: [
        {
          device: '',
          monitor: '',
          statisWay: '',
          name: ''
        }
      ],

      //图表数据
      formChart: {
        chartName: '',
        chartTime: 1,
        chartTimeCell: ''
      },

      //查询条件
      queryParams: {

      },
      // 查询结果
      result: [],

      //下拉数据
      deviceResult: [],
      monitorResult: [],
      statisResult: [],
      timeCellResult: [],

      //dialog
      dialogMsg: {
        dialogVisible: false,
        data: {} //数据
      }

    }
  },
  created () {
    // this.query();
    this.selectDevice();
    this.selectMonitor();
    this.selectStatis();
    this.selectTimeCell();
  },
  methods: {
    /**查询
     * activePagination:分页活动下保持先前的查询条件
     */
    query (activePagination = false) {

      this.setParams(activePagination);

      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/device/repair/list?pageNum=${this.queryParams.pageNum}&pageSize=${this.queryParams.pageSize}`,
        data: this.queryParams
      }).then((res) => {
        this.total = res.totalSize;
        this.result = res.data;
        return res
      });

    },

    //删除
    del (index) {
      this.formDatas.splice(index, 1);
    },

    //新增
    add () {
      this.formDatas.push({
        device: '',
        monitor: '',
        statisWay: '',
        name: ''
      });
    },

    //保存
    save () {

    },

    //取消
    cancel () {

    },

    //预览
    preview () {

    },

    //tab切换
    handleTab (tab, event) {
      // tab.name

    },

    //计数器
    handleNumber () {

    },

    //选择
    choose () {
      this.dialogMsg.dialogVisible = true;
      this.dialogMsg.data = ''; //需要携带的参数
    },

    //资源设备
    selectDevice () {
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/produce/list`,
        params: this.queryParams,
      }).then((res) => {
        this.deviceResult = res;
        return res
      });
    },

    //监控项
    selectMonitor () {
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/produce/list`,
        params: this.queryParams,
      }).then((res) => {
        this.monitorResult = res;
        return res
      });
    },

    //统计方式
    selectStatis () {
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/produce/list`,
        params: this.queryParams,
      }).then((res) => {
        this.statisResult = res;
        return res
      });
    },

    //时间单位
    selectTimeCell () {
      // this.rbHttp.sendRequest({
      //   method: 'GET',
      //   url: `/v1/cmdb/device/produce/list`,
      //   params: this.queryParams,
      // }).then((res) => {
      //   this.timeCellResult = res;
      //   return res
      // });
      this.timeCellResult = [{ name: '你好', valuexxx: '1' }, { name: '温恩', valuexxx: '2' }]
    },

    //关闭弹窗
    closeDialog (val) {
      this.dialogMsg.dialogVisible = false;
      if (val === 'update') {
        // this.query();
      }

    }

  }
}
</script>

<style lang="scss" scoped>
.mt-10 {
  margin-top: 10px;
}
.ml-5 {
  margin-left: 5px;
}
.yw-form {
  background: #fff;
  margin-bottom: 10px;
}
/deep/ .yw-chart-form {
  padding-right: 214px;
  .el-form-item {
    .el-form-item__label {
      text-align: left;
      min-width: auto;
    }
  }
}
/deep/ .yw-select-form {
  position: relative;
  border: 1px solid rgba(220, 223, 230, 1);
  border-radius: 8px;
  padding: 10px 0 5px 10px;
  box-shadow: none;
  .dashboard-btn {
    display: none;
    position: absolute;
    bottom: 15px;
    right: 20px;
    background: #999;
    color: #fff;
    border: none;
    font-size: 12px;
    padding: 8px 15px;
  }
  .el-form-item {
    width: 40%;
    .el-form-item__label {
      text-align: left;
      min-width: 60px;
    }
    .el-input {
      width: 178px;
    }
  }

  &:hover {
    background: #f0f8fd;
    .dashboard-btn {
      display: block;
    }
  }
}
.chart-wrap {
  width: 100%;
  min-height: 200px;
  border: 1px solid #eee;
}
</style>
