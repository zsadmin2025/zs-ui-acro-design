<template>
  <div :class="['zs-container', layoutClass]">
    <!-- 上中下布局 -->
    <div v-if="layout === 'header-main-footer'" class="header-main-footer">
      <div v-if="$slots.header" class="header-box">
        <slot name="header"></slot>
      </div>
      <div class="main-box">
        <div class="main-box-header">
          <slot name="main-header"></slot>
        </div>
        <div class="main-box-body">
          <slot name="main-body"></slot>
        </div>
      </div>
      <div v-if="$slots.footer" class="footer-box">
        <slot name="footer"></slot>
      </div>
    </div>

    <!-- 左右布局 -->
    <div v-else-if="layout === 'left-right'" class="layout-left-right">
      <div
        v-if="$slots.left"
        class="left-sidebar"
        :style="{ width: leftBoxWidth }"
      >
        <slot name="left"></slot>
      </div>
      <div class="right-content">
        <!-- 右侧使用嵌套的上中下布局 -->
        <div v-if="$slots['right-header']" class="right-header">
          <slot name="right-header"></slot>
        </div>
        <div class="right-main">
          <div v-if="$slots['right-main-header']" class="right-main-header">
            <slot name="right-main-header"></slot>
          </div>
          <div class="right-main-body">
            <slot name="right-main-body"></slot>
          </div>
        </div>
        <div v-if="$slots['right-footer']" class="right-footer">
          <slot name="right-footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      layout: {
        type: String,
        default: 'header-main-footer',
        validator: (value) =>
          ['header-main-footer', 'left-right'].includes(value),
      },
      rightHeaderHeight: {
        type: String,
        default: 'var(--header-box-height)',
      },
      headerHeight: {
        type: String,
        default: 'var(--header-box-height)',
      },
      leftBoxWidth: {
        type: String,
        default: '220px',
      },
    },
    computed: {
      layoutClass() {
        return `layout-${this.layout}`;
      },
    },
  };
</script>

<style lang="less" scoped>
  @left-box-width: 260px;

  .zs-container {
    width: 100%;
    height: var(--app-main-height);
    border-radius: var(--border-radius);

    /* 上中下布局 */
    &.layout-header-main-footer {
      display: flex;
      flex-direction: column;

      .header-main-footer {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
      }

      .header-box {
        height: auto;
        padding: var(--base-padding) var(--base-padding) 0 var(--base-padding);

        background-color: var(--color-bg-2);
        margin-bottom: var(--base-padding);
        border-radius: var(--border-radius);
        :deep(.arco-form-item) {
          margin-bottom: 10px !important;
        }
      }

      .main-box {
        flex: 1;
        overflow: hidden;
        background-color: var(--color-bg-2);
        border-radius: var(--border-radius);
        padding: var(--base-padding);
        border-radius: var(--border-radius) var(--border-radius) 0 0;

        .main-box-header {
          height: var(--right-main-header-height);
        }

        .main-box-body {
          height: calc(100% - var(--right-main-header-height));
        }
      }

      .footer-box {
        height: var(--footer-box-height);
        background-color: var(--color-bg-2);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 var(--base-padding);
      }
    }

    /* 左右布局 */
    &.layout-left-right {
      display: flex;
      flex-direction: row;

      .layout-left-right {
        display: flex;
        flex-direction: row;
        width: 100%;
      }

      .left-sidebar {
        height: 100%;
        width: @left-box-width;
        padding: var(--base-padding);
        background-color: var(--color-bg-2);
        border-radius: var(--border-radius);
        box-shadow: 0 0 12px var(--shadow-special);
        margin-right: var(--base-padding);
      }

      /* 左右布局下的右侧盒子：上中下结构 */
      .right-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: calc(100% - @left-box-width);

        .right-header {
          height: auto;
          padding: var(--base-padding) var(--base-padding) 0 var(--base-padding);
          background-color: var(--color-bg-2);
          margin-bottom: var(--base-padding);
          border-radius: var(--border-radius);
          :deep(.arco-form-item) {
            margin-bottom: 10px !important;
          }
        }

        .right-main {
          flex: 1;
          overflow: auto;
          height: var(--main-box-height);
          padding: var(--base-padding);
          background-color: var(--color-bg-2);
          border-radius: var(--border-radius) var(--border-radius) 0 0;

          .right-main-header {
            height: var(--right-main-header-height);
          }
          .right-main-body {
            height: calc(100% - var(--right-main-header-height));
          }
        }

        .right-footer {
          height: var(--footer-box-height);
          border-top: 1px solid var(--color-neutral-3);
          padding: 0 var(--base-padding);
          display: flex;
          align-items: center;
          justify-content: flex-start;

          background-color: var(--color-bg-2);
          border-radius: 0 0 var(--border-radius) var(--border-radius);
        }
      }
    }
  }
</style>
<!-- 使用示例
上中下布局
<ZsContainer layout="header-main-footer">
  <template #header>头部内容</template>
  <template #main>这里是主要内容区域，高度自适应</template>
  <template #footer>底部内容</template>
</ZsContainer>
左右布局
<ZsContainer layout="left-right">
  <template #left>左侧内容</template>
  <template #right-header>右侧顶部</template>
  <template #right-main>右侧主要内容区域</template>
  <template #right-footer>右侧底部</template>
</ZsContainer> -->
