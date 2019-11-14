<template>
  <div class="nav-list-wrapper">
    <el-menu
      class="el-menu-vertical-demo"
      :unique-opened="false"
      :default-openeds="openSubMenu"
      background-color="#E5E6E8"
      text-color="#666666"
    >
      <template v-for="(item,index) in secondMenu">
        <el-submenu
          :index="item.path"
          v-if="item.children.length>0"
          :class="{'active':item.active}"
        >
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item
            v-for="(sub,subindex) in item.children"
            :index="sub.path"
            :key="sub.path"
            @click="menuHandler(index,subindex)"
            :class="{'active':sub.active}"
            :style="{ color: sub.color }"
          >{{sub.name}}</el-menu-item>
        </el-submenu>
        <el-menu-item
          :index="item.path"
          v-else
          @click="menuHandler(index)"
          :class="{'active':item.active}"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
export default {
  props: ['navmenu'],
  data() {
    return {
      //        openSubMenu: []
    }
  },
  mounted: function() {
  },
  //    updated: function () {
  //      this.$nextTick(function () {
  //        if (this.openSubMenu !== -1) {
  //          document.querySelectorAll('.el-menu-vertical-demo .el-submenu')[this.openSubMenu].querySelector('div').click()
  //        }
  //      })
  //    },
  computed: {
    secondMenu() {
      const menu = []
      this.navmenu.forEach(function(item, index) {
        const firstBase = item.base
        const subMenu = []
        if (item.children && item.children.length > 0) {
          item.children.forEach((item, subindex) => {
            const secondBase = item.base
            const subMenuItem = {
              'name': item.name,
              'path': index + '-' + subindex
            }
            if (item.url) {
              subMenuItem.url = item.url
            }
            if (firstBase && secondBase && item.routers.length > 0) {
              subMenuItem.router = `${firstBase}${secondBase}${item.routers[0].path}`
              subMenuItem.page = item.routers[0].page
            }
            subMenu.push(subMenuItem)
          })
        }
        const menuItem = {
          'name': item.name,
          'icon': item.icon,
          'children': subMenu,
          'path': index + ''
        }
        if (firstBase && item.routers && item.routers.length > 0) {
          menuItem.router = `${firstBase}${item.routers[0].path}`
          menuItem.page = item.routers[0].page
        }
        if (item.url) {
          menuItem.url = item.url
        }
        menu.push(menuItem)
      })
      return menu
    },
    openSubMenu() {
      let menu = []
      this.secondMenu.forEach((item) => {
        menu.push(item.path)
      })
      return menu
    }
  },
  watch: {
    $route() {
      const breadcrumb = this.$store.state.homeStore.breadcrumb
      for (let i = 0; i < this.secondMenu.length; i++) {
        if (this.secondMenu[i].name === breadcrumb[1].name) {
          this.secondMenu[i].active = true
          let subMenu = this.secondMenu[i].children
          if (subMenu && subMenu.length !== 0) {
            for (let j = 0; j < subMenu.length; j++) {
              if (subMenu[j].name === breadcrumb[2].name) {
                this.secondMenu[i].children[j].active = true
                this.secondMenu[i].children[j].color = '#fff'
              } else {
                this.secondMenu[i].children[j].active = false
                this.secondMenu[i].children[j].color = 'rgb(102, 102, 102)'
              }
            }
          } else {
            this.secondMenu[i].color = '#fff'
          }
        } else {
          this.secondMenu[i].active = false
          this.secondMenu[i].color = 'rgb(102, 102, 102)'
          let subMenu = this.secondMenu[i].children
          if (subMenu && subMenu.length !== 0) {
            for (let j = 0; j < subMenu.length; j++) {
              this.secondMenu[i].children[j].active = false
              this.secondMenu[i].children[j].color = 'rgb(102, 102, 102)'
            }
          }
        }
      }
      this.$forceUpdate()
    }
  },
  methods: {
    menuHandler(index, subindex) {
      let url = this.getMenuUrl(index, subindex)
      if (url) {
        window.open(url, '_blank')
        return
      }
      const router = this.getMenuRouter(index, subindex)
      let page = this.getPage(index, subindex)

      if (router) {
        if (page) {
          this.$router.push({ path: router, query: { page: page } })
        } else {
          this.$router.push({ path: router })
        }
      }
    },
    getMenuRouter(index, subindex) {
      let router
      if (subindex >= 0) {
        router = this.secondMenu[index].children[subindex].router
      } else {
        router = this.secondMenu[index].router
      }
      return router
    },
    getMenuUrl(index, subindex) {
      let url
      if (subindex >= 0) {
        url = this.secondMenu[index].children[subindex].url
      } else {
        url = this.secondMenu[index].url
      }
      return url
    },
    getPage(index, subindex) {
      let page
      if (subindex >= 0) {
        page = this.secondMenu[index].children[subindex].page
      } else {
        page = this.secondMenu[index].page
      }
      return page
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./layout.common";
$outer-padding: 0px;
/* The scrollable content */
.nav-list-wrapper {
  display: block;
  width: $nav-list-width + 1px;
  height: calc(100% - #{$page-header-height});
  overflow-y: auto;
  overflow-x: hidden;
  padding: $outer-padding;
  background-color: #e5e6e8;
  .el-submenu.is-opened > ul li {
    background-color: #ececec !important;
  }
  .el-submenu.is-active.is-opened > ul > li.el-menu-item.is-active,
  .el-menu-item.is-active {
    background-color: rgb(229, 230, 232);
    color: rgb(102, 102, 102);
  }
  .el-submenu.active.is-opened > ul > li.el-menu-item.active,
  .el-menu-item.active {
    background-color: #46bafe !important;
    color: #fff;
  }
  el-menu-item:hover {
    background-color: #46bafe !important;
    color: #fff;
  }
}
</style>

