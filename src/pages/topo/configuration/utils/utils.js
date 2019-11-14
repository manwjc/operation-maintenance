export const returnViewTypeClass = (list, type) => {
  return list.filter(item => {
    return (Number(type) - Number(item.id)) < 1000 && (Number(type) - Number(item.id)) >= 0
  })
}
