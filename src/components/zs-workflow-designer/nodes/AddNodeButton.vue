<template>
  <div class="add-node-button">
    <div class="add-node-line"></div>
    <a-popover
      v-model:visible="visible"
      trigger="click"
      position="right"
      :content-style="{ padding: '8px' }"
    >
      <div class="add-node-trigger">
        <icon-plus :size="14" />
      </div>
      <template #content>
        <div class="add-node-menu">
          <div
            v-for="item in menuItems"
            :key="item.type"
            class="menu-item"
            :class="{ disabled: item.disabled }"
            @click="handleSelect(item.type)"
          >
            <div
              class="menu-icon"
              :style="{ backgroundColor: getNodeColor(item.type) }"
            >
              <icon-font :type="item.icon" :size="16" />
            </div>
            <span class="menu-text">{{ item.name }}</span>
          </div>
        </div>
      </template>
    </a-popover>
    <div class="add-node-line"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { NodeType } from '../types';
  import { addNodeMenuItems, getNodeColor } from '../config/nodeTypes';

  const emit = defineEmits<{
    (e: 'add', type: NodeType): void;
  }>();

  const visible = ref(false);
  const menuItems = addNodeMenuItems;

  function handleSelect(type: NodeType) {
    visible.value = false;
    emit('add', type);
  }
</script>

<style lang="less" scoped>
  .add-node-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;

    .add-node-line {
      width: 2px;
      height: 24px;
      background: #c9cdd4;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 8px;
        background: #c9cdd4;
        border-radius: 50%;
      }

      &:first-child::after {
        top: -4px;
        bottom: auto;
      }
    }

    .add-node-trigger {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #3370ff;
      color: #fff;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.25s ease;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(51, 112, 255, 0.4);

      &:hover {
        background: #2860e0;
        transform: scale(1.2);
        box-shadow: 0 4px 12px rgba(51, 112, 255, 0.5);
      }
    }
  }

  .add-node-menu {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    width: 190px;
    padding: 8px;

    .menu-item {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(.disabled) {
        background: #f0f2f5;
        transform: translateX(2px);
      }

      &.disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .menu-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        color: #fff;
        flex-shrink: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .menu-text {
        margin-left: 10px;
        font-size: 13px;
        color: #4e5969;
        font-weight: 500;
      }
    }
  }
</style>
