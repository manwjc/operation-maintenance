
 <template>
  <!-- 资源首页 -->
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
      // 组件数据
      componentsData: []
    }
  },

  computed: {
    // 动态引入组件
    componentsRequire () {
      let componentsRequire = []
      this.componentsData.forEach(item => {
        componentsRequire.push({ componentName: require(`src/pages/settings/customization/components/${item.componentName}.vue`) })
      })
      return componentsRequire
    }
  },

  methods: {
    // 获得模块数据
    getComponents () {
      // this.componentsData = [
      //   { componentName: 'resource-order-pool' },
      //   { componentName: 'resource-order-device' },
      //   { componentName: 'resource-chart-device' },
      //   { componentName: 'resource-chart-device-two' },
      //   { componentName: 'resource-chart-device-three' },
      //   { componentName: 'resource-chart-user' },
      //   { componentName: 'resource-chart-user-two' },
      //   { componentName: 'resource-chart-device-add' },
      //   { componentName: 'resource-chart-user-top5' },
      //   { componentName: 'resource-chart-device-top5' },
      //   { componentName: 'resource-chart-device-sub' }]
      let params = {
        'moduleCode': 'resource',
      };
      this.$api.queryModuleInfo(params).then((res) => {
        this.componentsData = JSON.parse(res.data).componentsData;
      })
    },

    // 编辑页
    goEdit () {
      this.$store.commit('setComponent', { componentsDir: 'resource', componentsData: this.componentsData })
      this.$router.push({ path: '/settings/customization/edits' })
    }
  },
  created () {
    this.getComponents()
  }
}
</script>
 
<style  lang="scss" scoped>
//自己样式
</style>
