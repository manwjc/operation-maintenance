// 主题换肤
export default {
  data() {
    return {
      theme: 'light'
    }
  },
  methods: {
    //加载主题
    loadTheme() {
      this.theme = 'dark';
      require(`src/assets/theme/${this.theme}/theme.scss`);
    }
  },
  created() {
    this.loadTheme();
  }


}
