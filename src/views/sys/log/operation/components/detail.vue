<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="60%"
    title-align="start"
    :draggable="true"
    @cancel="close"
  >
    <template #title>
      <h4>操作日志详情</h4>
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

      <a-descriptions-item label="操作类型">
        <a-tag color="blue">{{
          formatOperationType(form?.operationType)
        }}</a-tag>
      </a-descriptions-item>

      <a-descriptions-item label="操作描述" :span="2">
        {{ form?.operationDescription }}
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

      <a-descriptions-item label="响应状态码">
        <a-tag :color="getStatusCodeColor(form?.responseStatusCode)">
          {{ form?.responseStatusCode }}
        </a-tag>
      </a-descriptions-item>

      <a-descriptions-item label="响应消息" :span="1">
        {{ form?.responseMessage }}
      </a-descriptions-item>

      <a-descriptions-item label="操作耗时">
        {{ form?.operationDuration }} ms
      </a-descriptions-item>

      <a-descriptions-item label="IP 地址">
        {{ form?.ipAddress }}
      </a-descriptions-item>

      <a-descriptions-item label="创建时间" :span="2">
        {{ form?.createTime }}
      </a-descriptions-item>

      <!-- 请求参数（JSON）折叠展示 -->
      <a-descriptions-item label="请求参数" :span="2">
        <pre
          style="
            margin: 0;
            padding: 12px;
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            max-height: 300px;
            overflow-y: auto;
            width: 100%;
            white-space: pre-wrap;
          "
          >{{ formatJson(form?.requestParams) }}
        </pre>
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  // 表单数据响应式
  const dialogFormVisible = ref(false);
  const form = ref<any>(null);

  // 判断是否移动端（可选：适配响应式）
  const isMobile = window.innerWidth < 768;

  // 打开弹窗并赋值
  const open = (data: any) => {
    dialogFormVisible.value = true;
    form.value = null; // 清空旧数据
    // 延迟赋值，避免闪现旧内容
    setTimeout(() => {
      form.value = { ...data }; // 深拷贝防污染
    }, 50);
  };

  // 关闭弹窗
  const close = () => {
    dialogFormVisible.value = false;
    form.value = null; // 关闭时清空
  };

  // 工具方法：格式化操作类型
  const formatOperationType = (type: string): string => {
    const map: Record<string, string> = {
      ADD: '新增',
      EDIT: '修改',
      DELETE: '删除',
      QUERY: '查询',
    };
    return map[type] || type;
  };

  // 工具方法：状态码颜色
  const getStatusCodeColor = (code: number): string => {
    if (code >= 200 && code < 300) return 'green';
    if (code >= 400) return 'red';
    return 'orange';
  };

  // 工具方法：美化 JSON 显示
  // 工具方法：美化 JSON 显示
  const formatJson = (jsonStr: string): string => {
    try {
      return JSON.stringify(JSON.parse(jsonStr), null, 2);
    } catch (e) {
      return jsonStr || '解析失败';
    }
  };

  // 暴露方法给父组件调用
  defineExpose({
    open,
  });
</script>
