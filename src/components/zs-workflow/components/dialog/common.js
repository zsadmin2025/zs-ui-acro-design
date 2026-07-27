/*
 * @Date: 2022-08-29 14:00:42
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-29 15:53:05
 * @FilePath: /Workflow-Vue3/src/components/dialog/common.js
 */

import { ref } from 'vue';
import $func from '../../utils/index.js';
import { getRoles, getDepartments, getEmployees } from '../../api/index.js';

export const searchVal = ref('');
export const departments = ref({
  titleDepartments: [],
  childDepartments: [],
  employees: [],
});
export const roles = ref({});
export const getRoleList = async () => {
  const {
    data: { list },
  } = await getRoles();
  roles.value = list;
};
export const getDepartmentList = async (parentId = 0) => {
  const { data } = await getDepartments({ parentId });
  departments.value = data;
};
export const getDebounceData = (event, type = 1) => {
  $func.debounce(async () => {
    if (event.target.value) {
      const data = {
        searchName: event.target.value,
        pageNum: 1,
        pageSize: 30,
      };
      if (type === 1) {
        departments.value.childDepartments = [];
        const res = await getEmployees(data);
        departments.value.employees = res.data.list;
      } else {
        const res = await getRoles(data);
        roles.value = res.data.list;
      }
    } else {
      const result =
        type === 1 ? await getDepartmentList() : await getRoleList(); // 重新获取数据
    }
  })();
};
