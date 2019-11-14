<template>
  <div class="components-container">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="40px">
      <el-form-item label="域名">
        <el-input v-model="domainName"></el-input>
      </el-form-item>
      <el-form-item label="网段">
        <el-input v-model="netSegment"></el-input>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="reloadTable()">查询</el-button>
        <el-button>重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form"
             :inline="true">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="showAddDialog">新增</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  @selection-change="handleSelectionChange"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 320px)">
          <el-table-column type="selection"
                           fixed
                           width="55"> </el-table-column>
          <el-table-column label="id"
                           prop="id"
                           width="80"
                           v-if="false"></el-table-column>
          <el-table-column label="VPN域名"
                           prop="domain"
                           width="100"></el-table-column>
          <el-table-column label="规划网段"
                           prop="network_segment"
                           width="150"></el-table-column>
          <el-table-column label="已分配"
                           width="80">

            <template slot-scope="scope">
              <a @click="goIpConfig(scope.row.id )">{{scope.row.allocate_sum}}</a>

            </template>
          </el-table-column>
          <el-table-column label="描述说明"
                           prop="description"
                           width="250"></el-table-column>
          <el-table-column label="联系人"
                           prop="user_name"
                           width="100"></el-table-column>
          <el-table-column label="手机"
                           prop="telephone"
                           width="100"></el-table-column>

          <el-table-column label="操作"
                           width="100">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button @click="showUpdateDialog(scope.row.id)"
                           type="text"
                           icon="el-icon-edit-outline"></el-button>
                <el-button @click="deleteDomine(scope.row.id,scope.row.allocate_sum)"
                           type="text"
                           icon="el-icon-delete"></el-button>
              </div>
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
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-form>

    <!-- dialog -->
    <el-dialog :visible.sync="ifshowAddDialog"
               width="50%"
               center
               :show-close="false"
               :close-on-click-modal="false">
      <div style="margin-left: 20px;   padding-left: 10px">
        <div>
          <el-row>
            <el-col :span="5">
              <div><span><label style="font-size:16px">新增域名</label></span></div>
            </el-col>

          </el-row>

        </div>

        <div style="padding-top: 10px;">
          <span style="padding-right: 32px;">域名</span>

          <span>
            <el-select v-model="add.domainName"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 200px;margin-left:24px"
                       filterable
                       clearable
                       @change="checkAddDomain">
              <el-option v-for="item in add.domainList"
                         :key="item.name"
                         :label="item.name"
                         :value="item.name"></el-option>
            </el-select>
          </span>

        </div>

        <div style="padding-top: 10px;">
          <span style="padding-right: 32px;">规划网段</span>
          <span>
            <el-input v-model="add.netSeg1"
                      style="width:60px"></el-input>
          </span>
          <span>
            <el-input v-model="add.netSeg2"
                      style="width:60px"></el-input>
          </span>
          <span>
            <el-input v-model="add.netSeg3"
                      style="width:60px"></el-input>
          </span>
          <span>
            <el-input v-model="add.netSeg4"
                      style="width:60px"></el-input>
          </span>
          <span style="width:60px">&nbsp;/&nbsp;</span>

          <span>
            <el-input v-model="add.netSeg5"
                      style="width:60px"></el-input>
          </span>

          <span style="padding-left: 20px; ">
            <el-button type="text"
                       style="font-size: 16px;"
                       icon="el-icon-circle-plus-outline"
                       @click="addTempNetSegment()"></el-button>
          </span>

        </div>

        <div style="border:1px solid #D6E1E5;margin-top: 10px; margin-right: 40px">

          <el-table :data="add.netSegments"
                    height="300"
                    style="width: 100%;margin-top:10px;cursor: pointer;"
                    stripe
                    tooltip-effect="dark">
            <el-table-column type="selection"
                             align="center"></el-table-column>
            <el-table-column prop="netSeg"
                             label="网段"
                             width="180"
                             align="center"></el-table-column>
            <el-table-column label="操作"
                             width="160">
              <template slot-scope="scope">
                <el-button @click="deleteTempNetSegment(scope.$index)"
                           type="text"
                           size="small">删除</el-button>

              </template>
            </el-table-column>
          </el-table>
        </div>

        <div style="padding-top: 10px; margin-top: 15px">
          <span style="padding-right: 32px;">描述说明</span>
          <span>
            <el-input v-model="add.description"
                      style="width:275px;margin-left:-10px "></el-input>
          </span>

        </div>

        <div style="padding-top: 10px;">
          <span style="padding-right: 32px;">联系人</span>
          <span>
            <el-select v-model="add.user_name"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 200px"
                       filterable
                       clearable
                       @change="addUserListChange(add.user_name)"
                       @clear="clearSelect('adduser')">
              <el-option v-for="item in add.userList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </span>
          <span style="padding-left: 50px;padding-right: 20px;">手机号码</span>
          <span>
            <el-input v-model="add.telephone"
                      style="width:200px"></el-input>
          </span>
        </div>

        <div style="padding-top: 20px">
          <el-row>
            <el-col :span="24"
                    :offset="8">
              <el-button type="primary"
                         size="small"
                         @click="addDomain">确 定</el-button>
              <el-button size="small"
                         @click="closeAddDialogDate()">取 消</el-button>
            </el-col>
          </el-row>
        </div>

      </div>

    </el-dialog>

    <el-dialog :visible.sync="ifshowUpdateDialog"
               width="50%"
               center
               :show-close="false"
               :close-on-click-modal="false">
      <div style="margin-left: 20px;   padding-left: 10px">
        <div>
          <el-row>
            <el-col :span="5">
              <div><span><label style="font-size:16px">修改域名</label></span></div>
            </el-col>

          </el-row>

        </div>

        <div style="padding-top: 10px;">
          <span style="padding-right: 32px;">域名</span>
          <span>
            <el-select v-model="update.domainName"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 200px;margin-left:24px"
                       filterable
                       clearable
                       @change="checkUpdateDomain">
              <el-option v-for="item in update.domainList"
                         :key="item.name"
                         :label="item.name"
                         :value="item.name"></el-option>
            </el-select>
          </span>
        </div>

        <div style="padding-top: 10px;">
          <span style="padding-right: 32px;">规划网段</span>
          <span>
            <el-input v-model="update.netSeg1"
                      style="width:60px"></el-input>
          </span>
          <span>
            <el-input v-model="update.netSeg2"
                      style="width:60px"></el-input>
          </span>
          <span>
            <el-input v-model="update.netSeg3"
                      style="width:60px"></el-input>
          </span>
          <span>
            <el-input v-model="update.netSeg4"
                      style="width:60px"></el-input>
          </span>
          <span style="width:60px">&nbsp;/&nbsp;</span>

          <span>
            <el-input v-model="update.netSeg5"
                      style="width:60px"></el-input>
          </span>

          <span style="padding-left: 20px; ">
            <el-button type="text"
                       style="font-size: 16px;"
                       icon="el-icon-circle-plus-outline"
                       @click="addUpdateTempNetSegment()"></el-button>
          </span>

        </div>

        <div style="border:1px solid #D6E1E5;margin-top: 10px; margin-right: 40px">

          <el-table :data="update.netSegments"
                    height="300"
                    style="width: 100%;margin-top:10px;cursor: pointer;"
                    stripe
                    tooltip-effect="dark">
            <el-table-column type="selection"
                             align="center"></el-table-column>
            <el-table-column prop="netSeg"
                             label="网段"
                             width="180"
                             align="center"></el-table-column>
            <el-table-column label="操作"
                             width="160">
              <template slot-scope="scope">
                <el-button @click="deleteUpdateTempNetSegment(scope.$index)"
                           type="text"
                           size="small">删除</el-button>

              </template>
            </el-table-column>
          </el-table>
        </div>

        <div style="padding-top: 10px; margin-top: 15px">
          <span style="padding-right: 32px;">描述说明</span>
          <span>
            <el-input v-model="update.description"
                      style="width:275px;margin-left:-10px"></el-input>
          </span>

        </div>

        <div style="padding-top: 10px;">
          <span style="padding-right: 32px;">联系人</span>

          <span>
            <el-select v-model="update.user_name"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 200px"
                       filterable
                       clearable
                       @change="updateUserListChange(update.user_name)"
                       @clear="clearSelect('updateuser')">
              <el-option v-for="item in update.userList"
                         :key="item.id"
                         :label="item.id"
                         :value="item.id"></el-option>
            </el-select>
          </span>
          <span style="padding-left: 50px;padding-right: 20px;">手机号码</span>
          <span>
            <el-input v-model="update.telephone"
                      style="width:200px"></el-input>
          </span>
        </div>

        <div style="padding-top: 20px">
          <el-row>
            <el-col :span="24"
                    :offset="8">
              <el-button type="primary"
                         size="small"
                         @click="updateDomain">确 定</el-button>
              <el-button size="small"
                         @click="closeUpdateDialogDate()">取 消</el-button>
            </el-col>
          </el-row>
        </div>

      </div>

    </el-dialog>
    <!-- dialog -->
  </div>
</template>

<script>
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
import rbAllocateServiceFactory from 'src/services/cmdb/rb-allocate-services.factory.js'
import configDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
export default {
  props: ['moduleId', 'moduleName', 'tabIndex'],
  data () {
    return {
      hostnet: '0',
      domainName: '',
      netSegment: '',
      currentPage: 1, // 当前页
      pageSize: 5, // 分页每页多少行数据
      pageSizes: [5, 10, 20], // 每页多少行数组
      total: 0, // 总共多少条数据
      tableData: [],
      ifshowAddDialog: false,
      ifshowUpdateDialog: false,

      tableMultipleSelect: [],
      add: {
        checkdomain: true,
        domainName: '',
        domainList: [],
        netSeg1: '',
        netSeg2: '',
        netSeg3: '',
        netSeg4: '',
        netSeg5: '',
        netSegments: [],
        description: '',
        userList: [],
        user_name: '',
        telephone: ''

      },
      update: {
        checkdomain: true,
        olddomainName: '',
        id: '',
        domainName: '',
        domainList: [],
        netSeg1: '',
        netSeg2: '',
        netSeg3: '',
        netSeg4: '',
        netSeg5: '',
        netSegments: [],
        description: '',
        userList: [],
        user_name: '',
        telephone: ''

      }
    }
  },
  mounted () {
    this.reloadTable()
    //
    this.getUserList()
    this.getDomainList()
  },
  methods: {
    reloadTable (num) {
      if (num !== 1) {
        // 搜索前将当前页置为1
        this.currentPage = 1
      }
      this.getPageData()
    },
    getPageData () {
      // this.tableData = tempdata.dataList
      if (!this.moduleId) {
        return
      }
      var obj = {
        'page_no': this.currentPage,
        'page_size': this.pageSize,
        'system_id': this.moduleId,
        'hostnet': this.hostnet,
        'domain': this.domainName,
        'ipadress': this.netSegment
      }
      //  console.log(obj)
      rbAllocateServiceFactory.listDomineByPage(obj).then((res) => {
        this.tableData = this.packData(res.result)
        this.total = res.count
      })
    },
    packData (arr) {
      // 列表数据封装
      if (arr.forEach) {
        arr.forEach((item) => {
          item.allocate_sum = item.allocate_sum !== null ? item.allocate_sum : 0
        })
        return arr
      }
    }, // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.reloadTable(1)
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.reloadTable(1)
    },
    showAddDialog () {
      this.ifshowAddDialog = true
    },
    addTempNetSegment () {
      var temp = this.add.netSeg1 + '.' + this.add.netSeg2 + '.' + this.add.netSeg3 + '.' +
        this.add.netSeg4 + '/' + this.add.netSeg5
      var myreg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if (!myreg.test(temp)) {
        this.$alert('网段格式错误', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      var flag = false
      this.add.netSegments.forEach((item) => {
        if (temp === item.netSeg) {
          flag = true
        }
      })
      if (flag === true) {
        this.$alert('网段重复', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      var objnet = {
        hostnet: this.hostnet,
        netseg: temp
      }

      rbAllocateServiceFactory.selectNetsegmentByName(objnet).then((res) => {
        if (res.network_segment !== null) {
          this.$message.error('网段存在')
        } else {
          var obj = { netSeg: temp }
          this.add.netSegments.push(obj)
          this.add.netSeg1 = ''
          this.add.netSeg2 = ''
          this.add.netSeg3 = ''
          this.add.netSeg4 = ''
          this.add.netSeg5 = ''
        }
      })
      // this.alertList.push({alertId: item.alertId})
      // alert(this.add.netSegments)
    },
    deleteTempNetSegment (index) {
      // alert(index)
      this.add.netSegments.splice(index, 1)
      // this.alertList.push({alertId: item.alertId})
    },
    // 用户列表
    getUserList () {
      const namespace = sessionStorage.getItem('namespace')
      let arr = [namespace, {
        order_by: '-createTime',
        page_size: -1
      }]
      rbProjectDataServiceFactory.getUserList(arr).then((res) => {
        // console.log('userList  ' + res.result)
        res.result.forEach((item) => {
          let obj = {
            'id': item.name,
            'mobile': item.mobile
          }
          this.add.userList.push(obj)
          this.update.userList.push(obj)
        })
      })
    },
    addUserListChange (id) {
      let obj = this.add.userList.find((item) => {
        return item.id === id
      })
      this.add.telephone = obj.mobile
    },
    addDomain () {
      if (!this.add.checkdomain) {
        this.$alert('域名重复', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      if (!this.add.domainName) {
        this.$alert('域名不能为空', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      if (this.add.netSegments.length === 0) {
        this.$alert('网段不能为空', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      if (!this.add.user_name) {
        this.$alert('用户名不为空', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(this.add.telephone)) {
        this.$alert('手机格式不正确', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      var str = ''
      this.add.netSegments.forEach((item) => {
        str += item.netSeg + ','
      })
      str = str.slice(0, -1)
      var obj = {
        'system_id': this.moduleId,
        'hostnet': this.hostnet,
        'domain': this.add.domainName,
        'user_name': this.add.user_name,
        'telephone': this.add.telephone,
        'description': this.add.description,
        'network_segment': str
      }
      // console.log(obj)
      rbAllocateServiceFactory.insertDomain(obj).then((res) => {
        // console.log(1111)
        if (res === 'success') {
          this.$message.success('新增成功')
        } else {
          this.$message.error('新增失败')
        }
        this.reloadTable(1)
      }).catch((res) => {
        this.$message.error('新增失败')
      })
      this.closeAddDialogDate()
    },
    closeAddDialogDate () {
      this.clearAddDialogDate()
      this.ifshowAddDialog = false
    },
    clearAddDialogDate () {
      this.add.domainName = ''
      this.add.netSeg1 = ''
      this.add.netSeg2 = ''
      this.add.netSeg3 = ''
      this.add.netSeg4 = ''
      this.add.netSeg5 = ''
      this.add.netSegments = []
      this.add.description = ''
      this.add.user_name = ''
      this.add.telephone = ''
    },
    showUpdateDialog (id) {
      var obj = {
        id: id
      }
      rbAllocateServiceFactory.selectDomainById(obj).then((res) => {
        // console.log(res)
        var obj01 = res
        this.update.id = obj01.id
        this.update.checkdomain = true
        this.update.olddomainName = obj01.domain
        this.update.domainName = obj01.domain
        var str = obj01.network_segment
        if (str !== null) {
          var netSegmentsarr = str.split(',')
          netSegmentsarr.forEach((item) => {
            var netWork = { netSeg: item }
            this.update.netSegments.push(netWork)
          })
        }
        // this.update.netSegments = netSegmentsarr
        this.update.description = obj01.description
        this.update.user_name = obj01.user_name
        this.update.telephone = obj01.telephone
      })
      // this.update.telephone = 'hello'
      this.ifshowUpdateDialog = true
    },
    updateUserListChange (id) {
      let obj = this.update.userList.find((item) => {
        return item.id === id
      })
      this.update.telephone = obj.mobile
    },
    addUpdateTempNetSegment () {
      var temp = this.update.netSeg1 + '.' + this.update.netSeg2 + '.' + this.update.netSeg3 + '.' +
        this.update.netSeg4 + '/' + this.update.netSeg5
      var myreg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if (!myreg.test(temp)) {
        this.$alert('网段格式错误', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      var flag = false
      this.update.netSegments.forEach((item) => {
        if (temp === item.netSeg) {
          flag = true
        }
      })

      if (flag === true) {
        this.$alert('网段重复', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      var objnet = {
        hostnet: this.hostnet,
        netseg: temp
      }

      rbAllocateServiceFactory.selectNetsegmentByName(objnet).then((res) => {
        if (res.network_segment !== null) {
          this.$message.error('网段存在')
        } else {
          var obj = { netSeg: temp }
          this.update.netSegments.push(obj)
          this.update.netSeg1 = ''
          this.update.netSeg2 = ''
          this.update.netSeg3 = ''
          this.update.netSeg4 = ''
          this.update.netSeg5 = ''
        }
      })
      // this.alertList.push({alertId: item.alertId})
      // alert(this.add.netSegments)
    },
    deleteUpdateTempNetSegment (index) {
      // alert(index)
      this.update.netSegments.splice(index, 1)
      // this.alertList.push({alertId: item.alertId})
      // alert(this.add.netSegments)
    },
    updateDomain () {
      console.log(this.update.checkdomain)
      if (!this.update.checkdomain) {
        this.$alert('域名重复', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      if (!this.update.domainName) {
        this.$alert('域名不能为空', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      if (this.update.netSegments.length === 0) {
        this.$alert('网段不能为空', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      if (!this.update.user_name) {
        this.$alert('用户名不为空', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(this.update.telephone)) {
        this.$alert('手机格式不正确', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      var str = ''
      this.update.netSegments.forEach((item) => {
        str += item.netSeg + ','
      })
      str = str.slice(0, -1)
      var obj = {
        'system_id': this.moduleId,
        'hostnet': this.hostnet,
        'id': this.update.id,
        'domain': this.update.domainName,
        'user_name': this.update.user_name,
        'telephone': this.update.telephone,
        'description': this.update.description,
        'network_segment': str

      }
      // console.log(obj)
      rbAllocateServiceFactory.updateDomain(obj).then((res) => {
        // console.log(2222222)
        if (res === 'success') {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
        this.reloadTable(1)
      }).catch((res) => {
        // console.log(res)
        this.$message.error('修改失败')
      })
      this.closeUpdateDialogDate()
    },
    closeUpdateDialogDate () {
      this.clearUpdateDialogDate()
      this.ifshowUpdateDialog = false
    },
    clearUpdateDialogDate () {
      this.update.domainName = ''
      this.update.netSeg1 = ''
      this.update.netSeg2 = ''
      this.update.netSeg3 = ''
      this.update.netSeg4 = ''
      this.update.netSeg5 = ''
      this.update.netSegments = []
      this.update.description = ''
      this.update.user_name = ''
      this.update.telephone = ''
    },
    clearSelect (val) {
      if (val === 'adduser') {
        this.add.user_name = ''
        this.add.telephone = ''
      }

      if (val === 'updateuser') {
        this.update.user_name = ''
        this.update.telephone = ''
      }
    },
    handleSelectionChange (val) {
      // this.alertList = []
      this.tableMultipleSelect = val
      val.forEach(item => {
        //  this.alertList.push({alertId: item.alertId})
      })
    },
    showdeleteDialog () {
      if (this.tableMultipleSelect.length < 1) {
        this.$alert('请选择域名进行删除', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        // this.ifshowDomeDialog = true
      }
    },
    deleteDomine (id, sum) {
      if (sum !== 0) {
        this.$alert('域名下已有ip分配无法删除', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('此操作将删除该域名, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'/* ,
          type: 'warning' */
      }).then(() => {
        var obj = {
          id: id
        }
        rbAllocateServiceFactory.deleteDomineById(obj).then((res) => {
          // this.total = res.count
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.reloadTable()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        })
      })
    },
    goIpConfig (obj) {
      // alert(obj)
      this.$router.push({
        path: '/resource/ipoperate/operate',
        query: {
          vpnId: obj
        }
      })
    },
    checkAddDomain () {
      var obj = {
        hostnet: this.hostnet,
        domain: this.add.domainName
      }
      this.add.checkdomain = true
      rbAllocateServiceFactory.selectDomainByName(obj).then((res) => {
        if (res.domain !== null) {
          this.add.checkdomain = false
          this.$message.error('域名存在')
        }
      })
    },
    checkUpdateDomain () {
      var obj = {
        hostnet: this.hostnet,
        domain: this.update.domainName
      }
      this.update.checkdomain = true
      rbAllocateServiceFactory.selectDomainByName(obj).then((res) => {
        if (res.domain !== null && res.domain !== this.update.olddomainName) {
          this.update.checkdomain = false
          this.$message.error('域名存在')
        }
      })
    },
    getDomainList () {
      var obj = {
        type: 'domain'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        res.forEach((item) => {
          let obj = {
            'name': item.name,
            'value': item.value
          }
          this.add.domainList.push(obj)
          this.update.domainList.push(obj)
        })
      })
    }
  },
  watch: {
    moduleId (curVal, oldVal) {
      this.moduleId = curVal

      if (this.tabIndex === 'bear') {
        // alert(this.moduleId)
        this.reloadTable()
      }
    },
    moduleName (val) {
      this.moduleName = val
    },
    tabIndex (obj) {
      if (obj === 'bear') {
        this.reloadTable(1)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
</style>

