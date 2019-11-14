<template>
  <div class="components-container yw-dashboard"
       v-loading="loading"
       :element-loading-text="loading_text">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="资源池">
        <el-select v-model="idc_type"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="item in idc_typeList"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="一级部门">
        <el-select v-model="department1"
                   @change="changeDepartment2List(department1)"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="item in department1List"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级部门">
        <el-select v-model="department2"
                   @change="changebizSystemList(department2)"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="item in department2List"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务系统">
        <el-select v-model="biz_system"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="item in biz_systemList"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备分类">
        <el-select v-model="device_class"
                   @change="changeDeviceTypeList(device_class)"
                   clearable
                   filterable>
          <el-option v-for="item in device_classList"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select v-model="device_type"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="item in device_typeList"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="begin_date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期"></el-date-picker> -
        <el-date-picker v-model="end_date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="reloadTable()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportExcelData">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 305px)">
          <el-table-column type="selection"
                           fixed
                           width="50"> </el-table-column>
          <el-table-column label="资源池"
                           prop="idcType"
                           min-width="100"></el-table-column>
          <el-table-column label="一级部门"
                           prop="department1"
                           min-width="100"></el-table-column>
          <el-table-column label="二级部门"
                           prop="department2"
                           min-width="100"></el-table-column>
          <el-table-column label="业务系统"
                           prop="bizSystem"
                           min-width="200"></el-table-column>
          <el-table-column label="设备分类"
                           prop="deviceClass"
                           min-width="100"></el-table-column>
          <el-table-column label="设备类型"
                           prop="deviceType"
                           min-width="100"></el-table-column>
          <el-table-column label="变更设备数量"
                           prop="number"
                           min-width="100"></el-table-column>
        </el-table>
      </div>
    </el-form>
  </div>
</template>

<script>
import configDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
import rbdeviceStatisticServiceFactory from 'src/services/cmdb/rb-deviceStatistic-services.factory.js'
export default {
  data () {
    return {
      loading: false,
      loading_text: '正在查询数据,请稍等...',
      idc_typeList: [],
      department1List: [],
      department2List: [],
      biz_systemList: [],
      device_classList: [],
      device_typeList: [],
      device_mfrsList: [],
      idc_type: '',
      department1: '',
      department2: '',
      biz_system: '',
      device_class: '',
      device_type: '',
      device_mfrs: '',
      begin_date: '',
      end_date: '',
      tableData: [],
      currentPage: ''
    }
  },
  mounted () {
    this.getidcTypeList()
    this.getdepartment1List()
    // this.getdepartment2List()
    // this.getbizSystemList()
    this.getdeviceClassList()
    // this.getdeviceTypeList()
    this.getdeviceMfrsList()
    this.reloadTable()
  },
  methods: {
    reloadTable (num) {
      if (num !== 1) {
        // 搜索前将当前页置为1
        this.currentPage = 1
      }
      this.getPageData()
    },
    getPageData () {
      var obj = {
        'idc_type': this.idc_type,
        'department1': this.department1,
        'department2': this.department2,
        'biz_system': this.biz_system,
        'device_class': this.device_class,
        'device_type': this.device_type,
        'device_mfrs': this.device_mfrs,
        'begin_date': this.begin_date,
        'end_date': this.end_date
      }
      this.loading = true
      this.loading_text = '正在查询数据,请稍等...'
      rbdeviceStatisticServiceFactory.selectConfigureChange(obj).then((res) => {
        this.tableData = res
      }).finally(() => {
        this.loading = false
        this.loading_text = '正在查询数据,请稍等...'
      })
    },
    resetSearch () {
      this.idc_type = ''
      this.department1 = ''
      this.department2 = ''
      this.biz_system = ''
      this.device_class = ''
      this.device_type = ''
      this.device_mfrs = ''
      this.begin_date = ''
      this.end_date = ''
      this.reloadTable()
    },
    exportExcelData () {
      var obj = {
        'idc_type': this.idc_type,
        'department1': this.department1,
        'department2': this.department2,
        'biz_system': this.biz_system,
        'device_class': this.device_class,
        'device_type': this.device_type,
        'device_mfrs': this.device_mfrs,
        'begin_date': this.begin_date,
        'end_date': this.end_date
      }
      this.loading = true
      this.loading_text = '正在导出数据,请稍等...'
      rbdeviceStatisticServiceFactory.downloadConfigureChange(obj).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '配置项变更统计统计.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.loading = false
        this.loading_text = '正在查询数据,请稍等...'
      })
    },
    getidcTypeList () {
      var obj = {
        type: 'idcType'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.idc_typeList = res
      })
    },
    getdepartment1List () {
      var obj = {
        type: 'department1'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.department1List = res
      })
    },
    changeDepartment2List (name) {
      let obj01 = this.department1List.find((item) => {
        return item.name === name
      })
      var obj = {
        type: 'department2',
        pType: 'department1',
        pid: obj01.id
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.department2List = res
      })
      var biz = {
        type: 'bizSystem',
        pType: 'department1',
        pid: obj01.id
      }
      configDictServiceFactory.getDictsByType(biz).then((res) => {
        this.biz_systemList = res
      })
    },
    getdepartment2List () {
      var obj = {
        type: 'department2'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.department2List = res
      })
    },
    changebizSystemList (name) {
      let obj01 = this.department2List.find((item) => {
        return item.name === name
      })
      var obj = {
        type: 'bizSystem',
        pType: 'department2',
        pid: obj01.id
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.biz_systemList = res
      })
    },
    getbizSystemList () {
      var obj = {
        type: 'bizSystem'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.biz_systemList = res
      })
    },
    getdeviceClassList () {
      var obj = {
        type: 'device_class'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.device_classList = res
      })
    },
    changeDeviceTypeList (name) {
      let obj01 = this.device_classList.find((item) => {
        return item.name === name
      })
      var obj = {
        type: 'device_type',
        pType: 'device_class',
        pid: obj01.id
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.device_typeList = res
      })
    },
    getdeviceTypeList () {
      var obj = {
        type: 'device_type'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.device_typeList = res
      })
    },
    getdeviceMfrsList () {
      var obj = {
        type: 'device_mfrs'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.device_mfrsList = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
