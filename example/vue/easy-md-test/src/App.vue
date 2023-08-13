<script setup lang="ts">
import md from './assets/test.md'
</script>

<template>
  <div class="page-container">
    <div class="md-list-item">
      <div>
        <div class="item-header">{{ md.title }}</div>
        <div class="content">
          <div class="text-content">
            <div class="item-desc">{{ md.description }}</div>
            <div class="item-time">{{ md.createTime }}</div>
          </div>
        </div>
      </div>
      <img :src="md.image" class="img-content" />
    </div>
    <div class="md-container">
      <div v-html="md.html"></div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: auto;
}
.md-container {
  flex: 1 1 50%
}
.md-list-item {
  flex: 1 1 50%;
  display: flex;
  height: 50px;
  padding: 12px 20px 0;
}
.item-header {
  font-weight: 600;
  font-size: 16px;
}
.item-desc {
  font-size: 13px;
  line-height: 22px;
  color: #8a919f;
}
.content {
  display: flex;
  width: 100%;
}
.text-content {
}
.img-content {
  flex: 0 0 50px;
  margin-left: 10px;
}
</style>
