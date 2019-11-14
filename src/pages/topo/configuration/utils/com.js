let testApi = {}

testApi.productAutoList = (dataList) => {
  let voltageList = [] // 变压器设备数组
  let cabinetList = [] // 出线柜设备数组
  let upsList = [] // ups设备数组
  let deviceList = [] // device设备数组
  let lineList = [] // 连线数组
  // 启始ID
  let voltageIndex = 10000 // 变压器启始ID
  let cabinetIndex = 20000 // 出线柜启始ID
  let upsIndex = 30000 // ups启始ID
  let deviceIndex = 40000

  for (let i = 0; i < dataList.length; i++) {
    const voltageStr = dataList[i].num2
    let startIndex = voltageStr.indexOf('主路：')
    let endIndex = voltageStr.indexOf('备路：')
    let minIndex = voltageStr.indexOf('出线柜：')
    let mainVoltage = voltageStr.slice(startIndex, minIndex)
    let mainCabinet = voltageStr.slice(minIndex, endIndex)
    let tmpStr = voltageStr.substr(endIndex)
    minIndex = tmpStr.indexOf('出线柜：')
    let nextVoltage = tmpStr.slice(0, minIndex)
    let nextCabinet = tmpStr.substr(minIndex)
    // 主路变压器
    let mianVBool = false
    let mainVIndex = voltageIndex
    if (voltageList.length > 0) {
      for (let item in voltageList) {
        if (voltageList[item].name === mainVoltage) {
          mianVBool = true
          mainVIndex = voltageList[item].index
          break
        }
      }
      if (!mianVBool) {
        mainVIndex = voltageList[voltageList.length - 1].index + 1
        let voltageJson = {
          name: mainVoltage,
          index: mainVIndex
        }
        voltageList.push(voltageJson)
      }
    } else {
      let voltageJson = {
        name: mainVoltage,
        index: mainVIndex
      }
      voltageList.push(voltageJson)
    }
    // 主路出线柜
    let mainCBool = false
    let mainCIndex = cabinetIndex
    if (cabinetList.length > 0) {
      for (let item in cabinetList) {
        if (cabinetList[item].name === mainCabinet) {
          mainCBool = true
          mainCIndex = cabinetList[item].index
          break
        }
      }
      if (!mainCBool) {
        mainCIndex = cabinetList[cabinetList.length - 1].index + 1
        let cabinetJson = {
          name: mainCabinet,
          index: mainCIndex
        }
        cabinetList.push(cabinetJson)
      }
    } else {
      let cabinetJson = {
        name: mainCabinet,
        index: mainCIndex
      }
      cabinetList.push(cabinetJson)
    }
    // 主路变压器与主路出线柜的线
    if ((!mianVBool) || (!mainCBool)) {
      let lineJson = {
        to: mainVIndex,
        from: mainCIndex
      }
      lineList.push(lineJson)
    }
    // 备路变压器
    let nextVBool = false
    let nextVIndex = voltageIndex
    if (voltageList.length > 0) {
      for (let item in voltageList) {
        if (voltageList[item].name === nextVoltage) {
          nextVBool = true
          nextVIndex = voltageList[item].index
          break
        }
      }
      if (!nextVBool) {
        nextVIndex = voltageList[voltageList.length - 1].index + 1
        let voltageJson = {
          name: nextVoltage,
          index: nextVIndex
        }
        voltageList.push(voltageJson)
      }
    } else {
      let voltageJson = {
        name: nextVoltage,
        index: nextVIndex
      }
      voltageList.push(voltageJson)
    }
    // 备路出线柜
    let nextCBool = false
    let nextCIndex = cabinetIndex
    if (cabinetList.length > 0) {
      for (let item in cabinetList) {
        if (cabinetList[item].name === nextCabinet) {
          nextCBool = true
          nextCIndex = cabinetList[item].index
          break
        }
      }
      if (!nextCBool) {
        nextCIndex = cabinetList[cabinetList.length - 1].index + 1
        let cabinetJson = {
          name: nextCabinet,
          index: nextCIndex
        }
        cabinetList.push(cabinetJson)
      }
    } else {
      let cabinetJson = {
        name: nextCabinet,
        index: nextCIndex
      }
      cabinetList.push(cabinetJson)
    }
    // 备路变压器与备路出线柜的线
    if ((!nextVBool) || (!nextCBool)) {
      let lineJson = {
        to: nextVIndex,
        from: nextCIndex
      }
      lineList.push(lineJson)
    }
    // ups设备
    const upsName = dataList[i].num1
    let upsBool = false
    if (upsList.length > 0) {
      for (let item in upsList) {
        if (upsList[item].name === upsName) {
          upsBool = true
          upsIndex = upsList[item].index
          break
        }
      }
      if (!upsBool) {
        upsIndex = upsList[upsList.length - 1].index + 1
        let upsJson = {
          name: upsName,
          index: upsIndex
        }
        upsList.push(upsJson)
      }
    } else {
      let upsJson = {
        name: upsName,
        index: upsIndex
      }
      upsList.push(upsJson)
    }
    // 主路出线柜与ups的线
    if ((!mainCBool) || (!upsBool)) {
      let lineJson = {
        to: mainCIndex,
        from: upsIndex
      }
      lineList.push(lineJson)
    }
    // 备路出线柜与ups的线
    if ((!nextCBool) || (!upsBool)) {
      let lineJson = {
        to: nextCIndex,
        from: upsIndex
      }
      lineList.push(lineJson)
    }
    // 业务机房设备
    const deviceName = dataList[i].num3
    let deviceBool = false
    if (deviceList.length > 0) {
      for (let item in deviceList) {
        if (deviceList[item].name === deviceName) {
          deviceBool = true
          deviceIndex = deviceList[item].index
          break
        }
      }
      if (!deviceBool) {
        deviceIndex = deviceList[deviceList.length - 1].index + 1
        let deviceJson = {
          name: deviceName,
          index: deviceIndex
        }
        deviceList.push(deviceJson)
      }
    } else {
      let deviceJson = {
        name: deviceName,
        index: deviceIndex
      }
      deviceList.push(deviceJson)
    }
    // ups和业务机房连线
    if ((!upsBool) || (!deviceBool)) {
      let lineJson = {
        to: upsIndex,
        from: deviceIndex
      }
      lineList.push(lineJson)
    }
  }
  return {
    voltageList: voltageList,
    cabinetList: cabinetList,
    upsList: upsList,
    deviceList: deviceList,
    lineList: lineList
  }
}

export default testApi
