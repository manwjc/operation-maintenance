import Vue from 'vue'
import Router from 'vue-router'
import store from 'src/store/index'

import navConfig from 'assets/js/menu/default-nav-config.js' // 旧的导航结构
// import navConfig from 'assets/js/menu/default-nav-config-new.js' // 新的导航结构

Vue.use(Router)
const homeRouter = []

navConfig.categories.forEach((categorie) => {
  let crumbone = ''
  let crumbtwo = ''
  let crumbthree = ''
  let crumbfoure = ''
  let crumbfive = ''
  let clickCrumbIndex
  if (categorie.name !== 'other') {
    // 自动化管理
    crumbone = categorie.name
  }
  if (categorie.children.length > 0) {
    // 第二层孩子数组里面
    categorie.children.forEach((item) => {
      // mirror
      const firstBase = item.base
      // 巡检管理
      crumbtwo = item.name
      let mainPage = ''
      if (item.routers && item.routers.length > 0) {
        // for (var i = 0; i < item.routers.length; i++) {
        //   if (item.routers[i].isMainPage) {
        mainPage = `${firstBase}${item.routers[0].path}`
        //     break
        //   }
        // }
        // 第三层
        item.routers.forEach((item) => {
          let comp01
          if (firstBase === '/') {
            comp01 = () => import(/* webpackChunkName: "commonchunk" */`src/pages${firstBase}${item.path}/${item.component}`)
          } else if (firstBase === '/mirror_alert') {
            comp01 = () => import(/* webpackChunkName: "mirroralert" */`src/pages${firstBase}${item.path}/${item.component}`)
          } else if (firstBase === '/resource') {
            comp01 = () => import(/* webpackChunkName: "resource" */`src/pages${firstBase}${item.path}/${item.component}`)
          } else {
            comp01 = resolve => require([`src/pages${firstBase}${item.path}/${item.component}`], resolve)
          }
          crumbthree = item.name
          let breadcrumb = [crumbone, crumbtwo, crumbthree]
          breadcrumb = breadcrumb.filter(data => {
            return data
          })
          if (crumbone.length > 0) {
            clickCrumbIndex = 1
          } else {
            clickCrumbIndex = -1
          }
          homeRouter.push({
            meta: {
              title: item.name,
              mainPage: mainPage,
              clickCrumbIndex: clickCrumbIndex,
              breadcrumb: breadcrumb,
              name: item.name
            },
            path: `${firstBase}${item.path}`,
            component: comp01
            // component: resolve => require([`src/pages${firstBase}${item.path}/${item.component}`], resolve)
          })
        })
      }

      if (item.children && item.children.length > 0) {
        item.children.forEach((item) => {
          // 巡检模板管理
          crumbthree = item.name
          // template
          const secondBase = item.base
          let mainPage = ''
          // for (var i = 0; i < item.routers.length; i++) {
          //   if (item.routers[i].isMainPage) {
          //     mainPage = `${firstBase}${secondBase}${item.routers[i].path}`
          //     break
          //   }
          // }
          // first mirror  second template
          if (item.routers && item.routers.length > 0) {
            mainPage = `${firstBase}${secondBase}${item.routers[0].path}`
            item.routers.forEach((item) => {
              // 最里面的模板管理
              crumbfoure = item.name
              let breadcrumb = [crumbone, crumbtwo, crumbthree, crumbfoure]
              breadcrumb = breadcrumb.filter(data => {
                return data
              })
              if (crumbone.length > 0) {
                clickCrumbIndex = 2
              } else {
                clickCrumbIndex = 1
              }
              homeRouter.push({
                meta: {
                  title: item.name,
                  mainPage: mainPage,
                  clickCrumbIndex: clickCrumbIndex,
                  breadcrumb: breadcrumb,
                  keepAlive: item.keepAlive
                },
                path: `${firstBase}${secondBase}${item.path}`,
                component: resolve => require([`src/pages${firstBase}${secondBase}${item.path}/${item.component}`], resolve)
              })
              // 第五层内部扩充
              if (item.children && item.children.length > 0) {
                item.children.forEach((item) => {
                  // 模板设置
                  crumbfoure = item.name
                  // add
                  const ThirdBase = item.base
                  let mainPage = ''
                  if (item.routers && item.routers.length > 0) {
                    mainPage = `${firstBase}${secondBase}${ThirdBase}`
                    item.routers.forEach((item) => {
                      // 最里层的模板管理
                      crumbfive = item.name
                      let breadcrumb = [crumbone, crumbtwo, crumbthree, crumbfoure, crumbfive]
                      breadcrumb = breadcrumb.filter(data => {
                        return data
                      })
                      if (crumbone.length > 0) {
                        clickCrumbIndex = 3
                      } else {
                        clickCrumbIndex = 1
                      }
                      homeRouter.push({
                        meta: {
                          title: item.name,
                          mainPage: mainPage,
                          clickCrumbIndex: clickCrumbIndex,
                          breadcrumb: breadcrumb,
                          keepAlive: item.keepAlive
                        },
                        path: `${firstBase}${secondBase}${ThirdBase}${item.path}`,
                        component: resolve => require([`src/pages${firstBase}${secondBase}${ThirdBase}${item.path}/${item.component}`], resolve)
                      })
                    })
                  }
                })
              }
              // 新添加
            })
          }
        })
      }
    })
  }
})
homeRouter.push({
  meta: {
    title: '刷新'
  },
  path: '/refresh',
  component: resolve => require(['src/pages/refresh/refresh.vue'], resolve)
}
  // {
  //   meta: {
  //     title: '刷新'
  //   },
  //   path: '/mirror/template/add/addItems',
  //   component: resolve => require(['src/pages/mirror/template/add/addItems/addItems.vue'], resolve)
  // }
)
// 先暂时注释掉,路由的加载方案可能会变
// export default new Router({
//   mode: 'history',
//   routes: [
//     {
//       path: '/',
//       redirect: '/home'
//     },
//     {
//       path: '/login',
//       component: resolve => require(['../components/login/Login.vue'], resolve)
//     },
//     {
//       path: '/home',
//       component: resolve => require(['../components/potral/Home.vue'], resolve),
//       children: (r => {
//         return r.keys().map(key => r(key))
//       })(require.context('../components', true, /-route\.js$/))
//     }
//   ]
// })
const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: resolve => require(['../pages/login/message.vue'], resolve)
    },
    {
      path: '/home',
      component: resolve => require(['../pages/potral/home.vue'], resolve),
      children: homeRouter
    }
  ]
})
router.beforeEach((to, from, next) => {
  const breadcrumb = to.meta.breadcrumb
  if (breadcrumb) {
    const breadcrumb2 = []
    for (var i = 0; i < breadcrumb.length; i++) {
      if (i === to.meta.clickCrumbIndex) {
        breadcrumb2.push({ name: breadcrumb[i], to: to.meta.mainPage })
      } else {
        breadcrumb2.push({ name: breadcrumb[i] })
      }
    }
    store.commit('modifyBreadcrumb', breadcrumb2)
  }
  // const a = store.state.homeStore.breadcrumb
  next()
})
export default router
