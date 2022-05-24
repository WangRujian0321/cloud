import Vue from "vue";
import Vuex from "vuex"

Vue.use(Vuex)

const state = {
    // 音乐URL
    musicID: '',
    // 播放状态
    isPlay: false,
    // 播放歌单
    musicList: [],
    // 当前播放歌单ID
    musicListId: '',
    // 当前播放音乐的索引
    currentIndex: -1,
    // 是否登录
    isLogin: false,
    // 音乐详情卡片的显隐
    isMusicDetailCardShow: false,
    // 实时播放时长
    currentTime: 0,
    // 音乐是否在加载中
    isMusicLoad: false,
    // 在歌手详情保存上一首歌的信息
    currentRowInfo: {},
    // 用户喜欢的音乐列表
    likeMusicList: [],
    // 已收藏的专辑
    subAlbumList: null,
    // 已收藏的歌手
    subSingerList: null,
    // 已收藏的video
    subVideoList: null,
    // 已收藏的歌单
    collectMusicList: [],
    // 用户创建的歌单
    createdMusicList: [],
    // 要下载的音乐信息
    downloadMusicInfo: {
        name: '',
        url: '',
    },
    // 已喜欢的视频
    likeVideoList: null,
}

const store = new Vuex.Store({
    state,
    mutations: {
        // 更改音乐url
        updateMusicId(state, musicId){
            state.musicID = musicId
        },
        // 修改播放状态
        changePlayState(state, isPlay){
            state.isPlay = isPlay
        },
        // 更新歌单列表和歌单id
        updateMusicList(state, payload){
            if (payload.musicListId !== state.musicListId) {
                state.musicListId = payload.musicListId
                state.currentIndex = -1
            }
            state.musicList = payload.musicList.slice(0);
        },
        // 更新登陆状态
        updateLoginState(state, flag=false) {
            state.isLogin = flag
        },
        // 当前播放音乐的索引
        updateCurrentIndex(state, index) {
            state.currentIndex = index
        },
        // 切换音乐卡片的显示与隐藏
        changeMusicDetailCardState(state){
            state.isMusicDetailCardShow = !state.isMusicDetailCardShow
        },
        // 更改音乐播放时间
        updateCurrentTime(state, currentTime) {
            state.currentTime = currentTime
        },
        // 更新音乐加载状态
        updateMusicLoadState(state, isLoad) {
            state.isMusicLoad = isLoad
        },
        // 用于记录当前播放行的信息 便于下次渲染和清除播放样式
        updateCurrentRowInfo(state, currentRowInfo) {
            state.currentRowInfo = currentRowInfo
        },
        // 更新用户喜欢的音乐列表
        updateLikeMusicList(state, likeMusicList) {
            state.likeMusicList = likeMusicList
        },
        // 更新已收藏的专辑列表
        updateSubAlbumList(state, subAlbumList) {
            state.subAlbumList = subAlbumList
        },
        // 更新已收藏的歌手列表
        updateSubSingerList(state, subSingerList) {
            state.subSingerList = subSingerList
        },
        // 更新已收藏的视频列表
        updateSubVideoList(state, subVideoList) {
            state.subVideoList = subVideoList
        },
        updateCollectMusicList(state, collectMusicList) {
            state.collectMusicList = collectMusicList
        },
        updateCreatedMusicList(state, createdMusicList) {
            state.createdMusicList = createdMusicList
        },
        updateDownloadMusicInfo(state, downloadMusicInfo) {
            state.downloadMusicInfo = downloadMusicInfo
        },
        updateLikeVideoList(state, likeVideoList) {
            state.likeVideoList = likeVideoList
        }
    }
})

// 挂载到vue实例
export default store
