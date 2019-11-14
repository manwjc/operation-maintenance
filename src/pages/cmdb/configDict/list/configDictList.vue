<template>
  <div class="components-container yw-dashboard"
       v-loading="loading">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="50px">
      <el-form-item label="父标签">
        <el-input v-model="pcode"></el-input>
      </el-form-item>
      <el-form-item label="标签名">
        <el-input v-model="dictCode"></el-input>
      </el-form-item>
      <el-form-item label="数据值">
        <el-input v-model="dictNote"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="colName"></el-input>
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
                   @click="addDict()">新增</el-button>
        <el-button type="text"
                   icon="el-icon-edit"
                   @click="editDict()">编辑</el-button>
        <el-button type="text"
                   icon="el-icon-delete"
                   @click="deleteDict()">删除</el-button>
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportDict()">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  border
                  :data="configDictData"
                  style="cursor: pointer;"
                  stripe
                  tooltip-effect="dark"
                  height="calc(100vh - 300px)"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="dictCode"
                           label="标签名"
                           width="150px"
                           :show-overflow-tooltip="true"> </el-table-column>
          <el-table-column prop="pname"
                           label="父标签名"
                           width="150px"></el-table-column>
          <el-table-column prop="dictNote"
                           label="数据值"
                           width="150px"
                           :show-overflow-tooltip="true"> </el-table-column>
          <el-table-column prop="colName"
                           label="类型"
                           width="150px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="description"
                           label="描述"
                           :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-form>

    <!-- dialog -->
    <el-dialog class="yw-dialog"
               :visible.sync="addDialog"
               width="380px"
               :close-on-click-modal="false"
               title="新增字典信息">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :model="addForm"
                 :rules="addRules"
                 ref="addForm"
                 label-width="80px">
          <el-form-item label="父标签名"
                        prop="addPcode">
            <el-select v-model="addForm.addPcode"
                       placeholder="请选择父标签" filterable>
              <el-option v-for="item in parent_dict"
                         :key="item.dictId"
                         :label="item.dictCode"
                         :value="item.dictId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签名"
                        prop="addDictCode">
            <el-input v-model="addForm.addDictCode"></el-input>
          </el-form-item>
          <el-form-item label="数据值"
                        prop="addDictNote">
            <el-input v-model="addForm.addDictNote"></el-input>
          </el-form-item>
          <el-form-item label="类型"
                        prop="addColName">
            <el-input v-model="addForm.addColName"></el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="addDescription">
            <el-input v-model="addForm.addDescription"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="saveAddForm('addForm')">确定</el-button>
        <el-button @click="cancel('add')">取消</el-button>
      </section>
    </el-dialog>

    <el-dialog class="yw-dialog"
               :visible.sync="updateDialog"
               width="380px"
               :close-on-click-modal="false"
               title="编辑字典信息">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :model="updateForm"
                 :rules="updateRules"
                 ref="updateForm"
                 label-width="80px">
          <el-form-item label="父标签名"
                        prop="updatePcode">
            <el-select v-model="updateForm.updatePid"
                       placeholder="请选择父标签">
              <el-option v-for="item in parent_dict"
                         :key="item.dictId"
                         :label="item.dictCode"
                         :value="item.dictId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签名"
                        prop="updateDictCode">
            <el-input v-model="updateForm.updateDictCode"></el-input>
          </el-form-item>
          <el-form-item label="数据值"
                        prop="updateDictNote">
            <el-input v-model="updateForm.updateDictNote"></el-input>
          </el-form-item>
          <el-form-item label="类型"
                        prop="updateColName">
            <el-input v-model="updateForm.updateColName"></el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="updateDescription">
            <el-input v-model="updateForm.updateDescription"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="saveEditForm('updateForm')">确定</el-button>
        <el-button @click="cancel('update')">取消</el-button>
      </section>

    </el-dialog>
    <!-- dialog -->
  </div>
</template>

<script>
import configDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
export default {
  components: {},
  data () {
    return {
      loading: false,
      multipleSelection: [],
      configDictData: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      dictId: '',
      pcode: '',
      dictCode: '',
      dictNote: '',
      colName: '',
      parent_dict: [],
      addDialog: false,
      addForm: {
        addPcode: '',
        addDictCode: '',
        addDictNote: '',
        addColName: '',
        addDescription: ''
      },
      addRules: {
        addDictCode: [
          { required: true, message: '请输入标签名', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        addDictNote: [
          { required: true, message: '请输入数据值', trigger: 'blur' },
          { min: 1, max: 256, message: '长度在 1 到 256 个字符', trigger: 'blur' }
        ],
        addColName: [
          { required: true, message: '请输入类型', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ]
      },
      updateDialog: false,
      updateForm: {
        updateDictId: '',
        updatePid: '',
        updateDictCode: '',
        updateDictNote: '',
        updateColName: '',
        updateDescription: ''
      },
      updateRules: {
        updateDictCode: [
          { required: true, message: '请输入标签名', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        updateDictNote: [
          { required: true, message: '请输入数据值', trigger: 'blur' },
          { min: 1, max: 256, message: '长度在 1 到 256 个字符', trigger: 'blur' }
        ],
        updateColName: [
          { required: true, message: '请输入类型', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.search()
  },
  methods: {
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
    search () {
      this.getAllConfigDictData(this.getHandRequest())
    },
    cancel (val) {
      if (val === 'add') {
        this.addDialog = false
        this.$refs['addForm'].resetFields()
      } else if (val === 'update') {
        this.updateDialog = false
        this.$refs['updateForm'].resetFields()
      } else if (val === 'searchHander') {
        this.pcode = ''
        this.dictCode = ''
        this.dictNote = ''
        this.colName = ''
        this.search()
      }
    },
    addDict () {
      this.getParentDict('')
      this.addDialog = true
    },
    saveAddForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addDialog = false
          let obj = {
            'dictCode': this.addForm.addDictCode,
            'dictNote': this.addForm.addDictNote,
            'colName': this.addForm.addColName,
            'upDict': this.addForm.addPcode,
            'description': this.addForm.addDescription
          }
          configDictServiceFactory.insertDict(obj).then((res) => {
            if (res === 'success') {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.search()
            } else {
              if (res === 'error') {
                this.$message.error('添加失败')
              } else {
                this.$message.error(res)
              }
            }
          })
        } else {
          return false
        }
      })
    },
    editDict () {
      if (this.multipleSelection.length !== 1) {
        this.$alert('请选择一条数据进行修改', '通知', {
          confirmButtonText: '确定'
        })
      } else {
        this.updateDialog = true
        let list = this.multipleSelection
        let ids = []
        list.forEach((item) => {
          ids.push(item.dictId)
        })
        this.getParentDict(ids.toString())
        this.getDictById(ids.toString())
      }
    },
    saveEditForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateDialog = false
          let obj = {
            'dictId': this.updateForm.updateDictId,
            'dictCode': this.updateForm.updateDictCode,
            'dictNote': this.updateForm.updateDictNote,
            'colName': this.updateForm.updateColName,
            'upDict': this.updateForm.updatePid,
            'description': this.updateForm.updateDescription
          }
          configDictServiceFactory.updateDict(obj).then((res) => {
            if (res === 'success') {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.search()
            } else {
              this.$message.error('更新失败')
            }
          })
        } else {
          return false
        }
      })
    },
    deleteDict (val) {
      if (this.multipleSelection.length < 1) {
        this.$alert('请至少选择一条数据进行删除', '通知', {
          confirmButtonText: '确定'
        })
      } else {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          let list = this.multipleSelection
          list.forEach((item) => {
            ids.push(item.dictId)
          })
          let dictIds = { 'dictId': ids.toString() }
          configDictServiceFactory.deleteDictById(dictIds).then((res) => {
            if (res === 'success') {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.search()
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {
          // this.$message.error('删除失败')
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    getParentDict (id) {
      let dictId = {
        'dictId': id
      }
      configDictServiceFactory.getParentDict(dictId).then((res) => {
        if (res) {
          this.parent_dict = res
        }
      })
    },
    getDictById (id) {
      let dictId = {
        'dictId': id
      }
      configDictServiceFactory.getDictById(dictId).then((res) => {
        this.updateForm.updateDictId = res.dictId
        this.updateForm.updatePid = res.upDict
        this.updateForm.updateDictCode = res.dictCode
        this.updateForm.updateDictNote = res.dictNote
        this.updateForm.updateColName = res.colName
        this.updateForm.updateDescription = res.description
      })
    },
    getAllConfigDictData (val) {
      this.loading = true
      configDictServiceFactory.listDictByPage(val).then((res) => {
        this.loading = false
        this.total = res.count
        this.configDictData = res.data
      })
    },
    getHandRequest () {
      let obj = {
        'pageNum': this.currentPage,
        'startPageNum': 0,
        'pageSize': this.pageSize,
        'dictCode': this.dictCode,
        'dictNote': this.dictNote,
        'colName': this.colName,
        'pcode': this.pcode
      }
      return obj
    },
    // 导出
    exportDict () {
      let obj = {
        'dictCode': this.dictCode,
        'dictNote': this.dictNote,
        'colName': this.colName,
        'pcode': this.pcode
      }
      configDictServiceFactory.exportDict(obj).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '字典表数据.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
