<template>
  <div class="components-container yw-dashboard">
    <el-form class="yw-form components-condition"
             label-width="75px"
             :inline="true"
             :model="formData"
             ref="formData">
      <el-form-item label="业务系统">
          <treeselect class="yw-treeselect" v-model="formData.biz_system_id"
                      :multiple="false"
                      :options="bizDepTreeSelOpts"
                      placeholder="请选择" />
      </el-form-item>
      <el-form-item label="资源池">
          <el-select v-model="formData.idcType"
                     placeholder="资源池"
                     clearable
                     @change="idcTypeChange"
                     filterable>
              <el-option v-for="(item, index) in idcTypeList"
                         :key="index"
                         :label="item.idcType"
                         :value="item.idcType">
              </el-option>
          </el-select>
      </el-form-item>
        <el-form-item label="监控名称">
            <el-input v-model="formData.monitor_name" clearable
                      placeholder="监控名称"></el-input>
        </el-form-item>
        <el-form-item label="监控状态">
            <el-select v-model="formData.runStatus"
                       placeholder="监控状态"
                       clearable>
                <el-option label="正常"
                           value="1"></el-option>
                <el-option label="异常"
                           value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="运行状态">
            <el-select v-model="formData.status"
                       placeholder="运行状态"
                       clearable>
            <el-option label="运行"
                       value="1"></el-option>
            <el-option label="暂停"
                       value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="监控地址">
            <el-input v-model="formData.request_http_addr" clearable
                      placeholder="监控地址"></el-input>
        </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="query()">查询</el-button>
        <el-button @click="reset('formData')">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="add()">新增监控项</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  v-loading="loading"
                  :data="result"
                  height="calc(100vh - 310px)"
                  stripe
                  border>
          <el-table-column label="监控名称"
                           width="140"
                           prop="monitor_name">
          </el-table-column>
          <el-table-column label="监控地址"
                           min-width="200"
                           prop="request_http_addr">
          </el-table-column>
        <el-table-column label="方式"
                         min-width="80"
                         prop="request_method">
        </el-table-column>
            <el-table-column label="业务系统"
                             width="140"
                             prop="biz_system_id">
            </el-table-column>
          <el-table-column label="资源池"
                           width="140"
                           prop="idcType">
          </el-table-column>
            <el-table-column label="检查周期"
                             width="140"
                             prop="test_period">
                <template slot-scope="scope">
                    {{scope.row.test_period}}分钟
                </template>
            </el-table-column>
          <el-table-column label="监测结果"
                           min-width="60"
                           prop="conclusion">
            <template slot-scope="scope" >
              <a class="text-status" v-if="scope.row.result || scope.row.result === 0"
                    :class="{error:scope.row.result===0}" @click="view(scope.row)">{{scope.row.result === 1?'正常':'异常'}}</a>
            </template>
          </el-table-column>
          <el-table-column label="状态"
                           min-width="60"
                           prop="status">
            <template slot-scope="scope">
                {{scope.row.status === 1?'运行':'暂停'}}
            </template>
          </el-table-column>
          <el-table-column prop="region"
                           label="操作"
                            min-width="150px">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           @click="detail(scope.row.id)"
                           v-if="scope.row.status === 1"
                           title="查看"
                           icon="el-icon-tickets"></el-button>
                  <el-button type="text"
                             v-else
                             title="编辑"
                             @click="add(scope.row.id)"
                             icon="el-icon-edit"></el-button>
                <el-button type="text"
                           @click="getHistory(scope.row.id, scope.row.monitor_name)"
                           title="异常历史"
                           icon="fa fa-history"></el-button>
                  <el-button type="text"
                             title="删除"
                             @click="deleteRow(scope.row.id, scope.row.monitor_name)"
                             icon="el-icon-delete"></el-button>
                  <el-button type="text"
                             title="运行"
                             v-if="scope.row.status === 0"
                             @click="changeStatus(scope.row, 1)"
                             icon="el-icon-video-play"></el-button>
                  <el-button type="text"
                             title="暂停"
                             v-else
                             @click="changeStatus(scope.row, 0)"
                             icon="el-icon-video-pause"></el-button>
              </div>

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

    <!-- dialog -->
    <DialogResult :dialogMsg="dialogMsg"
                  @closeDialog="closeDialogResult"
                  v-if="dialogMsg.dialogVisible" ></DialogResult>
    <DialogHistory :dialogMsg="dialogHistory"
                   @closeDialog="closeDialogHistory"
                   v-if="dialogHistory.dialogVisible"></DialogHistory>
    <DialogAdd :dialogMsg="dialogAdd"
               @closeDialog="closeDialogAdd"
               :showclose="true"
               :close-on-click-modal="false"
               v-if="dialogAdd.dialogVisible">
    </DialogAdd>
      <DialogDetail :dialogMsg="dialogDetail"
                 @closeDialog="closeDialogDetail"
                 :showclose="true"
                 :close-on-click-modal="false"
                 v-if="dialogDetail.dialogVisible">
      </DialogDetail>
    <!-- dialog -->
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import QueryObject from 'src/utils/queryObject.js'
import rbMonitorManageServicesFactory from 'src/services/alert/rb-monitorManage-services.factory.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
export default {
  name: '/mirror_alert/http',
  mixins: [QueryObject],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    DialogResult: () => import('./dialog-result.vue'),
    DialogHistory: () => import('./dialog-history.vue'),
    DialogAdd: () => import('./dialog-add.vue'),
    DialogDetail: () => import('./dialog-detail.vue'),
    Treeselect
  },
  data () {
    return {
      idcTypeUrl: '',
      bizSystemList: [],
      bizDepTreeSelOpts: [],
      idcTypeList: [],
      // 表单数据
      formData: {
      },
      //查询条件
      queryParams: {

      },
      // 查询结果
      result: [],
      //dialog
      dialogMsg: {
        dialogVisible: false,
        data: {} //数据
      },
      dialogHistory: {
        dialogVisible: false,
        data: {} //数据
      },
      dialogAdd: {
        dialogVisible: false,
        data: {} //数据
      },
      dialogDetail: {
        dialogVisible: false,
        data: {} //数据
      }
    }
  },
  created () {
    this.initData()
    this.query();
  },
  methods: {
    idcTypeChange(val) {
        if(val){
         let v = this.idcTypeList.find(function (r) {
            return r.idcType === val
          })
          this.idcTypeUrl = v.url
        }else{
          this.idcTypeUrl = ''
        }
    },
    initData () {
      rbMonitorManageServicesFactory.getIdcTypes().then((res) => {
        if (res) {
          this.idcTypeList = res
        }
      }).catch(() => {getBizSystem
        this.$message.error('查询失败')
      })
      rbMonitorManageServicesFactory.getBizSystem().then((res) => {
       if(res){
         this.bizDepTreeSelOpts = res
       }
      }).catch(() => {
        this.$message.error('查询失败')
      })

    },
    //设置参数
    setParams (activePagination) {

      if (activePagination) {
        this.queryParams['page_size'] = this.pageSize;
        this.queryParams['page_no'] = (this.currentPage-1)*this.pageSize;
      } else {

        this.queryParams = {
          'biz_system_id': this.formData.biz_system_id ,
          'idcType': this.formData.idcType,
          'monitor_name': this.formData.monitor_name,
          'request_http_addr': this.formData.request_http_addr,
          'status': this.formData.status,
          'runStatus': this.formData.runStatus,
          'page_no': (this.initPageChange()-1)*this.pageSize,
          'page_size': this.pageSize
        }
      }

    },
    query (activePagination = false) {
      this.setParams(activePagination)
      rbMonitorManageServicesFactory.getList(this.queryParams).then((res) => {
        this.result = res.result
        this.total = res.count
      }).catch(() => {
        this.$message.error('查询失败')
      }).finally(() => {
            this.loading = false;
          });

    },
    deleteRow (id, name) {
      this.$confirm('删除监控配置 ' + name + '?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rbMonitorManageServicesFactory.delete(id).then((res) => {
          this.$message.success('删除成功')
          this.query(false)
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    },
    changeStatus (row, status) {
      let text = '暂停'
      if(status === 1){
        text = '运行'
      }
      let obj = JSON.parse(JSON.stringify(row))
      obj.status = status
      let idcType = obj.idcType
      if(idcType){
        let c = this.idcTypeList.find(function (r) {
          return r.idcType === idcType
        })
        if(c){
          obj.idcTypeUrl = c.url
        }
      }
      this.$confirm(text + '监控配置 ' + name + '?', text, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rbMonitorManageServicesFactory.updateStatus(obj).then((res) => {
          this.$message.success(text+'成功')
          this.query()
        }).catch(() => {
          this.$message.error(text+'失败')
        })
      })
    },
    reset(formData) {
      this.formData = {}
    },
    closeDialogAdd (type) {
      this.dialogAdd.dialogVisible = false;
      this.dialogAdd.data = {}
      if (type === 'update') {
        this.query();
      }
    },
    closeDialogDetail (type) {
      this.dialogDetail.dialogVisible = false;
      if (type === 'update') {
        this.query();
      }
    },
    closeDialogResult (type) {
      this.dialogMsg.dialogVisible = false;
      if (type === 'update') {
        this.query();
      }
    },
    closeDialogHistory (type) {
      this.dialogHistory.dialogVisible = false;
      if (type === 'update') {
        this.query();
      }
    },

    add (id) {
      this.dialogAdd.data = {}
      if(id){
        this.dialogAdd.data.configId = id
      }
      this.dialogAdd.data.idcTypeList = this.idcTypeList
      this.dialogAdd.data.bizDepTreeSelOpts = this.bizDepTreeSelOpts
      this.dialogAdd.dialogVisible = true;
    },
    detail(id) {
      this.dialogDetail.data.configId = id
      this.dialogDetail.dialogVisible = true;
    },
    view (row) {
      this.dialogMsg.data.hisId = row.hId
      this.dialogMsg.dialogVisible = true;
    },
    getHistory (id,name) {
      this.dialogHistory.data.configId =id
      this.dialogHistory.data.monitor_name = name
      this.dialogHistory.dialogVisible = true;
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
