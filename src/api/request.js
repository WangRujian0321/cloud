import axios from 'axios'
import vuex from '../store/index'

// 此项目所有请求均为get请求
export function request(url, params) {
    const instance = axios.create({
        baseURL: '/api',
        timeout: 3000,
        // 过期时间 30s
        withCredentials: true,
    });
    // 配置axios拦截器
    // request拦截
    instance.interceptors.request.use(data=>{
        return data;
    }, error => console.log(error))

    //response拦截
    instance.interceptors.response.use(data=> {
        return data
    }, error => {
        console.log(error);
        if(error.response.data.msg == '需要登录') {
            vuex.state.isLogin = false;
        } else{
            console.log(error.data.msg);
        }
    })
    instance.defaults.withCredentials = true;
    if (params) {
        params = {
            params: params
        }
        return instance.get(url, params)
    } else {
        return instance.get(url);
    }
}

export function LoginByCellPhone(params) {
    return request('/login/cellphone', params)
}

export function getSuggestList(params) {
    return request('/search/suggest', params)
}
// 热搜榜
export function getHotSearch() {
    return request('/search/hot/detail')
}
// 获取搜索建议
export function getSearchSuggest(keywords) {
    return request('/search/suggest', {keywords})
}
// 根据id获取歌曲详情
export function getMusicInfos(ids) {
    return request('/song/detail', {ids})
}
// 获得当前用户信息
export function getCurrentUserInfo(timestamp) {
    return request('/user/account', {timestamp})
}

// export function request(url, params) {
//     const instance = axios.create({
//         baseURL: 'http://www.baidu.com',
//         timeout: 5000,
//     })
//     if (params) {
//         params = {
//             params: params
//         }
//         return instance.get(url, params);
//     }else {
//         return instance.get(url);
//     }
// }
