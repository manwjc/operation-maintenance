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
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="reloadTable()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form"
             :inline="true">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-download"
                   @click="showImportDialog">导入</el-button>
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportExcelData(1)">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  show-summary
                  :summary-method="getSummaries"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 275px)">
          <el-table-column type="selection"
                           fixed
                           width="50"> </el-table-column>
          <el-table-column label="id"
                           prop="id"
                           width="80"
                           v-if="false"></el-table-column>
          <el-table-column label="资源池"
                           prop="idc_type"
                           width="150"></el-table-column>
          <el-table-column label="一级部门"
                           prop="department1"
                           width="150"></el-table-column>
          <el-table-column label="二级部门"
                           prop="department2"
                           width="150"></el-table-column>
          <el-table-column label="业务系统"
                           prop="biz_system"
                           width="150"></el-table-column>
          <el-table-column label="POD项目"
                           prop="pod_name"
                           width="150"></el-table-column>
          <el-table-column label="物理计算资源(台)"
                           prop="physical_number"
                           width="100"></el-table-column>
          <el-table-column label="虚拟计算资源(台)"
                           prop="virtual_number"
                           width="100"></el-table-column>
          <el-table-column label="计划资源回收/清理时间"
                           prop="plan_time"
                           width="100"></el-table-column>
          <el-table-column label="实际资源回收/清理时间"
                           prop="reality_time"
                           width="100"></el-table-column>

        </el-table>
      </div>
    </el-form>

    <YwImport ref="importInstances"
              v-if="ifshowImportDialog"
              :showImport="ifshowImportDialog"
              @setImportDisplay="setImportDisplay"
              :importType="'invalidresource'"></YwImport>
    <!-- dialog -->
    <!--<el-dialog :visible.sync="ifshowImportDialog"-->
               <!--width="40%"-->
               <!--center-->
               <!--:close-on-click-modal="false">-->

      <!--<div>-->
        <!--<label style="font-size:15px">导入低效无效资源统计</label>-->

      <!--</div>-->
      <!--<div style="margin-top: 20px;margin-bottom: 30px "-->
           <!--align="center">-->
        <!--<el-upload class="upload-demo"-->
                   <!--drag-->
                   <!--:headers="headers"-->
                   <!--action="/v1/cmdb/invalidResource/uploadInvalidResource"-->
                   <!--:on-success="handleSuccess"-->
                   <!--multiple-->
                   <!--:limit="3">-->
          <!--<i class="el-icon-upload"></i>-->
          <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->

        <!--</el-upload>-->
        <!--<div style="margin-top: 30px; "-->
             <!--align="center">-->
          <!--<el-button type="primary"-->
                     <!--@click="exportExcelData(0)">还没有Excel模版?请下载模版</el-button>-->
        <!--</div>-->
      <!--</div>-->

    <!--</el-dialog>-->
  </div>
</template>

<script>
import configDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
import rbdeviceStatisticServiceFactory from 'src/services/cmdb/rb-deviceStatistic-services.factory.js'

export default {
  components: {
    YwImport: () => import('src/components/common/yw-import.vue')
  },
  data () {
    return {
      loading: false,
      loading_text: '正在查询数据,请稍等...',
      idc_typeList: [],
      department1List: [],
      department2List: [],
      biz_systemList: [],
      pod_nameList: [],
      idc_type: '',
      department1: '',
      department2: '',
      biz_system: '',
      pod_name: '',
      tableData: [],
      ifshowImportDialog: false,
      currentPage: '',
      headers: {
        // 'Content-Type': 'multipart/form-data;charset=utf-8'
      }
    }
  },
  mounted () {
    this.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
    this.headers.head_orgAccount = sessionStorage.getItem('namespace')
    this.headers.head_userName = sessionStorage.getItem('username')
    this.headers.head_isAdmin = sessionStorage.getItem('isAdmin')
    this.getidcTypeList()
    this.getdepartment1List()
    // this.getdepartment2List()
    // this.getbizSystemList()
    this.getpodNameList()
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
    // 导入弹窗
    setImportDisplay (val) {
      this.ifshowImportDialog = val
      this.reloadTable()
    },
    getPageData () {
      this.loading = true
      var obj = {
        'idc_type': this.idc_type,
        'department1': this.department1,
        'department2': this.department2,
        'biz_system': this.biz_system,
        'pod_name': this.pod_name
      }
      rbdeviceStatisticServiceFactory.selectInvalidResource(obj).then((res) => {
        this.loading = false
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
      this.pod_name = ''
      this.reloadTable()
    },
    exportExcelData (model) {
      var obj = {
        'idc_type': this.idc_type,
        'department1': this.department1,
        'department2': this.department2,
        'biz_system': this.biz_system,
        'pod_name': this.pod_name
      }
      var getobj = {
        'model': model
      }
      this.loading = true
      this.loading_text = '正在导出数据,请稍等...'
      rbdeviceStatisticServiceFactory.downloadInvalidResource(obj, getobj).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '低效无效资源统计.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.loading = false
        this.loading_text = '正在查询数据,请稍等...'
      })
    },
    showImportDialog () {
      this.ifshowImportDialog = true
    },
    handleSuccess (response, file, fileList) {
      // const self = this
      if (response.success === true) {
        this.$message.success('导入成功')
        this.reloadTable()
      } else {
        this.$message.error(response.message)

      }
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
    getpodNameList () {
      var obj = {
        type: 'pod_name'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.pod_nameList = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
