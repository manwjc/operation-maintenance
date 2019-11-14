<template>
  <div>
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px"
             v-model="queryForm">
      <el-form-item label="管理IP">
        <el-input v-model="queryForm.ip"
                  placeholder="请输入管理IP"></el-input>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="queryForm.deviceName"
                  placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="资源池">
        <el-select v-model="queryForm.idcType"
                   placeholder="请选择资源池"
                   filterable
                   clearable>
          <el-option v-for="(item, index) in idcTypeList"
                     :key="index"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="POD">
        <el-select v-model="queryForm.pod"
                   placeholder="请选择POD名称"
                   filterable
                   clearable>
          <el-option v-for="(item, index) in podList"
                     :key="index"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机房位置">
        <el-input v-model="queryForm.room"
                  placeholder="请输入机房位置"></el-input>
      </el-form-item>
      <el-form-item label="设备分类">
        <el-select v-model="queryForm.deviceType"
                   placeholder="请选择设备分类"
                   filterable
                   clearable>
          <el-option v-for="(item, index) in deviceTypeList"
                     :key="index"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备型号">
        <el-input v-model="queryForm.deviceModel"
                  placeholder="请输入设备型号"></el-input>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="toSearchData()">查询</el-button>
        <el-button @click="clearAllParam()">重置</el-button>
      </section>
    </el-form>
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <section class="fr">
          <el-button type="text"
                     icon="el-icon-edit"
                     @click="showBatchUpdate"
                     v-show="false">批量更新</el-button>
          <el-button type="text"
                     icon="el-icon-download"
                     v-show="false">数据采集</el-button>
          <el-button v-popover:popover
                     type="text"
                     icon="el-icon-d-caret">选择列
          </el-button>
          <el-popover ref="popover"
                      placement="top"
                      trigger="click">
            <div id="popover"
                 class="choose-column-popover">
              <el-checkbox-group v-model="selectColumns"
                                 @change="handleCheckedColumnChange">
                <div v-for="column in checkColumns">
                  <el-checkbox :label="column.keyCode">{{ column.keyName }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </el-popover>
        </section>
        <el-button v-show="moduleInfo.moduleId"
                   type="text"
                   icon="el-icon-plus"
                   @click="add()">新增</el-button>
        <el-menu class="el-menu-button"
                 mode="horizontal"
                 v-show="!moduleInfo.moduleId">
          <el-submenu index="1">
            <template slot="title">
              <span class="el-icon-plus"></span><span class="button-text">新增</span>
            </template>
            <el-submenu v-for="(item, index) in moduleList"
                        :index="item.id"
                        :key="index">
              <template slot="title">{{item.name}}</template>
              <div style="min-height:100px;max-height: 150px;overflow-y: auto">
                <el-menu-item :index="child.id"
                              v-if="item.childModules && item.childModules.length > 0"
                              :key="childIdx"
                              v-for="(child, childIdx) in item.childModules"
                              @click="handleSelect(child)">{{child.name}}</el-menu-item>
              </div>
            </el-submenu>
          </el-submenu>
        </el-menu>
        <el-button type="text"
                   icon="el-icon-download"
                   @click="importInstance()">导入</el-button>
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportData()">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  row-key="id"
                  ref="table"
                  @sort-change="handleRemoteSort"
                  @selection-change="handleSelectionChange"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 360px)">
          <el-table-column type="selection"
                           width="40">
          </el-table-column>
          <el-table-column prop="ip"
                           label="管理IP"
                           width="120"
                           fixed
                           sortable="custom"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button style="text-decoration:none"
                         type="text"
                         align="left"
                         @click="toDetail(scope.row.id)">{{scope.row.ip}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="device_name"
                           label="设备名称"
                           width="120"
                           fixed
                           sortable="custom"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button style="text-decoration:none"
                         type="text"
                         align="left"
                         @click="toDetail(scope.row.id)">
                {{scope.row.device_name}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="insert_time"
                           label="创建时间"
                           width="120"
                           fixed
                           sortable="custom"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="update_time"
                           label="最后更新时间"
                           width="120"
                           fixed
                           sortable="custom"
                           show-overflow-tooltip></el-table-column>
          <div v-for="(item, index) in checkColumns">
            <el-table-column :prop="item.keyCode"
                             :label="item.keyName"
                             v-if="showColumn(item.keyCode)"
                             sortable="custom"
                             min-width="150px"
                             show-overflow-tooltip></el-table-column>
          </div>
          <el-table-column label="操作"
                           width="60"
                           fixed="right">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           @click="toUpdate(scope.row.id)"
                           icon="el-icon-edit">
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <el-pagination ref="taskPage"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="paginationData.currentPage"
                       :page-sizes="[30, 50, 100]"
                       :page-size="paginationData.pageSize"
                       :total="paginationData.total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-form>

    <!-- dialog -->
    <importInstances ref="importInstances"
                     v-if="display.isImport"
                     :showImport="display.isImport"
                     @setImportDisplay="setImportDisplay"
                     :importType="importType"></importInstances>
    <search-panel v-if="display.isSearchPlane"
                  :visible.sync="display.isSearchPlane"
                  :reset="reset"
                  :moduleInfo="moduleInfo"
                  :menuType="'repertory'"
                  @setShow="setShowDialog"
                  @setSearchFileds="setSearchFileds"></search-panel>
    <batch-update v-if="display.isBatchUpdate"
                  :visible.sync="display.isSearchPlane"
                  :moduleInfo="moduleInfo"
                  :selectData="multipleSelectionAll"
                  @setShow="setShowDialog"></batch-update>
    <!-- dialog -->
  </div>
</template>

<script>
import $ from 'jquery'
import importInstances from 'src/pages/cmdb/v2/instance/import/import-instance.vue'
import exportInstances from 'src/pages/cmdb/v2/components/exportInstances.vue'
import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
import searchPanel from 'src/pages/cmdb/v2/components/searchPanel.vue'
import batchUpdate from 'src/pages/cmdb/v2/components/batchUpdate.vue'

export default {
  props: ['queryType', 'moduleCondition', 'bizSystemCondition'],
  name: '/v2/instance/bizSystem',
  components: {
    batchUpdate,
    searchPanel,
    importInstances,
    exportInstances
  },
  data () {
    return {
      display: {
        isImport: false,
        isEdit: false,
        isSearchPlane: false,
        isBatchUpdate: false
      },
      importType: 'instance',
      labelPosition: 'left',
      queryForm: {
        ip: '',
        deviceName: '',
        idcType: '',
        pod: '',
        room: '',
        deviceType: '',
        deviceModel: ''
      },
      formData2: {
        name: '',
        tag: '',
        insertTime: [],
        updateTime: []
      },
      searchFields: [],
      tableData: [],
      column_data: {},
      columnList: [],
      paginationData: {
        currentPage: 1,
        total: 0,
        pageSize: 50,
        selectPageSizes: [30, 50, 100],
        sort: 'insert_time',
        order: 'desc'
      },
      multipleSelection: [],
      multipleSelectionAll: [],
      selectData: [],
      currentRow: {},
      instanceId: '',
      instanceName: '',
      isOnlyRead: true,
      reset: false,
      moduleInfo: {},
      columnFilter: {},
      selectColumns: ['ip', 'device_name', 'insert_time', 'update_time'],
      dbFilterData: {},
      checkColumns: [],
      moduleList: [],
      idcTypeList: [],
      podList: [],
      deviceTypeList: []
    }
  },
  watch: {
    moduleCondition (val) {
      this.clean()
      this.moduleInfo.moduleId = val.moduleId
      this.multipleSelectionAll = []
      this.queryInstanceHeader()
      this.queryData()
    },
    bizSystemCondition (val) {
      this.clean()
      this.moduleInfo.moduleId = val.moduleId
      this.queryInstanceHeader()
      this.queryData()
    }
  },
  mounted: function () {
    this.initDict()
    this.queryInstanceHeader()
    this.queryData()
    this.readonlyDatePicker()
    if (!this.moduleInfo.moduleId) {
      this.queryModuleList()
    }
  },
  methods: {
    initDict () {
      this.rbHttp.sendRequest({
        method: 'GET',
        params: { 'type': 'idcType' },
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.idcTypeList = res
      })
      this.rbHttp.sendRequest({
        method: 'GET',
        params: { 'type': 'pod_name' },
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.podList = res
      })
      this.rbHttp.sendRequest({
        method: 'GET',
        params: { 'type': 'device_type' },
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.deviceTypeList = res
      })
    },
    clean () {
      this.display = {
        isImport: false,
        isEdit: false,
        isSearchPlane: false,
        isBatchUpdate: false
      }
      this.labelPosition = 'left'
      this.keyword = ''
      this.formData2 = {
        name: '',
        tag: '',
        insertTime: [],
        updateTime: []
      }
      this.searchFields = []
      this.tableData = []
      this.column_data = {}
      this.columnList = []
      this.paginationData = {
        currentPage: 1,
        total: 0,
        pageSize: 30,
        selectPageSizes: [30, 50, 100],
        sort: 'insert_time',
        order: 'desc'
      }
      this.multipleSelection = []
      this.multipleSelectionAll = []
      this.selectData = []
      this.currentRow = {}
      this.instanceId = ''
      this.instanceName = ''
      this.isOnlyRead = true
      this.reset = false
      this.moduleInfo = {}
      this.columnFilter = {}
      this.selectColumns = ['ip', 'device_name', 'insert_time', 'update_time']
      this.dbFilterData = {}
      this.checkColumns = []
    },
    handleCommand (cammand) {
      this.$router.push({ path: 'add', query: { moduleId: cammand } })
    },
    toDetail (instanceId) {
      if (!this.moduleInfo.moduleId) {
        let _t = this
        rbCmdbServiceFactory.getModuleByInstanceId(instanceId).then((data) => {
          if (data) {
            _t.$router.push({ path: 'detail', query: { moduleId: data.module.id, name: data.module.name, instanceId: instanceId, state: 'detail' } })
          } else {
            _t.$message.error('获取模型数据失败')
          }
        })
      } else {
        this.$router.push({ path: 'add', query: { moduleId: this.moduleInfo.moduleId, instanceId: instanceId } })
      }
    },
    toUpdate (instanceId) {
      if (!this.moduleInfo.moduleId) {
        let _t = this
        rbCmdbServiceFactory.getModuleByInstanceId(instanceId).then((data) => {
          if (data) {
            this.$router.push({ path: 'add', query: { moduleId: data.module.id, instanceId: instanceId, state: 'update' } })
          } else {
            _t.$message.error('获取模型数据失败')
          }
        })
      } else {
        this.$router.push({ path: 'add', query: { moduleId: this.moduleInfo.moduleId, instanceId: instanceId, state: 'update' } })
      }

    },
    showBatchUpdate () {
      this.hideBatchUpdate = true
      this.multipleSelectionAll[this.paginationData.currentPage - 1] = this.multipleSelection
    },
    showSearchPanel () {
      this.hideDetailSearch = true
    },
    setShowDialog (val) {
      switch (val) {
        case 'searchPanel':
          this.hideDetailSearch = false
          break
        case 'batchPanel':
          this.hideBatchUpdate = false
          this.queryData()
      }
    },
    importInstance () {
      this.display.isImport = true
    },
    setImportDisplay (val) {
      this.display.isImport = val
    },
    setSearchFileds (val) {
      this.searchFields = val
      this.toSearchData()
    },
    readonlyDatePicker () {
      if ((!$.support.style) && (!$.support.opacity)) {
        setTimeout(function () {
          $('.el-date-range-picker__time-header input').attr('readonly', 'readonly')
        }, 1000)
      }
    },
    queryInstanceHeader () {
      let _ = this
      rbCmdbServiceFactory.getInstanceHeader(this.moduleInfo.moduleId).then((item) => {
        item.forEach((item2) => {
          if (item2.filedCode !== 'ip' && item2.filedCode !== 'device_name'
            && item2.filedCode !== 'insert_time' && item2.filedCode !== 'update_time') {
            _.checkColumns.push({ 'keyCode': item2.filedCode, 'keyName': item2.filedName })
          }
        })
        _.getColumnFilter()
      }).catch((item) => {
        _.$message.error('获取模型表头失败')
      })
    },
    getColumnFilter () {
      let _ = this
      rbCmdbServiceFactory.getColumnFilter({ menuType: 'CMDB_INSTANCE', moduleId: _.moduleInfo.moduleId || '' }).then((data) => {
        _.dbFilterData = data
        if (data.columnInfo !== null) {
          let ci = JSON.parse(data.columnInfo)
          _.checkColumns.forEach(item => {
            if (ci[item['keyCode']]) {
              _.selectColumns.push(item['keyCode'])
              _.column_data[item['keyCode']] = ci[item['keyCode']]
            }
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    toSearchData () {
      this.paginationData.currentPage = 1
      this.queryData()
    },
    queryData: function () {
      this.$emit('showLoading', '正在查询数据,请稍等...')
      var query_data = {
        'pageNumber': this.paginationData.currentPage,
        'pageSize': this.paginationData.pageSize,
        'queryCondition': this.queryForm,
        'queryType': this.queryType,
        'moduleCondition': this.moduleCondition,
        'columnCondition': this.columnList,
        'bizSystemCondition': this.bizSystemCondition,
        'sortColumn': this.paginationData.sort,
        'sortType': this.paginationData.order
      }
      rbCmdbServiceFactory.getInstanceList(query_data).then((data) => {
        this.paginationData.total = data.totalSize
        this.tableData = data.data
        this.columnList = data.columnList
        if (this.multipleSelectionAll[this.paginationData.currentPage - 1]) {
          this.$nextTick(() => {
            this.multipleSelectionAll[this.paginationData.currentPage - 1].forEach(item => {
              this.tableData.forEach(data => {
                if (data.id === item.id) {
                  this.$refs.table.toggleRowSelection(data, true)
                }
              })
            })
          })
        }
      }).finally(() => {
        this.$emit('hideLoading')
      })
    },
    exportData () {
      var query_data = {
        'queryCondition': this.queryForm,
        'queryType': this.queryType,
        'moduleCondition': this.moduleCondition,
        'columnCondition': this.columnList,
        'bizSystemCondition': this.bizSystemCondition
      }
      this.$emit('showLoading', '正在导出数据,由于数据量较大请耐心等待...')
      rbCmdbServiceFactory.exportInstanceList(query_data).then((data) => {
        let blob = new Blob([data], { type: 'application/msword' })
        // 创建下载链接
        let objectUrl = URL.createObjectURL(blob)
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = 'CI资源列表.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.$emit('hideLoading')
      })
    },
    handleRemoteSort (column, prop, order) {
      this.paginationData.sort = column.prop
      if (column.order === 'ascending') {
        this.paginationData.order = 'asc'
      }
      if (column.order === 'descending') {
        this.paginationData.order = 'desc'
      }
      if (this.paginationData.sort != null && this.paginationData.sort !== '' && this.paginationData.order != null && this.paginationData.order !== '') {
        this.queryData()
      }
    },
    clearAllParam () {
      this.reset = true
      this.queryForm = {
        ip: '',
        deviceName: '',
        idcType: '',
        pod: '',
        room: '',
        deviceType: '',
        deviceModel: ''
      }
      if (this.columnList && this.columnList.length > 0) {
        for (var i = 0; i < this.columnList.length; i++) {
          this.columnList[i].value = ''
        }
      }
      this.searchFields = []
      this.paginationData = {
        currentPage: 1,
        total: 0,
        pageSize: 30,
        selectPageSizes: [30, 50, 100],
        sort: 'insert_time',
        order: 'desc'
      }
      this.queryData()
    },
    handleSizeChange (size) {
      this.paginationData.pageSize = size
      var maxPage = Math.ceil(this.paginationData.total / size)
      if (this.paginationData.currentPage > maxPage) {
        this.paginationData.currentPage = maxPage
      }
      this.queryData()
    },
    handleCurrentChange (val) {
      this.multipleSelectionAll[this.paginationData.currentPage - 1] = this.multipleSelection
      this.paginationData.currentPage = val
      this.queryData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    showColumn (keyCode) {
      if (keyCode === 'ip') {
        return false
      }
      if (keyCode === 'device_name') {
        return false
      }
      if (keyCode === 'insert_time') {
        return false
      }
      if (keyCode === 'update_time') {
        return false
      }
      return this.column_data[keyCode] === true
    },
    addClose () {
      this.queryData()
    },
    closeDialog: function () {
      this.isImport = false
      this.exImport = false
      this.isEdit = false
      this.queryData()
    },
    doubleView: function (row, event) {
      var circleName = row['circleName']
      if (circleName && circleName != null) {
      } else {
        this.currentRow = row
        this.$refs.table.toggleRowSelection(this.currentRow, true)
      }
      this.instanceId = row.id
      this.instanceName = row.name
      this.moduleId = row.moduleId
      this.isOnlyRead = true
    },
    closeView: function () {
    },
    handleCheckedColumnChange (value) {
      this.column_data = {}
      this.checkColumns.forEach((item) => {
        value.forEach((item2) => {
          if (item.keyCode === item2) {
            this.column_data[item2] = true
          }
        })
      })
      let filter = this.dbFilterData
      filter.columnMap = this.column_data
      rbCmdbServiceFactory.updateColumnFilter(filter).then((data) => {
        if (!data.success) {
          this.$notify({
            title: '提示',
            message: data.msg,
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    queryModuleList () {
      let _t = this
      rbCmdbServiceFactory.getModuleTree('').then((data) => {
        _t.moduleList = data
      })
    },
    add () {
      this.$router.push({ path: 'add', query: { moduleId: this.moduleInfo.moduleId, state: 'add' } })
    },
    handleSelect (child) {
      this.$router.push({ path: 'add', query: { moduleId: child.id, state: 'add' } })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .yw-form {
  /deep/ .el-form-item__content {
    .el-input {
      width: 148px;
    }
    .el-select {
      width: 148px;
    }
  }
}
</style>
