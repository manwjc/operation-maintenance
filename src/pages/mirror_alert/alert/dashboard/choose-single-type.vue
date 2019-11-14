<template>
  <div class="choose-wrap">
    <div class="clearfix">
      <!-- 结果 -->
      <section class="search-right fl">
        <div class="yw-el-table-wrap">
          <el-table class="yw-el-table"
                    height="290"
                    highlight-current-row
                    ref="singleTable"
                    :data="result"
                    @row-click="choose"
                    style="width: 100%">
            <el-table-column label="设备类型"
                             align="left">
              <template slot-scope="scope">
                {{ scope.row.value }}
              </template>
            </el-table-column>
              <el-table-column label="设备分类"
                               align="left">
                  <template slot-scope="scope">
                      {{ scope.row.device_class }}
                  </template>
              </el-table-column>
          </el-table>
        </div>
      </section>
      <!-- 结果 -->
    </div>

    <!-- 按钮 -->
    <section class="btn-wrap">
      <el-button type="primary"
                 size="small"
                 @click="submit()">确定</el-button>
      <el-button size="small"
                 @click="cancel()">取消</el-button>
    </section>
    <!-- 按钮 -->
  </div>

</template>
<script>
import QueryObject from 'src/utils/queryObject.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'

export default {
  props: ['currentType', 'dialogMsg'],
  mixins: [QueryObject],

  data () {
    return {
      //结果
      result: []

    }
  },
  mounted () {
    this.query();
  },
  methods: {
    //查询数据
    query () {
      let sql = 'select d.dict_code `value`, c.dict_code `device_class` ' +
        'from t_cfg_dict d, t_cfg_dict  c where d.col_name= \'device_type\'  and d.up_dict = c.dict_id'
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/module/queryTableData`,
        data: {
          sql: sql
        }
      }).then((res) => {
        if (res) {
          this.result = res
          if (this.dialogMsg.data.type) {
            let val = this.dialogMsg.data.rs
            let row = this.result.find(function (r) {
              return r.value === val
            })
            this.$refs.singleTable.setCurrentRow(row);
          }
        }
      })
    },

    //确认
    submit () {
      //你自己的操作
      let obj = {
        mulFlag: false,
        result: this.submitResult,
        type: this.currentType.id,
        typeList: this.result
      }
      this.$emit('setData', obj);
    },

    //取消
    cancel () {
      this.$emit('closeDialog');
    },

    //选择
    choose (val) {
      this.submitResult = val;
      this.$refs.singleTable.setCurrentRow(val);
    },

  }
}

</script>
<style lang="scss" scoped>
.btn-wrap {
  margin-top: 20px;
}
.choose-wrap {
  display: inline-block;
}
.search-right {
  width: 304px;
}

.yw-el-table-wrap {
  border: 1px solid rgba(220, 223, 230, 1);
  border-radius: 8px;
  height: 300px;
  padding: 2px;
  /deep/ .el-table__row {
    cursor: pointer;
  }
}
</style>
