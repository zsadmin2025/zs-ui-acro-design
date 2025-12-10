<template>
  <a-drawer
    :visible="noticeInfoVisible"
    unmount-on-close
    width="50%"
    class="notice-drawer"
    @cancel="noticeInfoStore.closeInfo"
  >
    <template #title>
      <div class="drawer-title">
        <icon-notification class="title-icon" />
        <span class="title-text">{{ '通知公告详情' }}</span>
      </div>
    </template>

    <div v-if="form" class="notice-detail-container">
      <!-- 基本信息卡片 -->
      <a-card class="info-card" :bordered="false">
        <template #title>
          <div class="card-title">
            <icon-info-circle class="card-icon" />
            <span>基本信息</span>
          </div>
        </template>

        <div class="detail-grid">
          <!-- 标题 -->
          <div class="detail-item">
            <div class="label-wrapper">
              <icon-edit class="label-icon" />
              <span class="label">标题：</span>
            </div>
            <span class="value title-value">{{ form.title }}</span>
          </div>

          <!-- 类型和级别 -->
          <div class="detail-row">
            <div class="detail-item">
              <div class="label-wrapper">
                <icon-tags class="label-icon" />
                <span class="label">类型：</span>
              </div>
              <a-tag class="value-tag" color="arcoblue">
                {{ getNoticeTypeName(form.type) }}
              </a-tag>
            </div>

            <div class="detail-item">
              <div class="label-wrapper">
                <icon-star class="label-icon" />
                <span class="label">级别：</span>
              </div>
              <a-tag class="value-tag" :color="getLevelTagColor(form.level)">
                {{ getLevelName(form.level) }}
              </a-tag>
            </div>
          </div>

          <!-- 状态 -->
          <div class="detail-item">
            <div class="label-wrapper">
              <icon-check-circle class="label-icon" />
              <span class="label">状态：</span>
            </div>
            <a-tag
              class="value-tag"
              :color="form.status === 1 ? 'green' : 'orange'"
            >
              <icon-check v-if="form.status === 1" />
              <icon-edit v-else />
              {{ form.status === 1 ? '已发布' : '草稿' }}
            </a-tag>
          </div>
        </div>
      </a-card>

      <!-- 时间信息卡片 -->
      <a-card class="info-card" :bordered="false">
        <template #title>
          <div class="card-title">
            <icon-clock-circle class="card-icon" />
            <span>时间信息</span>
          </div>
        </template>

        <div class="detail-grid">
          <div class="detail-row">
            <div class="detail-item">
              <div class="label-wrapper">
                <icon-send class="label-icon" />
                <span class="label">发布时间：</span>
              </div>
              <span class="value time-value">{{
                formatTime(form.releaseTime)
              }}</span>
            </div>

            <div class="detail-item">
              <div class="label-wrapper">
                <icon-plus-circle class="label-icon" />
                <span class="label">创建时间：</span>
              </div>
              <span class="value time-value">{{
                formatTime(form.createTime)
              }}</span>
            </div>
          </div>

          <div class="detail-item">
            <div class="label-wrapper">
              <icon-sync class="label-icon" />
              <span class="label">更新时间：</span>
            </div>
            <span class="value time-value">{{
              formatTime(form.updateTime)
            }}</span>
          </div>
        </div>
      </a-card>

      <!-- 内容卡片 -->
      <a-card class="info-card content-card" :bordered="false">
        <template #title>
          <div class="card-title">
            <icon-file class="card-icon" />
            <span>公告内容</span>
          </div>
        </template>

        <div class="detail-item full-width">
          <div class="content-html-wrapper">
            <div v-dompurify-html="form.content" class="content-html"></div>
          </div>
        </div>
      </a-card>

      <!-- 附件卡片 -->
      <a-card
        v-if="form.files && form.files.length > 0"
        class="info-card"
        :bordered="false"
      >
        <template #title>
          <div class="card-title">
            <icon-link class="card-icon" />
            <span>附件下载</span>
          </div>
        </template>

        <div class="detail-item full-width">
          <div class="file-list">
            <a
              v-for="file in form.files"
              :key="file.id"
              :href="file.url"
              target="_blank"
              class="file-item"
            >
              <div class="file-icon-wrapper">
                <icon-file class="file-icon" />
              </div>
              <div class="file-info">
                <div class="file-name">{{ file.fileOriginalName }}</div>
                <div class="file-size">{{ getFileSize(file.fileSize) }}</div>
              </div>
              <icon-download
                class="download-icon"
                @click="downloadFile(file.fileUrl, file.fileName)"
              />
            </a>
          </div>
        </div>
      </a-card>

      <!-- 接收人卡片 -->
      <a-card
        v-if="form.sysNoticeDetailsVOs && form.sysNoticeDetailsVOs.length > 0"
        class="info-card"
        :bordered="false"
      >
        <template #title>
          <div class="card-title">
            <icon-user-group class="card-icon" />
            <span>接收人列表</span>
          </div>
        </template>

        <div class="detail-item full-width">
          <a-table
            :data="form.sysNoticeDetailsVOs"
            :columns="receiverColumns"
            :pagination="false"
            size="small"
            :bordered="false"
            class="receiver-table"
          >
            <template #status="{ record }">
              <a-tag
                v-if="record.status === 1"
                color="green"
                class="status-tag"
              >
                <icon-check />
                已读
              </a-tag>
              <a-tag v-else color="red" class="status-tag">
                <icon-clock-circle />
                未读
              </a-tag>
            </template>
          </a-table>
        </div>
      </a-card>
    </div>

    <div v-else class="loading-container">
      <a-spin size="large">
        <template #icon>
          <icon-loading />
        </template>
        <div class="loading-text">加载中...</div>
      </a-spin>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useNoticeAddOrEditStore } from '@/store/modules/sys/notice/noticeAddOrEditStore';
  import download from '@/utils/fileDownload';

  // 使用 Pinia store
  const noticeInfoStore = useNoticeAddOrEditStore();
  const { noticeInfoVisible } = storeToRefs(noticeInfoStore);
  const form = computed(() => noticeInfoStore.form);

  // 接收人表格列定义
  const receiverColumns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) => `${rowIndex + 1}`,
      width: 80,
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      ellipsis: true,
      render: ({ record }) => record.realName || '--',
    },
    {
      title: '阅读状态',
      dataIndex: 'status',
      slotName: 'status',
      width: 100,
      align: 'center',
    },
    {
      title: '阅读时间',
      dataIndex: 'readTime',
      align: 'center',
      render: ({ record }) => record.readTime || '--',
    },
  ]);

  // 通知类型映射
  const getNoticeTypeName = (type: number) => {
    const types: Record<number, string> = {
      1: '通知',
      2: '公告',
      3: '通报',
      4: '其他',
    };
    return types[type] || '未知类型';
  };

  // 通知级别映射与颜色
  const getLevelName = (level: number) => {
    const levels: Record<number, string> = {
      1: '普通',
      2: '重要',
      3: '紧急',
    };
    return levels[level] || '未知';
  };

  const getLevelTagColor = (level: number) => {
    const colors: Record<number, string> = {
      1: 'arcoblue', // 蓝色
      2: 'orange', // 橙色
      3: 'red', // 红色
    };
    return colors[level] || 'gray';
  };

  // 格式化时间
  const formatTime = (time: string) => {
    if (!time) return '--';
    return time;
  };

  // 获取文件大小
  const getFileSize = (size: number) => {
    if (!size) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0; // 改为 let
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index += 1; // 此时合法
    }
    return `${size.toFixed(1)} ${units[index]}`;
  };

  const downloadFile = async (url: string, fileName: string) => {
    download.url(url, fileName);
  };

  // 暴露方法给父组件调用
  defineExpose({
    initInfo: noticeInfoStore.initInfo,
    form,
  });
</script>

<style scoped lang="less">
  .drawer-title {
    display: flex;
    align-items: center;
    gap: 8px;

    .title-icon {
      font-size: 18px;
      color: rgb(var(--primary-6));
    }

    .title-text {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
    }
  }

  .notice-detail-container {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .info-card {
    :deep(.arco-card-header) {
      padding: 16px 20px 12px;
      border-bottom: 1px solid var(--color-border-2);
    }

    :deep(.arco-card-body) {
      padding: 16px 20px;
    }
  }

  .content-card {
    :deep(.arco-card-body) {
      padding: 0;
    }
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-1);

    .card-icon {
      font-size: 16px;
      color: rgb(var(--primary-6));
    }
  }

  .detail-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .detail-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;

    &.full-width {
      width: 100%;
    }
  }

  .label-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 100px;
    flex-shrink: 0;

    .label-icon {
      font-size: 14px;
      color: var(--color-text-3);
    }

    .label {
      font-size: 14px;
      color: var(--color-text-3);
      font-weight: 500;
      white-space: nowrap;
    }
  }

  .value {
    font-size: 14px;
    color: var(--color-text-1);
    line-height: 1.6;
    word-break: break-word;
  }

  .title-value {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-1);
  }

  .time-value {
    color: var(--color-text-2);
    font-family: 'Monaco', 'Consolas', monospace;
  }

  .value-tag {
    margin: 0;
  }

  .content-html-wrapper {
    width: 100%;
    padding: 20px;
  }

  .content-html {
    min-height: 200px;
    line-height: 1.8;
    color: var(--color-text-1);

    :deep(*) {
      max-width: 100%;
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }

    :deep(table) {
      width: 100%;
      border-collapse: collapse;
    }

    :deep(th, td) {
      border: 1px solid var(--color-border-2);
      padding: 8px 12px;
    }

    :deep(th) {
      background: var(--color-fill-2);
    }
  }

  .file-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .file-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid var(--color-border-2);
    border-radius: 6px;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
    background: var(--color-bg-2);

    // &:hover {
    //   border-color: rgb(var(--primary-6));
    //   background: var(--color-fill-2);
    //   transform: translateY(-1px);
    //   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    // }
  }

  .file-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgb(var(--primary-1));
    border-radius: 6px;

    .file-icon {
      color: rgb(var(--primary-6));
    }
  }

  .file-info {
    flex: 1;
    min-width: 0;
  }

  .file-name {
    color: var(--color-text-1);
    font-weight: 500;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    color: var(--color-text-3);
  }

  .download-icon {
    color: var(--color-text-3);
    transition: color 0.2s ease;
    cursor: pointer;
  }

  .file-item:hover .download-icon {
    color: rgb(var(--primary-6));
  }

  .receiver-table {
    :deep(.arco-table-th) {
      background: var(--color-fill-2);
      font-weight: 500;
    }

    :deep(.arco-table-td) {
      border-bottom: 1px solid var(--color-border-2);
    }
  }

  .status-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0;
  }

  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    flex-direction: column;
    gap: 12px;
  }

  .loading-text {
    color: var(--color-text-3);
    font-size: 14px;
  }

  // 响应式调整
  @media (max-width: 768px) {
    .notice-detail-container {
      padding: 16px;
      gap: 12px;
    }

    .detail-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .label-wrapper {
      min-width: auto;
    }
  }
</style>
