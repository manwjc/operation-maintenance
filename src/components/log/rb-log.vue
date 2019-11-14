<template>
  <div>
    <ul class="rb-log-list">
      <li class="rb-log-item" v-for="(log, index) in data" :key="index">
        <span>{{(log.time*1000)|formatDate(true)}}</span>
        <span>{{log.instance_id}}</span>
        <span class="log-message">{{log.message}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default{
  props: ['data'],
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.rb-log-list {
  font-family: "Monaco", "DejaVu Sans Mono", "Liberation Mono", monospace;
  font-size: 12px;
  color: #e1e6e6;
  background-color: #263238;
  max-height: 600px;
  min-height: 400px;
  overflow: auto;
  li.rb-log-item {
    list-style: none;
    line-height: 20px;
    padding: 4px 8px;
    &:hover {
      background-color: #465155;
    }
    >span {
      margin-right: 4px;
    }
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
