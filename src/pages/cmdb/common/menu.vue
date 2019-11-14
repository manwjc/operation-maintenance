<template>
  <div>
    <el-menu v-loading="loading" :default-active="activeIndex" ref="moduleMenu" :default-openeds="defaultOpenNav" :model="menuParent"
             class="el-menu-vertical-demo" style="border: none;">
      <el-submenu v-for="(item,index) in (show === 'configured' || show === 'unconfigured' ? show === 'configured' ? configuredMenu : unconfiguredMenu : allMenu)" :index="item.id" :key="item.id" style="border-bottom: 1px solid #EBEEF5">
        <template slot="title">{{item.name}}</template>
        <template v-for="child in item.childModules">
          <el-menu-item v-if="child !== undefined" :index="child.id" :key="child.id" @click="changeRouter(child.id,child.name)">
          {{child.name}}
          </el-menu-item>
        </template>
      </el-submenu>
    </el-menu>

  </div>

</template>

<script>
  import rbCmdbServiceFactory from '../../../services/cmdb/rb-cmdb-service.factory.js'

  export default {
    name: 'localMenu',
    props: ['show', 'keyword', 'menuType', 'moduleId'],
    data () {
      return {
        loading: true,
        menuParent: [], // 源导航
        configuredMenu: [],
        unconfiguredMenu: [],
        allMenu: [],
        flag: '',
        currentModuleId: '',
        moduleName: '',
        activeIndex: '',
        builtinFlag: false,  // 模型是否内置
        defaultActive: null,  // 默认选中的菜单，为index属性的值
        defaultOpenNav: [] // 默认展开的Nav
      }
    },
    watch: {
      keyword: function (val) {
        this.changeMenu()
      },
      show: function (val) {
        this.initMenu()
        // this.changeMenu()
      },
      moduleId (val) {
        if (val) {
          this.activeIndex = val
        }
      }
    },
    methods: {
      handleMenu (item, test, index, type) {
        if (item.childModules && item.childModules.length > 0) {
          item.childModules.forEach((t, index) => {
            this.handleMenu(t, item, index, type)
          })
        } else {
          if (this.keyword) {
            if (item.name.indexOf(this.keyword.trim()) > -1) {
              if (item[this.menuType].length > 0) {
                if (type === 'unconfigured') {
                  delete test.childModules[index]
                }
              } else {
                if (type === 'configured') {
                  delete test.childModules[index]
                }
              }
            } else {
              delete test.childModules[index]
            }
          } else {
            if (type !== 'all') {
              if (item[this.menuType].length > 0) {
                if (type === 'unconfigured') {
                  delete test.childModules[index]
                }
              } else {
                if (type === 'configured') {
                  delete test.childModules[index]
                }
              }
            }
          }
        }
      },
      changeMenu () {
        this.configuredMenu = JSON.parse(JSON.stringify(this.menuParent))
        this.unconfiguredMenu = JSON.parse(JSON.stringify(this.menuParent))
        this.allMenu = JSON.parse(JSON.stringify(this.menuParent))
        if (!this.moduleId) {
          this.activeIndex = ''
        } else {
          this.activeIndex = this.moduleId
        }
        if (this.show !== 'all') {
          this.configuredMenu.forEach((item, index) => {
            this.handleMenu(item, this.configuredMenu, index, 'configured')
          })
          this.unconfiguredMenu.forEach((item, index) => {
            this.handleMenu(item, this.unconfiguredMenu, index, 'unconfigured')
          })
        }
        this.allMenu.forEach((item, index) => {
          this.handleMenu(item, this.allMenu, index, 'all')
        })
        switch (this.show) {
          case 'configured':
            this.configuredMenu.forEach(item => {
              let len = 0
              for (let i in item.childModules) {
                if (i !== 'del') {
                  len++
                }
              }
              if (len > 0) {
                this.initActiceIndex(item)
              }
            })
            if (this.activeIndex === '') {
              this.$emit('setModuleId', {id: this.activeIndex, name: ''})
            }
            break
          case 'unconfigured':
            this.unconfiguredMenu.forEach(item => {
              this.initActiceIndex(item)
            })
            break
          case 'all':
            this.allMenu.forEach(item => {
              this.initActiceIndex(item)
            })
            break
        }
      },
      async initMenu () {
        this.loading = true
        if (this.menuType && this.menuType === 'rules') {
          await rbCmdbServiceFactory.ruleListModule().then((data) => {
            this.loading = false
            this.menuParent = data
            this.menuParent.forEach(item => {
              this.defaultOpenNav.push(item.id)
              // this.initTypeMenu(item)
            })
            this.changeMenu()
          }).catch((e) => {
            this.loading = false
          })
        } else {
          await rbCmdbServiceFactory.listModule().then((data) => {
            this.loading = false
            this.menuParent = data
            this.menuParent.forEach(item => {
              this.defaultOpenNav.push(item.id)
            })
            this.changeMenu()
          }).catch((e) => {
            this.loading = false
          })
        }
      },
      changeRouter (id, name) {
        this.currentModuleId = id
        this.activeIndex = id
        this.$emit('setModuleId', {id: id, name: name})
      },
      initActiceIndex (parent) {
        if (!this.moduleId) {
          if (parent.childModules) {
            parent.childModules.forEach(item => {
              if (this.activeIndex === '') {
                this.initActiceIndex(item)
              }
            })
          } else {
            this.activeIndex = '' + parent.id
            this.$emit('setModuleId', {id: this.activeIndex, name: parent.name})
          }
        }
      }
      // initTypeMenu (item, test, index) {
      //   if (!parent.childModules) {
      //     let data = {
      //       moduleId: parent.id,
      //       params: {
      //         pageNumber: 1,
      //         pageSize: 30
      //       },
      //       queryData: {}
      //     }
      //   } else {
      //     parent.childModules.forEach(item => {
      //       this.initTypeMenu(item, this.menuParent, index)
      //     })
      //   }
      // }
    },
    mounted: function () {
      this.initMenu()
    }
  }
</script>

<style lang="scss" scoped>

  .menu-search {
    .bottom-line {
      border-bottom: 1px solid #F0F0F0;
    }
  }

</style>
