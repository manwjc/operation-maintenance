<template>
  <el-dialog class="yw-dialog"
             width="1000px"
             title="评估得分明细"
             :show-close="false"
             :visible.sync="dialogMsg.dialogVisible"
             @close="closeDialog">
    <section class="yw-dialog-main">
      <el-table :data="tableData"
                class="yw-el-table"
                ref="assessmentTable"
                show-summary
                :summary-method="sumScore"
                sum-text="汇总"
                stripe
                border
                size="mini"
                style="width: 100%">
        <el-table-column prop="metricName"
                         label="指标名称"
                         align="center"
                         width="180">
        </el-table-column>
        <el-table-column prop="metricDescription"
                         label="指标描述"
                         align="center"
                         width="200">
        </el-table-column>
        <el-table-column prop="metricWeight"
                         label="指标权重"
                         align="center"
                         width="90">
        </el-table-column>
        <el-table-column prop="score"
                         label="得分(必填)"
                         align="center"
                         width="180">
          <template slot-scope="scope">
            <el-select
              :disabled="dialogMsg.page === 'approve-eval'"
              v-model="scope.row.score"
              style="width: 100%">
              <el-option v-for="(item,index) in scoreArray"
                         :key="index"
                         :lable="item"
                         :value="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="得分说明(必填)"
                         align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.scoreDescription"
                      type="textarea">
            </el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-collapse>
        <el-collapse-item title=" > 评分说明"
                          name="1">
          <img src="/static/img/cmdb/pinggu.png" />
        </el-collapse-item>
      </el-collapse>
    </section>
    <section class="btn-wrap">
      <el-button  v-if="dialogMsg.page !== 'approve-eval'"
                  type="primary"
                 @click="submit()">确定</el-button>
      <el-button size="mini"
                 @click="cancel()">取消</el-button>
    </section>
  </el-dialog>

</template>
<script>
import { metricBase } from './config/options.js'
export default {
  props: ['dialogMsg', 'sumScores'],
  data () {
    return {
      tableData: [],
      copySourceData: [],
      metricWeight: 5,
      scoreResult: null,
      scoreArray: [5, 4, 3, 2, 0],
    }
  },
  mounted: function () {
    this.initData()
  },
  methods: {
    // 初始化数据
    initData () {
      this.tableData = []
      this.tableData = this.dialogMsg.data.produceAssessment
      this.copySourceData = JSON.parse(JSON.stringify(this.dialogMsg.data.produceAssessment))
      if (this.tableData.length > 0) {
        this.tableData.forEach(item => {
          this.$set(item, 'deviceCountId', this.dialogMsg.data.id)
          this.$set(item, 'metricDescription', metricBase[item.metricName].metricDescription)
          this.$set(item, 'metricWeight', metricBase[item.metricName].metricWeight)
        })
      } else {
        for (let key in metricBase) {
          this.tableData.push({
            deviceCountId: this.dialogMsg.data.id,
            metricName: key,
            metricDescription: metricBase[key].metricDescription,
            metricWeight: metricBase[key].metricWeight          })
        }
      }
    },
    sumScore (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (column.label === '得分(必填)') {
            console.log(values)
            this.scoreResult = sums[index]
            this.$set(this.sumScores, data[0].deviceCountId, this.scoreResult)
          }
          sums[index] += ' 分';
        } else {
          // sums[index] = 'N/A';
        }
      })
      return sums;
    },
    closeDialog () {
      // this.dialogMsg.dialogVisible = false
      // this.dialogMsg.data.produceAssessment = this.tableData
    },
    //添加


    //确定
    submit () {
      try {
        this.dialogMsg.data.produceAssessment.forEach(item => {
          if (item.score !== 0 && !item.score) {
            throw new Error("有得分未填写请填写")
          }
        })
        this.$emit('closeDialog');
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    //取消
    cancel () {
      if (this.dialogMsg.page === 'approve-eval') {
        this.$emit('closeDialog');
        return false
      }
      this.dialogMsg.data.produceAssessment = JSON.parse(JSON.stringify(this.copySourceData))
      let sum = 0
      this.dialogMsg.data.produceAssessment.forEach(item => {
        if (item.score) {
          sum += item.score
        }
      })
      this.sumScores[this.dialogMsg.data.id] = sum
      this.$emit('closeDialog');
    }

  }
}

</script>
<style lang="scss" scoped>
</style>
