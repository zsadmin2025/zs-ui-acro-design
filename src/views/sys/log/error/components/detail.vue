<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="60%"
    title-align="start"
    :draggable="true"
    @cancel="close"
  >
    <template #title>
      <h4>异常日志详情</h4>
    </template>

    <!-- 只有当 form 存在时才渲染 -->
    <a-descriptions
      :column="2"
      :layout="isMobile ? 'vertical' : 'horizontal'"
      bordered
      size="middle"
    >
      <a-descriptions-item label="操作用户">
        {{ form?.username }}
      </a-descriptions-item>

      <a-descriptions-item label="操作模块" :span="1">
        {{ form?.module }}
      </a-descriptions-item>

      <a-descriptions-item label="请求方法">
        <a-tag>{{ form?.requestMethod }}</a-tag>
      </a-descriptions-item>

      <a-descriptions-item label="请求路径" :span="1">
        <code
          style="
            padding: 4px 8px;
            border-radius: 4px;
            background: #f0f0f0;
            font-size: 13px;
          "
        >
          {{ form?.requestPath }}
        </code>
      </a-descriptions-item>

      <a-descriptions-item label="IP 地址">
        {{ form?.ipAddress }}
      </a-descriptions-item>

      <a-descriptions-item label="异常类型" :span="1">
        <a-tag>{{ form?.exceptionType }}</a-tag>
      </a-descriptions-item>

      <a-descriptions-item label="发生时间" :span="2">
        {{ form?.createTime }}
      </a-descriptions-item>

      <!-- 请求参数（JSON）折叠展示 -->
      <a-descriptions-item label="请求参数" :span="2">
        <pre
          v-if="form?.requestParams"
          style="
            margin: 0;
            padding: 12px;
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            overflow-y: auto;
            width: 100%;
            white-space: pre-wrap;
          "
          >{{ formatJson(form?.requestParams) }}
        </pre>
        <span v-else>无</span>
      </a-descriptions-item>

      <!-- 异常堆栈信息 -->
      <a-descriptions-item label="异常信息" :span="2">
        <div
          style="
            padding: 12px;
            background: #fff0f0;
            border: 1px solid #ffcdd2;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            overflow-y: auto;
            color: #d32f2f;
            white-space: pre-wrap;
          "
        >
          {{ form?.exceptionMessage || '暂无异常堆栈信息' }}
        </div>
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  // 表单数据响应式
  const dialogFormVisible = ref(false);
  const form = ref<any>(null);

  // 判断是否移动端
  const isMobile = window.innerWidth < 768;

  // 打开弹窗并赋值
  const open = (data: any) => {
    dialogFormVisible.value = true;
    form.value = null; // 清空旧数据
    // 延迟赋值防止闪现
    setTimeout(() => {
      form.value = { ...data };
    }, 50);
  };

  // 关闭弹窗
  const close = () => {
    dialogFormVisible.value = false;
    form.value = null;
  };

  // 格式化 JSON 显示
  const formatJson = (jsonStr: string): string => {
    try {
      return JSON.stringify(JSON.parse(jsonStr), null, 2);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('JSON 格式化失败:', e);
      return jsonStr || '非 JSON 数据';
    }
  };

  // 暴露方法给父组件调用
  defineExpose({
    open,
  });
</script>

<style scoped></style>
