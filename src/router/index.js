import Vue from 'vue'
import VueRouter from 'vue-router'


const Index = () => import('components/index.vue')
const Discover = () => import('views/discover/discover.vue')
const Recommend = () => import('views/discover/discoverChildren/recommend.vue')
const MusicList = () => import('views/discover/discoverChildren/musicList.vue')
const MusicListDetail = () => import('views/musicListDetail/musicListDetail.vue')
const MusicListIndex = () => import('views/discover/discoverChildren/musicListChildren/musicListIndex.vue')
const MusicListHighQuality = () => import('views/discover/discoverChildren/musicListChildren/musicListHighQuality.vue')
const Ranking = () => import('views/discover/discoverChildren/ranking.vue')
const Singer = () => import('views/discover/discoverChildren/singer.vue')
const Video = () => import('views/video/video.vue')

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/index' },
    {
        path: '/index',
        component: Index,
        redirect: '/discover',
        children: [
            {
                path: '/discover',
                component: Discover,
                redirect: '/discover/recommend',
                children: [
                    { path: '/discover/recommend', component: Recommend },
                    {
                        path: '/discover/musiclist',
                        component: MusicList,
                        children: [
                            {path: '/discover/musiclist/musiclistindex', component:MusicListIndex},
                            {path: '/discover/musiclist/musiclisthighquality', component: MusicListHighQuality}
                        ]
                    },
                    {path: '/discover/singer', component: Singer},
                    {path: '/discover/ranking', component: Ranking}
                ]
            },
            {path: '/video', component: Video},
            {path: '/musiclistdetail/:id', name:'musicListDetail', component: MusicListDetail}
        ]
    }
]

const router = new VueRouter({
    routes,
    mode: 'history',
})

export default router

