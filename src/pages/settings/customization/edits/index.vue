
 <template>
  <!-- 定制化首页 -->
  <div class="components-container container-edit">
    <!-- 头部 -->
    <section class="header-wrap clearfix"
             height="45px">
      <div class="btn-wrap fr">
        <el-tooltip class="item"
                    effect="dark"
                    content="返回"
                    placement="bottom"
                    :hide-after=1000>
          <el-button type="text"
                     @click="back()">
            <svg class="svg-icon svg-icon-24"
                 aria-hidden="true">
              <use xlink:href="#icondashboardBack"></use>
            </svg>
          </el-button>
        </el-tooltip>
        <el-button type="text"
                   @click="save()">
          <svg class="svg-icon svg-icon-24"
               aria-hidden="true">
            <use xlink:href="#iconright"></use>
          </svg>
        </el-button>

      </div>
      <div class="header">
        <svg class="svg-icon"
             aria-hidden="true">
          <use xlink:href="#icondashboard"></use>
        </svg>
        <span class="title">{{title}}</span>
      </div>
    </section>
    <!-- 头部 -->

    <!-- 侧边栏 -->
    <section class="aside-wrap">
      <Menu></Menu>
    </section>
    <!-- 侧边栏 -->

    <!-- 内容 -->
    <section class="main-wrap">
      <Main></Main>
    </section>
    <!-- 内容 -->

  </div>
</template>
 
<script>
export default {
  components: {
    Menu: () => import('./menu.vue'),
    Main: () => import('./main.vue'),
  },
  data () {
    return {
      title: '定制首页'

    }
  },

  methods: {
    //保存数据
    saveDatas () {

      let componentsDir = this.$store.state.customization.componentsDir;
      let componentsData = this.$store.state.customization.componentsData;
      // let componentsDir = 'home' //模块目录（比如综合首页）
      // let componentsData = [{ componentName: 'TodayNewOrder' },  //模块名称
      // { componentName: 'deviceUseRate' }, { componentName: 'orderStatistics' }];
      let params = {
        "moduleCode": componentsDir,
        'data': JSON.stringify({ componentsData: componentsData }),

      };
      this.$api.addModuleInfo(params).then((res) => {
        if (res) {
          this.$message.success('保存成功！')
        }

      }).catch((e) => {
        this.$message.error('服务中断,请联系管理员！')
      })
    },

    //保存
    save () {
      this.$confirm('保存吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveDatas();
      }).catch(() => {
      });
    },

    //返回
    back () {
      this.$router.go(-1);
    }
  }
}
</script>
 
<style  lang="scss" scoped>
.container-edit {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  // height: 100%;

  .header-wrap {
    width: 100%;
    height: 45px;
    line-height: 45px;
    overflow: hidden;
    .header {
      font-size: 16px;
      color: $color-link-dark;
      .title {
        display: inline-block;
        font-weight: bold;
      }
    }
  }
  .aside-wrap {
    width: 20%;
    // height: calc(100% - 50px);
  }
  .main-wrap {
    width: 78%;
  }
}
</style>
