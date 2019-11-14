<template>
  <div class="component-container">
    <el-row>
      <el-col>
        <div>
          <el-tabs type="border-card" addable>
            <el-tab-pane
              v-for="(item, index) in tabList"
              :key="item.id"
              :label="item.title"
              :closable="item.closable"
            >
              <over-all-view v-if="item.id == 'overAllView'"></over-all-view>
              <diff-business-view v-if="item.id == 'diffBusinessView'"></diff-business-view>
              <cloud-view v-if="item.id == 'cloudView'"></cloud-view>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import overAllView from './components/over-all-view.vue'
  import diffBusinessView from './components/diff-business-view.vue'
  import cloudView from './components/cloud-view.vue'
  // import _ from 'lodash'

  export default {
    components: {
      overAllView,
      diffBusinessView,
      cloudView
    },
    data: function () {
      return {
        tabList: [{id: 'overAllView', title: '总览业务视图', content: '总览业务视图', closable: false},
          {id: 'diffBusinessView', title: '分业务视图', content: '分业务视图', closable: false},
          {id: 'cloudView', title: '监控云视图', content: '监控云视图', closable: false}]
      }
    },
    computed: {},
    mounted: function () {
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>
