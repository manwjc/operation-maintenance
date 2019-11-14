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
                <!--<img width="16"-->
                     <!--height="16"-->
                     <!--:src="data.iconUrl"-->
                     <!--class="image" />-->
                {{ node.label }}
              </span>
            </span>
          </el-tree>
          <!--<module-tree @changeModuleId="changeModuleId" @showLoading="showLoading" @hideLoading="hideLoading"></module-tree>-->
        </div>
        <div class="managementRight">
          <instance-list :parentParams="produceData"
                         :queryType="queryType" @showLoading="showLoading" @hideLoading="hideLoading"></instance-list>
        </div>
    </div>
</template>
<script>
import rbCmdbModuleServiceFactory from 'src/services/cmdb/rb-cmdb-module-service.factory'

export default {
  // name: '/resource/iframe/resourceClassification',
  components: {
    instanceList: () => import('src/pages/resource/iframe/list/view.vue'),
  },
    data(){
        return {
          loading: false,
          loading_text: '正在加载数据...',
          produceData: {
            mfrFactory: '',
            moduleId: ''
          },
          queryType: 'module',
          filterText: '',
          defaultProps: {
            children: 'childModules',
            label: 'name'
          },
          // defaultProps: {
          //   children: 'subList',
          //   label: 'name',
          //   isLeaf: 'leaf',
          //   subSize: 'subSize'
          // },
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
          //获取品牌
          this.rbHttp.sendRequest({
            method: 'GET',
            params: { 'type': 'device_mfrs' },
            url: `/v1/cmdb/configDict/getDictsByType`
          }).then((res) => {
            res.forEach(item => {
              _.$set(item, 'type', 'produce')
            })
            _.menuParent.push({ name: '全部', id: '', childModules: res})
          }).catch((e) => {
                console.error(e)
              })
          // rbAssessmentServiceFactory.getdeviceMfrsList().then((data) => {
          //   data.forEach(item => {
          //     _.$set(item, 'type', 'produce')
          //   })
          //   _.menuParent.push({ name: '全部', id: '', childModules: data})
          //   }).catch((e) => {
          //     console.error(e)
          //   })
          // rbCmdbModuleServiceFactory.getModuleTree().then((data) => {
          //   _.menuParent.push({ name: '全部', id: '', childModules: data })
          // }).catch((e) => {
          //   console.error(e)
          // })
        },
        filterNode (value, data) {
          if (!value) return true
          return data.name.indexOf(value) !== -1
        },
        nodeClick (node, tree) {
          // if (node.id !== '' && node.childModules && node.childModules.length > 0) {
          //   return
          // }
          let _t = this
          if (node.type === 'module') {
            this.produceData = {
              moduleId:  node.uuid,
              mfrFactory: tree.parent.data.name
            }
          }
          if (node.type === 'produce' ) {
            this.produceData = {
              mfrFactory: node.name
            }
            rbCmdbModuleServiceFactory.getModuleTree().then((data) => {
              _t.$set(node, 'childModules', [])
              data.forEach((item) => {
                if (item.childModules && item.childModules.length > 0) {
                  item.childModules.forEach((item2) => {
                    node.childModules.push({ uuid: item2.id, name: item2.name, icon: item2.iconUrl, type: 'module' })
                  })
                }
              })
            })
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
