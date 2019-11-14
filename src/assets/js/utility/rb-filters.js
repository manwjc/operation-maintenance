import moment from 'moment'
import marked from 'marked'
import parser from 'cron-parser' //  https://github.com/harrisiirak/cron-parser
import CN from 'src/assets/js/constant/rb_zh_cn.i18n.constant.js'
let translate = (str) => {
  return CN[str] || str
}
let lowercase = (str) => {
  return str.toLowerCase()
}
let formatDate = (timestamp, fractional) => {
  if (!timestamp) {
    return ''
  }
  if (fractional) {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss.SSS')
  } else {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
  }
}

let formatDate2 = (timestamp, fractional) => {
  if (!timestamp) {
    return ''
  }
  if (fractional) {
    return moment(timestamp).format('YYYY-MM-DD')
  } else {
    return moment(timestamp).format('YYYY-MM-DD')
  }
}
let formatUtcStr = (str) => {
  if (!str) {
    return '-'
  }
  return moment(moment.utc(str).valueOf()).format('YYYY-MM-DD HH:mm:ss')
}

let rbDuration = (milliseconds) => {
  let message = ''
  if (milliseconds >= 1000) {
    const duration = moment.duration(milliseconds)

    const days = duration.days()
    const hours = duration.hours()
    const minutes = duration.minutes()
    const seconds = duration.seconds()
    message += days ? days + '天' : ''
    message += hours ? hours + '小时' : ''
    message += minutes ? minutes + '分钟' : ''
    message += seconds ? seconds + '秒' : ''
  } else if (milliseconds > 0) {
    message = '少于1秒'
  } else {
    message = '-'
  }
  return message
}

let markdown2html = (str) => {
  return marked(str)
}
let rbCrontabNext = (rule,
                     step = 1,
                     options = {
                       utc: false,
                       format: 'YYYY-MM-DD HH:mm:ss',
                       tz: 'Asia/Shanghai'
                     }) => {
  const INPUT_FORMAT = 'ddd MMM DD YYYY HH:mm:ss GMTZ'
  let dateString = 'N/A'
  if (!rule || !isFiledCountCorrect(rule)) {
    return dateString
  }
  try {
    const interval = parser.parseExpression(rule, options)
    for (let i = 0; i < step; i++) {
      dateString = interval.next().toString()
    }
    const momentInstance = moment(dateString, INPUT_FORMAT, 'en')
    if (options.utc) {
      dateString = momentInstance.utcOffset(0).format(options.format) + ' UTC'
    } else if (options.tz === 'Asia/Shanghai') {
      dateString = momentInstance.utcOffset(480).format(options.format) + ' GMT+8'
    } else {
      dateString = momentInstance.format(options.format)
    }
  } catch (err) {
    dateString = 'N/A'
  }
  return dateString
}
function isFiledCountCorrect (exp) {
  const spaceCount = exp.split('').filter(val => val === ' ').length
  const filedCount = exp.split(' ').filter(val => val).length
  return spaceCount === 4 && filedCount === 5
}
function rbCapitalizeAll (field) {
  if (!field) {
    return ''
  }
  const tokens = field.split(' ')
  const formatField = tokens.map((token) => (token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())).join(' ')
  return formatField
}
export {lowercase, formatDate, formatDate2, formatUtcStr, rbDuration, markdown2html, rbCrontabNext, rbCapitalizeAll, translate}
