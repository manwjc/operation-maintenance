<template>
  <div>
    <asp-upload :uploadType = 'uploadType' @input="inputValue"></asp-upload>
  </div>
</template>
<script>
export default {
  props: ['uploadType'],
  data () {
    return {
    }
  },
  methods: {
    inputValue: function (inputValue, type) {
      if (inputValue) {
        this.$emit('close', true)
      }
      if (type && type === 'excel') {
        this.$emit('backUploadFileInfoExcel', inputValue)
      } else {
        this.$emit('backUploadFileInfo', inputValue)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-upload-dragger {
  margin-left: 50px;
}
/deep/ .el-upload__tip {
  margin-left: 50px;
}
</style>