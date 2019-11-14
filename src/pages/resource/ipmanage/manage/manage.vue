<template>
  <el-container class="components-container">
    <el-aside class="yw-dashboard"
              width="260px">
      <section class="search-wrap">
        <el-input placeholder="筛选(暂无过滤功能)"
                  v-model="filterText">
        </el-input>
        <el-button type="text"
                   icon="el-icon-refresh"
                   @click="refresh()"></el-button>
      </section>
      <el-scrollbar class="aside-main"
                    style="height: calc(100% - 60px)">
        <el-menu :default-active="activeIndex"
                 ref="moduleMenu"
                 :default-openeds="defaultOpenNav"
                 :model="parentNav"
                 class="el-menu-manage">
          <el-submenu index="0"
                      key="0">
            <template slot="title">IP分配视图</template>
            <el-submenu v-for="(item,index) in parentNav"
                        :index="item.dictId"
                        :key="item.dictId">
              <template slot="title">{{item.dictCode}}</template>
              <template v-for="child in item.childMenuList">
                <el-menu-item :index="child.dictId"
                              :key="child.dictId"
                              @click="changeRouter(child.dictId,child.dictCode)">
                  {{child.dictCode}}
                </el-menu-item>
              </template>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-main class="yw-dashboard">
      <el-tabs class="yw-tabs"
               v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="承载网"
                     name="first">
          <bear-domain-list :moduleId="moduleId"
                            :moduleName="moduleName"
                            :tabIndex="tabIndex"></bear-domain-list>
        </el-tab-pane>
        <el-tab-pane label="公网"
                     name="second">
          <public-domain-list :moduleId="moduleId"
                              :moduleName="moduleName"
                              :tabIndex="tabIndex"></public-domain-list>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>

</template>

<script>
// import $ from 'jquery'
import bearDomainList from './bearDomainList.vue'
import publicDomainList from './publicDomainList.vue'
import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
import rbAllocateServiceFactory from 'src/services/cmdb/rb-allocate-services.factory.js'
export default {
  components: {
    bearDomainList,
    publicDomainList
  },
  data () {
    return {
      filterText: '',
      parentNav: [], // 父导航
      activeName: 'first',
      activeIndex: null,
      defaultActive: null, // 默认选中的菜单，为index属性的值
      moduleId: '',
      moduleName: '',
      defaultOpenNav: [], // 默认展开的Nav
      emid: '',
      builtinFlag: false,  // 模型是否内置
      tabIndex: 'bear',
      resourcePoors: [],
      dicts: {}
    }
  },
  watch: {
    defaultActive: function (newVal, oldVal) {
      let tmp = this.defaultActive
      this.$refs.moduleMenu.activedIndex = tmp
    }
  },
  mounted: function () {
    // this.init()
    // this.getModule()
    this.getResourcePoor1()
  },
  methods: {
    /* getModule () {
      rbCmdbServiceFactory.getModule().then((data) => {
        // this.parentNav = data
        this.parentNav = kkk.children

        // this.parentNav = obj1
        if (this.parentNav != null && this.parentNav.length > 0) {
          this.parentNav.forEach(item => {
            this.defaultOpenNav.push(item.id)
          })
          for (var i = 0; i < this.parentNav.length; i++) {
            if (this.parentNav[i].childModules.length <= 0) {
              continue
            } else {
              this.moduleId = this.parentNav[i].childModules[0].id
              this.moduleName = this.parentNav[i].childModules[0].name
              // this.builtinFlag = this.parentNav[i].childModules[0].builtin
              this.activeIndex = this.moduleId
              break
            }
          }
        }
      })
    }, */
    changeRouter (id, name) {
      // alert(id)
      this.moduleId = id
      this.moduleName = name
      this.activeIndex = id
      this.$emit('changeModule', name)
    },
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.tabIndex = 'bear'
      } else if (tab.name === 'second') {
        this.tabIndex = 'public'
      }
    },
    editEven: function () {
      this.getModule()
    },
    init () {
      this.getDict()
      // this.parentNav = kkk.children
    },
    getDict () {
      rbCmdbServiceFactory.getDicts().then((data) => {
        data.forEach(item => {
          this.dicts[item.code] = item.id
        })
        this.getResourcePoor('idcType')
      })
    },
    // 获取资源池
    getResourcePoor (type) {
      if (this.dicts) {
        rbCmdbServiceFactory.getDictValue({
          formId: this.dicts[type]
        }).then((data) => {
          /* data.formOptions.forEach(item => {
            let obj = {
              'name': item.name,
              'id': item.value
            }
            this.resourcePoors.push(obj)
          }) */
          data.name = 'IP分配视图'
          this.parentNav.push(data)
          if (this.parentNav != null && this.parentNav.length > 0) {
            this.parentNav.forEach(item => {
              this.defaultOpenNav.push(item.id)
            })
            for (var i = 0; i < this.parentNav.length; i++) {
              if (this.parentNav[i].formOptions.length <= 0) {
                continue
              } else {
                this.moduleId = this.parentNav[i].formOptions[0].id
                this.moduleName = this.parentNav[i].formOptions[0].name
                this.builtinFlag = this.parentNav[i].formOptions[0].builtin
                this.activeIndex = this.moduleId
                break
              }
            }
          }
        })
      }
    },
    getResourcePoor1 () {
      rbAllocateServiceFactory.selectAllocateMenu().then((res) => {
        // this.parentNav.push(res)
        this.parentNav = res
        if (this.parentNav != null && this.parentNav.length > 0) {
          this.parentNav.forEach((item) => {
            this.defaultOpenNav.push(item.dictId)
          })
          for (var i = 0; i < this.parentNav.length; i++) {
            if (this.parentNav[i].childMenuList.length <= 0) {
              continue
            } else {
              this.moduleId = this.parentNav[i].childMenuList[0].dictId
              this.moduleName = this.parentNav[i].childMenuList[0].dictCode
              this.builtinFlag = this.parentNav[i].childMenuList[0].dictNote
              this.activeIndex = this.moduleId
              break
            }
          }
        }
      })
    },
    //刷新
    refresh () {
      this.filterText = ''
    }

  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-menu-manage.el-menu {
  border: none;
  .el-submenu__title {
    height: 30px;
    line-height: 30px;
  }
}
</style>

