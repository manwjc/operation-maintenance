<template>
  <!-- 省份 -->
  <div>
    <el-select v-model="SelectData.province"
               clearable
               filterable
               :disabled="disabled"
               @change="change"
               @clear="clean"
               placeholder="请选择">
      <el-option v-for="item in result"
                 :key="item.uuid"
                 :label="item.name"
                 :value="item.name">
      </el-option>
    </el-select>
  </div>

</template>
<script>
export default {
  props: ['SelectData', 'disabled'],
  data () {
    return {

      //查询参数
      queryParams: {
        name: sessionStorage.getItem('userInfo')
      },
      //结果
      result: []
    }
  },
  created () {
    this.query();
  },
  methods: {
    //查询
    query () {
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/department/queryList`,
        data: this.queryParams,
      }).then((res) => {
        this.result = res;
        this.result.some((item, index) => {
          if (item.uuid === this.SelectData.province) {
            this.SelectData.province = item.name;
            return;
          }
        })
        return res
      });

    },
    //选择
    change (val) {
      // this.$emit('changeSelect', val);
    },
    //清空
    clean (val) {
      // this.$emit('changeSelect', {});
    }
  }

}
</script>
<style lang="scss" scoped>
</style>
