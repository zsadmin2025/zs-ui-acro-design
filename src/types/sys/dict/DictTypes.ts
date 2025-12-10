export interface DictTypeAddOrEditForm {
  sysDictTypeId: string;
  dictType: string;
  dictName: string;
  sort: number;
  status: number;
}

// 树节点类型
export interface DictTypeTreeNode {
  sysDictTypeId: string;
  dictName: string;
  children?: any[];
}

// 查询表单类型
export interface DictTypeQueryForm {
  dictType: string;
  dictName: string;
  status: number;
}

export interface DictTypeState {
  dictTypeRef: any;
  dictTypeTreeData: DictTypeTreeNode[];
  expandedKeys: string[];
  dictTypeFormRef: any;
  addEditRef: any;
  loading: boolean;
  tableData: any[];
  total: number;
  form: DictTypeQueryForm;
}

export interface DictType {
  id: string;
  typeName: string;
  typeCode: string;
  status: number;
  remark: string;
  sort: number;
}

export interface DictTypeAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: DictTypeAddOrEditForm;
}
