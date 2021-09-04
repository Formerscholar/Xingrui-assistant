export const rootURL = 'http://api.xrpyzs.com'

export const baseURL = process.env.NODE_ENV === 'production' ? rootURL : '/api'

export const callBackUrl = encodeURIComponent(
  'http://test.aictb.com/teacher/WXLogin'
)

export const appid = 'wx5f0976e726b587f8'

export const PerMenuItem = [
  {
    text: '个人信息',
    img: 'https://aictb.oss-cn-shanghai.aliyuncs.com/straight/per_info.png',
    img_current:
      'https://aictb.oss-cn-shanghai.aliyuncs.com/straight/per_info_current.png',
  },
  {
    text: '积分记录',
    img: 'https://aictb.oss-cn-shanghai.aliyuncs.com/straight/integral.png',
    img_current:
      'https://aictb.oss-cn-shanghai.aliyuncs.com/straight/integral_current.png',
  },
]

export function setTimerType(timer, type = false, format = '') {
  let d = new Date(timer)
  let ConvertedYear = d.getFullYear().toString()
  let ConvertedMonth = (d.getMonth() + 1).toString()
  let ConvertedDate = d.getDate().toString()
  let ConvertedHour = d.getHours().toString()
  let ConvertedMinut = d.getMinutes().toString()
  let ConvertedSecond = d.getSeconds().toString()
  ConvertedMonth =
    ConvertedMonth.length < 2 ? '0' + ConvertedMonth : ConvertedMonth
  ConvertedDate = ConvertedDate.length < 2 ? '0' + ConvertedDate : ConvertedDate
  ConvertedHour = ConvertedHour.length < 2 ? '0' + ConvertedHour : ConvertedHour
  ConvertedMinut =
    ConvertedMinut.length < 2 ? '0' + ConvertedMinut : ConvertedMinut
  ConvertedSecond =
    ConvertedSecond.length < 2 ? '0' + ConvertedSecond : ConvertedSecond
  if (format === 1) {
    return `${ConvertedYear}年${ConvertedMonth}月${ConvertedDate}日`
  }
  return type
    ? `${ConvertedYear}-${ConvertedMonth}-${ConvertedDate} ${ConvertedHour}:${ConvertedMinut}:${ConvertedSecond}`
    : `${ConvertedYear}-${ConvertedMonth}-${ConvertedDate}`
}

export function treeData(data) {
  let cloneData = JSON.parse(JSON.stringify(data))
  return cloneData.filter((father) => {
    let branchArr = cloneData.filter((child) => father.id == child.pid)
    branchArr.length > 0 ? (father.child = branchArr) : ''
    return father.pid == 0
  })
}

export function Timestamp(time) {
  return _.divide(new Date(time).getTime(), 1000)
}

export const level_text = ['', '容易', '较易', '中等', '较难', '困难']

export function randomHexColor() {
  return (
    '#' + ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
  )
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export function formatTimeToStr(times, pattern) {
  var d = new Date(times).Format("yyyy-MM-dd hh:mm:ss");
  if (pattern) {
    d = new Date(times).Format(pattern);
  }
  return d.toLocaleString();
}

let arr = []
export function treeToArray(data){
  for(const i in data)
  {
    arr.push(data[i])
    if(data[i].child && data[i].child.length > 0)
      treeToArray(data[i].child)
  }

  return arr
}

export function setCookie(c_name,value,expire) {
  var date=new Date()
  date.setSeconds(date.getSeconds()+expire)
  document.cookie=c_name+ "="+escape(value)+"; expires="+date.toGMTString()
  //console.log(document.cookie)
}

export function getCookie(c_name){
  if (document.cookie.length>0){
    let c_start=document.cookie.indexOf(c_name + "=")
    if (c_start!=-1){
      c_start=c_start + c_name.length+1
      let c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) c_end=document.cookie.length
      return unescape(document.cookie.substring(c_start,c_end))
    }
  }
  return ""
}

export function delCookie(c_name){
  setCookie(c_name, "", -1)
}
