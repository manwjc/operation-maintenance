<template>
  <div class="components-container yw-dashboard" v-loading="loading">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="65px">
      <el-form-item label="VPN域名">
        <el-select v-model="vpn_name"
                   placeholder="请选择"
                   filterable
                   clearable
                   @change="getNetworkById(vpn_name, 'null')"
                   @clear="clearSelect('vpn')">
          <el-option v-for="item in vpn_names"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网段">
        <el-select v-model="network"
                   placeholder="请选择"
                   filterable
                   clearable>
          <el-option v-for="item in networks"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务系统">
        <el-select v-model="biz_system"
                   placeholder="请选择"
                   filterable
                   clearable>
          <el-option v-for="item in biz_systems"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分配IP">
        <el-input v-model="ip"></el-input>
      </el-form-item>
      <el-form-item label="私有云IP">
        <el-input v-model="private_ip"></el-input>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="cancel('hand')">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form"
             :inline="true">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="add.addIp = true">新增</el-button>
        <el-button type="text"
                   icon="el-icon-delete"
                   @click="startClean(null,'tableHand')">清除</el-button>
        <el-button type="text"
                   icon="el-icon-delete"
                   @click="exportAllocateIpConfig()">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="ipData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 300px)"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="vpnName"
                           label="VPN域名"></el-table-column>
          <el-table-column prop="network"
                           label="网段"
                           :show-overflow-tooltip="true"> </el-table-column>
          <el-table-column prop="bizSystem"
                           label="业务系统"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="allocateIp"
                           label="分配IP"
                           width=""
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="useTime"
                           label="分配生效时间"
                           width=""
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="cloudsIp"
                           label="私有云IP"
                           width=""
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="userInfo"
                           label="联系人"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作"
                           width="50px">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           @click="startClean(scope.row.id,'tableHand')"
                           title="删除"
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
                       layout="total, sizes, prev, pager, next, jumper">·
        </el-pagination>
      </div>
    </el-form>

    <!-- dialog -->
    <el-dialog :visible.sync="add.addIp"
               width="50%"
               center
               :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div>
        <div>
          <span style="padding-right: 20px;">VPN域名</span>
          <span>
            <el-select v-model="add.vpn_name"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 200px"
                       filterable
                       clearable
                       @change="getNetworkById(add.vpn_name, 'add')"
                       @clear="clearSelect('addVpn')">
              <el-option v-for="item in add.vpn_names"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </span>
          <span style="padding-left: 49px;padding-right: 42px;">网段</span>
          <span>
            <el-select v-model="add.network"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 200px"
                       filterable
                       clearable
                       @change="networkChange(add.network)"
                       @clear="clearSelect('addNetwork')">
              <el-option v-for="item in add.networks"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </span>
        </div>
        <div style="padding-top: 10px;">
          <span style="padding-right: 20px;">生效时间</span>
          <span>
            <el-date-picker v-model="add.start_time"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            size="mini"
                            style="width: 200px"></el-date-picker>
          </span>
          <span style="padding-left: 49px;padding-right: 55px;">至</span>
          <span>
            <el-date-picker v-model="add.end_time"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            size="mini"
                            style="width: 200px"></el-date-picker>
          </span>
        </div>
        <div style="padding-top: 10px;">
          <span style="padding-right: 20px;">业务系统</span>
          <span>
            <el-select v-model="add.biz_system"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 200px"
                       filterable
                       clearable
                       @change="bizSystemChange()">
              <el-option v-for="item in biz_systems"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </span>
        </div>
        <div style="padding-top: 10px;">
          <span style="padding-right: 32px;">联系人</span>
          <span>
            <el-select v-model="add.user"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 200px"
                       clearable
                       allow-create
                       filterable
                       @change="userListChange(add.user)"
                       @clear="clearSelect('user')">
              <el-option v-for="item in add.userList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </span>
          <span style="padding-left: 50px;padding-right: 20px;">手机号码</span>
          <span>
            <el-input style="width:200px"
                      v-model="add.userM"></el-input>
          </span>
        </div>

      </div>
      <div style="border:1px solid #D6E1E5;margin-top: 10px;">
        <div style="padding-top: 10px;padding-left: 10px;padding-bottom: 10px;">
          <span style="padding-right: 20px;">分配网段</span>
          <span id="allocate_network"></span>
          <span style="padding-right: 10px;">
            <el-input style="width:52px"
                      v-model="add.ip_start"></el-input>
          </span><span>~</span>
          <span style="padding-left: 10px;">
            <el-input style="width:52px"
                      v-model="add.ip_end"></el-input>
          </span>
          <span style="padding-left: 51px;padding-right: 20px;">私有云IP</span>
          <span>
            <el-input style="width:150px"
                      v-model="add.private_ip"></el-input>
          </span>
          <span style="padding-left: 20px;">
            <el-button type="text"
                       icon="el-icon-circle-plus-outline"
                       @click="insertAllocateIpConfig('multi')"></el-button>
          </span>
        </div>
      </div>
      <div style="border:1px solid #D6E1E5;margin-top: 10px;">
        <el-row>
          <el-col :span="24">
            <div style="padding-left: 10px;border-bottom:1px solid #D6E1E5;">
              <el-button style="font-size: 16px;"
                         type="text"
                         icon="el-icon-delete"
                         @click="startClean(null,'addTableHand')">删除</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table :data="add.ips"
                  style="width: 100%;margin-top:10px;cursor: pointer;"
                  stripe
                  tooltip-effect="dark"
                  height="calc(100vh - 500px)"
                  @selection-change="handleSelectionChange1">
          <el-table-column type="selection"
                           align="center"></el-table-column>
          <el-table-column prop="allocateIp"
                           label="分配IP"
                           align="center"></el-table-column>
          <el-table-column prop="cloudsIp"
                           label="私有云IP"
                           align="center"></el-table-column>
        </el-table>
      </div>
      <div style="padding-top: 20px">
        <el-row>
          <el-col :span="24"
                  :offset="10">
            <el-button size="small"
                       @click="cancel('add')">返 回</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- dialog -->
  </div>
</template>

<script>
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
export default {
  data () {
    return {
      multipleSelection: [],
      multipleSelection1: [],
      ipData: [],
      currentPage: 1, // 当前页
      pageSize: 20, // 分页每页多少行数据
      pageSizes: [20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      vpn_name: '',
      vpn_names: [],
      network: '',
      networks: [],
      biz_system: '',
      ip: '',
      private_ip: '',
      biz_systems: [],
      loading: false,
      add: {
        addIp: false,
        biz_system: '',
        start_time: '',
        end_time: '',
        userList: [],
        user: '',
        userM: '',
        vpn_name: '',
        vpn_names: [],
        network: '',
        networks: [],
        ip_start: '',
        ip_end: '',
        private_ip: '',
        ips: [],
        p_ip: '',
        p_private_ip: '',
        allocateIps: [],
        rangeNetwork: []
      }
    }
  },
  mounted () {
    this.getBizSysList()
    this.search()
    this.getVpnData()
    this.getUserList()
  },
  methods: {
    // 1 element相关方法 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSelectionChange1 (val) {
      this.multipleSelection1 = val
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
    // 获取业务系统
    getBizSysList () {
      let obj = {
        'type': 'bizSystem',
        'pid': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.biz_systems = res
        }
      })
    },
    cancel (val) {
      if (val === 'hand') {
        this.vpn_name = ''
        this.network = ''
        this.networks = []
        this.ip = ''
        this.private_ip = ''
        this.biz_system = ''
      } else if (val === 'add') {
        this.search()
        this.add.addIp = false
        this.add.biz_system = ''
        this.add.start_time = ''
        this.add.end_time = ''
        this.add.user = ''
        this.add.userM = ''
        this.add.vpn_name = ''
        this.add.network = ''
        this.add.networks = []
        this.add.ip_start = ''
        this.add.ip_end = ''
        this.add.private_ip = ''
        this.add.ips = []
        this.add.p_ip = ''
        this.add.p_private_ip = ''
        this.add.allocateIps = []
        this.add.rangeNetwork = []
        document.getElementById('allocate_network').innerHTML = ''
      }
    },
    getHandRequest () {
      let obj = {
        'pageNum': this.currentPage,
        'startPageNum': 0,
        'pageSize': this.pageSize,
        'vpnId': this.vpn_name ? this.vpn_name : 0,
        'networkId': this.network ? this.network : 0,
        'ip': this.ip,
        'privateIp': this.private_ip,
        'bizSystem': this.biz_system,
        'isAdd': false
      }
      if (this.$route.query.vpnId) {
        obj['vpnId'] = this.$route.query.vpnId
      }
      return obj
    },
    // 检索
    search () {
      this.getAllocateIpConfigData(this.getHandRequest())
    },
    addSearch (vpnId, networkId, bizSystem) {
      this.add.allocateIps = []
      rbCmdbServiceFactory.getAllocateIpConfigData({
        'pageNum': 0,
        'startPageNum': 0,
        'pageSize': 0,
        'vpnId': vpnId === '' ? 0 : vpnId,
        'networkId': networkId === '' ? 0 : networkId,
        'ip': '',
        'privateIp': '',
        'bizSystem': bizSystem === '' ? '' : bizSystem,
        'isAdd': true
      }).then((res) => {
        if (res.count > 0) {
          res.data.forEach((item) => {
            this.add.allocateIps.push(item.allocateIp.split('.')[3])
          })
          this.add.ips = res.data
        } else {
          this.add.ips = []
        }
      })
    },
    // 查询IP分配管理配置列表
    getAllocateIpConfigData (obj) {
      this.loading = true
      rbCmdbServiceFactory.getAllocateIpConfigData(obj).then((res) => {
        this.loading = false
        this.ipData = res.data
        this.total = res.count
      }).catch(() => {
         this.loading = false
      })
    },
    // 获取域名
    getVpnData () {
      rbCmdbServiceFactory.getVpnData().then((res) => {
        this.vpn_names = res
        this.add.vpn_names = res
      })
    },
    // 获取网段
    getNetworkById (id, type) {
      rbCmdbServiceFactory.getNetworkById(id).then((res) => {
        if (type === 'add') {
          this.add.network = ''
          this.add.networks = res
          this.addSearch(this.add.vpn_name, this.add.network, this.add.biz_system)
        } else {
          this.network = ''
          this.networks = res
        }
      })
    },
    clearSelect (val) {
      if (val === 'vpn') {
        this.network = ''
        this.networks = []
      } else if (val === 'addVpn') {
        this.add.network = ''
        this.add.networks = []
        document.getElementById('allocate_network').innerHTML = ''
      } else if (val === 'addNetwork') {
        this.network = ''
        document.getElementById('allocate_network').innerHTML = ''
      } else if (val === 'user') {
        this.add.user = ''
        this.add.userM = ''
      }
    },
    bizSystemChange () {
      this.addSearch(this.add.vpn_name, this.add.network, this.add.biz_system)
    },
    networkChange (id) {
      let obj = this.add.networks.find((item) => {
        return item.id === id
      })
      let list = obj.name.split('.')
      document.getElementById('allocate_network').innerHTML = list[0] + '.' + list[1] + '.' + list[2] + '.'
      this.add.rangeNetwork = list[3].split('/')
      this.addSearch(this.add.vpn_name, this.add.network, this.add.biz_system)
    },
    // 用户列表
    getUserList () {
      const namespace = sessionStorage.getItem('namespace')
      let arr = [namespace, {
        order_by: '-createTime',
        page_size: -1
      }]
      rbProjectDataServiceFactory.getUserList(arr).then((res) => {
        res.result.forEach((item) => {
          let obj = {
            'id': item.name + '-' + item.mobile,
            'name': item.name
          }
          this.add.userList.push(obj)
        })
      })
    },
    userListChange (id) {
      this.add.userM = ''
      let obj = this.add.userList.find((item) => {
        return item.id === id
      })
      if (obj) {
        this.add.userM = obj.id.split('-')[1]
      } else {
      }
    },
    // 添加IP配置
    getAddRequest () {
      let obj = {
        'bizSystem': this.add.biz_system,
        'startTime': this.add.start_time,
        'endTime': this.add.end_time,
        'userName': this.add.user.indexOf('-') !== -1 ? this.add.user.split('-')[0] : this.add.user,
        'userT': this.add.userM,
        'vpnId': this.add.vpn_name,
        'networkId': this.add.network
      }
      return obj
    },
    insertAllocateIpConfig (val) {
      let ipList = []
      let obj = this.getAddRequest()
      if (val === 'private') {
        if (!this.add.p_ip || this.add.p_ip < 0 || this.add.allocateIps.indexOf(this.add.p_ip) > -1) {
          this.$alert('IP不能为空或者不合法或者已存在，请填写正确的IP地址!', '警告', {
            confirmButtonText: '确定'
          })
          return
        }
        if (this.add.allocateIps.length > 0 && parseInt(this.add.p_ip) > parseInt(this.add.rangeNetwork[1])) {
          this.$alert('网段超出范围，请填写正确的IP地址!', '警告', {
            confirmButtonText: '确定'
          })
          return
        }
        obj['ip'] = document.getElementById('allocate_p_network').innerHTML + this.add.p_ip
        obj['privateIp'] = this.add.p_private_ip
      } else if (val === 'multi') {
        if (!this.add.ip_start || !this.add.ip_end || this.add.ip_start > this.add.ip_end) {
          this.$alert('IP不能为空或者不合法，请填写正确的IP地址!', '警告', {
            confirmButtonText: '确定'
          })
          return
        }
        if ((this.add.allocateIps.length > 0 && (parseInt(this.add.ip_start) < parseInt(this.add.rangeNetwork[0]) || parseInt(this.add.ip_end) > parseInt(this.add.rangeNetwork[1])))) {
          this.$alert('网段超出范围，请填写正确的IP地址!', '警告', {
            confirmButtonText: '确定'
          })
          return
        }
        obj['privateIp'] = this.add.private_ip
        for (let i = parseInt(this.add.ip_start); i <= parseInt(this.add.ip_end); i++) {
          if (this.add.allocateIps.indexOf(i.toString()) > -1) continue
          let ip = document.getElementById('allocate_network').innerHTML + i
          ipList.push(ip.toString())
        }
        obj['ips'] = ipList
      }
      if (val === 'multi' && ipList.length === 0) {
        this.$alert('IP地址均已存在，请重新填写!', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      let reg = /^1[0-9]{10}$/
      if (this.add.userM !== '' && !reg.test(this.add.userM)) {
        this.$alert('用户电话格式错误，请重新填写!', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      rbCmdbServiceFactory.insertAllocateIpConfig(obj).then((res) => {
        if (res === 'success') {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.addSearch(this.add.vpn_name, this.add.network, this.add.biz_system)
        } else {
          this.$message.error('添加失败')
        }
      })
    },
    startClean (id, type) {
      let ids = []
      let isClean = false
      if (id) {
        ids.push(id)
        isClean = true
      } else {
        let list = type === 'tableHand' ? this.multipleSelection : this.multipleSelection1
        if (list < 1) {
          this.$alert('请选择配置进行清除', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          list.forEach((item) => {
            ids.push(item.id)
          })
          isClean = true
        }
      }
      if (isClean) {
        this.$confirm('删除后无法恢复，确认删除？', {
          showClose: false
        }).then(() => {
          rbCmdbServiceFactory.deleteAllocateIpConfigById(ids.toString()).then((res) => {
            if (res === 'success') {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              if (type === 'tableHand') {
                this.search()
              } else if (type === 'addTableHand') {
                this.addSearch(this.add.vpn_name, this.add.network, this.add.biz_system)
                this.search()
              }
            } else {
              this.$message.error('删除失败')
            }
          }).catch(() => {
            this.$message.error('删除失败')
          })
        })
      }
    },
    // 导出
    exportAllocateIpConfig () {
      rbCmdbServiceFactory.exportAllocateIpConfig(this.getHandRequest()).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = 'IP分配配置数据表.xlsx'
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
