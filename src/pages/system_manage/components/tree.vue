<!--
@author huangzhijie
@date   19.2.27
@description 资源管理页面
-->
<template>
  <div class="com-tree">
    <p v-show="exTitle"
       v-text="exTitle"></p>
    <el-input v-if="exShowSearch"
              class="yw-search-box"
              v-model="exSearchText"
              suffix-icon="el-icon-search"
              placeholder="请输入关键字搜索"></el-input>
    <el-tree :ref="exId"
             :data="data"
             :lazy="lazy"
             :load="load"
             :draggable="draggable"
             :node-key="nodeKey"
             :props="props"
             :default-expanded-keys="defaultExpandedKeys"
             :default-checked-keys="defaultCheckedKeys"
             :show-checkbox="showCheckbox"
             :render-content="thisRender"
             :filter-node-method="filterNode"
             :expand-on-click-node="expandOnClickNode"
             @node-click="handleNodeClick"
             @node-drop="handleDrop"
             @check="handleCheckChange">
      <!-- <span v-show="exControl" class="custom-tree-node" slot-scope="{node, data}">
        <span>{{ data.name }}</span>
        <span>
          <el-button @click="handleUpdate(node, data)" type="text"><i class="el-icon-tickets"></i></el-button>
          <el-button @click="handleUpdate(node, data)" type="text"><i class="el-icon-delete"></i></el-button>
        </span>
      </span> -->
    </el-tree>
  </div>
</template>
<script>
import { Tree } from 'element-ui'
export default {
  name: 'com-tree',
  mixins: [Tree],
  data () {
    const that = this
    return {
      exSearchText: '',
      thisRender: that.defaultRender
    }
  },
  props: {
    exId: {
      type: String,
      require: true
    },
    exTitle: {
      type: String
    },
    exShowSearch: {
      type: Boolean,
      default: false
    },
    exControl: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    exControlOpt: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    exSearchText (val) {
      this.$refs[this.exId].filter(val)
    }
  },
  methods: {
    // 获取已选中的
    getCheckedNodes (leafOnly, includeHalfChecked) {
      // console.log(this.data)
      return this.$refs[this.exId].getCheckedNodes(leafOnly, includeHalfChecked)
    },
    // 设置选中的
    setCheckedKeys (keys, leafOnly) {
      return this.$refs[this.exId].setCheckedKeys(keys, leafOnly)
    },
    getCurrentNode () {
      return this.$refs[this.exId].getCurrentNode()
    },
    handleNodeClick (data, data1, data2) {
      this.$emit('node-click', data)
    },
    handleCheckChange (data, data1) {
      this.$emit('check', data, data1)
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
      this.$emit('node-drop', draggingNode, dropNode, dropType, ev)
    },
    // loadNode (node, resolve) {
    //   debugger
    //   this.$emit('load', node, resolve)
    // },
    handleUpdate (node, data) {
      // console.log('handleUpdate called', node, data)
    },
    filterNode (value, data, node) {
      // console.log('filterNode', value, data, node)
      if (!value) return true
      return node.label.indexOf(value) !== -1
    },
    // 默然渲染
    defaultRender (h, { node, data, store }) {
      return (
        <span>{node.label}</span>
      )
    },
    // 设置渲染
    setRender () {
      if (this.exControl) {
        this.thisRender = this.customRender
      }
    },
    // 已定义渲染函数
    customRender (h, { node, data, store }) {
      // console.log(data)
      const btns = this.exControlOpt.map((item) =>
        <el-button on-click={() => item.callback(node, data, event)}
          title={item.title}
          type="text"><i class={item.icon}></i></el-button>
      )
      const treeNode1 = (
        <span class="custom-tree-node">
          <span>
            <i class={data.dept_type === 1 ? 'el-icon-star-on' : data.dept_type === 0 ? 'el-icon-star-off' : ''}
              style="color: #409EFF;"></i>
            {data.name}
          </span>
          <span class="buss">{btns}</span>
        </span>)
      return treeNode1
      // <el-button on-click={ () => this.handleUpdate(node, data) } type="text"><i class="el-icon-tickets"></i></el-button>
      //             <el-button on-click={ () => this.handleUpdate(node, data) } type="text"><i class="el-icon-delete"></i></el-button>
    }
  },
  mounted () {
    this.setRender()
  }
}
</script>
<style lang="scss" scoped>
.com-tree {
  padding-right: 20px;
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding-right: 8px;
  }
}
</style>
<style lang="scss" scoped>
.com-tree {
  .el-tree {
    min-height: 300px;

    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    font-size: 12px;
    /deep/ .el-tree-node__content {
      .buss {
        display: none;
      }
    }
    /deep/ .el-tree-node__content:hover {
      .buss {
        display: inline-block;
      }
    }
  }
}
</style>
