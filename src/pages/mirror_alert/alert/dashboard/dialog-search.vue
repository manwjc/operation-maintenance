<template>
  <!-- 资源检索 -->
  <el-dialog class="yw-dialog"
             :width="dialogWidth"
             title="设备资源检索"
             :visible.sync="dialogMsg.dialogVisible">
    <div class="clearfix">
      <!-- 分类 -->
      <section class="search-left">
        <ul class="search-list">
          <li class="search-item"
              :class="{active: item.name === currentType.name}"
              @click="changeType(item)"
              v-for="(item,index) in searchDatas"
              :key="index">{{item.name}}</li>
        </ul>
      </section>
      <!-- 分类 -->

      <component :is="currentComponent"
                 :currentType="currentType"
                 :dialogMsg="dialogMsg"
                 @closeDialog="closeDialog"
                 :key="currentType.name" @setData="setData"></component>

    </div>
  </el-dialog>

</template>
<script>
export default {
  props: ['dialogMsg'],
  components: {
    chooseMore: () => import('../dashboard/choose-more.vue'),
    chooseSingle: () => import('../dashboard/choose-single.vue'),
    chooseSingleType: () => import('../dashboard/choose-single-type.vue'),
  },

  data () {
    return {
      //dialog
      dialogWidth: '550px',

      //搜索
      currentType: {},
      searchParams: '',
      searchDatas: [],

      //查询参数
      queryParams: {},

      //结果
      result: [],
      addResult: [],//临时数据
      submitResult: [],

      //当前组件
      currentComponent: 'chooseSingle'

    }
  },
  mounted () {
    this.queryType();
  },
  methods: {
    //查询分类
    queryType () {
      this.searchDatas = [{ name: '业务系统' ,id: 1},
        { name: '资源池',id: 2 }, { name: '机房' ,id: 3 },
        { name: '设备分类',id: 4 }, { name: '设备类型' ,id: 5 }, { name: '设备IP' ,id: 6 }];
      if (this.dialogMsg.data.type) {
        let dialogMsgTemp = this.dialogMsg.data
        let tem = this.searchDatas.find(function (r) {
          return r.id === dialogMsgTemp.type
        })
        this.currentType = tem;
      } else {
        this.currentType = this.searchDatas[0]
      }
      this.changeType(this.currentType)
      //this.currentType = this.searchDatas[0]
    },

    //切换分类
    changeType (val) {
      this.currentType = val;
      switch (val.id) {
        case 6:
          this.dialogWidth = '1000px';
          this.currentComponent = 'chooseMore';
          break;
        case 5:
          this.dialogWidth = '600px';
          this.currentComponent = 'chooseSingleType';
          break;
        default:
          this.dialogWidth = '550px';
          this.currentComponent = 'chooseSingle';
          break;
      }
    },

    //关闭弹窗
    closeDialog (val) {
      this.$emit('closeDialog', val);
    },

    setData(val){
      this.$emit('setData', val);
    }

  }
}

</script>
<style lang="scss" scoped>
.search-left {
  display: inline-block;
  vertical-align: top;
  width: 150px;
  max-height: 345px;
  margin-right: 15px;
  overflow: auto;
  .search-list {
    .search-item {
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      border: 1px solid transparent;
      margin-bottom: 2px;
      cursor: pointer;
      &:hover,
      &.active {
        background: #f4f4f4;
        border: 1px solid rgba(229, 232, 237, 1);
      }
    }
  }
}
</style>
