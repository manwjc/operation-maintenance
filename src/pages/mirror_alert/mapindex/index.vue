
 <template>
  <!-- 监控首页 -->
  <div class="components-container container-view">
    <div class="component-edit-button"
         @click="goEdit">
      <i class="el-icon-edit-outline"></i>
      <!-- 定制首页看板 -->
    </div>
    <div class="component-condition clearfix">
      <el-radio-group class="yw-separate-button-wrap"
                      v-model="conditionParams.poolActive"
                      @change="changeTab">
        <el-radio-button :label="item.value"
                         v-for="(item,index) in conditionParams.poolList"
                         :key="index">{{item.name}}</el-radio-button>
      </el-radio-group>
      <el-date-picker class="yw-date-editor fr"
                      v-model="conditionParams.dateRange"
                      style="width:338px"
                      @change="changeTab"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="component-list">
      <template v-if="resetComponent">
        <component :is="item.componentName.default"
                   class="component-item"
                   :conditionParams="conditionParams"
                   v-for="(item,index) in componentsRequire"
                   :key="index"></component>
      </template>
    </div>
  </div>
</template>
 
<script>
import updateComponent from 'src/utils/updateComponent.js'
import { formatDate2 } from 'src/assets/js/utility/rb-filters.js'

export default {
  mixins: [updateComponent],
  components: {

  },
  data () {
    return {
      //查询条件
      conditionParams: {
        //日期范围
        dateRange: [],

        //资源
        poolActive: '',
        poolList: [{ value: '', name: '全部' }]
      },

      //组件数据
      componentsData: [],
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
    //获得数据
    getDatas () {
      this.getParams();
      this.getComponents();
    },

    //获得查询条件
    getParams () {
      let now = new Date()
      let before = now.getTime() - 1000 * 60 * 60 * 24 * 7
      this.conditionParams.dateRange = [formatDate2(before), formatDate2(now)]
      let params = {
        type: 'idcType',
        pid: '',
        pValue: '',
        pType: '',
      };
      this.$api.queryPool(params).then((res) => {
        this.conditionParams.poolList = res;
        this.conditionParams.poolList.unshift({ name: '全部', value: '' });
        this.conditionParams.poolActive = '';
      })
    },

    //获得模块数据
    getComponents () {
      // this.componentsData = [{ componentName: 'monitor-chart-pool' },
      // { componentName: 'monitor-chart-user' },
      // { componentName: 'monitor-chart-trend' },
      // { componentName: 'monitor-chart-top5' },
      // { componentName: 'monitor-chart-network' },
      // ];
      let params = {
        'moduleCode': 'monitor',
      };
      this.$api.queryModuleInfo(params).then((res) => {
        this.componentsData = JSON.parse(res.data).componentsData;
      })
    },

    //编辑页
    goEdit () {
      this.$store.commit('setComponent', { componentsDir: 'monitor', componentsData: this.componentsData });
      // this.$router.push({ path: '/settings/customization/edits' });
    },

    //条件查询
    changeTab (val) {
      //更新组件
      this.updateComponent();
    }
  },
  created () {
    this.getDatas();
  },
}
</script>
 
<style  lang="scss" scoped>
//自己样式
</style>
