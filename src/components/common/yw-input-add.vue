<template>
  <!-- 添加输入框 -->
  <el-collapse class="yw-add-wrap" v-model="activeNames">
    <el-collapse-item name="1">
      <template slot="title">
        <el-input v-model="activeKey"
                  placeholder="关键字检索"></el-input>
        <i class="el-icon-circle-plus"
           @click.stop="add"></i>
      </template>
      <el-form class="yw-add-body yw-form"
               :model="formData">
        <el-form-item :label="`关键字${index+1}`"
                      v-for="(item,index) in keys"
                      :key='index'>
          <el-input v-model="keys[index]"
                    placeholder=""
                    @change="change(item,index)"></el-input>
          <i class="el-icon-error"
             @click="del(item,index)"></i>
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>

</template>
<script>
export default {
  props: ['keys', 'activeKey'],
  data () {
    return {
      formData: {},
      activeNames: []
    }
  },
  methods: {
    add () {
      this.keys.push(this.activeKey);
      this.$emit('changeKey', this.keys);
    },
    del (item, index) {
      this.keys.splice(index, 1);
      this.$emit('changeKey', this.keys);
    },
    change (item, index) {
      this.$emit('changeKey', this.keys);
    }
  },
  watch: {
    keys: {
      handler () {
        if (this.keys && this.keys.length > 0) {
          this.activeNames.push('1')
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.yw-add-wrap {
  border: none;
  .el-collapse {
    border: none;
    margin-top: -6px;
  }
  /deep/ .el-collapse-item__header {
    border: none;
    height: 34px;
    line-height: 34px;
  }
  .el-icon-circle-plus {
    margin-left: 2px;
    font-size: 20px;
  }
  .yw-add-body {
    position: relative;
    width: 300px;
    border: 1px solid #eee;
    min-height: 80px;
    padding: 5px 20px;
    .el-icon-error {
      position: absolute;
      font-size: 20px;
      top: 5px;
      right: -23px;
    }
  }
}
</style>
