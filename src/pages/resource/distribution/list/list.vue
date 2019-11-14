<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="一级部门">
        <el-input v-model="primaryDepartment"
                  placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="二级部门">
        <el-input v-model="secondaryDepartment"
                  placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="业务系统">
        <el-input v-model="businessName"
                  placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="资源池">
        <el-select v-model="resource_pool"
                   placeholder="请选择"
                   clearable>
          <el-option v-for="item in poolList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="state"
                   clearable>
          <el-option v-for="item in stateList"
                     :key="item.VALUE"
                     :label="item.LABEL"
                     :value="item.VALUE">
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
                   icon="el-icon-download"
                   @click="batchImport()">导入</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 300px)">
          <el-table-column v-for="(item, index) in tableHead"
                           :prop="item.prop"
                           :label="item.label"
                           :width="item.width"
                           :sortable="item.sortable"
                           :key="index">
          </el-table-column>
          <el-table-column label="分配"
                           min-width="160">
            <template slot-scope="scope">
              <a href="javascript:;"
                 @click="distribute(scope.row)"
                 class="delete"
                 v-if="scope.row.status !== '已分配'">分配</a>
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
    <el-dialog title="预分配"
               :visible.sync="dialogVisible"
               width="92%"
               :before-close="handleClose"
               class="dialog1"
               :close-on-click-modal="false">
      <div class="header">
        <div class="head">
          <div class="task-name">设备IP：</div>
          <el-input v-model="mainParams.ip"
                    placeholder="请输入内容"
                    class="input-tem-name1"></el-input>
          <div class="task-name">维保时间：</div>
          <el-date-picker v-model="time_range"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          class="time-range"
                          value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <div class="task-name">业务部门：</div>
          <el-select v-model="mainParams.business_department"
                     placeholder="请选择"
                     class="list-sel select"
                     clearable
                     @change="changeDepartment">
            <el-option v-for="item in departmentList"
                       :key="item.VALUE"
                       :label="item.LABEL"
                       :value="item.VALUE">
            </el-option>
          </el-select>
          <div class="task-name">业务系统：</div>
          <el-select v-model="mainParams.service1"
                     placeholder="请选择"
                     class="list-sel select"
                     clearable>
            <el-option v-for="item in bizSystem"
                       :key="item.VALUE"
                       :label="item.LABEL"
                       :value="item.VALUE">
            </el-option>
          </el-select>
          <div class="task-name">厂商品牌：</div>
          <el-select v-model="mainParams.brand"
                     placeholder="请选择"
                     class="list-sel select"
                     clearable>
            <el-option v-for="item in brandList"
                       :key="item.id"
                       :label="item.text"
                       :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="head">
          <div class="task-name"
               style="">设备分类：</div>
          <el-select v-model="mainParams.value"
                     placeholder="请选择"
                     class="list-sel select"
                     clearable
                     @change="changedeviceClass">
            <el-option v-for="item in deviceClassList"
                       :key="item.VALUE"
                       :label="item.LABEL"
                       :value="item.VALUE">
            </el-option>
          </el-select>
          <div class="task-name">设备类型：</div>
          <el-select v-model="mainParams.deviceType"
                     placeholder="请选择"
                     class="list-sel select"
                     clearable>
            <el-option v-for="item in deviceTypeList"
                       :key="item.VALUE"
                       :label="item.LABEL"
                       :value="item.VALUE">
            </el-option>
          </el-select>
          <div class="task-name">机房位置：</div>
          <el-select v-model="mainParams.idcLocation"
                     placeholder="请选择"
                     class="list-sel select"
                     clearable>
            <el-option v-for="item in roomList"
                       :key="item.VALUE"
                       :label="item.LABEL"
                       :value="item.VALUE">
            </el-option>
          </el-select>
          <div class="task-name">是否分配：</div>
          <el-select v-model="mainParams.is_assign"
                     placeholder="请选择"
                     class="list-sel select"
                     disabled>
            <el-option v-for="item in stateList"
                       :key="item.VALUE"
                       :label="item.LABEL"
                       :value="item.VALUE">
            </el-option>
          </el-select>
          <el-button class="tem-search"
                     type="primary"
                     @click="search1">查询</el-button>
          <el-button class="tem-search"
                     type="primary"
                     @click="reset1">重置</el-button>
        </div>
      </div>
      <el-table :data="tableData1"
                border
                style="width:100%;margin-top:15px;"
                @selection-change="handleSelectionChange"
                v-loading="loading"
                element-loading-text="玩命加载中"
                element-loading-spinner="el-icon-loading">
        <el-table-column type="selection"
                         align="center">
        </el-table-column>
        <el-table-column v-for="(item, index) in tableHead1"
                         :prop="item.prop"
                         :label="item.label"
                         :sortable="item.sortable"
                         :key="index"
                         align="center">
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="cancel()"
                   class="tem-search1">取 消</el-button>
        <el-button type="primary"
                   @click="preDistribute()"
                   class="tem-search1">预分配</el-button>
      </span>
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
    </el-dialog>

    <el-dialog title="导入excel"
               :visible.sync="dialogVisible3"
               width="80%"
               :before-close="handleClose3"
               :close-on-click-modal="false"
               class="dialog2">
      <el-upload name="myFile"
                 class="upload-demo"
                 drag
                 action="/resource/resource/GetExcelData"
                 :multiple='false'
                 :limit="1"
                 :before-remove="beforeRemove"
                 :on-exceed="handleExceed"
                 :file-list="fileList"
                 :before-upload="beforeUpload"
                 :on-success="success"
                 :on-remove="remove"
                 :headers="myHeaders">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip"
             slot="tip">
          只能上传excel文件，且不超过500kb
          <el-button type="primary"
                     class="tem-search1"
                     @click="download()">下载模板</el-button>
        </div>
      </el-upload>
      <el-table :data="tableDataFile"
                border
                style="width:100%;margin-top:15px;">
        <el-table-column v-for="(item, index) in tableHeadFile"
                         :prop="item.prop"
                         :label="item.label"
                         :width="item.width"
                         :sortable="item.sortable"
                         :key="index"
                         align="center">
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="saveFile()"
                   class="tem-search1">确认保存</el-button>
        <el-button type="primary"
                   @click="dialogVisible3 = false"
                   class="tem-search1">取 消</el-button>
      </span>
    </el-dialog>
    <!-- dialog -->
  </div>

</template>

<script>
import rbProjectDataServiceFactory from 'src/services/resource/rb-resource-services.factory.js'
// import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'
import { poolList, stateList, departmentList, deviceClassList, roomList, brandList, tableHead, tableHead1, tableHeadFile } from '../config/options'
import { check } from 'src/assets/js/utility/resource1'
const token = sessionStorage.getItem('token')

export default {
  data () {
    return {
      // headers token
      myHeaders: { Authorization: 'Bearer ' + token },
      // 多选框模板存放的值
      multipleSelection: [],
      // 数据数组
      tableData: [],
      // 表头列表
      tableHead: [],
      // 预分配dialog
      tableData1: [],
      // 预分配表头列表
      tableHead1: [],
      // 当前页
      currentPage: 1,
      // 分页每页多少行数据
      pageSize: 50,
      // 每页多少行数组
      pageSizes: [10, 20, 50, 100],
      // 总共多少行数据
      total: 0,
      // 分配dialog
      dialogVisible: false,
      // self
      primaryDepartment: '',
      secondaryDepartment: '',
      businessName: '',
      resource_pool: '',
      state: '',
      // 资源池列表
      poolList: [],
      // dialog预分配分页
      // 当前页
      currentPage1: 1,
      // 分页每页多少行数据
      pageSize1: 5,
      // 每页多少行数组
      pageSizes1: [5, 10, 20],
      // 总共多少行数据
      total1: 0,
      time_range: [],
      loading: true,
      // 数据字典
      brandList: [],
      departmentList: [],
      deviceClassList: [],
      roomList: [],
      stateList: [],
      deviceTypeList: [],
      bizSystem: [],
      mainParams: {
        ip: '',
        maintenanceTimeBeginDate: '',
        maintenanceTimeEndDate: '',
        business_department: '',
        service1: '',
        brand: '',
        value: '',
        deviceType: '',
        idcLocation: '',
        is_assign: '0'
      },
      // 预分配id
      preId: '',
      // 批量导入
      dialogVisible3: false,
      fileList: [],
      tableDataFile: [],
      tableHeadFile: []
    }
  },
  methods: {
    // 1 element相关方法 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
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
    // 分页改变尺寸
    handleSizeChange1 (val) {
      this.pageSize1 = val
      this.search1(1)
    },
    // 分页改变当前页
    handleCurrentChange1 (val) {
      this.currentPage1 = val
      this.search1(1)
    },
    // 对话框
    handleClose (done) {
      done()
      this.loading = true
    },
    // excel导入
    handleClose3 (done) {
      done()
    },
    // 文件上传相关代码 移除前的回调
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 超出限制的回调
    handleExceed (file, fileList) {
      this.$message.warning(`当前限制选择 1 个excel文件`)
    },
    // 上传之前的回调
    beforeUpload (file) {
    },
    // 上传成功的回调
    success (res) {
      if (res.result) {
        this.$message.success(`文件上传成功`)
        this.tableDataFile = res.DataGrid.rows
      } else {
        this.$message.error(`${res.message}`)
        this.fileList = []
      }
    },
    remove (file) {
      if (file.status === 'success') {
        this.tableDataFile = []
      }
    },
    changeDepartment (value) {
      this.bizSystem = []
      this.mainParams.service1 = ''
      if (value === '') {
        return
      }
      let obj = this.departmentList.filter((item) => { return item.VALUE === value })[0]
      rbProjectDataServiceFactory.jsonDatas({
        depart_id: obj.ID
      }).then((res) => {
        this.bizSystem = res
      }).catch(() => { })
    },
    changedeviceClass (value) {
      this.deviceTypeList = []
      this.mainParams.deviceType = ''
      if (value === '') {
        return
      }
      let obj = this.deviceClassList.filter((item) => { return item.VALUE === value })[0]
      rbProjectDataServiceFactory.jsonDatas({
        type: 'deviceType',
        parentId: obj.ID
      }).then((res) => {
        this.deviceTypeList = res
      }).catch(() => { })
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
        'primaryDepartment': this.primaryDepartment.trim(),
        // 'companyName': this.companyName,
        'secondaryDepartment': this.secondaryDepartment.trim(),
        'businessName': this.businessName.trim(),
        'resource_pool': this.resource_pool,
        'status': this.state
      }
      this.getTableData(obj1)
    },
    search1 (num) {
      this.loading = true
      let obj = this.mainParams
      if (obj.brand !== '' || obj.business_department !== '' || obj.ip !== '' || obj.value !== '' || obj.idcLocation !== '' || this.time_range.length > 0) {
        this.mainParams.maintenanceTimeBeginDate = this.time_range[0]
        this.mainParams.maintenanceTimeEndDate = this.time_range[1]
        rbProjectDataServiceFactory.cmdbAdvancedSearchDeviceIdList({
          mainParams: this.mainParams
        }).then((res) => {
          return res
        }).then((res1) => {
          let str = ''
          res1.forEach((item) => {
            str += item + ','
          })
          str = str.slice(0, -1)
          rbProjectDataServiceFactory.gridData1({
            'page': this.currentPage1,
            'rows': this.pageSize1,
            'list': str
          }).then((result) => {
            this.tableData1 = result.rows
            this.total1 = result.total
            this.loading = false
          })
        })
      } else {
        if (num !== 1) {
          // 搜索前将当前页置为1
          this.currentPage1 = 1
        }
        let obj1 = {
          'page': this.currentPage1,
          'rows': this.pageSize1,
          'list': ''
        }
        this.getTableData1(obj1)
      }
    },
    // 点击分配
    distribute (obj) {
      this.dialogVisible = true
      this.getTableData1()
      this.preId = obj.id
    },
    // 预分配
    preDistribute (obj) {
      if (this.multipleSelection.length <= 0) {
        this.$alert('请选择至少一条数据', '通知', {
          confirmButtonText: '确定'
        })
      } else {
        this.$confirm('确认分配？').then(() => {
          this.dialogVisible = false
          rbProjectDataServiceFactory.preAsset({
            data: this.multipleSelection,
            preId: String(this.preId)
          }).then((res) => {
            if (res.flag) {
              this.$message.success(`${res.msg}`)
            } else {
              this.$message.error(`${res.msg}`)
            }
          }).catch(() => {
            this.$message.error('分配错误')
          })
        }, () => {
        })
      }
    },
    // 重置
    reset () {
      this.primaryDepartment = ''
      this.secondaryDepartment = ''
      this.businessName = ''
      this.resource_pool = ''
      this.state = ''
    },
    // 重置dialog分配
    reset1 () {
      this.mainParams = {
        ip: '',
        maintenanceTimeBeginDate: '',
        maintenanceTimeEndDate: '',
        business_department: '',
        service1: '',
        brand: '',
        value: '',
        deviceType: '',
        idcLocation: '',
        is_assign: '0'
      }
    },
    cancel () {
      this.dialogVisible = false
      this.loading = true
    },
    // 批量导入
    batchImport () {
      this.fileList = []
      this.tableDataFile = []
      this.dialogVisible3 = true
    },
    // 确认上传
    saveFile () {
      if (this.tableDataFile.length <= 0) {
        this.$message.warning(`请先上传并且上传文件内容不能为空`)
      } else {
        // 将Null过滤成空字符串
        if (check(this.tableDataFile, this)) {
          // 将Null过滤成空字符串
          let str = ''
          for (let obj of this.tableDataFile) {
            for (let item in obj) {
              if (obj[item] === null) {
                obj[item] = ''
              }
            }
            str += JSON.stringify(obj)
          }
          rbProjectDataServiceFactory.saveExcelData1({
            entities: str
          }).then((res) => {
            this.dialogVisible3 = false
            this.tableDataFile = []
            this.fileList = []
            this.search()
            this.$message.success(`保存成功`)
          }).catch(() => {
            this.$message.error(`保存失败`)
          })
        }
      }
    },
    download () {
      rbProjectDataServiceFactory.exportGridData({
        title: '资产信息预分配表模板'
      }).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '资产信息预分配表模板.xls'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      })
    },
    // 3 封装数据相关方法
    initData () {
      this.tableHead = tableHead
      this.tableHead1 = tableHead1
      this.tableHeadFile = tableHeadFile
      this.poolList = poolList
      // this.stateList = stateList
      this.brandList = brandList
      this.departmentList = departmentList
      this.deviceClassList = deviceClassList
      this.roomList = roomList
      this.getTableData()
    },
    initState () {
      this.stateList = stateList
    },
    packData (arr) {
      for (let item of arr) {
        item.create_time = formatDate(item.create_time)
        item.status = item.status === '1' ? '已分配' : '未分配'
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
          'rows': this.pageSize,
          'primaryDepartment': this.primaryDepartment.trim(),
          'secondaryDepartment': this.secondaryDepartment.trim(),
          'businessName': this.businessName.trim(),
          'resource_pool': this.resource_pool,
          'status': this.state
        }
      }
      rbProjectDataServiceFactory.distributedGridata(obj1).then((res) => {
        this.tableData = []
        this.total = 0
        this.tableData = this.packData(res.rows)
        this.total = res.total
      }).catch(() => { })
    },
    getTableData1 (obj) {
      let obj1 = {}
      if (obj) {
        obj1 = obj
      } else {
        obj1 = {
          page: this.currentPage1,
          rows: this.pageSize1,
          list: ''
        }
      }
      let arr = [{
        index: '1',
        is_assign: '0'
      }, obj1]
      rbProjectDataServiceFactory.distributedGridata1(arr).then((res) => {
        this.tableData = []
        this.total = 0
        this.tableData1 = res.rows
        this.total1 = res.total
        this.loading = false
      }).catch(() => { })
    }
  },
  mounted () {
    this.initData()
    this.initState()
  }
}
</script>

<style lang="scss" scoped>
</style>
