export default {
  // 通用查询条件
  data() {
    return {
      // 分页
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据

      staticCurrentPage: 1, //当前页(初始静态数据)
      staticPageSize: 50, //分页每页多少行数据(初始静态数据)

      //用户信息
      userInfo: {},

      //多关键字
      keys: [],
      activeKey: '',

      //资源池
      pool: '',

      //select下拉框
      SelectData: {
        //省份
        province: '',
        //用户
        person: '',
        //厂商
        produce: '',
        //设备类型
        deviceType: '',
        //年份
        year: '',
        //季度
        quarter: this.quarter
      },

      //日期限制
      pickerMinDate: '',
      //24小时内
      pickerOptions24: {
        shortcuts: [{
          text: '最近24小时',
          onClick(picker) {
            let now = new Date()
            picker.$emit('pick', [now.getTime() - 1000 * 60 * 60 * 24, now]);
          }
        }],
        onPick: ({
                   maxDate,
                   minDate
                 }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.pickerMinDate !== '') {
            const day30 = 1 * 24 * 3600 * 1000
            let maxTime = this.pickerMinDate + day30
            if (maxTime > new Date()) {
              maxTime = new Date()
            }
            return time.getTime() > maxTime
          }
          return time.getTime() > Date.now()
        }
      },

      //加载条
      loading: true
    }
  },
  methods: {
    /**查询
     * keepParams:是否要保持查询条件
     */
    query(keepParams) {

    },

    //多关键字
    changeKey(val) {
      this.keys = val;
    },
    //清空关键字
    cleanKey() {
      this.keys = [];
      this.activeKey = '';
    },
    getQuarter() {
      let today = new Date();
      let month = today.getMonth() + 1;//getMonth返回0-11
      let res = ''
      if (month >= 1 && month <= 3) {
        res = "第四季度"
      }
      if (month >= 4 && month <= 6) {
        res = "第一季度"
      }
      if (month >= 7 && month <= 9) {
        res = "第二季度"
      }
      if (month >= 10 && month <= 12) {
        res = "第三季度"
      }
      return res

    },

    /**文件导出
     * obj:{
     * data:数据源
     * fileType:文件类型,
     * fileName:文件名称
     * }
     */
    exportFiles(obj) {
      if (!obj) {
        return 0;
      }
      let blob = new Blob([obj.data], {
        type: obj.fileType
      })
      let objectUrl = window.URL.createObjectURL(blob)
      // window.location.href = objectUrl
      let downLoadElement = document.createElement('a')
      downLoadElement.href = objectUrl
      downLoadElement.download = obj.fileName
      document.body.appendChild(downLoadElement)

      downLoadElement.click()
      document.body.removeChild(downLoadElement)
      URL.revokeObjectURL(objectUrl)
    },

    //筛选资源池
    changePool(val) {
      this.pool = val;
    },
    //清空资源池
    cleanPool(val) {
      this.pool = '';
    },

    /**筛选下拉框
     * @param {*} parentVal:待改变的对象
     * @param {*} val:选中的数据
     */
    changeSelect(parentVal, val) {

      if (!val) {
        return;
      }

      if (typeof val[0] === 'object') { //对象
        this.$set(parentVal.obj, parentVal.key, val[0].name);

      } else {
        this.$set(parentVal.obj, parentVal.key, val[0]);
      }

      if (parentVal.key === 'person') {
        this.$set(parentVal.obj, 'mobile', val[0].mobile);
      }

    },

    //用户信息
    queryUser() {
      let userName = sessionStorage.getItem('username');

      return this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/user/findByLdapId/{ldap_id}`,
        params: {
          ldapId: userName
        },
      }).then((res) => {
        this.userInfo = res;
        this.$set(this.SelectData, 'person', this.userInfo.name);
        this.$set(this.SelectData, 'mobile', this.userInfo.mobile);
        this.$set(this.SelectData, 'province', this.userInfo['dept_id']);
        sessionStorage.setItem('userInfo', this.userInfo['dept_id']);
        return res;
      })
    },

    //提示框
    confirmMsg(val) {
      this.$confirm(val.tip, '提示', {
        confirmButtonText: val.confirm ? val.confirm : '确定',
        cancelButtonText: val.cancel ? val.cancel : '取消',
        type: val.type ? val.type : 'warning',
      }).then(() => {

      })
    },

    //第一页
    initPageChange() {
      this.currentPage = 1;
      return this.currentPage;
    },

    //每页展示条数
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      // console.log(`每页数据条数： ${this.currentPage} `);
      this.query(true);
    },
    //当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      // console.log(`当前页: ${this.pageSize}`);
      this.query(true);
    },

  },


}
