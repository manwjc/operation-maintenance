<template>
  <div class="component-container">
    <div class="wrapper">
      <section>
        <header>获取环境变量</header>
        <div>
          <pre>使用方式:
          开发环境下，环境变量在config/dev.env.js文件配置，具体参考文件，在server/app.js文件的if (process.env.NODE_ENV === 'development')
          条件中添加，环境变量设置语句，如process.env.API_SERVER_URL = config.dev.env.API_SERVER_URL；然后在server/routes/api.js
          的/env路由方法添加要返回的环境变量，文件中有参考样例，如：process.env.API_SERVER_URL = config.dev.env.API_SERVER_URL
          最后在组件中获取的方式为this.env.API_SERVER_URL
          </pre>
        </div>
      </section>
    </div>
    <div class="wrapper">
      <section>
        <header>codemirror</header>
        <div>
          <pre>使用方式:
          import codemirror from 'src/components/editor/code-mirro.vue'
          components: {
            codemirror
          }
          &lt;codemirror data="ok" @change="handler"&gt;&lt;/codemirror&gt;</pre>
          说明：date为编辑器的默认显示的值，@change为编辑器内容改变时触发的事件，回调函数handler的参数为编辑器的值
        </div>
        <div class="wrap-box">
          <codemirror :data="mi" @change="handler"></codemirror>
        </div>
      </section>
    </div>
    <div class="wrapper">
      <section>
        <header>事件组件</header>
        <div>
          <pre>使用方式:
          import eventList from 'src/pages/event/list/event-list.vue'
          components: {
            eventList
          }
          &lt;event-list :type="" :primaryKey="" &gt;&lt;/event-list&gt;</pre>
          说明：type为资源类型,多个资源类型以,分割;primaryKey资源id
        </div>
        <div class="wrap-box">
          <event-list></event-list>
        </div>
    </section>
    </div>
    <div class="wrapper">
      <section>
        <header>日志组件</header>
        <div>
          <pre>使用方式:
          import rbLog from 'src/components/log/rb-log.vue'
          components: {
            eventList
          }
          &lt;rb-log :data=""&gt;&lt;/rb-log&gt;</pre>
          说明：data的数据结构为[{'time': 1516602142, 'message': 'successful: kill -9 8'}],如结构特殊，请找我沟通
        </div>
        <div class="wrap-box">
          <rb-log :data="log"></rb-log>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
  import codemirror from 'src/components/editor/code-mirro.vue'
  import eventList from 'src/pages/event/list/event-list.vue'
  import rbLog from 'src/components/log/rb-log.vue'
  import rbRoleUtilities from 'src/services/rbac_role/rb-role-utilities.factory.js'
  export default {
    components: {
      codemirror,
      eventList,
      rbLog
    },
    data () {
      return {
        mi: 'ok',
        time: 1509245392000,
        timeString: '2017-12-13T09:18:20.000000Z',
        log: [{'message': 'successful: update imagesync history status.', 'time': 1516601952, 'level': 'INFO'}, {'message': 'successful: docker login --username=alauda --password=alauda 172.30.150.145:5000', 'time': 1516601952, 'level': 'INFO'}, {'message': 'successful: docker login --username=test --password=test 172.30.150.145:5001', 'time': 1516601953, 'level': 'INFO'}, {'message': 'successful: docker pull 172.30.150.145:5000/nanjing/product-parentzp:v20180119.165858', 'time': 1516602042, 'level': 'INFO'}, {'message': 'successful: docker tag 172.30.150.145:5000/nanjing/product-parentzp:v20180119.165858 172.30.150.145:5001/nanjing/product-parentzp:v20180119.165858', 'time': 1516602043, 'level': 'INFO'}, {'message': 'successful: docker push 172.30.150.145:5001/nanjing/product-parentzp:v20180119.165858', 'time': 1516602140, 'level': 'INFO'}, {'message': 'successful: update imagesync history status.', 'time': 1516602142, 'level': 'INFO'}, {'message': 'successful: kill -9 8', 'time': 1516602142, 'level': 'INFO'}]
      }
    },
    computed: {},
    mounted () {
      console.log(this)
      // this.rbHttp.sendRequest({
      //   method: 'GET',
      //   url: `/api/env`
      // }).then((data) => {
      //   return data
      // })
      rbRoleUtilities.resourceTypeSupportPermissions('zuul_config', 'update')
      .then((zuulConfigUpdateEnabled) => {
//        alert(zuulConfigUpdateEnabled)
      })
    },
    methods: {
      handler (data) {
        this.mi = data
      }
    }
  }
</script>
<style scoped>
.wrapper {
    width: 100%;
    margin: 0 auto;
}
.wrapper section {
  margin-bottom: 30px;
  box-shadow: 1px 1px 4px #DDD;
  background-color: #FFF;
}
.wrapper section header {
  line-height: 1;
  padding: 10px;
  font-size: 22px;
  color: #333;
  background-color: #EEE;
}
</style>
