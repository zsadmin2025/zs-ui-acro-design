import axios from 'axios';

export const sysConfigApi = {
  // 修改配置
  edit(data: any) {
    return axios.post('/system/sys/config/update', data);
  },

  // 获取网站信息配置
  getWebsiteInfo() {
    return axios.get('/system/sys/config/website');
  },

  // 获取文件上传配置
  getUploadConfig() {
    return axios.get('/system/sys/config/file');
  },

  // 获取邮件配置
  getMailConfig() {
    return axios.get('/system/sys/config/email');
  },

  // 获取短信配置
  getSmsConfig() {
    return axios.get('/system/sys/config/sms');
  },

  // 获取支付配置
  getPayConfig() {
    return axios.get('/system/sys/config/pay');
  },

  // 获取其他配置
  getOtherConfig() {
    return axios.get('/system/sys/config/other');
  },
};
