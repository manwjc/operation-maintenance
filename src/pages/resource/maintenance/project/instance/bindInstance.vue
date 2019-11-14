<template>
  <el-dialog class="yw-dialog" 
             width="1000px" top="10vh" title="已关联设备"
             @close="handleClosed"
             :visible.sync="dialogMsg.dialogVisible">
    <!-- 查询条件开始 -->
    <!--<section class="yw-dialog-main">-->
      <el-form class="yw-form components-condition" :inline="true" :model="queryData" label-width="80px">
        <el-form-item label="设备序列号">
          <el-input v-model="queryData.deviceSn" placeholder="请输入设备序列号"></el-input>
          <el-button type="primary" plain @click="query()">查询</el-button>
        </el-form-item>
      </el-form>
    <div class="table-operate-wrap clearfix">
      <el-button  type="text" icon="el-icon-plus" @click="createBindInstance">新增关联</el-button>
      <el-button  type="text" icon="el-icon-delete" @click="removeBindInstance">移除关联</el-button>
    </div>
    <div class="yw-el-table-wrap">
      <el-table class="yw-el-table"
                :data="bindData" height="300px" v-loading="loading" stripe border size="mini"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" min-width="20px" align="center" fixed="left" ></el-table-column>
        <el-table-column label="设备序列号" align="left" min-width="120" prop="deviceSn" fixed="left" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="设备名称" align="left" min-width="120" prop="deviceName" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="设备IP" align="left" min-width="120" prop="ip" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="资源池" align="left" min-width="80" prop="idcType" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="一级部门" align="left" min-width="100" prop="department1" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="二级部门" align="left" min-width="100" prop="department2" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="业务系统" align="left" min-width="120" prop="bizSystem" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <YwPagination @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :current-page="currentPage"
                    :page-sizes="pageSizes" :page-size="pageSize" :total="total"></YwPagination>
    </div>

  </el-dialog>
</template>

<script>
  import QueryObject from 'src/utils/queryObject.js'
  export default {
    props: ['dialogMsg'],
    mixins: [QueryObject],
    components: {
      YwPagination: () => import('src/components/common/yw-pagination.vue')
    },
    data () {
      return {
        queryData: {
          deviceSn: ''
        },
        bindData: [],
        //查询条件
        queryParams: {
        },
        selectDeviceDialog: {
          dialogVisible: false,
          data: {}
        },
        selectDeviceSn: [],
        loading: false
      }
    },
    watch: {
      dialogMsg: {
        handler (value, oldValue) {
          this.query()
        },
        deep: true
      }
    },
    created () {
    },
    mounted () {
      this.query()
    },
    methods: {
      handleClosed(){
        this.$emit("setCloseHandler", true)
      },
      // 设置参数
      setQueryParams (activePagination) {
        if (activePagination) {
          this.queryParams['pageNo'] = this.currentPage;
          this.queryParams['pageSize'] = this.pageSize;
        } else {
          this.queryParams = {
            'pageNo': this.currentPage,
            'pageSize': this.staticPageSize,
            'deviceSn': this.queryData.deviceSn,
            'projectId': this.dialogMsg.data.id
          }
        }
      },
      /**查询
       * activePagination:分页活动下保持先前的查询条件
       */
      query (activePagination = false) {
        this.setQueryParams(activePagination);
        this.loading = true
        this.rbHttp.sendRequest({
          method: 'POST',
          url: `/v1/cmdb/maintenance/project/listBindInstance`,
          data: this.queryParams
        }).then((res) => {
          this.total = res.totalSize;
          this.bindData = res.data;
          return res
        }).finally(() => {
          this.loading = false;
        });
      },
      handleSelectionChange (val) {
        this.selectDeviceSn = val
      },
      createBindInstance () {
        this.dialogMsg.dialogVisible = false
        this.$emit("setShowSelectDialog", true)
        this.$emit("setShowSelectProjectId", this.dialogMsg.data)
      },
      removeBindInstance () {
        if (this.selectDeviceSn.length !== 1) {
          this.$message.error('请选择一个需要移除的设备序列号, 不支持批量删除操作.')
          return false
        }
        const _t = this
        this.$confirm('确认要移除选中的设备序列号吗?').then(() => {
          this.rbHttp.sendRequest({
            method: 'DELETE',
            url: `/v1/cmdb/maintenance/project/removeBindInstance?project_id=${this.dialogMsg.data.id}`,
            params: {project_instance_id: this.selectDeviceSn[0].id}
          }).then((res) => {
            if (res && res.flag === 'success') {
              this.$message.success('删除成功')
              _t.query()
            } else if (res && res.flag === 'error') {
              this.$message.error(res.msg)
            } else {
              this.$message.error('删除失败')
            }
          })
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
