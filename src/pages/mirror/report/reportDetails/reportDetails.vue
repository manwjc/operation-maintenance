<template>
  <div class="component-container">
    <header>
      <div class="head">
        <!-- <div class="report-details-tit">导出</div> -->
        <div class="head-left">
          <div class="left-name"><span ref="name"></span>  巡检任务巡检报表</div>
        </div>
        <div class="head-right">
          <div class="creat-time" ref="time">结束时间：</div>
          <el-select v-model="exportTable" placeholder="请选择" class="list-sel">
              <el-option label="EXCEL" value="EXCEL"></el-option>
              <el-option label="PDF" value="PDF"></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-upload" class="report-details-tit" @click="exp">导出</el-button>
        </div>
      </div>
    </header>

    <div class="body-container">
      <div class="body-tit">巡检结果异常信息</div>
      <el-table
          :data="tableData"
          border
          style="width: 100%;"
          @selection-change="handleSelectionChange">
          <el-table-column
            prop="name"
            label="名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="设备IP"
            align="center">
          </el-table-column>
          <el-table-column
            prop="device_type"
            label="设备大类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="device_sub_type"
            label="设备小类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="访问状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="item_name"
            label="巡检项"
            align="center">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="数据单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="expression"
            label="阀值/关键字"
            align="center">
          </el-table-column>
          <el-table-column
            prop="value"
            label="巡检值"
            align="center">
          </el-table-column>
          <el-table-column
            prop="pre_value"
            label="最近巡检值"
            align="center">
          </el-table-column>
      </el-table>
    </div>

    <div class="body-container">
      <div class="body-tit">巡检项无结果信息</div>
      <el-table
          :data="tableData1"
          border
          style="width: 100%;"
          @selection-change="handleSelectionChange">
          <el-table-column
            prop="name"
            label="名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="设备IP"
            align="center">
          </el-table-column>
          <el-table-column
            prop="device_type"
            label="设备大类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="device_sub_type"
            label="设备小类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="访问状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="item_name"
            label="巡检项"
            align="center">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="数据单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="expression"
            label="阀值/关键字"
            align="center">
          </el-table-column>
          <el-table-column
            prop="value"
            label="巡检值"
            align="center">
          </el-table-column>
          <el-table-column
            prop="pre_value"
            label="最近巡检值"
            align="center">
          </el-table-column>
      </el-table>
    </div>

    <div class="body-container">
      <div class="body-tit">巡检结果正常信息</div>
      <el-table
          :data="tableData2"
          border
          style="width: 100%;"
          @selection-change="handleSelectionChange">
          <el-table-column
            prop="name"
            label="名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="设备IP"
            align="center">
          </el-table-column>
          <el-table-column
            prop="device_type"
            label="设备大类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="device_sub_type"
            label="设备小类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="访问状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="item_name"
            label="巡检项"
            align="center">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="数据单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="expression"
            label="阀值/关键字"
            align="center">
          </el-table-column>
          <el-table-column
            prop="value"
            label="巡检值"
            align="center">
          </el-table-column>
          <el-table-column
            prop="pre_value"
            label="最近巡检值"
            align="center">
          </el-table-column>
      </el-table>
    </div>
  <!-- <form id="frmHostInfo" name="frmHostInfo" method="post"  fit="true"></form> -->
  </div>
</template>

<script>
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
  import {formatDate} from 'src/assets/js/utility/rb-filters.js'
  export default {
    data () {
      return {
        obj: {},
        exportTable: '',
        // 多选框模板存放的值
        multipleSelection: [],
        tableData: [],
        tableData1: [],
        tableData2: []
      }
    },
    methods: {
      // 多选框
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 数据来源
      getTableData () {
        let str = Object.assign(this.$store.state.homeStore.report_id, {})
        rbProjectDataServiceFactory.getReportDetail(str).then((res) => {
          this.$refs.time.innerHTML = `结束时间：${formatDate(res.finish_time)}`
          this.$refs.name.innerHTML = res.name
          if (res.exception) {
            this.tableData = res.exception
            this.tableData.status = rbMirrorCommonService.getTaskStatus(this.tableData.status)
          }
          if (res.noResult) {
            this.tableData1 = res.noResult
            this.tableData1.status = rbMirrorCommonService.getTaskStatus(this.tableData1.status)
          }
          if (res.normal) {
            this.tableData2 = res.normal
            this.tableData2.status = rbMirrorCommonService.getTaskStatus(this.tableData2.status)
          }
        })
      },
      exp () {
        if (this.exportTable === '') {
          this.$alert('请先选择一个导出格式如EXCEL', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          let id = this.$store.state.homeStore.report_id
          let arr = [this.exportTable, id]
          rbProjectDataServiceFactory.exportResultTable(arr).then((res) => {
            if (this.exportTable === 'EXCEL') {
              let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
              let objectUrl = URL.createObjectURL(blob)
              // window.location.href = objectUrl
              let downLoadElement = document.createElement('a')
              downLoadElement.href = objectUrl
              downLoadElement.download = '报表.xls'
              document.body.appendChild(downLoadElement)
              downLoadElement.click()
              document.body.removeChild(downLoadElement)
              URL.revokeObjectURL(objectUrl)
            } else {
              let blob = new Blob([res], {type: 'application/pdf'})
              // 创建下载链接
              let objectUrl = URL.createObjectURL(blob)
              // window.location.href = objectUrl
              let downLoadElement = document.createElement('a')
              downLoadElement.href = objectUrl
              downLoadElement.download = '报表.pdf'
              document.body.appendChild(downLoadElement)
              downLoadElement.click()
              document.body.removeChild(downLoadElement)
              URL.revokeObjectURL(objectUrl)
            }
          })
        }
      }
    },
    mounted () {
      this.getTableData()
    }
}
</script>

<style lang="scss" scoped>
  .component-container{
      header{
        height:60px;
        border:2px solid #f0f0f0;
        display:flex;
        align-items:center;
        flex-wrap:wrap;
        .head{
          width:100%;
          position: relative;
          display:flex;
          align-items:center;
          position: relative;
          div{
            display:inline-block;
          }
          .head-right{
            position: absolute;
            right:10px;
            display: flex;
            align-items: center;
            .report-details-tit{
              margin-left:20px;
              height:40px;
            }
            .el-select{
              width:100px;
              margin-left:20px;
              /deep/ .el-input .el-input__inner {
                height:40px !important;
              }
            }
            .creat-time{
              margin-left:20px;
              font-weight:bold;
            }
          }
          .head-left{
            position: absolute;
            left:10px;
            div.left-name{
              font-weight:bold;
            }
          }
        }
      }
      .body-container{
        .body-tit{
          height:40px;
          line-height:40px;
          font-weight:bold;
        }
        border:2px solid #f0f0f0;
        margin-top:10px;
        padding:0 10px 5px 10px;
      }
  }
</style>
