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
      <div
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
    modelValue: {
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
      Message.error('上传失败');
    }

    return {
      abort() {
        controller.abort();
      },
    };
  };

  watch(
    () => props.modelValue,
    () => {
      file.value = {
        uid: '-2',
        name: '1.png',
        url: props.modelValue,
      };
    },
    { immediate: true }, // 👈 关键：立即执行一次
  );
</script>
