<template>
  <div class="component-container">
    <!--同步启用-->
    <div id="top">
      <div style="margin-top: 20px">
        <span style="margin-left: 10px" >已启用</span><br/>
        <span style="margin-left: 5px;margin-right: 780px">本网站已设置为允许任何 用户访问</span>
        <a>
          <i class="el-icon-edit"></i>
          <el-button type="text" size="mini" @click="unopen()">更新</el-button>
        </a>
      </div>
    </div>
    <!--下半部分区域-->
    <div>
      <div>
        <div>
          <div>
            <!--主机名或IP地址-->
            <div class="rb-detail-row">
              <div class="ng-infor">主机名或IP地址</div>
              <div class="ng-infor" style="text-align: left"></div>
              <div class="ng-infor">端口</div>
              <div class="ng-infor" style="text-align: left"></div>
            </div>
            <!--TLS-->
            <div class="rb-detail-row">
              <div class="ng-infor">TLS</div>
              <div class="ng-infor" style="text-align: left"></div>
              <div class="ng-infor">服务账号用户名</div>
              <div class="ng-infor" style="text-align: left"></div>
            </div>
            <!--服务账号密码-->
            <div class="rb-detail-row">
              <div class="ng-infor">服务账号密码</div>
              <div class="ng-infor" style="text-align: left">******</div>
              <div class="ng-infor">搜索起点</div>
              <div class="ng-infor" style="text-align: left"></div>
            </div>
            <!--对象类型-->
            <div class="rb-detail-row">
              <div class="ng-infor">对象类型</div>
              <div class="ng-infor" style="text-align: left"></div>
              <div class="ng-infor">登录字段</div>
              <div class="ng-infor" style="text-align: left"></div>
            </div>
            <!--过滤条件-->
            <div class="rb-detail-row">
              <div class="ng-infor">过滤条件</div>
              <div class="ng-infor" style="text-align: left"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    mounted: function () {
    },
    computed: {
    },
    methods: {
      unopen () {
        this.$alert('此功能尚未开放', '提示', {
          confirmButtonText: '确定'
        })
      }
    },
    watch: {
    }
  }
</script>

<style scoped>
  #top{
    height:70px;
    border:1px solid #dcdcdc;
    margin:20px;
    border-radius:5px;
    background-color: #f8f8ff;
    color: #494949;
  }
  .ng-infor{
    width: 250px;
    float: left;
    text-align: right;
    padding-right: 16px;
    -webkit-box-flex: 0;
    flex: 0 0 160px;
    word-break: break-all;
    color: #a1a1a1;
    line-height: 36px;
    visibility: visible;
    -webkit-box-direction: normal;
    font-family: HelveticaNeue-Light, Helvetica Neue, Tahoma, Arial, STXihei, "华文细黑", "Microsoft YaHei", "微软雅黑", sans-serif;
    font-weight: 400;
  }
  .rb-detail-row{
    display: flex;
    line-height: 36px;
    margin: 0;
    padding: 0;
    color: #494949;
    font-family: HelveticaNeue-Light, Helvetica Neue, Tahoma, Arial, STXihei, "华文细黑", "Microsoft YaHei", "微软雅黑", sans-serif;
    font-weight: 400;
  }
</style>
