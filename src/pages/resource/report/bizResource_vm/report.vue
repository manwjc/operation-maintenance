<template>
  <div class="component-container yw-dashboard" v-loading="loading" :element-loading-text="loading_text">
    <!-- 检索条件 -->
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="归属部门">
        <el-select v-model="search_department1"
                   clearable
                   filterable
                   placeholder="请选择一级部门"
                   value-key="id"
                   @change="selectFirstDep($event);getBizSysList($event)">
          <el-option v-for="(item, index) in departmentList1"
                     :key="item.id"
                     :label="item.orgName"
                     :value="item"></el-option>
        </el-select>
        <el-select v-model="search_department2"
                   clearable
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
      <el-form-item label="业务系统">
        <el-select v-model="search_bizSystem" placeholder="请选择">
          <el-option
            v-for="(item,index) in bizSysList"
            :key="index"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源池">
        <el-select v-model="search_idcType"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="(item,index) in idcTypeList"
                     :key="index"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="startDate"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月" style="width: 130px"
          :picker-options="startMonthOption">
        </el-date-picker> 至
        <el-date-picker
          v-model="endDate"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月" style="width: 130px"
          :picker-options="endMonthOption">
        </el-date-picker>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="cancel()">重置</el-button>
      </section>
    </el-form>
    <!--<div>-->
      <!--<el-row style="padding: 0 0 10px 0;">-->
        <!--<el-col :span="8">-->
          <!--<div style="width: 550px">-->
            <!--<span style="padding-right: 5px">归属部门</span>-->
            <!--<span>-->
              <!--<el-select v-model="search_department1" placeholder="请选择一级部门" clearable filterable value-key="id" @change="selectFirstDep($event);getBizSysList($event)" style="width: 130px">-->
                <!--<el-option-->
                        <!--v-for="(item, index) in departmentList1"-->
                        <!--:key="item.id"-->
                        <!--:label="item.orgName"-->
                        <!--:value="item">-->
                <!--</el-option>-->
              <!--</el-select>-->
              <!--<el-select v-model="search_department2" placeholder="请选择二级部门" clearable filterable value-key="id" @change="getBizSysList($event)" style="width: 130px">-->
                <!--<el-option-->
                        <!--v-for="(item, index) in departmentList2"-->
                        <!--:key="item.id"-->
                        <!--:label="item.orgName"-->
                        <!--:value="item">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</span>-->
          <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
          <!--<div style="width: 550px">-->
            <!--<span style="padding-right: 5px">业务系统</span>-->
            <!--<span>-->
              <!--<el-select v-model="search_bizSystem" placeholder="请选择" clearable filterable>-->
                <!--<el-option-->
                        <!--v-for="(item,index) in bizSysList"-->
                        <!--:key="index"-->
                        <!--:label="item.name"-->
                        <!--:value="item.name">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</span>-->
          <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
          <!--<div style="width: 550px">-->
            <!--<span style="padding-right: 5px">资源池</span>-->
            <!--<span>-->
              <!--<el-select v-model="search_idcType" placeholder="请选择" clearable filterable>-->
                <!--<el-option-->
                        <!--v-for="(item,index) in idcTypeList"-->
                        <!--:key="index"-->
                        <!--:label="item.name"-->
                        <!--:value="item.name">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</span>-->
          <!--</div>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row style="padding: 0 0 10px 0;">-->
        <!--<el-col :span="8">-->
          <!--<div style="width: 550px">-->
            <!--<span style="padding-right: 5px">时间</span>-->
            <!--<span>-->
              <!--<el-date-picker-->
                      <!--v-model="startDate"-->
                      <!--type="date"-->
                      <!--format="yyyy-MM-dd"-->
                      <!--value-format="yyyy-MM-dd"-->
                      <!--placeholder="选择月" style="width: 130px"-->
                      <!--:picker-options="startMonthOption">-->
              <!--</el-date-picker> 至-->
              <!--<el-date-picker-->
                      <!--v-model="endDate"-->
                      <!--type="date"-->
                      <!--format="yyyy-MM-dd"-->
                      <!--value-format="yyyy-MM-dd"-->
                      <!--placeholder="选择月" style="width: 130px"-->
                      <!--:picker-options="endMonthOption">-->
              <!--</el-date-picker>-->
            <!--</span>-->
          <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="16">-->
          <!--<div style="width: 550px;">-->
            <!--<el-button type="primary"  size="mini" plain @click="search">查询</el-button>-->
            <!--<el-button type="primary"  size="mini" plain @click="cancel">重置</el-button>-->
            <!--<el-button type="primary"  size="mini" plain @click="importData">导入</el-button>-->
            <!--<el-button type="primary"  size="mini" plain @click="exportData">导出</el-button>-->
          <!--</div>-->
        <!--</el-col>-->
      <!--</el-row>-->
    <!--</div>-->
    <!-- 数据展示 -->
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-download"
                   @click="importData">导入</el-button>
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportData">导出</el-button>
      </div>
    </el-form>

    <div class="yw-el-table-wrap">
      <el-table :data="tableData"
                class="yw-el-table"
                border
                stripe
                tooltip-effect="dark"
                height="calc(100vh - 300px)">
        <el-table-column prop="bizSystem" label="业务系统名称" width="150px" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="department1" label="归属一级部门" width="150px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="department2" label="归属二级部门" width="150px" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="idcType" label="所属资源池" width="150px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="podName" label="POD名称" width="150px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="totalPlannedApplication" label="计划申请总量（台）" width="150px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="totalAllocatedEquipment" label="已分配设备总量（台）" width="150px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="vcpu" label="虚拟核数vCPU（个）" width="150px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="totalMemory" label="总内存（G）" width="150px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="deliveryCycle" label="交付周期（天）" width="150px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="deliveryRatio" label="交付比例（%）" width="150px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="日期" width="150px" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </div>
    <YwPagination @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="pageSizes"
                  :page-size="pageSize"
                  :total="total"></YwPagination>
    <!--导入功能-->
    <YwImport ref="importInstances"
              v-if="display.isImport"
              :showImport="display.isImport"
              @setImportDisplay="closeParent"
              :importType="importType"></YwImport>
  </div>
</template>

<script>
    import bizResReportService from 'src/services/cmdb/rb-bizResReport-service.factory.js'
    import demandServiceFactory from 'src/services/cmdb/rb-demand-service.factory.js'
    export default {
      components: {
        YwPagination: () => import('src/components/common/yw-pagination.vue'),
        YwImport: () => import('src/components/common/yw-import.vue')
      },
      data () {
        return {
          display: {
            isImport: false
          },
          loading: false,
          loading_text: '正在查询数据,请稍等...',
          importType: 'bizresourcevm',
          currentPage: 1, // 当前页
          pageSize: 50, // 分页每页多少行数据
          pageSizes: [10, 20, 50, 100], // 每页多少行数组
          total: 0, // 总共多少行数据
          search_bizSystem: '',
          search_idcType: '',
          search_department1: '',
          search_department2: '',
          startDate: this.formatter(new Date(), 'yyyy-MM'),
          endDate: '',
          tableData: [],
          bizSysList: [],
          idcTypeList: [],
          departmentList1: [],
          departmentList2: [],
          startMonthOption: {
            disabledDate: time => {
              let dateVal = this.endDate
              if (dateVal) {
                return time.getTime() > new Date(dateVal).getTime()
              }
            }
          },
          endMonthOption: {
            disabledDate: time => {
              let dateVal = this.startDate
              if (dateVal) {
                return time.getTime() < new Date(dateVal).getTime() - 1 * 24 * 60 * 60 * 1000
              }
            }
          }
        }
      },
      mounted () {
        this.getDepartment()
        // this.getBizSysList()
        this.getIdcTypeList()
        this.search()
      },
      methods: {
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
        search () {
          this.loading = true
          let param = {
            'pageNum': this.currentPage,
            'pageSize': this.pageSize,
            'bizSystem': this.search_bizSystem,
            'idcType': this.search_idcType,
            'deviceType': '虚拟机',
            'department1': this.search_department1.orgName,
            'department2': this.search_department2.orgName,
            'createTime1': this.startDate,
            'createTime2': this.endDate
          }
          bizResReportService.listByPage(param).then((res) => {
            this.loading = false
            this.total = res.count
            this.tableData = res.data
          }).finally(() => {
            this.loading = true
          })
        },
        cancel () {
          this.search_department1 = ''
          this.search_department2 = ''
          this.search_bizSystem = ''
          this.search_idcType = ''
          this.startDate = ''
          this.endDate = ''
          this.search()
        },
        exportData () {
          let param = {
            'bizSystem': this.search_bizSystem,
            'idcType': this.search_idcType,
            'deviceType': '虚拟机',
            'department1': this.search_department1.orgName,
            'department2': this.search_department1.orgName,
            'createTime1': this.startDate,
            'createTime2': this.endDate
          }
          bizResReportService.exportGridData(param).then((res) => {
            let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
            let objectUrl = URL.createObjectURL(blob)
            // window.location.href = objectUrl
            let downLoadElement = document.createElement('a')
            downLoadElement.href = objectUrl
            downLoadElement.download = '业务虚拟资源使用率分析报表.xls'
            document.body.appendChild(downLoadElement)
            downLoadElement.click()
            document.body.removeChild(downLoadElement)
            URL.revokeObjectURL(objectUrl)
          })
        },
        // 获取部门
        getDepartment () {
          demandServiceFactory.getDepartment({'pid': '0'}).then((res) => {
            if (res) {
              this.departmentList1 = res
            }
          })
        },
        selectFirstDep ($event) {
          let pid = $event.id
          this.search_department2 = ''
          demandServiceFactory.getDepartment({'pid': pid}).then((res) => {
            if (res) {
              this.departmentList2 = res
            }
          })
        },
        // 获取业务系统
        getBizSysList ($event) {
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
        // 获取资源池
        getIdcTypeList () {
          let obj = {
            'type': 'idcType',
            'pid': '',
            'pValue': '',
            'pType': ''
          }
          demandServiceFactory.getConfigDictByType(obj).then((res) => {
            if (res) {
              this.idcTypeList = []
              this.idcTypeList = res
            }
          })
        },
        importData () {
          let _this = this
          _this.display.isImport = true
        },
        closeParent () {
          let _this = this
          _this.display.isImport = false
          this.search()
        },
        formatter (thistime, fmt) {
          let $this = thistime
          let o = {
            'M+': $this.getMonth() + 1,
            'd+': $this.getDate(),
            'h+': $this.getHours(),
            'm+': $this.getMinutes(),
            's+': $this.getSeconds(),
            'q+': Math.floor(($this.getMonth() + 3) / 3),
            'S': $this.getMilliseconds()
          }
          if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ($this.getFullYear() + '').substr(4 - RegExp.$1.length))
          }
          for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
          }
          return fmt
        }
      }
    }
</script>

<style lang="scss" scoped>
  /*/deep/ .el-table {*/
    /*.el-table__body-wrapper {*/
      /*overflow-x: auto  ;*/
    /*}*/
  /*}*/

  /** ::-webkit-scrollbar {*/
    /*height: 6px !important;*/
  /*}*/

  /*/deep/ .el-table td,/deep/.el-table th {*/
    /*padding: 1px 0;*/
  /*}*/
</style>
