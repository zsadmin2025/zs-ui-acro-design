<template>
  <svg
    :class="['svg-icon', $attrs.class]"
    :style="{ width: size + 'px', height: size + 'px' }"
    aria-hidden="true"
  >
    <use :xlink:href="`#${icon}`" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
  defineProps({
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'currentColor',
    },
    size: {
      type: [String, Number],
      default: 16, // 默认大小为 16px
    },
  });
</script>

<style scoped>
  svg-icon {
    /* fill: currentColor; */
    vertical-align: middle;
  }
</style>
