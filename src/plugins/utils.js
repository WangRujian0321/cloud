export function formatDate(date, fmt) {
    // 1. 获取年份
    if (/(y+)/.test(fmt)) {
        // RegExp.$1 指的是与正则表达式匹配的第一个子匹配
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    // 2. 获得月日
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for(let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt
}

// 不足两位补足两位 04:05:09
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

// 处理大于1k的数字
export function handleNum(num) {
    if (num > 10000) {
        num = (num / 10000).toFixed(1)
        return num+'W'
    }else {
        return num;
    }
}
