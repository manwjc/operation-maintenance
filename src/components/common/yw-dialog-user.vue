<template>
  <!-- 用户筛选 -->
  <el-dialog class="yw-dialog"
             title="选择用户"
             :visible.sync="dialogUser.dialogVisible"
             width="640px"
             :close-on-click-modal="true">
    <section class="yw-dialog-main">
      <el-transfer filterable
                   filter-placeholder="请输入用户名称"
                   :titles="['用户列表', '已选用户']"
                   v-model="dialogUser.date"
                   :data="userList">
      </el-transfer>
    </section>
    <section class="btn-wrap">
      <el-button type="primary"
                 @click="submit()">确认选择</el-button>
      <el-button @click="cancel()">返回</el-button>
    </section>
  </el-dialog>

</template>
<script>
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
export default {
  props: ['dialogUser'],
  data () {
    return {
      //用户列表
      userList: [],

      //用户结果
      userResult: []
    }
  },
  mounted () {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    getUserList () {
      const namespace = sessionStorage.getItem('namespace')
      let arr = [namespace, {
        order_by: '-createTime',
        page_size: -1
      }]
      rbProjectDataServiceFactory.getUserList(arr).then((res) => {
        let arr = []
        res.result.forEach((item) => {
          let obj = {
            label: item.name,
            key: item.username
          }
          arr.push(obj)
        })
        this.userList = arr
      })
    },

    //确认
    submit () {
      this.$emit('closeDialogUser', {'type':'update', 'userResult': this.dialogUser.date});
    },

    //取消
    cancel () {
      this.$emit('closeDialogUser');
    }



  }

}
</script>
<style lang="scss" scoped>
</style>
