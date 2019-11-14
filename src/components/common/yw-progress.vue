<template>
  <!-- 进度条 -->
  <div>
    <!-- 进度条类型2 -->
    <section class="yw-progress"
             v-for="(subItem,subIndex) in datas.list"
             :key="subIndex">
      <p class="progress-text clearfix"
         :class="datas.status">
        <el-tooltip class="item"
                    effect="dark"
                    :disabled="!subItem.tip"
                    :content="subItem.tip"
                    placement="top-start">
          <span>{{subItem.name}}</span>
        </el-tooltip>

        <!-- <span class="process-percentage">10%</span> -->
      </p>
      <el-progress :percentage="subItem.rate"
                   class="text-inside"
                   :class="datas.status"
                   :stroke-width="22"
                   :show-text="false"></el-progress>
      <p class="progress-inner-text text-ellipse">已分配{{subItem.num}}/总{{subItem.total}}</p>
    </section>
  </div>

</template>
<script>
export default {
  props: ['datas'],
  data () {
    return {
      // datas: [{ name: '服务器', list: [], status: 'blue' }]
    }
  },
  methods: {

  },

}
</script>
<style lang="scss" scoped>
</style>
