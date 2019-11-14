<template>
  <div class="components-container yw-dashboard">
    <el-form class="yw-form components-condition"
             label-width="85px"
             :inline="true"
             :model="formData">
      <el-form-item label="收敛规则">
        <el-select v-model="formData.primarySecondaryId"
                   clearable>
          <el-option v-for="(item, index) in primarySecondaryList"
                     :key="index"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="告警设备">
        <el-input v-model="formData.deviceIp"></el-input>
      </el-form-item>
      <el-form-item label="告警开始时间">
        <el-date-picker v-model="formData.effectiveDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        size="mini"></el-date-picker>
      </el-form-item>
      <el-form-item label="归属资源池">
        <el-select v-model="formData.idcType"
                   placeholder="请选择"
                   clearable
                   filterable
                   @change="changePool()"
                   @clear="cleanPool()">
          <el-option v-for="item in resourcePoors"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="告警等级">
        <el-select v-model="formData.alertLevel"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="item in alert_level"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="告警内容">
        <el-input v-model="formData.moniIndex"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="业务系统">
        <treeselect class="yw-treeselect"
                    v-model="bizSysDepChecked"
                    :multiple="true"
                    :limit="1"
                    :options="bizDepTreeSelOpts"
                    placeholder="请选择" />
      </el-form-item>
      <el-form-item label="告警来源">
        <el-select v-model="formData.source"
                   placeholder="请选择"
                   multiple
                   collapse-tags
                   clearable
                   filterable>
          <el-option v-for="item in alert_froms"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主要告警ID">
        <el-input v-model="formData.primarySecondaryAlertId"></el-input>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="query()">查询
        </el-button>
        <el-button @click="reset()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="exportBatch()"
                   :disabled="exportDisabled">导出
        </el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  v-loading="loading"
                  :data="result"
                  height="calc(100vh - 310px)"
                  stripe
                  border>
          <el-table-column type="selection"
                           width="40"></el-table-column>
          <el-table-column label="规则名称"
                           width="160">
            <template slot-scope="scope">
              <a>{{scope.row.primarySecondaryName}}</a>
            </template>
          </el-table-column>
          <el-table-column label="告警归属设备"
                           width="100">
            <template slot-scope="scope">
              <a>{{scope.row.deviceIp}}</a>
            </template>
          </el-table-column>
          <el-table-column label="告警等级"
                           width="80">
            <template slot-scope="scope">
              <rb-mirror-alert-status :mode="'list'"
                                      :status="scope.row.alertLevel"></rb-mirror-alert-status>
            </template>
          </el-table-column>
          <el-table-column label="告警内容"
                           width="300">
            <template slot-scope="scope">
              {{scope.row.moniIndex}}
            </template>
          </el-table-column>
          <el-table-column label="当前告警时间"
                           width="140">
            <template slot-scope="scope">
              {{scope.row.curMoniTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="告警开始时间"
                           width="140">
            <template slot-scope="scope">
              {{scope.row.alertStartTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="告警归属资源池"
                           width="120">
            <template slot-scope="scope">
              {{scope.row.idcType}}
            </template>
          </el-table-column>
          <el-table-column label="告警来源"
                           width="80">
            <template slot-scope="scope">
              {{scope.row.source}}
            </template>
          </el-table-column>
          <el-table-column label="业务系统"
                           width="160">
            <template slot-scope="scope">
              {{scope.row.bizSys}}
            </template>
          </el-table-column>
          <el-table-column label="机房"
                           width="120">
            <template slot-scope="scope">
              {{scope.row.sourceRoom}}
            </template>
          </el-table-column>
          <el-table-column label="告警设备名称"
                           width="100">
            <template slot-scope="scope">
              {{scope.row.hostName}}
            </template>
          </el-table-column>
          <el-table-column label="设备分类"
                           width="100">
            <template slot-scope="scope">
              {{scope.row.deviceClass}}
            </template>
          </el-table-column>
          <el-table-column label="设备类型"
                           width="100">
            <template slot-scope="scope">
              {{scope.row.deviceType}}
            </template>
          </el-table-column>
          <el-table-column label="收敛时间"
                           width="140">
            <template slot-scope="scope">
              {{scope.row.createTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="主要告警ID"
                           width="270">
            <template slot-scope="scope">
              {{scope.row.primarySecondaryAlertId}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <YwPagination @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :total="total"></YwPagination>
    </el-form>
  </div>
</template>

<script>
import { alert_from, alert_level } from '../../alert_his/config/options.js'
import QueryObject from 'src/utils/queryObject.js'
import rbAlertPrimarySecondaryServiceFactory from "src/services/alert/rb-alert-primary-secondary-service.factory"
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
import rbAlertKanBanServiceFactory from 'src/services/alert/rb-alert-kanban-services.factory.js'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: '/mirror_alert/primary_secondary/alert',
  mixins: [QueryObject],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    rbMirrorAlertStatus: () => import('src/pages/mirror_alert/common/rb-mirror-alert-status.vue'),
    Treeselect: () => import('@riophae/vue-treeselect')
  },
  data () {
    return {
      // 表单数据
      formData: {
        primarySecondaryId: '',
        deviceIp: '',
        idcType: '',
        alertLevel: '',
        effectiveDate: [],
        moniIndex: '',
        source: []
      },
      //查询条件
      queryParams: {},
      bizSysDepChecked: [],
      // 查询结果
      result: [],
      primarySecondaryList: [],
      // 资源池
      resourcePoors: [],
      bizSysList: [],
      alert_froms: [],
      alert_level: [],
      bizDepTreeSelOpts: [],
      bizSysTree: null,
      bizFlag: false,
      exportDisabled: false,
      initFlag: true
    }
  },
  created () {
    this.alert_froms = alert_from
    this.alert_level = alert_level
    if (this.$route.query.id) {
      this.formData.primarySecondaryId = parseInt(this.$route.query.id)
    }
    this.queryIsolates()
    this.getResourcePoor()
    this.getBizSysTreeData()
    this.query();
  },
  methods: {
    //设置参数
    setParams (activePagination) {

      if (activePagination) {
        this.queryParams['pageNum'] = this.currentPage;
        this.queryParams['pageSize'] = this.pageSize;
      } else {
        this.queryParams = {
          'primarySecondaryTimeFrom': this.formData.effectiveDate && this.formData.effectiveDate[0],
          'primarySecondaryTimeTo': this.formData.effectiveDate && this.formData.effectiveDate[1],
          'primarySecondaryId': this.formData.primarySecondaryId,
          'primarySecondaryAlertId': this.formData.primarySecondaryAlertId,
          'deviceIp': this.formData.deviceIp,
          'idcType': this.formData.idcType,
          'alertLevel': this.formData.alertLevel,
          'moniIndex': this.formData.moniIndex,
          // 'bizSys': (this.bizSysDepChecked && this.bizSysDepChecked.length > 0) ? this.getBizSysByChecked(this.bizSysDepChecked) : '',
          'source': (this.formData.source && this.formData.source.length > 0) ? this.formData.source.join(',') : '',
          'pageNum': this.initPageChange(),
          'pageSize': this.pageSize
        }
        if (!this.initFlag) {
          this.getBizSysByChecked()
        }
      }

    },
    query (activePagination = false) {
      this.loading = true;
      this.setParams(activePagination);
      rbAlertPrimarySecondaryServiceFactory.getprimarySecondaryAlertList(this.queryParams).then((data) => {
        this.result = data.result
        this.total = data.count
      }).finally(() => {
        this.loading = false
        this.initFlag = false
      })
    },
    queryIsolates () {
      rbAlertPrimarySecondaryServiceFactory.getprimarySecondaryList({ 'pageSize': -1 }).then((data) => {
        this.primarySecondaryList = data.result
        this.$forceUpdate()
      })
    },
    reset () {
      this.formData = { 'name': '', 'status': '', 'effectiveDate': [] }
    },
    exportBatch () {
      this.loading = true
      this.exportDisabled = true
      this.setParams()
      rbAlertPrimarySecondaryServiceFactory.exportprimarySecondaryAlertList(this.queryParams).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '告警衍生记录.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.loading = false
        this.exportDisabled = false
      })
    },
    // 获取资源池
    getResourcePoor () {
      let obj = {
        'type': 'idcType',
        'pid': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.resourcePoors = res
        }
      })
    },
    changePool () {
      let _this = this
      _this.bizDepTreeSelOpts = []
      rbAlertKanBanServiceFactory.bizSysTreeOptionByResourcePollSel(this.formData.idcType || '').then(function (poolDeps) {
        let sysDepts = (
          _this.bizSysTree &&
          _this.bizSysTree.length > 0 &&
          _this.bizSysTree[0].children &&
          _this.bizSysTree[0].children.length > 0
        ) ? _this.bizSysTree[0].children : []
        _.forEach(poolDeps, poolDep => {
          if (poolDep) {
            _(sysDepts).filter(sysdep => {
              return poolDep === sysdep.id
            }).forEach(subdep => {
              _this.bizDepTreeSelOpts.push(subdep)
            })
          }
        })
      })
    },
    cleanPool () {
      this.bizSysList = []
      this.search.system = ''
      this.getBizSysList()
    },
    // 获取业务系统
    getBizSysList () {
      let obj = {
        'type': 'bizSystem',
        'pid': '',
        'pValue': '',
        'pType': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.bizSysList = res
        }
      })
    },
    getBizSysTreeData () {
      rbAlertKanBanServiceFactory.bizSysTreeOptions().then(res => {
        if (!this.bizSysTree) {
          this.bizSysTree = res
        }
        this.bizDepTreeSelOpts = res
        this.bizFlag = true
      })
    },
    getBizSysByChecked () {
      let sysDepChecked = this.bizSysDepChecked
      if (sysDepChecked && sysDepChecked.length === 1 && !sysDepChecked[0]) {
        this.queryParams.bizSys = ''
        return
      }
      if (!this.bizSysTree || this.bizSysTree.length === 0) {
        this.queryParams.bizSys = ''
        return
      }
      let target = []
      let list = this.bizSysTree[0].children
      let addEle = function (eles) {
        if (!eles.children || eles.children.length === 0) {
          target.push(eles.id)
        } else {
          _.forEach(eles.children, ele => {
            addEle(ele)
          })
        }
      }
      let findEle = function (_array, _origin) {
        _.forEach(_array, child => {
          if (child.id === _origin) {
            addEle(child)
          } else if (child.children && child.children.length > 0) {
            findEle(child.children, _origin)
          }
        })
      }
      _(sysDepChecked).forEach(ele => {
        findEle(list, ele)
      })
      this.queryParams.bizSys = _(target).uniq().join(',')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
