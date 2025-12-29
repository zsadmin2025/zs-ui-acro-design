import { defineStore } from 'pinia';
import { getById, save, edit } from '@/api/sys/user';
import { sysDeptApi } from '@/api/sys/dept';
import { sysRoleApi } from '@/api/sys/role';
import { sysPostApi } from '@/api/sys/post';
import { Notification } from '@arco-design/web-vue';
import { UserAddOrEditState } from '@/types/sys/user/userTypes';

export const useUserAddOrEditStore = defineStore('userAddOrEdit', {
  state: (): UserAddOrEditState => {
    return {
      dialogFormVisible: false,
      formRef: ref(null),
      deptRef: ref(null),
      treeSelectRef: ref(null),
      deptTableRef: ref(null),
      deptTree: [] as any,
      postData: [] as any,
      deptPostData: [] as any,
      roleData: [] as any,
      deptPostTableData: [] as any,
      loading: false,
      imageUrl: '',
      form: {
        sysUserId: '',
        avatar: '',
        username: '',
        password: '',
        realName: '',
        sex: 0,
        age: 0,
        phone: '',
        email: '',
        employeeNumber: '',
        sysDeptId: '',
        sysPostId: '',
        deptPostList: [],
        roleIdList: [],
        status: 1,
      },
    };
  },
  getters: {
    rules() {
      return {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 20, message: '账号长度为5到20', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#!%^*?&+-])[A-Za-z\d$@#!%^*?&+-]{8,}/,
            message: '密码应当至少8位且含有数字、大小写字母及特殊字符',
          },
        ],
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 15, message: '姓名长度为1到15', trigger: 'blur' },
        ],
        phone: [
          {
            required: true,
            message: '请输入正确的手机号',
          },
          {
            validator: (value: any, callback: (error?: string) => void) => {
              // 手机号正则表达式：假设中国大陆手机号为11位数字且以1开头
              const phoneRegex = /^1[3456789]\d{9}$/;
              if (phoneRegex.test(value)) {
                callback();
              } else {
                callback('请输入正确的手机号');
              }
            },
          },
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
      };
    },
  },
  actions: {
    async init() {
      this.dialogFormVisible = true;
      await Promise.all([
        this.getDeptList(),
        this.getPostList(),
        this.getRoleList(),
        this.form.sysUserId ? this.getInfoById() : Promise.resolve(),
      ]);
    },

    async getInfoById() {
      const { data } = await getById(this.form.sysUserId);
      // const decryptData = sm4Decrypt(data?.encrypt);
      // this.deptRef.$emit('change', decryptData.sysDeptId);
      // this.deptPostTableData = decryptData?.deptPostList.map(
      //   (newDeptPost: { sysDeptId: any }) => {
      //     return this.postData.filter(
      //       (item: { sysDeptId: any }) =>
      //         item.sysDeptId === newDeptPost.sysDeptId,
      //     );
      //   },
      // );
      Object.assign(this.form, data);
    },

    async getDeptList() {
      const data = await sysDeptApi.getDeptTree({});
      this.deptTree = data?.data ?? [];
    },

    async getPostList() {
      const data = await sysPostApi.getList({});
      this.postData = data?.data ?? [];
    },

    async getRoleList() {
      const data = await sysRoleApi.getList();
      this.roleData = data?.data ?? [];
    },

    close() {
      this.formRef.resetFields();
      this.form.deptPostList = [];
      this.dialogFormVisible = false;
    },
    async submit(emits: (event: 'refresh') => void) {
      // 防止重复提交
      if (this.loading) return;
      try {
        if (!this.formRef) return;

        if (await this.formRef.validate()) {
          return;
        }

        this.loading = true;
        const action = this.form.sysUserId ? edit : save;
        await action(this.form);
        this.close();
        this.dialogFormVisible = false;
        this.loading = false;
        this.deptPostTableData = [];
        emits('refresh');
      } finally {
        this.loading = false;
      }
    },

    handleAvatarSuccess(uploadFile: { raw: Blob | MediaSource }) {
      this.imageUrl = URL.createObjectURL(uploadFile?.raw);
    },

    beforeAvatarUpload(rawFile: File) {
      if (rawFile.type !== 'image/jpeg') {
        Notification.info({
          title: '警告',
          content: '头像必须为 JPG 格式!',
        });
        return false;
      }

      if (rawFile.size / 1024 / 1024 > 2) {
        Notification.info({
          title: '警告',
          content: '头像大小不能超过 2MB!',
        });
        return false;
      }

      return true;
    },

    handleDeptChange(value: any) {
      this.deptPostData = [];
      this.form.sysPostId = '';
      if (value) {
        this.deptPostData = this.postData.filter((item: any) => {
          return item.sysDeptId === value;
        });
      }
    },

    handleDeptTableChange(
      value: any,
      row: { sysPostId: string },
      index: string | number,
    ) {
      this.deptPostTableData[index] = [];
      row.sysPostId = '';
      if (value) {
        this.deptPostTableData[index] = this.postData.filter((item: any) => {
          return item.sysDeptId === value;
        });
      }
    },
  },
});
