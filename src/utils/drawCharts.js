  /** 绘制图表常用方法**/
  export default {
      props: {
      // 图表全局查询条件（来自父元素）
        conditionParams: {
          type: Object,
          default() {
            return {}
        }
      }
    },

      data() {
        return {
        // 自适应对象
          resizeFun: ''
      }
    },
      computed: {
      // 排行榜字体颜色设置
        rankColor() {
          return function(index) {
            let obj = {
              'color-red': false,
              'color-orange': false,
              'color-yellow': false
          }

          switch (index) {
          case 1:
              obj['color-red'] = true
              break;
          case 2:
              obj['color-orange'] = true
              break;
          case 3:
              obj['color-yellow'] = true
              break;
          }
            return obj
        }
      },

      // 进度条颜色设置
        progressColorMethod() {
          return function(index) {
            if (['重大', 0].indexOf(index) > -1) {
              return '#ff1244'
          } else if (['高', 1].indexOf(index) > -1) {
              return '#ff7902'
          } else if (['中', 2].indexOf(index) > -1) {
              return '#ffd200'
          } else {
              return '#269BE0'
          }
        }
      }
    },

      methods: {
      // 设置需要自适应的图表对象
        setResizeFun(chartObj) {
          this.resizeFun = function() {
            chartObj.resize()
        }
          this.resizeChart()
      },

      // 图表自适应
        resizeChart() {
          window.addEventListener('resize', this.resizeFun)
      },
      // 取消图表自适应
        removeResizeChart() {
          if (this.resizeFun) {
            window.removeEventListener('resize', this.resizeFun)
        }
      }

    },

      mounted() {},

      destroyed() {
        this.removeResizeChart()
    }

  }
