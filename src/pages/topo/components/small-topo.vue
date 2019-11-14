<template>
  <div id="wrapper"
       ref="viewer"
       style="width: 100%;height: 100%;"
       v-loading="loading"
       element-loading-text="拓扑图加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255,255,255,0.8)">
    <div class="has-topo">
      <div class="topo-view">
        <iframe class="iframe" :class="defaultOptions.name"
                ref="iframe"
                :src="src"
                frameborder="0"></iframe>
        <div v-if="showDialog"
             class="viewer-dialog"
             ref="viewerDialog">
          {{viewerDialogData.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopoApi from 'src/services/topo'

  export default {
    name: 'small-topo',
    props: ['defaultOptions'],
    data() {
      return {
        src: process.env.NODE_ENV === 'development' ? 'http://localhost:9876/viewer.html' : `${window.getTopographyURL}/viewer.html`,
        showDialog: false,
        showTopoView: true,
        viewerDialogData: {
          name: ''
        },
        loading: false,
        topoData: [],
        isChildReady: false
      }
    },
    // created() {
    //   addEventListener('message', function(evt) {
    //     if (evt.data.type === 'childStatus') {
    //       this.isChildReady = evt.data.data
    //     }
    //   })
    // },
    // beforeMount() {
    //   addEventListener('message', function (evt) {
    //     if (evt.data.type !== 'childStatus') {
    //       return
    //     }
    //     this.$watch(this.isChildReady, newValue => {
    //       this.fetchTopoData()
    //     })
    //     this.isChildReady = evt.data.data
    //   })
    // },
    mounted() {
      this.loading = true
      this.showTopoView = true
      this.init()
    },
    methods: {
      init() {
        // this.$nextTick(() => {
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
        // })
      },
      sleep(d) {
        return new Promise((resolve) => setTimeout(resolve, d))
      },
      async fetchTopoData() {
        // const data = await TopoApi.findScadaCanvasList({
        //   precinctId: this.precinctId
        // })
        let data
        if (this.defaultOptions.id) {
          data = await TopoApi.findScadaCanvasInfoById(this.defaultOptions.id)
        } else {
          let onlineTopoMap = this.$store.state.homeStore.onlineTopoMap
          data = onlineTopoMap[this.defaultOptions.name]
          await this.sleep(800)
        }

        if (data) {
          this.topoData = data
          // if (this.topoData.length > 0) {
          this.showTopoView = true
          this.pictureType = this.topoData.pictureType
          // this.showTopo(this.topoData.content)
          // this.$nextTick(() => {

          this.$refs.iframe.contentWindow.postMessage({
            cmd: 'sendData',
            params: {
              name: this.topoData.name,
              data: this.topoData.content,
              width: this.$refs.iframe.clientWidth - 20,
              height: this.$refs.iframe.clientHeight - 24
            }
          }, '*')

          // })
          this.loading = false
        }
      }
    },
    watch: {
      defaultOptions() {
        this.loading = true
        this.showTopoView = true
        this.fetchTopoData()
      },
      // isChildReady(value) {
      //   console.log('ischildReady :' + value)
      //   if (!value) {
      //     return
      //   }
      //   this.fetchTopoData()
      // }
    }
  }
</script>

<style scoped>
  #wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .has-topo {
    width: 100%;
    height: 100%;
    /*.top {*/
    /*position: relative;*/
    /*flex: none;*/
    /*height: 0.4rem;*/
    /*width: 100%;*/
    /*background-color: #ebebeb;*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*justify-content: space-between;*/
    /*align-items: center;*/
    /*border: none;*/
    /*.tools {*/
    /*display: flex;*/
    /*.btn-lists {*/
    /*.btn-item {*/
    /*cursor: pointer;*/
    /*width: 0.4rem;*/
    /*height: 0.4rem;*/
    /*line-height: 0.4rem;*/
    /*z-index: 22;*/
    /*text-align: center;*/
    /*border-radius: 0.08rem;*/
    /*color: #050505;*/
    /*&:hover {*/
    /*i {*/
    /*color: #65c1fc;*/
    /*}*/
    /*}*/
    /*i {*/
    /*font-size: 0.2rem;*/
    /*}*/
    /*}*/
    /*}*/
    /*}*/
    /*.btn-lists {*/
    /*.btn-item {*/
    /*cursor: pointer;*/
    /*width: 0.4rem;*/
    /*height: 0.4rem;*/
    /*line-height: 0.4rem;*/
    /*z-index: 22;*/
    /*text-align: center;*/
    /*border-radius: 0.08rem;*/
    /*color: #050505;*/
    /*&:hover {*/
    /*i {*/
    /*color: #65c1fc;*/
    /*}*/
    /*}*/
    /*i {*/
    /*font-size: 0.2rem;*/
    /*}*/
    /*}*/
    /*}*/
    /*.line {*/
    /*width: 0.02rem;*/
    /*height: 0.2rem;*/
    /*margin: 0.1rem 0.1rem 0 0.1rem;*/
    /*border: #d7d8de;*/
    /*background-color: #d7d8de;*/
    /*}*/
    /*.canvasActive {*/
    /*opacity: 0.3;*/
    /*}*/
    /*}*/

  }

  .topo-view {
    width: 100%;
    /*height: calc(100% - 0.1rem);*/
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .iframe {
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
</style>
