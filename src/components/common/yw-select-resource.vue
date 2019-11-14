<template>
  <!-- 资源池 -->
  <el-select :value="pool"
             clearable
             filterable
             @change="changePool"
             @clear="cleanPool"
             placeholder="请选择资源池">
    <el-option v-for="item in resourcePoors"
               :key="item.id"
               :label="item.name"
               :value="item.value">
    </el-option>
  </el-select>

</template>
<script>
export default {
  props: {
    pool: { //资源名称
      type: String,
      default: ''
    },
    paramsObj: { //类型参数
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data () {
    return {
      //查询参数
      queryParams: {
        type: 'idcType',
        pid: '',
        pValue: '',
        pType: '',
      },

      resourcePoors: []
    }
  },
  mounted () {
    this.queryPool();
  },
  methods: {
    //查询资源池
    queryPool () {
      this.queryParams = {
        type: this.paramsObj.type ? this.paramsObj.type : 'idcType',
        pid: this.paramsObj.pid ? this.paramsObj.pid : '',
        pValue: this.paramsObj.pValue ? this.paramsObj.pValue : '',
        pType: this.paramsObj.pType ? this.paramsObj.pType : '',
      };

      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/configDict/getDictsByType`,
        params: this.queryParams,
      }).then((res) => {
        this.resourcePoors = res;
        return res
      });
    },
    //筛选资源池
    changePool (val) {
      this.$emit('changePool', val);
    },
    //清空资源池
    cleanPool (val) {
      this.$emit('cleanPool', val);
    }
  }

}
</script>
<style lang="scss" scoped>
</style>
