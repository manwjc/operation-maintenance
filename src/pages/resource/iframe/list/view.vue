<template>
    <div @click="router()" class="resourceManagement">
        <div class="managementRight">
            <div class="condition">
                <div class="content">
                    <div class="center" :class="{PODHeightZ:PODheightZ}">
                        <div>资源池</div>
                        <div class="POD">
                            <p class="PODZ" v-for="item in poolList" :key = "item.id"  @click="pool(item.value)" :class='item.value==queryForm.idcType?"poolColor":""'><span></span>{{item.name}}</p>
                        </div>
                            <div v-show="ZYC" class="moreClass" @click="MoreZ()" v-if="moreIconZ">更多<i class="el-icon-arrow-down"></i></div>
                            <div class="moreClass moreClassRight" @click="MoreUPZ()" v-else>收起<i class="el-icon-arrow-up"></i></div>
                    </div>
                    <div class="center" :class="{PODHeightS:PODheightS}">
                        <div>设备分类</div>
                        <div class="POD">
                            <p class="PODS" v-for="item in deviceClassList" :key = "item.id"  @click="equipment(item.value, item.id)" :class='item.value==queryForm.deviceClass?"equipmentColor":""'><span></span>{{item.name}}</p>
                        </div>
                            <div v-show="SHFL" class="moreClass" @click="MoreS()" v-if="moreIconS">更多<i class="el-icon-arrow-down"></i></div>
                            <div class="moreClass moreClassRight" @click="MoreUPS()" v-else>收起<i class="el-icon-arrow-up"></i></div>
                    </div>
                    <div class="center" :class="{PODHeight:PODheight}">
                        <div>POD池</div>
                        <div class="POD">
                            <p class="PODp" v-for="item in podList" :key = "item.id"  @click="selectPod(item.value)" :class='item.value==queryForm.pod?"PODColor":""'><span></span>{{item.name}}</p>
                        </div>
                        <div v-show="pod" class="moreClass" @click="More()" v-if="moreIcon">更多<i class="el-icon-arrow-down"></i></div>
                        <div class="moreClass moreClassRight" @click="MoreUP()" v-else>收起<i class="el-icon-arrow-up"></i></div>
                    </div>
                    <div class="down" :class="{activeDown0:inputHome}">
                        <div class="heightQuery" :class="{activeDown:inputHome}">高级查询</div>
                        <div class="selectQuery" :class="{activeDown1:inputHome}">
                            <p style="margin-left:4px;">
                              <el-input v-model="queryForm.ip" placeholder="设备管理IP" :clearable = "true" @blur="blurQuery"></el-input>
                            </p>
                            <p>
                              <el-select v-model="queryForm.deviceType" placeholder="设备分类" filterable :clearable = "true" @change="changeQuery">
                                <el-option v-for="item in deviceTypeList" :key="item.id" :label="item.name" :value="item.value" prefix-icon="el-icon-search"></el-option>
                              </el-select>
                            </p>
                            <p>
                              <el-select v-model="queryForm.department1" placeholder="一级部门" filterable :clearable = "true" @change="changeDepartment1">
                                <el-option v-for="item in department1List" :key="item.id" :label="item.name" :value="item.value" prefix-icon="el-icon-search"></el-option>
                              </el-select>
                            </p>
                            <p>
                              <el-select v-model="queryForm.department2" placeholder="二级部门" filterable :clearable = "true" @change="changeDepartment2">
                                <el-option v-for="item in department2List" :key="item.id" :label="item.name" :value="item.value" prefix-icon="el-icon-search"></el-option>
                              </el-select>
                            </p>
                            <p>
                              <el-select v-model="queryForm.bizSystem" placeholder="业务系统" filterable :clearable = "true" @change="changeQuery">
                                <el-option v-for="item in bizSystemList" :key="item.id" :label="item.name" :value="item.value" prefix-icon="el-icon-search"></el-option>
                              </el-select>
                            </p>
                            <div @click="showInput" v-if="conditionShow">更多<i class="el-icon-arrow-down"></i></div>
                            <div @click="showInput" style="margin-right:0" v-else>收起<i class="el-icon-arrow-up"></i></div>
                            <div @click="emptyScreening(true)">清空筛选</div>
                            <div v-show="inputShow">
                              <p>
                                <el-input v-model="queryForm.deviceName" placeholder="设备名称" :clearable = "true" @blur="blurQuery"></el-input>
                              </p>
                              <p>
                                <el-input v-model="queryForm.deviceSN" placeholder="设备序列号" :clearable = "true" @blur="blurQuery"></el-input>
                              </p>
                              <p>
                                <el-input v-model="queryForm.deviceModel" placeholder="设备型号" :clearable = "true" @blur="blurQuery"></el-input>
                              </p>
                              <p>
                                <el-input v-model="queryForm.room" placeholder="机房位置" :clearable = "true" @blur="blurQuery"></el-input>
                              </p>
                              <p>
                                <el-input v-model="queryForm.deviceProject" placeholder="项目名称" :clearable = "true" @blur="blurQuery"></el-input>
                              </p>
                              <p>
                                <el-select v-model="queryForm.deviceStatus" placeholder="设备运行状态" filterable :clearable = "true" @change="changeQuery">
                                  <el-option v-for="item in deviceStatusList" :key="item.id" :label="item.name" :value="item.value" prefix-icon="el-icon-search"></el-option>
                                </el-select>
                              </p>
                              <p>
                                <el-select v-model="queryForm.maintenanceFactory" placeholder="维保厂家" filterable :clearable = "true" @change="changeQuery">
                                  <el-option v-for="item in maintenanceFactoryList" :key="item.id" :label="item.name" :value="item.value" prefix-icon="el-icon-search"></el-option>
                                </el-select>
                              </p>
                              <p>
                                <el-select v-model="queryForm.mfrFactory" placeholder="品牌" filterable :clearable = "true" @change="changeQuery">
                                  <el-option v-for="item in mfrFactoryList" :key="item.id" :label="item.name" :value="item.value" prefix-icon="el-icon-search"></el-option>
                                </el-select>
                              </p>
                              <p>
                                <el-input v-model="queryForm.deptOperation" placeholder="维护部门" :clearable = "true" @blur="blurQuery"></el-input>
                              </p>
                              <p>
                                <el-input v-model="queryForm.ops" placeholder="维护人员" :clearable = "true" @blur="blurQuery"></el-input>
                              </p>
                              <p style="display: -webkit-inline-box;margin: 1px -9px;">
                                <el-date-picker v-model="insertTime" style="width: 280px" type="daterange" range-separator="至"
                                                start-placeholder="设备录入日期" end-placeholder="设备录入日期" value-format="yyyy-MM-dd" @change="changeQuery">
                                </el-date-picker>
                              </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form">
                <div class="tableBotton">
                    <div class="left">
                         <el-button type="primary" v-show="queryForm.moduleId" @click="add()">新增</el-button>
                        <el-menu class="el-menu-button" :default-active="activeIndex" mode="horizontal" v-show="!queryForm.moduleId" style="margin-top:-5px">
                          <el-submenu index="1">
                            <template slot="title">
                              <el-button type="primary">新增</el-button>
                            </template>
                            <el-submenu v-for="(item, index) in moduleList"
                                        :index="item.id"
                                        :key="index">
                              <template slot="title">{{item.name}}</template>
                              <div style="min-height:100px;max-height: 150px;overflow-y: auto">
                                <el-menu-item
                                  v-if="item.childModules && item.childModules.length > 0"
                                  v-for="(child, childIdx) in item.childModules"
                                  :index="child.id"
                                  :key="childIdx"
                                  @click="handleSelect(child)">{{child.name}}
                                  </el-menu-item>
                              </div>
                              <!-- <el-submenu
                                  v-for="(child, childIdx) in item.childModules"
                                  :index="child.id"
                                  :key="childIdx">
                                <el-menu-item :index="child.id">{{child.name}}</el-menu-item>
                              </el-submenu> -->
                            </el-submenu>
                          </el-submenu>
                        </el-menu>
                        <el-button type="primary" @click="importInstance()">导入</el-button>
                        <el-button @click="exportData()">导出</el-button>
                    </div>
                    <div class="right">
                        <el-button v-popover:popover>选择列</el-button>
                        <el-popover ref="popover" placement="top" trigger="click">
                          <div id="popover"
                               class="choose-column-popover">
                            <el-checkbox-group v-model="selectColumns"
                                               @change="handleCheckedColumnChange">
                              <div v-for="column in checkColumns">
                                <el-checkbox :label="column.keyCode">{{ column.keyName }}</el-checkbox>
                              </div>
                            </el-checkbox-group>
                          </div>
                        </el-popover>
                    </div>
                </div>
                <div class="yw-el-table-wrap table">
                    <div style="border:1px solid #DEE9FC">
                        <el-table
                                stripe
                                class="yw-el-table"
                                :data="instanceDataList"
                                style="width: 100%"
                                height="calc(100vh - 420px)"
                                :default-sort = "{prop: 'date', order: 'descending'}"
                                :header-cell-style="{background:'#E8F0FC',color:'#3A4154',height:'19px'}"
                            >
                          <el-table-column type="selection" width="40"></el-table-column>
                           <!-- sortable="custom" -->
                          <el-table-column prop="ip" label="管理IP" width="120" fixed sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                              <el-button style="text-decoration:none" type="text" align="left" @click="toDetail(scope.row.id)">{{scope.row.ip}}</el-button>
                            </template>
                          </el-table-column>
                          <el-table-column prop="device_name" label="设备名称" fixed sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                              <el-button style="text-decoration:none" type="text" align="left" @click="toDetail(scope.row.id)">{{scope.row.device_name}}</el-button>
                            </template>
                          </el-table-column>
                          <el-table-column prop="insert_time" label="创建时间" width="130" fixed sortable show-overflow-tooltip></el-table-column>
                          <el-table-column prop="update_time" label="最后更新时间" width="130" fixed sortable show-overflow-tooltip></el-table-column>
                          <div v-for="(item, index) in checkColumns" :key="index">
                            <el-table-column :key="Math.random()"
                                             :prop="item.keyCode"
                                             :label="item.keyName"
                                             v-if="showColumn(item.keyCode)"
                                             sortable
                                             :width="customWidth(item.keyName)"
                                             show-overflow-tooltip>
                            </el-table-column>
                          </div>
                          <el-table-column label="操作" width="60" fixed="right">
                            <template slot-scope="scope">
                              <div class="yw-table-operator">
                                <el-button type="text" @click="toUpdate(scope.row.id)" icon="el-icon-edit"></el-button>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                        <YwPagination @handleSizeChange="handleSizeChange"
                                      @handleCurrentChange="handleCurrentChange"
                                      :current-page="paginationData.currentPage"
                                      :page-sizes="paginationData.selectPageSizes"
                                      :page-size="paginationData.pageSize"
                                      :total="paginationData.total"></YwPagination>
                    </div>
                </div>
                <importInstances ref="importInstances"
                                 v-if="display.isImport"
                                 :showImport="display.isImport"
                                 @setImportDisplay="setImportDisplay"
                                 :importType="importType"></importInstances>
            </div>
        </div>
    </div>
</template>
<script>
import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
export default {
    props: ["queryType", "parentParams"],
    components: {
      importInstances: () => import('src/pages/cmdb/v2/instance/import/import-instance.vue'),
      YwPagination: () => import('src/components/common/yw-pagination.vue'),
    },
    data(){
        return {
            activeIndex: '1',
            queryParams: this.parentParams || {},
            queryKeys: ['moduleId', 'idcType', 'pod', 'deviceClass', 'deviceType', 'deviceModel', 'department1',
              'department2', 'bizSystem', 'ip', 'deviceName', 'deviceSN', 'room', 'deviceProject', 'deviceStatus',
              'maintenanceFactory', 'mfrFactory', 'startInsertTime', 'endInsertTime', 'deptOperation', 'ops'],
            moreIcon: true,
            moreIconZ: true,
            moreIconS: true,
            PODheightZ: false,
            PODheightS: false,
            PODheight: false,
            ZYC: false,
            SHFL: false,
            pod: false,
            importType: 'instance',
            display: {
              isImport: false,
              isEdit: false,
              isSearchPlane: false,
              isBatchUpdate: false
            },
            conditionShow: true,
            inputHome:false,
            inputShow:false,
            insertTime: '',
            queryForm: {
              moduleId: '',
              idcType: '',
              pod: '',
              deviceClass: '',
              deviceType: '',
              deviceModel: '',
              department1: '',
              department2: '',
              bizSystem: '',
              ip: '',
              deviceName: '',
              deviceSN: '',
              room: '',
              deviceProject: '',
              deviceStatus: '',
              maintenanceFactory: '',
              mfrFactory: '',
              startInsertTime: '',
              endInsertTime: '',
              deptOperation: '',
              ops: ''
            },
            allDictList: [], //所有的设备字典
            poolList: [], //资源池列表
            deviceClassList: [], //设备分类列表
            deviceTypeList: [], //设备类型列表
            podList: [], //POD池列表
            department1List: [], //一级部门列表
            department2List: [], //二级部门列表
            bizSystemList: [], //业务系统列表
            deviceStatusList: [], //设备运行状态
            maintenanceFactoryList: [], //维保厂家
            mfrFactoryList: [], //品牌
            checkColumns: [], //选择列
            column_data: {},
            columnList: [],
            selectColumns: ['ip', 'device_name', 'insert_time', 'update_time'], //默认展示的项
            dbFilterData: {}, //数据中保存的选择列值
            instanceDataList: [], //主机数据集合
            multipleSelection: [],
            multipleSelectionAll: [],
            paginationData: {
              currentPage: 1,
              total: 0,
              pageSize: 50,
              selectPageSizes: [30, 50, 100],
              sort: 'insert_time',
              order: 'desc'
            },
            moduleList: [] //模型列表
        }
    },
    watch: {
      parentParams (val) {
        console.log(val)
        this.queryParams = val
        this.initParams()
        if (val.moduleId) {
          this.queryForm.moduleId = val.moduleId
          this.queryInstanceHeader()
        }
        this.multipleSelectionAll = []
        this.searchInstanceList()
      }
    },
    created () {
      if (this.$route.query.parentParams) {
        this.queryParams = this.$route.query.parentParams
      }
      this.initParams()
    },
    mounted: function () {
      //初始化字典值
      this.initDict()
      //获取当前模型的过滤列
      this.getColumnFilter()
      //获取表格数据信息
      this.searchInstanceList()
      if (!this.queryForm.moduleId) {
        this.queryModuleList()
      }
    },
    methods: {
        router() {
            // console.log('this.$route.query.name', this.$route.query.name,this.$route.query.seriesName)
        },
        initParams () {
          let _t = this
          this.queryKeys.forEach((item) => {
            _t.queryForm[item] = ''
          })
          if (_t.queryParams && Object.keys(_t.queryParams).length > 0) {
            Object.keys(_t.queryParams).forEach((item2) => {
              _t.queryForm[item2] = _t.queryParams[item2]
            })
          }
          if (_t.queryForm['startInsertTime'] && _t.queryForm['endInsertTime']) {
            _t.insertTime = [_t.queryForm['startInsertTime'], _t.queryForm['endInsertTime']]
          }
        },
        // POD池更多
        More(){
          this.rbHttp.sendRequest({
            method: 'GET',
            params: { 'type': 'pod_name' },
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
              this.podList = this.fillSelectOption(res, 'pod_name')
              this.moreIcon = !this.moreIcon
              if(this.podList.length > 12) {
                this.PODheight = true
              }
          })
        },
        MoreUP() {
          this.rbHttp.sendRequest({
            method: 'GET',
            params: { 'type': 'pod_name' },
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
              this.podList = this.fillSelectOption(res, 'pod_name')
              this.podList = this.podList.slice(0,12)
              this.moreIcon = !this.moreIcon
              this.PODheight = false
          })
        },
        MoreZ(){
          this.rbHttp.sendRequest({
            method: 'GET',
            params: { 'type': 'idcType' },
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
              this.poolList = this.fillSelectOption(res, 'idcType')
              this.moreIconZ = !this.moreIconZ
              if(this.poolList.length > 9) {
                this.PODheightZ = true
              }
          })
        },
        MoreUPZ() {
          this.rbHttp.sendRequest({
            method: 'GET',
            params: { 'type': 'idcType' },
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
              this.poolList = this.fillSelectOption(res, 'idcType')
              this.poolList = this.poolList.slice(0,9)
              this.moreIconZ = !this.moreIconZ
              this.PODheightZ = false
          })
        },
        MoreS(){
          this.rbHttp.sendRequest({
            method: 'GET',
            url: `/v1/cmdb/configDict/getAll`
          }).then((res) => {
            const deviceClassOptions = []
            const deviceTypeOptions = []
            const deviceStatusOptions = []
            if (res) {
              this.allDictList = res
              res.forEach((item) => {
                if (item.colName === 'device_class') {
                  deviceClassOptions.push(this.convertDictConfig(item))
                }
                if (item.colName === 'device_type') {
                  deviceTypeOptions.push(this.convertDictConfig(item))
                }
                if (item.colName === 'device_status') {
                  deviceStatusOptions.push(this.convertDictConfig(item))
                }
              })
              this.deviceClassList = this.fillSelectOption(deviceClassOptions, 'device_class')
              this.deviceClassList = this.deviceClassList.slice(0,10)
              this.moreIconS = !this.moreIconS
              if(this.deviceClassList.length > 10) {
                this.PODheightS = true
              }
              this.deviceTypeList = deviceTypeOptions
              this.deviceStatusList = deviceStatusOptions;
            }
          })
        },
        MoreUPS(){
          this.rbHttp.sendRequest({
            method: 'GET',
            url: `/v1/cmdb/configDict/getAll`
          }).then((res) => {
            const deviceClassOptions = []
            const deviceTypeOptions = []
            const deviceStatusOptions = []
            if (res) {
              this.allDictList = res
              res.forEach((item) => {
                if (item.colName === 'device_class') {
                  deviceClassOptions.push(this.convertDictConfig(item))
                }
                if (item.colName === 'device_type') {
                  deviceTypeOptions.push(this.convertDictConfig(item))
                }
                if (item.colName === 'device_status') {
                  deviceStatusOptions.push(this.convertDictConfig(item))
                }
              })
              this.deviceClassList = this.fillSelectOption(deviceClassOptions, 'device_class')

              this.deviceClassList = this.deviceClassList.slice(0,10)
              this.moreIconS = !this.moreIconS
              this.PODheightS = false
              this.deviceTypeList = deviceTypeOptions
              this.deviceStatusList = deviceStatusOptions;
            }
          })
        },
        //获取模型列表
        queryModuleList () {
          let _t = this
          rbCmdbServiceFactory.getModuleTree('').then((data) => {
            // console.log('xinzeng', data[0].childModules)
            _t.moduleList = data
          })
        },

        //获取表格头部信息
        queryInstanceHeader () {
          let _this = this
          this.checkColumns = []
          rbCmdbServiceFactory.getInstanceHeader(this.queryForm.moduleId || '').then((item) => {
            item.forEach((item2) => {
              if (item2.filedCode !== 'ip' && item2.filedCode !== 'device_name'
                && item2.filedCode !== 'insert_time' && item2.filedCode !== 'update_time') {
                _this.checkColumns.push({ 'keyCode': item2.filedCode, 'keyName': item2.filedName })
              }
            })
            if (_this.dbFilterData.columnInfo) {
              let ci = JSON.parse(_this.dbFilterData.columnInfo)
              _this.checkColumns.forEach(item => {
                if (ci[item['keyCode']]) {
                  _this.selectColumns.push(item['keyCode'])
                  _this.column_data[item['keyCode']] = ci[item['keyCode']]
                }
              })
            }
          }).catch((item) => {
            _this.$message.error('获取模型表头失败' + item)
          })
        },

        // 获取CI列表信息
        queryData: function () {
          this.$emit('showLoading', '正在查询数据,请稍等...')
          this.queryForm.pageNumber = this.paginationData.currentPage
          this.queryForm.pageSize = this.paginationData.pageSize
          if (this.insertTime !== '') {
            this.queryForm.startInsertTime = this.insertTime[0]
            this.queryForm.endInsertTime = this.insertTime[1]
          }
          this.queryForm.sortColumn = this.paginationData.sort
          this.queryForm.sortType = this.paginationData.order
          this.queryForm.queryType = this.queryType || 'normal'
          rbCmdbServiceFactory.getInstanceList(this.queryForm).then((data) => {
            this.paginationData.total = data.totalSize
            this.instanceDataList = data.data
            this.columnList = data.columnList
            if (this.multipleSelectionAll[this.paginationData.currentPage - 1]) {
              this.$nextTick(() => {
                this.multipleSelectionAll[this.paginationData.currentPage - 1].forEach(item => {
                  this.tableData.forEach(data => {
                    if (data.id === item.id) {
                      this.$refs.table.toggleRowSelection(data, true)
                    }
                  })
                })
              })
            }
          }).finally(() => {
            this.$emit('hideLoading')
          })
        },

        //带条件查询
        searchInstanceList: function () {
          this.paginationData.currentPage = 1
          this.queryData()
        },

        // 获取已保存的自定义列
        getColumnFilter () {
          let _this = this
          rbCmdbServiceFactory.getColumnFilter({ menuType: 'CMDB_INSTANCE', moduleId: this.queryForm.moduleId || '' }).then((data) => {
            _this.dbFilterData = data
            //获取表格头信息
            this.queryInstanceHeader()
          })
        },

        //跳转到设备详情
        toDetail (instanceId) {
          if ((this.queryForm.moduleId || '') === '') {
            let _t = this
            rbCmdbServiceFactory.getModuleByInstanceId(instanceId).then((data) => {
              if (data) {
                _t.$router.push({ path: '/resource/iframe/detail', query: { moduleId: data.module.id, name: data.module.name, instanceId: instanceId, state: 'detail' } })
              } else {
                _t.$message.error('获取模型数据失败')
              }
            })
          } else {
            this.$router.push({ path: '/resource/iframe/detail', query: { moduleId: this.queryForm.moduleId, instanceId: instanceId, state: 'detail' } })
          }
        },

        //跳转修改页面
        toUpdate(instanceId) {
          if ((this.queryForm.moduleId || '') === '') {
            let _t = this
            rbCmdbServiceFactory.getModuleByInstanceId(instanceId).then((data) => {
              if (data) {
                this.$router.push({ path: '/resource/iframe/add', query: { moduleId: data.module.id, instanceId: instanceId, state: 'update' } })
              } else {
                _t.$message.error('获取模型数据失败')
              }
            })
          } else {
            this.$router.push({ path: '/resource/iframe/add', query: { moduleId: this.queryForm.moduleId, instanceId: instanceId, state: 'update' } })
          }
        },

        //初始化字典值
        initDict () {
          // 获取所有的字典值
          this.rbHttp.sendRequest({
            method: 'GET',
            url: `/v1/cmdb/configDict/getAll`
          }).then((res) => {
            const deviceClassOptions = []
            const deviceTypeOptions = []
            const deviceStatusOptions = []
            if (res) {
              this.allDictList = res
              res.forEach((item) => {
                if (item.colName === 'device_class') {
                  deviceClassOptions.push(this.convertDictConfig(item))
                }
                if (item.colName === 'device_type') {
                  deviceTypeOptions.push(this.convertDictConfig(item))
                }
                if (item.colName === 'device_status') {
                  deviceStatusOptions.push(this.convertDictConfig(item))
                }
              })
              this.deviceClassList = this.fillSelectOption(deviceClassOptions, 'device_class')

              if(this.deviceClassList.length > 9) {
                this.PODheightS = true
                this.SHFL = true
              }
              this.deviceTypeList = deviceTypeOptions
              this.deviceStatusList = deviceStatusOptions;
            }
          })
          //获取POD池
          this.rbHttp.sendRequest({
            method: 'GET',
            params: { 'type': 'pod_name' },
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
            this.podList = this.fillSelectOption(res, 'pod_name')
            this.podList = this.podList.slice(0,13)

            if(this.podList.length > 12) {
              this.pod = true
            }
          })
          //获取资源池
          this.rbHttp.sendRequest({
            method: 'GET',
            params: { 'type': 'idcType' },
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
            this.poolList = this.fillSelectOption(res, 'idcType')
            if(this.poolList.length > 9) {
              this.PODheightZ = true
              this.ZYC = true
            }
          })
          //获取维保厂家
          this.rbHttp.sendRequest({
            method: 'GET',
            params: { 'type': 'mainten_factory' },
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
            this.maintenanceFactoryList = res
          })
          //获取品牌
          this.rbHttp.sendRequest({
            method: 'GET',
            params: { 'type': 'device_mfrs' },
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
            this.mfrFactoryList = res
          })
          //加载一级部门
          this.queryDepartment1()
          //加载二级部门
          this.queryDepartment2()
          //加载业务系统
          this.queryBizSystem()
        },

        //选择资源池
        pool(item){
            this.queryForm.idcType=item;
            this.searchInstanceList()
        },

        //选择设备分类
        equipment(item, dictId){
            this.queryForm.deviceClass=item;
            this.searchInstanceList()
            if (dictId) {
              this.rbHttp.sendRequest({
                method: 'GET',
                params: { 'type': 'device_type', 'pid': dictId, 'pType': 'device_class'},
                url: `/v1/cmdb/configDict/getDictsByType`
              }).then((res) => {
                this.deviceTypeList = res
              })
            } else {
              const deviceTypeOptions = []
              this.allDictList.forEach((item) => {
                if (item.colName === 'device_type') {
                  deviceTypeOptions.push(this.convertDictConfig(item))
                }
              })
              this.deviceTypeList = deviceTypeOptions
            }
        },

        //获取一级部门
        queryDepartment1: function() {
          this.rbHttp.sendRequest({
            method: 'GET',
            params: {'type': 'department1'},
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
            this.department1List = res
          })
        },

        //获取二级部门
        queryDepartment2: function (department1) {
          const params = {'type': 'department2', 'pid': department1 || ''}
          this.rbHttp.sendRequest({
            method: 'GET',
            params: params,
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
            this.department2List = res
          })
        },

        //获取业务系统
        queryBizSystem: function (department) {
          this.rbHttp.sendRequest({
            method: 'GET',
            params: { 'type': 'bizSystem', 'pid': department || ''},
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
            this.bizSystemList = res
          })
        },

        //选择一级部门
        changeDepartment1(department) {
          let departmentId = ''
          this.queryForm.department2 = ''
          this.queryForm.bizSystem = ''
          this.department1List.forEach((item) => {
            if (item.name === department) {
              departmentId = item.id
            }
          })
          this.searchInstanceList()
          this.queryDepartment2(departmentId)
          this.queryBizSystem(departmentId)
        },

        //选择二级部门
        changeDepartment2(department) {
          let departmentId = ''
          this.queryForm.bizSystem = ''
          this.department2List.forEach((item) => {
            if (item.name === department) {
              departmentId = item.id
            }
          })
          this.queryBizSystem(departmentId)
          this.searchInstanceList()
        },

        //下拉框change事件触发 查询CI列表
        changeQuery () {
          this.searchInstanceList()
        },

        //文本框blur离焦事件触发 查询CI列表
        blurQuery () {
          this.searchInstanceList()
        },

        //选择资源池
        selectPod(item){
            this.queryForm.pod=item;
            this.searchInstanceList()
        },
        // input框展示
        showInput() {
          this.inputShow = !this.inputShow
          this.inputHome = !this.inputHome
          this.conditionShow = !this.conditionShow
        },
        // 清空筛选
        emptyScreening(needSearch) {
          this.insertTime = ''
          Object.keys(this.queryForm).forEach((item) => {
            this.queryForm[item] = ''
          })
          if (needSearch) {
            this.searchInstanceList()
          }
        },

        // 将下拉框添加"全部"选项
        fillSelectOption (options, selectType) {
          const newOptions = [{id: '', name: '全部', type: selectType, value: '', pid: ''}]
          if (options) {
            options.forEach((item) => {
              newOptions.push(item)
            })
          }
          return newOptions
        },

        // 将获取到的字典值转化为可识别的json对象
        convertDictConfig (dict) {
          return {
            id: dict.dictId,
            type: dict.colName,
            name: dict.dictCode,
            value: dict.dictNote,
            pid: dict.upDict
          }
        },

        // 是否显示列
        showColumn (keyCode) {
          if (keyCode === 'ip') {
            return false
          }
          if (keyCode === 'device_name') {
            return false
          }
          if (keyCode === 'insert_time') {
            return false
          }
          if (keyCode === 'update_time') {
            return false
          }
          return this.column_data[keyCode] === true
        },

        // 每页显示记录数发生变化事件
        handleSizeChange (size) {
          this.paginationData.pageSize = size
          var maxPage = Math.ceil(this.paginationData.total / size)
          if (this.paginationData.currentPage > maxPage) {
            this.paginationData.currentPage = maxPage
          }
          this.queryData()
        },

        // 当前页数发生变化事件
        handleCurrentChange (val) {
          this.multipleSelectionAll[this.paginationData.currentPage - 1] = this.multipleSelection
          this.paginationData.currentPage = val
          this.queryData()
        },

        // 选中复选框时间
        handleSelectionChange (val) {
          this.multipleSelection = val
        },

        //自定义表格列宽度
        customWidth: function (label) {
          let width = 120
          if (label.length > 8) {
            width = 160
          } else if (label.length > 6) {
            width = 140
          }
          return width
        },

        //导入功能
        importInstance () {
          this.setImportDisplay(true)
        },

        //设置导入窗口是否显示 true:显示 false:不显示
        setImportDisplay (val) {
          this.display.isImport = val
        },

        //导出功能
        exportData () {
          this.$emit('showLoading', '正在导出数据,由于数据量较大请耐心等待...')
          this.queryForm.pageNumber = null
          this.queryForm.pageSize = null
          if (this.insertTime !== '') {
            this.queryForm.startInsertTime = this.insertTime[0]
            this.queryForm.endInsertTime = this.insertTime[1]
          }
          this.queryForm.sortColumn = this.paginationData.sort
          this.queryForm.sortType = this.paginationData.order
          this.queryForm.queryType = this.queryType || 'normal'
          rbCmdbServiceFactory.exportInstanceList(this.queryForm).then((data) => {
            if (data.code === 'success') {
              let downLoadElement = document.createElement('a')
              downLoadElement.href = data.path
              // downLoadElement.download = '历史告警数据列表.xlsx'
              downLoadElement.setAttribute('download', '资源列表.xlsx')
              document.body.appendChild(downLoadElement)
              downLoadElement.click()
              document.body.removeChild(downLoadElement)
            } else {
              this.$message.error(res.message)
            }
//            let blob = new Blob([data], { type: 'application/msword' })
//            // 创建下载链接
//            let objectUrl = URL.createObjectURL(blob)
//            let downLoadElement = document.createElement('a')
//            downLoadElement.href = objectUrl
//            downLoadElement.download = '资源列表.xlsx'
//            document.body.appendChild(downLoadElement)
//            downLoadElement.click()
//            document.body.removeChild(downLoadElement)
//            URL.revokeObjectURL(objectUrl)
          }).finally(() => {
            this.$emit('hideLoading')
          })
        },
        add () {
          this.$router.push({ path: '/resource/iframe/add', query: { moduleId: this.queryForm.moduleId, state: 'add' } })
        },
        handleSelect (child) {
          this.$router.push({ path: '/resource/iframe/add', query: { moduleId: child.id, state: 'add' } })
        },
        handleCheckedColumnChange (value) {
          this.column_data = {}
          this.checkColumns.forEach((item) => {
            value.forEach((item2) => {
              if (item.keyCode === item2) {
                this.column_data[item2] = true
              }
            })
          })
          let filter = this.dbFilterData
          filter.columnMap = this.column_data
          rbCmdbServiceFactory.updateColumnFilter(filter).then((data) => {
            if (!data.success) {
              this.$notify({
                title: '提示',
                message: data.msg,
                type: 'error',
                duration: 3000
              })
            }
          })
        }
    }
}
</script>
<style lang="scss" scoped>

@import "../iframeHome/components/rem.scss";

.resourceManagement {
    height:100%;
    width:100%;
    .managementRight {
        float:left;
        width:100%;
        height:100%;
        .condition {
            background:#fff;
            min-width:986px;
            padding:10px;
            .content {
                width:100%;
                height:100%;
                border: 1px solid #DEE9FC;
               .center {
                    height:38px;
                    border-bottom: 1px solid #DEE9FC;
                    line-height:38px;
                }
                .center {
                    div:nth-child(1) {
                        float:left;
                        width:100px;
                        padding-left:10px;
                        background:rgba(250, 251, 255, 1);
                        border-right:1px solid #DEE9FC;
                    }
                    .poolColor, .equipmentColor{
                        color:#2089DA;
                    }
                }

                .PODHeight, .PODHeightZ, .PODHeightS {
                  position: relative;
                  height:61px !important;
                  div:nth-child(1) {
                    line-height:61px;
                    height:60px !important;
                    border-right:1px solid #DEE9FC;
                    background:rgba(250, 251, 255, 1);
                  }
                  .POD {
                    line-height:30px;
                    width:calc(100% - 125px)
                  }
                }
                .center {
                    div:nth-child(1) {
                        height:37px;
                    }
                      .moreClass {
                        right:30px;
                        cursor: pointer;
                        color: #2089DA;
                        float:right;
                        margin-right:10px;
                      }
                      .moreClassRight {
                        position: absolute;
                        line-height:30px;
                        right:0
                      }
                    .POD {
                        float:left;
                        padding-left:10px;
                        .PODColor {
                            color: #2089DA
                        }

                        p {
                            display:inline-block;
                            width:100px;
                            text-align: left;
                            cursor:pointer;
                        }
                        .PODp {
                          width:60px !important;
                        }
                        .PODS {
                          width:80px !important;
                        }
                        p:nth-child(1) {
                          width:50px !important;
                        }
                    }
                }
                .down {
                    height:50px;
                    .heightQuery {
                        float:left;
                        line-height:50px;
                        width:100px;
                        padding-left:10px;
                        background:rgba(250, 251, 255, 1);
                        border-right:1px solid #DEE9FC;
                    }
                    .selectQuery {
                        float: left;
                        line-height:50px;
                        width: calc(100% - 115px);
                        margin-left: 15px;
                        p {
                            display:inline-block;
                            width:15%;
                            margin:0 4px;
                            div.el-select {
                                width:100%;
                            }
                        }
                        div {
                            float:right;
                            cursor:pointer;
                            margin-right:10px;
                            color:#2089DA
                        }
                    }
                }
                .activeDown0 {
                  height:137px !important;
                }
                .activeDown1 {
                    height:137px !important;
                    line-height:30px !important;
                    padding:10px;
                }
                .activeDown {
                  height:137px !important;
                  line-height:137px !important;
                }

            }
        }
        .form {
            margin-top: 10px;
            height:calc(100% - 195px);
            background:#fff;
            .tableBotton {
                height:35px;
                padding:10px;
                overflow: hidden;
                margin-bottom:10px;
                .left {
                    float:left;
                }
                .right {
                    float:right;
                    width:100px;
                    div.el-select {
                        width:100%;
                        border: 1px solid #2F91DC !important;
                        border-radius: 7px;
                        .el-input--suffix .el-input__inner {
                            border: #2F91DC 1px solid !important;
                        }
                        .el-input__suffix .el-input__suffix-inner .el-select__caret {
                            color: #2F91DC !important;
                        }
                    }
                    .el-select .el-input .el-select__caret {
                        color: #2F91DC !important;
                    }
                    ::-webkit-input-placeholder{/*Webkit browsers*/
                        color:#2F91DC;
                    }
                }
            }
            .table {
                padding:0 10px 10px 10px;
                height:100%
            }
        }
    }
}

</style>
<style lang="stylus">
    .tableBotton .right .el-select .el-input .el-select__caret {
        color: #2F91DC !important;
    }
</style>
