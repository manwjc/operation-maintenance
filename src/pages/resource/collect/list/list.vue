<template>
  <div class="component-container">
    <header>
      <div class="head">
        <div class="task-name">一级部门：</div>
        <el-input v-model="primaryDepartment" placeholder="请输入内容" class="input-tem-name1"></el-input>
        <div class="task-name">二级部门：</div>
        <el-input v-model="secondaryDepartment" placeholder="请输入内容" class="input-tem-name1"></el-input>
        <div class="task-name">应用系统：</div>
        <el-input v-model="appSystem" placeholder="请输入内容" class="input-tem-name1"></el-input>
        <el-button class="tem-search" type="primary" @click="search">查询</el-button>
        <el-button class="tem-search" type="primary" @click="reset">重置</el-button>
      </div>
    </header>
    <div class="body-container">
      <el-button type="primary" @click="batchImport()">批量导入</el-button>
      <el-button type="primary" @click="resourceExport()">导出</el-button>
      <el-button type="primary" @click="add()">新增</el-button>
      <el-table
        :data="tableData"
        border
        style="width:100%;margin-top:15px;">
        <el-table-column
          v-for="(item, index) in tableHead"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable"
          :key="index"
          align="center">
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="dialog">
      <el-dialog
        title="导入excel"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose"
        :close-on-click-modal="false">
        <!-- <span>这是一段信息</span> -->
        <el-upload
          name="myFile"
          class="upload-demo"
          drag
          action="/resource/resourceCollect/GetExcelData"
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
          <div class="el-upload__tip" slot="tip">
            只能上传excel文件，且不超过500kb
            <el-button type="primary" class="tem-search1" @click="download">下载模板</el-button>
          </div>
        </el-upload>
        <el-table
          :data="tableDataFile"
          border
          style="width:100%;margin-top:15px;">
          <el-table-column
            v-for="(item, index) in tableHeadFile"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :sortable="item.sortable"
            :key="index"
            align="center">
          </el-table-column>
      </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveFile()" class="tem-search1">确认保存</el-button>
          <el-button type="primary" @click="dialogVisible = false" class="tem-search1">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import rbProjectDataServiceFactory from 'src/services/resource/rb-resource-services.factory.js'
  // import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
  import {formatDate} from 'src/assets/js/utility/rb-filters.js'
  import {tableHead, tableHeadFile} from '../config/options'
  const token = sessionStorage.getItem('token')

  export default {
    data () {
      return {
        // headers token
        myHeaders: {Authorization: 'Bearer ' + token},
        // 多选框模板存放的值
        multipleSelection: [],
        // 数据数组
        tableData: [],
        // 文件数组
        tableDataFile: [],
        // 表头列表
        tableHead: [],
        // 文件表头
        tableHeadFile: [],
        // 当前页
        currentPage: 1,
        // 分页每页多少行数据
        pageSize: 5,
        // 每页多少行数组
        pageSizes: [5, 10, 20],
        // 总共多少行数据
        total: 0,
        // 对话框
        dialogVisible: false,
        // self
        primaryDepartment: '',
        secondaryDepartment: '',
        appSystem: '',
        // 文件列表
        fileList: [],
        // 详情数据
        detailData: {}
      }
    },
    methods: {
      // 1 element相关方法 多选框
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
        if (num !== 1) {
          // 搜索前将当前页置为1
          this.currentPage = 1
        }
        let obj1 = {
          'pageNum': this.currentPage,
          'pageSize': this.pageSize,
          'startIndex': (this.currentPage - 1) * this.pageSize,
          'endIndex': this.currentPage * this.pageSize,
          'primaryDepartment': this.primaryDepartment.trim(),
          'secondaryDepartment': this.secondaryDepartment.trim(),
          'appSystem': this.appSystem.trim()
        }
        this.getTableData(obj1)
      },
      // 下载模板
      download () {
        rbProjectDataServiceFactory.exportGridData({
          title: '资产信息表模板'
        }).then((res) => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
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
      // 导出
      resourceExport () {
        rbProjectDataServiceFactory.resourceCollectExportGridData({
          'queryName': '',
          'headers': '一级部门,二级部门,应用系统,是否立项,立项时间,资源提出时间,资源预期投资时间,系统描述,16核、128G、200G系统磁盘,8核、64G、200G系统磁盘,8核、32G、200G系统磁盘,8核、16G、200G系统磁盘,4核、32G、200G系统磁盘,4核、16G、200G系统磁盘,4核、8G、200G系统磁盘,2核、4G、200G系统磁盘,虚拟机宿主机低端应用服务器(台),分析型服务器(MPP服务器)(台),分布式服务器(Hadoop服务器)(台),缓存型服务器(台),高端应用服务器(台),分布式文件存储(TB),分布式块存储TB),对象存储(TB),FC-SAN存储(TB),IP-SAN存储(TB),FC-SAN裸盘(TB),IP-SAN存储(TB),备份存储(TB),CMNET地址需求(个),CMNET带宽资源需求(Gbps),IP地址需求(个),至IP专网带宽(Gbps),mysql数据库,mongodb数据库,postgresql数据库,内存数据库,其它数据库,分布式缓存redis,分布式缓存Memcached,消息中间件activemq,消息中间件kafka,消息中间件rockermq,应用中间件apache,应用中间件jboos,应用中间件tomcat,负载均衡nginx,负载均衡haproxy,分布式协调服务zookeeper,分布式协调服务etcd,搜索中间件ES,镜像仓库DockerRegistry,工作流JBPM,工作流activity,镜像openjdk,镜像python,镜像go,镜像nodejs,镜像ruby,镜像net",CICDjenkins,开发框架springcloud人,其它开发框架,与前期上报需求有无变化，如有，请说明原因,物理局址要求,部门负责人,接口联系人,电话,邮箱,创建时间',
          'keys': 'primary_department,secondary_department,app_system,is_project,project_time,resource_put_date,resource_produce_date,system_description,vm_model1,vm_model2,vm_model3,vm_model4,vm_model5,vm_model6,vm_model7,vm_model8,pm_low_app_server,pm_analytical_server,pm_distributed_server,pm_cache_server,pm_high_app_server,storage_distributd_file_capacity,storage_distributd_block_performance,storage_object_capacity,storage_fc_san_capacity,storage_ip_san_capacity,storage_fc_san_naked,storage_ip_san_naked,storage_back_up,cmnet_address,bandwidth_gbps_cmnet,ip_address,bandwidth_gbps_ip,db_mysql,db_mongodb,db_postgresql,db_memory,db_other,cache_redis,cache_memcached,info_middleware_activemq,info_middleware_kafka,info_middleware_rocketmq,app_middleware_apache,app_middleware_jboos,app_middleware_tomcat,balancer_nginx,balancer_haproxy,server_zookeeper,server_etcd,search_middleware_es,server_docker_registry,stream_jbpm,stream_activity,image_openjdk,image_python,image_go,image_nodejs,image_ruby,image_net,cicd_jenkins,framework_springcloud,framework_other,special_requirement,address_requirement,department_head,inter_contact,phone,email,create_time',
          'title': 'resource_collect',
          'checkRight': true,
          'right': 'osa.monitor.alarm.showAll',
          'modulesKey': 'resource_collect_export',
          'primaryDepartment': this.primaryDepartment.trim(),
          'secondaryDepartment': this.secondaryDepartment.trim(),
          'appSystem': this.appSystem.trim()
        }).then((res) => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
          let objectUrl = URL.createObjectURL(blob)
          // window.location.href = objectUrl
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = '需求收集数据列表.xls'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
      },
      // 批量导入
      batchImport () {
        this.fileList = []
        this.tableDataFile = []
        this.dialogVisible = true
      },
      // 新增
      add () {
        this.$router.push({path: 'add', query: {id: '1'}})
      },
      // 重置
      reset () {
        this.primaryDepartment = ''
        this.secondaryDepartment = ''
        this.appSystem = ''
      },
      // 确认上传
      saveFile () {
        // console.log(this.tableDataFile, JSON.stringify(this.tableDataFile[0]))
        if (this.tableDataFile.length <= 0) {
          this.$message.warning(`请先上传并且上传文件内容不能为空`)
        } else {
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
          rbProjectDataServiceFactory.saveExcelData({
            entities: str
          }).then((res) => {
            this.dialogVisible = false
            this.tableDataFile = []
            this.fileList = []
            this.search()
            if (res.result === '保存成功') {
              this.$message.success(res.result)
            } else {
              this.$message.error(res.result)
            }
          }).catch(() => {
            this.$message.error(`保存失败`)
          })
        }
      },
      // 3 封装数据相关方法
      initData () {
        this.tableHead = tableHead
        this.tableHeadFile = tableHeadFile
        this.getTableData()
      },
      // 封装得到的数据
      packData (arr) {
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
            'pageNum': this.currentPage,
            'pageSize': this.pageSize,
            'startIndex': (this.currentPage - 1) * this.pageSize,
            'endIndex': this.currentPage * this.pageSize,
            'primaryDepartment': '',
            'secondaryDepartment': '',
            'appSystem': ''
          }
        }
        rbProjectDataServiceFactory.resourceBuildList(obj1).then((res) => {
          this.tableData = []
          this.total = 0
          this.tableData = this.packData(res.result)
          this.total = res.sum
        }).catch(() => {
          // this.$message.error(``)
        })
      }
    },
    mounted () {
      this.initData()
    }
  }
</script>

<style lang="scss" scoped>
  .component-container {
    header {
      height: 140px;
      border: 2px solid #f0f0f0;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .head {
        width:100%;
        text-align:left;
        display: block;
        .task-name {
          display: inline-block;
          margin-left: 2.7%;
        }
        .input-tem-name1 {
          width: 12.7%;
          min-width:102px;
        }
        div {
          display: inline-block;
        }
      }
    }
    .body-container {
      border: 2px solid #f0f0f0;
      margin-top: 10px;
      padding: 10px 5px;
      /deep/ .el-table {
        .el-table__body-wrapper{
          padding-bottom:60px;
          overflow-x:auto !important;
        }
      }
      .el-button {
        width: 105px;
        height: 30px;
        padding: 8px 15px;
        margin-left: 20px;
      }
      .el-button:nth-child(1) {
        margin-left: 0;
      }
      .block {
        margin-top: 30px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .dialog {
      /deep/ .el-dialog {
        min-width:670px;
        margin-top: 10vh !important;
        .el-table {
          margin-top:30px;
          .el-table__body-wrapper{
            padding-bottom:10px;
            overflow-x:auto !important;
          }
        }
        .upload-demo {
          text-align: center;
          .el-upload__input {
            display: none !important;
          }
        }
      }
    }
  }
</style>
