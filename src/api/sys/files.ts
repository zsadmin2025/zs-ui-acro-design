import axios from 'axios';

export const sysFilesApi = {
  // formData附件上传
  upload(data: any) {
    return axios.post('/system/file/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploads(data: any) {
    return axios.post('/system/file/uploads', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
