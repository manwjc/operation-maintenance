<template>
  <div>
    <section class="yw-dialog-main">
      <el-form class="yw-form" :inline="true" label-width="95px" :model="moniterForm">
        <el-form-item label="设备分类" prop="deviceClass">
          <el-select
            v-model="moniterForm.deviceClass"
            placeholder="选择设备分类"
            :disabled=true
            clearable
            class="input-tem-name1"
            style="width: 200px"
            @change="onDeviceClassChange"
          >
            <el-option
              :label="item"
              :value="item"
              v-for="(item, index) in deviceClassList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="yw-form" label="设备类型" prop="deviceType">
          <el-select
            :disabled=false
            v-model="moniterForm.deviceType"
            placeholder="选择设备类型"
            clearable
            class="input-tem-name1"
            style="width: 200px"
            @change="onDeviceTypeChange"
          >
            <el-option
              :label="item"
              :value="item"
              v-for="(item, index) in deviceTypeList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="yw-form" label="监控项" prop="moniter">
          <el-cascader
            v-model="moniterForm.moniter"
            :options="moniterList"
            clearable
            placeholder="监控逻辑/监控指标"
            class="input-tem-name1"
            style="width: 200px;line-height: 35px;"
            @change="onMoniterChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
    </section>
    <div class="table-wrap">
      <div class="table-wrap__left">
        <div class="table-wrap__header">
          <div class="search-wrap">
            <span class="search-wrap__title">监控指标数：{{ moniterForm.num }}</span>
            <el-input
              v-model.trim="searchText"
              placeholder="请输入监控项名称"
              class="search-wrap__input"
              @keyup.enter.native="search"
            >
              <i slot="prepend" class="el-icon-search" @click="search"></i>
            </el-input>
          </div>
        </div>
        <el-table
          class="table-wrap__table"
          :data="deviceTable"
          highlight-current-row
          height="calc(100vh - 430px)"
          @selection-change="onSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="key" label="监控项key"></el-table-column>
          <el-table-column prop="unit" label="单位">
            <template slot-scope="scope">
              {{moniterForm.unit}}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          class="table-wrap__pagination"
        ></el-pagination>
      </div>
      <div class="table-wrap__middle">
        <i class="el-icon-arrow-right" @click="moveItem"></i>
      </div>
      <div class="table-wrap__right">
        <div class="table-wrap__header"></div>
        <el-table
          class="table-wrap__table"
          :data="deviceSelection"
          highlight-current-row
          :empty-text="' '"
          height="calc(100vh - 430px)"
        >
          <el-table-column prop="key" label="监控项key"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <i
                class="el-icon-delete"
                style="font-size: 16px;color: #46BAFE;"
                @click="removeDeviceItem(scope.row)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import rbAlertRepPanelServicesFactory from 'src/services/alert/rb-alertRepPanel-services.factory.js'

  export default {
    name: 'chooseItem',
    props: ['deviceList', 'itemList'],
    watch: {
      itemList: {
        handler(newValue, oldValue) {
          // this.deviceList = this.dialogData.deviceList ? JSON.parse(this.dialogData.deviceList) : []
          this.deviceSelection = newValue
          this.$forceUpdate()
        },
        deep: true
      }
    },
    data() {
      return {
        monitorResMap: null,
        searchText: '',
        moniterList: [],
        deviceClassList: [],
        deviceTypeList: [],
        deviceTempTableList: [],
        deviceTableList: [],
        deviceTable: [],
        currentPage: 1, // 当前页
        pageSize: 50, // 分页每页多少行数据
        pageSizes: [10, 50, 100], // 每页多少行数组
        total: 0, // 总共多少行数据,
        deviceSelection: this.itemList,
        moniterForm: {
          num: 0,
          deviceClass: '', // 设备分类
          deviceType: '', // 设备类型
          moniter: [] // 监控项
        },
        item: {
          report_type: 'line',
          time_unit: 'minute',
          moniterItems: [],
          conversion_type: '2'
        }
      }
    },
    computed: {
      chlidItemList() {
        return this.deviceSelection
      }
    },
    mounted: function () {
      this.setTable()
      this.deviceTable = this.deviceTableList
      this.total = this.deviceTableList.length
      this.currentPage = 1 // 当前页
      this.pageSize = 50
      const ips = []
      this.deviceList.forEach(item => {
        ips.push(item.ip)
      })
      this.selectDeviceClassAndTypeAndItem()
    },
    methods: {
      search() {
        this.currentPage = 1
        const reg = new RegExp(this.searchText)
        this.deviceTempTableList = this.deviceTableList.filter(val => reg.test(val.key))
        this.getDeviceTable()
      },
      onSizeChange(val) {
        this.pageSize = val
        this.getDeviceTable()
      },
      // 分页改变当前页
      onCurrentChange(val) {
        this.currentPage = val
        this.getDeviceTable()
      },
      async selectDeviceClassAndTypeAndItem() {
        // 加载设备分类
        let parmas = {method: 'GET', url: '/v1/alerts/monitor/getDeviceClass'}
        let classRes = await this.rbHttp.sendRequest(parmas)
        this.deviceClassList = classRes
        this.moniterForm.deviceClass = this.deviceList[0].deviceClass || ''

        // 加载设备类型
        parmas = {
          method: 'GET',
          url: '/v1/alerts/monitor/getDeviceType',
          params: {deviceClass: this.moniterForm.deviceClass}
        }
        let typeRes = await this.rbHttp.sendRequest(parmas)
        this.deviceTypeList = typeRes
        if (this.deviceTypeList.indexOf(this.deviceList[0].deviceType) !== -1) {
          this.moniterForm.deviceType = this.deviceList[0].deviceType || ''
        }
        // 加载监控项
        parmas = {
          method: 'GET',
          url: '/v1/alerts/monitor/getSubMonitorList',
          params: {
            deviceClass: this.moniterForm.deviceClass,
            deviceType: this.moniterForm.deviceType
          }
        }
        let monitorRes = await this.rbHttp.sendRequest(parmas)
        if (!Object.keys(monitorRes).length) return
        this.monitorResMap = JSON.parse(JSON.stringify(monitorRes))
        this.moniterList = Object.keys(monitorRes)
          .map(val => {
            const items = monitorRes[val]
              .map(item => ({value: item.moniter_item_key, label: item.moniter_item_name}))
              .filter(item => item.value)
            return {value: val, label: val, children: items}
          })
          .filter(val => val.children.length)
      },
      // 勾选表格数据时
      onSelectionChange(selection) {
        this.selection = selection
      },
      // 移动已勾选的表格数据
      moveItem() {
        if ((this.deviceSelection.length + this.selection.length) > 50) {
          this.$message.warning('所选数据不能超过50条！')
          return
        }
        this.deviceSelection = this.deviceSelection.concat(this.selection)
        this.$emit('changeItemList', this.deviceSelection);
      },
      // 删除已选择的表格数据
      removeDeviceItem(row) {
        this.deviceSelection = this.deviceSelection.filter(val => val.key !== row.key)
        this.$emit('changeItemList', this.deviceSelection);
      },
      setTable() {
        this.deviceTable = []
        this.deviceTempTableList = []
        this.deviceTableList = []
      },
      async onDeviceClassChange(value) {
        this.deviceTypeList = []
        this.moniterForm.deviceType = ''
        this.moniterList = []
        this.moniterForm.moniter = []
        this.setTable();
        if (!value) return

        let params = {
          method: 'GET',
          url: '/v1/alerts/monitor/getDeviceType',
          params: {deviceClass: value}
        }
        let res = await this.rbHttp.sendRequest(params)
        this.moniterForm.deviceType = ''
        this.deviceTypeList = res
      },
      // 设备类型改变时，加载监控项
      async onDeviceTypeChange(value) {
        this.moniterForm.moniter = []
        this.moniterList = []
        this.setTable()
        if (!value) return false

        let params = {
          method: 'GET',
          url: '/v1/alerts/monitor/getSubMonitorList',
          params: {
            deviceClass: this.moniterForm.deviceClass,
            deviceType: value
          }
        }
        let res = await this.rbHttp.sendRequest(params)
        if (!Object.keys(res).length) return false
        this.monitorResMap = JSON.parse(JSON.stringify(res))
        this.moniterList = Object.keys(res)
          .map(val => {
            const items = res[val]
              .map(item => ({value: item.moniter_item_key, label: item.moniter_item_name}))
              .filter(item => item.value)
            return {value: val, label: val, children: items}
          })
          .filter(val => val.children.length)
      },
      // 监控项改变时，加载监控表格数据
      async onMoniterChange(value, flag = false) {
        const ips = []
        this.deviceList.forEach(item => {
          ips.push(item.ip)
        })
        if (!value || value.length === 0) return
        let data = {
          reType: 6,
          ip: ips,
          item: value[1],
          multiQuery: true
        }
        rbAlertRepPanelServicesFactory.getMonitorItemList(data).then((res) => {
          this.deviceTableList = []
          this.deviceTempTableList = []
          if (res && res.moniList !== undefined) {
            res.moniList.forEach(item => {
              let obj = {}
              obj.key = item.key
              obj.itemId = item.itemId
              this.deviceTableList.push(obj)
            })
          }
          //   let obj = {}
          //   obj.key = res.key
          //   obj.itemId = res.itemId
          //   this.deviceTableList.push(obj)
          let monitorItemName = this.getMonitorItemName(value)
          // this.deviceTableList = res.keys
          this.deviceTempTableList = this.deviceTempTableList.concat(this.deviceTableList)
          this.moniterForm.unit = res.units
          this.moniterForm.num = this.deviceTableList.length
          this.moniterForm.mointer_index = res.valueType
          this.moniterForm.monitorItemName = monitorItemName
          this.getDeviceTable()
        })

      },
      getMonitorItemName(monitor) {
        let val = ''
        let key = Object.keys(this.monitorResMap).find(m => {
          return m === monitor[0]
        })
        if (key) {
          let list = this.monitorResMap[key]
          let o = list.find(l => {
            return l.moniter_item_key === monitor[1]
          })
          if (o) {
            val = o.moniter_item_name
          }
        }
        return val
      },
      getDeviceTable() {
        this.total = this.deviceTempTableList.length
        let start = this.pageSize * (this.currentPage - 1)
        let end = start + this.pageSize
        end = end > this.total ? this.total : end
        this.deviceTable = this.deviceTempTableList.slice(start, end)
      }
    }
  }
</script>

<style scoped lang="scss">
  /deep/ .el-cascader__label {
    font-size: 12px;
  }

  .search-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 44px;
    line-height: 44px;
    padding: 0 20px;
    &__title {
      color: #333;
      font-size: 12px;
    }
    &__input {
      width: 260px;
      /deep/ {
        .el-input-group__prepend {
          padding: 0;
          padding-left: 15px;
          background: #fff;
        }
        .el-input__inner {
          border-left: none;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
  }

  // 选择监控项
  .table-wrap {
    display: flex;
    justify-content: center;
    border: 1px solid #e5e8ed;
    &__header {
      height: 44px;
      border-bottom: 1px solid #e5e8ed;
    }
    &__left {
      width: 480px;
    }
    &__middle {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      font-size: 20px;
      border-left: 1px solid #e5e8ed;
      border-right: 1px solid #e5e8ed;
    }
    &__right {
      width: 244px;
    }
    &__pagination {
      padding: 4px 20px;
    }
    &__table {
      font-size: 12px;
      /deep/ {
        .el-table th > .cell {
          color: #333;
        }
      }
    }
  }
</style>
