// HTML类型联合类型
export type HtmlType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'datetime'
  | 'image'
  | 'upload'
  | 'editor';

// 查询方式联合类型
export type QueryType =
  | 'EQ'
  | 'NE'
  | 'GT'
  | 'LT'
  | 'GTE'
  | 'LTE'
  | 'LIKE'
  | 'BETWEEN';

// Java类型联合类型
export type JavaType =
  | 'Long'
  | 'String'
  | 'Integer'
  | 'Double'
  | 'BigDecimal'
  | 'Date'
  | 'Boolean';

export interface GenTableColumn {
  columnId: number; // 编号
  tableId: number; // 归属表编号
  columnName: string; // 列名称
  columnComment?: string; // 列描述
  columnType: string; // 列类型
  javaType: JavaType; // JAVA类型
  javaField: string; // JAVA字段名
  isPk: string; // 是否主键（1是）
  isIncrement: string; // 是否自增（1是）
  isRequired: string; // 是否必填（1是）
  isInsert: string; // 是否为插入字段（1是）
  isEdit: string; // 是否编辑字段（1是）
  isList: string; // 是否列表字段（1是）
  isQuery: string; // 是否查询字段（1是）
  queryType: QueryType; // 查询方式（EQ等于、NE不等于、GT大于、LT小于、LIKE模糊、BETWEEN范围）
  htmlType: HtmlType; // 显示类型（input文本框、textarea文本域、select下拉框等）
  dictType?: string; // 字典类型
}

export interface GenTable {
  tableId: string; // 表ID
  tableName: string; // 表名称
  tableComment: string; // 表描述
  className: string; // 类名称
  packageName: string; // 包名称
  moduleName: string; // 模块名称
  businessName: string; // 业务名称
  functionName: string; // 生成功能名
  functionAuthor: string; // 生成功能作者
  parentMenuId: string; // 父菜单ID
  parentMenuName: string; // 父菜单名称
  columns: GenTableColumn[];
}

export interface GenTablePageForm {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}

export interface GenState {
  addEditRef: any;
  genEditRef: any;
  genPreviewRef: any;
  list: GenTable[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: GenTablePageForm;
}

export interface GenTableState {
  dialogFormVisible: boolean;
  list: GenTable[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: GenTablePageForm;
}

export interface GenTableEditState {
  visible: boolean;
  formRef: any;
  genTable: GenTable;
  total: number;
  loading: boolean;
}
