<template>
    <div @click="router()" class="resourceManagement" v-loading="loading" :element-loading-text="loading_text">
        <div class="managementLeft">
          <el-input placeholder="输入模型名称过滤"
                    v-model="filterText">
          </el-input>
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
          <!--<module-tree @changeModuleId="changeModuleId" @showLoading="showLoading" @hideLoading="hideLoading"></module-tree>-->
        </div>
        <div class="managementRight">
          <instance-list :parentParams="moduleData"
                         :queryType="queryType" @showLoading="showLoading" @hideLoading="hideLoading"></instance-list>
        </div>
    </div>
</template>
<script>
import rbCmdbModuleServiceFactory from 'src/services/cmdb/rb-cmdb-module-service.factory'
export default {
  name: '/resource/iframe/resourceClassification',
  components: {
    instanceList: () => import('src/pages/resource/iframe/list/view.vue'),
  },
    data(){
        return {
          loading: false,
          loading_text: '正在加载数据...',
          moduleData: {
            moduleId: ''
          },
          queryType: 'module',
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
      filterText (val) {
        this.$refs.tree2.filter(val)
      }
    },
    mounted: function () {
      this.initModuleTree()
    },
    methods: {
        router() {
            console.log('this.$route.query.name', this.$route.query.name,this.$route.query.seriesName)
        },
        showLoading (loading_text) {
          this.loading = true
          if (loading_text) {
            this.loading_text = loading_text
          }
        },
        hideLoading () {
          this.loading = false
        },
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
          this.moduleData = {
            moduleId: node.id
          }
        },
        refresh () {
          this.moduleId = ''
          this.filterText = ''
          this.initModuleTree()
        }
    }
}
</script>
<style lang="stylus" scoped>
.resourceManagement {
    height:100%;
    width:100%;
    .managementLeft {
        float:left;
        width:250px;
        height:100%;
        padding:10px;
        background:#fff;
        overflow-y:auto;
        .inputQuery {
          width:90%;
          margin:0 auto;
        }
    }
    .managementRight {
        float:right;
        width:calc(100%- 260px);
        height:100%;
    }
    .image{
      background:#666
    }
}

</style>
