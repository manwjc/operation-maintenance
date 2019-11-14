<template>
  <div class="component-container" v-loading="loading">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="75px">
      <el-form-item label="IP地址">
        <el-input v-model="condition.ip"></el-input>
      </el-form-item>
      <el-form-item label="资源池">
        <el-select v-model="condition.idcType" clearable>
          <el-option
            v-for="(item, index) in idcTypeList"
            :key="index"
            :value="item.value"
            :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select v-model="condition.deviceType" clearable>
          <el-option
            v-for="(item, index) in deviceTypes"
            :key="index"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据来源">
        <el-select v-model="condition.dataFrom" clearable>
          <el-option
            v-for="(item, index) in dataForm"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态">
        <el-select v-model="condition.handleStatus" clearable>
          <el-option
            v-for="(item, index) in handleStatus"
            :key="index"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="cancel()">重置</el-button>
      </section>
    </el-form>
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportData()">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData" class="yw-el-table" stripe tooltip-effect="dark" border
                  height="calc(100vh - 300px)">
          <el-table-column label="IP地址" prop="ip" min-width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="资源池" prop="idcType" min-width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="设备类型" prop="deviceType" min-width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="数据来源" prop="dataFrom" min-width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="处理状态" prop="handleStatus" min-width="100"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.handleStatus === 0 ? '待处理' : scope.row.handleStatus === 1 ? '已维护' : '已屏蔽'}}
            </template>
          </el-table-column>
          <el-table-column label="提交人" prop="commitUser" min-width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="提交时间" prop="commitTime" min-width="100"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.commitTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="处理人" prop="handleUser" min-width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="处理时间" prop="handleTime" min-width="100"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.handleTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" min-width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text" title="维护" icon="el-icon-circle-check" @click="update(scope.row)"></el-button>
                <el-button type="text" title="屏蔽" icon="el-icon-circle-close" @click="shield(scope.row)"></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageInfo.currentPage"
                       :page-sizes="pageInfo.pageSizes"
                       :page-size="pageInfo.pageSize"
                       :total="pageInfo.total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-form>
  </div>

</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  import rbConfigServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'

  export default {
    // name: 'list'
    components: {},
    data () {
      return {
        loading: false,
        condition: {},
        pageInfo: {
          currentPage: 1, // 当前页
          pageSize: 50, // 分页每页多少行数据
          pageSizes: [10, 20, 50, 100], // 每页多少行数组
          total: 0, // 总共多少行数据
        },
        idcTypeList: [],
        deviceTypes: [],
        tableData: [],
        dataForm: ['监控上报', '自动采集', '苏研数据'],
        handleStatus: [
          {name: '未处理', value: 0},
          {name: '已处理', value: 1},
          {name: '已屏蔽', value: 2}
        ]
      }
    },
    mounted () {
      this.getIdcTypList()
      this.getDeviceType()
      this.getUnknownList()
    },
    methods: {
      update (row) {
        let data = {
          id: row.id,
          handleStatus: 1
        }
        rbCmdbServiceFactory.updateCollectUnknown(data).then((res) => {
          if (res.success) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
          this.search()
        })
      },
      search() {
        this.condition.currentPage = 1
        this.getUnknownList()

      },
      cancel () {
        this.condition = {}
      },
      exportData () {
        rbCmdbServiceFactory.exportCollectUnknown(this.condition).then((res) => {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          let objectUrl = URL.createObjectURL(blob)
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = '未知设备表.xlsx'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
      },
      getIdcTypList () {
        rbCmdbServiceFactory.getDictsByType({ 'type': 'idcType' }).then((res) => {
          this.idcTypeList = res
        })
      },
      getDeviceType () {
        rbCmdbServiceFactory.getDictsByType({'type': 'device_type' }).then((res) => {
          this.deviceTypes = res
        })
      },
      getUnknownList () {
        this.loading = true
        this.tableData = []
        this.condition['pageSize'] = this.pageInfo.pageSize
        this.condition['pageNum'] = this.pageInfo.currentPage
        rbCmdbServiceFactory.getCollectUnknownList(this.condition).then((res) => {
          this.tableData = res.data
          this.pageInfo.total = res.count
        }).finally(() => {
          this.loading = false
        })
      },
      // 分页改变尺寸
      handleSizeChange (val) {
        this.condition.pageSize = val
        this.search()
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.condition.currentPage = val
        this.search()
      },
    }
  }
</script>

<style scoped>

</style>
