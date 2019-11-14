<template>
  <el-container style="position:relative;width:100%;height:100%">
    <el-header style="height: 60px">
      <el-form class="yw-form"
               label-width="100px"
               :inline="true"
               v-model="search">
        <el-form-item label="拓扑视图名称：">
          <el-input v-model="search.name"></el-input>
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input v-model="search.projectName"></el-input>
        </el-form-item>
        <el-form-item label="资源池：">
          <el-select v-model="search.idc"
                     placeholder="请选择资源池"
                     filterable
                     clearable>
            <el-option v-for="(item, index) in idcTypeList"
                       :key="index"
                       :label="item.name"
                       :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="POD：">
          <el-select v-model="search.pod"
                     placeholder="请选择POD名称"
                     filterable
                     clearable>
            <el-option v-for="(item, index) in podList"
                       :key="index"
                       :label="item.name"
                       :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务归属：">
          <treeselect class="yw-treeselect chart-filter-item"
                      v-model="bizSysDepChecked"
                      :options="bizDepTreeSelOpts"
                      placeholder="请选择业务系统">
          </treeselect>
        </el-form-item>
        <el-form-item label="拓扑分类：">
          <!--<el-radio v-model="search.pictureType" label="">全部</el-radio>-->
          <el-radio v-model="search.pictureType"
                    label="1">物理拓扑</el-radio>
          <el-radio v-model="search.pictureType"
                    label="2">逻辑拓扑</el-radio>
          <el-radio v-model="search.pictureType"
                    label="3">租户拓扑</el-radio>
        </el-form-item>
        <el-form-item>
          <section class="btn-wrap">
            <el-button type="primary"
                       size="small"
                       @click="searchData">查询
            </el-button>
            <el-button @click="reset()"
                       size="small">重置</el-button>
            <el-button type="primary"
                       size="small"
                       @click="add">创建拓扑图
            </el-button>
          </section>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="chart-main-wrap">
      <el-tabs class="yw-tabs"
               v-model="activeTabName"
               @tab-click="handleClick">
        <el-tab-pane :label="`${item.label}${item.data}`"
                     tabindex="-1"
                     :name="item.name"
                     v-for="(item,index) in tabData"
                     :key="index">
        </el-tab-pane>
      </el-tabs>
      <div class="topo content-item"
           v-for="(item, index) in topoList">
        <section class="chart-title-wrap clearfix">
          <div style="float: right;margin-right:5px;margin-top: 5px;">
            <el-tooltip class="item"
                        v-if="activeTabName == 'customize'"
                        effect="dark"
                        content="删除"
                        placement="bottom"
                        :hide-after=1000>
              <el-button type="text"
                         @click="del(item)"
                         class="el-icon-delete">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item"
                        effect="dark"
                        content="详情"
                        placement="bottom"
                        :hide-after=1000>
              <el-button type="text"
                         @click="view(item)"
                         class="el-icon-view">
                <!--<i class="el-icon-view"-->
                <!--aria-hidden="true">-->
                <!--<use xlink:href="#icondashboardBack"></use>-->
                <!--</i>-->
              </el-button>
            </el-tooltip>
          </div>
          <span class="chart-title"> {{item.name}} </span>
        </section>
        <section class="chart-section">
          <el-tooltip effect="light"
                      class="item"
                      placement="top">
            <div slot="content"
                 style="width: 200px">
              <span>名称：{{item.name}} <br></span>
              <span>拓扑分类：{{item.pictureType == '1'? '物理拓扑' : item.pictureType == '2'? '逻辑拓扑' : '租户拓扑'}} <br></span>
              <span>资源池：{{item.idc}} <br></span>
              <span> POD：{{item.pod}} <br></span>
              <span v-if="item.pictureType != '1'">业务系统：{{item.bizSystem}} <br></span>
              <span>项目名称：{{item.projectName}}</span>
              <!--<el-form>-->
              <!--<el-form-item label="名称：">-->
              <!--{{item.name}}-->
              <!--</el-form-item>-->
              <!--<el-form-item label="拓扑分类：">-->
              <!--{{item.pictureType == '1'? '物理拓扑' : item.pictureType == '2'? '逻辑拓扑' : '租户拓扑'}}-->
              <!--</el-form-item>-->
              <!--<el-form-item label="资源池：">-->
              <!--{{item.idc}}-->
              <!--</el-form-item>-->
              <!--<el-form-item label="POD：">-->
              <!--{{item.pod}}-->
              <!--</el-form-item>-->
              <!--<el-form-item v-if="item.pictureType != '1'" label="业务系统：">-->
              <!--{{item.bizSystem}}-->
              <!--</el-form-item>-->
              <!--<el-form-item label="项目名称：">-->
              <!--{{item.projectName}}-->
              <!--</el-form-item>-->
              <!--</el-form>-->
            </div>
            <div class="viewer"
                 :is="activeName"
                 :defaultOptions="item">
            </div>
          </el-tooltip>
        </section>
      </div>
      <div v-show="topoList.length === 0"
           class="no-topo content-item">
        <p>暂无拓扑图</p>
        <el-button type="primary"
                   @click="add">新增拓扑图
        </el-button>
      </div>
    </el-main>
    <YwPagination @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="pageSizes"
                  :page-size="pageSize"
                  :total="total"
                  v-if="activeTabName == 'customize'"></YwPagination>
  </el-container>
  <!--<el-dialog class="yw-dialog"-->
  <!--:width="dialogWidth"-->
  <!--title="设备资源检索"-->
  <!--:visible.sync="dialogMsg.dialogVisible">-->
  <!--<div class="clearfix">-->
  <!--&lt;!&ndash; 分类 &ndash;&gt;-->
  <!--<section class="search-left">-->
  <!--<ul class="search-list">-->
  <!--<li class="search-item"-->
  <!--:class="{active: item.name === currentType.name}"-->
  <!--@click="changeType(item)"-->
  <!--v-for="(item,index) in searchDatas"-->
  <!--:key="index">{{item.name}}-->
  <!--</li>-->
  <!--</ul>-->
  <!--</section>-->
  <!--&lt;!&ndash; 分类 &ndash;&gt;-->

  <!--<component :is="currentComponent"-->
  <!--:currentType="currentType"-->
  <!--:dialogMsg="dialogMsg"-->
  <!--@closeDialog="closeDialog"-->
  <!--:key="currentType.name" @setData="setData"></component>-->

  <!--</div>-->
  <!--</el-dialog>-->
</template>

<script>
import SiteTopo from '../view/site'
import SmallTopo from '../components/small-topo'
import Treeselect from '@riophae/vue-treeselect'
import TopoApi from 'src/services/topo.js'
import rbAlertKanBanServiceFactory from 'src/services/alert/rb-alert-kanban-services.factory.js'
export default {
  data () {
    return {
      activeName: 'small-topo',
      activeTabName: 'customize',
      currentPage: 1, // 当前页
      pageSize: 6, // 分页每页多少行数据
      pageSizes: [6, 9, 12], // 每页多少行数组
      total: 0, // 总共多少行数据
      bizSysDepChecked: null,
      bizDepTreeSelOpts: [],
      search: {
        pictureType: '1'
      },
      defaultOptions: {},
      topoList: [],

      customTopoList: [],
      onlineTopoList: [],
      idcTypeList: [],
      podList: [],
      bizSystemList: [],
      tabData: [
        { label: '自定义视图', data: '(0)', name: 'customize' },
        { label: '实时视图', data: '(0)', name: 'online' }]
      // searchParams: {
      //   keyword: '',
      //   desc: {
      //     placeholder: '拓扑视图名称',
      //     bgcolor: '#eff5fc'
      //   }
      // }
    }
  },
  watch: {},
  created: function () {
    this.initDict()
  },
  mounted: function () {
    this.searchData()
  },
  // handleClick(tab, event) {
  //   this.searchData()
  // },
  methods: {
    initDict () {
      this.rbHttp.sendRequest({
        method: 'GET',
        params: { 'type': 'bizSystem', 'pid': '' },
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.bizSystemList = res
        this.$store.commit('bizSystemList', res)
      })
      this.rbHttp.sendRequest({
        method: 'GET',
        params: { 'type': 'idcType' },
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.idcTypeList = res
        this.$store.commit('idcTypeList', res)
      })
      this.rbHttp.sendRequest({
        method: 'GET',
        params: { 'type': 'pod_name' },
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.podList = res
        this.$store.commit('podList', res)
      })
      let _this = this
      rbAlertKanBanServiceFactory.bizSysTreeOptions().then(res => {
        if (!_this.bizSysTree) {
          _this.bizSysTree = res
        }
        _this.bizDepTreeSelOpts = res
      })
    },
    add () {
      this.$router.push({
        path: '/topo/configuration',
        query: {
          pictureType: this.search.pictureType
          // ,
          // idcList: this.idcTypeList,
          // podList: this.podList,
          // bizSystemList: this.bizSystemList
        }
      })
    },
    reset () {
      this.bizSysDepChecked = null
      this.bizDepTreeSelOpts = []
      this.search = {
        pictureType: '1'
      }
    },
    del (item) {
      this.$confirm('是否删除该拓扑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.sendRequest({
          method: 'DELETE',
          url: `/v1/scada/delScadaCanvas/${item.id}`
        })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.searchData()
          // 刷新列表
        } else {
          this.$message.error('删除失败')
        }
      })

    },
    view (item) {
      this.$router.push({
        path: '/topo/view',
        query: item
      })
    },
    //每页展示条数
    handleSizeChange (val) {
      this.currentPage = 1;
      this.pageSize = val;
      // console.log(`每页数据条数： ${this.currentPage} `);
      this.searchCustomizeData()
      this.topoList = this.customTopoList
      this.$forceUpdate()
    },
    //当前页
    handleCurrentChange (val) {
      this.currentPage = val;
      // console.log(`当前页: ${this.pageSize}`);
      this.searchCustomizeData()
      this.topoList = this.customTopoList
      this.$forceUpdate()
    },
    async searchData () {
      this.search.bizSystem = (this.bizSysDepChecked && this.bizSysDepChecked.length > 0) ? this.getBizSysByChecked(this.bizSysDepChecked) : ''
      this.activeTabName = 'customize'
      this.searchCustomizeData()
      if (this.search.pictureType === '1') {
        TopoApi.findOnlineScada(this.search).then(res => {
          this.onlineTopoList = res.data
          if (res.data) {
            var onlineTopoMap = {}
            this.onlineTopoList.forEach((item, index) => {
              onlineTopoMap[item.name] = item
            })
            this.$store.commit('onlineTopoMap', onlineTopoMap)
            let val = res.data.length
            this.tabData.some((item, index) => {
              if (item.name === 'online') {
                item.data = `(${val})`
                return true;
              }
            })
          }
          this.handleClick()
        })
      } else {
        this.onlineTopoList = []
        this.tabData[1].data = '(0)'
      }
    },
    getBizSysByChecked (sysDepChecked) {
      // if (sysDepChecked && sysDepChecked.length === 1 && !sysDepChecked[0]) {
      //   return ''
      // }
      let target = []
      let list = this.bizSysTree[0].children
      let addEle = function (eles) {
        if (!eles.children || eles.children.length === 0) {
          target.push(eles.id)
        } else {
          _.forEach(eles.children, ele => {
            addEle(ele)
          })
        }
      }
      let findEle = function (_array, _origin) {
        _.forEach(_array, child => {
          if (child.id === _origin) {
            addEle(child)
          } else if (child.children && child.children.length > 0) {
            findEle(child.children, _origin)
          }
        })
      }
      // _(sysDepChecked).forEach(ele => {
      //   findEle(list, ele)
      // })
      findEle(list, sysDepChecked)
      return _(target).uniq().join(',')
    },
    searchCustomizeData () {
      this.search.page_size = this.pageSize
      this.search.page_no = this.currentPage
      TopoApi.pageList(this.search).then(res => {
        if (res.result) {
          this.customTopoList = res.result
        } else {
          this.customTopoList = []
        }
        this.total = res.count
        this.tabData.some((item, index) => {
          if (item.name === 'customize') {
            item.data = `(${this.total})`
            return true;
          }
        })
        // this.topoList = this.customTopoList
        // this.$forceUpdate()
        this.handleClick()
      })
    },
    handleClick () {
      if (this.activeTabName === 'customize') {
        this.topoList = this.customTopoList
      } else {
        this.topoList = this.onlineTopoList
      }
      this.$forceUpdate()
    }
  },

  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    SmallTopo,
    SiteTopo,
    Treeselect
    //   YwSearch: () => import('src/components/common/yw-search.vue')
  }

}
</script>

<style lang="scss" scoped>
/deep/ .yw-form {
  /deep/ .el-form-item__content {
    .el-input {
      width: 148px;
    }

    .el-select {
      width: 148px;
    }
  }
}

.content-item {
  width: 32%;
  height: 240px;
  float: left;
  border-radius: 6px;
  margin: 9px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 8px 0px rgba(4, 0, 0, 0.13);
}

.el-main.chart-main-wrap {
  padding-top: 10px;
  display: block;
  height: 100%;
  margin: 10px 20px 0 10px;
  padding: 15px;
  overflow: scroll;

  background: #ffffff;
}

.no-topo {
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

.chart-title-wrap {
  padding-top: 8px;
  padding-left: 8px;
  width: 100%;
  height: 30px;
  background: linear-gradient(
    0deg,
    rgba(224, 232, 237, 0.35),
    rgba(243, 246, 248, 0.35)
  );
  padding: 0 rem(20);
  overflow: hidden;
}

.chart-title {
  line-height: rem(40);
  font-size: rem(14);
  color: #25374a;
  font-weight: bold;
}

.chart-section {
  position: relative;
  width: 100%;
  height: calc(100% - 0.2rem);
  padding: rem(10);
  overflow: inherit;
}

/deep/ .el-form-item__label {
  text-align: right;
}

/deep/ .el-radio__label {
  font-size: 12px;
}
/deep/ .vue-treeselect__single-value {
  display: flex;
  align-items: center;
}
</style>
