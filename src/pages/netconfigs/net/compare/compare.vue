<template>
  <!-- 内容对比 -->
  <div class="compare-wrap">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right"
                   class="yw-breadcrumb-wrap">
      <el-breadcrumb-item :to="{path: '/netconfigs/net/list'}">配置文件</el-breadcrumb-item>
      <el-breadcrumb-item>内容对比</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="back-icon-wrap"><i class="el-icon-back"
         @click="goBack()"></i></div>
    <vueCodeDiff :old-string="oldStr"
                 :new-string="newStr"
                 :context="100"
                 :outputFormat="outputFormat" />
  </div>

</template>
<script>
import vueCodeDiff from 'vue-code-diff'
export default {
  components: { vueCodeDiff },
  props: ['resultSelected'],
  data () {
    return {
      resourse: [],
      oldStr: '第一条数据：',
      newStr: '第二条数据：',
      outputFormat: 'side-by-side'
    }
  },
  // watch: {
  //   resourse: {
  //     handler (val, oldVal) {
  //       if (val.dialogVisible) {
  //         this.query();
  //       }

  //     },
  //     deep: true
  //   }
  // },

  mounted () {
    this.getCompare();
  },
  methods: {
    goBack () {
      this.$emit('changeCompare', false);
      this.$router.push({ path: '/netconfigs/net/list' });
    },
    getCompare () {
      // this.resourse = [];
      let resourse = this.resultSelected;
      // 取第一条message
      let message1, message2
      // TODO 需要同步调接口拿一下详情
      this.rbHttp.sendRequest({
        method: 'GET',
        // data: this.queryParams,
        // binary: true,
        url: `/v1/config/getConfigById/${resourse[0].index}/${resourse[0].id}`
      }).then((res) => {
        message1 = res.massage
        this.rbHttp.sendRequest({
          method: 'GET',
          // data: this.queryParams,
          // binary: true,
          url: `/v1/config/getConfigById/${resourse[1].index}/${resourse[1].id}`
        }).then((res) => {
          message2 = res.massage
          this.oldStr = `第一条数据：\n${message1.replace(/\n/g, '\r\n')}`;
          this.newStr = `第二条数据：\n${message2.replace(/\n/g, '\r\n')}`;
        });
      });

      // await this.query(resultSelected[0]);
      // await this.query(resultSelected[1]);
      // this.oldStr = `第一条数据：\n${JSON.stringify(this.resourse[0], null, '\r\n')}`;
      // this.newStr = `第二条数据：\n${JSON.stringify(this.resourse[1], null, '\r\n')}`;
    },
    async query (val) {
      let queryParams = {
        'idc': '',
        //'idc': val.pool,
        'deviceIp': val.ip
      };
      await this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/instance/queryDeviceByRoomAndIP`,
        params: queryParams,
      }).then((res) => {
        this.resourse.push(res);
        return res
      });
    }

  }
}
</script>
<style lang="scss" scoped>
.compare-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 2;
  min-height: 100%;
  /* height: 100%; */
  overflow-y: auto;
  /deep/ .d2h-file-wrapper {
    margin-bottom: 0;
    .d2h-file-side-diff {
      vertical-align: top;
    }
  }
}
</style>
