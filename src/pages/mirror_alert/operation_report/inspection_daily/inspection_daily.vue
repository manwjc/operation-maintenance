<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="资源池">
        <el-select v-model="idcType"
                   placeholder="请选择"
                   filterable>
          <el-option v-for="item in resourcePoors"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="pod">
        <el-select v-model="pod"
                   placeholder="请选择"
                   filterable
                   clearable
                   filterable>
          <el-option v-for="item in podList"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工程期数">
        <el-input v-model="projectName"
                  placeholder="请输入内容"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="设备分类">
        <el-select v-model="deviceStr"
                   placeholder="请选择"
                   clearable
                   @change="deviceChange">
          <el-option label=""
                     :value="deviceStr">
            <el-tree :data="deviceTreeData"
                     :props="defaultProps"
                     @node-click="handleDeviceNodeClick"
                     node-key="id"
                     :default-expanded-keys="[1]"></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备厂家">
        <el-select v-model="deviceMfrs"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="(item, index) in deviceMfrsList"
                     :key="index"
                     :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备型号">
        <el-input v-model="deviceModel"
                  placeholder="请输入内容"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="巡检时间">
        <el-date-picker v-model="inspectionDate"
                        type="date"
                        placeholder="选择日"
                        value-format="yyyy-MM-dd"
                        :clearable="false"></el-date-picker>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="doSearch()">查询</el-button>
        <el-button @click="reset()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportData">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  @selection-change="handleSelectionChange"
                  @sort-change="sortChange"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 300px)">
          <el-table-column prop="projectName"
                           sortable='custom'
                           label="工程期数"
                           width="100px">
          </el-table-column>
          <el-table-column prop="podName"
                           sortable='custom'
                           label="POD"
                           width="100px">
          </el-table-column>
          <el-table-column prop="deviceClass"
                           sortable='custom'
                           label="设备大类"
                           width="100px">
          </el-table-column>
          <el-table-column prop="deviceType"
                           sortable='custom'
                           label="设备小类"
                           width="100px">
          </el-table-column>
          <el-table-column prop="companeyName"
                           sortable='custom'
                           label="设备厂家"
                           width="100px">
          </el-table-column>
          <el-table-column prop="deviceModel"
                           sortable='custom'
                           label="设备型号"
                           width="100px">
          </el-table-column>
          <el-table-column prop="count"
                           sortable='custom'
                           label="设备数量"
                           width="100px">
          </el-table-column>
          <el-table-column prop="impCount"
                           sortable='custom'
                           label="重大">
            <template slot-scope="scope">
              <span v-if="!scope.row.impCount">0</span>
              <span v-else>{{scope.row.impCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="highCount"
                           label="高"
                           sortable='custom'>
            <template slot-scope="scope">
              <span v-if="!scope.row.highCount">0</span>
              <span v-else>{{scope.row.highCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="middCount"
                           sortable='custom'
                           label="中">
            <template slot-scope="scope">
              <span v-if="!scope.row.middCount">0</span>
              <span v-else>{{scope.row.middCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lowCount"
                           label="低"
                           sortable='custom'>
            <template slot-scope="scope">
              <span v-if="!scope.row.lowCount">0</span>
              <span v-else>{{scope.row.lowCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="alertCount"
                           sortable='custom'
                           label="告警总数"
                           min-width="100px">
            <template slot-scope="scope">
              <span v-if="!scope.row.alertCount">0</span>
              <span v-else>{{scope.row.alertCount}}</span>
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
  </div>

</template>

<script>
import moment from 'moment'
import rbAlertServicesFactory from 'src/services/alert/rb-alert-services.factory.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
export default {
  name: '/mirror_alert/operation_report/inspection_daily',
  data () {
    return {
      resourcePoors: [],
      podList: [],
      orderName: '',
      order: '',
      curdDate: '',
      inspectionDate: '',
      deviceMfrs: '',
      deviceMfrsList: [],
      deviceTreeData: [],
      deviceModel: '',
      deviceStr: '',
      deviceType: '',
      deviceClass: '',
      pod: '',
      projectName: '',
      idcType: '',
      tableData: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [30, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted () {
    this.curdDate = moment(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD')
    this.inspectionDate = this.curdDate
    this.initDict()
  },
  methods: {
    sortChange (column) {
      if (column.column === null || column.column === undefined || column.column === 'null') {
        this.orderName = ''
        this.order = ''
      } else {
        let valName = column.prop
        if (valName === 'projectName') {
          valName = 'project_name'
        }
        if (valName === 'podName') {
          valName = 'pod_name'
        }
        if (valName === 'deviceClass') {
          valName = 'device_class'
        }
        if (valName === 'deviceType') {
          valName = 'device_type'
        }
        if (valName === 'companeyName') {
          valName = 'device_mfrs'
        }
        if (valName === 'deviceModel') {
          valName = 'device_model'
        }

        this.orderName = valName
        if (column.order.indexOf('desc') !== -1) {
          this.order = 'desc'
        } else {
          this.order = 'asc'
        }
      }
      this.doSearch()
    },
    deviceChange (value) {
      if (!value) {
        this.deviceStr = ''
        this.deviceClass = ''
        this.deviceType = ''
      }
    },
    initDict () {
      let obj = {
        'type': 'device_mfrs',
        'pid': '',
        'pValue': '',
        'pType': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.deviceMfrsList = res
        }
      })
        let obj1 = {
            'type': 'pod_name',
            'pid': '',
            'pValue': '',
            'pType': ''
        }
      rbProjectDataServiceFactory.getConfigDictByType(obj1).then((res) => {
          if (res) {
              this.podList = res
          }
      })
        let obj2 = {
            'type': 'idcType',
            'pid': '',
            'pValue': '',
            'pType': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj2).then((res) => {
            if (res) {
                this.resourcePoors = res
                this.setDefaultIdc()
            }
            this.search()
        })

      let device = {
        label: '设备分类视图',
        children: [],
        key: 0
      }
      this.deviceTreeData.push(device)
      rbProjectDataServiceFactory.getDeviceTypes().then((res) => {
        if (res) {
          res.forEach(item => {
            let obj = {}
            obj.id = 1
            obj.key = 1
            obj.p = ''
            obj.label = item.name
            if (item.subList.length > 0) {
              obj.children = []
              item.subList.forEach(item1 => {
                let obj1 = {}
                obj1.label = item1.name
                obj1.key = 2
                obj1.p = item.name
                obj.children.push(obj1)
              })
            }
            this.deviceTreeData[0].children.push(obj)
          })
          this.$forceUpdate()
        }
      })
    },
    setDefaultIdc () {
      if (this.resourcePoors && this.resourcePoors.length>0) {
          this.idcType = this.resourcePoors[0].value
          this.$forceUpdate()
      }
    },
    handleDeviceNodeClick (data) {
      let key = data.key
      if (key === 1) {
        this.deviceStr = data.label
        this.deviceClass = data.label
      }
      if (key === 2) {
        this.deviceStr = data.p + '-' + data.label
        this.deviceClass = data.p
        this.deviceType = data.label
      }
    },
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.search()
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.search()
    },
    reset () {
      this.inspectionDate = this.curdDate
      this.deviceMfrs = ''
      this.deviceModel = ''
      this.idcType = ''
      this.idcType = ''
      this.projectName = ''
      this.pod = ''
      this.deviceStr = ''
      this.deviceClass = ''
      this.deviceType = ''
      this.setDefaultIdc()
    },
    doSearch () {
      this.currentPage = 1
      this.search()
    },
    search () {
      // this.idcType = '信息港资源池'
      if (this.idcType === '') {
        this.$message.info('请选择资源池')
        return
      }
      let page = {
        page_no: this.currentPage,
        page_size: this.pageSize,
        inspectionDate: this.inspectionDate,
        deviceMfrs: this.deviceMfrs,
        idcType: this.idcType,
        deviceModel: this.deviceModel,
        deviceType: this.deviceType,
        deviceClass: this.deviceClass,
        projectName: this.projectName,
        pod: this.pod,
        sortName: this.orderName,
        order: this.order
      }
      rbAlertServicesFactory.getInspectionDaily(page).then((res) => {
        this.tableData = res.result
        this.total = res.count
      }).catch(() => {
        this.$message.error('查询失败')
      })
    },
    // 导出
    exportData () {
      // idcType: '私有云二期资源池',
      let page = {
        page_no: this.currentPage,
        page_size: this.pageSize,
        inspectionDate: this.inspectionDate,
        deviceMfrs: this.deviceMfrs,
        idcType: this.idcType,
        deviceModel: this.deviceModel,
        deviceType: this.deviceType,
        deviceClass: this.deviceClass,
        projectName: this.projectName,
        pod: this.pod,
        orderName: this.orderName,
        order: this.order
      }
      rbAlertServicesFactory.exportData(page).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '巡检日报.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

