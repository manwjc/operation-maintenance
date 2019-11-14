import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'

const equipType1 = []
const room1 = []
// rbProjectDataServiceFactory.deivceSelectConditionList().then((res) => {
//   res.listModule.forEach((obj) => {
//     let arr = []
//     obj.item.forEach((item) => {
//       let obj2 = {
//         value: item.id,
//         label: item.name
//       }
//       arr.push(obj2)
//     })
//     let obj1 = {
//       value: obj.id,
//       label: obj.name,
//       children: arr
//     }
//     equipType1.push(obj1)
//   })

//   res.listRoom.forEach((obj) => {
//     room1.push(obj)
//   })
// })

/* rbProjectDataServiceFactory.getRoomList().then((res) => {
  if (res) {
    room1.splice(0, 0, ...res)
  }
}) */
rbProjectDataServiceFactory.getConfigDictByType({'type': 'roomId', 'pid': ''}).then((res) => {
  if (res) {
    room1.splice(0, 0, ...res)
  }
})

rbProjectDataServiceFactory.getModuleTree().then((res) => {
  res.forEach((obj) => {
    let arr = []
    obj.item.forEach((item) => {
      let obj2 = {
        value: item.id,
        label: item.name
      }
      arr.push(obj2)
    })
    let obj1 = {
      value: obj.id,
      label: obj.name,
      children: arr
    }
    equipType1.push(obj1)
  })
})

let yue = []
for (let i = 1; i <= 31; i++) {
  yue.push(`${i}号`)
}

export const task_type = ['全部', '手动', '自动']

export const task_type1 = ['手动', '自动']

export const cycle_type = ['分钟', '小时', '月', '周', '日', '自定义']

export const zhou_type = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export const yue_type = yue

export const equipType = equipType1

export const room = room1
