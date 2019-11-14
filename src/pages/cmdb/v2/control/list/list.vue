<template>
  <div class="components-container yw-dashboard" v-loading="loading" :element-loading-text="loading_text">
    <el-form class="components-condition yw-form" :inline="true" label-width="60px" v-model="query">
      <el-form-item label="控件编码">
        <el-input v-model="query.controlCode" placeholder="请输入编码"></el-input >
      </el-form-item>
      <el-form-item label="控件名称">
        <el-input v-model="query.controlName" placeholder="请输入名称"></el-input >
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary" @click="searchData()">查询</el-button>
      </section>
    </el-form>
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text" icon="el-icon-plus" @click="create()">新增</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="controlList" row-key="codeId" ref="table"
                  class="yw-el-table"
                  stripe tooltip-effect="dark" border height="calc(100vh - 270px)">
          <el-table-column prop="controlCode" label="编码" sortable width='150px'></el-table-column>
          <el-table-column prop="controlName" label="显示名称" sortable></el-table-column>
          <el-table-column prop="isBindSource" label="是否需要绑定数据源" width="150px" align="center"></el-table-column>
          <el-table-column prop="sortIndex" label="排序" width="80px" align="center"></el-table-column>
          <el-table-column align="center" label="操作" width="80px" fixed="right">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text" title="修改" icon="el-icon-edit" @click="editControl(scope.row)"></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <YwPagination @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :current-page="currentPage"
                      :page-sizes="pageSizes" :page-size="50" :total="total"></YwPagination>
      </div>
    </el-form>
    <control-edit v-if="edit.display" :display="edit.display" @setDisplay="setDisplay" :controlId="edit.controlId"></control-edit>
  </div>
</template>

<script>
  import controlEdit from '../edit/edit.vue'
  import cmdbCodeService from 'src/services/cmdb/rb-cmdb-code-services.factory'
  export default {
    components: {
      YwPagination: () => import('src/components/common/yw-pagination.vue'),
      controlEdit},
    data () {
      return {
        loading: false,
        loading_text: '正在加载数据...',
        show: true,
        query: {
          controlCode: '',
          controlName: ''
        },
        edit: {
          display: false,
          controlId: ''
        },
        dictList: [],
        controlList: [],
        selectControls: [],
      }
    },
    mounted () {
      this.queryControlList()
    },
    watch: {
    },
    methods: {
      setDisplay (val) {
        this.edit.display = val
        this.queryControlList()
      },
      queryControlList () {
        let _t = this
        this.loading = true
        cmdbCodeService.queryCodeControl(this.query).then((data) => {
          _t.controlList = data
        }).catch((data) => {
          _t.$message.error('查询控件列表错误')
        }).finally(() => {
          this.loading = false
        })
      },
      searchData () {
        this.queryControlList()
      },
      create () {
        this.edit = {
          display: true,
          controlId: ''
        }
      },
      editControl (rowData) {
        this.edit = {
          display: true,
          controlId: rowData.controlId
        }
      },
      handleSelectionChange (val) {
        this.selectControls = val
      },
      deleteControl () {
        if (this.selectControls.length === 0) {
          this.$message.error('请选择需要删除的控件记录')
          return false
        }
        let _t = this
        this.$confirm('确认要删除选中的控件吗?').then(() => {
          this.loading = true
          cmdbCodeService.deleteControl(this.selectControls).then((item) => {
            _t.$message.success('删除成功')
            _t.queryControlList()
          }).catch((item) => {
            _t.$message.error('删除失败' + item)
          }).finally(() => {
            this.loading = false
          })
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
