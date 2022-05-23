import axios from 'axios'

export function request(url, params) {
    const instance = axios.create({
        baseURL: 'http://www.baidu.com',
        timeout: 5000,
    })
    if (params) {
        params = {
            params: params
        }
        return instance.get(url, params);
    }else {
        return instance.get(url);
    }
}
