<!--<template>-->
    <!--<div class="topo content-item" v-for="(item, index) in topoList">-->
        <!--<section class="chart-title-wrap clearfix">-->
         <!--<div style="float: right;margin-right:5px;">-->
           <!--<el-tooltip class="item"-->
                    <!--effect="dark"-->
                    <!--content="删除"-->
                    <!--placement="bottom"-->
                    <!--:hide-after=1000>-->
              <!--<el-button type="text"-->
                         <!--@click="del(item)" class="el-icon-delete">-->
              <!--</el-button>-->
            <!--</el-tooltip>-->
           <!--<el-tooltip class="item"-->
                    <!--effect="dark"-->
                    <!--content="查看"-->
                    <!--placement="bottom"-->
                    <!--:hide-after=1000>-->
              <!--<el-button type="text"-->
                         <!--@click="view(item)" class="el-icon-view">-->
                <!--&lt;!&ndash;<i class="el-icon-view"&ndash;&gt;-->
                     <!--&lt;!&ndash;aria-hidden="true">&ndash;&gt;-->
                  <!--&lt;!&ndash;<use xlink:href="#icondashboardBack"></use>&ndash;&gt;-->
                <!--&lt;!&ndash;</i>&ndash;&gt;-->
              <!--</el-button>-->
            <!--</el-tooltip>-->
         <!--</div>-->
        <!--<span class="chart-title">{{item.name + '-' +(item.pictureType == '1'? '物理拓扑' : item.pictureType == '2'? '逻辑拓扑' : '租户拓扑')}}</span>-->
        <!--</section>-->
        <!--<section class="chart-section">-->
          <!--<div class="viewer" :is="activeName" :defaultOptions="item">-->
          <!--</div>-->
        <!--</section>-->
      <!--</div>-->
       <!--<div v-show="topoList.length === 0"-->
           <!--class="no-topo content-item">-->
        <!--<p>暂无拓扑图</p>-->
        <!--<el-button type="primary"-->
                   <!--@click="add">新增拓扑图</el-button>-->
        <!--</div>-->
<!--</template>-->

<!--<script>-->
    <!--export default {-->
      <!--name: 'customize-topo',-->
      <!--props: ['topoList']-->
    <!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
