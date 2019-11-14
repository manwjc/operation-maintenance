<template>
  <!-- 搜索框 -->
  <div class="search-box-wrap">
    <el-input v-model="keyword"
              :class="{'bg-color':searchParams.desc.bgcolor}"
              :placeholder="(searchParams.desc && searchParams.desc.placeholder) ? searchParams.desc.placeholder : defaultParams.placeholder"
              @keyup.enter.native="query()"></el-input>
    <i class="el-icon-search"
       @click="query()"></i>
  </div>

</template>
<script>
export default {
  props: ['searchParams'],
  data () {
    return {
      //默认参数
      defaultParams: {
        placeholder: '请输入关键字'
      },

      //keyword
      keyword: ''
    }
  },
  created () {
    this.keyword = this.searchParams.keyword;

  },
  methods: {
    //查询
    query () {
      this.$emit('changeSearch', this.keyword);
    },

  }

}
</script>
<style lang="scss" scoped>
.search-box-wrap {
  position: relative;
  display: inline-block;
  width: 100%;
  .el-icon-search {
    position: absolute;
    top: 5px;
    right: 8px;
    font-size: 16px;
    color: #46bafe;
    cursor: pointer;
    &:hover {
      color: #086297;
    }
  }
  .el-input__inner {
    padding-right: 30px;
  }
  .bg-color {
    /deep/ .el-input__inner {
      background: #eff5fc;
    }
  }
}
</style>
