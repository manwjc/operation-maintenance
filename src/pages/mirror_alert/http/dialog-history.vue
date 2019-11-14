<template>
  <el-dialog class="yw-dialog"
             width="900px"
             :title="title"
             :visible.sync="dialogMsg.dialogVisible" >
      <section class="yw-dialog-main"  v-if="flag">
          暂无异常
      </section>
    <section class="yw-dialog-main" v-else>
      <div class="yw-timelist" style="min-width:200px;">
        <ul>
          <li class="yw-time-item"
              :class="{active:curActive === item.id}"
              @click="showHis(item)"
              v-for="item in errorHisList"
              :key="item.id"><i class="fa fa-bars"
          ></i>{{item.start_time}}</li>

        </ul>
      </div>
      <el-timeline class="yw-timeline"
                   :reverse="false">
        <el-timeline-item>
          <h1 class="header">
            <span class="title">请求时间：</span>
            <span class="time">{{his.start_time}}</span>
          </h1>
          <el-form class="yw-form yw-form-col-2"
                   :inline="true"
                   label-width="110px">
            <el-form-item label="服务地址"
                          class="yw-form-item-100">
                {{his.request_http_addr}}
            </el-form-item>
            <el-form-item label="请求方法">
                {{his.request_method}}
            </el-form-item>
            <el-form-item label="content-type">
              application/json
            </el-form-item>
            <el-form-item label="请求参数"
                          class="yw-form-item-100">
              <el-input type="textarea"
                        :rows="2"
                        placeholder="" v-model="his.request_parm">
              </el-input>
            </el-form-item>
            <el-form-item label="超时时间（毫秒）"
                          class="yw-form-item-100">
                {{his.time_out}}
            </el-form-item>
          </el-form>
        </el-timeline-item>
        <el-timeline-item class="error">
          <h1 class="header">
            <span class="title">响应超时：</span>
            <span class="time" v-if="his.time_out">响应超时（ {{his.time_out}}毫秒）</span>
              <span class="time" v-else>响应超时（15000）</span>
          </h1>
        </el-timeline-item>
      </el-timeline>
      <YwPagination @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :total="total"></YwPagination>
    </section>
    <section class="btn-wrap">
      <el-button @click="cancel()">返回</el-button>
    </section>
  </el-dialog>

</template>
<script>
import rbMonitorManageServicesFactory from 'src/services/alert/rb-monitorManage-services.factory.js'
import QueryObject from 'src/utils/queryObject.js'
export default {
  mixins: [QueryObject],
  props: ['dialogMsg'],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
  },
  data () {
    return {
      flag: false,
      title: 'HTTP服务监控异常历史',
      queryParams: {},
      his: {},
      errorHisList: [],
      configId: this.dialogMsg.data.configId,
      curActive: 1
    }
  },
  mounted () {
    this.query()
  },
  methods: {
    setParams (activePagination) {

      if (activePagination) {
        this.queryParams['page_no'] = (this.currentPage-1)*this.pageSize
        this.queryParams['page_size'] = this.pageSize;
      } else {

        this.queryParams = {
          'configId': this.configId,
          'runStatus': 0,
          'page_no': (this.initPageChange()-1)*this.pageSize,
          'page_size': this.pageSize
        }
      }

    },
    query (activePagination = false){
      this.setParams(activePagination)
      rbMonitorManageServicesFactory.getHisList(this.queryParams).then((res) => {
        if (res && res.count>0) {
          this.errorHisList = res.result
          this.total = res.count
          this.his = this.errorHisList[0]
          this.curActive = this.his.id
        }else{
          this.flag = true
        }
      }).catch(() => {
        this.$message.error('查询失败')
      }).finally(() => {
        this.loading = false;
      });
    },
    showHis(his) {
      this.curActive = his.id
      this.his = his
    },
    submit () {
      this.$emit('closeDialog', 'update');
    },
    cancel () {
      this.$emit('closeDialog');
    }

  }
}

</script>
<style lang="scss" scoped>
/deep/ .yw-page-wrap {
  text-align: left;
}
/deep/ .yw-timeline {
  vertical-align: top;
  margin-left: 30px;
  width: 60%;
  .header {
    .title2 {
      margin-left: 92px;
    }
  }
}
</style>
