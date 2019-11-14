<template>
  <el-container class="components-container" v-loading="loading" :element-loading-text="loading_text">
    <el-aside class="yw-dashboard" width="260px">
      <section class="search-wrap">
        <el-input placeholder="输入部门或业务名称过滤" v-model="filterText">
        </el-input>
        <el-button type="text" icon="el-icon-refresh" @click="refresh()"></el-button>
      </section>
      <el-scrollbar class="aside-main"
                    style="height: calc(100% - 60px)">
        <el-tree class="filter-tree"
                 :data="data2"
                 :props="defaultProps"
                 :filter-node-method="filterNode"
                 node-key="uuid"
                 @node-click="nodeClick"
                 ref="tree2"
                 accordion>
          <span class="custom-tree-node"
                slot-scope="{ node, data }">
            <span>
              <span>
                <i :class="data.icon"></i>
                <span v-if="data.type === 'module'">{{node.label}}</span>
                <span v-else-if="data.type !== 'biz'">{{node.label}} ({{data.subSize?data.subSize:0}})</span>
                <span v-else>{{node.label}} ({{data.instanceSize?data.instanceSize:0}})</span>

                <!--<span v-if="data.type !== 'biz'">{{node.label}} ({{data.subSize?data.subSize:0}})</span>-->
                <!--<span v-else>{{node.label}} ({{data.instanceSize?data.instanceSize:0}})</span>-->
              </span>
              <!-- {{ node.label }}-->
              <!--<span v-if="node.type === 'department2'"> xx</span>-->
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </el-aside>
    <el-main class="yw-dashboard">
      <instance-grid :bizSystemCondition="bizSystemCondition"
                     :queryType="queryType" @showLoading="showLoading" @hideLoading="hideLoading"></instance-grid>
    </el-main>
  </el-container>
</template>
<script>
import instanceGrid from 'src/pages/cmdb/v2/instance/list/instance-list.vue'
import orgManagerService from 'src/services/cmdb/rb-orgManager-service.factory'
import rbCmdbModuleServiceFactory from 'src/services/cmdb/rb-cmdb-module-service.factory'
export default {
  components: {
    instanceGrid
  },
  data () {
    return {
      loading: false,
      loading_text: '正在加载数据...',
      moduleId: '',
      filterText: '',
      department1: '',
      department2: '',
      bizSystem: '',
      bizSystemCondition: {},
      queryType: 'bizSystem',
      data2: [],
      defaultProps: {
        children: 'subList',
        label: 'name',
        isLeaf: 'leaf',
        subSizeaa: 'subSize'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    },
    // 清空二级部门、业务、模型
    // department1 (val) {
    //   console.log(val)
    //   this.department1 = val
    //   this.department2 = ''
    //   this.bizSystem = ''
    //   this.moduleId = ''
    // },
    // department2 (val) {
    //   this.department2 = val
    //   this.bizSystem = ''
    //   this.moduleId = ''
    // },
    // bizSystem (val) {
    //   this.bizSystem = val
    //   this.moduleId = ''
    // },
    // moduleId (val) {
    //   this.moduleId = val
    // }
  },
  mounted: function () {
    this.initTree()
  },
  methods: {
    showLoading (loading_text) {
      this.loading = true
      if (loading_text) {
        this.loading_text = loading_text
      }
    },
    hideLoading () {
      this.loading = false
    },
    initTree () {
      let _t = this
      this.loading = true
      orgManagerService.loadTreeDepBiz().then((data) => {
        _t.data2 = data
        console.log(data)
        this.loading = false
      }).catch((data) => {
        this.loading = false
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    resolveCondition (tree) {
      if (tree.data.type === 'module') {
        this.moduleId = tree.data.uuid
      }
      if (tree.data.type === 'biz') {
        this.bizSystem = tree.data.name
      }
      if (tree.data.type === 'department2') {
        this.department2 = tree.data.name
      }
      if (tree.data.type === 'department1') {
        this.department1 = tree.data.name
      }
      if (tree.level !== 0) {
        this.resolveCondition(tree.parent)
      }
    },
    nodeClick (node, tree) {
      this.department1= ''
      this.department2= ''
      this.bizSystem= ''
      this.moduleId= ''
      // 判断节点类型
      console.log(tree)
      this.resolveCondition(tree)
      // if (node.type && node.type === 'department1') {
      //   this.department1 = node.name
      // }
      // if (node.type && node.type === 'department2') {
      //   this.department2 = node.name
      // }
      if (node.type && node.type === 'biz') {
        // this.bizSystem = node.name
        if (!node.subList || node.subList.length === 0) {
          // 加载模型数据
          let _t = this
          rbCmdbModuleServiceFactory.getModuleTree().then((data) => {
            _t.$set(node, 'subList', [])
            data.forEach((item) => {
              if (item.childModules && item.childModules.length > 0) {
                item.childModules.forEach((item2) => {
                  node.subList.push({ uuid: item2.id, name: item2.name, icon: item2.iconUrl, type: 'module' })
                })
              }
            })
          })
        }
      }
      // if (node.type && node.type === 'module') {
      //   this.moduleId = node.uuid
      // }
      // 跳转页面查询
      this.bizSystemCondition = {
        department1: this.department1,
        department2: this.department2,
        bizSystem: this.bizSystem,
        moduleId: this.moduleId
      }
    },
    refresh () {
      this.department1 = ''
      this.filterText = ''
      this.initTree()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
