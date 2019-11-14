<template>
  <div class="rule-container">
    <el-container>
      <el-aside class="menu-container"
                width="23%">
        <el-row class="menu-search">
          <el-row style="margin-top: 10px;padding-bottom: 20px"
                  class="bottom-line">
            <el-col :span="6"
                    style="line-height: 30px">
              模型名称
            </el-col>
            <el-col :span="18">
              <el-input v-model="keyword"
                        placeholder="模型名称"
                        style="width: 90%;float: right"></el-input>
            </el-col>
          </el-row>
        </el-row>
        <el-scrollbar class="menu-panel">
          <local-menu :moduleId="$route.query.moduleId"
                      :keyword="keyword"
                      :menuType="'dataManage'"
                      :show="'all'"
                      @setModuleId="changeModuleId"></local-menu>
        </el-scrollbar>
      </el-aside>
      <el-main class="main-panel">
        <data-panel :moduleId="moduleId"></data-panel>
      </el-main>
    </el-container>
  </div>

</template>

<script>
import localMenu from '../../common/menu'
import dataPanel from './components/dataPanel'

export default {
  name: 'main',
  components: { dataPanel, localMenu },
  data () {
    return {
      keyword: '',
      moduleId: '',
      moduleName: ''
    }
  },
  methods: {
    changeModuleId (val) {
      console.log(val)
      this.moduleId = val.id
      this.moduleName = val.name
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  overflow: hidden;
  height: calc(100vh - 136px);
  .menu-container {
    overflow: hidden;
    background-color: #fff;
    border-radius: 10px;
    height: calc(100vh - 140px);
    .menu-panel {
      margin: 0 20px;
      height: calc(60vh);
      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }
  .menu-search {
    padding: 20px;
    margin-bottom: 0px;
    .bottom-line {
      border-bottom: 1px solid #f2f6fc;
    }
  }
  .main-panel {
    background-color: #fff;
    margin-left: 15px;
    border-radius: 10px;
  }
}
</style>
