<template>
  <div id="codemirror" style="width: 100%;height: 100%;">
  </div>
</template>
<script>
import CodeMirror from 'codemirror/lib/codemirror'   // CodeMirror，必要
import 'codemirror/lib/codemirror.css'    // css，必要
import 'codemirror/theme/material.css'    // css，必要
import 'codemirror/mode/yaml/yaml'  // yaml的语法高亮，自行替换为你需要的语言
export default{
  props: ['data', 'readonly'],
  data () {
    return {
      editor: {}
    }
  },
  computed: {
  },
  mounted () {
    this.editor = CodeMirror(document.getElementById('codemirror'), {
      value: this.data || '',
      lineNumbers: true,
      mode: 'yaml',
      theme: 'material',
      readOnly: this.readonly
    })
    this.editor.setSize('100%', '100%')
    this.editor.on('change', instance => {
      let value = instance.getValue()
      this.$emit('change', value)
    })
  },
  watch: {
    data: function (val) {
      const curPosition = this.editor.getCursor()
      // 设置新值
      this.editor.setValue(val)
      // 获取最后一行
//      const line = this.editor.lastLine()
      // 获取最后一行内容
//      const content = this.editor.getLine(line)
      // 设置光标位置
      this.editor.setCursor(curPosition)
    }
  }
}
</script>
<style scoped>
</style>
