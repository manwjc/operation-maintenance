<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="资源池">
        <el-select v-model="resource_pool"
                   placeholder="请选择"
                   clearable>
          <el-option v-for="item in sysList"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="state"
                   placeholder="请选择"
                   clearable>
          <el-option v-for="item in stateList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="reset()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="addEstimate">新增</el-button>
        <el-button type="text"
                   icon="el-icon-edit"
                   @click="updateEstimate">编辑</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  ref="estimatesTable"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 275px)"
                  @current-change="handleSelectionChangeList">
          <el-table-column type="index">
          </el-table-column>
          <el-table-column v-for="(item, index) in tableHead"
                           :prop="item.prop"
                           :label="item.label"
                           :width="item.width"
                           :sortable="item.sortable"
                           :key="index">
          </el-table-column>
          <el-table-column label="操作"
                           min-width="160">
            <template slot-scope="scope">
              <a href="javascript:;"
                 @click="shutDown(scope.row)"
                 class="delete"
                 v-if="scope.row.status !== '已关闭'">关闭</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </el-form>

    <!-- dialog -->
    <el-dialog title="选择资源收集信息"
               :visible.sync="dialogVisible"
               width="60%"
               :before-close="handleClose"
               :close-on-click-modal="false">
      <el-table :data="colTableData"
                ref="selectCollectTable"
                border
                style="width:100%;margin-top:15px;"
                @selection-change="handleSelectionChange"
                @row-click="clickRow">
        <el-table-column type="selection"
                         align="center"
                         :selectable="checkSelectable">
        </el-table-column>
        <el-table-column v-for="(item, index) in tableHead1"
                         :prop="item.prop"
                         :label="item.label"
                         :width="item.width"
                         :sortable="item.sortable"
                         :key="index"
                         align="center">
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange1"
                       @current-change="handleCurrentChange1"
                       :current-page="currentPage1"
                       :page-sizes="pageSizes1"
                       :page-size="pageSize1"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total1">
        </el-pagination>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="next()"
                   class="tem-search1">下一步</el-button>
        <el-button type="primary"
                   @click="cancel()"
                   class="tem-search1">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="资源预估"
               :visible.sync="dialogVisible1"
               width="40%"
               :before-close="handleClose1"
               class="dialog1"
               :close-on-click-modal="false">
      <el-form :model="addOrEditForm"
               :rules="rules1"
               ref="ruleform">
        <el-form-item prop="resource_pool"
                      label="资源池："
                      class="add-tit"
                      label-width="270px">
          <el-select v-model="addOrEditForm.resource_pool"
                     placeholder="请选择"
                     clearable>
            <el-option v-for="item in sysList"
                       :key="item.name"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item, index) in tableForm"
                      :prop="item.prop"
                      :label="item.label"
                      class="add-tit"
                      :key="index"
                      label-width="270px">
          <el-input v-model="addOrEditForm[item.prop]"
                    placeholder="请输入内容"
                    class="input-tem-name1"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="prev()"
                   class="tem-search1">上一步</el-button>
        <el-button type="primary"
                   @click="saveForm()"
                   class="tem-search1">保 存</el-button>
      </span>
    </el-dialog>
    <!-- dialog -->
  </div>
</template>

<script>
import rbProjectDataServiceFactory from 'src/services/resource/rb-resource-services.factory.js'
import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'
import { tableHead, tableHead1, stateList, tableForm, sysList } from '../config/options'

export default {
  data () {
    return {
      // 列表
      currentRow: [],
      // 多选框模板存放的值
      addTableData: [],
      multipleSelection: [],
      multipleSelectionAll: [],
      // 数据数组
      tableData: [],
      // 表头列表
      tableHead: [],
      // dialog
      colTableData: [],
      otherColData: [],
      selectedData: [],
      // dialog第一步
      tableHead1: [],
      // 状态列表
      stateList: [],
      // 第二步表单标题
      tableForm: [],
      // 系统列表
      sysList: [],
      // 当前页
      currentPage: 1,
      // 分页每页多少行数据
      pageSize: 50,
      // 每页多少行数组
      pageSizes: [10, 20, 50, 100],
      // 总共多少行数据
      total: 0,
      // 新增修改的分页
      // 当前页
      currentPage1: 1,
      // 分页每页多少行数据
      pageSize1: 5,
      // 每页多少行数组
      pageSizes1: [5, 10, 20],
      // 总共多少行数据
      total1: 0,
      // 对话框
      dialogVisible: false,
      // 第二步对话框
      dialogVisible1: false,
      // self
      resource_pool: '',
      state: '',
      // 新增修改第二步
      addOrEditForm: {},
      resource_pool_1: '',
      // 是否是修改
      addOrUpdate: '',
      rules1: {
        resource_pool: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    initFormData () {
      this.addOrEditForm = {
        resource_pool: '',
        vm_model1: '',
        vm_model2: '',
        vm_model3: '',
        vm_model4: '',
        vm_model5: '',
        vm_model6: '',
        vm_model7: '',
        vm_model8: '',
        pm_low_app_server: '',
        pm_analytical_server: '',
        pm_distributed_server: '',
        pm_cache_server: '',
        pm_high_app_server: '',
        storage_distributd_file_capacity: '',
        storage_distributd_block_performance: '',
        storage_object_capacity: '',
        storage_fc_san_capacity: '',
        storage_ip_san_capacity: '',
        storage_fc_san_naked: '',
        storage_ip_san_naked: '',
        storage_back_up: '',
        cmnet_address: '',
        bandwidth_gbps_cmnet: '',
        ip_address: '',
        bandwidth_gbps_ip: '',
        remark: ''
      }
    },
    clickRow (row) {
      this.$refs.selectCollectTable.toggleRowSelection(row)
    },
    // 1 element相关方法 多选框
    handleSelectionChangeList (val) {
      if (val) {
        this.currentRow = val
        // for (let property in this.addOrEditForm) {
        //   if (val[property]) {
        //     this.addOrEditForm[property] = val[property]
        //   }
        // }
      }
      // this.addOrEditForm = this.currentRow
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // if (!this.multipleSelectionAll[this.currentPage1 - 1]) {
      //   this.multipleSelectionAll[this.currentPage1 - 1] = this.multipleSelection
      // }
      // if (this.multipleSelectionAll[this.currentPage1 - 1]) {
      //   this.multipleSelection = this.multipleSelectionAll[this.currentPage1 - 1]
      // }
    },
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.search(1)
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.search(1)
    },
    // 新增修改的表格分页
    // 分页改变尺寸
    handleSizeChange1 (val) {
      this.pageSize1 = val
      if (this.addOrUpdate === 'update') {
        this.updateDetails()
      } else {
        this.getTableData1()
      }
    },
    // 分页改变当前页
    handleCurrentChange1 (val) {
      this.multipleSelectionAll[this.currentPage1 - 1] = this.multipleSelection
      this.currentPage1 = val
      if (this.addOrUpdate === 'update') {
        this.updateDetails()
      } else {
        this.getTableData1()
      }
    },
    // 对话框
    handleClose (done) {
      this.currentPage1 = 1
      this.pageSize1 = 5
      this.addOrEditForm.resource_pool = ''
      this.multipleSelection = []
      done()
    },
    handleClose1 (done) {
      this.currentPage1 = 1
      this.pageSize1 = 5
      this.multipleSelection = []
      done()
    },
    shutDown (obj) {
      this.$confirm('确认关闭？').then(() => {
        rbProjectDataServiceFactory.closeEstimate({
          estimate_id: obj.id
        }).then((res) => {
          if (res[0]) {
            this.$message.success(`${res[1]}`)
            this.search()
          } else {
            this.$message.error(`${res[1]}`)
            this.search()
          }
        }).catch(() => {
          this.$message.error(`关闭资源预估失败!`)
          this.search()
        })
      }, () => {
      })
    },
    // 2 业务操作相关方法
    search (num) {
      if (num !== 1) {
        // 搜索前将当前页置为1
        this.currentPage = 1
      }
      let obj1 = {
        'page': this.currentPage,
        'rows': this.pageSize,
        'status': this.state,
        'resourcePool': this.resource_pool
      }
      this.getTableData(obj1)
    },
    // 重置
    reset () {
      this.resource_pool = ''
      this.state = ''
    },
    // 新增预估
    addEstimate () {
      this.dialogVisible = true
      this.multipleSelectionAll = []
      this.addOrUpdate = 'add'
      this.getTableData1()
    },
    // 修改预估
    updateEstimate () {
      if (this.currentRow.length <= 0) {
        this.$alert('请先选择一条进行修改', '通知', {
          confirmButtonText: '确定'
        })
      } else if (this.currentRow.status === '已关闭') {
        this.$alert('请选择未关闭的进行修改', '通知', {
          confirmButtonText: '确定'
        })
      } else {
        // this.resource_pool_1 = this.currentRow.resource_pool
        for (let property in this.addOrEditForm) {
          if (this.currentRow[property]) {
            this.addOrEditForm[property] = this.currentRow[property]
          }
        }
        this.addOrUpdate = 'update'
        this.multipleSelectionAll = []
        this.dialogVisible = true
        this.updateDetails()
      }
    },
    checkSelectable (row, index) {
      if (row.estimate_id) {
        return false
      }
      return true
    },
    prev () {
      this.dialogVisible = true
      this.dialogVisible1 = false
    },
    next () {
      this.multipleSelectionAll[this.currentPage1] = this.multipleSelection
      if (this.multipleSelectionAll.length <= 0) {
        this.$alert('请先选择一条资源收集信息', '通知', {
          confirmButtonText: '确定'
        })
      } else {
        this.getTableData2()
        this.dialogVisible = false
        this.dialogVisible1 = true
      }
    },
    saveForm () {
      this.$refs['ruleform'].validate((valid) => {
        if (valid) {
          this.dialogVisible1 = false
          this.currentPage1 = 1
          this.pageSize1 = 5
          this.addOrEditEstimate()
        } else {
          this.$message.warning(`请选择资源池`)
        }
      })
    },
    cancel () {
      this.currentPage1 = 1
      this.pageSize1 = 5
      this.dialogVisible = false
    },
    // 3 封装数据相关方法
    initData () {
      this.tableHead = tableHead
      this.tableHead1 = tableHead1
      this.stateList = stateList
      this.tableForm = tableForm
      this.sysList = sysList
      this.initFormData()
      this.getTableData()
    },
    // 封装得到的数据
    packData (arr) {
      for (let item of arr) {
        item.create_time = formatDate(item.create_time)
        item.update_time = formatDate(item.update_time)
        item.status = rbMirrorCommonService.common('RESOURCESTATUS', '1', item.status)
      }
      return arr
    },
    packData1 (arr) {
      for (let item of arr) {
        item.create_time = formatDate(item.create_time)
      }
      return arr
    },
    // 4 数据相关方法
    getTableData (obj) {
      let obj1 = {}
      if (obj) {
        obj1 = obj
      } else {
        obj1 = {
          'page': this.currentPage,
          'rows': this.pageSize
        }
      }
      rbProjectDataServiceFactory.resourceEstimateList(obj1).then((res) => {
        this.tableData = this.packData(res.rows)
        this.total = res.total
      }).catch(() => {
        // this.$message.error(``)
      })
    },
    // dialog第一步
    getTableData1 (obj) {
      let obj1 = {}
      if (obj) {
        obj1 = obj
      } else {
        obj1 = {
          'page': this.currentPage1,
          'rows': this.pageSize1
        }
      }
      this.colTableData = []
      rbProjectDataServiceFactory.collectGridData(obj1).then((res) => {
        if (res.total > 0) {
          this.colTableData = this.packData1(res.rows)
        }
        if (this.multipleSelectionAll[this.currentPage1 - 1]) {
          this.$nextTick(() => {
            this.multipleSelectionAll[this.currentPage1 - 1].forEach(item => {
              this.colTableData.forEach(data => {
                if (data.id === item.id) {
                  this.$refs.selectCollectTable.toggleRowSelection(data, true)
                }
              })
            })
          })
        }
        this.total1 = res.total
      }).catch(() => {
        // this.$message.error(``)
      })
    },
    // dialog第二步
    getTableData2 () {
      let str = ''
      this.multipleSelectionAll.forEach(item => {
        item.forEach(data => {
          str += data.id + ','
        })
      })
      // for (let item of this.multipleSelectionAll) {
      //   str += item.id + ','
      // }
      str = str.slice(0, -1)
      let obj = {
        collect_id: str
      }
      rbProjectDataServiceFactory.getCollectByCollectIds(obj).then((res) => {
        if (res[0]) {
          // this.form = res[2]
        }
      }).catch(() => {
        // this.$message.error(``)
      })
    },
    updateDetails () {
      let arr = {
        'page': this.currentPage1,
        'rows': this.pageSize1,
        'estimateId': this.currentRow.id
      }
      // this.otherColData = []
      this.colTableData = []
      this.selectedData = []
      rbProjectDataServiceFactory.collectGridDataAll(arr).then((res) => {
        this.selectedData = this.packData1(res.rows)
        this.selectedData.forEach(item => {
          this.colTableData.push(item)
        })
        this.colTableData.forEach(item => {
          // this.$refs.selectCollectTable.toggleRowSelection(item, true)
          if (this.multipleSelectionAll[this.currentPage1 - 1]) {
            this.multipleSelectionAll[this.currentPage1 - 1].forEach(data => {
              if (data.id === item.id && !item.estimate_id) {
                this.$refs.selectCollectTable.toggleRowSelection(item, true)
              }
            })
          }
          if (item.estimate_id) {
            this.$refs.selectCollectTable.toggleRowSelection(item, true)
            // this.multipleSelection.push(item)
          }
        })
        // this.$refs.selectCollectTable.toggleRowSelection(this.selectedData[0], true)
        // this.selectedData.forEach(item => {
        //   this.$refs.selectCollectTable.toggleRowSelection(item, true)
        // })
        this.total1 = res.total
        // this.addOrEditForm.resource_pool = this.currentRow.resource_pool
      }).catch(() => {
        // this.$message.error(``)
      })
    },
    addOrEditEstimate () {
      let str = ''
      // for (let item of this.multipleSelection) {
      //   str += item.id + ','
      // }
      this.multipleSelectionAll.forEach(item => {
        item.forEach(data => {
          str += data.id + ','
        })
      })
      str = str.slice(0, -1)
      let obj = JSON.parse(JSON.stringify(this.addOrEditForm))
      for (let item in obj) {
        if (obj[item] === null) {
          obj[item] = ''
        }
      }
      obj.collectId = str
      if (this.currentRow && this.addOrUpdate === 'update') {
        obj.id = this.currentRow.id
      }
      rbProjectDataServiceFactory.addOrEditEstimate(obj).then((res) => {
        if (res[0]) {
          this.initFormData()
          this.currentRow = []
          this.multipleSelection = []
          this.getTableData()
          this.$message.success(`${res[1]}`)
          this.search()
          // this.addOrEditForm.resource_pool = ''
          this.initFormData()
        } else {
          this.initFormData()
          this.currentRow = []
          this.multipleSelection = []
          this.$message.error(`${res[1]}`)
          this.search()
          this.initFormData()
          // this.addOrEditForm.resource_pool = ''
        }
      }).catch(() => {
        this.$message.error(`新增失败`)
        this.search()
      })
    }
  },
  mounted () {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
</style>
