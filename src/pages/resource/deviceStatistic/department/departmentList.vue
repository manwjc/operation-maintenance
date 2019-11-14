<template>
  <div class="components-container yw-dashboard" v-loading="loading" :element-loading-text="loading_text">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="65px">
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
                   placeholder="请选择"
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
      <el-form-item label="品牌">
        <el-select v-model="device_mfrs"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="item in device_mfrsList"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
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
                  show-summary
                  :summary-method="getSummaries"
                  border
                  height="calc(100vh - 300px)">
          <el-table-column label="资源池"
                           prop="idc_type"
                           width="150"></el-table-column>
          <el-table-column label="一级部门"
                           prop="department1"
                           width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="二级部门"
                           prop="department2"
                           width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="业务系统"
                           prop="biz_system" show-overflow-tooltip></el-table-column>
          <el-table-column label="设备分类"
                           prop="device_class"
                           width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="设备类型"
                           prop="device_type"
                           width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="品牌"
                           prop="device_mfrs"
                           width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="设备数量"
                           prop="number" fixed="right" width="100"></el-table-column>

        </el-table>
      </div>
      <!-- <div class="yw-page-wrap">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div> -->
    </el-form>

    <!-- dialog -->

    <!-- dialog -->
  </div>

</template>

<script>
import configDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
import rbdeviceStatisticServiceFactory from 'src/services/cmdb/rb-deviceStatistic-services.factory.js'
export default {
  data () {
    return {
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
      tableData: [],
      currentPage: '',
      loading: false,
      loading_text: '正在查询数据,请稍等...'
    }
  },
  mounted () {
    this.getidcTypeList()
    this.getdepartment1List()
    this.getdeviceClassList()
    this.getdeviceMfrsList()
    this.reloadTable()
  },
  methods: {
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.some(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    reloadTable (num) {
      if (num !== 1) {
        // 搜索前将当前页置为1
        this.currentPage = 1
      }
      this.getPageData()
    },
    getPageData () {
      this.loading = true
      var obj = {
        'idc_type': this.idc_type,
        'department1': this.department1,
        'department2': this.department2,
        'biz_system': this.biz_system,
        'device_class': this.device_class,
        'device_type': this.device_type,
        'device_mfrs': this.device_mfrs
      }
      rbdeviceStatisticServiceFactory.selectDeviceByDepartment(obj).then((res) => {
        this.tableData = res
      }).catch(() => {
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
        'device_mfrs': this.device_mfrs
      }
      this.loading = true
      this.loading_text = '正在导出数据,请稍等...'
      rbdeviceStatisticServiceFactory.downloadDeviceByDepartment(obj).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '各归属部门各分类数量统计.xlsx'
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
