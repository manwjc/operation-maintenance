<template>
  <!-- 定制化：可编辑页 -->
  <div class="edit-wrap">
    <draggable class="component-list"
               @end="dragEnd"
               @add="dragAdd"
               element="section"
               :value="componentsRequire"
               :options="dragOptionsMain">
      <component :is="item.componentName.default"
                 class="component-item"
                 v-for="(item,index) in componentsRequire"
                 :key="index"></component>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  // mixins: [DrawChart],
  components: {
    draggable,
  },
  data () {
    return {
      //组件数据
      componentsData: [{ componentName: 'TodayNewOrder' },
      { componentName: 'ToBeConfirmedAlert' },
      { componentName: 'deviceAlert' },
      { componentName: 'orderDistribution' },
      { componentName: 'orderTrend' },
      { componentName: 'deviceUseRate' }, { componentName: 'orderStatistics' }],

      //动态组件
      // componentsRequire: []
    }
  },
  computed: {
    //拖拽配置
    dragOptionsMain () {
      return {
        animation: 0,
        sort: true,
        group: "chartGroup",
      };
    },

    //动态引入组件
    componentsRequire () {
      let componentsRequire = [];
      this.componentsData.forEach(item => {
        componentsRequire.push({ componentName: require(`../components/${item.componentName}.vue`) })
      })
      return componentsRequire;
    }
  },
  methods: {
    //获得模块数据
    getComponents () {
      //获得模块数据
      this.componentsData = this.$store.state.customization.componentsData;

      //动态引入组件
      // this.componentsData.forEach(item => {
      //   this.componentsRequire.push({ componentName: require(`../components/${componentsDir}/${item.componentName}.vue`) })
      // })
    },

    //拖拽排序完成
    dragEnd (val) {
      let activeData = this.componentsData[val.oldIndex];
      let positionData = this.componentsData[val.newIndex];
      this.componentsData.splice(val.newIndex, 1, activeData);
      this.componentsData.splice(val.oldIndex, 1, positionData);

    },
    //拖拽添加
    dragAdd (val) {
      this.$bus.$on('getDragSource', (source) => {
        let componentName = source.componentName;

        let isExist = this.componentsData.some((item) => {
          return item.componentName === componentName;
        });

        if (!isExist) {
          this.componentsData.splice(val.newIndex, 0, { componentName: source.componentName });
        }

      });
    }

  },
  created () {
    this.getComponents();
  },
  mounted () {


  }
}
</script>

<style lang="scss" scoped>
.edit-wrap {
  .component-list {
    .component-item {
      cursor: move;
    }
  }
}
</style>
