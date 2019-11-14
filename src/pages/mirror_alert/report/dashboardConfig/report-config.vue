<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form yw-condition-form" label-width="110px">
      <el-form-item label="当前监控大屏：">
        <el-select v-model="curPanelName" placeholder="请选择" @change="panelChange">
          <el-option
            :label="p.panel_name"
            :value="p.panel_name"
            v-for="(p, index) in panelList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary" plain @click="createPanel">创建监控大屏</el-button>
        <el-button type="primary" plain @click="editPanel">修改当前大屏</el-button>
        <el-button type="primary" plain @click="delPanel">删除当前大屏</el-button>
        <el-button type="primary" plain @click="savePanel">保存当前大屏</el-button>
        <el-button type="primary" plain @click="copyPanel">拷贝当前大屏</el-button>
      </section>
    </el-form>
    <el-form class="yw-form clearfix" :inline="true">
      <el-form-item label>
        <el-button
          class="btn-time"
          :class="(timeRange + timeUnit) === '1hour' ? 'active' : 'normal'"
          style="margin: 0px;"
          type="text"
          @click="getDataByTime(1,'hour')"
        >1小时</el-button>
        <el-button
          class="btn-time"
          :class="(timeRange + timeUnit) === '3hour' ? 'active' : 'normal'"
          type="text"
          @click="getDataByTime(3,'hour')"
        >3小时</el-button>
        <el-button
          class="btn-time"
          :class="(timeRange + timeUnit) === '6hour' ? 'active' : 'normal'"
          type="text"
          @click="getDataByTime(6,'hour')"
        >6小时</el-button>
        <el-button
          class="btn-time"
          :class="(timeRange + timeUnit) === '12hour' ? 'active' : 'normal'"
          type="text"
          @click="getDataByTime(12,'hour')"
        >12小时</el-button>
        <el-button
          class="btn-time"
          :class="(timeRange + timeUnit) === '1day' ? 'active' : 'normal'"
          type="text"
          @click="getDataByTime(1,'day')"
        >1天</el-button>
        <el-button
          class="btn-time"
          :class="(timeRange + timeUnit) === '3day' ? 'active' : 'normal'"
          type="text"
          @click="getDataByTime(3,'day')"
        >3天</el-button>
        <el-button
          class="btn-time"
          :class="(timeRange + timeUnit) === '7day' ? 'active' : 'normal'"
          type="text"
          @click="getDataByTime(7,'day')"
        >7天</el-button>
        <el-button
          class="btn-time"
          :class="(timeRange + timeUnit) === '14day' ? 'active' : 'normal'"
          type="text"
          @click="getDataByTime(14,'day')"
        >14天</el-button>
        <label style="margin-left: 15px;">自动刷新：</label>
        <el-switch
          @change="openSynPanel"
          v-model="autoRefresh"
          active-color="#66BAFF"
          inactive-color="#999"
        ></el-switch>
      </el-form-item>
      <el-form-item label></el-form-item>
      <div class="fr">
        <el-button type="primary" size="mini" plain @click="refreshPanel">刷新</el-button>
        <el-button type="primary" size="mini" plain @click="fullScreen">全屏</el-button>
        <el-button type="primary" size="mini" plain @click="addItem">添加监控图</el-button>
      </div>
    </el-form>
    <section class="section-chart">
      <fullscreen
        @change="fullscreenChange"
        :fullscreen.sync="fullscreen"
        style="background: #ffffff;"
      >
        <grid-layout
          :layout="layout"
          :col-num="12"
          :row-height="rowHeight"
          :is-draggable="draggable"
          :is-resizable="resizable"
          :vertical-compact="true"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="item in layout"
            v-bind:class="{'showBorder':(item.i == selectId) ,'showBorderN':(item.i != selectId)}"
            :key="item.i"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :min-w="2"
            :min-h="6"
            :i="item.i"
            @resized="resizedEvent"
            @moved="movedEvent"
          >
            <div
              :id="item.itemId"
              @click="selectItem(item.i)"
              style="width: calc(100% - 20px);overflow:hidden;min-height:178px;height:100%;box-sizing:border-box;padding:5px 0px 5px 5px;float:left"
            ></div>
            <el-dropdown v-show="showDrop" :hide-on-click="false" @command="handleCommand">
              <span class="el-dropdown-link">
                <i
                  class="el-icon-caret-bottom el-icon--right"
                  style="float:left;width:20px;margin:4px 0px 0;cursor:pointer"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ type:'edit', row:item.i }">修改</el-dropdown-item>
                <el-dropdown-item :command="{ type:'del', row:item.i }">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </grid-item>
        </grid-layout>
      </fullscreen>
    </section>

    <!-- 选择监控项 -->
    <el-dialog
      title="选择监控项"
      v-if="addMonitorVisible"
      :visible.sync="addMonitorVisible"
      width="920px"
      :show-close="true"
      :close-on-click-modal="false"
    >
      <section class="yw-dialog-main">
        <el-form class="yw-form" :inline="true" label-width="95px" :model="moniterForm">
          <el-form-item label="设备分类" prop="deviceClass">
            <el-select
              v-model="moniterForm.deviceClass"
              placeholder="选择设备分类"
              :disabled=deviceClassdisabled
              clearable
              class="input-tem-name1"
              style="width: 200px"
              @change="onDeviceClassChange"
            >
              <el-option
                :label="item"
                :value="item"
                v-for="(item, index) in deviceClassList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="yw-form" label="设备类型" prop="deviceType">
            <el-select
             :disabled=deviceTypedisabled
              v-model="moniterForm.deviceType"
              placeholder="选择设备类型"
              clearable
              class="input-tem-name1"
              style="width: 200px"
              @change="onDeviceTypeChange"
            >
              <el-option
                :label="item"
                :value="item"
                v-for="(item, index) in deviceTypeList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="yw-form" label="监控项" prop="moniter">
            <el-cascader
              v-model="moniterForm.moniter"
              :options="moniterList"
              clearable
              placeholder="监控逻辑/监控指标"
              class="input-tem-name1"
              style="width: 200px;line-height: 35px;"
              @change="onMoniterChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </section>
      <div v-if="moniterForm.showIp" class="table-wrap">
        <div class="table-wrap__left">
          <div class="table-wrap__header">
            <div class="search-wrap">
              <span class="search-wrap__title">设备IP：{{ moniterForm.ip }}</span>
              <span class="search-wrap__title">监控指标数：{{ moniterForm.num }}</span>
              <el-input
                v-model.trim="searchText"
                placeholder="请输入监控项名称"
                class="search-wrap__input"
                @keyup.enter.native="search"
              >
                <i slot="prepend" class="el-icon-search" @click="search"></i>
              </el-input>
            </div>
          </div>
          <el-table
            class="table-wrap__table"
            :data="deviceTable"
            highlight-current-row
            height="calc(100vh - 300px)"
            @selection-change="onSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="key" label="监控项key"></el-table-column>
            <el-table-column prop="unit" label="单位">
                <template slot-scope="scope">
                    {{moniterForm.unit}}
                </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="onSizeChange"
            @current-change="onCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            class="table-wrap__pagination"
          ></el-pagination>
        </div>
        <div class="table-wrap__middle">
          <i class="el-icon-arrow-right" @click="moveItem"></i>
        </div>
        <div class="table-wrap__right">
          <div class="table-wrap__header"></div>
          <el-table
            class="table-wrap__table"
            :data="deviceSelection"
            highlight-current-row
            :empty-text="' '"
            height="calc(100vh - 300px)"
          >
            <el-table-column prop="key" label="监控项key"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <i
                  class="el-icon-delete"
                  style="font-size: 16px;color: #46BAFE;"
                  @click="removeDeviceItem(scope.row)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="btn-group">
        <el-button type="primary" @click="dofilterChoose()">确定</el-button>
        <el-button @click="closeMoniter">取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加图表 -->
    <el-dialog
      class="yw-dialog"
      title="添加图表"
      :visible.sync="addVisible"
      width="80%"
      :close-on-click-modal="false"
      :before-close="closeDialogConfig"
    >
      <div>
        <section class="dashboard-section">
          <h1 class="dashboard-title">
            <i class="dashboard-icon">1</i>选择图表类型
          </h1>
          <div class="dashboard-content">
            <el-tabs class="dashboard-tab-wrap" v-model="item.report_type">
              <el-tab-pane
                :label="item.label"
                :name="item.name"
                v-for="(item,index) in tabData"
                :key="index"
              ></el-tab-pane>
            </el-tabs>
          </div>
        </section>

        <section class="dashboard-section">
          <h1 class="dashboard-title">
            <i class="dashboard-icon">2</i>选择监控项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <i class="el-icon-warning"></i> 多项监控，请保持数据单位一致
          </h1>
          <div class="dashboard-content">
            <el-form
              class="yw-form yw-select-form"
              label-width="70px"
              v-for="(m, index) in item.moniterItems"
              :key="index"
              :inline="true"
              :model="m"
            >
              <el-button
                class="dashboard-btn"
                v-if="index > 0"
                type="primary"
                size="mini"
                plain
                @click="delMoniter(index)"
              >删除</el-button>
              <el-form-item
                prop="m.resource_device"
                label="资源设备"
                :rules="{
      required: true, message: '不能为空', trigger: 'blur'
    }"
              >
                <el-tooltip :content="m.resource_device" placement="top">
                  <el-input v-model="m.resource_device" placeholder="请选择" :disabled="true"></el-input>
                </el-tooltip>
                <el-button class="ml-5" type="primary" @click="choose(index)">选择</el-button>
              </el-form-item>
              <el-form-item
                prop="m.moniter_item_name"
                label="监控项"
                :rules="{
      required: true, message: '不能为空', trigger: 'blur'
    }"
              >
                <el-tooltip :content="m.moniter_item_name" placement="top">
                  <el-input v-model="m.moniter_item_name" placeholder="请选择" :disabled="true"></el-input>
                </el-tooltip>
                <el-button type="primary" @click="chooseMoniter(index)">选择</el-button>
                <span v-if="m.moniter_item">&nbsp;&nbsp;&nbsp;&nbsp;单位：{{m.unit}}</span>
              </el-form-item>
              <br />
              <el-form-item
                prop="m.count_type"
                label="统计方式"
                :rules="{
      required: true, message: '不能为空', trigger: 'blur'
    }"
              >
                <el-select v-model="m.count_type" placeholder="请选择">
                  <el-option label="最大" value="max"></el-option>
                  <el-option label="最小" value="min"></el-option>
                  <el-option label="平均" value="avg"></el-option>
                  <el-option label="求和" value="sum"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                prop="m.view_name"
                label="展示名称"
                :rules="{
      required: true, message: '不能为空', trigger: 'blur'
    }"
              >
                <el-input v-model="m.view_name" placeholder></el-input>
              </el-form-item>
            </el-form>
            <div>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                plain
                @click="addMoniter()"
              >新增监控指标</el-button>
            </div>
          </div>
        </section>

        <section class="dashboard-section">
          <h1 class="dashboard-title">
            <i class="dashboard-icon">3</i>配置图表及预览
          </h1>
          <div class="dashboard-content">
            <el-form
              class="components-condition yw-form yw-chart-form is-required"
              label-width="70px"
              :inline="true"
              :model="item"
            >
              <el-form-item
                prop="item.report_name"
                label="图表名称"
                :rules="{
      required: true, message: '不能为空', trigger: 'blur'
    }"
              >
                <el-input v-model="item.report_name" placeholder></el-input>
              </el-form-item>
              <el-form-item
                prop="item.time_value"
                label="时间刻度"
                :rules="{
      required: true, message: '不能为空', trigger: 'blur'
    }"
              >

                                  <el-input-number v-model="item.time_value"  :min="1"></el-input-number>
                <el-select style="width:120px" v-model="item.time_unit" placeholder="请选择">
                  <el-option label="分钟" value="minute"></el-option>
                  <el-option label="小时" value="hour"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="显示单位">
                <el-input v-model="item.report_unit" placeholder></el-input>
              </el-form-item>
              <el-form-item label="换算">
                <el-select style="width:120px" v-model="item.conversion_type" placeholder="请选择" >
                  <el-option label="相乘" value="1"></el-option>
                  <el-option label="相除" value="2"></el-option>
                </el-select>
                  <el-input type="number" v-model="item.conversion_val" style="width:150px;"/>
                  <el-select style="width:120px" v-model="transunit" @change="transunitChange" placeholder="请选择" v-if="unitList.length>0">
                      <el-option :key="index" :label="item.name" :value="item.val" v-for="(item,index) in unitList"></el-option>
                  </el-select>
              </el-form-item>

              <section class="btn-wrap">
                <el-button type="primary" size="mini" @click="saveItem">保存</el-button>
                <el-button size="mini" @click="cancleItem">取消</el-button>
                <el-button size="mini" @click="previewItem">预览</el-button>
              </section>
            </el-form>
            <div>
              <fullscreen
                @change
                class="wrapper"
                fullscreen.sync="false"
                style="background: #ffffff;"
              >
                <grid-layout
                  :layout="itemLayout"
                  :col-num="5"
                  :row-height="rowHeight"
                  :is-draggable="draggable"
                  :is-resizable="resizable"
                  :vertical-compact="true"
                  :use-css-transforms="true"
                >
                  <grid-item
                    v-for="item in itemLayout"
                    class="showBorder"
                    style="box-sizing:border-box;min-height:190px"
                    :key="item.i"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :min-w="2"
                    :min-h="6"
                    :i="item.i"
                    @resized="resizedEventItem"
                    @moved="movedEventItem"
                  >
                    <div
                      :id="item.itemId"
                      style="width: calc(100% - 20px);overflow:hidden;min-height:178px;height:100%;box-sizing:border-box;padding:5px;float:left"
                    ></div>
                  </grid-item>
                </grid-layout>
              </fullscreen>
            </div>
          </div>
        </section>
      </div>
    </el-dialog>
    <el-dialog
      :title="operFlag === 'edit'?'修改大屏':'创建大屏'"
      :visible.sync="addPanelVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <el-row>
        <el-col :span="12">
          <el-input v-model="newPanelName" style="width:300px;" prop="输入新监控大屏名称"></el-input>
        </el-col>
        <el-col :span="12">
          访问分享 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <template v-if="operFlag === 'edit'">
            <el-radio
              v-model="accessType"
              :disabled="(!allFlag? allFlag : (user !== panel.creater))"
              label="1"
            >私人</el-radio>
            <el-radio v-model="accessType" label="2">组内分享</el-radio>
            <el-radio v-model="accessType" label="3">全部分享</el-radio>
          </template>
          <template v-else>
            <el-radio v-model="accessType" label="1">私人</el-radio>
            <el-radio v-model="accessType" label="2">组内分享</el-radio>
            <el-radio v-model="accessType" label="3">全部分享</el-radio>
          </template>
        </el-col>
      </el-row>
      <el-row style="margin-top:10px;">
        <el-col :span="12" :offset="8">
          <el-button v-if="operFlag === 'edit'" class="tem-search" @click="doCreate">保存</el-button>
          <el-button v-else class="tem-search" @click="doCreate">创建</el-button>
          <el-button class="tem-search" @click="cancleCreate">关闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <DialogSearch
      v-if="dialogMsg.dialogVisible"
      :dialogMsg="dialogMsg"
      @closeDialog="closeDialogSearch"
      @setData="setData"
    ></DialogSearch>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import echarts from 'echarts'
import QueryObject from 'src/utils/queryObject.js'
import rbAlertRepPanelServicesFactory from 'src/services/alert/rb-alertRepPanel-services.factory.js'
import {hzUnitTrans,bUnitTrans} from 'src/pages/mirror_alert/alert/config/options.js'
var GridLayout = VueGridLayout.GridLayout
var GridItem = VueGridLayout.GridItem

var configMap = new Map()
export default {
  name: 'MirrorAlertDashboard',
  mixins: [QueryObject],
  components: {
    GridLayout,
    GridItem,
    DialogSearch: () => import('src/pages/mirror_alert/alert/dashboard/dialog-search.vue')
  },
  data() {
    return {
      transunit:'',
      hzUnitTrans:[],
      bUnitTrans:[],
      unitList:[],
      typeList:[],
      deviceClassdisabled: false,
      deviceTypedisabled: false,
      monitorResMap: null,
      allFlag: true,
      user: '',
      submitResult: '',

      moniterForm: {
        ip: '',
        num: 0,
        showIp: false,
        deviceClass: '', // 设备分类
        deviceType: '', // 设备类型
        moniter: [] // 监控项
      },
      deviceClassList: [], // 设备分类列表
      deviceTypeList: [], // 设备类型列表
      moniterList: [], // 监控项列表
      filterMoniterItem: '',
      deviceTable: [], // 设备表格需要展示的数据
      deviceTempTableList: [],
      deviceTableList: [], // 设备表格全部数据
      deviceSelection: [], // 已选择的设备列表
      searchText: '', // 搜索关键字

      tableTemp: [],
      tableDataTemp: [],
      tableData: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [10, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据,
      addMonitorVisible: false,
      operFlag: '',
      accessType: '1',
      changePanelFlag: false,
      creatPanelFlag: false,
      unit: '',
      pollTime: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      moniterItemText: '',
      moniterIndex: '',
      dialogMsg: {
        dialogVisible: false,
        data: {} // 数据
      },
      timeRange: '1',
      timeUnit: 'day',
      // 下拉数据
      deviceResult: [],
      monitorResult: [],
      tabData: [
        { label: '折线图', name: 'line' },
        { label: '柱状图', name: 'bar' }],
      mychartsList: [],
      mychartsItemList: [],
      autoRefresh: false,
      panelList: [],
      curPanelName: '',
      newPanelName: '',
      addPanelVisible: false,
      addVisible: false,
      temp: '',
      typeGroupShow: true,
      typeViewShow: true,
      tableShowMap: [],
      showDrop: true,
      interShow: false,
      titleShow: false,
      calculateType: false,
      duiShow: false,
      groupShow: false,
      formatStyle: '',
      formatUnit: '',
      showOption: true,
      isCollapse: true,
      reportId: '',
      sourceId: '',
      dialogVisible: false,
      layout: [],
      itemLayout: [],
      draggable: true,
      resizable: true,
      rowHeight: 30,
      colNum: 0,
      index: 0,
      id: 1, // 初始化新增id
      form: {

      },
      panel: {},
      item: {
        time_value:5,
        report_type: 'line',
        time_unit: 'minute',
        moniterItems: [],
        conversion_type: '2'
      },
      itemList: [],
      props: {
        value: 'id',
        label: 'sourceName',
        children: 'children'
      },
      value3: '',
      xLineColumn: '',
      aggregationClounm: '',
      intervalUnit: '',
      testLayout: [],
      selectId: 0, // 点击选择的id
      input: '',
      intervalTime: '',
      tmpJson: [],
      reportConfig: {
        id: '',
        name: '',
        parent: '',
        type: '',
        showItem: [],
        reportDetail: []
      },
      reportConfigId: '',
      fullscreen: false,
      reportDetailLst: [],
      isGroup: false,
      isBusyAvg: false,
      reportDelDetail: [],
      reportLoadDetail: [],
      dateSetTmp: [],
      dataSetsDto: {
        dataSets: []
      },
      reportTypeTmp: '',
      xAndRepNameMap: [], // 缓存x轴和报表名称
      exportReportName: '', // 缓存报表名称
      tableXAxisName: '', // 缓存表格的x轴标题
      fromSelFlag: false, // 来源于选择事件标识
      fromSelDataFlag: false, // 来源于选择事件标识
      shadeShow: false,
      subTextFlag: false
    }
  },
  created() {
    // this.query();
    this.selectDevice()
    this.selectMonitor()
  },
  destroyed() {
    if (this.pollTime) {
      clearInterval(this.pollTime)
    }
    this.disposeEcharts()
  },
  mounted(){
    
    this.hzUnitTrans = hzUnitTrans
    this.bUnitTrans = bUnitTrans
    configMap.clear()
    this.initPanel()
  },
  methods: {
    transunitChange(val){
        if(val){
          let v = val.split('_')
          this.item.conversion_type = v[1] + ''
          this.item.conversion_val = v[0]
          let o = this.unitList.find(u=>{
            return u.val === val
          })
          if(o){
            this.item.report_unit = o.name
          }
        }
    },
    rowChoose(val) {
      this.submitResult = val
      this.$refs.singleTable.setCurrentRow(val)
    },
    // 分页改变尺寸
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableTemp()
    },
    // 分页改变当前页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableTemp()
    },
    filterSearch(flag) {
      this.tableData = []
      if (this.moniter && this.filterMoniterItem) {
        let arr = this.item.moniterItems[this.moniterIndex].moniterItemList
        for (let i = 0; i < arr.length; i++) {
          let d = arr[i]
          if (d.name === this.moniter) {
            let dArr = d.moniterItem
            dArr.forEach(val => {
              if (val.key.indexOf(this.filterMoniterItem) !== -1) {
                this.tableData.push(val)
              }
            })
            break
          }
        }
      } else if (this.moniter) {
        let arr = this.item.moniterItems[this.moniterIndex].moniterItemList
        for (let i = 0; i < arr.length; i++) {
          let d = arr[i]
          if (d.name === this.moniter) {
            this.tableData = this.tableData.concat(d.moniterItem)
            break
          }
        }
      } else if (this.filterMoniterItem) {
        this.tableDataTemp.forEach(val => {
          if (val.key.indexOf(this.filterMoniterItem) !== -1) {
            this.tableData.push(val)
          }
        })
      } else {
        this.tableData = this.tableData.concat(this.tableDataTemp)
      }
      this.total = this.tableData.length
      this.getTableTemp()
    },
    getTableTemp() {
      let start = this.pageSize * (this.currentPage - 1)
      let end = start + this.pageSize
      end = end > this.total ? this.total : end
      this.tableTemp = this.tableData.slice(start, end)
    },
    closeDialogConfig() {
      this.$confirm('是否保存当前配置数据', '保存', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveItem()
      }).catch(() => {
        this.cancleItem()
      })
    },
    selectItem(item) {
      // 设置是来源于选择框的操作
      this.selectId = item
    },
    selectFocus(val) {
      this.moniterIndex = val
    },
    filterTree(val) {
      // let refFlag = 'treeFlag' + this.moniterIndex
      this.$refs[this.moniterIndex][0].filter(val)
    },
    fullScreen() {
      this.fullscreen = true
      this.showDrop = false
    },
    disposePanelEchart() {
      var mychartsList = configMap.values()
      for (var i = 0; i < configMap.size; i++) {
        var vTmp = mychartsList.next().value
        vTmp.dispose()
      }
    },
    disposeEcharts() {
      this.mychartsItemList.forEach(function(element) {
        element.dispose()
      })
    },
    openSynPanel() {
      if (this.autoRefresh) {
        this.synPanel()
      } else {
        this.releaseInterval()
      }
    },
    releaseInterval() {
      if (this.pollTime) {
        clearInterval(this.pollTime)
      }
    },
    synPanel() {
      this.releaseInterval()
      this.pollTime = setInterval(() => {
        this.$nextTick(() => {
          this.disposeEcharts()
          this.itemList.forEach(item => {
            let itemid = item.item_id.substring(4, item.item_id.length)
            this.id = itemid
            this.loadReport(item, item.item_id, false)
          })
        })
      }, 300000)
    },
    handleIdcNodeClick(val, m) {
      if (!val.leaf) {
        return
      }
      this.item.moniterItems[this.moniterIndex].moniter_item = val.label
      this.item.moniterItems[this.moniterIndex].unit = val.units
      this.item.moniterItems[this.moniterIndex].mointer_index = val.valueType
      this.$forceUpdate()
      // this.moniterItemText = data.label
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 设置资源设备
    setData(val) {
      if (!val.result) {
        this.$message.warning('请选择数据！')
        return
      }
      let obj = {}
      if (val.mulFlag) {
        if (val.result.length === 0) {
          this.$message.warning('请选择数据！')
          return
        }
        let ipList = ''
        let ipObjs = []
        val.result.forEach(function(e) {
          let ob = {
            idcType: e.idcType,
            deviceClass: e.deviceClass,
            deviceType: e.deviceType,
            ip: e.ip
          }
          ipObjs.push(ob)
          if (ipList.length === 0) {
            ipList = e.ip
          } else {
            ipList += ',' + e.ip
          }
        })
        this.item.moniterItems[this.moniterIndex].resource_device_ipStr = JSON.stringify(ipObjs)
        this.item.moniterItems[this.moniterIndex].resource_device = ipList
        obj.ip = ipList.split(',')
      } else {
        if(val.type  === 5){
          this.typeList = val.typeList
        }
        this.item.moniterItems[this.moniterIndex].resource_device = val.result.value
        obj.rs = val.result.value
      }
      obj.reType = val.type
      this.item.moniterItems[this.moniterIndex].resource_type = val.type
      this.closeDialogSearch()
      this.clearMonitor()
      // this.setMoniter(obj, this.moniterIndex)
      //this.getTreeData(obj, this.item.moniterItems[this.moniterIndex])
    },
    clearMonitor(){
      let monitor = this.item.moniterItems[this.moniterIndex]
      monitor.device_class = ''
      monitor.device_type = ''
      monitor.subclass = ''
      monitor.moniter_item_name = ''
      monitor.sub_moniter_items = ''
      monitor.moniter_item = ''
    },
    /* setMoniter (obj, index) {
      this.item.moniterItems[index].moniterItemList = []
      rbAlertRepPanelServicesFactory.getMonitorItem(obj).then((res) => {
        let rs = res.result
        let idcItem = {
          label: '基础监控',
          children: [],
          leaf: false
        }
        this.item.moniterItems[index].moniterItemList.push(idcItem)
          rs.forEach(item => {
            let obj = {}
            obj.label = item.name
            obj.children = []
            obj.leaf = false
            item.moniterItem.forEach(m => {
              let obj1 = {}
              obj1.label = m
              obj1.leaf = true
              obj.children.push(obj1)
            })
            this.item.moniterItems[index].moniterItemList[0].children.push(obj)
          })
      })
    }, */
    // 分页改变尺寸
    onSizeChange(val) {
      this.pageSize = val
      this.getDeviceTable()
    },
    // 分页改变当前页
    onCurrentChange(val) {
      this.currentPage = val
      this.getDeviceTable()
    },
    getDeviceTable() {
      this.total = this.deviceTempTableList.length
      let start = this.pageSize * (this.currentPage - 1)
      let end = start + this.pageSize
      end = end > this.total ? this.total : end
      this.deviceTable = this.deviceTempTableList.slice(start, end)
    },
    // 搜索关键字
    search() {
      this.currentPage = 1
      const reg = new RegExp(this.searchText)
      this.deviceTempTableList = this.deviceTableList.filter(val => reg.test(val.key))
      this.getDeviceTable()
    },
    setTable(){
        //if(this.moniterForm.showIp) {
          this.deviceTable = []
          this.deviceSelection = []
          this.deviceTempTableList = []
          this.deviceTableList = []
        //}
    },
    // 设备分类改变时，加载设备类型
    async onDeviceClassChange(value) {
      this.deviceTypeList = []
      this.moniterForm.deviceType = ''
      this.moniterList = []
      this.moniterForm.moniter = []
      this.setTable();
      if (!value) return

      let params = {
        method: 'GET',
        url: '/v1/alerts/monitor/getDeviceType',
        params: { deviceClass: value }
      }
      let res = await this.rbHttp.sendRequest(params)
      this.moniterForm.deviceType = ''
      this.deviceTypeList = res
    },
    // 设备类型改变时，加载监控项
    async onDeviceTypeChange(value) {
      this.moniterForm.moniter = []
      this.moniterList = []
      this.setTable();
      if (!value) return false

      let params = {
        method: 'GET',
        url: '/v1/alerts/monitor/getSubMonitorList',
        params: {
          deviceClass: this.moniterForm.deviceClass,
          deviceType: value
        }
      }
      let res = await this.rbHttp.sendRequest(params)
      if (!Object.keys(res).length) return false
      this.monitorResMap = JSON.parse(JSON.stringify(res))
      this.moniterList = Object.keys(res)
        .map(val => {
          const items = res[val]
            .map(item => ({ value: item.moniter_item_key, label: item.moniter_item_name }))
            .filter(item => item.value)
          return { value: val, label: val, children: items }
        })
        .filter(val => val.children.length)
      //const moniterItem = this.item.moniterItems[this.moniterIndex]
    },
    getMonitorItemName(monitor){
      let val = ''
      let key = Object.keys(this.monitorResMap).find(m =>{
        return m === monitor[0]
      })
      if(key){
        let list = this.monitorResMap[key]
        let o = list.find(l =>{
          return l.moniter_item_key === monitor[1]
        })
        if(o){
          val = o.moniter_item_name
        }
      }
        return val
    },
    // 监控项改变时，加载监控表格数据
    async onMoniterChange(value,flag = false) {
      /*if(!flag){
        this.setTable();
      }*/
      const moniterItem = this.item.moniterItems[this.moniterIndex]
      const type = moniterItem.resource_type
      if (!value || value.length === 0) return
      let data = {
        rs: moniterItem.resource_device,
        reType: type,
        item: value[1],
        multiQuery: false
      }
     //data.item = 'vfs.fs.size'//TODO
      if (type === 6) {
        data.ip = moniterItem.resource_device.split(",")
        if(data.ip.length === 1){
          data.multiQuery = true
        }
      }
      rbAlertRepPanelServicesFactory.getMonitorItemList(data).then((res) => {
        console.log(res)
        this.deviceTableList = []
        this.deviceTempTableList = []
        if(res && res.keys){
          res.keys.forEach(item =>{
            let obj = {}
            obj.key = item
            this.deviceTableList.push(obj)
          })
        }
        let monitorItemName = this.getMonitorItemName(value)
        // this.deviceTableList = res.keys
        this.deviceTempTableList = this.deviceTempTableList.concat(this.deviceTableList)
        this.moniterForm.unit = res.units
        this.moniterForm.num = this.deviceTableList.length
        this.moniterForm.mointer_index = res.valueType
        this.moniterForm.monitorItemName = monitorItemName
        this.getDeviceTable()
      })

    },
    // 勾选表格数据时
    onSelectionChange(selection) {
      this.selection = selection
    },
    // 移动已勾选的表格数据
    moveItem() {
      if((this.deviceSelection.length + this.selection.length)>50){
        this.$message.warning('所选数据不能超过50条！')
        return
      }
      this.deviceSelection = this.deviceSelection.concat(this.selection)
    },
    // 删除已选择的表格数据
    removeDeviceItem(row) {
      this.deviceSelection = this.deviceSelection.filter(val => val.key !== row.key)
    },
    setUnitList(unit){
      if(unit){
        this.transunit = ''
        unit = unit.toUpperCase()
        this.unitList = []
        this.item.conversion_val = null
        if(this.hzUnitTrans[unit]){
          this.unitList = this.hzUnitTrans[unit]
        }else if(this.bUnitTrans[unit]){
          this.unitList = this.bUnitTrans[unit]
        }
        this.$forceUpdate()
      }
    },
    // 确认监控项时
    dofilterChoose() {
        if (!this.moniterForm.moniter || !this.moniterForm.moniter.length || this.moniterForm.moniter.length <2) {
          this.$message.warning('请选择监控项!')
          return
        }
        const moniterItem = this.item.moniterItems[this.moniterIndex]
        moniterItem.moniter_item_name = this.moniterForm.monitorItemName
        moniterItem.view_name = this.moniterForm.monitorItemName
        moniterItem.moniter_item = this.moniterForm.moniter[1]
        moniterItem.subclass = this.moniterForm.moniter[0]
         moniterItem.unit = this.moniterForm.unit
        moniterItem.mointer_index = this.moniterForm.mointer_index
        moniterItem.device_class = this.moniterForm.deviceClass // 保存已选择的设备分类
        moniterItem.device_type = this.moniterForm.deviceType // 保存已选择的设备类型
        moniterItem.moniter = this.moniterForm.moniter // 保存已选择的监控项
        moniterItem.deviceSelection = this.deviceSelection // 保存已选择的表格数据

        if(this.moniterIndex === 0){
          this.item.report_name = moniterItem.device_class + moniterItem.device_type + moniterItem.view_name
          this.item.report_unit = moniterItem.unit
          //设置转化单位
          this.setUnitList(moniterItem.unit)
        }
        if(this.deviceSelection && this.deviceSelection.length>0){
          let val = ''
          this.deviceSelection.forEach(item => {
            if(val){
              val += '///,' + item.key
            }else{
              val = item.key
            }
            moniterItem.sub_moniter_items = val
          })
        }else{
          moniterItem.sub_moniter_items = ''
        }
        this.closeMoniter()
    },
    // 关闭监控项弹窗时
    closeMoniter() {
      this.moniterForm.ip = ''
      this.moniterForm.num = ''
      this.moniterForm.deviceClass = ''
      this.moniterForm.deviceClassList = []
      this.moniterForm.deviceType = ''
      this.moniterForm.deviceTypeList = []
      this.moniterForm.moniterList = []
      this.moniterForm.moniter = []
      this.deviceSelection = []
      this.addMonitorVisible = false
    },
    // 选择监控项时
    async chooseMoniter(index) {
      this.setTable();
      this.filterMoniterItem = ''
      this.moniterIndex = index
      // 不知道有没有用，先用 list 缓存
      const list = this.item.moniterItems[this.moniterIndex].moniterItemList

      // this.tableTemp = this.tableDataTemp
      // this.tableData = this.tableDataTemp
      const moniterItem = this.item.moniterItems[this.moniterIndex]
      let submonitors = moniterItem.sub_moniter_items
      if(submonitors){
        let subList = submonitors.split('///,')
        subList.forEach(s =>{
          let temp = {}
          temp.key = s
          this.deviceSelection.push(temp)
        })
      }else{
        this.deviceSelection = []
      }
      //this.deviceSelection = moniterItem.deviceSelection || [] // 回显已选择的表格数据
      this.deviceTable = this.deviceTableList
      this.total = this.deviceTableList.length
      this.currentPage = 1 // 当前页
      this.pageSize = 50

      this.addMonitorVisible = true

      const ips = moniterItem.resource_device.split(',')
      this.moniterForm.showIp = moniterItem.resource_type === 6 && ips.length === 1
      this.moniterForm.ip = moniterItem.resource_type === 6 ? moniterItem.resource_device : ''
      // 加载设备分类
      let parmas = { method: 'GET', url: '/v1/alerts/monitor/getDeviceClass' }
      let classRes = await this.rbHttp.sendRequest(parmas)
      this.deviceClassList = classRes
      this.moniterForm.deviceClass = moniterItem.device_class || '' // 回显已选择的设备分类

      this.setClassDisabled(moniterItem)//设置选的资源设备的设备分类和设备类型

      // 加载设备类型
      parmas = {
        method: 'GET',
        url: '/v1/alerts/monitor/getDeviceType',
        params: { deviceClass: this.moniterForm.deviceClass }
      }
      let typeRes = await this.rbHttp.sendRequest(parmas)
      this.deviceTypeList = typeRes
      this.moniterForm.deviceType = moniterItem.device_type || '' // 回显已选择的设备类型
      this.setTypeDisabled(moniterItem)
      // 加载监控项
      parmas = {
        method: 'GET',
        url: '/v1/alerts/monitor/getSubMonitorList',
        params: {
          deviceClass: this.moniterForm.deviceClass,
          deviceType: this.moniterForm.deviceType
        }
      }
      let monitorRes = await this.rbHttp.sendRequest(parmas)
      if (!Object.keys(monitorRes).length) return
      this.monitorResMap = JSON.parse(JSON.stringify(monitorRes))
      this.moniterList = Object.keys(monitorRes)
        .map(val => {
          const items = monitorRes[val]
            .map(item => ({ value: item.moniter_item_key, label: item.moniter_item_name }))
            .filter(item => item.value)
          return { value: val, label: val, children: items }
        })
        .filter(val => val.children.length)
      moniterItem.moniter = []
      if(moniterItem.subclass && moniterItem.moniter_item){
        moniterItem.moniter[0] = moniterItem.subclass
        moniterItem.moniter[1] = moniterItem.moniter_item
        this.moniterForm.moniter = moniterItem.moniter || [] // 回显已选择的监控项
        this.onMoniterChange(this.moniterForm.moniter,true)
      }

    },
    setClassDisabled(moniterItem){
      let tempClass = ''
      this.deviceClassdisabled = false
        if(moniterItem.resource_type === 4){
          tempClass = moniterItem.resource_device
        }
      if(moniterItem.resource_type === 5){
        let o= this.typeList.find(t =>{
          return t.value === moniterItem.resource_device
        })
        if(o){
          tempClass = o.device_class
        }
      }
          if(moniterItem.resource_type === 6){
             let obj = JSON.parse(moniterItem.resource_device_ipStr)[0]
              tempClass = obj.deviceClass
          }
      if(tempClass){
        let o = this.deviceClassList.find(d=>{
          return d === tempClass
        })
        if(o){
          this.moniterForm.deviceClass = tempClass
          this.deviceClassdisabled = true
        }
      }
    },
    setTypeDisabled(moniterItem){
      let tempType = ''
      this.deviceTypedisabled = false
      if(moniterItem.resource_type === 5){
        tempType = moniterItem.resource_device
      }
      if(moniterItem.resource_type === 6){
        let obj = JSON.parse(moniterItem.resource_device_ipStr)[0]
        tempType = obj.deviceType
      }
      if(tempType){
        let o = this.deviceTypeList.find(d=>{
          return d === tempType
        })
        if(o){
          this.moniterForm.deviceType = tempType
          this.deviceTypedisabled = true
        }
      }
    },
    // 选择
    choose(index) {
      //      this.addVisible = false;
      this.moniterIndex = index
      this.dialogMsg.dialogVisible = true
      this.dialogMsg.data = {}
      let rs = this.item.moniterItems[index].resource_device
      if (rs) {
        let obj = {}
        obj.type = this.item.moniterItems[index].resource_type
        obj.rs = rs
        if (obj.type === 6) {
          obj.ipStr = this.item.moniterItems[index].resource_device_ipStr
        }
        this.dialogMsg.data = obj // 需要携带的参数
      }
    },
    // 关闭弹窗
    closeDialogSearch(val) {
      this.dialogMsg.dialogVisible = false
      this.dialogMsg.data = {}
      //      this.addVisible = true;
      if (val === 'update') {
        // this.query();
      }
    },
    refreshPanel() {
      this.disposePanelEchart()
      this.itemList.forEach(item => {
        let itemid = item.item_id.substring(4, item.item_id.length)
        this.loadReport(item, item.item_id, false)
      })
    },
    getDataByTime(time, unit) {
      this.timeRange = time
      this.timeUnit = unit
      this.refreshPanel()
    },
    panelChange(val) {
      this.$confirm('是否保存当前大屏', '保存', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changePanelFlag = true
        this.savePanel(val)
      }).catch(() => {
        this.disposePanelEchart()
        let panelTemp = this.panelList.find(function(r) {
          return r.panel_name === val
        })
        this.panel = JSON.parse(JSON.stringify(panelTemp))
        this.curPanelName = this.panel.panel_name
        this.initPanelInfo()
      })
    },
    initPanel() {
      rbAlertRepPanelServicesFactory.getAll().then((res) => {
        this.panelList = []
        let userName = sessionStorage.getItem('username')
        this.user = userName
        let isAdmin = sessionStorage.getItem('isAdmin')
        if (isAdmin === 'true') {
          this.panelList = res
          this.allFlag = false
          this.setInitPanel()
        } else {
          this.rbHttp.sendRequest({
            method: 'GET',
            url: `/v1/user/findByLdapId/{ldap_id}`,
            params: {
              ldapId: userName
            }
          }).then((userInfo) => {
            let dept = userInfo['dept_list']
            if (dept && dept.length > 0) {
              let ids = ''
              dept.forEach(d => {
                if (ids) {
                  ids += ',' + d.uuid
                } else {
                  ids = d.uuid
                }
              })
              this.rbHttp.sendRequest({
                method: 'POST',
                url: `/v1/user/queryList`,
                params: {
                  deptIds: ids
                }
              }).then((userRes) => {
                let usersList = []
                if (userRes) {
                  usersList = userRes
                }
                res.forEach(item => {
                  let t = item.access_type
                  if (t === '2') {
                    let v = usersList.find(function(r) {
                      return r.code === item.creater
                    })
                    if (v) {
                      this.panelList.push(item)
                    }
                  } else if (t === '1') {
                    let userName = sessionStorage.getItem('username')
                    if (userName === item.creater) {
                      this.panelList.push(item)
                    }
                  } else {
                    this.panelList.push(item)
                  }
                })
                this.setInitPanel()
              })
            }
          })
        }
      })
    },
    setInitPanel() {
      if (this.panelList.length > 0) {
        this.panel = JSON.parse(JSON.stringify(this.panelList[0]))
        this.curPanelName = this.panel.panel_name
        this.initPanelInfo()
      } else {
        this.curPanelName = ''
        this.cleanPanel()
      }
    },
    fullscreenItemChange(fullscreen) {
      this.showDrop = false
      this.$nextTick(() => {
        if (fullscreen !== true) {
          this.showDrop = true
        }
        /* this.itemLayout.forEach(function (element) {
          let myChart = echarts.init(document.getElementById('curItem'), 'macarons')
          myChart.resize()
        }) */
      })
    },
    cancleCreate() {
      this.addPanelVisible = false
      this.newPanelName = ''
    },
    doCreate() {
      if (!this.newPanelName) {
        this.$message.warning('请输入大屏名称')
        return
      }
      if (this.operFlag === 'add' || this.operFlag === 'copy') {
        let panelObj = {}
        if (this.operFlag === 'copy') {
          panelObj = JSON.parse(JSON.stringify(this.panel))
          panelObj.operateFlag = 'copy'
          panelObj.panel_name = this.newPanelName
          panelObj.access_type = this.accessType
          panelObj.update_time = null
          panelObj.editer = null
        } else {
          panelObj.panel_name = this.newPanelName
          panelObj.access_type = this.accessType
        }
        rbAlertRepPanelServicesFactory.getByName(panelObj.panel_name).then((res) => {
          if (res !== null && res !== '') {
            this.$message.warning('大屏名称已经存在！')
          } else {
            rbAlertRepPanelServicesFactory.create(panelObj).then((res) => {
              this.$message.success('创建成功')
              this.panel = panelObj
              this.newPanelName = ''
              this.addPanelVisible = false
              this.panel.id = res.id
              this.panel.creater = res.creater
              this.panelList.push(JSON.parse(JSON.stringify(this.panel)))
              this.curPanelName = this.panel.panel_name
              if (this.operFlag === 'copy') {
                this.initPanelInfo()
              } else {
                this.cleanPanel()
              }
              this.$forceUpdate()
            }).catch(() => {
              this.$message.error('创建失败')
            })
          }
        }).catch(() => {
          this.$message.error('创建失败')
        })
      } else {
        this.panel.operateFlag = 'edit'
        this.panel.access_type = this.accessType
        if (this.panel.panel_name === this.newPanelName) {
          rbAlertRepPanelServicesFactory.update(this.panel).then((res) => {
            this.$message.success('修改成功')
            this.updatePanelList(this.panel)
            this.curPanelName = this.panel.panel_name
            if (this.creatPanelFlag) {
              this.addPanelVisible = true
              this.creatPanelFlag = false
            }
            this.addPanelVisible = false
            if (this.changePanelFlag) {
              let panelTemp = this.panelList.find(function(r) {
                return r.panel_name === flag
              })
              this.panel = JSON.parse(JSON.stringify(panelTemp))
              this.curPanelName = this.panel.panel_name
              this.initPanelInfo()
              this.changePanelFlag = false
            }
          }).catch(() => {
            this.$message.error('修改失败')
          })
        } else {
          this.panel.panel_name = this.newPanelName
          rbAlertRepPanelServicesFactory.getByName(this.panel.panel_name).then((res) => {
            if (res !== null && res !== '') {
              this.$message.warning('大屏名称已经存在！')
            } else {
              rbAlertRepPanelServicesFactory.update(this.panel).then((res) => {
                this.$message.success('修改成功')
                this.updatePanelList(this.panel)
                this.curPanelName = this.panel.panel_name
                if (this.creatPanelFlag) {
                  this.addPanelVisible = true
                  this.creatPanelFlag = false
                }
                this.addPanelVisible = false
                if (this.changePanelFlag) {
                  this.disposePanelEchart()
                  let panelTemp = this.panelList.find(function(r) {
                    return r.panel_name === flag
                  })
                  this.panel = JSON.parse(JSON.stringify(panelTemp))
                  this.curPanelName = this.panel.panel_name
                  this.initPanelInfo()
                  this.changePanelFlag = false
                }
              }).catch(() => {
                this.$message.error('修改失败')
              })
            }
          }).catch(() => {
            this.$message.error('创建失败')
          })
        }
      }
    },
    cleanPanel() {
      this.layout = []
      this.testLayout = []
      this.itemList = []
      this.closeDialog()
    },
    copyPanel() {
      this.operFlag = 'copy'
      this.addPanelVisible = true
      this.newPanelName = this.panel.panel_name + '备份'
    },
    editPanel() {
      this.operFlag = 'edit'
      this.addPanelVisible = true
      this.newPanelName = this.panel.panel_name
      this.accessType = this.panel.access_type
    },
    createPanel: function() {
      this.operFlag = 'add'
      this.accessType = '1'
      if (this.panelList.length !== 0) {
        this.$confirm('是否保存当前大屏', '保存', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.creatPanelFlag = true
          this.savePanel()
        }).catch(() => {
          this.addPanelVisible = true
        })
      } else {
        this.addPanelVisible = true
      }
      /* if (this.panel.id === undefined || this.panel.id === null) {
        this.$message.warning('！')请先保存当前大屏
        return
      } */
    },
    // 当前大屏保存之后更新到大屏列表
    updatePanelList(panel) {
      for (let i = 0; i < this.panelList.length; i++) {
        if (this.panelList[i].id === panel.id) {
          this.panelList[i] = JSON.parse(JSON.stringify(panel))
          break
        }
      }
      this.$forceUpdate()
    },
    // 初始化当前大盘配置
    initPanelInfo() {
      this.disposePanelEchart()
      let showItems = []
      this.layout = []
      // this.id = 1
      if (this.panel.show_item) {
        showItems = JSON.parse(this.panel.show_item)
      }
      this.layout = showItems
      if (this.panel.items !== undefined && this.panel.items !== null) {
        this.itemList = JSON.parse(JSON.stringify(this.panel.items))
      } else {
        this.itemList = []
      }
      this.$forceUpdate()
      this.$nextTick(() => {
        this.itemList.forEach(item => {
          let itemid = item.item_id.substring(4, item.item_id.length)
          this.id = itemid
          // this.loadIndex(item.i, item.reportType) // todo
          this.loadReport(item, item.item_id, false)
        })
      })
    },
    // 初始化加载报表
    loadReport(item, id, flag) {
      let unitTime = this.timeUnit
      let rangetime = this.timeRange
      let unit = item.report_unit
      let unitStr = item.report_unit ? item.report_unit : item.moniterItems[0].unit
      if (flag) {
        unitTime = 'day'
        rangetime = 7
      }
      let dataSetList = []
      item.moniterItems.forEach(function(e) {
        let dataSet = {
          // conditionField: 'item',
          // countField: 'value',
          mointerIndex: e.mointer_index,
          countType: e.count_type,
          intervalTime: item.time_value,
          intervalUnit: item.time_unit,
          itemId: e.moniter_item,
          subItemIds: e.sub_moniter_items,
          itemViewName: e.view_name,
          reportTpye: item.report_type,
          // xlineColumn: 'clock',
          minTimeUnit: unitTime,
          minTimeValue: rangetime,
          resourceType: e.resource_type,
          resourceValue: e.resource_device
        }
        dataSetList.push(dataSet)
      })
      if (dataSetList.length === 0) {
        return
      }
      let req = {
        dataSets: dataSetList
      }
      let titleText = item.report_name
      let conversion_val = ''
      let conversion_type = item.conversion_type
      if (unitStr) {
        titleText = item.report_name + '(单位:' + unitStr + ')'
      }
      if (unit) {
        if (item.conversion_val !== 0) {
          conversion_val = item.conversion_val
        }
      }
      rbAlertRepPanelServicesFactory.getEsData(req).then((res) => {
//         this.$nextTick(() => {
          
//         var myChart = echarts.init(document.getElementById(id), 'macarons');
//           let option2 = {
//     xAxis: {
//         type: 'category',
//         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     },
//     yAxis: {
//         type: 'value'
//     },
//     series: [{
//         data: [820, 932, 901, 934, 1290, 1330, 1320],
//         type: 'line'
//     }]
// };
// myChart.setOption(option2)
//         });

        var myChart = echarts.init(document.getElementById(id), 'macarons')
        if (item.report_type === 'line') {
          
          let lineSeries = []
          res.series.forEach(function(s) {
            let ss = {}
            ss.type = 'line'
            ss.name = s.name
            ss.data = s.data
            lineSeries.push(ss)
          })
          var lineOption = {
            // title: {
            //   text: '折线图堆叠'
            // },
            title: {
              text: titleText,
              // x: 'center',
              // y: 'top',
              textStyle: {// 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                fontSize: 14,
                fontStyle: 'normal',
                fontWeight: 'bold',
                color: '#000000'
              }
            },
            tooltip: {
              trigger: 'axis',
              formatter: function(params) {
                let val = params[0].name
                for (let i = 0; i < params.length; i++) {
                  let value = params[i].value
                  let result = parseFloat(value)
                  if (isNaN(result)) {
                    val += '<br/>' + params[i].seriesName + ' : ' + value
                  } else {
                    if (conversion_val) {
                      if (conversion_type === '1') {
                        result = result * conversion_val
                      } else {
                        result = result / conversion_val
                      }
                    }
                    let ss = result +''
                    if(ss.indexOf('.')>0){
                      result = result.toFixed(2)
                    }
                    val += '<br/>' + params[i].seriesName + ' : ' + result
                  }
                }
                return val
              }
            },
            legend: {
              top: '2%',
              show: true,
              icon: 'rect',
              type: 'scroll',
              bottom: 10,
              pageIconColor: '#98B7DA',
              pageIconInactiveColor: '#eee',
              textStyle: {
                color: '#000'
              },
              data: res.legend,
              pageTextStyle: {
                color: '#fff',
                lineHeight: 120
              },
              padding: [22, 20, 0, 20],
              itemWidth: 8,
              itemHeight: 8
            },
            toolbox: {
              padding: [0, 20, 0, 20],
              show: true,
              feature: {
                dataView: { show: true, readOnly: true, lang: ['', '关闭'] },
                saveAsImage: { show: true }
              }
            },
            grid: {
              left: '3%',
              right: '3%',
              bottom: '6%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: res.xaxis
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: function(v) {
                  if (conversion_val) {
                    if (conversion_type === '1') {
                      v = v * conversion_val
                    } else {
                      v = v / conversion_val
                    }
                    let ss = v +''
                    if(ss.indexOf('.')>0){
                      return v.toFixed(2)
                    }

                  }
                  return v
                }
              }
            },
            series: lineSeries,
            optionToContent: function(opt) {
              var axisData = opt.xAxis[0].data
              var series = opt.series
              var table = '<table style="width:100%;text-align:center" cellspacing="0" cellpadding="0" class="table_Qushi"><tbody><tr>' +
                '<td>时间</td>'
              for (var i = 0, l = series.length; i < l; i++) {
                table += '<td>' + series[i].name + '</td>'
              }
              table += '</tr>'
              for (var i = 0, l = axisData.length; i < l; i++) {
                table += '<tr>'
                table += '<td>' + axisData[i] + '</td>'
                for (var j = 0, n = series.length; j < n; j++) {
                  let result = series[j].data[i]
                  let v = parseFloat(result)
                  if (isNaN(v)) {
                    v = result
                  } else {
                    if (conversion_val) {
                      if (conversion_type === '1') {
                        v = v * conversion_val
                      } else {
                        v = v / conversion_val
                      }
                    }
                    let ss = v +''
                    if(ss.indexOf('.')>0){
                      v = v.toFixed(2)
                    }
                  }
                  table += '<td>' + v + '</td>'
                }
                table += '</tr>'
              }
              table += '</tbody></table>'
              return table
            }
          }
          myChart.setOption(lineOption)
          if (flag) {
            this.mychartsItemList.push(myChart)
          } else {
            // this.mychartsList.push(myChart)
            configMap.set(id, myChart)
          }
        } else {
          let barSeries = []
          res.series.forEach(function(s) {
            let ss = {}
            ss.type = 'bar'
            ss.name = s.name
            ss.data = s.data
            barSeries.push(ss)
          })
          var barOption = {
            title: {
              text: titleText,
              textStyle: {// 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                fontSize: 14,
                fontStyle: 'normal',
                fontWeight: 'bold',
                color: '#000000'
              }
            },
            tooltip: {
              trigger: 'axis',
              formatter: function(params) {
                let val = params[0].name
                for (let i = 0; i < params.length; i++) {
                  let value = params[i].value
                  let result = parseFloat(value)
                  if (isNaN(result)) {
                    val += '<br/>' + params[i].seriesName + ' : ' + value
                  } else {
                    if (conversion_val) {
                      if (conversion_type === '1') {
                        result = result * conversion_val
                      } else {
                        result = result / conversion_val
                      }
                    }
                    let ss = result +''
                    if(ss.indexOf('.')>0){
                      result = result.toFixed(2)
                    }
                    val += '<br/>' + params[i].seriesName + ' : ' + result
                  }
                }
                return val
              }
            },
            legend: {
              top: '2%',
              show: true,
              icon: 'rect',
              type: 'scroll',
              bottom: 10,
              pageIconColor: '#98B7DA',
              pageIconInactiveColor: '#eee',
              textStyle: {
                color: '#000'
              },
              data: res.legend,
              pageTextStyle: {
                color: '#fff',
                lineHeight: 160
              },
              padding: [22, 20, 0, 20],
              itemWidth: 8,
              itemHeight: 8
            },
            toolbox: {
              padding: [0, 20, 0, 20],
              show: true,
              feature: {
                dataView: { show: true, readOnly: true, lang: ['', '关闭'] },
                saveAsImage: { show: true }
              }
            },
            grid: {
              left: '3%',
              right: '3%',
              bottom: '6%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              data: res.xaxis
            }],
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: function(v) {
                  if (conversion_val) {
                    if (conversion_type === '1') {
                      v = v * conversion_val
                    } else {
                      v = v / conversion_val
                    }
                    let ss = v +''
                    if(ss.indexOf('.')>0){
                      return v.toFixed(2)
                    }
                  }
                  return v
                }
              }
            },
            series: barSeries,
            optionToContent: function(opt) {
              var axisData = opt.xAxis[0].data
              var series = opt.series
              var table = '<table style="width:100%;text-align:center" cellspacing="0" cellpadding="0" class="table_Qushi"><tbody><tr>' +
                '<td>时间</td>'
              for (var i = 0, l = series.length; i < l; i++) {
                table += '<td>' + series[i].name + '</td>'
              }
              table += '</tr>'
              for (var i = 0, l = axisData.length; i < l; i++) {
                table += '<tr>'
                table += '<td>' + axisData[i] + '</td>'
                for (var j = 0, n = series.length; j < n; j++) {
                  let result = series[j].data[i]
                  let v = parseFloat(result)
                  if (isNaN(v)) {
                    v = result
                  } else {
                    if (conversion_val) {
                      if (conversion_type === '1') {
                        v = v * conversion_val
                      } else {
                        v = v / conversion_val
                      }
                    }
                    let ss = v +''
                    if(ss.indexOf('.')>0){
                      v = v.toFixed(2)
                    }
                  }
                  table += '<td>' + v + '</td>'
                }
                table += '</tr>'
              }
              table += '</tbody></table>'
              return table
            }
          }


          myChart.setOption(barOption)
          if (flag) {
            this.mychartsItemList.push(myChart)
          } else {
            configMap.set(id, myChart)
          }
        }
      }).catch(() => {
        this.$message.error('图表刷新失败')
      })
    },
    savePanel(flag) {
      this.panel.show_item = JSON.stringify(this.layout)
      this.panel.items = JSON.parse(JSON.stringify(this.itemList))
      rbAlertRepPanelServicesFactory.update(this.panel).then((res) => {
        this.$message.success('保存成功')
        this.updatePanelList(this.panel)
        if (this.creatPanelFlag) {
          this.addPanelVisible = true
          this.creatPanelFlag = false
        }
        if (this.changePanelFlag) {
          this.disposePanelEchart()
          let panelTemp = this.panelList.find(function(r) {
            return r.panel_name === flag
          })
          this.panel = JSON.parse(JSON.stringify(panelTemp))
          this.curPanelName = this.panel.panel_name
          this.initPanelInfo()
          this.changePanelFlag = false
        }
      }).catch(() => {
        this.$message.error('保存失败')
      })
    },
    // 删除大屏
    delPanel() {
      this.$confirm('删除视图组后相应的视图也将会删除，确认删除该视图组吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rbAlertRepPanelServicesFactory.delete(this.panel.id).then((res) => {
          this.$message.success('删除成功')
          this.initPanel()
        }).catch(() => {
          this.$message.error('删除失败')
        })
        if (this.panelList.length === 0) {
          this.panel = {}
        }
      })
    },
    previewItem() {
      if (!this.validItem()) {
        return
      }
      let reportType = this.item.report_type
      var h = 5
      var tmpY = 0
      if (this.itemLayout.length > 0) {
        this.itemLayout[0].reportType = reportType
      } else {
        let testItem = { x: 0, y: tmpY, w: 12, h: h, i: h + '', resizable: true, draggable: true, itemId: 'curItem', reportType: reportType }
        this.itemLayout.push(testItem)
      }
      this.mychartsItemList.forEach(function(element) {
        element.dispose()
      })
      this.$nextTick(() => {
        this.loadReport(this.item, 'curItem', true)
      })
      this.$forceUpdate()
    },
    cancleItem() {
      this.closeDialog()
    },
    validItem() {
      let flag = true
      if (!this.item.report_name) {
        flag = false
      }
      if (!this.item.time_value) {
        flag = false
      }
      let unit = ''
      for (let i = 0; i < this.item.moniterItems.length; i++) {
        let m = this.item.moniterItems[i]
        if (i !== 0) {
          if (unit !== m.unit) {
            flag = false
            this.$message.warning('请保持数据单位一致！')
            return flag
          }
        } else {
          unit = m.unit
        }
        if (!m.resource_device || m.resource_device === undefined) {
          flag = false
          break
        }
        if (!m.moniter_item) {
          flag = false
          break
        }
        if (!m.count_type || m.count_type === undefined) {
          flag = false
          break
        }
        if (!m.view_name || m.view_name === undefined) {
          flag = false
          break
        }
      }
      if (!flag) {
        this.$message.warning('请将数据填写完整！')
      } else {
        this.unit = unit
      }
      return flag
    },
    saveItem() {
      if (!this.validItem()) {
        return
      }
      if (this.item.item_id) {
        for (let i = 0; i < this.itemList.length; i++) {
          let lay = this.itemList[i]
          if (lay.item_id === this.item.item_id) {
            let itemTemp = JSON.parse(JSON.stringify(this.item))
            this.itemList[i] = itemTemp
            break
          }
        }
      } else {
        this.id++
        this.item.item_id = 'item' + this.id
        let newItem = JSON.parse(JSON.stringify(this.item))
        this.itemList.push(newItem)
        this.add(this.item.report_type)
      }
      this.$nextTick(() => {
        if (configMap.has(this.item.item_id)) {
          var echart = configMap.get(this.item.item_id)
          echart.dispose()
        }
        this.loadReport(this.item, this.item.item_id, false)
        this.closeDialog()
      })
    },
    closeDialog() {
      this.addVisible = false
      this.item = {
        report_type: '',
        moniterItems: []
      }
      this.itemLayout = []
      this.itemChart = null
    },
    delMoniter(index) {
      this.item.moniterItems.splice(index, 1)
      this.$forceUpdate()
    },
    addMoniter() {
      this.item.moniterItems.push({ moniterItemList: [] })
      this.$forceUpdate()
    },
    addItem() {
      if (!this.curPanelName) {
        this.$message.warning('请先创建监控大屏！')
        return
      }
      this.transunit = ''
      this.addVisible = true
      this.item.report_type = 'line'
      this.item.time_unit = 'minute'
      this.item.time_value = 5
      this.item.conversion_type = '2'
      this.unitList = []
      this.item.moniterItems.push({ moniterItemList: [] })
      this.$forceUpdate()
    },

    fullscreenChange(fullscreen) {
      this.$nextTick(() => {
        if (fullscreen !== true) {
          this.showDrop = true
        }
        this.refreshPanel()
      })
    },
    toggle() {
      this.showDrop = false
      this.fullscreen = !this.fullscreen
    },
    handleCommand(command) {
      if (command.type === 'del') {
        // 删除布局
        for (let i = 0; i < this.layout.length; i++) {
          let lay = this.layout[i]
          if (lay.itemId === 'item' + command.row) {
            this.layout.splice(i, 1)
            break
          }
        }
        // 删除配置
        for (let i = 0; i < this.itemList.length; i++) {
          let lay = this.itemList[i]
          if (lay.item_id === 'item' + command.row) {
            this.itemList.splice(i, 1)
            break
          }
        }
      }
      if (command.type === 'edit') {
        let itemTemp = this.itemList.find(function(r) {
          return r.item_id === 'item' + command.row
        })
        itemTemp.moniterItems.forEach(t => {
          t.moniterItemList = []
        })
        itemTemp.conversion_type = itemTemp.conversion_type + ''
        this.item = JSON.parse(JSON.stringify(itemTemp))
        this.refreshMoniterData()
        this.addVisible = true
        let valtemp = this.item.conversion_val
        this.setUnitList(this.item.moniterItems[0].unit)//this.item.report_unit
        this.item.conversion_val = valtemp
      }
    },
    refreshMoniterData() {
      let index = 0
      this.item.moniterItems.forEach(item => {
        let obj = {
          reType: item.resource_type
        }
        if (obj.reType === 6) {
          obj.ip = item.resource_device.split(',')
        } else {
          obj.rs = item.resource_device
        }
        let moniter_item = item.moniter_item
        this.getTreeData(obj, item)
        item.moniter_item = moniter_item
      })
    },
    getTreeData(obj, mo) {
      mo.moniterItemList = []
      mo.moniter_item = ''
      this.tableData = []
      rbAlertRepPanelServicesFactory.getMonitorItem(obj).then((res) => {
        mo.moniterItemList = res.result
        mo.moniterItemList.forEach(m => {
          if (m.moniterItem !== null && m.moniterItem !== undefined) {
            this.tableData = this.tableData.concat(m.moniterItem)
          }
        })
        this.total = this.tableData.length
        this.tableDataTemp = []
        this.tableDataTemp = this.tableDataTemp.concat(this.tableData)
        // this.tableTemp = this.tableTemp.concat(this.tableData)
        this.getTableTemp()
      })
      this.$forceUpdate()
    },
    uniqueArray(array) {
      var init = []
      array.forEach(function(item) {
        if (init.indexOf(item) < 0) {
          init.push(item)
        }
      })
      return init
    },

    movedEventItem: function(i, newX, newY) {
      this.itemLayout[0].x = newX
      this.itemLayout[0].y = newY
      var myChart = echarts.init(document.getElementById('curItem'), 'macarons')
      myChart.resize()
    },
    resizedEventItem: function(i, newH, newW, newHPx, newWPx) {
      this.itemLayout[0].h = newH
      this.itemLayout[0].w = newW
      var myChart = echarts.init(document.getElementById('curItem'), 'macarons')
      myChart.resize()
    },
    movedEvent: function(i, newX, newY) {
      // var msg = 'MOVED i=' + i + ', X=' + newX + ', Y=' + newY
      var tmpType = 'report'

      this.testLayout.forEach(function(element) {
        if (element.i === i) {
          element.x = newX
          element.y = newY
          if (element.reportType === 'table') {
            tmpType = 'table'
          }
        }
      })
      if (tmpType === 'report') {
        var myChart = echarts.init(document.getElementById('item' + i), 'macarons')
        myChart.resize()
      }
    },
    resizedEvent: function(i, newH, newW, newHPx, newWPx) {
      // var msg = 'RESIZED i=' + i + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx
      var tmpType = 'report'
      this.testLayout.forEach(function(element) {
        if (element.i === i) {
          element.h = newH
          element.w = newW
          if (element.reportType === 'table') {
            tmpType = 'table'
          }
        }
      })
      if (tmpType === 'report') {
        var myChart = echarts.init(document.getElementById('item' + i), 'macarons')
        myChart.resize()
      }
    },
    // 新增布局报表
    add(reportType) {
      this.reportTypeTmp = reportType
      var h = 5
      // 判断没有图表的时候报表移动重新设置
      var tmpY = 0
      this.layout.forEach(item => {
        tmpY = tmpY + item.h
      })
      var testLayoutApp = [
        { 'x': 0, 'y': tmpY, 'w': 12, 'h': h, 'i': this.id + '', resizable: true, draggable: true, itemId: 'item' + this.id, reportType: reportType }
      ]
      this.testLayout = this.testLayout.concat(testLayoutApp)
      this.layout = this.layout.concat(testLayoutApp)
      // this.layout = JSON.parse(JSON.stringify(this.testLayout))

      // this.loadIndex(this.id, reportType)
    },

    // 资源设备
    selectDevice() {
      /* this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/produce/list`,
        params: this.queryParams,
      }).then((res) => {
        this.deviceResult = res;
        return res
      }); */
    },

    // 监控项
    selectMonitor() {
      /* this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/produce/list`,
        params: this.queryParams,
      }).then((res) => {
        this.monitorResult = res;
        return res
      }); */
    },

    // 默认加载初始化图
    loadIndex(item, reportType) {
      var myChart = echarts.init(document.getElementById('item' + item), 'macarons')
      var lineOption = {
        // title: {
        //   text: '折线图堆叠'
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告']
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          data: [220, 182, 191, 234, 290, 330, 310]
        }]
      }

      var barOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['直接访问', '邮件营销']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: '直接访问',
          type: 'bar',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '邮件营销',
          type: 'bar',
          stack: '广告',
          data: [120, 132, 101, 134, 90, 230, 210]
        }]
      }
      if (reportType === 'line') {
        myChart.setOption(lineOption)
        configMap.set(id, myChart)
      } else if (reportType === 'bar') {
        myChart.setOption(barOption)
        configMap.set(id, myChart)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tooltip {
  display: inline-block;
}
/deep/.el-input-number {
  width: 150px;
}
.mt-10 {
  margin-top: 10px;
}
.ml-5 {
  margin-left: 5px;
}
.showBorder {
  background: #fff;
  border: 1px solid #46bafe;
  box-sizing: border-box;
}

.showBorderN {
  background: #fff;
  border: 1px solid #eeeeee;
  box-sizing: border-box;
}

.el-select__tags-text {
  display: block;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 130px;
}

.el-select-dropdown__item.selected span {
  display: inline-block;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 160px;
}

.yw-form {
  margin-bottom: 10px;
}
/deep/ .yw-condition-form {
  padding-right: 616px;
}
/deep/ .yw-chart-form {
  padding-right: 224px;
}
/deep/ .yw-select-form {
  width: 100%;
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
    width: 47%;
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

.section-chart {
  .vue-grid-item {
    min-height: 190px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(230, 230, 230, 1);
    border-radius: 8px;
    box-shadow: 2px 2px 2px #eee inset;
    cursor: pointer;
  }
}

// 选择监控项
.table-wrap {
  display: flex;
  justify-content: center;
  border: 1px solid #e5e8ed;
  &__header {
    height: 44px;
    border-bottom: 1px solid #e5e8ed;
  }
  &__left {
    width: 546px;
  }
  &__middle {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    font-size: 20px;
    border-left: 1px solid #e5e8ed;
    border-right: 1px solid #e5e8ed;
  }
  &__right {
    width: 244px;
  }
  &__pagination {
    padding: 4px 20px;
  }
  &__table {
    font-size: 12px;
    /deep/ {
      .el-table th > .cell {
        color: #333;
      }
    }
  }
}

.search-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  line-height: 44px;
  padding: 0 20px;
  &__title {
    color: #333;
    font-size: 12px;
  }
  &__input {
    width: 260px;
    /deep/ {
      .el-input-group__prepend {
        padding: 0;
        padding-left: 15px;
        background: #fff;
      }
      .el-input__inner {
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}

.btn-group {
  margin-top: 34px;
  /deep/ {
    .el-button--primary {
      background: #46bafe;
      border-color: #46bafe;
    }
    .el-button--default {
      border-color: #e5e8ed;
      color: #46bafe;
    }
  }
}
</style>
