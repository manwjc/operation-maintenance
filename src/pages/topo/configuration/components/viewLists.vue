<template>
  <div class="component">
    <!-- {{this.dialogData}} -->
    <el-form ref="form"
             :model="form"
             label-width="60px">
      <el-form-item label="画布">
        <el-select v-model="form.view"
                   clearable
                   placeholder="请选择">
          <el-option v-for="item in lists"
                     :key="item.id"
                     :label="getlabel(item.name,item.pictureType)"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-row>
        <el-button size="mini"
                   class="sureBtn"
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

export default {
  props: ['dialogData'],
  data () {
    return {
      lists: [],
      form: {
        view: null
      }
    }
  },
  mounted () {
    if (this.dialogData.viewName) {
      this.form.view = this.getlabel(this.dialogData.viewName, this.dialogData.pictureType)
    } else {
      this.form.view = ''
    }
    this.fetchData()
  },
  methods: {
    getlabel (name, type) {
      var typename
      switch (type) {
        case 0:
          typename = '默认'
          break
        case 1:
          typename = '温度图'
          break
        case 2:
          typename = '市电图'
          break
      }
      return name + ' - ' + typename
    },
    cancel () {
      this.$emit('close', true)
    },
    async fetchData () {
      try {
        const res = await this.$http.sendRequest({
          method: 'GET',
          url: '/v1/scada/findScadaCanvasList'
        })
        if (res.code === 200) {
          // console.log(res, 'res')
          this.lists = res.data
        } else {
          this.lists = []
        }
      } catch (e) {
        this.lists = []
        console.log(e)
      }
    },
    sendData () {
      const item = this.lists.filter(item => {
        return item.name === this.form.view || item.id === this.form.view
      })
      if (item) {
        this.$emit('backNodeBindView', {
          viewId: item[0].precinctId,
          viewName: item[0].name,
          pictureType: item[0].pictureType
        })
      }
      this.$emit('close', true)
    }
  }
}
</script>
<style lang="scss" scoped>
.component {
  display: flex;
  flex-direction: column;
  .bottom {
    flex: none;
    height: 2rem;
    // background-color: olivedrab;
    .title {
      height: 0.4rem;
      line-height: 0.4rem;
      padding-left: 0.15rem;
      font-family: MicrosoftYaHei;
      font-size: 14px;
    }
    .el-row {
      height: 0.3rem;
      margin-left: 0.8rem;
      // background-color: yellow;
      display: flex;
      flex-direction: row;
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
