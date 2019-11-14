<template>
  <!-- 分页 -->
  <div class="yw-page-wrap">
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="pageSizes"
                   :page-size="pageSize"
                   :layout=" layout ? layout : defaultLayout"
                   :total="total">
    </el-pagination>
  </div>

</template>
<script>
export default {
  props: ['currentPage', 'pageSizes', 'pageSize', 'total', 'layout'],
  data () {
    return {
      defaultLayout: 'total, sizes, prev, pager, next, jumper'
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val);
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val);
    }
  }

}
</script>
<style lang="scss" scoped>
.yw-page-wrap {
  text-align: right;
}
</style>
