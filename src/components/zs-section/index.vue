<template>
  <div>
    <div class="section">
      <div class="left">
        <div class="section-divider"></div>
        <div class="section-title">{{ title }}</div>
      </div>
      <div class="right">
        <slot name="header-right"></slot>
      </div>
    </div>
    <div class="section-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    title: {
      type: String,
      default: '',
    },
  });
</script>

<style lang="less" scoped>
  .section {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      height: 31px;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 10px 0;

      .section-divider {
        width: 5px;
        height: 16px;
        background-color: rgb(var(--primary-5));
        border-radius: 0px;
        margin-right: 6px;
      }

      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: rgb(var(--text-color-primary));
      }
    }
  }
  .section-content {
    padding: 20px 10px;
  }
</style>
