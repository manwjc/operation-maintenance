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
      <el-form-item label="POD项目">
        <el-select v-model="pod_name"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="item in pod_nameList"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备分类">
        <el-select v-model="device_class"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="item in device_classList"
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
                  height="calc(100vh - 270px)">
          <el-table-column label="资源池"
                           prop="idc_type"></el-table-column>
          <el-table-column label="POD项目"
                           prop="pod_name"></el-table-column>
          <el-table-column label="设备分类"
                           prop="device_class"
                           width="150"></el-table-column>
          <el-table-column label="品牌"
                           prop="device_mfrs"
                           width="150"></el-table-column>
          <el-table-column label="设备数量"
                           width="150" prop="number"></el-table-column>

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
      idc_typeList: [],
      pod_nameList: [],
      device_classList: [],
      device_mfrsList: [],
      idc_type: '',
      pod_name: '',
      device_class: '',
      device_mfrs: '',
      tableData: [],
      currentPage: '',
      loading: false,
      loading_text: '正在查询数据,请稍等...'
    }
  },
  mounted () {
    this.getidcTypeList()
    this.getpodNameList()
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
        'pod_name': this.pod_name,
        'device_class': this.device_class,
        'device_mfrs': this.device_mfrs
      }
      rbdeviceStatisticServiceFactory.selectDeviceByidcTypeDeviceType(obj).then((res) => {
        this.tableData = res
      }).finally(() => {
        this.loading = false
        this.loading_text = '正在查询数据,请稍等...'
      })
    },
    resetSearch () {
      this.idc_type = ''
      this.pod_name = ''
      this.device_class = ''
      this.device_mfrs = ''
      this.reloadTable()
    },
    exportExcelData () {
      var obj = {
        'idc_type': this.idc_type,
        'pod_name': this.pod_name,
        'device_class': this.device_class,
        'device_mfrs': this.device_mfrs
      }
      this.loading = true
      this.loading_text = '正在导出数据,请稍等...'
      rbdeviceStatisticServiceFactory.downloadDeviceByidcTypeDeviceType(obj).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '各资源池各类型的数量统计.xlsx'
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
    getpodNameList () {
      var obj = {
        type: 'pod_name'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.pod_nameList = res
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
