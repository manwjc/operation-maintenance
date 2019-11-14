// import rbProjectDataServiceFactory from 'src/services/resource/rb-resource-services.factory.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
const poolList1 = []
/* rbProjectDataServiceFactory.getResourcePool().then((res) => {
  res.formOptions.forEach(item => {
    poolList1.push(item)
  })
  // poolList1.splice(0, 0, ...res.formOptions)
}) */
let obj = {
  'type': 'idcType',
  'pid': ''
}
rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
  res.forEach(item => {
    poolList1.push(item)
  })
})
export const poolList = poolList1
