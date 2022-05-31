<template>
  <div class="navBar">
    <div
        class="barItem"
        :class="index === activeNum ? 'active' : ''"
        v-for="(item, index) in SecondNavBarData"
        :key="index"
        @click="clickSecondBarItem(index)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SecondNavBar",
  data() {
    return {
      activeNum: 0,
    };
  },
  props: {
    SecondNavBarData: {
      type: Array,
      default(){
        return []
      },
    },
    itemWidth: {
      type: Number,
      default() {
        return 40;
      },
    },
    currentTag: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    clickSecondBarItem(index) {
      this.activeNum = index;
      // 将点击事件发射出去 供使用改组件接收事件使用
      this.$emit("clickSecondBarItem", index);
    },
  },
  watch: {
    currentTag(current) {
      this.activeNum = this.SecondNavBarData.findIndex((item)=>item.name === current.name)
    }
  }
};
</script>

<style scoped>
.navBar {
  display: flex;
}

.barItem {
  margin: 4px -2px;
  padding: 4px 12px;
  font-size: 12px;
  transform: scale(0.9, 0.9);
}

.active {
  background-color: #fdf5f5;
  color: #ec4747;
  border-radius: 10px;
}
</style>
