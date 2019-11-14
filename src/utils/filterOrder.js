export default {
  /***工单筛选流程 */

  data() {
    return {
      //工单数据
      dataFilterList: [],
      //能否筛选
      detailFlag: false
    }
  },
  methods: {
    //工单行数据
    getRowObj() {
      let row = {}
      let col = []
      let obj = {}
      obj.id = 1
      obj.selectedVal = ''
      let obj1 = {}
      obj1.operations = []
      obj1.selectedVal = ''
      obj1.id = 2
      let obj2 = {}
      obj2.selectedVal = ''
      obj2.id = 3
      obj2.multipleFlag = false
      obj2.multipleVal = []
      obj2.sources = []
      obj2.multipleSources = []
      obj2.type = 'select'
      col.push(obj)
      col.push(obj1)
      col.push(obj2)
      row.colList = col
      return row
    },
    //工单块数据
    getFilterObj() {
      let filter = {}
      let rowList = []
      rowList.push(this.getRowObj())
      filter.rowList = rowList
      return filter
    },
    //工单筛选
    changeFilterOrder(val) {
      // this[val.functionName](val.datas)
      this.dataFilterList = val.datas
    },
    //添加工单块
    addFilterOR() {
      this.dataFilterList.push(this.getFilterObj());
      this.$emit('changeFilterOrder', {
        functionName: 'addFilterOR'
      });
    },
    //删除工单行
    deleteRow(val) {
      let data = val.data;
      let index = val.index

      this.dataFilterList[data].rowList.splice(index, 1)
      if (index === 0) {
        this.dataFilterList.splice(data, 1)
      }

    },

    //添加工单行
    addRow(val) {
      let data = val.data;
      this.dataFilterList[data].rowList.push(this.getRowObj());
    },

  },


}
