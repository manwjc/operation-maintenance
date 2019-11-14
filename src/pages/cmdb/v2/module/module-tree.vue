<template>
  <div class="components-container">
    <section class="search-wrap">
      <el-input placeholder="输入模型名称过滤"
                v-model="filterText">
      </el-input>
      <el-button type="text"
                 icon="el-icon-refresh"
                 @click="refresh()"></el-button>
    </section>
    <el-scrollbar class="aside-main"
                  style="height: calc(100% - 60px)">
      <el-tree class="filter-tree"
               :data="menuParent"
               :props="defaultProps"
               :filter-node-method="filterNode"
               node-key="id"
               @node-click="nodeClick"
               :default-expanded-keys="defaultOpenNav"
               ref="tree2">
        <span class="custom-tree-node"
              slot-scope="{ node, data }">
          <span>
            <img width="16"
                 height="16"
                 :src="data.iconUrl"
                 class="image" /> {{ node.label }}
          </span>
        </span>
      </el-tree>
    </el-scrollbar>
  </div>
</template>
<script>
import rbCmdbModuleServiceFactory from 'src/services/cmdb/rb-cmdb-module-service.factory'
export default {
  name: 'moduleTree',
  data () {
    return {
      filterText: '',
      defaultProps: {
        children: 'childModules',
        label: 'name'
      },
      menuParent: [], // 源导航
      defaultOpenNav: [''] // 默认展开的Nav
    }
  },
  watch: {
    moduleId (val) {
      if (val) {
        this.activeIndex = val
      }
    },
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    initModuleTree () {
      let _ = this
      _.menuParent = []
      rbCmdbModuleServiceFactory.getModuleTree().then((data) => {
        _.menuParent.push({ name: '全部', id: '', childModules: data })
      }).catch((e) => {
        console.error(e)
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    nodeClick (node) {
      if (node.id !== '' && node.childModules && node.childModules.length > 0) {
        return
      }
      this.$emit('changeModuleId', { module: node })
    },
    refresh () {
      this.moduleId = ''
      this.filterText = ''
      this.initModuleTree()
    }
  },
  mounted: function () {
    this.initModuleTree()
  }
}
</script>

<style lang="scss" scoped>
.components-container {
  height: 100%;
}
.image {
  width: 16px;
  height: 16px;
  background-color: gray;
}
</style>
