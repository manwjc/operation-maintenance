<template>
  <div class="components-container yw-dashboard">

    <!-- tab -->
    <section class="yw-tab-section">
      <el-tabs class="yw-tabs">
        <el-tab-pane label="主题数据定义">
        </el-tab-pane>
      </el-tabs>
      <!-- <el-form class="yw-tab-right yw-form"
               label-width="86px">
        <el-form-item label="最新扫描时间">
          {{ scanDate }}
        </el-form-item>
      </el-form> -->
    </section>
    <!-- tab -->

    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="主题名称">
        <el-input @keyup.enter.native="searchThematic"
                  class="schedule-search"
                  placeholder="请输入业务主题名称"
                  style="width:160px;"
                  v-model.trim="searchText">
          <i slot="suffix"
             class="el-input__icon el-icon-search search"
             @click="searchThematic()"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="关联类型">
        <el-select filterable
                   placeholder="请选择关联类型"
                   v-model="object_type"
                   @change="objectType"
                   :clearable="true">
          <el-option key="1"
                     label="设备"
                     value="1"></el-option>
          <el-option key="2"
                     label="业务系统"
                     value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联对象">
        <el-select filterable
                   placeholder="请选择关联对象"
                   v-model="selectBiz"
                   @change="selBiz"
                   :clearable="true">
          <el-option v-for="item in bizSysList"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="reset()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-tooltip class="item"
                    effect="dark"
                    content="下载帮助文档"
                    placement="top">
          <el-button type="text"
                     icon="fa fa-file-text-o"
                     @click="downloadDoc">帮助文档</el-button>
        </el-tooltip>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 310px)"
                  :default-sort="{prop: 'create_time', order: 'descending'}">
          <el-table-column prop="object_type"
                           label="关联类型"
                           width=""
                           :formatter="objectTypeFormatter"></el-table-column>
          <el-table-column prop="biz_name"
                           label="业务系统"
                           width=""></el-table-column>
          <el-table-column prop="theme_name"
                           label="业务主题数据名称"
                           width=""
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="up_type"
                           label="接入类型"
                           width=""
                           :formatter="jieruTypeFormatter"></el-table-column>
          <el-table-column prop="create_time"
                           label="创建时间"
                           width=""
                           :show-overflow-tooltip="true"
                           sortable
                           :formatter="formatterCreateTime">
          </el-table-column>
          <el-table-column prop="last_up_Time"
                           label="最近上报时间"
                           width=""
                           :show-overflow-tooltip="true"
                           sortable
                           :formatter="formatterLastUpTime">
          </el-table-column>
          <el-table-column prop="up_switch"
                           label="接收开关">
            <template slot-scope="scope"
                      v-if="scope.row.up_type === '0'">
              <el-switch v-model="scope.row.up_switch"
                         active-color="#46BAFE"
                         active-text="开"
                         active-value="0"
                         inactive-color="#D3EFFF"
                         inactive-text="关"
                         inactive-value="1"
                         @change="changeUpSwitchStatus(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="status"
                           label="状态"
                           sortable>
            <template slot-scope="scope">
              <div class="status">
                <span v-if="scope.row.up_status === '0'">
                  <i class="work-status-icon-g"></i>正常
                </span>
                <span v-else>
                  <i class="work-status-icon-y"></i>
                  异常
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           min-width="160">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           @click="thematicDataHistory(scope.row)"
                           title="日志"
                           icon="el-icon-tickets"></el-button>
                <el-button type="text"
                           @click="thematicDataUpdate(scope.row)"
                           title="编辑"
                           icon="el-icon-update"></el-button>
                <el-button type="text"
                           @click="thematicDataDelete(scope.row)"
                           title="删除"
                           icon="el-icon-delete"></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </el-form>

    <!-- dialog -->
    <el-dialog title="主题数据采集日志"
               :visible.sync="dialogVisible"
               class="create-host-group"
               :close-on-click-modal="false">
      <el-row>
        <el-col :span="4">
          <span class="host-step-icon">1</span>
          <h5 class="host-step-title">基础信息</h5>
        </el-col>
        <el-col :span="6"
                class="form_con">
          <span class="them-dialog-name">主题数据名称:</span>
          <span class="them-dialog-value"
                :title="form.theme_name">{{form.theme_name}}</span>
        </el-col>
        <el-col :span="14"
                class="form_con">
          <span class="them-dialog-name">业务系统:</span>
          <span class="them-dialog-value"
                :title="form.biz_name">{{form.biz_name}}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="6"
                class="form_con">
          <span class="them-dialog-name">接入方式:</span>
          <span class="them-dialog-value"
                :title="form.up_type === '0' ? 'HTTP数据接入' : '日志接入'">{{form.up_type === '0' ? '接口传数据接入' : '日志接入'}}</span>
        </el-col>
        <el-col :span="14"
                class="form_con">
          <span class="them-dialog-name">上报接口:</span>
          <span class="them-dialog-value"
                :title="netAddress">{{netAddress}}</span>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-col :span="4">
          <span class="host-step-icon">2</span>
          <h5 class="host-step-title">交互记录</h5>
        </el-col>
        <el-col :span="6">
          <span v-if="form&&form.receive_time"
                class="them-dialog-name">{{form.receive_time}}</span>
          <span class="them-dialog-name">&nbsp;</span>
        </el-col>
        <el-col :span="14"
                class="them-dialog-diary-borderLeft">
          <i class="them-dialog-icon-g"
             v-if="form.theme_data"></i>
          <i class="them-dialog-icon-y"
             v-else></i>
          <div>
            <span class="them-dialog-name"
                  style="font-family: MicrosoftYaHei;color: #333333;position: relative;top: -10px;text-align:left;">收到日志</span>
            <div class="form_data"
                 style="word-wrap:break-word;">{{form.theme_data}}</div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="6">
          <span v-if="form&&form.receive_time"
                class="them-dialog-name">{{form.receive_time}}</span>
          <span v-else
                class="them-dialog-name">&nbsp;</span>
        </el-col>

        <el-col :span="14"
                class="them-dialog-diary-borderLeft"
                style="margin-top:0;">
          <i class="them-dialog-icon-g"
             v-if="form.theme_data"></i>
          <i class="them-dialog-icon-y"
             v-else></i>
          <div>
            <span v-if="form.theme_data"
                  class="them-dialog-name"
                  style="font-family: MicrosoftYaHei;color: #333333;position: relative;top: -10px;text-align:left;">解析结果成功</span>
            <span v-else
                  class="them-dialog-name"
                  style="font-family: MicrosoftYaHei;color: #333333;position: relative;top: -10px;text-align:left;">解析结果失败</span>

            <div v-if="form.theme_data"
                 class="form_data">
              <div>
                <span>业务系统编码:{{form.biz_code}}</span>
              </div>
              <div>
                <span>业务指标编码:{{form.jkzb_code}}</span>
              </div>
              <div v-for="(dimItem,dimIndex) in form.dim_list"
                   :key="dimIndex">
                <span>{{dimItem.dimName}}:{{dimItem.dimValue}}</span>
              </div>
              <div>
                <span v-if="form.jkzb_value">监控数据采集值:{{form.jkzb_value}}</span>
              </div>
            </div>
            <div v-else
                 class="">{{form.desc}}</div>
          </div>
        </el-col>
      </el-row>

      <div style="text-align: center; margin-top: 35px;">
        <el-button type="primary"
                   @click="dialogVisible= false"
                   style="height:30px;padding: 8px 15px;">知道了</el-button>
        <el-button @click="dialogVisible= false"
                   style="height:30px;padding: 8px 15px;">取消</el-button>
      </div>

    </el-dialog>
    <el-dialog :title="tendencyChartTitle"
               :visible.sync="tendencyChartDialogVisible"
               v-if="tendencyChartDialogVisible"
               :close-on-click-modal="false">
      <tendencyChart @setDialogParam="setDialogParam"
                     ref="tendencyChart"></tendencyChart>
    </el-dialog>
    <!-- dialog -->
  </div>
  <!-- <div class="component-container">
    <header>
      <div class="header-left">
        <span class="schedule-all">主题数据定义</span>
        <el-button type="primary"
                   class="schedule-add el-icon-plus"
                   @click="goAdd()"> 主题数据接入和调试</el-button>
      </div>
      <div class="header-right">
        <el-input @keyup.enter.native="searchThematic"
                  class="schedule-search"
                  placeholder="请输入业务主题名称"
                  style="width:160px;"
                  v-model.trim="searchText">
          <i slot="suffix"
             class="el-input__icon el-icon-search search"
             @click="searchThematic()"></i>
        </el-input>

        <el-select filterable
                   class="select"
                   style="width:160px;"
                   placeholder="请选择关联类型"
                   v-model="object_type"
                   @change="objectType"
                   :clearable="true">
          <el-option key="1"
                     label="设备"
                     value="1"></el-option>
          <el-option key="2"
                     label="业务系统"
                     value="2"></el-option>
        </el-select>

        <el-select filterable
                   class="select"
                   style="width:160px;"
                   placeholder="请选择关联对象"
                   v-model="selectBiz"
                   @change="selBiz"
                   :clearable="true">
          <el-option v-for="item in bizSysList"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>

        <span @click="downloadDoc"
              style="cursor: pointer;position: relative; padding: 6px 10px 6px 3px;"
              class="text">
          <span class="el-tabs-help-round ic-text">
            <i class="fa fa-file-text-o"></i>
          </span>
          <el-tooltip class="item"
                      effect="dark"
                      content="下载帮助文档"
                      placement="top">
            <span style="font-size: 12px;">帮助文档</span>
          </el-tooltip>
          <i class="xiazai el-icon-download"
             style=""></i>
        </span>
      </div>
    </header>
    <el-table v-if="tableData"
              :data="tableData"
              style="margin-top:36px"
              :default-sort="{prop: 'create_time', order: 'descending'}">
      <el-table-column prop="object_type"
                       label="关联类型"
                       align="center"
                       width=""
                       :formatter="objectTypeFormatter"></el-table-column>
      <el-table-column prop="biz_name"
                       label="业务系统"
                       align="center"
                       width=""></el-table-column>
      <el-table-column prop="theme_name"
                       label="业务主题数据名称"
                       align="center"
                       width=""
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="up_type"
                       label="接入类型"
                       align="center"
                       width=""
                       :formatter="jieruTypeFormatter"></el-table-column>
      <el-table-column prop="create_time"
                       label="创建时间"
                       align="center"
                       width=""
                       :show-overflow-tooltip="true"
                       sortable
                       :formatter="formatterCreateTime">
      </el-table-column>
      <el-table-column prop="last_up_Time"
                       label="最近上报时间"
                       align="center"
                       width=""
                       :show-overflow-tooltip="true"
                       sortable
                       :formatter="formatterLastUpTime">
      </el-table-column>
      <el-table-column prop="up_switch"
                       label="接收开关"
                       align="center">
        <template slot-scope="scope"
                  v-if="scope.row.up_type === '0'">
          <el-switch v-model="scope.row.up_switch"
                     active-color="#46BAFE"
                     active-text="开"
                     active-value="0"
                     inactive-color="#D3EFFF"
                     inactive-text="关"
                     inactive-value="1"
                     @change="changeUpSwitchStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="status"
                       label="状态"
                       align="center"
                       sortable>
        <template slot-scope="scope">
          <div class="status">
            <span v-if="scope.row.up_status === '0'">
              <i class="work-status-icon-g"></i>正常
            </span>
            <span v-else>
              <i class="work-status-icon-y"></i>
              异常
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       min-width="160">
        <template slot-scope="scope">
          <a href="javascript:;"
             @click="thematicDataHistory(scope.row)"
             class="delete">日志</a>
          <a href="javascript:;"
             @click="thematicDataUpdate(scope.row)"
             class="delete">修改</a>
          <a href="javascript:;"
             @click="thematicDataDelete(scope.row)"
             class="delete">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="pageSizes"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <el-dialog title="主题数据采集日志"
               :visible.sync="dialogVisible"
               class="create-host-group"
               :close-on-click-modal="false">
      <el-row>
        <el-col :span="4">
          <span class="host-step-icon">1</span>
          <h5 class="host-step-title">基础信息</h5>
        </el-col>
        <el-col :span="6"
                class="form_con">
          <span class="them-dialog-name">主题数据名称:</span>
          <span class="them-dialog-value"
                :title="form.theme_name">{{form.theme_name}}</span>
        </el-col>
        <el-col :span="14"
                class="form_con">
          <span class="them-dialog-name">业务系统:</span>
          <span class="them-dialog-value"
                :title="form.biz_name">{{form.biz_name}}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="6"
                class="form_con">
          <span class="them-dialog-name">接入方式:</span>
          <span class="them-dialog-value"
                :title="form.up_type === '0' ? 'HTTP数据接入' : '日志接入'">{{form.up_type === '0' ? '接口传数据接入' : '日志接入'}}</span>
        </el-col>
        <el-col :span="14"
                class="form_con">
          <span class="them-dialog-name">上报接口:</span>
          <span class="them-dialog-value"
                :title="netAddress">{{netAddress}}</span>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-col :span="4">
          <span class="host-step-icon">2</span>
          <h5 class="host-step-title">交互记录</h5>
        </el-col>
        <el-col :span="6">
          <span v-if="form&&form.receive_time"
                class="them-dialog-name">{{form.receive_time}}</span>
          <span class="them-dialog-name">&nbsp;</span>
        </el-col>
        <el-col :span="14"
                class="them-dialog-diary-borderLeft">
          <i class="them-dialog-icon-g"
             v-if="form.theme_data"></i>
          <i class="them-dialog-icon-y"
             v-else></i>
          <div>
            <span class="them-dialog-name"
                  style="font-family: MicrosoftYaHei;color: #333333;position: relative;top: -10px;text-align:left;">收到日志</span>
            <div class="form_data"
                 style="word-wrap:break-word;">{{form.theme_data}}</div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="6">
          <span v-if="form&&form.receive_time"
                class="them-dialog-name">{{form.receive_time}}</span>
          <span v-else
                class="them-dialog-name">&nbsp;</span>
        </el-col>

        <el-col :span="14"
                class="them-dialog-diary-borderLeft"
                style="margin-top:0;">
          <i class="them-dialog-icon-g"
             v-if="form.theme_data"></i>
          <i class="them-dialog-icon-y"
             v-else></i>
          <div>
            <span v-if="form.theme_data"
                  class="them-dialog-name"
                  style="font-family: MicrosoftYaHei;color: #333333;position: relative;top: -10px;text-align:left;">解析结果成功</span>
            <span v-else
                  class="them-dialog-name"
                  style="font-family: MicrosoftYaHei;color: #333333;position: relative;top: -10px;text-align:left;">解析结果失败</span>

            <div v-if="form.theme_data"
                 class="form_data">
              <div>
                <span>业务系统编码:{{form.biz_code}}</span>
              </div>
              <div>
                <span>业务指标编码:{{form.jkzb_code}}</span>
              </div>
              <div v-for="(dimItem,dimIndex) in form.dim_list"
                   :key="dimIndex">
                <span>{{dimItem.dimName}}:{{dimItem.dimValue}}</span>
              </div>
              <div>
                <span v-if="form.jkzb_value">监控数据采集值:{{form.jkzb_value}}</span>
              </div>
            </div>
            <div v-else
                 class="">{{form.desc}}</div>
          </div>
        </el-col>
      </el-row>

      <div style="text-align: center; margin-top: 35px;">
        <el-button type="primary"
                   @click="dialogVisible= false"
                   style="height:30px;padding: 8px 15px;">知道了</el-button>
        <el-button @click="dialogVisible= false"
                   style="height:30px;padding: 8px 15px;">取消</el-button>
      </div>

    </el-dialog>
    <el-dialog :title="tendencyChartTitle"
               :visible.sync="tendencyChartDialogVisible"
               v-if="tendencyChartDialogVisible"
               :close-on-click-modal="false">
      <tendencyChart @setDialogParam="setDialogParam"
                     ref="tendencyChart"></tendencyChart>
    </el-dialog>
  </div> -->
</template>

<script>
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
import tendencyChart from '../components/tendencyChart'
import { upInterfaceObj } from '../config/options.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'

export default {
  data () {
    return {
      // 网络地址
      netAddress: '',
      // 日志详情对象
      form: {},
      // 趋势图传递对象
      rowParam: {},
      // 趋势图标题
      tendencyChartTitle: '主题数据趋势图',
      // 趋势图
      tendencyChartDialogVisible: false,
      // 数据列表
      tableData: [],
      // 搜索主题框
      searchText: '',
      // 选择业务系统
      selectBiz: '',
      // 选择关联类型
      object_type: '',
      // 业务系统下拉框
      bizSysList: [],
      // 日志对话框
      dialogVisible: false,
      // 当前页
      currentPage: 1,
      // 分页每页多少行数据
      pageSize: 5,
      // 每页多少行数组
      pageSizes: [5, 10, 20],
      // 总共多少行数据
      total: 0
    }
  },
  methods: {
    // 1 element相关方法 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.search(1)
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.search(1)
    },
    searchThematic () {
      this.search()
    },
    selBiz () {
      this.search()
    },
    objectType () {
      this.search()
    },
    jieruTypeFormatter (row, column) {
      return row.up_type === '0' ? 'HTTP数据接入' : '日志接入'
    },
    objectTypeFormatter (row, column) {
      return row.object_type === '1' ? '设备' : '业务系统'
    },
    formatterCreateTime (row, column) {
      return formatDate(row.create_time)
    },
    formatterLastUpTime (row) {
      return formatDate(row.last_up_Time)
    },
    // 2 业务逻辑方法
    goAdd () {
      this.$router.push('add')
    },
    tendencyChartClick (row) {
      this.rowParam = row
      this.tendencyChartDialogVisible = true
    },
    setDialogParam () {
      // 传递数据给子页面，子页面调用方法
      this.$refs.tendencyChart.rowParam = this.rowParam
    },
    changeUpSwitchStatus (obj) {
      this.$confirm('确认修改？').then(() => {
        let str = obj.theme_id
        let arr = [obj, str]
        rbProjectDataServiceFactory.updateTheme(arr).then((res) => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.search(1)
        }).catch(() => {
          this.$message({
            message: '修改失败',
            type: 'error'
          })
          if (obj.up_switch === '0') {
            obj.up_switch = '1'
          } else {
            obj.up_switch = '0'
          }
        })
      }, () => {
        if (obj.up_switch === '0') {
          obj.up_switch = '1'
        } else {
          obj.up_switch = '0'
        }
      })
    },
    downloadDoc () {
      rbProjectDataServiceFactory.downLoadExplainDoc().then((res) => {
        // let blob = new Blob([res], {type: 'application/msword'})
        // let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let blob = new Blob([res], { type: 'application/msword' })
        // 创建下载链接
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '业务主题数据接入说明.doc'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      })
    },
    search (num) {
      if (num !== 1) {
        // 搜索前将当前页置为1
        this.currentPage = 1
      }
      let obj = {
        'page_no': this.currentPage,
        'page_size': this.pageSize,
        'theme_name': this.searchText,
        'object_id': this.selectBiz,
        'object_type': this.object_type
      }
      this.getTableData(obj)
    },
    thematicDataHistory (obj) {
      this.dialogVisible = true
      this.form = {}
      this.form.theme_name = obj.theme_name
      this.form.biz_name = obj.biz_name
      this.form.up_type = obj.up_type
      rbProjectDataServiceFactory.getThemeDataHis(obj.theme_id).then((res) => {
        if (res.success && res.resMap) {
          Object.assign(this.form, res.resMap)
          this.form.theme_data = this.packMsg(this.form.message)
          this.$forceUpdate()
        }
      })
    },
    thematicDataUpdate (obj) {
      this.$store.commit('updateTheme', obj.theme_id)
      this.$router.push('update')
    },
    thematicDataDelete (obj) {
      this.$confirm('确认删除此主题？').then(() => {
        this.deleteTheme(obj.theme_id)
      })
    },
    // 3 封装数据方法
    packMsg (str) {
      let obj = JSON.parse(str)
      let str1 = `{

      "SysCode":"${obj.sysCode}",
      "Time":"${obj.time}",
      "ThemeCode":"${obj.themeCode}",
      "Datas":["${obj.datas}"]
  }`
      return str1
    },
    // 4 数据相关方法
    getTableData (obj1) {
      let obj = {
        'page_no': this.currentPage,
        'page_size': this.pageSize,
        'order': 'desc',
        'sort_name': 'update_time',
        'status': '0'
      }
      if (obj1) {
        obj = Object.assign(obj, obj1)
      }
      rbProjectDataServiceFactory.getThemeList(obj).then((res) => {
        this.tableData = res.result
        this.total = res.count
      })
    },
    getBizSysList () {
      rbProjectDataServiceFactory.getBizSysList().then((res) => {
        if (res) {
          this.bizSysList = res
        }
      })
    },
    deleteTheme (str) {
      rbProjectDataServiceFactory.deleteTheme(str).then((res) => {
        this.getTableData()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }).catch((error) => {
        if (error.message === 'failed to delete') {
          this.$message.error('已关联监控项的主题不能删除')
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    initData () {
      this.getTableData()
      this.getBizSysList()
      this.netAddress = upInterfaceObj[0]
    }
  },
  mounted () {
    this.initData()
  },
  components: {
    tendencyChart
  }
}
</script>

<style lang="scss" scoped>
.component-container {
  header {
    font-size: 14px;
    padding: 0 18px 0 30px;
    height: 62px;
    line-height: 62px;
    .header-left {
      float: left;
      .schedule-all {
        color: #333;
        font-weight: bold;
      }
      .schedule-add {
        margin-left: 15px;
        color: #f4f4f4;
        height: 30px;
        padding: 7px 15px;
      }
    }
    .header-right {
      float: right;
      .schedule-search {
        /deep/ .el-input__inner:hover {
          box-shadow: 0 0 6px 0 #9ae2ff;
          border: 1px solid #d6e1e5 !important;
        }
        width: 170px;
        .search {
          cursor: pointer;
        }
      }
      .el-select {
        /deep/ .el-input__inner:hover {
          box-shadow: 0 0 6px 0 #9ae2ff;
          border: 1px solid #d6e1e5 !important;
        }
        margin-left: 10px;
        width: 130px;
        color: #333;
        .el-icon-caret-top {
          color: #d6e1e5;
        }
      }
      .text {
        .el-tabs-help-round {
          background: #ffd362;
          color: #fff;
        }
        .ic-text {
          display: inline-block;
          height: 26px;
          width: 22px;
          text-align: center;
          line-height: 26px;
          border-radius: 50%;
        }
      }
    }
  }
  .el-table {
    .status {
      .work-status-icon-g,
      .work-status-icon-y {
        position: absolute;
        left: 32%;
        top: 45%;
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }
      .work-status-icon-g {
        background: #93ce5e;
      }
      .work-status-icon-y {
        background-color: #ff4545;
      }
    }
    .delete {
      margin-left: 20px;
      text-decoration: none;
      color: #46bafe;
    }
  }
  .block {
    margin-top: 30px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .create-host-group {
    /deep/ .el-dialog__header {
      padding: 20px;
      border-bottom: 1px solid #ececec;
      /deep/ .el-dialog__title {
        font-size: 16px;
        font-weight: 700;
        color: #1f2d3d;
      }
    }
    .form_con {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .host-step-icon {
      display: inline-block;
      width: 22px;
      height: 22px;
      font-size: 10px;
      color: #333333;
      border-radius: 22px;
      background: #ffedd1;
      text-align: center;
      line-height: 22px;
    }
    .host-step-title {
      text-align: center;
      line-height: 32px;
      display: inline;
      margin-left: 8px;
      color: #333333;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      font-weight: bold;
    }
    .them-dialog-name {
      font-family: PingFangSC-Regular;
      display: inline-block;
      font-size: 12px;
      color: #999999;
      text-align: center;
      line-height: 14px;
    }
    .them-dialog-value {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #333333;
      line-height: 14px;
    }
    .them-dialog-diary-borderLeft {
      border-left: 1px solid #ececec;
      padding-left: 10px;
      min-height: 180px;
      margin-top: 10px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #999999;
      line-height: 14px;
    }
    .them-dialog-icon-y,
    .them-dialog-icon-g {
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      left: -13px;
      top: 0px;
      position: relative;
    }
    .them-dialog-icon-y {
      background-color: #ca4621;
    }
    .them-dialog-icon-g {
      background: #7ad24f;
    }
    .form_data {
      min-height: 180px;
      margin-top: 5px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }
  }
}
</style>
