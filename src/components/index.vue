<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="160px">
        <el-menu active-text-color="black" router default-active="/discover">
          <el-menu-item index="/discover">
            <i class="iconfont icon-yinle"></i>
            <span slot="title">发现音乐</span>
          </el-menu-item>
          <el-menu-item index="/video">
            <i class="iconfont icon-shipin"></i>
            <span slot="title">视频</span>
          </el-menu-item>
          <el-menu-item-group>
            <template slot="title" class="groupTitle">创建的歌单</template>
            <el-menu-item index="/musiclistdetail">
              <i class="iconfont icon-gedan"></i>选项1</el-menu-item
            >
            <el-menu-item index="/musiclistdetail"
            ><i class="iconfont icon-gedan"></i>选项2</el-menu-item
            >
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title" class="groupTitle">收藏的歌单</template>
            <el-menu-item index="/musiclistdetail"
            ><i class="iconfont icon-gedan"></i>选项1</el-menu-item
            >
            <el-menu-item index="/musiclistdetail"
            ><i class="iconfont icon-gedan"></i>选项2</el-menu-item
            >
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <router-view class="routerView"></router-view>
      </el-main>
    </el-container>
    <bottom-control></bottom-control>
  </el-container>
</template>

<script>
import BottomControl from "./bottomControl/bottomControl";
export default {
  components: {
    BottomControl,
  },
  name: "Index",
};
</script>

<style scoped>
.el-header {
  background-color: #ec4141;
  height: 50px !important;
}

.el-aside {
  height: calc(100vh - 105px);
  border-right: 1px solid #ccc;
}

.el-menu-item:hover {
  background-color: #f5f5f6 !important;
}

.el-menu-item {
  font-size: 8px;
  padding: 0 0 0 10px !important;
  margin: 5px 0 !important;
  height: 30px;
  line-height: 30px;
}

.is-active {
  background-color: #f6f6f7;
  font-size: 14px;
  font-weight: 600;
}

.el-menu-item-group {
  margin-top: 10px;
}

.iconfont {
  font-size: 14px;
  margin: 5px !important;
}

.el-main {
  padding: 0;
}

.routerView {
  padding: 0 15px;
  margin: 0;
  width: 100%;
  height: calc(100vh - 105px);
}
</style>
