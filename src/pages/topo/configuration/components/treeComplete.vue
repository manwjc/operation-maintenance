<template>
  <div class="component2">
    <el-tree :data="treeData"
             :props="defaultProps"
             node-key="id"
             :expand-on-click-node="false"
             @node-click="handleNodeClick"
             :highlight-current="true"
             default-expand-all
             ref="tree">
      <span class="custom-tree-node"
            slot-scope="{ node, data }">
        <i :class="selectIcon(node, data)"></i>
        <span class="labelName"
              :title="node.label">{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  props: {
    treeData: {
      type: Array
    }
  },
  data () {
    return {
      // 树相关
      defaultProps: {
        label: 'name',
        children: 'subList'
      }
    }
  },
  methods: {
    handleNodeClick (data, node) {
      this.$emit('updateTreeNode', node)
    },
    selectIcon (node, data) {
      if (data.precinctKind || data.precinctKind === 0) {
        switch (data.precinctKind) {
          case 0:
            return 'monitor'
          case 1:
            return 'zones'
          case 2:
            return 'site'
          case 3:
            return 'machine'
          case 4:
            return 'floor'
          case 5:
            return 'computer'
          default:
            break
        }
      } else {
        return 'device1'
      }
    },
    handle (res, up) {
      if (res.device_type || res.sub_device_type === 2) {
        return
      }
      let fid = up.data.precinctId ? up.data.precinctId : up.data.precinct_id
      res.id = res.precinct_id
      this.$refs['tree'].append(res, fid)
      this.$nextTick(() => {
        this.defaultExpanded = [fid]
        this.$refs['tree'].setCurrentKey(res.id)
        this.$emit('updateTreeNode', { data: res })
      })
    },
    search (res) {
      this.$nextTick(() => {
        this.defaultExpanded = [res]
        this.$refs['tree'].setCurrentKey(res)
        let node = this.$refs['tree'].getCurrentNode()
        this.$emit('updateTreeNode', node)
      })
    },
    // 只用选中，不用定位
    monitor (res) {
      this.$nextTick(() => {
        this.$refs['tree'].setCurrentKey(res)
      })
    }
  },
  mounted () {
    // this.$bus.on('treeNode', this.handle)
    this.$bus.on('searchTwo', this.search)
    // this.$bus.on('monitor', this.search)
  },
  destroyed () {
    // this.$bus.off('treeNode', this.handle)
    this.$bus.off('searchTwo', this.search)
    // this.$bus.off('monitor', this.search)
  }
}
</script>

<style lang="scss" scoped>
.component2 {
  /deep/ .el-tree {
    background: unset;
    .el-tree-node__content {
      font-size: 12px;
      position: relative;
      .buss {
        display: none;
      }
      .labelName {
        vertical-align: middle;
      }
      .span-ellipsis {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
      }
      i {
        display: inline-block;
        width: 16px;
        height: 16px;
        vertical-align: middle;
      }
      /*i.monitor {*/
        /*background: url("../../../../assets/img/monitor.png") no-repeat;*/
        /*background-size: 100%;*/
      /*}*/
      /*i.zones {*/
        /*background: url("../../../../assets/img/zones.png") no-repeat;*/
        /*background-size: 100%;*/
      /*}*/
      /*i.site {*/
        /*background: url("../../../../assets/img/site.png") no-repeat;*/
        /*background-size: 100%;*/
      /*}*/
      /*i.machine {*/
        /*background: url("../../../../assets/img/machine.png") no-repeat;*/
        /*background-size: 100%;*/
      /*}*/
      /*i.floor {*/
        /*background: url("../../../../assets/img/floor.png") no-repeat;*/
        /*background-size: 100%;*/
      /*}*/
      /*i.computer {*/
        /*background: url("../../../../assets/img/computer.png") no-repeat;*/
        /*background-size: 100%;*/
      /*}*/
      /*i.device1 {*/
        /*background: url("../../../../assets/img/device1.png") no-repeat;*/
        /*background-size: 100%;*/
      /*}*/
      /*i.head {*/
        /*background: url("../../../../assets/img/detail.png") no-repeat;*/
        /*background-size: 100%;*/
      /*}*/
      // i.edit {
      //   background: url("../../../../assets/img/treeEdit.png") no-repeat;
      //   background-size: 100%;
      // }
      // i.del {
      //   background: url("../../../../assets/img/treeDel.png") no-repeat;
      //   background-size: 100%;
      // }
      // .el-icon-caret-right {
      //   background: url("../../../../assets/img/detail.png") no-repeat;
      //   background-size: 100%;
      // }
      // .el-icon-caret-right:before {
      //   display: none;
      // }
    }
    .el-tree-node__content:hover {
      .buss {
        display: inline-block;
      }
    }
    .el-tree-node__children {
      overflow: unset;
    }
  }
  .dialog {
    height: 0;
  }
}
</style>
