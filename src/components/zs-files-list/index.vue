<template>
  <div class="file-list">
    <div v-for="(item, index) in files" :key="index" class="list-item">
      <div class="list-item-content">
        <div class="list-item-name">{{ item }}</div>
        <span class="list-item-operation"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  export interface FileListProps {
    files: string[];
  }
  defineProps({
    files: {
      type: Array,
      default: () => [],
    },
  });
</script>
