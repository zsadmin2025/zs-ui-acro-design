<template>
  <a-upload
    :custom-request="customRequest"
    list-type="picture-card"
    :file-list="[]"
    :show-upload-button="true"
    :show-file-list="false"
    @success="uploadSuccess"
  >
    <template #upload-button>
      <a-avatar v-if="shape === 'circle'" :size="100" class="info-avatar">
        <template #trigger-icon>
          <icon-camera />
        </template>
        <img :src="file?.url" />
      </a-avatar>
      <div
        v-if="shape === 'square'"
        :class="`arco-upload-list-item${
          file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
        }`"
      >
        <div
          v-if="file && file.url"
          class="arco-upload-list-picture custom-upload-avatar"
        >
          <img :src="file.url" />
          <div class="arco-upload-list-picture-mask">
            <IconEdit />
          </div>
        </div>
        <div v-else class="arco-upload-picture-card">
          <div class="arco-upload-picture-card-text">
            <IconPlus />
          </div>
        </div>
      </div>
    </template>
  </a-upload>
</template>

<script lang="ts" setup>
  import type {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { sysFilesApi } from '@/api/sys/files';
  import { Message } from '@arco-design/web-vue';

  const file = ref<FileItem>();

  const emits = defineEmits(['changeSuccess']);

  const props = defineProps({
    avatarUrl: {
      type: String,
      default: '',
    },
    shape: {
      type: String,
      default: 'circle', // circle | square
    },
  });

  const uploadSuccess = (fileItem: FileItem) => {
    if (fileItem.status === 'done') {
      const res = fileItem.response;
      const { fileUrl, fileOriginalName } = res.data;

      file.value = {
        uid: fileItem.uid,
        name: fileOriginalName,
        url: fileUrl,
      };

      emits('changeSuccess', file.value.url);
    }
  };

  const customRequest = async (options: RequestOption) => {
    const controller = new AbortController();
    const { onProgress, onError, onSuccess, fileItem, name = 'file' } = options;

    // 模拟进度（可选）
    onProgress(20);

    try {
      const formData = new FormData();
      formData.append(name as string, fileItem.file as Blob);

      const res = await sysFilesApi.upload(formData);
      onSuccess(res);
      Message.success('上传成功');
    } catch (error) {
      onError(error);
    }

    return {
      abort() {
        controller.abort();
      },
    };
  };

  watch(
    () => props.avatarUrl,
    () => {
      file.value = {
        uid: '-2',
        name: 'avatar.png',
        url: props.avatarUrl,
      };
    },
    { immediate: true }, // 👈 关键：立即执行一次
  );
</script>

<style scoped lang="less">
  :deep(.arco-avatar-trigger-icon-button) {
    width: 32px;
    height: 32px;
    line-height: 32px;
    background-color: #e8f3ff;
    .arco-icon-camera {
      margin-top: 8px;
      color: rgb(var(--arcoblue-6));
      font-size: 14px;
    }
  }
</style>
