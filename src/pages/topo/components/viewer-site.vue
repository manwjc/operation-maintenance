<template>
  <div id="wrapper"
       class="viewer"
       ref="viewer"
       style="width: 100%"
       v-loading="loading"
       element-loading-text="拓扑图加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255,255,255,0.8)">
    <div class="has-topo"
         v-show="showTopoView">
      <div class="top">
        <TopoInfo :topoData="topoData"
        ></TopoInfo>
        <!--@changeTopo="changeTopo"-->
        <div class="tools">
          <div class="line"></div>
          <el-tooltip class="item"
                      effect="dark"
                      content="新增"
                      placement="bottom-start">
            <div class="btn-lists">
              <div class="btn-item"
                   @click="add">
                <i class="iconfont iconaddNew"></i>
              </div>
            </div>
          </el-tooltip>
          <div class="line"></div>
          <!--<el-tooltip class="item"-->
                      <!--effect="dark"-->
                      <!--content="应急预案"-->
                      <!--placement="bottom-start">-->
            <!--<div class="btn-lists ">-->
              <!--<div class="btn-item"-->
                   <!--@click="handleEmergencyPlan">-->
                <!--<i class="iconfont iconyingjiyuan"></i>-->
              <!--</div>-->
            <!--</div>-->
          <!--</el-tooltip>-->
          <el-tooltip class="item"
                      effect="dark"
                      content="移动画布"
                      placement="bottom-start">
            <div :class="canvasActive ? 'canvasActive' : ''"
                 class="btn-lists ">
              <div class="btn-item"
                   @click="moveCanvas">
                <i class="iconfont iconyidonghuabu"></i>
              </div>
            </div>
          </el-tooltip>

          <el-tooltip class="item"
                      effect="dark"
                      content="导出"
                      placement="bottom-start">
            <div class="btn-lists">
              <div class="btn-item"
                   @click="exportData">
                <i class="iconfont icondaochu"></i>
              </div>
            </div>
          </el-tooltip>

          <el-tooltip class="item"
                      effect="dark"
                      content="放大"
                      placement="bottom-start">
            <div class="btn-lists">
              <div class="btn-item"
                   @click="zoomIn">
                <i class="iconfont iconfangda"></i>
              </div>
            </div>
          </el-tooltip>
          <el-tooltip class="item"
                      effect="dark"
                      content="缩小"
                      placement="bottom-start">
            <div class="btn-lists">
              <div class="btn-item"
                   @click="zoomOut">
                <i class="iconfont iconsuoxiao"></i>
              </div>
            </div>
          </el-tooltip>
          <el-tooltip class="item"
                      effect="dark"
                      content="还原"
                      placement="bottom-start">
            <div class="btn-lists">
              <div class="btn-item"
                   @click="back">
                <i class="iconfont iconfanhui"></i>
              </div>
            </div>
          </el-tooltip>
          <el-tooltip class="item"
                      effect="dark"
                      :content="fullScreen.name"
                      placement="bottom-start">
            <div class="btn-lists">
              <div class="btn-item"
                   @click="handleFullScreen">
                <i class="iconfont"
                   :class="fullScreen.icon"></i>
              </div>
            </div>
          </el-tooltip>
          <!--<el-tooltip class="item"-->
                      <!--v-if="showEditor"-->
                      <!--effect="dark"-->
                      <!--content="删除"-->
                      <!--placement="bottom-start">-->
            <!--<div class="btn-lists">-->
              <!--<div class="btn-item"-->
                   <!--@click="handleDelete">-->
                <!--<i class="iconfont iconshanchu-baobiaojitoubutab"></i>-->
              <!--</div>-->
            <!--</div>-->
          <!--</el-tooltip>-->
          <div class="line"
               v-if="showEditor"></div>
          <el-tooltip class="item"
                      v-if="showEditor"
                      effect="dark"
                      content="编辑"
                      placement="bottom-start">
            <div class="btn-lists">
              <div class="btn-item"
                   @click="link">
                <i class="iconfont iconbianji"></i>
              </div>
            </div>
          </el-tooltip>
          <el-tooltip class="item"
                      effect="dark"
                      content="复制"
                      placement="bottom-start">
            <div class="btn-lists">
              <div class="btn-item"
                   @click="copy">
                <i class="iconfont iconfuzhi"></i>
              </div>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="topo-view">
        <iframe class="iframe"
                ref="iframe"
                :src="src"
                frameborder="0"></iframe>
        <div v-if="showDialog"
             class="viewer-dialog"
             ref="viewerDialog">
          {{viewerDialogData.name}}</div>
      </div>
    </div>

    <div v-show="!showTopoView"
         class="no-topo">
      <p>暂无拓扑图</p>
      <el-button type="primary"
                 @click="add">新增拓扑图</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TopoInfo from './topo-baseinfo'
import TopoApi from 'src/services/topo'

export default {
  props: ['defaultOptions'],
  name: 'viewer-site',
  components: {
    TopoInfo
  },
  watch: {
    defaultOptions () {
      this.showTopoView = true
      this.fetchTopoData()
    }
  },
  data () {
    return {
      src: process.env.NODE_ENV === 'development' ? 'http://localhost:9876/viewer.html' : `${window.getTopographyURL}/viewer.html`,
      loading: false,
      showEditor: true, // 是否隐藏调整编辑按钮
      xmlData: '',
      canvasActive: true,
      active: 0,
      querySelect: this.$route.query,
      showDialog: false,
      pictureType: '',
      showTopoView: true,
      viewerDialogData: {
        name: ''
      },
      selectTopo: '', // 选中的topo
      topoData: [],
      fullScreen: {
        name: '全屏',
        icon: 'iconquanping2'
      }
    }
  },
  computed: {
    // ...mapGetters([
    //   'viewTypeList'
    // ]),
    // scadaId () {
    //   return this.defaultOptions.id
    // }
  },
  mounted () {
    this.loading = true
    this.showTopoView = true
    window.addEventListener('message', this.handleMessage)
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      const iframe = this.$refs.iframe
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          this.fetchTopoData()
        })
      } else {
        iframe.onload = () => {
          this.fetchTopoData()
        }
      }
    },
    async fetchTopoData () {
      let data
      if (this.defaultOptions.id) {
        data = await TopoApi.findScadaCanvasInfoById(this.defaultOptions.id)
      } else {
        this.showEditor = false
        let onlineTopoMap = this.$store.state.homeStore.onlineTopoMap
        data = await onlineTopoMap[this.defaultOptions.name]
      }
      this.topoData = data
      // const data = this.defaultOptions
      if (data) {
        // const arr = JSON.parse(JSON.stringify(this.viewTypeList))
        // arr.forEach(item => {
        //   data.data.forEach(cell => {
        //     if (Number(cell.pictureType) - Number(item.id) >= 0 && Number(cell.pictureType) - Number(item.id) < 1000) {
        //       if (!item['children']) {
        //         item['children'] = []
        //       }
        //       item['children'].push(cell)
        //     }
        //   })
        // })

        // if (this.topoData.length > 0) {
        this.showTopoView = true
        this.pictureType = data.pictureType
        // 外部vue向iframe内部传数据
        const resValue = await this.$http.sendRequest({
          method: 'POST',
          url: '/v1/scada/getScadaBindValue',
          data: {
            'bindObjList': JSON.parse(data.bindObj)
          }
        })
        this.showTopo(data.content, resValue)
        this.selectTopo = data
        // } else {
        //   this.showTopoView = false
        //   this.loading = false
        // }
      }
    },
    handleEmergencyPlan () {
      // 应急预案
      try {
        let res = this.$http.sendRequest({
          method: 'GET',
          url: '/v1/KnowledgeManage/download',
          binary: true,
          responseType: 'blob',
          params: {
            generalid: this.precinctId,
            classify: '1'
          }
        })
        const link = window.URL.createObjectURL(new Blob([res], { type: 'application/octet-stream' }))
        // console.log('personExport link ', link)
        window.location.href = link
      } catch (e) {
        this.$message({
          message: '导出失败',
          type: 'warning'
        })
      }
    },
    showTopo (content, bindObjList) {
      this.$nextTick(() => {
        this.$refs.iframe.contentWindow.postMessage({
          cmd: 'sendData',
          params: {
            name: this.defaultOptions.name,
            id: this.defaultOptions.id,
            data: content,
            width: this.$refs.iframe.clientWidth - 30,
            height: this.$refs.iframe.clientHeight + 110,
            bindObjList: bindObjList
          }
        }, '*')
        this.$refs.iframe.contentWindow.postMessage({
          cmd: 'moveCanvas',
          params: {
            success: true,
            data: this.canvasActive
          }
        }, '*')
        this.loading = false
      })
    },
    add () {
      this.$router.push({
        path: '/topo/configuration',
        query: {
          pictureType: this.pictureType
          // idcList: this.$store.state.homeStore.idcTypeList,
          // podList: this.$store.state.homeStore.podList,
          // bizSystemList: this.$store.state.homeStore.bizSystemList
        }
      })
    },
    handleFullScreen () {
      this.$refs.viewer.classList.toggle('fullScreen')
      if (this.fullScreen.name === '全屏') {
        this.fullScreen = {
          name: '退出全屏',
          icon: 'icontuichuquanping'
        }
      } else {
        this.fullScreen = {
          name: '全屏',
          icon: 'iconquanping2'
        }
      }
      this.back()
    },
    changeTopo (key) {
      console.log(this.topoData)
      this.topoData.forEach(item => {
        console.log(item)
        item.children.forEach(cell => {
          console.log(cell.pictureType, key)
          if (Number(cell.pictureType) === Number(key)) {
            this.selectTopo = cell
            this.pictureType = cell.pictureType
            this.showTopo(cell.content)
          }
        })
      })
    },
    // 子 - 父 通信
    handleMessage (e) {
      const data = e.data
      // console.log(data)
      switch (data.cmd) {
        case 'getChildView':
          this.getChildView(data.params)
          break
        case 'xmlData':
          this.getXML(data.params.datas)
          break
        case 'openUploadFile':
          this.openUploadFile(data.params.data)
          break
        case 'nodeMouseLeave':
          if (!data.params) {
            this.showDialog = false
            return
          }
          this.showDialog = true
          this.$nextTick(() => {
            this.$refs.viewerDialog.style.left = `${data.params.x + 20}px`
            this.$refs.viewerDialog.style.top = `${data.params.y + 20}px`
            this.viewerDialogData.name = data.params.name
          })
          break
        case 'resetMoveCanvas':
          this.resetMoveCanvas()
          break
      }
    },
    async getChildView (params, type, index) {
      if (params.name === 'AlertList') {
        this.$router.push({
          path: '/mirror_alert/alert/manage',
          query: params
        })
      } else {
        this.$http.sendRequest({
          method: 'GET',
          url: `/v1/cmdb/instance/queryDeviceByRoomAndIP`,
          params: {idc: params.idcType, deviceIp: params.deviceIp}
        }).then((res) => {
          this.$router.push({
            path: '/resource/iframe/detail',
            query: {moduleId: res.moduleId, instanceId: res.id, state: 'detail', name: res.deviceType}
          })
        })
      }

      // if (type === 0) {
      //   this.active = index
      //   this.formData = Object.assign({}, this.formData, params)
      //   this.querySelect = {
      //     precinctId: params[0].data.precinctId,
      //     precinctName: params[0].data.name,
      //     pictureType: params[0].data.pictureType
      //   }
      //   this.$refs.iframe.contentWindow.postMessage({
      //     cmd: 'sendData',
      //     params: {
      //       data: params[0] ? params[0].data.content : '',
      //       width: this.$refs.iframe.clientWidth - 40,
      //       height: this.$refs.iframe.clientHeight - 40,
      //       resValue: _.unionBy(params[1], 'id')
      //     }
      //   }, '*')
      // } else {
      //   let flag = false
      //   this.CrumbName.forEach((val, index) => {
      //     if (val.precinctId === params.precinctId) {
      //       this.active = index
      //       flag = true
      //       this.querySelect = {
      //         precinctId: val.precinctId,
      //         precinctName: val.name,
      //         pictureType: params.pictureType
      //       }
      //     }
      //   })
      //   if (!flag) {
      //     this.CrumbName.push(params)
      //     this.active = this.CrumbName.length - 1
      //     this.querySelect = {
      //       precinctId: params.precinctId,
      //       precinctName: params.name,
      //       pictureType: params.pictureType
      //     }
      //   }
      //   const res = await this.$http.sendRequest({
      //     method: 'GET',
      //     url: '/v1/scada/getScadaCanvasInfoByPrecinctId',
      //     params: {
      //       precinctId: params.precinctId,
      //       pictureType: params.pictureType,
      //       precinctName: params.name
      //     }
      //   })
      //
      //   if (res.code === 200 && res.data) {
      //     this.formData = Object.assign({}, this.formData, res.data)
      //     var comTrees = JSON.parse(res.data.backgroundPictureUrl)
      //     // console.log(comTrees)
      //     // console.log(this.formData)
      //     const resValue = await this.$http.sendRequest({
      //       method: 'POST',
      //       url: '/v1/scada/getAlertCountOrMeteValueByPrecinctId',
      //       data: {
      //         comTrees
      //       }
      //     })
      //     this.xmlData = res.data.content
      //     // 外部vue向iframe内部传数据
      //     this.$refs.iframe.contentWindow.postMessage({
      //       cmd: 'sendData',
      //       params: {
      //         data: res.data.content,
      //         width: this.$refs.iframe.clientWidth + 40,
      //         height: this.$refs.iframe.clientHeight + 140,
      //         resValue: _.unionBy(resValue, 'id')
      //       }
      //     }, '*')
      //   }
      //   // this.formData = Object.assign({}, this.formData, res)
      //   // // 外部vue向iframe内部传数据
      //   // this.$refs.iframe.contentWindow.postMessage({
      //   //   cmd: 'sendData',
      //   //   params: {
      //   //     data: res.data ? res.data.content : ''
      //   //   }
      //   // }, '*')
      // }
    },
    getXML (data) {
      if (data) {
        const FileSaver = require('file-saver')
        const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, 'Data.xml')
      }
    },
    openUploadFile (data) {
      // 打开文件
      // console.log(data)
      let aTag = document.createElement('a')
      aTag.setAttribute('target', '_blank')
      aTag.href = data
      aTag.click()
    },
    // 给iframge传递参数
    sendData (res) {
      this.$refs.iframe.contentWindow.postMessage({
        cmd: 'bindNode',
        params: {
          data: JSON.stringify(res)
        }
      }, '*')
    },
    link () {
      this.$router.push({
        path: '/topo/configuration',
        query: {
          id: this.defaultOptions.id,
          name: this.defaultOptions.name,
          pictureType: this.pictureType || null
          // defaultOptions: this.defaultOptions
        }
      })
    },
    copy () {
      // let data = Object.assign({}, this.topoData)
      // delete data.id
      this.$router.push({
        path: '/topo/configuration',
        query: {
          id: this.topoData.id,
          name: this.topoData.name,
          isCopy: true,
          pictureType: this.pictureType || null
        }
      })
    },
    //获取当前日期时间
    curentTime() {
      var now = new Date();

      var year = now.getFullYear();       //年
      var month = now.getMonth() + 1;     //月
      var day = now.getDate();            //日

      var hh = now.getHours();            //时
      var mm = now.getMinutes();          //分
      var ss = now.getSeconds();          //分

      var clock = year + '';

      if (month < 10)
        clock += "0";

      clock += month;

      if (day < 10)
        clock += "0";

      clock += day;

      if (hh < 10)
        clock += "0";

      clock += hh;
      if (mm < 10)
        clock += '0';
      clock += mm;

      if (ss < 10)
        clock += '0';
      clock += ss;
      return clock;
    },
    //
    // //定时执行setTime
    // setInterval("setTime()",1000);
    //
    // //将id为currentTime的div更新为最新时间
    // function setTime(){
    //     $('#currentTime').html(curentTime());
    // }
    zoomIn () {
      this.$refs.iframe.contentWindow.postMessage({
        cmd: 'zoomIn',
        params: {
          success: true
        }
      }, '*')
    },
    zoomOut () {
      this.$refs.iframe.contentWindow.postMessage({
        cmd: 'zoomOut',
        params: {
          success: true
        }
      }, '*')
    },
    back () { // 回到初始位置
      this.$refs.iframe.contentWindow.postMessage({
        cmd: 'back',
        params: {
          success: true
        }
      }, '*')
    },
    exportData () {
      this.$confirm('是否导出xml文件', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$refs.iframe.contentWindow.postMessage({
          cmd: 'exportData',
          params: {
            success: true
          }
        }, '*')
      })
    },
    moveCanvas () {
      this.canvasActive = !this.canvasActive
      this.$refs.iframe.contentWindow.postMessage({
        cmd: 'moveCanvas',
        params: {
          success: true,
          data: this.canvasActive
        }
      }, '*')
    },
    resetMoveCanvas () {
      this.canvasActive = false
    },
    handleDelete () {
      this.$confirm('是否删除该拓扑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.sendRequest({
          method: 'DELETE',
          url: `/v1/scada/delScadaCanvas/${this.selectTopo.id}`
        })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.fetchTopoData()
          // 刷新列表
        } else {
          this.$message.error('删除失败')
        }
      })
    }
  },
  destroyed () {
    window.removeEventListener('message', this.handleMessage)
  }
}
</script>

<style scoped lang="scss">
#wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .has-topo {
    width: 100%;
    height: 100%;
    .top {
      position: relative;
      flex: none;
      height: 0.4rem;
      width: 100%;
      background-color: #ebebeb;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border: none;
      .tools {
        display: flex;
        .btn-lists {
          .btn-item {
            cursor: pointer;
            width: 0.4rem;
            height: 0.4rem;
            line-height: 0.4rem;
            z-index: 22;
            text-align: center;
            border-radius: 0.08rem;
            color: #050505;
            &:hover {
              i {
                color: #65c1fc;
              }
            }
            i {
              font-size: 0.2rem;
            }
          }
        }
      }
      .btn-lists {
        .btn-item {
          cursor: pointer;
          width: 0.4rem;
          height: 0.4rem;
          line-height: 0.4rem;
          z-index: 22;
          text-align: center;
          border-radius: 0.08rem;
          color: #050505;
          &:hover {
            i {
              color: #65c1fc;
            }
          }
          i {
            font-size: 0.2rem;
          }
        }
      }
      .line {
        width: 0.02rem;
        height: 0.2rem;
        margin: 0.1rem 0.1rem 0 0.1rem;
        border: #d7d8de;
        background-color: #d7d8de;
      }
      .canvasActive {
        opacity: 0.3;
      }
    }
    .topo-view {
      width: 100%;
      height: calc(100% - 0.4rem);
      display: flex;
      flex-direction: column;
      .iframe {
        padding-left: 5px;
        flex: 1;
        width: 100%;
        height: 100%;
      }
      .viewer-dialog {
        border: 1px solid #e1e1e1;
        position: absolute;
        background: #fff;
        border-radius: 8px;
        padding: 10px 20px;
      }
    }
  }

  .no-topo {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    p {
      margin-bottom: 20px;
      font-size: 20px;
    }
  }
}
.fullScreen {
  z-index: 800;
  position: fixed !important;
  background: #fff;
  top: 0;
  left: 0;
}
</style>
