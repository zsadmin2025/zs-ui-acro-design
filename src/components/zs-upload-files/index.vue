<template>
  <div class="upload">
    <a-upload
      :custom-request="customRequest"
      :show-retry-button="true"
      :file-list="fileList"
      :multiple="props.multiple"
      :draggable="draggable"
      :limit="limit"
      :show-link="false"
      tip="支持上传文件，文件名不能包含特殊字符"
      @before-upload="beforeUpload"
      @before-remove="beforeRemove"
    >
      <template #preview-icon>
        <span class="arco-upload-icon arco-upload-icon-preview">
          <icon-eye />
        </span>
      </template>
      <template #extra-button="{ fileItem }">
        <a-button
          shape="circle"
          type="text"
          size="mini"
          @click="downloadFile(fileItem.url, fileItem.name)"
        >
          <icon-download />
        </a-button>
      </template>
      <!-- <template #upload-item="{ fileItem, index }">
        <div :key="index" class="arco-upload-list arco-upload-list-type-text">
          <div
            :key="index"
            class="arco-upload-list-item arco-upload-list-item-done"
          >
            <div class="arco-upload-list-item-content">
              <div class="arco-upload-list-item-name">
                <span class="arco-upload-list-item-file-icon">
                  <icon-file />
                </span>
                <a
                  class="arco-upload-list-item-name-link"
                  href="javascript:void(0);"
                  @click="downloadFile(fileItem.url, fileItem.name)"
                >
                  {{ fileItem.name }}
                </a>
              </div>
              <span class="arco-upload-progress"></span>
            </div>
            <span class="arco-upload-list-item-operation">
              <span class="arco-icon-hover">
                <span class="arco-upload-icon arco-upload-icon-remove">
                  <icon-delete @click="del(fileItem, index)" />
                </span>
              </span>
            </span>
          </div>
        </div>
      </template> -->
    </a-upload>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, defineProps, defineEmits } from 'vue';
  import { Modal } from '@arco-design/web-vue';
  import download from '@/utils/fileDownload';

  import type {
    FileItem,
    RequestOption,
    FileStatus,
  } from '@arco-design/web-vue/es/upload/interfaces';

  import { sysFilesApi } from '@/api/sys/files';

  // Props 定义
  const props = defineProps({
    multiple: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 0,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Array as () => any[],
      default: () => [],
    },
  });

  // Emits 定义
  const emits = defineEmits(['update:modelValue', 'add', 'remove']);

  // 文件列表状态
  const fileList = ref<FileItem[]>([]);

  // 回显数据 Watcher
  watch(
    () => props.modelValue,
    (newVal) => {
      if (!Array.isArray(newVal)) return;
      const now = Date.now();
      fileList.value = newVal.map((item) => ({
        file: new File([], item.fileName, { type: item.fileType }),
        name: item.fileOriginalName,
        percent: 100,
        response: {
          code: 200,
          data: {
            fileOriginalName: item.fileOriginalName,
            fileUrl: item.fileUrl,
          },
        },
        status: 'done' as FileStatus,
        uid: item.uid || `${now}-${Math.random()}`,
        url: item.fileUrl,
      }));
    },
    { immediate: true },
  );

  // 上传前校验
  const beforeUpload = (file: File): boolean => {
    // if (file.type !== 'application/pdf') {
    //   Modal.error({ title: '上传失败', content: '只能上传 PDF 文件' });
    //   return false;
    // }

    const illegalChars = /[@!#$%^&*?<>\\'+:]/g;
    if (illegalChars.test(file.name)) {
      Modal.error({
        title: '上传失败',
        content: '文件名包含非法字符，请修改后再上传',
      });
      return false;
    }

    return true;
  };

  // 删除前确认
  const beforeRemove = (file: FileItem): Promise<boolean> => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: `确认删除 ${file.name}`,
        onOk: () => {
          const updatedList = fileList.value.filter(
            (item) => item.uid !== file.uid,
          );
          fileList.value = updatedList;

          if (file.response?.code === 200) {
            emits('remove', file.response.data);
          }

          resolve(true);
        },
        onCancel: () => resolve(false),
      });
    });
  };

  // 自定义上传逻辑
  const customRequest = (options: RequestOption): { abort: () => void } => {
    const controller = new AbortController();

    (async () => {
      const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        name = 'file',
      } = options;
      const formData = new FormData();
      formData.append(name as string, fileItem.file as Blob);

      try {
        onProgress(20);
        const res = await sysFilesApi.upload(formData);
        emits('add', res.data);
        onSuccess(res);
      } catch (error) {
        onError(error);
      }
    })();

    return {
      abort: () => controller.abort(),
    };
  };

  const downloadFile = async (url: string, fileName: string) => {
    download.url(url, fileName);
  };
</script>

<style scoped lang="less">
  .upload-container {
    .arco-upload {
      border: none;
      padding: 0;
    }

    .file-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 6px 12px;
      background-color: #f7f7f7;
      margin-bottom: 4px;

      &:hover {
        background-color: #f0f0f0;
      }

      .file-icon {
        margin-right: 8px;
        color: #999;
      }

      .file-name {
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 200px;
      }

      .file-status {
        font-size: 16px;
        margin-left: auto;
        margin-right: 16px;
        &.success {
          color: green;
        }
        &.error {
          color: red;
        }
        &.processing {
          color: #666;
        }
      }

      .delete-btn {
        color: #999;
        &:hover {
          color: #555;
        }
      }
    }
  }
</style>
