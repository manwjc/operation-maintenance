<template>
  <div class="component">
    <div class="top"
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-tree :data="viewTypeList"
               :default-expanded-keys="this.dialogData.pictureType"
               :default-checked-keys="this.dialogData.pictureType"
               node-key="id"
               :props="defaultProps"
               @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="footer">
      <el-row>
        <el-button size="mini"
                   class="sureBtn"
                   :disabled="chooseBoolean"
                   @click="sendData()"
                   type="primary"
                   round>确定</el-button>
        <el-button size="mini"
                   @click="cancel"
                   round>取消</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex'

export default {
  props: ['dialogData', 'formData'],
  data () {
    return {
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      chooseBoolean: true,
      chooseItem: {},
      chooseLabel: ''
    }
  },
  computed: {
    ...mapState({
      viewTypeList: state => state.topo.viewTypeList
    })
  },
  methods: {
    sendData () {
      this.returnChoose(this.viewTypeList, [])
      this.$emit('backBindViewType', {
        chooseLabel: this.chooseLabel,
        chooseItem: this.chooseItem
      })
      this.$emit('close', true)
    },
    cancel () {
      this.$emit('close', true)
    },
    handleNodeClick (data) {
      if (data.children && data.children.length > 0) {
        // alert('不可选中！')
        this.chooseBoolean = true
      } else {
        this.chooseItem = data
        this.chooseBoolean = false
      }
    },
    returnChoose (data, index) {
      data.forEach(item => {
        const abb = index.concat(item.label)
        if (item.id === this.chooseItem.id) {
          this.chooseLabel = abb.join('/')
        } else {
          if (item.children && item.children.length > 0) {
            this.returnChoose(item.children, abb)
          }
        }
      })
    },
    async fetchData () {
      try {
        this.res = await this.$http.sendRequest({
          method: 'POST',
          url: '/v1/scada/getAlertCountOrMeteValueByPrecinctId', // 根据tree返回的参数 请求后台数据
          params: {
            comTrees: [{
              deviceId: this.data.deviceId,
              deviceKind: this.data.deviceKind,
              deviceModel: this.data.deviceModel,
              deviceType: this.data.deviceType,
              id: this.data.id,
              isParent: this.data.isParent,
              isPrecinct: this.data.isPrecinct,
              precinctId: this.data.precinctId,
              precinctKind: this.data.precinctKind
            }]
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.component {
  display: flex;
  flex-direction: column;
  .top {
    border-radius: 10px;
    background: #fff;
    padding: 14px 0 20px 0;
    margin: 0 20px;
    /deep/ .el-tree {
      height: 3.5rem;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 6px;
        background-color: #fff;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 0.1rem;
        background: #e2e2e2;
        opacity: 0.42;
      }
      background: unset; // 继承
    }
  }
  .bottom {
    flex: none;
    height: 2rem;
    background: #f6f6f6;
    .title {
      height: 0.4rem;
      line-height: 0.4rem;
      padding-left: 0.2rem;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #333333;
      font-weight: bold;
    }
    .el-form {
      margin: 0 0.2rem;
      border-radius: 0.1rem;
      background: #fff;
      padding-top: 0.1rem;
    }
    .el-row {
      height: 0.3rem;
      margin-left: 0.8rem;
      display: flex;
      flex-direction: row;
      /deep/ .el-radio__label {
        font-size: 12px;
        font-family: MicrosoftYaHei;
      }
      .box {
        width: 1.4rem;
      }
    }
  }
  .footer {
    margin-top: 0.15rem;
    flex: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 0.4rem;
    // background-color: pink;
    .sureBtn {
      margin-left: 0.15rem;
    }
  }
}
</style>
