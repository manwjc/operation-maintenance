import aspDialog from './asp-dialog'
const components = [
  aspDialog
]
const install = (Vue) => {
  components.filter(v => typeof v !== 'function').forEach(v => Vue.component(v.name, v))
}
export default install
