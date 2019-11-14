<template>
  <div style="width: 100%;height: 100%">
    <div class="basinfo"><span class="left-title">基本信息</span></div>
    <div style="width: 100%;margin-left: 20px;">
    <el-form class="yw-form form-details" :inline="true">
        <el-form-item label="名称：">
            {{topoData.name}}
        </el-form-item>
       <el-form-item label="拓扑分类：">
            {{topoData.pictureType == '1'? '物理拓扑' : topoData.pictureType == '2'? '逻辑拓扑' : '租户拓扑'}}
        </el-form-item>
        <el-form-item label="资源池：">
            {{topoData.idc}}
        </el-form-item>
        <el-form-item label="POD：">
            {{topoData.pod}}
        </el-form-item>
        <el-form-item v-if="topoData.pictureType != '1'" label="业务系统：">
            {{topoData.bizSystem}}
        </el-form-item>
        <el-form-item label="项目名称：">
            {{topoData.projectName}}
        </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['topoData'],
  computed: {
    // activeIndex () {
    //   if (this.topoData.length > 0) {
    //     return String(this.topoData[0].children[0].pictureType)
    //   }
    //   return ''
    // }
  },
  methods: {
    // handleSelect (key, keyPath) {
    //   console.log(key)
    //   console.log(keyPath)
    //   this.$emit('changeTopo', key)
    // }
  }
}
</script>

<style lang="scss" scoped>
/*/deep/ .el-menu--horizontal > .el-menu-item {*/
  /*height: 0.4rem;*/
  /*line-height: 0.4rem;*/
/*}*/
/*/deep/ .el-menu--horizontal > .el-submenu .el-submenu__title {*/
  /*height: 0.4rem;*/
  /*line-height: 0.4rem;*/
/*}*/
/*/deep/ .el-submenu__title i,*/
/*/deep/ .el-menu-item i {*/
  /*color: #3fbdff;*/
/*}*/
/*/deep/ .is-active i {*/
  /*color: #409eff;*/
/*}*/
.form-details {
  .el-form-item {
    min-width:150px;
    margin-bottom: 0px;
  }
}
.left-title {
  /*line-height: rem(40);*/
  font-size: rem(14);
  color: #25374A;
  font-weight: bold;
}
.basinfo {
  float: left;
  height: 100%;
  padding-left: 5px;
}
/deep/ .el-form-item__label {
 min-width: 80px;
 line-height: 30px;
 text-align: right;
}
/deep/ .el-form-item__content {
  line-height: 30px;
  text-align: right;
}
</style>
