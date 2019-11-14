<template>
  <el-dialog class="yw-dialog"
             width="700px"
             title="检测结果信息"
             :visible.sync="dialogMsg.dialogVisible">
    <section class="yw-dialog-main">
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
                {{his.http_content_type}}
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
        <el-timeline-item v-if="his.result === 1">
          <h1 class="header">
            <span class="title">响应时间：</span>
            <span class="time">{{his.end_time}}</span>
            <span class="title title2">响应耗时（毫秒）</span>
            <span class="time">{{his.time_con}}</span>
          </h1>
          <el-form class="yw-form yw-form-col-2"
                   :inline="true"
                   label-width="110px">
            <el-form-item label="检验内容类型">
                {{his.response_type}}
            </el-form-item>
            <el-form-item label="检验内容解析">
              result.{{his.json_attribute}}{{his.json_operator}}{{his.json_value}}
            </el-form-item>
            <el-form-item label="返回响应HEAD"
                          class="yw-form-item-100">
              <el-input type="textarea"
                        :rows="2"
                        placeholder="" v-model="his.head_response">
              </el-input>
            </el-form-item>
            <el-form-item label="返回响应BODY"
                          class="yw-form-item-100">
              <el-input type="textarea"
                        :rows="2"
                        placeholder="" v-model="his.request_result">
              </el-input>
            </el-form-item>
          </el-form>
        </el-timeline-item>
          <el-timeline-item class="error" v-else>
              <h1 class="header">
                  <span class="title">响应超时：</span>
                  <span class="time" v-if="his.time_out">响应超时（ {{his.time_out}}）</span>
                  <span class="time" v-else>响应超时（15000）</span>
              </h1>
          </el-timeline-item>
      </el-timeline>

    </section>
      <section class="btn-wrap">
          <el-button @click="cancel()">返回</el-button>
      </section>
  </el-dialog>

</template>
<script>
import rbMonitorManageServicesFactory from 'src/services/alert/rb-monitorManage-services.factory.js'
export default {
  props: ['dialogMsg'],

  data () {
    return {
      hisId: this.dialogMsg.data.hisId,
      his: {}
    }
  },
  mounted () {
    rbMonitorManageServicesFactory.getHisById(this.hisId).then((res) => {
      if (res) {
        this.his = res
      }
    })
  },
  methods: {
    cancel () {
      this.$emit('closeDialog');
    }

  }
}

</script>
<style lang="scss" scoped>
/deep/ .yw-timeline {
  .header {
    .title2 {
      margin-left: 92px;
    }
  }
}
</style>
