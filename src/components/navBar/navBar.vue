<template>
  <div class="navBarContainer">
    <div class="navBar">
      <div
          class="barItem"
          v-for="(item, index) in navBarItem"
          :key="index"
          :class="index === activeNum ? 'active' : '' "
          @click="clickBarItem(item.path, index)">
        {{item.name}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "navBar",
  data () {
    return {
      activeNum: 0,
    }
  },
  props:{
    navBarItem: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  created() {
    this.navBarItem.forEach((item, index) => {
      if (this.$route.path.search(item.path) !== -1) {
        this.activeNum = index;
      }
    })
  },
  methods: {
    clickBarItem(path, index) {
      this.activeNum = index;
      this.$emit('clickBarItem', path)
    }
  }
}
</script>

<style scoped>
.navBarContainer {
  height: 60px;
  width: 100%;
  position: relative;
}

.navBar {
  display: flex;
  position: fixed;
  left: 160px;
  top: 50px;
  background-color: #fff;
  z-index: 100;
  width: 100%;
  color: rgb(49, 49, 49);
  align-items: center;
  padding: 10px 0 20px 20px;
}

.barItem {
  font-size: 13px;
  margin: 0 10px;
  text-align: center;
}

.active {
  font-size: 16px;
  color: black;
  font-weight: 600;
  padding-bottom: 5px;
  border-bottom: 3px solid #ec4141;
  transform: translateY(4px);
}
</style>
