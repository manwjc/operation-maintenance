<template>
  <div id="home">
    <!-- <div class="nav-list-container" :class="{ 'nav_collapsed':navClosed }">
      <header class="nav-logo-container">
        <a href="/" style="display: flex">
          <img style="margin-left: 10px;height: 46px"
               class="logo"
          src="../../assets/img/logo/logo-white.png">
        </a>
      </header>
      <rc-nav-list :navmenu="secondMenu"></rc-nav-list>
      <div class="nav-collapse-handle-bar" v-if="!navClosed">
        <i class="el-icon-caret-left" @click="toggleNavCollapse()"></i>
      </div>
    </div>-->

    <!-- <div class="nav-expand-handle-bar" v-if="navClosed" @click="toggleNavCollapse()">
      <i class="el-icon-caret-right"></i>
    </div>-->

    <div class="home-right-pane"
         :class="{nav_collapsed:navClosed}">
      <div class="right-head clearfix">
        <!-- <header class="nav-logo-container"> -->
        <a href="/"
           class="link">
          <img class="logo"
               src="../../assets/img/logo/logo-white.png" />
        </a>
        <!-- </header> -->
        <h1 class="header__title">IT云运维管理平台</h1>
        <div class="pull-left">
          <!--
            新导航颜色
            backgroundColor="transparent"
            active-text-color="#ffffff"
            text-color="#B9C6D0"
          -->
          <!--
            旧导航颜色
            backgroundColor="#292C31"
            active-text-color="#ffffff"
            text-color="#999999"
          -->
          <el-menu :default-active="activeIndex"
                   class="el-menu-demo"
                   mode="horizontal"
                   @select="handleSelect"
                   backgroundColor="#transparent"
                   active-text-color="#ffffff"
                   text-color="#B9C6D0">
            <!-- <el-menu-item
              v-for="(item, index) in firstMenu"
              :index="index + ''"
              :key="index"
            >{{item.name}}</el-menu-item>-->

            <!-- 新需求改造导航 -->
            <template v-for="(item, index) of firstMenu">
              <el-menu-item v-if="item.url"
                            :key="index"
                            :index="`${index}`">
                <i class="el-icon-menu"></i>
                <span>{{item.name}}</span>
              </el-menu-item>
              <el-submenu v-else="item.url"
                          :key="index"
                          :index="`${index}`"
                          :class="{active: item.active}">
                <template slot="title">
                  <!-- <i class="el-icon-location"></i> -->
                  <svg class="svg-icon svg-icon-24"
                       aria-hidden="true">
                    <use :xlink:href="item.icon"></use>
                  </svg>
                  <span>{{ item.name }}</span>
                </template>
                <navbar-card :menu="item"
                             @toRoute="toRoute" />
              </el-submenu>
            </template>
          </el-menu>
        </div>
        <div class="profile-dropdown fr">
          <span class="split"></span>
          <span>{{username}}（{{roleName}}）</span>
          <!-- <span class="exit-icon">
            <i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>
          </span>-->
          <span style="cursor: pointer"
                @click="logout">退出</span>
          <!-- <i class="el-icon-switch-button"></i> -->
        </div>
      </div>
      <!--<div class="bread-crumb" v-if="breadcrumb.length > 0">-->
      <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
      <!--<el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path: item.to }"><span :class="{'breadcrumb-cursor': item.to}">{{item.name}}</span></el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
      <!--</div>-->

      <!-- <el-tabs
        class="tab-box"
        v-model="tabValue"
        type="border-card"
        closable
        @tab-remove="removeTab"
        @tab-click="activeTab"
      >
        <el-tab-pane
          v-for="(item,index) in tabValues"
          :key="index"
          :label="item.title"
          :name="item.fullPath"
        ></el-tab-pane>
      </el-tabs>-->
      <ul class="tab-list">
        <li v-for="(item,index) in tabValues"
            :key="index"
            class="tab-list__item"
            :class="{ active: index === tabIndex }"
            @click="activeTab(item, index)">
          <span>{{item.title}}</span>
          <i class="el-icon-close"
             @click.stop="removeTab(item, index)"></i>
        </li>
      </ul>
      <div class="right-body"
           v-if="tabValues.length > 0 && mapShow">
        <keep-alive :include="keepAliveRouters">
          <router-view :key="$route.fullPath"
                       v-on:closeTab="closeTab"></router-view>
        </keep-alive>
      </div>
    </div>
    <transition name="fade">
      <div class="project-modal"
           v-if="projectEnable">
        <div style="background-color: #fff;width: 397px;height: 100%;
              margin-right: 0px;margin-left: auto;overflow-y: auto;">
          <div class="header">
            项目
            <i class="el-icon-close"
               @click="projectEnable = false"></i>
          </div>
          <div class="project-body">
            <el-input v-model="projectLike"
                      placeholder="按名称过滤"></el-input>
            <div class="project-list"
                 v-show="projectView">
              <ul>
                <li v-for="item in projectList"
                    @click="onProjectSelected(item)"
                    style="cursor: pointer;overflow: hidden;"
                    :key="item">
                  <span v-if="item.name == project"
                        style="display: inline-block;width: 90%;color: #428BCA"
                        :title="item.name">{{item.name}}</span>
                  <span v-else
                        style="display: inline-block;width: 90%;"
                        :title="item.name">{{item.name}}</span>
                  <div title="项目详情"
                       @click="onProjectSelectedDetail(item)"
                       style="float: right;width: 10%;height: 30px;cursor: pointer">
                    <i class="el-icon-view"></i>
                  </div>
                </li>
              </ul>
            </div>
            <div v-show="projectCreate">
              <el-button @click="createProject()">
                <i class="el-icon-plus"></i>创建新项目
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Theme from 'src/assets/theme/index.js'
import rcNavList from './nav-list.vue'
// import navConfig from 'assets/js/menu/default-nav-config.js'
import rbProjectDataService from 'src/services/rb-project-data-service.factory.js'
import cookieService from 'src/services/cookie.service.js'
import rbRoleUtilities from 'src/services/rbac_role/rb-role-utilities.factory.js'
import rbRoleDataServiceFactory from 'src/services/rbac_role/rb-role-data-service.factory.js'
import NavbarCard from './navbar-card'

export default {
  mixins: [Theme],
  components: {
    rcNavList,
    NavbarCard
  },
  data: function() {
    return {
      mapShow: false,
      keepAliveOpen: false,
      keepAliveRouters: '', // 页面缓存
      // flag: false,
      tabIndex: 0,
      tabValue: '',
      tabValues: [],
      menuList: [],
      // refresh: false,
      isRouterAlive: true,
      username: '',
      namespace: '',
      roleName: '',
      navClosed: true, // 新需求关闭左侧导航栏
      activeIndex: '0',
      currentFirstLevel: 0,
      navConfig: this.$store.state.homeStore.operResource,
      // navConfig: navConfig,
      projectEnable: false,
      projectLike: '',
      existProject: false,
      projectList: [],
      timer: '',
      project: '你当前不在项目中',
      originProjectList: [],
      projectView: false,
      projectCreate: false
    }
  },
  computed: {
    firstMenu: function() {
      const levelOne = []
      this.navConfig.categories.forEach(function(item) {
        levelOne.push({
          name: item.name,
          url: item.url,
          children: item.children,
          icon: item.icon,
          active: false
        })
      })
      return levelOne
    },
    secondMenu: function() {
      return this.navConfig.categories[this.currentFirstLevel].children
    },
    //      activeIndex: function () {
    //        const breadcrumb = this.$store.state.homeStore.breadcrumb
    //        for (let i = 0; i < this.firstMenu().length; i++) {
    //          if (this.firstMenu()[i] === breadcrumb[0].name) {
    //            return i
    //          }
    //        }
    //        return 0
    //      },
    breadcrumb: function() {
      //        const data = this.$store.state.homeStore.place
      //        if (data.length !== 0) {
      //          this.activeIndex = data[0]
      //          this.handleSelect(data[0])
      //        }
      return this.$store.state.homeStore.breadcrumb
    }
  },
  mounted: function() {
    setTimeout(() => {
      this.mapShow = true
    }, 0)
    let logValid = sessionStorage.getItem('logValid')
    if (!logValid || logValid === 'false') {
      this.$router.push({ path: '/login' })
      return
    }
    // this.getProjectPermission()
    const project = cookieService.getCookie('project')
    this.project = project || '你当前不在项目中'
    this.timer = setInterval(() => {
      const project = cookieService.getCookie('project')
      this.project = project || '你当前不在项目中'
    }, 3000)
    this.username = sessionStorage.getItem('username')
    this.namespace = sessionStorage.getItem('namespace')
    this.roleName = sessionStorage.getItem('roleName')
    this.navConfig.categories = this.navConfig.categories.filter((data) => {
      return data.name !== 'other'
    })
    if (this.namespace !== this.username) {
      // this.username = `${this.username}@${this.namespace}`
      // 根据权限过滤菜单
      rbRoleDataServiceFactory.getMenuPermissions(sessionStorage.getItem('username')).then(permissions => {
        if (permissions.includes('*')) {
          return
        }
        this.navConfig.categories = this.navConfig.categories.filter((first) => {
          first.children = first.children.filter((second) => {
            if (second.children && second.children.length > 0) {
              second.children = second.children.filter(third => {
                if (third.resource && !permissions.includes(third.resource)) {
                  return false
                } else {
                  return true
                }
              })
              if (second.children.length > 0) {
                return true
              } else {
                return false
              }
            } else {
              if (second.resource && !permissions.includes(second.resource)) {
                return false
              } else {
                return true
              }
            }
          })
          if (first.children.length > 0 || first.url) {
            return true
          } else {
            return false
          }
        })
        this.$router.push({ path: 'home' })
        this.handleSelect(0)
      })
    } else {
      this.$router.push({ path: 'home' })
      this.handleSelect(0)
    }

    // window.addEventListener('keydown', event => {
    //   if (event.keyCode === 9) {
    //     event.preventDefault()
    //   }
    // })
  },
  destroyed: function() {
    clearInterval(this.timer)
    // window.removeEventListener('keydown', event => {
    //   event.preventDefault()
    // })
  },
  methods: {
    closeTab(val) {
      let removeItem = ''
      let removeIndex = ''
      this.tabValues.forEach((item, index) => {
        if (val === item.fullPath) {
          removeItem = item
          removeIndex = index
        }
      })
      this.removeTab(removeItem, removeIndex)
    },
    // 路由导航
    toRoute({ item, parent, menu }) {
      // 如果有 url 的一级路由直接打开新窗口
      if (item.url) {
        window.open(item.url, '_blank')
        return
      }

      // 限制窗口标签的数量(窗口标签的最小宽度是108px，标签的总和不允许超过整个窗口的宽度)
      if ((this.tabValues.length + 1) * 108 >= document.body.offsetWidth) {
        this.$message.warning('窗口标签已达上限，无法添加')
        return
      }

      let path = item.base + item.routers[0].path
      path = parent.base + path

      let menuItem, menuItemKey
      this.tabValues.forEach((val, key) => {
        if (val.fullPath === path) {
          menuItem = val
          menuItemKey = key
        }
      })

      // 判断是否已经在窗口标签中，如果是则直接点亮标签，否则点亮最后一个标签
      if (menuItem) {
        this.tabIndex = menuItemKey
      } else {
        this.menuList.push({ menuPath: path, menuName: menu.name })
        this.tabIndex = this.tabValues.length
      }

      // 跳转路由，并点亮该路由的菜单
      this.$router.push(path)
      this.firstMenu.forEach((item) => {
        item.active = false
      })
      menu.active = true

      // 收起所有菜单栏
      const elemList = document.querySelectorAll('body > .el-menu--horizontal')
      elemList.forEach(val => {
        val.style.display = 'none'
      })
    },
    // 删除标签
    removeTab(item, index) {
      this.keepAliveOpen = true
      let tabs = this.tabValues

      let tabValue = this.tabValue
      if (item.fullPath === this.tabValue) {
        tabs.forEach((val, idx) => {
          if (val.fullPath !== this.tabValue) return
          let nextTab = tabs[idx + 1] || tabs[idx - 1]
          if (!nextTab) return
          this.tabValue = nextTab.fullPath
          // 点亮下一个窗口标签
          const menu = this.menuList.find(val => val.menuPath === this.tabValue)
          this.firstMenu.forEach((item) => {
            item.active = false
            if (menu && menu.menuName === item.name) {
              item.active = true
            }
          })
        })
        this.$router.push({ path: this.tabValue })
      }

      this.menuList = this.menuList.filter(val => val.menuPath !== item.tabValue)
      this.tabValues = tabs.filter(tab => tab.fullPath !== item.fullPath)
      // 点亮下一个窗口标签
      if (item.fullPath === tabValue) {
        this.tabIndex = index - 1
      } else {
        // 点亮前一个窗口标签
        if (this.tabIndex > index) {
          this.tabIndex = this.tabIndex - 1
        }
      }
    },
    // 增加标签
    activeTab(val, index) {
      if (this.tabValue === val.fullPath) return
      this.tabIndex = index
      this.keepAliveOpen = true
      this.tabValue = val.fullPath
      this.$router.push({ path: val.fullPath })
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
    },
    // getProjectPermission () {
    //   rbRoleUtilities.resourceTypeSupportPermissions('project', 'view')
    //     .then((data) => {
    //       this.projectView = data
    //     })
    //   rbRoleUtilities.resourceTypeSupportPermissions('project', 'create')
    //     .then((data) => {
    //       this.projectCreate = data
    //     })
    // },
    toggleNavCollapse() {
      this.navClosed = !this.navClosed
    },
    // 默认跳转的来源
    handleSelect(index) {
      let url = this.firstMenu[index].url
      if (url !== undefined && url !== '') {
        url = url.replace('BPMX_SERVER_URL', sessionStorage.getItem('BPMX_SERVER_URL'))
        if (this.firstMenu[index].name.indexOf('流程') > -1) {
          window.open(url + '?mirrorToken=' + sessionStorage.getItem('mirror'), '_blank')
        } else if (this.firstMenu[index].name === '运营分析') {
          url = url.replace('OPERATE_SERVER_URL', sessionStorage.getItem('OPERATE_SERVER_URL'))
          // debugger
          window.open(url + '/webroot/decision/view/report?viewlet=%5B8fd0%5D%5B8425%5D%5B62a5%5D%5B8868%5D.cpt&op=write', '_blank')
        } else {
          var form = $("<form method='post' target='_blank'></form>")
          form.attr({ 'action': url })
          //          var input = $("<input type='hidden'>")
          //          input.attr({"name":"Authorization"})
          //          input.val("Bearer eyJrIjoiWEJJWkh2SXVOV0lmNjZ2N053S2haVHNKbWY4Z0syelkiLCJuIjoiYXNwaXJlIiwiaWQiOjF9")
          //          form.append(input)
          $('html').append(form)
          form.submit()
        }
        return
      }
      // // this.tabValues = []
      // this.tabValue = ''
      this.currentFirstLevel = index
      this.activeIndex = index + ''
      let router
      const currentMenu = this.secondMenu[0]
      if (currentMenu.children && currentMenu.children.length > 0) {
        router = `${currentMenu.base}${currentMenu.children[0].base}${currentMenu.children[0].routers[0].path}`
      } else {
        router = `${currentMenu.base}${currentMenu.routers[0].path}`
      }
      this.$router.push({ path: router })
    },
    logout() {
      this.$confirm('确认退出吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sessionStorage.setItem('logValid', false)
        cookieService.setCookie('project', '')
        const redirectUri = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
        const logoutUrl = this.keycloak.createLogoutUrl({
          redirectUri: redirectUri
        })
        window.location.href = logoutUrl
      })
    },
    handleCommand(command) {
      // if (command === 'setting') {
      //   this.$router.push({path: '/org/setting/detail'})
      // }
    },
    addProject() {
      // ajax/projects/alauda/?namespace=alauda
      this.projectEnable = true
      rbProjectDataService.getProjects().then((data) => {
        this.originProjectList = this.projectList = data
      })
    },
    onProjectSelected(project) {
      if (this.isActiveProject(project)) {
        this.projectEnable = false
        return
      }
      cookieService.setCookie('project', project.name)
      this.project = project.name
      this.projectEnable = false
      this.existProject = true
      const path = this.$route.path
      if (path.indexOf('/project') === 0 || path.indexOf('/org') === 0) {
        this.$router.push('/app_service/app_service/list')
      } else {
        this.$router.push('/refresh')
      }
      // this.$router.push('/app_service/app_service/list')
      //        this.$route.
      // This is required, otherwise the view will not be updated
      //        const states = $state.current.name.split('.');
      //        if (_.intersection(states, projectSwitchStates).length) {
      //          $state.go('app_service.app_service');
      //        } else {
      //          $state.reload();
      //        }
    },
    onProjectSelectedDetail(project) {
      if (this.isActiveProject(project)) {
        this.projectEnable = false
        return
      }
      cookieService.setCookie('project', project.name)
      this.project = project.name
      this.projectEnable = false
      this.existProject = true
      this.$router.push({ path: '/project/detail', query: { project_name: project.name } })
    },
    toProjectDetail() {
      this.$router.push({ path: '/project/detail', query: { project_name: this.project } })
    },
    isActiveProject(project) {
      return this.project === project.name
    },
    exitProject() {
      this.$confirm(`确定要退出项目${this.project}?`, '退出项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cookieService.setCookie('project', '')
        this.project = '你当前不在项目中'
        this.existProject = false
        const path = this.$route.path
        if (path.indexOf('/project') === 0 || path.indexOf('/org') === 0) {
          this.$router.push('/app_service/app_service/list')
        } else {
          this.$router.push('/refresh')
        }
      })
    },
    createProject() {
      this.projectEnable = false
      this.$router.push({ path: '/project/create', query: { project_name: this.project } })
    }

  },
  watch: {
    $route(to, from) {
      let toFullPath = to.fullPath
      let fromFullPath = from.fullPath.split('?')[0]

      // 页面缓存设置(缓存name来自于路由路径)
      let keepAlivePath = []
      let isExist = false
      this.tabValues.forEach((item, index, attr) => {
        // if (item.fullPath.split('?')[0] === toFullPath.split('?')[0]) {
        //   isExist = true;
        //   item.fullPath = toFullPath;
        // }
        if (item.fullPath.split('?')[0] === toFullPath.split('?')[0] && toFullPath.indexOf('instance/detail') === -1) {
          isExist = true
          item.fullPath = toFullPath
        } else if (toFullPath === item.fullPath) {
          isExist = true
          item.fullPath = toFullPath
        }
        keepAlivePath.push(item.fullPath)
      })
      // let param = toFullPath.split('?')[1]
      if (!isExist) {
        // 缓存队列
        keepAlivePath.push(toFullPath)
        // if (param && toFullPath.indexOf("instance/add") > -1 && param.indexOf("moduleId") > -1 && param.indexOf("instanceId") > -1) {
        //   this.tabValues.push({ fullPath: toFullPath, title: '查看资源' });
        // } else {
        this.tabValues.push({ fullPath: toFullPath, title: to.meta.title })
        this.menuList.push({ menuPath: toFullPath, menuName: to.meta.title })
        // }
      }

      if (isExist && !this.keepAliveOpen) {
        // this.tabValues.forEach(item => {
        //   if (param && toFullPath.indexOf("instance/add") > -1 && param.indexOf("moduleId") > -1 && param.indexOf("instanceId") > -1) {
        //    item.title = '查看资源';
        //   } else if (param && toFullPath.indexOf("instance/add") > -1 && param.indexOf("moduleId") > -1) {
        //     item.title = '编辑资源';
        //   }
        // })
        keepAlivePath = keepAlivePath.filter((item) => {
          return (item !== toFullPath && item !== toFullPath.split('?')[0])
        })
      }
      this.keepAliveRouters = keepAlivePath.join()
      this.tabValue = toFullPath
      // 高亮当前tab
      this.tabValues.forEach((val, key) => {
        if (val.fullPath === this.tabValue) {
          this.tabIndex = key
        }
      })
      this.keepAliveOpen = false

      // if (this.tabValues.length > 0) {
      //   this.tabValues.forEach(item => {
      //     // 如果path相同
      //     if (item.fullPath === toFullPath) {
      //       this.flag = true
      //       return false
      //     }
      //   })
      // }
      // if (this.flag) {
      //   // 如果根路径相同代表是同界面点出去的
      //   let keys = Object.keys(to.query)
      //   let len = keys.length
      //   if (len > 0) {
      //     this.refresh = true
      //   } else {
      //     this.refresh = false
      //   }
      //   this.tabValue = toFullPath
      // } else {
      //   this.refresh = true

      //   if (toFullPath.indexOf('/scene/add') > -1 || toFullPath.indexOf('/scene/list') > -1) {
      //     this.tabValues.forEach((item, index) => {
      //       if (item.fullPath === fromFullPath) {
      //         this.tabValues.splice(index, 1, { fullPath: toFullPath, title: to.meta.title })
      //       }
      //     })
      //   } else if (toFullPath.indexOf('/demand/add') > -1 || toFullPath.indexOf('/demand/list') > -1) {
      //     this.tabValues.forEach((item, index) => {
      //       if (item.fullPath === fromFullPath) {
      //         this.tabValues.splice(index, 1, { fullPath: toFullPath, title: to.meta.title })
      //       }
      //     })
      //   } else if (toFullPath.indexOf('/demand/detail') > -1 || toFullPath.indexOf('/demand/list') > -1) {
      //     this.tabValues.forEach((item, index) => {
      //       if (item.fullPath === fromFullPath) {
      //         this.tabValues.splice(index, 1, { fullPath: toFullPath, title: to.meta.title })
      //       }
      //     })
      //   } else if (toFullPath.indexOf('/demand/edit') > -1 || toFullPath.indexOf('/demand/detail') > -1) {
      //     this.tabValues.forEach((item, index) => {
      //       if (item.fullPath === fromFullPath) {
      //         this.tabValues.splice(index, 1, { fullPath: toFullPath, title: to.meta.title })
      //       }
      //     })
      //   } else {
      //     this.tabValues.push({ fullPath: toFullPath, title: to.meta.title })
      //   }
      //   this.tabValue = toFullPath
      // }
      // if (this.tabValues.indexOf(toFullPath) < 0) {
      //   this.tabValues.push({ fullPath: toFullPath, title: to.meta.title })
      // }

      const breadcrumb = this.$store.state.homeStore.breadcrumb
      let isSelect = false
      for (let i = 0; i < this.firstMenu.length; i++) {
        if (this.firstMenu[i].name === breadcrumb[0].name) {
          this.currentFirstLevel = i
          this.activeIndex = i + ''
          isSelect = true
          break
        }
      }
      if (!isSelect) {
        this.activeIndex = ''
      }
    },
    projectLike: function(val, oldVal) {
      this.projectList = this.originProjectList.filter((project) => {
        return project.name.includes(this.projectLike)
      })
    },
    projectEnable: function(val) {
      if (!val) {
        this.projectLike = ''
      }
    },
    project: function(val) {
      if (val === '你当前不在项目中') {
        this.existProject = false
      } else {
        this.existProject = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./home.component.scss";

@mixin orderIcon($icon) {
  $base: "./images/";
  background: url("#{$base}order-#{$icon}.png");
}
.profile-dropdown {
  line-height: 58px;
  color: #fff;
}

.right-head {
  overflow: hidden;
}

.pull-right {
  line-height: 60px;
  font-size: 14px;
  //   color: #999;
  // 新样式
  color: #fff;
}

.link {
  float: left;
  margin-right: 10px;
  display: flex;
  height: 100%;
  align-items: center;
  .logo {
    width: 102px;
    height: 29px;
    border-right: 1px solid #fff;
    padding-right: 10px;
  }
}

.header {
  &__title {
    color: #fff;
    float: left;
    font-size: 20px;
    font-weight: 400;
    line-height: 58px;
  }
}

// /deep/ {
//   .el-tabs--card > .el-tabs__header {
//     background-color: white;
//     margin-bottom: 0;
//     .el-tabs__nav {
//       margin-top: 10px;
//       margin-left: 15px;
//       border: none;
//     }

//     .el-tabs__nav .is-top {
//       background-color: rgb(229, 230, 232);
//       border-radius: 5px 5px 0px 0px;
//       line-height: 30px;
//       height: 30px;
//     }
//     .el-tabs__nav .el-tabs__item:nth-child(1) span {
//       display: none;
//     }
//     .el-tabs__item.is-active {
//       color: white;
//       background-color: #292c31;
//     }
//     .el-tabs__item {
//       margin-right: 2px;
//     }
//   }
// }

.tab-list {
  display: flex;
  align-items: center;
  background: #e8ecf0;
  &__item {
    position: relative;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    line-height: 40px;
    height: 40px;
    border: none;
    min-width: 108px;
    padding: 0 30px;
    box-sizing: border-box;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &:hover {
      cursor: pointer;
    }
    &:nth-child(1) {
      i {
        display: none;
      }
    }
    &:first-child::before {
      display: none;
    }
  }
  .el-icon-close {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    font-weight: bold;
    z-index: 1;
  }
  .tab-list__item + .tab-list__item {
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 1px;
      height: 16px;
      transform: translateY(-50%);
      z-index: 1;
      background: #666;
    }
  }
  .tab-list__item.active + .tab-list__item {
    &::before {
      display: none;
    }
  }
  .tab-list__item.active {
    color: #1f89da;
    background-color: #fff;
    &::before {
      display: none;
    }
  }
}

.username-cursor {
  cursor: default;
}
.breadcrumb-cursor {
  cursor: pointer;
  color: #4f5e66;
  &:hover {
    color: #46bafe !important;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
