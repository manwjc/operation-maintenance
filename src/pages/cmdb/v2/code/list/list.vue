<template>
  <div class="components-container yw-dashboard"
       v-loading="loading"
       :element-loading-text="loading_text">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px"
             v-model="query">
      <el-form-item label="码表编码">
        <el-input v-model="query.codeCode"
                  placeholder="请输入编码"></el-input>
      </el-form-item>
      <el-form-item label="码表名称">
        <el-input v-model="query.codeName"
                  placeholder="请输入码表名称"></el-input>
      </el-form-item>
      <el-form-item label="码表分组">
        <el-select clearable
                   v-model="query.codeGroup"
                   placeholder="请选择字段分组"
                   filterable>
          <el-option v-for="(item, index) in groupList"
                     :key="index"
                     :label="item"
                     :value="item"></el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="searchData()">查询</el-button>
      </section>
    </el-form>
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="showCreate()">新增</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="codeList"
                  row-key="codeId"
                  ref="table"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 270px)">
          <!--<el-table-column type="selection" min-width="20px" align="center" :selectable="selectable"></el-table-column>-->
          <el-table-column prop="filedCode"
                           label="字段编码"
                           sortable
                           min-width="120px"
                           fixed
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="filedName"
                           label="字段名称"
                           sortable
                           min-width="120px"
                           fixed
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="codeGroup"
                           label="字段分组"
                           sortable
                           min-width="100px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="controlType.controlName"
                           sortable
                           label="控件类型"
                           min-width="100px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="refCode.filedName"
                           sortable
                           label="引用码表名称"
                           min-width="120px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bindSourceType"
                           sortable
                           label="数据源类型"
                           min-width="120px"
                           :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="bindSource"
                           sortable
                           label="绑定数据源"
                           min-width="120px"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.bindSourceType === '数据字典' ? dictList[scope.row.bindSource] : scope.row.bindSource}}
            </template>
          </el-table-column>
          <el-table-column prop="codeLength"
                           label="字段长度"
                           min-width="100px"></el-table-column>
          <el-table-column prop="codeTip"
                           label="字段提示信息"
                           min-width="100px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="isBuiltIn"
                           label="是否内置"
                           min-width="100px"></el-table-column>
          <el-table-column prop="isRequire"
                           label="是否必填"
                           min-width="100px"></el-table-column>
          <el-table-column prop="isCollect"
                           label="是否支持采集"
                           min-width="100px"></el-table-column>
          <el-table-column prop="collectSource"
                           label="采集数据来源"
                           min-width="100px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="collectMapperKey"
                           label="映射采集字段"
                           min-width="100px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="collectMapperKey"
                           label="操作"
                           min-width="80px"
                           fixed="right">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           title="修改"
                           icon="el-icon-edit"
                           @click="editCode(scope.row)"></el-button>
                <el-button type="text"
                           v-if="scope.row.isBuiltIn !== '是'"
                           title="删除"
                           icon="el-icon-delete"
                           @click="deleteCode(scope.row)"></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <YwPagination @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="pageSizes"
                      :page-size="pageSize"
                      :total="total"></YwPagination>
      </div>
    </el-form>
    <code-edit v-if="edit.display"
               :display="edit.display"
               @setEditDisplay="setEditDisplay"
               :codeId="edit.codeId"
               @showLoading="showLoading"
               @hideLoading="hideLoading"></code-edit>
  </div>
</template>

<script>
import cmdbCodeService from 'src/services/cmdb/rb-cmdb-code-services.factory'
import cmdbDictService from 'src/services/cmdb/rb-configDict-service.factory'
export default {
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    codeEdit: () => import('../edit/edit')
  },
  data () {
    return {
      query: {
        codeCode: '',
        codeName: '',
        codeGroup: ''
      },
      groupList: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      edit: {
        display: false,
        codeId: ''
      },
      selectCode: [],
      loading: false,
      loading_text: '正在加载数据...',
      codeList: [],
      dictList: {}
    }
  },
  mounted () {
    this.getDistinctDictType()
  },
  watch: {
  },
  methods: {
    showLoading () {
      this.loading = true
    },
    hideLoading () {
      this.loading = false
    },
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
    deleteCode (row) {
      let _t = this
      this.$confirm('确认要删除选中的码表吗?').then(() => {
        _t.loading = true
        let arry = []
        arry.push(row)
        cmdbCodeService.deleteCode(arry).then((item) => {
          _t.$message.success('删除成功')
          _t.queryCodeList()
        }).catch((item) => {
          _t.$message.error('查询码表信息失败')
        }).finally(() => {
          _t.loading = false
        })
      })
    },
    searchData () {
      this.currentPage = 1
      this.queryCodeList()
    },
    queryCodeList () {
      let _t = this
      this.loading = true
      let queryObject = this.query
      queryObject.limitStart = (this.currentPage - 1) * this.pageSize
      queryObject.limitEnd = this.currentPage * this.pageSize
      cmdbCodeService.queryCodeList(queryObject).then((data) => {
        _t.codeList = data.data
        _t.total = data.totalSize
      }).catch((data) => {
        _t.$message.error('查询码表信息失败')
      }).finally(() => {
        this.loading = false
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
    editCode (rowData) {
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
/deep/ .components-condition {
  padding-right: 66px;
}
</style>
