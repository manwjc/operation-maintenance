  // 动态组件
  export default {
    data() {
      return {
        resetComponent: true, // 是否重置组件
      }
    },
    methods: {
      //更新
      updateComponent() {
        this.resetComponent = false;
        this.$nextTick(() => {
          this.resetComponent = true
        })
      }
    },


  }
