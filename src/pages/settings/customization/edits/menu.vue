<template>
  <!-- 定制化：菜单 -->
  <div class="container-menu">
    <el-tabs class="yw-menu-tabs"
             v-model="activeName"
             type="border-card"
             tab-position="left"
             @tab-click="changMenu">
      <el-tab-pane :label="item.name"
                   :name="item.name"
                   v-for="(item,index) in tabDatas"
                   :key="index">
        <draggable class="thumb-list"
                   @remove="dragRemove"
                   element="ul"
                   v-model="item.thumb"
                   :options="dragOptionsMenu">
          <!-- <ul class="thumb-list"> -->
          <li class="thumb-item"
              v-for="(subItem,subIndex) in item.thumb"
              :key="subIndex">
            <img class="item-img"
                 :src="subItem.url"
                 alt="暂无图片" />
            <p class="item-name text-ellipse">{{subItem.name}}</p>
          </li>
          <!-- </ul> -->
        </draggable>
      </el-tab-pane>
      <!-- <el-tab-pane label="用户管理"
                   name="first">用户管理</el-tab-pane> -->
    </el-tabs>
  </div>
</template>
 
<script>
import draggable from 'vuedraggable'
import MenuConfig from '../utils/menuConfig.js'

export default {

  components: {
    draggable
  },
  data () {
    return {
      activeTab: {},//当前选中的tab
      activeName: '测试1',
      tabDatas: [{ name: '测试1', list: [{ url: '', name: '测试11' }, { url: '', name: '测试12' }] },
      { name: '测试2', list: [{ url: '', name: '测试21' }] },]

    }
  },
  computed: {
    dragOptionsMenu () {
      return {
        animation: 0,
        group: {
          name: 'chartGroup',//拖放位置
          pull: 'clone',
          put: false
        },
        ghostClass: 'ghost'
      }
    }
  },
  mounted () {
    this.getMenu();
  },
  methods: {
    //获得菜单
    getMenu () {
      this.tabDatas = [];
      let componentsDir = this.$store.state.customization.componentsDir;

      if (componentsDir === 'home') {
        //如果是综合首页
        // this.tabDatas = [MenuConfig['monitor'], MenuConfig['alert'], MenuConfig['flow'], MenuConfig['resource'], MenuConfig['safety']];
        this.tabDatas = MenuConfig[componentsDir];
      } else {
        this.tabDatas = [MenuConfig[componentsDir]];
      }
      this.activeTab = this.tabDatas[0];
      this.activeName = this.tabDatas[0].name;

    },

    //切换菜单
    changMenu (tab, event) {
      this.activeTab = this.tabDatas[tab.index];
    },

    //拖拽到另一个列表
    dragRemove (val) {
      this.$bus.$emit('getDragSource', this.activeTab.thumb[val.oldIndex]);
    },

  }
}
</script>
 
<style  lang="scss" scoped>
.container-menu {
  height: 100%;
  /deep/ .yw-menu-tabs {
    height: 100%;
    .el-tabs__content {
      height: 100%;
      overflow: auto;
    }
  }
  .thumb-list {
    .thumb-item {
      margin-bottom: 15px;
      text-align: center;
      cursor: move;

      .item-img {
        display: inline-block;
        width: 100%;
        height: 76px;
        border: 1px solid $color-border;
      }
      .item-name {
        font-size: 16px;
        font-weight: bold;
      }

      &:hover,
      &.active {
        .item-img {
          border: 2px solid $color-link-dark;
        }
      }
    }
  }
}
</style>
