<template>
  <div class="components-container yw-dashboard" v-loading="loading" :element-loading-text="loading_text">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="一级部门">
        <el-select v-model="demand.department1"
                   filterable
                   placeholder="请选择一级部门"
                   value-key="id"
                   @change="selectFirstDep($event);getBizSysList($event)">
          <el-option v-for="(item, index) in departmentList1"
                     :key="item.id"
                     :label="item.orgName"
                     :value="item">
          </el-option>
        </el-select>
        <el-select v-model="demand.department2"
                   filterable
                   placeholder="请选择二级部门"
                   value-key="id"
                   @change="getBizSysList($event)">
          <el-option v-for="(item, index) in departmentList2"
                     :key="item.id"
                     :label="item.orgName"
                     :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用系统">
        <el-select v-model="demand.bizSystem"
                   placeholder="请选择">
          <el-option label="请选择"
                     value=""></el-option>
          <el-option v-for="(item,index) in bizSysList"
                     :key="index"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="searchData()">查询</el-button>
        <el-button @click="cancel()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <div class="fr">
          <el-button v-popover:popover
                     type="text"
                     icon="el-icon-d-caret">选择列
          </el-button>
          <el-popover ref="popover"
                      placement="top"
                      trigger="click">
            <div id="popover"
                 style="max-height: 300px;overflow-y: auto;">
              <el-checkbox-group v-model="selectColumns"
                                 @change="handleCheckedColumnChange">
                <div v-for="column in checkColumns">
                  <el-checkbox :label="column.keyCode">{{ column.keyName }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </el-popover>
        </div>
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="add()">新增</el-button>
        <el-button type="text"
                   icon="el-icon-download"
                   @click="importData()">导入</el-button>
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportData()">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  :data="dataList"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 270px)"
                  @row-dblclick="dblhandleCurrentChange($event)">
          <template v-for="(item, index) in tableHeader">
            <el-table-column :label="item.label"
                             width="150"
                             align="center"
                             v-if="showGroup(item.key)">
              <template v-for="(item2, index2) in item.data">
                <el-table-column :prop="item2.key"
                                 :label="item2.label"
                                 :align="showAlign(item2.label)"
                                 width="150"
                                 v-if="showSub(item2.key)"
                                 :show-overflow-tooltip="true" />
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-form>

    <!-- dialog -->
    <importInstances ref="importInstances"
                     v-on:closeParent="closeParent"
                     v-if="display.isImport"
                     :showImport="display.isImport"
                     :importType="importType"></importInstances>
    <!-- dialog -->
  </div>
</template>

<script>
import importInstances from 'src/pages/cmdb/demand/import/import-instance.vue'
import cmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
import demandServiceFactory from 'src/services/cmdb/rb-demand-service.factory.js'
export default {
  components: {
    importInstances
  },
  prop: [],
  data () {
    return {
      loading: false,
      loading_text: '正在查询数据,请稍等...',
      display: {
        isImport: false
      },
      importType: 'demand',
      demand: {
        department: '',
        department1: '',
        department2: '',
        bizSystem: ''
      },
      checkColumns: [], // 所有选择列
      selectColumns: [], // 已选字段
      selectNames: [], // 已选标题
      groupColumns: [],
      columnFilter: {},
      dbFilterData: {},
      currentPage: 1, // 当前页
      pageSize: 100, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      dataList: [],
      tableHeader: [],
      bizSysList: [], // 应用系统
      departmentList1: [], // 部门
      departmentList2: [] // 部门
    }
  },
  mounted () {
    this.getDepartment()
    // this.getBizSysList()
    this.getTableHeader()
  },
  watch: {
    selectColumns: function (val) {
      let _this = this
      let newArr = []
      val.forEach(item => {
        var p_k = _this.getParentKey(item)
        if (newArr.indexOf(p_k) < 0) {
          newArr.push(p_k)
        }
      })
      _this.groupColumns = newArr
      // console.log(_this.groupColumns)
    }
  },
  methods: {
    showAlign (label) {
      if (label.indexOf('是否') > -1) {
        return 'center'
      }
      if (label.indexOf('有无') > -1) {
        return 'center'
      }
      if (label.indexOf('时间') > -1) {
        return 'center'
      }
      if (label.indexOf('配置数量') > -1) {
        return 'center'
      }
      return 'left'
    },
    // 获取父key
    getParentKey (key) {
      let pk = ''
      this.tableHeader.forEach(item => {
        item.data.forEach(item2 => {
          if (item2.key === key) {
            pk = item.key
            return false
          }
        })
      })
      return pk
    },
    // 获取部门
    getDepartment () {
      let _t = this
      demandServiceFactory.getDepartment({ 'pid': '0' }).then((res) => {
        if (res) {
          _t.departmentList1 = []
          _t.departmentList1 = res
        }
      })
    },
    selectFirstDep ($event) {
      let _t = this
      let pid = $event.id
      demandServiceFactory.getDepartment({ 'pid': pid }).then((res) => {
        if (res) {
          _t.departmentList2 = []
          _t.departmentList2 = res
        }
      })
    },
    // 获取业务系统
    getBizSysList ($event) {
      this.demand.bizSystem = ''
      let pid = $event.id
      let obj = {
        'type': 'bizSystem',
        'pid': pid,
        'pValue': '',
        'pType': ''
      }
      demandServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.bizSysList = []
          this.bizSysList = res
        }
      })
    },
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.getTableData()
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableData()
    },
    getTableHeader () {
      let _this = this
      _this.loading = true
      _this.loading_text = '正在查询数据,请稍等...'
      demandServiceFactory.getDemandTableHeader().then((data) => {
        _this.tableHeader = data
        this.tableHeader.forEach(item => {
          item.data.forEach(item2 => {
            _this.checkColumns.push({ keyCode: item2.key, keyName: item2.label })
          })
        })
        this.getColumnFilter()
        this.getTableData()
      }).catch(() => {
        this.$message.error('查询失败')
      })
    },
    getTableData () {
      let _this = this
      let dep1 = _this.demand.department1.orgName !== undefined && _this.demand.department1.orgName !== null && _this.demand.department1.orgName !== ''
      let dep2 = _this.demand.department2.orgName !== undefined && _this.demand.department2.orgName !== null && _this.demand.department2.orgName !== ''
      if (dep1 && dep2) {
        _this.demand.department = _this.demand.department2.orgName
      } else {
        _this.demand.department = _this.demand.department1.orgName
      }
      let params = {
        'pageSize': _this.pageSize,
        'currPage': _this.currentPage,
        'department': _this.demand.department,
        'bizSystem': _this.demand.bizSystem
      }
      this.loading = true
      this.loading_text = '正在查询数据,请稍等...'
      demandServiceFactory.getDemandManager(params).then((data) => {
        _this.dataList = data.dataList
        _this.total = data.total
      }).catch(() => {
        _this.$message.error('查询失败')
      }).finally(() => {
        _this.loading = false
        _this.loading_text = '正在查询数据,请稍等...'
      })
    },
    dblhandleCurrentChange (row) {
      this.$router.push({ path: '/cmdb/demand/detail', query: { demand_id: row.demand_id } })
    },
    // 1.获取选择列表的初始值
    getColumnFilter () {
      let _this = this
      cmdbServiceFactory.getColumnFilter({ menuType: 'CMDB_DEMAND_MANAGER', moduleId: 'demand' }).then((data) => {
        _this.dbFilterData = data
        if (data.columnInfo !== null) {
          let ci = JSON.parse(data.columnInfo)
          _this.checkColumns.forEach(item => {
            if (ci[item['keyCode']]) {
              _this.selectColumns.push(item['keyCode'])
            }
          })
        } else {
          _this.tableHeader.forEach(item => {
            if (item.key === 'basic_') {
              item.data.forEach(item2 => {
                _this.selectColumns.push(item2.key)
              })
            }
          })
        }
      })
    },
    handleCheckedColumnChange (val) {
      let c = {}
      this.checkColumns.forEach(item => {
        let f = false
        val.forEach(item2 => {
          if (item2 === item.keyCode) {
            f = true
            return false
          }
        })
        c[item.keyCode] = f
      })
      this.dbFilterData.columnMap = c
      cmdbServiceFactory.updateColumnFilter(this.dbFilterData).then((data) => { }).catch((data) => {
        this.$message.error('保存选择列失败')
      })
    },
    showSub (key) {
      return this.indexOf(this.selectColumns, key)
    },
    showGroup (key) {
      return this.indexOf(this.groupColumns, key)
    },
    indexOf (arr, key) {
      let f = false
      arr.forEach(item => {
        if (item === key) {
          f = true
          return false
        }
      })
      return f
    },
    searchData () {
      this.getTableData()
    },
    cancel () {
      this.demand.department = ''
      this.demand.department1 = ''
      this.demand.department2 = ''
      this.demand.bizSystem = ''
      this.searchData()
    },
    add () {
      this.$router.push({ path: '/cmdb/demand/add' })
    },
    exportData () {
      let _t = this
      _t.selectNames = []
      _t.selectColumns.forEach(item1 => {
        _t.checkColumns.forEach(item2 => {
          if (item2.keyCode === item1) {
            _t.selectNames.push(item2.keyName)
          }
        })
      })
      if (_t.selectColumns.length < 1) {
        this.$message({
          message: '请至少选择一列展示',
          type: 'warning'
        })
        return
      }
      let params = {
        'department': _t.demand.department,
        'bizSystem': _t.demand.bizSystem,
        'keys': _t.selectColumns,
        'headers': _t.selectNames
      }
      // console.log(params)
      _t.loading = true
      _t.loading_text = '正在导出数据,请稍等...'
      demandServiceFactory.exportGridData(params).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '需求收集数据列表.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        _t.loading = false
        _t.loading_text = '正在查询数据,请稍等...'
      })
    },
    importData () {
      // this.dialogVisible3 = true
      // this.tableDataFile = []
      let _this = this
      _this.display.isImport = true
    },
    closeParent () {
      let _this = this
      _this.display.isImport = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
