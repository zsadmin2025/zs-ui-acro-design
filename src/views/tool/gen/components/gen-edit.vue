<template>
  <a-drawer
    width="80%"
    :visible="visible"
    unmount-on-close
    @cancel="genEditStore.close"
  >
    <template #title>{{ genTable.tableName + '表' }}</template>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" title="基本配置">
        <a-form ref="formRef" :model="genTable" :rules="rules" auto-label-width>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="表名称" field="tableName">
                <a-input
                  v-model="genTable.tableName"
                  placeholder="请输入表名称"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="表描述" field="tableComment">
                <a-input
                  v-model="genTable.tableComment"
                  placeholder="请输入表描述"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="实体类名称(首字母大写)" field="className">
                <a-input
                  v-model="genTable.className"
                  placeholder="请输入实体类名称"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="包名称" field="packageName">
                <a-input
                  v-model="genTable.packageName"
                  placeholder="请输入包名称,如:com.zs"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="模块名" field="moduleName">
                <a-input
                  v-model="genTable.moduleName"
                  placeholder="请输入模块名,system"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="业务名" field="businessName">
                <a-input
                  v-model="genTable.businessName"
                  placeholder="请输入业务名,如：demo"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="功能名" field="functionName">
                <a-input
                  v-model="genTable.functionName"
                  placeholder="请输入功能名,如：代码生成"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="作者" field="functionAuthor">
                <a-input
                  v-model="genTable.functionAuthor"
                  placeholder="请输入作者"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="上级菜单" field="parentMenuId">
                <a-tree-select
                  v-model="genTable.parentMenuId"
                  :data="formattedList"
                  placeholder="请选择上级菜单"
                  :allow-search="true"
                  :allow-clear="true"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" title="生成配置">
        <a-table
          :columns="columns"
          :data="data"
          :pagination="false"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #columnName="{ record }">
            <a-input v-model="record.columnName" />
          </template>
          <template #columnComment="{ record }">
            <a-input v-model="record.columnComment" />
          </template>
          <template #columnType="{ record }">
            <a-input v-model="record.columnType" />
          </template>
          <template #columnLength="{ record }">
            <a-input v-model="record.columnLength" />
          </template>
          <template #javaType="{ record }">
            <a-select v-model="record.javaType">
              <a-option value="Long">Long</a-option>
              <a-option value="String">String</a-option>
              <a-option value="Integer">Integer</a-option>
              <a-option value="Double">Double</a-option>
              <a-option value="BigDecimal">BigDecimal</a-option>
              <a-option value="Date">Date</a-option>
              <a-option value="Boolean">Boolean</a-option>
            </a-select>
          </template>
          <template #javaField="{ record }">
            <a-input v-model="record.javaField" />
          </template>
          <template #isInsert="{ record }">
            <a-checkbox v-model="record.isInsert"></a-checkbox>
          </template>
          <template #isEdit="{ record }">
            <a-checkbox v-model="record.isEdit"></a-checkbox>
          </template>
          <template #isList="{ record }">
            <a-checkbox v-model="record.isList"></a-checkbox>
          </template>
          <template #isQuery="{ record }">
            <a-checkbox v-model="record.isQuery"></a-checkbox>
          </template>
          <template #isExport="{ record }">
            <a-checkbox v-model="record.isExport"></a-checkbox>
          </template>
          <template #queryType="{ record }">
            <a-select v-model="record.queryType" style="width: 100%">
              <a-option value="EQ">等于</a-option>
              <a-option value="NE">不等于</a-option>
              <a-option value="GT">大于</a-option>
              <a-option value="LT">小于</a-option>
              <a-option value="GTE">大于等于</a-option>
              <a-option value="LTE">小于等于</a-option>
              <a-option value="LIKE">模糊</a-option>
              <a-option value="BETWEEN">范围</a-option>
            </a-select>
          </template>
          <template #isRequired="{ record }">
            <a-checkbox v-model="record.isRequired"></a-checkbox>
          </template>
          <template #htmlType="{ record }">
            <a-select v-model="record.htmlType" style="width: 100%">
              <a-option value="input">文本框</a-option>
              <a-option value="textarea">文本域</a-option>
              <a-option value="number">数字框</a-option>
              <a-option value="select">下拉框</a-option>
              <a-option value="radio">单选框</a-option>
              <a-option value="checkbox">复选框</a-option>
              <a-option value="date">日期控件</a-option>
              <a-option value="datetime">日期时间控件</a-option>
              <a-option value="time">时间控件</a-option>
              <a-option value="image">图片上传</a-option>
              <a-option value="upload">文件上传</a-option>
              <a-option value="editor">富文本</a-option>
            </a-select>
          </template>
          <template #dictType="{ record }">
            <a-select
              v-model="record.dictType"
              style="width: 100%"
              placeholder="请选择字典"
              allow-clear
            >
              <a-option
                v-for="item in tableData"
                :key="item.dictType"
                :value="item.dictType"
                >{{ item.dictName }}</a-option
              >
            </a-select>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <template #footer>
      <a-button @click="genEditStore.close">取消</a-button>
      <a-button type="primary" :loading="loading" @click="genEditStore.submit()"
        >提交</a-button
      >
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useGenEditStore } from '@/store/modules/tool/gen/genEditStore';
  import { useMenuAddOrEditStore } from '@/store/modules/sys/menu/menuAddOrEditStore';
  import { useDictTypeStore } from '@/store/modules/sys/dict/dictTypeStore';

  const genEditStore = useGenEditStore();
  const { visible, formRef, genTable, loading } = storeToRefs(genEditStore);

  const menuAddOrEditStore = useMenuAddOrEditStore();
  const { list } = storeToRefs(menuAddOrEditStore);

  const dictTypeStore = useDictTypeStore();
  const { tableData } = storeToRefs(dictTypeStore);
  const data = computed(() => genTable.value.columns ?? []);

  const convertList = (treeData: any) => {
    return treeData.map((item: any) => ({
      key: item.sysMenuId,
      title: item.title,
      children: item.children ? convertList(item.children) : null,
    }));
  };
  const formattedList = computed(() => convertList(list.value));

  const rules = {
    tableName: [{ required: true, message: '请输入表名称', trigger: 'blur' }],
    tableComment: [
      { required: true, message: '请输入表描述', trigger: 'blur' },
    ],
    className: [{ required: true, message: '请输入类名称', trigger: 'blur' }],
    packageName: [{ required: true, message: '请输入包名称', trigger: 'blur' }],
    moduleName: [
      { required: true, message: '请输入模块名称', trigger: 'blur' },
    ],
    businessName: [
      { required: true, message: '请输入业务名称', trigger: 'blur' },
    ],
    functionName: [
      { required: true, message: '请输入功能名称', trigger: 'blur' },
    ],
    functionAuthor: [
      { required: true, message: '请输入作者名称', trigger: 'blur' },
    ],
    parentMenuId: [
      { required: true, message: '请输入父菜单ID', trigger: 'blur' },
    ],
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      align: 'center',
      fixed: 'left',
      render: ({ rowIndex }: { rowIndex: number }) => `${rowIndex + 1}`,
    },
    {
      title: '列名',
      dataIndex: 'columnName',
      slotName: 'columnName',
      align: 'center',
    },
    {
      title: '列描述',
      dataIndex: 'columnComment',
      slotName: 'columnComment',
      align: 'center',
    },
    {
      title: '列类型',
      dataIndex: 'columnType',
      slotName: 'columnType',
      align: 'center',
    },
    {
      title: '列长度',
      dataIndex: 'columnLength',
      slotName: 'columnLength',
      align: 'center',
    },
    {
      title: 'java类型',
      dataIndex: 'javaType',
      slotName: 'javaType',
      align: 'center',
    },
    {
      title: 'java属性',
      dataIndex: 'javaField',
      slotName: 'javaField',
      align: 'center',
    },
    {
      title: '插入',
      dataIndex: 'isInsert',
      slotName: 'isInsert',
      align: 'center',
      width: 80,
    },
    {
      title: '编辑',
      dataIndex: 'isEdit',
      slotName: 'isEdit',
      align: 'center',
      width: 80,
    },
    {
      title: '列表',
      dataIndex: 'isList',
      slotName: 'isList',
      align: 'center',
      width: 80,
    },
    {
      title: '查询',
      dataIndex: 'isQuery',
      slotName: 'isQuery',
      align: 'center',
      width: 80,
    },
    {
      title: '导出',
      dataIndex: 'isExport',
      slotName: 'isExport',
      align: 'center',
      width: 80,
    },
    {
      title: '查询方式',
      dataIndex: 'queryType',
      slotName: 'queryType',
      align: 'center',
      width: 150,
    },
    {
      title: '必填',
      dataIndex: 'isRequired',
      slotName: 'isRequired',
      align: 'center',
      width: 80,
    },
    {
      title: '显示类型',
      dataIndex: 'htmlType',
      slotName: 'htmlType',
      align: 'center',
      width: 150,
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      slotName: 'dictType',
      align: 'center',
      width: 150,
    },
  ];

  onMounted(() => {
    menuAddOrEditStore.init();
    dictTypeStore.loadDictTypeList();
  });

  defineExpose({
    init: genEditStore.init,
    genTable,
  });
</script>
