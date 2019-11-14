<template>
  <!-- 常用下拉框 -->
  <el-select v-model="SelectData"
             clearable
             filterable
             :disabled="disabled"
             @change="change"
             @clear="clean"
             placeholder="请选择">
    <el-option v-for="(item,key) in result"
               :key="key"
               :label="item.name"
               :value="item.name">
    </el-option>
  </el-select>

</template>
<script>
export default {
  props: ['SelectData', 'result', 'disabled'],
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {

    //选择
    change (val) {
      // this.$emit('changeSelect', val,'other');
      this.$emit('changeSelect', val);
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
