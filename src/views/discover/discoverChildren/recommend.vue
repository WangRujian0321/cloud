<template>
  <div class="recommend">
    <div class='carousel'>
      <el-carousel :interval="4000" type="card" height="180px">
        <el-carousel-item   v-for="(item, index) in bannerData" :key="index">
          <img :src="item.imageUrl" alt=""/>
        </el-carousel-item>
      </el-carousel>
    </div>
<!--    推荐歌单-->
    <div class="recommendMusicList">
      <h3>推荐歌单
        <i class="iconfont icon-arrow-right-bold"></i>
      </h3>
      <list-card :list-card-data="musicList" @clickListCardItem="clickListCardItem"></list-card>
    </div>
  </div>
</template>

<script>
import {getBanner, getRecommendMusicList} from "@/api/request";
import ListCard from "@/components/listCard/listcard";

export default {
  name: `recommend`,
  components: {ListCard},
  data() {
    return {
      // 轮播图数据
      bannerData: [],
      // recommend页面显示的musicList
      musicList: [],
    };
  },
  methods: {
    // 请求轮播图数据
    getBannerData() {
      getBanner().then(res=>{
        this.bannerData = res.data.banners;
      })
    },
    getMusicList() {
      getRecommendMusicList({limit:10}).then(res=>{
        this.musicList = res.data.result;
      })
    },
    clickListCardItem(id) {
      this.$router.push({name: "musicListDetail", params:{id}})
    }
  },
  created() {
    this.getBannerData();
    this.getMusicList();
  }
}
</script>

<style scoped>
.recommendContainer {
  display: flex;
  justify-content: center;
}

.recommend {
  max-width: 100%;
}

.carousel {
  width: 100%;
}

.el-carousel {
  margin: auto;
  width: 80%;
}

.el-carousel__item {
  border-radius: 10px;
}

.el-carousel__item img {
  height: 100%;
}

.recommendMusicList {
  margin: 20px 10px;
}

.recommendMusicList h3 {
  color: #373737;
}
</style>
