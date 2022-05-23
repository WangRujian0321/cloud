import Vue from 'vue'
import VueRouter from 'vue-router'

const Index = () => import('components/index.vue')
const Discover = () => import('components/indexChildren/discover/discover.vue')
const Recommend = () => import('components/indexChildren/discoverChildren/recommend.vue')

Vue.use(VueRouter)

const routes = [
    {path: '/', redirect: '/index'},
    {
        path: '/index',
        component: Index,
        redirect: '/discover',
        children: [
            {
                path: '/discover',
                component: Discover,
                redirect: '/recommend',
                children: [
                    {
                        path: '/recommend',
                        component: Recommend,
                    }
                ]
            }
        ]
    }
]


