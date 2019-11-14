<template>
  <div class="choose-wrap">
    <section>
      <YwSelectResource :pool="pool"
                        placeholder="请选择资源池"
                        style="width:140px;"
                        @changePool="changePool"
                        @cleanPool="cleanPool"></YwSelectResource>
      <!-- 搜索框 -->
      <section class="yw-search-wrap">
        <YwSearch :searchParams="searchParams" style="width:140px;"
                  @changeSearch="changeSearch"></YwSearch>
      </section>

        <el-select v-model="deviceClass"
                   style="width:140px;"
                   placeholder="请选择设备分类"
                   clearable
                   @change="query(false)">
            <el-option :label="p.name"
                       :value="p.value"
                       v-for="(p, index) in classArray"
                       :key="index"></el-option>
        </el-select>
        <el-select v-model="deviceType"
                   style="width:140px;"
                   placeholder="请选择设备类型"
                   clearable
                   filterable
                   @change="query(false)">
            <el-option :label="p.name"
                       :value="p.value"
                       v-for="(p, index) in typeArray"
                       :key="index"></el-option>
        </el-select>
      <!-- 搜索框 -->

    </section>
    <div class="clearfix">

      <!-- 结果 -->
      <section class="search-right fl">

        <div class="yw-el-table-wrap">
          <el-table class="yw-el-table"
                    height="290"
                    :data="result"
                    @selection-change="changeCheckbox"
                    style="width: 100%">
            <el-table-column type="selection"
                             width="30">
            </el-table-column>
            <el-table-column label="资源池"
                             width="80"
                             align="left">
              <template slot-scope="scope">
                {{ scope.row.idcType }}
              </template>
            </el-table-column>
            <el-table-column label="设备分类"
                             width="80"
                             align="left">
              <template slot-scope="scope">
                {{ scope.row.deviceClass }}
              </template>
            </el-table-column>
              <el-table-column label="设备类型"
                               width="80"
                               align="left">
                  <template slot-scope="scope">
                      {{ scope.row.deviceType }}
                  </template>
              </el-table-column>
            <el-table-column label="设备IP"
                             align="left">
              <template slot-scope="scope">
                {{ scope.row.ip }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <YwPagination @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="pageSizes"
                      :page-size="pageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="total"></YwPagination>

      </section>
      <!-- 结果 -->

      <section class="search-arrow fl"
               @click="add()">
        <i class="el-icon-right"></i>
      </section>

      <!-- 确认结果 -->
      <section class="search-right  search-result fl">
        <div class="yw-el-table-wrap">
          <el-table class="yw-el-table"
                    height="290"
                    :data="submitResult"
                    style="width: 100%">
            <el-table-column label="资源池"
                             width="80"
                             align="left">
              <template slot-scope="scope">
                {{ scope.row.idcType }}
              </template>
            </el-table-column>
            <el-table-column label="设备分类"
                             width="80"
                             align="left">
              <template slot-scope="scope">
                {{ scope.row.deviceClass }}
              </template>
            </el-table-column>
              <el-table-column label="设备类型"
                               width="80"
                               align="left">
                  <template slot-scope="scope">
                      {{ scope.row.deviceType }}
                  </template>
              </el-table-column>
            <el-table-column label="设备IP"
                             align="left">
              <template slot-scope="scope">
                {{ scope.row.ip }}
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             align="left"
                             width="50">
              <template slot-scope="scope">
                <a class="yw-table-link"
                   @click="del(scope.row,scope.$index)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </section>
      <!-- 确认结果 -->
    </div>

    <!-- 按钮 -->
    <!--<section class="btn-wrap">-->
      <!--<el-button type="primary"-->
                 <!--size="small"-->
                 <!--@click="submit()">确定</el-button>-->
      <!--<el-button size="small"-->
                 <!--@click="cancel()">取消</el-button>-->
    <!--</section>-->
    <!-- 按钮 -->
  </div>

</template>
<script>
import rbAlertRepPanelServicesFactory from 'src/services/alert/rb-alertRepPanel-services.factory.js'
import QueryObject from 'src/utils/queryObject.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'

export default {
  props: ['deviceList'],
  mixins: [QueryObject],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    YwSelectResource: () => import('src/components/common/yw-select-resource.vue'),
    YwSearch: () => import('src/components/common/yw-search.vue'),
  },
  computed: {
    chlidDeaviveList () {
      return this.submitResult
    }
  },
  watch: {
    deviceList: {
      handler(newValue, oldValue) {
        // this.deviceList = this.dialogData.deviceList ? JSON.parse(this.dialogData.deviceList) : []
        this.submitResult = newValue
        this.$forceUpdate()
      },
      deep: true
    }
  },
  data () {
    return {
      //搜索框参数
      searchParams: {
        keyword: '',
        desc: {
          placeholder: '设备IP',
          bgcolor: ''
        }
      },

      //查询参数
      queryParams: {

      },
      deviceClass:'',
      deviceType:'',
      classArray: [],
      typeArray: [],
      //结果
      result: [],
      addResult: [],//临时数据
      submitResult: this.deviceList
    }
  },
  mounted () {
    this.initial()
    this.query()
  },
  methods: {
    //设置参数
    setParams (activePagination) {
      if (activePagination) {
        this.queryParams['pageNo'] = this.currentPage;
        this.queryParams['pageSize'] = this.pageSize;
      } else {
        this.queryParams = {
          'ip': this.searchParams.keyword,
          'idcType': this.pool,
          'pageNo': this.initPageChange(),
          'pageSize': this.pageSize,
          'deviceType':this.deviceType,
          'deviceClass':this.deviceClass
        }
      }

    },
    initial () {
      let obj = {
        'type': 'device_class',
        'pid': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.classArray = res
        }
      })
      let obj1 = {
        'type': 'device_type',
        'pid': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj1).then((res) => {
        if (res) {
          this.typeArray = res
        }
      })
    },

    //查询数据
    query (activePagination = false) {
      this.setParams(activePagination);

      rbAlertRepPanelServicesFactory.getIP(this.queryParams).then((res) => {
        this.result = res.result;
        this.total = res.count;
      })
    },

    //删除
    del (row, index) {
      this.submitResult.splice(index, 1);
      this.$emit('changeDeviceList', this.submitResult);
    },

    //确认
    submit () {
      let obj = {
        mulFlag: true,
        result: this.submitResult,
        type: this.currentType.id
      }
      this.$emit('setData', obj);
    },

    //取消
    cancel () {
      this.$emit('closeDialog');
    },

    //checkbox
    changeCheckbox (val) {
      this.addResult = val;
    },

    //添加
    add () {
      if ((this.submitResult.length + this.addResult.length) > 1) {
        this.$message.warning('暂只能选择一条设备！')
        return
      }
      if(this.addResult.length === 0) {
        return
      }
      let temp = this.submitResult.concat(this.addResult);
      let flag = this.checkData(temp)
      if(!flag){
        return
      }
      this.submitResult = this.submitResult.concat(this.addResult);
      this.$emit('changeDeviceList', this.submitResult);
    },
    checkData(temp){
      let deviceClass = temp[0].deviceClass
      let deviceType = temp[0].deviceType
      for(let i=1; i<temp.length; i++){
        if(deviceClass !=temp[i].deviceClass || deviceType !=temp[i].deviceType){
          this.$message.warning('请选择设备分类和设备类型一致的ip设备')
          return false
        }
      }
      return true
    },
    //筛选资源池
    changePool (val) {
      this.pool = val;
      this.query();
    },

    //搜索框查询
    changeSearch (val) {
      this.searchParams.keyword = val;
      this.query();
    },

  }
}

</script>
<style lang="scss" scoped>
.choose-wrap {
  display: inline-block;
}
.search-right {
  width: 364px;
  &.search-result {
    // margin-top: 30px;
  }
}
.search-arrow {
  width: 30px;
  height: 30px;
  border: 1px solid rgb(83, 96, 128);
  border-radius: 50%;
  margin: 170px 15px 0 15px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  .el-icon-right {
    font-size: 18px;
  }
  &:hover {
    border: 1px solid #46bafe;
    .el-icon-right {
      color: #46bafe;
    }
  }
}

.yw-el-table-wrap {
  border: 1px solid rgba(220, 223, 230, 1);
  border-radius: 8px;
  margin-top: 15px;
  height: 300px;
  padding: 2px;
}

.yw-search-wrap {
  display: inline-block;
}
</style>
