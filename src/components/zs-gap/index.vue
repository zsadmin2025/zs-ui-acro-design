<!--间隔符-->
<template>
  <div :style="{ color: color, height: height + 'px' }"></div>
</template>

<script lang="ts" setup>
  defineProps({
    color: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '20',
    },
  });
</script>
