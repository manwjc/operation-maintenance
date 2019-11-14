<template>
  <el-container class="components-container"
                v-loading="loading"
                :element-loading-text="loading_text">
    <el-aside class="yw-dashboard"
              width="260px">
      <section class="search-wrap">
        <el-input placeholder="输入部门名称过滤"
                  v-model="filterText">
        </el-input>
        <el-button type="text"
                   icon="el-icon-refresh"
                   @click="refresh()"></el-button>
      </section>
      <el-scrollbar class="aside-main"
                    style="height: calc(100% - 60px)">
        <el-tree class="filter-tree"
                 :data="treeData"
                 :props="defaultProps"
                 :filter-node-method="filterNode"
                 node-key="uuid"
                 @node-click="handleNodeClick"
                 ref="tree2"
                 accordion>
          <span class="custom-tree-node"
                slot-scope="{ node, data }">
            <span>
              <i :class="data.icon"></i> {{ node.label }}
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </el-aside>
    <el-main class="yw-dashboard">
      <el-form class="components-condition yw-form"
               :inline="true"
               label-width="60px">
        <el-form-item label="组织名称">
          <el-input v-model="search_orgName"
                    placeholder="请输入组织名称"></el-input>
        </el-form-item>
        <el-form-item label="组织类型">
          <el-select v-model="search_orgType"
                     placeholder="请选择组织类型"
                     clearable>
            <el-option v-for="item in orgTypeList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <section class="btn-wrap">
          <el-button type="primary"
                     @click="search()">查询</el-button>
          <el-button @click="cancel('searchHander')">重置</el-button>
        </section>
      </el-form>
      <el-form class="yw-form">
        <div class="table-operate-wrap clearfix">
          <el-button type="text"
                     icon="el-icon-plus"
                     @click="addCard()">新增</el-button>
          <el-button type="text"
                     icon="el-icon-download"
                     @click="editCard()">修改</el-button>
          <el-button type="text"
                     icon="el-icon-delete"
                     @click="deleteCard()">删除</el-button>
        </div>
        <div class="yw-el-table-wrap">
          <el-table :data="orgManagerData"
                    row-key="id"
                    ref="table"
                    @selection-change="handleSelectionChange"
                    class="yw-el-table"
                    stripe
                    tooltip-effect="dark"
                    border
                    height="calc(100vh - 260px)">
            <el-table-column type="selection"
                             width="40"></el-table-column>
            <el-table-column prop="orgName"
                             label="组织名称"
                             align="center"
                             width="150px"
                             :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="orgType"
                             label="组织类型"
                             align="center"
                             width="150px"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="remark"
                             label="备注"
                             align="center"
                             :show-overflow-tooltip="true"></el-table-column>
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
    </el-main>
    <el-dialog :visible.sync="addDialog"
               width="500px"
               class="yw-dialog"
               title="新增组织">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :model="addForm"
                 :rules="addRules"
                 ref="addForm"
                 label-width="80px">
          <el-form-item label="上级组织"
                        prop="pid">
            <el-select v-model="addForm.pid"
                       placeholder="请选择上级组织"
                       filterable>
              <el-option v-for="item in allOrgManagerList"
                         :key="item.id"
                         :label="item.orgName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织名称"
                        prop="addOrgName">
            <el-input v-model="addForm.addOrgName"></el-input>
          </el-form-item>
          <el-form-item label="组织类型"
                        prop="addOrgType">
            <el-select v-model="addForm.addOrgType"
                       placeholder="请选择">
              <el-option v-for="item in orgTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注"
                        prop="addRemark">
            <el-input type="textarea"
                      :rows="2"
                      v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="saveAddForm('addForm')">确 定</el-button>
        <el-button type="primary"
                   @click="cancel('add')">取 消</el-button>
      </section>
    </el-dialog>

    <!-- update -->
    <el-dialog :visible.sync="updateDialog"
               width="500px"
               class="yw-dialog"
               title="编辑组织">
      <section class="yw-dialog-main">
        <el-form :model="updateForm"
                 class="yw-form is-required"
                 :rules="updateRules"
                 ref="updateForm"
                 label-width="80px">
          <el-form-item label="上级组织"
                        prop="pid">
            <el-select v-model="updateForm.pid"
                       placeholder="请选择上级组织"
                       filterable>
              <el-option v-for="item in allOrgManagerList"
                         :key="item.id"
                         :label="item.orgName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织名称"
                        prop="updateOrgName">
            <el-input v-model="updateForm.updateOrgName"></el-input>
          </el-form-item>
          <el-form-item label="组织类型"
                        prop="updateOrgType">
            <el-select v-model="updateForm.updateOrgType"
                       placeholder="请选择">
              <el-option v-for="item in orgTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注"
                        prop="updateRemark">
            <el-input type="textarea"
                      :rows="2"
                      v-model="updateForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="saveEditForm('updateForm')">确 定</el-button>
        <el-button type="primary"
                   @click="cancel('update')">取 消</el-button>
      </section>
    </el-dialog>
  </el-container>
</template>

<script>
import orgManagerService from 'src/services/cmdb/rb-orgManager-service.factory.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
export default {
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue')
  },
  data () {
    return {
      loading: false,
      loading_text: '正在加载数据...',
      parentOrgList: [],
      orgTypeList: [],
      allOrgManagerList: [],
      currentPage: 1, // 当前页
      pageSize: 100, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      search_orgName: '',
      search_orgType: '',
      treeData: [],
      orgManagerData: [],
      addDialog: false,
      addForm: {
        id: '',
        pid: '',
        addOrgName: '',
        addOrgType: '',
        remark: ''
      },
      addRules: {
        pid: [
          { required: true, message: '请选择上级组织', trigger: 'change' }
        ],
        addOrgName: [
          { required: true, message: '请输入组织名称', trigger: 'blur' }
        ],
        addOrgType: [
          { required: true, message: '请选择组织类型', trigger: 'change' }
        ]
      },
      updateDialog: false,
      updateForm: {
        id: '',
        pid: '',
        updateOrgName: '',
        updateOrgType: '',
        remark: ''
      },
      updateRules: {
        updateOrgName: [
          { required: true, message: '请输入组织名称', trigger: 'blur' }
        ],
        updateOrgType: [
          { required: true, message: '请选择组织类型', trigger: 'change' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'orgName'
      },
      level: '',
      selectedObj: {},
      selectedParentData: {},
      multipleSelection: []
    }
  },
  mounted () {
    this.loading = true
    this.loadAllOrg()
    this.loadOrgTree()
    this.loadOrgTypes()
    this.search()
  },
  methods: {
    addCard () {
      this.addDialog = true
      this.addForm = {
        id: '',
        pid: '',
        addOrgName: '',
        addOrgType: '',
        remark: ''
      }
    },
    editCard () {
      if (this.multipleSelection.length !== 1) {
        this.$message.error('请选择一条需要修改的组织')
        return false
      }
      this.updateDialog = true
      this.loading = false
      orgManagerService.getById({ 'id': this.multipleSelection[0].id }).then((res) => {
        this.updateForm.id = res.id
        this.updateForm.pid = res.pid
        this.updateForm.updateOrgName = res.orgName
        this.updateForm.updateOrgType = res.orgType
        this.updateForm.remark = res.remark
      }).finally(() => {
        this.loading = false
      })
    },
    deleteCard () {
      if (this.multipleSelection.length !== 1) {
        this.$message.error('请选择一条需要删除的组织, 不支持批量操作')
        return false
      }
      this.$confirm('此操作将删除本组织及其子组织，确认删除吗？').then(() => {
        let _t = this
        let param = { 'id': _t.multipleSelection[0].id }
        this.loading = true
        orgManagerService.deleteById(param).then((res) => {
          if (res === 'success') {
            this.loadOrgTree()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.search()
          } else {
            this.$message.error('删除失败')
          }
        }).finally(() => {
          this.loading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleNodeClick (data, node, vuecomponent) {
      let _t = this
      _t.search_pid = data.id
      this.search_orgName = ''
      this.search_orgType = ''
      let param = {
        'pageNum': this.currentPage,
        'pageSize': this.pageSize,
        'orgName': _t.search_orgName,
        'orgType': _t.search_orgType,
        'pid': _t.search_pid
      }
      this.loading = true
      orgManagerService.listOrgManagerByPage(param).then((res) => {
        this.total = res.count
        this.orgManagerData = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    // element相关方法 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
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
    loadOrgTree () {
      orgManagerService.loadTree().then((res) => {
        this.treeData = res
      })
    },
    loadAllOrg () {
      this.allOrgManagerList.push({ id: '0', orgName: '根组织', orgType: '部门' })
      orgManagerService.listAllOrg().then((res) => {
        if (res) {
          res.forEach((item) => {
            this.allOrgManagerList.push(item)
          })
        }
      })
    },
    search () {
      let _t = this
      let param = {
        'pageNum': this.currentPage,
        'pageSize': this.pageSize,
        'orgName': _t.search_orgName,
        'orgType': _t.search_orgType,
        'pid': _t.search_pid
      }
      this.loading = true
      orgManagerService.listOrgManagerByPage(param).then((res) => {
        this.total = res.count
        this.orgManagerData = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    cancel (val) {
      if (val === 'add') {
        this.addDialog = false
        this.$refs['addForm'].resetFields()
      } else if (val === 'update') {
        this.updateDialog = false
        this.$refs['updateForm'].resetFields()
      } else if (val === 'searchHander') {
        this.search_orgName = ''
        this.search_orgType = ''
      }
      this.search()
    },
    loadOrgTypes () {
      let _t = this
      let param = {
        'type': 'org_type'
      }
      rbProjectDataServiceFactory.getConfigDictByType(param).then((res) => {
        _t.orgTypeList = res
      })
    },
    saveAddForm (formName) {
      let _t = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addDialog = false
          let obj = {
            'orgName': _t.addForm.addOrgName,
            'orgType': _t.addForm.addOrgType,
            'pid': _t.addForm.pid,
            'remark': _t.addForm.remark
          }
          this.loading = true
          orgManagerService.insert(obj).then((res) => {
            if (res === 'success') {
              this.loadOrgTree()
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.search()
            } else {
              this.$message.error('添加失败')
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    saveEditForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _t = this
          this.updateDialog = false
          let obj = {
            'id': _t.updateForm.id,
            'orgName': _t.updateForm.updateOrgName,
            'orgType': _t.updateForm.updateOrgType,
            'pid': _t.updateForm.pid,
            'remark': _t.updateForm.remark
          }
          this.loading = true
          orgManagerService.update(obj).then((res) => {
            if (res === 'success') {
              this.loadOrgTree()
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.search()
            } else {
              this.$message.error('更新失败')
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
