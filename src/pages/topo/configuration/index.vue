<template>
  <div id="wrapper"
       ref="wrap"
       style="width: 100%"
       v-loading="loading">
    <iframe class="iframe"
            ref="iframe"
            :src="src"
            frameborder="0"></iframe>
    <!--弹出框-->
    <el-dialog v-bind="dialogOption"
               :close-on-click-modal="false"
                @close="closeDynamicDialog"
                :view.sync="dialogOption.view"
                :visible.sync="dialogOption.show">
      <component :is="dialogOption.view"
                 :dialogData="dialogData"
                 :formData="formData"
                 :uploadType="uploadType"
                 @backBindData="backBindData"
                 @backNodeBindView="backNodeBindView"
                 @backBindViewType="backBindViewType"
                 @backUploadFileInfo="backUploadFileInfo"
                 @backUploadFileInfoExcel="backUploadFileInfoExcel"
                 @close="closeDynamicDialog">
      </component>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import bindingDialog from './components/bindingDialog'
  import viewType from './components/viewType'
  import viewLists from './components/viewLists'
  import uploadFileDialog from './components/uploadFileDialog'
  import screenfull from 'screenfull' // 全屏
  import TopoApi from 'src/services/topo'
  import testApi from './utils/com'

  export default {
    name: 'editor',
    components: {
      bindingDialog,
      viewLists,
      viewType,
      uploadFileDialog
    },
    data() {
      return {
        src: process.env.NODE_ENV === 'development' ? 'http://localhost:9876' : window.getTopographyURL,
        // src: 'http://localhost:9876/',
        loading: false,
        isFullscreen: false,
        saveFlag: false,
        dialogOption: {
          show: false,
          view: null,
          title: '',
          width: '500px'
        },
        dialogData: {
          type: 'view'
        },
        // idcList: this.$route.query.idcList,
        // podList: this.$route.query.podList,
        // bizSystemList: this.$route.query.bizSystemList,
        idcList: this.$store.state.homeStore.idcTypeList,
        podList: this.$store.state.homeStore.podList,
        bizSystemList: this.$store.state.homeStore.bizSystemList,
        formData: {
          id: this.$route.query.id,
          name: this.$route.query.name,
          content: null,
          pictureType: this.$route.query.pictureType || null,
          pageType: 0,
          width: null,
          // idc: this.$route.query.precinctId,
          backgroundPictureUrl: null
        },
        isAdd: false,
        uploadType: ''
      }
    },
    computed: {
      ...mapGetters([
        'viewTypeList'
      ])
      // ,
      // viewId() {
      //   return this.$route.query.id
      // }
    },
    mounted() {
      // 缓存页面类型
      this.loading = true
      this.$nextTick(() => {
        const iframe = document.querySelector('.iframe')
        if (iframe.attachEvent) {
          iframe.attachEvent('onload', () => {
            this.loading = false
            this.fetchData()
          })
        } else {
          iframe.onload = () => {
            this.loading = false
            this.fetchData()
          }
        }
      })
      window.addEventListener('message', this.handleMessage)
    },
    methods: {
      // 获取项目名称列表
      getProjectNameList(data) {
        this.rbHttp.sendRequest({
          method: 'GET',
          params: {'idcType': data.idcType},
          url: `/v1/cmdb/restful/alert/getProjectNameByIdcType`
        }).then((res) => {
          // this.$refs.iframe.onload = () => {
          this.$refs.iframe.contentWindow.postMessage({
            cmd: 'sendProjectNameData',
            params: {
              projectNameList: res
            }
          }, '*')
          // }
        })
      },
      // 画布保存
      saveGraph(data) {
        this.submit(data)
      },
      async submit(data) {
        try {
          if (data.name !== this.formData.name) {
            this.isAdd = true
          }
          if (this.$route.query.isCopy) {
            this.formData.id = null
          }
          this.$set(this.formData, 'content', data.data)
          this.$set(this.formData, 'bindObj', data.bindObj)
          this.$set(this.formData, 'name', data.name)
          this.$set(this.formData, 'idc', data.idc)
          this.$set(this.formData, 'pod', data.pod)
          this.$set(this.formData, 'bizSystem', data.bizSystem)
          this.$set(this.formData, 'projectName', data.projectName)
          if (this.$route.query.pictureType) {
            if (!this.isAdd) {
              this.$set(this.formData, 'pictureType', this.formData.pictureType)
            }
          } else {
            this.$set(this.formData, 'pictureType', this.formData.pictureType || 1)
          }
          if (this.formData.name === undefined || this.formData.name === '') {
            this.$message.error('请填写标题')
            this.loading = false
            return false
          } else if (this.formData.idc === undefined || this.formData.idc === '') {
            this.$message.error('请选择资源池')
            this.loading = false
            return false
          } else if ((this.formData.bizSystem === undefined || this.formData.bizSystem === '') && (this.formData.pictureType === '2' || this.formData.pictureType === '3')) {
            this.$message.error('请选择业务系统')
            this.loading = false
            return false
          } else {
            const res = await this.$http.sendRequest({
              method: 'POST',
              url: '/v1/scada/saveScadaCanvas',
              data: this.formData
            })
            if (res.code === 200 && res.data) {
              this.loading = false
              this.$message.success('保存成功')
              this.$router.push({
                path: '/topo/list'
              })
              return res
            } else {
              this.loading = false
              this.$message.error(res.msg)
            }
          }
        } catch (e) {
          this.loading = false
          this.$message.error('保存失败')
        }
      },
      // 获取根据Id获取视图详情的接口
      async fetchData() {
        // 如果有id去请求数据
        if (this.formData.name) {
          try {
            let res
            if (this.formData.id) {
              res = await TopoApi.findScadaCanvasInfoById(this.formData.id)
            } else {
              let onlineTopoMap = this.$store.state.homeStore.onlineTopoMap
              res = await onlineTopoMap[this.formData.name]
            }
            if (this.$route.query.isCopy) {
              res.name = res.name + '-副本'
            }
            // const res = await TopoApi.findScadaCanvasInfoById(this.formData.id)
            // 判断返回值有没有画布ID
            if (res) {
              this.formData = Object.assign({}, this.formData, res)
            } else {
              this.$set(this.formData, 'id', '')
            }
            // let pictureType = this.formData.pictureType
            // 外部vue向iframe内部传数据
            this.$refs.iframe.contentWindow.postMessage({
              cmd: 'sendData',
              params: {
                name: this.formData.name,
                pictureType: this.formData.pictureType, // 默认1000 供电拓扑
                width: this.formData.width,
                data: res ? res.content : null,
                podList: this.podList,
                idcList: this.idcList,
                bizSystemList: this.bizSystemList,
                pod: res.pod,
                idc: res.idc,
                projectName: res.projectName,
                bizSystem: res.bizSystem
              }
            }, '*')
          } catch (e) {
            console.log(e)
            this.$refs.iframe.contentWindow.postMessage({
              cmd: 'sendData',
              params: {
                name: this.formData.name
              }
            }, '*')
          }
          // const res = await this.$http.sendRequest({
          //   method: 'GET',
          //   url: '/v1/scada/getScadaCanvasInfoByPrecinctId',
          //   params: {
          //     precinctId: this.formData.precinctId,
          //     pictureType: this.formData.pictureType
          //   }
          // })
          // // 判断返回值有没有画布ID
          // if (res.data) {
          //   this.formData = Object.assign({}, this.formData, res.data)
          // } else {
          //   this.$set(this.formData, 'id', '')
          // }
          // let pictureType
          // if (this.formData.pictureType) {
          //   pictureType = returnViewTypeClass(this.viewTypeList, this.formData.pictureType).length > 0 ? returnViewTypeClass(this.viewTypeList, this.formData.pictureType)[0].id : ''
          // } else {
          //   pictureType = ''
          // }
          // // 外部vue向iframe内部传数据
          // this.$refs.iframe.contentWindow.postMessage({
          //   cmd: 'sendData',
          //   params: {
          //     name: this.formData.name,
          //     pictureType, // 默认1000 供电拓扑
          //     width: this.formData.width,
          //     data: res.data ? res.data.content : null
          //   }
          // }, '*')
        } else {
          // 如果没有id传默认的类型值
          // 外部vue向iframe内部传数据
          this.$refs.iframe.contentWindow.postMessage({
            cmd: 'sendData',
            params: {
              pictureType: this.formData.pictureType,
              podList: this.podList,
              idcList: this.idcList,
              bizSystemList: this.bizSystemList
            }
          }, '*')
        }
      },
      // 子 - 父 通信
      handleMessage(e) {
        const data = e.data
        switch (data.cmd) {
          case 'save':
            // 保存
            this.saveGraph(data.params)
            break
          case 'getProjectNameList':
            // 保存
            this.getProjectNameList(data.params)
            break
          case 'showNodeBind':
            // 节点绑定对象
            this.bindNode(data.params.datas)
            break
          case 'showNodeViewBind':
            // 节点绑定视图
            this.showNodeViewBind(data)
            break
          case 'showViewBind':
            // 绑定视图对象
            this.showViewBind()
            break
          case 'pagetype':
            // 绑定视图对象
            this.getPageType(data.params)
            break
          case 'fullScreen':
            this.fullScreen()
            break
          case 'modeSwitch':
            // 模式切换
            this.modeSwitch(data.params)
            break
          case 'exportData':
            // 导出xml数据
            this.exportData(data.params.datas)
            break
          case 'switchPageType':
            // 切换视图类型
            this.switchPageType(data.params)
            break
          case 'showViewTypeBind':
            // 切换视图类型
            this.showViewTypeBind()
            break
          case 'uploadFiles':
            // 上传文件
            this.uploadFiles()
            break
          case 'uploadExcel':
            // 上传Excel
            this.uploadExcel()
            break
        }
      },
      // 绑定数据弹窗
      bindNode(data) {
        this.dialogData = data
        this.dialogData.type = 'node'
        // this.dialogData.bandType = data.bandType
        // this.dialogData.sillList = data.sillList
        // this.dialogData.deviceList = data.deviceList
        // this.dialogData.itemList = data.itemList
        // this.dialogData.alertLevelList = data.alertLevelList
        // this.dialogData.countType = data.countType
        // this.dialogData.valueView = data.valueView
        // this.dialogData.colorView = data.colorView
        // this.dialogData.bandNum = data.bandNum
        this.$forceUpdate()
        this.showDynamicDialog('bindingDialog', '元件绑定对象', '880px')
      },
      // 元件绑定视图
      showNodeViewBind(data) {
        this.dialogData = data.params.datas
        this.showDynamicDialog('viewLists', '元件绑定视图')
      },
      // 给iframge传递参数
      backBindData(res) {
        switch (this.dialogData.type) {
          case 'node':
            const data = res
            this.$refs.iframe.contentWindow.postMessage({
              cmd: 'nodeBindObject',
              params: {
                data: JSON.stringify(data)
              }
            }, '*')
            break
          case 'view':
            // 绑定视图
            this.$refs.iframe.contentWindow.postMessage({
              cmd: 'bindView',
              params: {
                data: res.name
              }
            }, '*')
            this.$set(this.formData, 'precinctId', res.precinctId)
            this.$set(this.formData, 'name', res.name)
            break
        }
      },
      backNodeBindView(data) {
        this.$refs.iframe.contentWindow.postMessage({
          cmd: 'nodeBindView',
          params: {
            data
          }
        }, '*')
      },
      backUploadFileInfo(data) {
        this.$refs.iframe.contentWindow.postMessage({
          cmd: 'nodeBindUploadFile',
          params: {
            data
          }
        }, '*')
      },
      async backUploadFileInfoExcel(data) {
        let newArr = []
        for (let i = 0; i < data.length; i++) {
          let keys = data[i]
          Object.keys(keys).forEach((key) => {
            newArr = newArr.concat(keys[key])
          })
        }
        const excelData = await testApi.productAutoList(newArr)
        this.$refs.iframe.contentWindow.postMessage({
          cmd: 'backLoadExcelData',
          params: {
            excelData
          }
        }, '*')
      },
      // 视图绑定视图类型
      backBindViewType(data) {
        this.formData.pictureType = data.chooseItem.id
        this.formData.width = data.chooseLabel
        this.$refs.iframe.contentWindow.postMessage({
          cmd: 'viewBindViewType',
          params: {
            data
          }
        }, '*')
      },
      // 视图绑定对象
      showViewBind() {
        this.dialogData.type = 'view'
        this.showDynamicDialog('bindingDialog', '视图绑定对象')
      },
      // 视图绑定弹窗
      showViewTypeBind() {
        this.dialogData.type = 'view'
        this.dialogData.pictureType = [this.formData.pictureType] || []
        this.showDynamicDialog('viewType', '视图绑定视图类型')
      },
      // 获取页面类型
      getPageType(data) {
        this.formData.pageType = data.pagetype
      },
      // 打开文件上传弹窗
      uploadFiles() {
        this.uploadType = ''
        this.showDynamicDialog('uploadFileDialog', '文件上传')
      },
      uploadExcel() {
        this.uploadType = 'excel'
        this.showDynamicDialog('uploadFileDialog', '文件上传')
      },
      // 打开弹窗
      showDynamicDialog(view, title, width = '500px') {
        this.dialogOption.show = true
        this.dialogOption.view = view
        this.dialogOption.title = title
        this.dialogOption.width = width
        // this.$refs.detailDialog.loadDialogData(this.dialogData)
      },
      // 关闭弹窗
      closeDynamicDialog(boolean) {
        if (boolean) {
          this.dialogOption = {
            show: false,
            view: null,
            title: '',
            width: '0px'
          }
        }
      },
      // 全屏
      fullScreen() {
        if (!screenfull.enabled) { // 如果不允许进入全屏，发出不允许提示
          this.$message({
            message: '不支持全屏',
            type: 'warning'
          })
          return false
        }
        screenfull.toggle()
      },
      // 模式切换
      modeSwitch(data) {
        this.$confirm('是否保存画布', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.submit(data)
          if (res.code === 200) {
            this.$router.push({
              path: '/configuration/viewer',
              query: {
                precinctId: res.data.precinctId,
                precinctName: res.data.name,
                pictureType: res.data.pictureType
              }
            })
          }
        }).catch(() => {
          this.$router.push({
            path: '/configuration/viewer',
            query: {
              precinctId: this.formData.precinctId,
              precinctName: this.formData.name,
              pictureType: this.formData.pictureType
            }
          })
        })
      },
      // 导出xml数据
      exportData(data) {
        this.$confirm('是否导出xml文件', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const FileSaver = require('file-saver')
          const blob = new Blob([data], {type: 'text/plain;charset=utf-8'})
          await FileSaver.saveAs(blob, 'data.xml')
        })
      },
      // 切换视图路由
      // switchPageType (data) {
      //   if (this.$route.query.precinctId) {
      //     this.$router.push({
      //       path: '/configuration',
      //       query: {
      //         precinctId: this.$route.query.precinctId,
      //         pictureType: data.pictureType,
      //         precinctName: this.$route.query.precinctName
      //       }
      //     })
      //     this.$set(this.formData, 'pictureType', data.pictureType)
      //     this.fetchData()
      //   } else {
      //     this.$set(this.formData, 'pictureType', data.pictureType)
      //   }
      // },
      switchPageType(data) {
        this.isAdd = true
        this.$set(this.formData, 'pictureType', data.pictureType)
      }
    },
    destroyed() {
      window.removeEventListener('message', this.handleMessage)
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/assets/css/mixins';

  #wrapper {
    width: 100%;
    height: 100%;
    padding: 0.2rem;
    background: #ffffff;
    border-radius: 0.2rem;
    box-shadow: $main-box-shadow;
    .iframe {
      width: 100%;
      height: 100%;
    }
  }

  /deep/ .el-dialog__body {
    background: #f6f6f6;
    padding-top: 0.2rem !important;
  }

  /deep/ .el-dialog__header {
    background-color: #f6f6f6;
    padding-bottom: 0 !important;
    span {
      color: #333333;
      font-size: 14px;
      font-weight: bold;
      font-family: MicrosoftYaHei;
      margin-left: 0.2rem;
    }
  }
</style>
