<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      title="更新日志"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '15px 20px 13px 20px' }"
    >
      <!-- 更新日志列表 -->
      <div class="log-list">
        <!-- v2.4.1 -->
        <div class="log-item">
          <div class="version-info">
            <span class="version">v1.0.0</span>
            <span class="date">2025-12-02</span>
            <span class="tag latest">最新</span>
          </div>
          <ul class="changes">
            <li> <icon-check-circle-fill /> 正式上线</li>
          </ul>
        </div>
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  const loading = ref(false);
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }

  .log-list {
    margin-bottom: 20px;
  }
  .log-item {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .log-item:last-child {
    border-bottom: none;
  }

  .version-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 12px;
  }

  .version {
    font-weight: 600;
    font-size: 1.1rem;
    color: #333;
  }

  .date {
    color: #666;
    font-size: 0.9rem;
    margin-left: 12px;
  }

  .tag {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.8rem;
    color: #52c414;
    background-color: #e6f7e6;
    margin-left: 12px;
  }

  .latest {
    color: #52c414;
    background-color: #e6f7e6;
  }

  .changes {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }
  .changes li {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    padding-left: 20px;
    position: relative;
  }

  .changes li::before {
    content: '';
    position: absolute;
    left: 0;
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  .changes li svg {
    margin-right: 8px;
    font-size: 14px;
  }

  .view-all {
    text-align: right;
    margin-top: 20px;
  }

  .view-all a {
    color: #1674ff;
    text-decoration: none;
    font-size: 0.95rem;
  }

  .view-all a:hover {
    text-decoration: underline;
  }
</style>
