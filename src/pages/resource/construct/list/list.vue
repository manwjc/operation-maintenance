<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="建设名称">
        <el-select v-model="configName"
                   placeholder="请选择"
                   filterable
                   :filter-method="userDefConfigName"
                   clearable>
          <el-option v-for="item in nameList"
                     :key="item.text"
                     :label="item.text"
                     :value="item.text">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源池">
        <el-select v-model="resourcePool"
                   placeholder="请选择"
                   filterable
                   :filter-method="userDefResPool"
                   clearable>
          <el-option v-for="item in poolList"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务类型">
        <el-select v-model="serviceType"
                   placeholder="请选择"
                   filterable
                   :filter-method="userDefSerType"
                   clearable>
          <el-option v-for="item in serviceList"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务名称">
        <el-input v-model="serviceName"
                  placeholder="请输入内容"></el-input>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="reset()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form"
             >
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="addConstruct()">新增</el-button>
        <el-button type="text"
                   icon="el-icon-edit"
                   @click="updateConstruct()">编辑</el-button>
        <el-button type="text"
                   icon="el-icon-download"
                   @click="batchImport()">导入</el-button>
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="resourceExport()">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 275px)"
                  ref="buildsTable"
                  @selection-change="handleSelectionChange"
                  @row-click="clickRow">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column prop="buildName"
                           label="资源建设名称"
                           sortable>
          </el-table-column>
          <el-table-column prop="serverType"
                           label="服务类型"
                           sortable>
          </el-table-column>
          <el-table-column prop="resourcePool"
                           label="资源池"
                           sortable>
          </el-table-column>
          <el-table-column prop="serverName"
                           label="服务名称"
                           sortable>
          </el-table-column>
          <el-table-column prop="count"
                           label="数量"
                           sortable>
          </el-table-column>
          <el-table-column prop="unit"
                           label="单位"
                           sortable>
          </el-table-column>
          <el-table-column prop="configDetail"
                           label="配置详情"
                           sortable>
          </el-table-column>
          <el-table-column label="是否批量导入"
                           prop="q8">
            <template slot-scope="scope">
              <span v-if="scope.row.imports === 2"
                    class="imports">已导入</span>
              <el-switch v-model="scope.row.imports"
                         active-color="#46BAFE"
                         active-text="开"
                         :active-value="0"
                         inactive-color="#D3EFFF"
                         inactive-text="关"
                         :inactive-value="1"
                         @change="changeBatchImport(scope.row)"
                         v-else>
              </el-switch>
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
    <el-dialog title="添加资源建设"
               class="yw-dialog"
               :visible.sync="dialogVisible"
               width="720px"
               :before-close="handleClose"
               :close-on-click-modal="false"
               label-width="130px">
      <section class="yw-dialog-main">
        <span class="task-name">资源预估：</span>
        <el-select v-model="resourceEstimate"
                   placeholder="请选择"
                   class="list-sel select"
                   @change="selectEstimate()">
          <el-option v-for="item in systemList"
                     :key="item.id"
                     :label="item.text"
                     :value="item.id">
          </el-option>
        </el-select>
        <span class="add"
              v-if="resourceEstimate !== ''"
              @click="editConstruct()">添加资源配置</span>
        <el-table :data="tableData1"
                  class="yw-el-table"
                  border
                  style="width:100%;margin-top:15px;">
          <el-table-column prop="addbuildName"
                           label="资源建设名称"
                           sortable
                           width="140"
                           align="center">
          </el-table-column>
          <el-table-column prop="addserverType"
                           label="服务类型"
                           sortable
                           align="center">
          </el-table-column>
          <el-table-column prop="addresourcePool"
                           label="资源池"
                           sortable
                           align="center">
          </el-table-column>
          <el-table-column prop="addserverName"
                           label="服务名称"
                           sortable
                           align="center">
          </el-table-column>
          <el-table-column prop="addcount"
                           label="数量"
                           sortable
                           align="center">
          </el-table-column>
          <el-table-column prop="addunit"
                           label="单位"
                           sortable
                           align="center">
          </el-table-column>
          <el-table-column prop="addconfigDetail"
                           label="配置详情"
                           sortable
                           align="center">
          </el-table-column>
        </el-table>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
        class="tem-search1"
        @click="saveForm()">保 存</el-button>
        <el-button
                   @click="cancel()"
                   class="tem-search1">取 消</el-button>
      </section>
    </el-dialog>

    <el-dialog title="编辑资源建设"
               :visible.sync="dialogVisible1"
               width="420px"
               :before-close="handleClose1"
               class="yw-dialog"
               :close-on-click-modal="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :model="form"
                 :rules="rules1"
                 ref="ruleform"
                 label-width="130px">
          <el-form-item v-for="(item, index) in tableForm"
                        :prop="item.prop"
                        :label="item.label"
                        class="add-tit"
                        :key="index">
            <el-input v-model="form[item.prop]"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item prop="addconfigDetail"
                        label="配置详情："
                        class="add-tit">
            <el-input type="textarea"
                      placeholder="请输入内容"
                      v-model="form.addconfigDetail"
                      style="width: 178px">
            </el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="saveForm1()"
                   class="tem-search1">保 存</el-button>
        <el-button @click="cancel1()"
                   class="tem-search1">取 消</el-button>
      </section>
    </el-dialog>

    <el-dialog title="编辑资源建设"
               :visible.sync="dialogVisible2"
               width="420px"
               :before-close="handleClose2"
               class="yw-dialog"
               :close-on-click-modal="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :model="form1"
                 :rules="rules2"
                 label-width="130px"
                 ref="ruleform">
          <el-form-item v-for="(item, index) in tableForm1"
                        :prop="item.prop"
                        :label="item.label"
                        class="add-tit"
                        :key="index">
            <el-input v-model="form1[item.prop]"
                      :disabled="item.label === '服务类型：' ? true: false"
                      :placeholder="item.label === '服务类型：' ? '': '请输入内容'"
                      class="input-tem-name1"></el-input>
          </el-form-item>
          <el-form-item prop="q6"
                        label="配置详情"
                        class="add-tit">
            <el-input type="textarea"
                      placeholder="请输入内容"
                      style="width:178px;"
                      v-model="form1.configDetail">
            </el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="saveForm2()"
                   class="tem-search1">保 存</el-button>
        <el-button @click="cancel2()"
                   class="tem-search1">取 消</el-button>
      </section>
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
                 action="/resource/cmdb/GetCmdbHostAssetsExcelData"
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
        <el-table-column label="序号"
                         align="center"
                         width="80">
          <template slot-scope="scope">
            <span>{{Number(scope.$index) + 1}}</span>
          </template>
        </el-table-column>
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
// import {formatDate} from 'src/assets/js/utility/rb-filters.js'
import { nameList, poolList, serviceList, systemList, tableForm, tableForm1, tableHeadFile } from '../config/options'
import { check } from 'src/assets/js/utility/resource'
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
      // 上传的表格列表
      tableDataFile: [],
      // 当前页
      currentPage: 1,
      // 分页每页多少行数据
      pageSize: 50,
      // 每页多少行数组
      pageSizes: [10, 20, 50, 100],
      // 总共多少行数据
      total: 0,
      // 对话框
      dialogVisible: false,
      // 内部资源建设
      dialogVisible1: false,
      // 修改资源建设
      dialogVisible2: false,
      // excel导入
      dialogVisible3: false,
      // 文件列表
      fileList: [],
      // self
      configName: '',
      resourcePool: '',
      serviceType: '',
      serviceName: '',
      resourceEstimate: '',
      // 第一个dialog
      tableData1: [],
      // 第二个dialog
      form: {
        addbuildName: '',
        addserverType: '',
        addserverName: '',
        addcount: '',
        addunit: '',
        addconfigDetail: '',
        addresourcePool: ''
      },
      // 第二步新增进来的对象数据
      addTableData: [],
      form1: {
        buildName: '',
        serverType: '',
        serverName: '',
        count: '',
        addUnit: '',
        configDetail: '',
        resourcePool: ''
      },
      tableForm: [],
      // 修改的form
      tableForm1: [],
      // 配置名列表
      nameList: [],
      // 资源池列表
      poolList: [],
      // 服务类型列表
      serviceList: [],
      //  资源预估列表
      systemList: [],
      // excel表头文件列表
      tableHeadFile: [],
      rules1: {
        addcount: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ]
      },
      rules2: {
        count: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    userDefConfigName (val) {
      this.configName = val
    },
    userDefResPool (val) {
      this.resourcePool = val
    },
    userDefSerType (val) {
      this.serviceType = val
    },
    clickRow (row) {
      this.$refs.buildsTable.toggleRowSelection(row)
    },
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
    // 对话框
    handleClose (done) {
      this.tableData1 = []
      this.addTableData = []
      this.resourceEstimate = ''
      done()
    },
    handleClose1 (done) {
      this.form = {
        addbuildName: '',
        addserverType: '',
        addserverName: '',
        addcount: '',
        addunit: '',
        addconfigDetail: '',
        addresourcePool: ''
      }
      done()
    },
    handleClose2 (done) {
      this.form1 = {
        addbuildName: '',
        addserverType: '',
        addserverName: '',
        addcount: '',
        addunit: '',
        addconfigDetail: '',
        addresourcePool: ''
      }
      done()
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
    // 2 业务操作相关方法
    search (num) {
      // if (num !== 1) {
      //   // 搜索前将当前页置为1
      //   this.currentPage = 1
      // }
      let obj1 = {
        'pageNum': this.currentPage,
        'pageSize': this.pageSize,
        'startIndex': (this.currentPage - 1) * this.pageSize,
        'endIndex': this.currentPage * this.pageSize,
        'name': this.configName,
        'rePool': this.resourcePool,
        'reStatus': '',
        'seType': this.serviceType,
        'seName': this.serviceName.trim()
      }
      this.getTableData(obj1)
    },
    // 重置
    reset () {
      this.configName = ''
      this.resourcePool = ''
      this.serviceType = ''
      this.serviceName = ''
    },
    // 第一个dialog得到列表数据
    selectEstimate () {
      rbProjectDataServiceFactory.getResourceBuildName({
        id: this.resourceEstimate
      }).then((res) => {
        this.tableData1 = res
      }).catch(() => { })
    },
    // 增加建设
    addConstruct () {
      this.dialogVisible = true
    },
    // 修改建设
    updateConstruct () {
      if (this.multipleSelection.length <= 0) {
        this.$alert('请选择一条数据进行修改', '通知', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection.length > 1) {
        this.$alert('只能对一条数据进行修改', '通知', {
          confirmButtonText: '确定'
        })
      } else {
        rbProjectDataServiceFactory.getResourceBuildData({
          buildId: this.multipleSelection[0].id
        }).then((res) => {
          this.form1 = res
          this.form1.addUnit = res.unit
        })
        this.dialogVisible2 = true
      }
    },
    // 编辑建设
    editConstruct () {
      this.dialogVisible1 = true
    },
    // 新增
    saveForm () {
      if (this.addTableData.length <= 0) {
        this.$alert('请添加至少一条资源配置', '通知', {
          confirmButtonText: '确定'
        })
        return
      }
      for (let item of this.addTableData) {
        item.resourceEstimateId = this.resourceEstimate
      }
      rbProjectDataServiceFactory.addResourceBuild(this.addTableData).then((res) => {
        // if (res.flag) {
        this.$message.success(`${res.msg}`)
        this.tableData1 = []
        this.addTableData = []
        this.resourceEstimate = ''
        this.search()
        // }
      }).catch((error) => {
        this.$message.error(`${error.msg}`)
      })
      this.dialogVisible = false
    },
    // 保存表单
    saveForm1 () {
      this.$refs['ruleform'].validate((valid) => {
        if (valid) {
          this.form.addresourcePool = this.systemList.filter((item) => { return (item.id === this.resourceEstimate) })[0].text
          this.tableData1.push(this.form)
          this.addTableData.push(this.form)
          this.dialogVisible1 = false
          this.form = {
            addbuildName: '',
            addserverType: '',
            addserverName: '',
            addcount: '',
            addunit: '',
            addconfigDetail: '',
            addresourcePool: ''
          }
        } else {
          this.$message.warning(`请填写数量`)
        }
      })
    },
    // 修改时的保存
    saveForm2 () {
      this.form1.buildId = this.multipleSelection[0].id
      rbProjectDataServiceFactory.updateResourceBuild(this.form1).then((res) => {
        if (res.flag) {
          this.dialogVisible2 = false
          this.$message.success(`${res.msg}`)
          this.search()
        }
      }).catch(() => { })
    },
    cancel () {
      this.dialogVisible = false
      this.tableData1 = []
      this.addTableData = []
      this.resourceEstimate = ''
    },
    cancel1 () {
      this.dialogVisible1 = false
      this.form = {
        addbuildName: '',
        addserverType: '',
        addserverName: '',
        addcount: '',
        addunit: '',
        addconfigDetail: '',
        addresourcePool: ''
      }
    },
    cancel2 () {
      this.dialogVisible2 = false
      this.form1 = {
        addbuildName: '',
        addserverType: '',
        addserverName: '',
        addcount: '',
        addunit: '',
        addconfigDetail: '',
        addresourcePool: ''
      }
    },
    // 批量导入
    batchImport () {
      if (this.multipleSelection <= 0) {
        this.$alert('请选择需要批量导入的资源建设配置', '通知', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection > 1) {
        this.$alert('只能选择一条批量导入的资源建设配置', '通知', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection[0].imports === 1) {
        this.$alert('请选择开启批量导入开关的资源建设配置', '通知', {
          confirmButtonText: '确定'
        })
      } else {
        this.fileList = []
        this.tableDataFile = []
        this.dialogVisible3 = true
      }
    },
    // 导出
    resourceExport () {
      rbProjectDataServiceFactory.resourceBuildExportGridData({
        'headers': '资源配置名称,资源池,资源配置状态,服务名称,服务类型,数量(台),配置详情',
        'keys': 'buildName,resourcePool,status,serverName,serverType,count,configDetail',
        'title': 'resource_build_manage',
        'checkRight': true,
        'right': 'osa.monitor.alarm.showAll',
        'modulesKey': 'resource_build_manage_export',
        'name': this.configName,
        'rePool': this.resourcePool,
        'reStatus': '',
        'seType': this.serviceType,
        'seName': this.serviceName.trim()
      }).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '需求建设数据列表.xls'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      })
    },
    // 批量导入开关
    changeBatchImport (obj) {
      if (obj.imports === 1) {
        this.$confirm('确认禁用？').then(() => {
          rbProjectDataServiceFactory.importClose({
            id: `${obj.build_detail_id}`
          }).then((res) => {
            if (res.flag) {
              this.$message.success(`禁用成功`)
              this.search()
            }
          }).catch(() => {
            this.$message.error(`禁用失败`)
            obj.imports = 0
          })
        }, () => {
          obj.imports = 0
        })
      } else if (obj.imports === 0) {
        this.$confirm('确认开启？').then(() => {
          rbProjectDataServiceFactory.importOpen({
            id: `${obj.build_detail_id}`
          }).then((res) => {
            if (res.flag) {
              this.$message.success(`开启成功`)
              this.search()
            }
          }).catch(() => {
            this.$message.error(`开启失败`)
            obj.imports = 1
          })
        }, () => {
          obj.imports = 1
        })
      }
    },
    // 确认上传
    saveFile () {
      if (this.tableDataFile.length <= 0) {
        this.$message.warning(`请先上传并且上传文件内容不能为空`)
      } else {
        // 将Null过滤成空字符串
        if (check(this.tableDataFile, this)) {
          let str = ''
          for (let i = 1; i <= this.tableDataFile.length; i++) {
            let j = i - 1
            let obj = this.tableDataFile[j]
            obj.suiteID = String(i)
            for (let item in obj) {
              if (obj[item] === null) {
                obj[item] = ''
              }
            }
            str += JSON.stringify(obj)
          }
          rbProjectDataServiceFactory.saveCmdbHostAssetsExcelData({
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
      rbProjectDataServiceFactory.exportGridDataCMDB2({
        title: '资产信息表模板'
      }).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '资产信息表模板.xls'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      })
    },
    // 3 封装数据相关方法
    initData () {
      this.nameList = nameList
      this.poolList = poolList
      this.serviceList = serviceList
      this.systemList = systemList
      this.tableForm = tableForm
      this.tableForm1 = tableForm1
      this.tableHeadFile = tableHeadFile
      this.getTableData()
    },
    // 4 数据相关方法
    getTableData (obj) {
      let obj1 = {}
      if (obj) {
        obj1 = obj
      } else {
        obj1 = {
          'pageNum': this.currentPage,
          'pageSize': this.pageSize,
          'startIndex': (this.currentPage - 1) * this.pageSize,
          'endIndex': this.currentPage * this.pageSize,
          'name': '',
          'rePool': '',
          'reStatus': '',
          'seType': '',
          'seName': ''
        }
      }
      rbProjectDataServiceFactory.getResouceBuildManageData(obj1).then((res) => {
        this.tableData = []
        this.total = 0
        if (res.flag) {
          this.tableData = res.result
          this.total = res.sum
        }
      }).catch(() => { })
    }
  },
  mounted () {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
</style>
