<template>
  <el-dialog title="关联人"
             :visible="visible"
             @close="handleClose"
             :modal="modal"
             :modal-append-to-body="false"
             width="500px"
             class="yw-dialog">
    <section class="yw-dialog-main">
      <el-input class="yw-search-box"
                v-model="dialogSearch"
                placeholder="请输入查询内容"
                suffix-icon="el-icon-search"></el-input>
      <el-table class="yw-el-table"
                stripe
                tooltip-effect="dark"
                border
                height="300px"
                :data="dialogList.filter(searchFilter)"
                highlight-current-row
                @current-change="handleCurrentChange">
        <el-table-column prop="name"
                         label="用户名称">
        </el-table-column>
        <el-table-column prop="dept_id"
                         :formatter="formatter"
                         label="部门">
        </el-table-column>
        <el-table-column prop="mobile"
                         label="手机号"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="no"
                         label="工号">
        </el-table-column>
      </el-table>
    </section>
    <section class="btn-wrap">
      <el-button type="primary"
                 @click="handleConfirm">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </section>

    <!-- <el-input v-model="dialogSearch"
              placeholder="请输入查询内容"
              suffix-icon="el-icon-search"></el-input>
    <el-table class="mod-table"
              :data="dialogList.filter(searchFilter)"
              style="width: 100%;overflow-y:auto"
              highlight-current-row
              @current-change="handleCurrentChange">
      <el-table-column prop="name"
                       label="用户名称">
      </el-table-column>
      <el-table-column prop="dept_id"
                       label="部门">
      </el-table-column>
      <el-table-column prop="mobile"
                       label="手机号"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="no"
                       label="工号">
      </el-table-column>
    </el-table>
    <span slot="footer"
          class="acc-manage dialog-footer">
      <el-button class="mod-btn"
                 type="primary"
                 @click="handleConfirm">确 定</el-button>
      <el-button class="mod-btn"
                 @click="handleClose">取 消</el-button>
    </span> -->
  </el-dialog>
</template>
<script>
import personDataService from 'src/services/sys/person-services.js'

export default {
  data () {
    return {
      dialogSearch: '',
      dialogList: [],
      currentRow: null
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    dialogStyle: {
      type: Object
    },
    departDictionary: {
      type: Object,
      default: null
    },
    userType: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean,
      default: false
    },
    isNull: {
      type: String,
      default: ''
    }
  },
  watch: {
    visible (val) {
      this.setBodyHideScroll(val)
    },
    departDictionary (val) {
      // console.log('watch dictionary', val)
      this.refreshTableDictionary(val)
    }
  },
  methods: {
    formatter(row, column) {
      return row.dept_list.name
    },
    // 关闭弹窗
    handleClose () {
      this.$emit('dialog-close')
    },
    // 确认
    handleConfirm () {
      this.$emit('dialog-confirm', this.currentRow)
    },
    // 选中列
    handleCurrentChange (val) {
      this.currentRow = val
    },
    // 搜索过滤
    searchFilter (data) {
      return !this.dialogSearch || data.name.toLowerCase().includes(this.dialogSearch.toLowerCase())
    },
    refreshTableDictionary (dictionary) {
      if (dictionary && Object.keys(dictionary).length > 0) {
        if (this.dialogList && this.dialogList.length > 0) {
          this.dialogList.map((item) => {
          })
        }
      }
    },
    getPersionList () {
      // alert(this.isNull)
      personDataService.getPersonListAll(this.userType, this.isNull).then((res) => {
        if (res) {
          this.dialogList = res
          if (this.departDictionary) {
            this.refreshTableDictionary(this.departDictionary)
          }
        }
      })
    },
    // 是否去掉滚动条
    setBodyHideScroll (flag) {
      const dom = document.querySelector('.right-body')
      dom.style.overflow = flag ? 'hidden' : 'auto'
    }
  },
  mounted () {
    this.getPersionList()
  }
}
</script>
<style lang="scss" scoped>
</style>
