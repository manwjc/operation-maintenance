<template>
  <div v-loading="loading">
    <el-form class="yw-form" >
      <el-form class="components-condition yw-form"
               :inline="true"
               label-width="100px"
               v-model="queryForm">
        <el-form-item label="本地端口">
          <el-input v-model="queryForm.aPortId"></el-input>
        </el-form-item>
        <el-form-item label="对端IP">
          <el-input v-model="queryForm.zInstanceIp"></el-input>
          <!--<el-select v-model="queryForm.procDefKey" clearable filterable>-->
            <!--<el-option v-for="(item, index) in procTypeList"-->
              <!--:key="index"-->
              <!--:label="item.flow_name"-->
              <!--:value="item.flow_key">-->
            <!--</el-option>-->
          <!--</el-select>-->
        </el-form-item>
        <el-form-item label="对端端口">
          <el-input v-model="queryForm.zPortId"></el-input>
        </el-form-item>
        <section class="btn-wrap">
          <el-button type="primary"
                     @click="getPortRelationList">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </section>
      </el-form>
      <el-form class="yw-form">
        <div class="table-operate-wrap clearfix">
          <el-button type="text"
                     icon="el-icon-plus"
                     @click="showAddDialog">新增</el-button>
          <el-button type="text"
                     icon="el-icon-download"
                     @click="importInstance()">导入</el-button>
        </div>
        <div class="yw-el-table-wrap">
          <el-table :data="tableData"
                    class="yw-el-table"
                    stripe
                    tooltip-effect="dark"
                    border
                    height="calc(100vh - 302px)">
            <el-table-column
              label="本地端口"
              prop="aPortId">
            </el-table-column>
            <el-table-column
              label="对端资源池"
              prop="zInstance.idcType">
            </el-table-column>
            <el-table-column
              label="对端设备IP">
              <template slot-scope="scope">
                <el-button type="text" @click="toDetail(scope.row.zInstance)">{{scope.row.zInstance.ip}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="对端设备名称">
              <template slot-scope="scope">
                <el-button type="text" @click="toDetail(scope.row.zInstance)">{{scope.row.zInstance.deviceName}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="对端设备端口"
              prop="zPortId">
            </el-table-column>
            <el-table-column
              label="连接属性"
              prop="connectType">
            </el-table-column>
            <el-table-column
              label="描述"
              prop="remark"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              label="操作"
              width="60px">
              <template slot-scope="scope">
                <i
                  style="font-size: 16px;color:#409EFF;cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteById(scope.row.id)"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div class="yw-page-wrap">
        <YwPagination @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="pageSizes"
                      :page-size="pageSize"
                      :total="total"></YwPagination>
      </div>
    </el-form>
    <AddDialog :dialogMsg="dialogMsg"
               :instanceId="instanceId"
               @reload="getPortRelationList"
               v-if="dialogMsg.showDialog"></AddDialog>
    <YwImport ref="importInstances"
              v-if="importData.isImport"
              :showImport="importData.isImport"
              :instanceId="instanceId"
              @setImportDisplay="setImportDisplay"
              :importType="importData.importType"></YwImport>
  </div>
</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  export default {
    components: {
      YwPagination: () => import('src/components/common/yw-pagination.vue'),
      AddDialog: () => import('src/pages/resource/iframe/detail/addDialog.vue'),
      YwImport: () => import('src/components/common/yw-import.vue')
    },
    props:[
      'deviceId'
    ],
    data () {
      return {
        tableData: [],  //所有关联设备
        queryForm: {},
        currentPage: 1, // 当前页
        pageSize: 50, // 分页每页多少行数据
        pageSizes: [10, 20, 50, 100], // 每页多少行数组
        total: 0, // 总共多少行数据
        instanceId: this.deviceId ? this.deviceId : this.$route.query.instanceId,
        loading: false,
        importData: {
          isImport: false,
          importType: 'portRelation'
        },
        dialogMsg: {
          dialogTitle: '新增关联设备端口',
          showDialog: false
        }
      }
    },
    mounted () {
      this.getPortRelationList()
    },
    methods: {
      toDetail (instance) {
        this.$router.push({ path: 'detail', query: { moduleId:instance.moduleId, instanceId: instance.id, state: 'detail' } })
      },
      deleteById(id) {
        let data = {
          id: id
        }
        this.$confirm('此操作将删除关联信息，确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rbCmdbServiceFactory.deleteInstnacePortRelation(data).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.getPortRelationList()
            } else {
              this.$message.error(res.message)
            }
          })
        })
      },
      importInstance () {
        this.importData.isImport = true
      },
      // 重置查询条件
      resetForm () {
        this.queryForm = {}
        this.getPortRelationList()
      },
      showAddDialog () {
        this.dialogMsg.showDialog = true
      },
      // 导入弹窗
      setImportDisplay (val) {
        this.importData.isImport = val
        this.getPortRelationList()
      },
      // 分页改变尺寸
      handleSizeChange (val) {
        this.pageSize = val
        this.getPortRelationList()
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.getPortRelationList()
      },
      getPortRelationList () {
        this.loading = true
        let data = {
          aInstanceId: this.instanceId,
          aPortId: this.queryForm.aPortId,
          zInstanceIp: this.queryForm.zInstanceIp,
          zPortId: this.queryForm.zPortId,
          pageNo: this.currentPage,
          pageSize: this.pageSize
        }
        rbCmdbServiceFactory.getInstnacePortRelationList(data).then((res) => {
          this.loading = false
          this.total = res.totalSize
          this.tableData = res.data
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
