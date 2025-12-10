export interface DictData {
  sysDictDataId: string;
  sysDictTypeId: string;
  pid: string;
  dictType: string;
  dictLabel: string;
  dictValue: string;
  status: number;
}

export interface DictDataPageForm {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface DictDataState {
  dictDataFormRef: any;
  addEditRef: any;
  loading: boolean;
  list: DictData[];
  total: number;
  form: DictDataPageForm;
  selectedKeys: any[];
  dictDataMap: any;
}

export interface DictDataAddOrEditForm {
  sysDictDataId: string;
  sysDictTypeId: string;
  pid: string;
  pidName: string;
  dictType: string;
  dictLabel: string;
  dictValue: string;
  sort: number;
  status: number;
}

export interface DictDataAddOrEditState {
  dialogFormVisible: boolean;
  formRef: any;
  loading: boolean;
  dictTypeList: any[];
  dictDataList: any[];
  form: DictDataAddOrEditForm;
}
