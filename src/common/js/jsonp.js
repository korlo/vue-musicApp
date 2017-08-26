import originjSONP from 'jsonp'

export default function jsonp (url, data, option) { 
  // 一般的链接 最先一个拼接符号是? 然后后面的都是& 
  //判断是否有? 再拼接起来
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originjSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
};

function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  // 去掉最前面的& 符号
  return url ? url.substring(1) : ''
}
