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

export function getFollows(params) {
    return request('/user/follows', params)
}

export function getFolloweds(params) {
    return request('/user/followeds', params)
}


export function getUserInfo(uid) {
    return request(`/user/detail?uid=${uid}`)
}

export function getPlayList(params) {
    return request(`/user/playlist`, params)
}

export function logOut() {
    return request(`/logout`)
}

export function loadMusic(id) {
    return request(`/song/url`, {id})
}

export function likeMusic(id, like) {
    return request(`/like`, {id, like})
}

export function getLikeList(params) {
    return request(`/likelist`, params)
}

export function getBanner() {
    return request(`/banner`);
}

export function getRecommendMusicList(params) {
    return request(`/personalized`, params)
}

export function getTopHighQuality(params) {
    return request(`/top/playlist/highquality`, params);
}

export function getTopPlayList(params) {
    return request(`/top/playlist`, params)
}

export function getHotTag(){
    return request(`/playlist/hot`);
}

export function getCatList() {
    return request(`/playlist/catlist`);
}

export function getComment(params) {
    return request(`/comment`, params)
}

export function likeComment(params) {
    return request(`/comment/like`)
}

export function getMusicListDetail(params){
    return request(`/playlist/detail`, params)
}

export function getMusicListComment(params) {
    return request(`/comment/playlist`)
}
export function getAllRankings() {
    return request(`/toplist`)
}

export function getSingerList(params){
    return request(`/artist/list`, params);
}

export function getAlbumDetail(params) {
    return request(`/album`, params)
}

export function getAlbumComment(params) {
    return request(`/comment/album`, params)
}

export function getAlbumSublist(params) {
    return request(`/album`, params);
}

export function getAlbumSub(params){
    return request(`/album.sub`, params);
}

export function getLyric(id) {
    return request(`/lyric`, {id})
}

export function getHotComment(params) {
    return request(`/comment/hot`, params)
}

export function getMusicComment(params) {
    return request(`/comment/music`, params)
}