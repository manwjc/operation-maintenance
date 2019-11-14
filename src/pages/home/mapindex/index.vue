
 <template>
  <!-- 综合首页 -->
  <div class="components-container container-view">
    <div class="component-edit-button"
         @click="goEdit">
      <i class="el-icon-edit-outline"></i>
    </div>
    <div class="component-list">
      <template v-if="resetComponent">
        <component :is="item.componentName.default"
                   class="component-item"
                   v-for="(item,index) in componentsRequire"
                   :key="index"></component>
      </template>
    </div>
  </div>
</template>
 
<script>
import updateComponent from 'src/utils/updateComponent.js'
export default {
  mixins: [updateComponent],
  components: {

  },
  data () {
    return {
      //组件数据
      componentsData: [{ componentName: 'resource-chart-overview' },
      { componentName: 'order-chart-overview' },
      { componentName: 'alert-chart-my' },
      { componentName: 'alert-today-overview' },
      { componentName: 'alert-device-class' },
      { componentName: 'alert-chart-top' },
      { componentName: 'alert-new-hot' },
      { componentName: 'resource-use-rate' },
      { componentName: 'resource-pool-rate' },
      { componentName: 'resource-user-rate-top' },
      { componentName: 'resource-bizsys-rate-top' },
      { componentName: 'order-type-distributed' },
      { componentName: 'order-chart-statistics' },
      { componentName: 'order-chart-analysis' },
      { componentName: 'order-solve-time' },
      { componentName: 'resource-pool-device' },
      { componentName: 'resource-pool-user' },
      { componentName: 'safe-bug-level' },
      { componentName: 'safe-bizsys-bug-top' },
      { componentName: 'safe-pool-bug' },
      { componentName: 'safe-device-bug-top' }],
    }
  },

  computed: {
    //动态引入组件
    componentsRequire () {
      let componentsRequire = [];
      this.componentsData.forEach(item => {
        componentsRequire.push({ componentName: require(`src/pages/settings/customization/components/${item.componentName}.vue`) })
      })
      return componentsRequire;
    }
  },

  methods: {

    //获得模块数据
    getComponents () {

      // let params = {
      //   'moduleCode': 'home',
      // };
      // this.$api.queryModuleInfo(params).then((res) => {
      //   this.componentsData = JSON.parse(res.data).componentsData;
      // })
    },

    //编辑页
    goEdit () {
      this.$store.commit('setComponent', { componentsDir: 'home', componentsData: this.componentsData });
      // this.$router.push({ path: '/settings/customization/edits' })
    }
  },
  created () {
    this.getComponents();
  },
}
</script>
 
<style  lang="scss" scoped>
//自己样式
</style>
