<template>
  <div class="rule-container">
    <el-container>
      <el-aside class="menu-container"
                width="23%">
        <el-row class="menu-search">
          <el-row style="margin-top: 10px">
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
          <el-row class="bottom-line"
                  style="margin-top: 20px">
            <el-col :span="6"
                    style="line-height: 30px">
              配置规则
            </el-col>
            <el-col :span="18">
              <el-radio-group v-model="configured"
                              style="margin: 10px 0px 20px 20px;">
                <el-radio :label="1">已配置</el-radio>
                <el-radio :label="0"
                          style="margin-left: 10px">未配置</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>

        </el-row>
        <el-scrollbar class="menu-panel">
          <local-menu :menuType="'rules'"
                      :keyword="keyword"
                      :show="configured === 1 ? 'configured' : 'unconfigured'"
                      @setModuleId="changeModuleId"></local-menu>
        </el-scrollbar>
      </el-aside>
      <el-main class="main-panel">
        <rule-panel :moduleId="moduleId"
                    :moduleName="moduleName"></rule-panel>
      </el-main>
    </el-container>
  </div>
</template>


<script>
import localMenu from '../../common/menu'
import rulePanel from './components/rulePanel'
export default {
  name: 'main',
  components: { rulePanel, localMenu },
  data () {
    return {
      keyword: '',
      moduleId: '',
      moduleName: '',
      configured: 1 // 是否配置
    }
  },
  watch: {
  },
  methods: {
    changeModuleId (val) {
      this.moduleId = val.id
      this.moduleName = val.name
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  overflow: hidden;
  height: calc(100vh - 128px);
  .menu-container {
    overflow: hidden;
    background-color: #fff;
    border-radius: 10px;
    height: 100%;
    .menu-panel {
      margin: 0 20px;
      height: calc(100vh - 280px);
      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }
  .menu-search {
    padding: 20px;
    margin-bottom: 0px;
    .bottom-line {
      border-bottom: 1px solid #e6e6e6;
    }
    /deep/ .el-radio {
      margin-right: 0px;
    }
  }
  .main-panel {
    background-color: #fff;
    margin-left: 15px;
    border-radius: 10px;
  }
}
</style>
