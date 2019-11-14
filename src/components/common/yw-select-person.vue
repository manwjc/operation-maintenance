<template>
  <!-- 用户 -->
  <el-select v-model="SelectData"
             clearable
             filterable
             @change="change"
             @clear="clean"
             placeholder="请选择">
    <el-option v-for="item in result"
               :key="item.uuid"
               :label="item.name"
               :value="item.name">
    </el-option>
  </el-select>

</template>
<script>
export default {
  props: ['SelectData'],
  data () {
    return {

      //查询参数
      queryParams: {
        'dept_id': sessionStorage.getItem('userInfo') || ''
      },
      //结果
      result: []
    }
  },
  mounted () {
    if (this.result && this.result.length > 0) {

    } else {
      this.query();
    }
  },
  methods: {
    //查询
    query () {

      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/user/queryList`,
        data: this.queryParams,
      }).then((res) => {
        this.result = res;
        return res
      });
    },
    //选择
    change (val) {
      let obj = {};
      this.result.some((item, index) => {
        if (item.name === this.SelectData) {
          obj = item;
          return true;
        }
      })
      this.$emit('changeSelect', obj);
    },
    //清空
    clean (val) {
      this.$emit('changeSelect', {});
    }
  }

}
</script>
<style lang="scss" scoped>
</style>
