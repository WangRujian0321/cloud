<template>
  <div class="discover">
    <nav-bar @clickBarItem="clickBarItem" :navBarItem="navBarData"></nav-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from "@/components/navBar/navBar";
export default {
  name: `discover`,
  components: {NavBar},
  data() {
    return {
      navBarData: [
        {name: '个性推荐', path: "/discover/recommend"},
        {name: '歌单', path: "/discover/musiclist"},
        {name: '排行榜', path: "/discover/ranking"},
        {name: '歌手', path: "/discover/singer"}
      ]
    }
  },
  methods: {
    clickBarItem(path) {
      // 捕捉动作，并跳转
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>

</style>
