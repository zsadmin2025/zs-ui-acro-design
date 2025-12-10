<template>
  <div style="border: 1px solid #ccc; z-index: 999; width: 100%">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      v-model="valueHtml"
      style="height: 500px; overflow-y: hidden"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
      @on-change="handleChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import '@wangeditor/editor/dist/css/style.css';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { IDomEditor } from '@wangeditor/editor';

  const mode = 'simple'; // or 'default'
  const editorRef = shallowRef();
  const valueHtml = ref('');
  const toolbarConfig = {
    toolbarKeys: [
      'bold', // 加粗
      'italic', // 斜体
      'through', // 删除线
      'underline', // 下划线
      'bulletedList', // 无序列表
      'numberedList', // 有序列表
      'color', // 文字颜色
      'insertLink', // 插入链接
      'fontSize', // 字体大小
      'lineHeight', // 行高
      'uploadImage', // 上传图片
      'delIndent', // 缩进
      'indent', // 增进
      'deleteImage', // 删除图片
      'divider', // 分割线
      'insertImage', // 网络图片
      'insertTable', // 插入表格
      'justifyCenter', // 居中对齐
      'justifyJustify', // 两端对齐
      'justifyLeft', // 左对齐
      'justifyRight', // 右对齐
      'undo', // 撤销
      'redo', // 重做
      'clearStyle', // 清除格式
      'fullScreen', // 全屏
    ],
    excludeKeys: [
      'bgColor', // 背景色
      'blockquote', // 引用
      'codeBlock', // 代码段
      'emotion', // 表情
      'fontFamily', // 字体
      'headerSelect', // 标题
    ],
  };
  const editorConfig = { placeholder: '请输入内容...' };
  const props = defineProps({
    modelValue: String, // 接收一个名为 modelValue 的 prop
  });

  const handleCreated = (editor: IDomEditor) => {
    editorRef.value = editor;

    // ✅ 只有在 editor 创建后，才设置初始内容
    if (props.modelValue) {
      valueHtml.value = props.modelValue;
    }
  };
  const emits = defineEmits(['update:modelValue', 'change']);
  const handleChange = (editor: IDomEditor) => {
    // editor 变化时，更新 model 绑定的值
    valueHtml.value = editor.getHtml();
    emits('update:modelValue', valueHtml.value);
    emits('change', valueHtml.value);
  };

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });

  // 初始化时，将传入的 modelValue 赋值给内部的 valueHtml
  watch(
    () => props.modelValue,
    (newValue) => {
      if (!editorRef.value) return; // 防止 editor 未创建时设置
      if (valueHtml.value !== newValue) {
        valueHtml.value = newValue ?? ''; // 当传入的 modelValue 变化时，更新内部值
      }
    },
  );
</script>

<style scoped>
  .w-e-full-screen-container {
    z-index: 1000 !important;
  }
</style>
