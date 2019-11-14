<template>
  <div>
    <div class="component-container">
      <div>
        <el-button type="text" @click="showCreate()">
          <i class="el-icon-plus"></i>审批通过
        </el-button>
        <el-button type="text" @click="deleteCode()">
          <i class="el-icon-delete"></i>审批驳回
        </el-button>
      </div>
      <div>
        <el-table :data="changeList" border row-key="codeId" height="calc(100vh - 250px)"
                  @row-dblclick="dblhandleCurrentChange($event)" @selection-change="handleSelectionChange"
                  style="width: 100%;margin-top:5px;cursor: pointer;" stripe tooltip-effect="dark" border>
          <el-table-column type="selection" min-width="20px" align="center" :selectable="selectable"></el-table-column>
          <el-table-column prop="instance.ip" label="管理IP地址" sortable min-width="120px" fixed></el-table-column>
          <el-table-column prop="cmdbCode.filedName" label="配置项" sortable min-width="120px" fixed></el-table-column>
          <el-table-column prop="oldValue" label="原始值" sortable min-width="100px"></el-table-column>
          <el-table-column prop="currValue" sortable label="变更值" min-width="100px"></el-table-column>
          <el-table-column prop="operaterType" sortable label="变更类型" min-width="120px"></el-table-column>
          <el-table-column prop="operator" sortable label="申请人" min-width="120px"></el-table-column>
          <el-table-column prop="operatorTime" sortable label="申请时间" min-width="120px" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" style="padding: 10px;"
                       :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :total="total"
                       layout="total, sizes, prev, pager, next, jumper" align='right'>
        </el-pagination>
      </div>
    </div>
    <!--<code-edit v-if="edit.display" :display="edit.display" @setEditDisplay="setEditDisplay" :codeId="edit.codeId"></code-edit>-->
  </div>

</template>

<script>
  // import codeEdit from '../edit/edit'
  import cmdbCodeService from 'src/services/cmdb/rb-cmdb-code-services.factory'
  import cmdbDictService from 'src/services/cmdb/rb-configDict-service.factory'
  export default {
    // components: {codeEdit},
    data () {
      return {
        query: {
          codeCode: '',
          codeName: '',
          codeGroup: ''
        },
        groupList: [],
        currentPage: 1, // 当前页
        pageSize: 20, // 分页每页多少行数据
        pageSizes: [20, 50, 100], // 每页多少行数组
        total: 0, // 总共多少行数据
        edit: {
          display: false,
          codeId: ''
        },
        changeList: [],
        selectCode: []
      }
    },
    mounted () {
      this.getDistinctDictType()
    },
    watch: {
    },
    methods: {
      setEditDisplay (val) {
        this.edit.display = val
        this.queryCodeList()
      },
      showCreate () {
        this.edit = {
          display: true,
          codeId: ''
        }
      },
      deleteCode () {
        if (this.selectCode.length === 0) {
          this.$message.error('请选择需要删除的码表记录')
          return false
        }
        let _t = this
        this.$confirm('确认要删除选中的码表吗?').then(() => {
          _t.showFullScreenLoading()
          cmdbCodeService.deleteCode(this.selectCode).then((item) => {
            _t.$message.success('删除成功')
            _t.queryCodeList()
            _t.loading.close()
          }).catch((item) => {
            _t.$message.error('查询码表信息失败')
            _t.loading.close()
          })
        })
      },
      searchData () {
        this.currentPage = 1
        this.queryCodeList()
      },
      queryCodeList () {
        let _t = this
        this.showFullScreenLoading()
        let queryObject = this.query
        queryObject.limitStart = (this.currentPage - 1) * this.pageSize
        queryObject.limitEnd = this.currentPage * this.pageSize
        cmdbCodeService.queryCodeList(queryObject).then((data) => {
          _t.codeList = data.data
          _t.total = data.totalSize
          _t.loading.close()
        }).catch((data) => {
          _t.$message.error('查询码表信息失败')
          _t.loading.close()
        })
      },
      // 分页改变尺寸
      handleSizeChange (val) {
        this.pageSize = val
        this.queryCodeList()
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.queryCodeList()
      },
      dblhandleCurrentChange (rowData) {
        this.edit = {
          display: true,
          codeId: rowData.codeId
        }
      },
      handleSelectionChange (val) {
        this.selectCode = val
      },
      queryCodeGroupList () {
        let _t = this
        cmdbCodeService.queryCodeGroupList().then((data) => {
          _t.groupList = data
        }).catch((data) => {
          _t.$message.error('获取码表分组失败')
        })
      },
      getDistinctDictType () {
        cmdbDictService.getDistinctDictType().then((data) => {
          data.forEach(item => {
            this.$set(this.dictList, item.col_name, item.description)
          })
          this.queryCodeGroupList()
          this.queryCodeList()
        }).catch((data) => {
          this.$message.error('获取字典列表失败')
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @keyframes myfirst {
    0% {
      left: 100%;
      top: 0px;
    }
    100% {
      left: 55%;
      top: 0px;
    }
  }
  .right-dialog {
    width: 45%;
    height: 100%;
    left: 55%;
    animation: myfirst 0.8s;
    top: 0%;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    box-sizing: border-box;
  }
  .dialog-fade-leave-active {
    animation: dialog-fade-out .3s
  }
  .row-bg {
    padding: 1px 0;
    background-color: #f9fafc;
  }
  .button-box {
    margin-top: 20px;
    .el-button {
      color: #409EFF;
      width: 80px;
      border-radius: 15px;
    }
  }
  /deep/ .el-table {
    .el-table__body-wrapper {
      overflow-x: auto !important;
    }
  }
  /deep/ .el-table td,/deep/ .el-table th {
    padding: 1px 0;
  }
  * ::-webkit-scrollbar {
    height: 6px !important;
  }
  /deep/ .el-row {
    margin-bottom: 0 !important;
  }
</style>
