import { getToken, getTenantId } from '@/utils/auth';
/**
 * 通用文件下载方法
 * @param data - Blob 数据
 * @param fileName - 下载的文件名
 * @param mimeType - MIME 类型
 */
const downloadFile = async (
  data: Blob,
  fileName: string,
  mimeType: string,
): Promise<void> => {
  // 如果 data 已经是 Blob，则直接使用，否则创建新的 Blob
  const blob =
    data instanceof Blob ? data : new Blob([data], { type: mimeType });
  try {
    // 使用类型断言绕过 msSaveBlob 类型检查
    if ((window.navigator as any).msSaveBlob) {
      // 兼容 IE 浏览器
      (window.navigator as any).msSaveBlob(blob, fileName);
    } else {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // 确保点击事件完成
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error downloading file:', error);
  }
};

/**
 * 下载文件
 * @param url - 文件下载地址
 * @param fileName - 文件名
 */
const downloadFileFromUrl = async (url: string, fileName: string) => {
  const token = getToken();
  const tenantId = getTenantId();

  if (!url) {
    return;
  }

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    // 添加租户ID头部（如果存在）
    if (tenantId) {
      headers['X-Tenant-Id'] = tenantId;
    }

    const response = await fetch(url as string, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return;
    }

    const blob = await response.blob(); // 获取二进制流
    const downloadUrl = window.URL.createObjectURL(blob);

    // 创建 a 标签进行下载
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName || 'download'; // 设置下载后的文件名
    a.style.display = 'none'; // 隐藏 a 标签
    document.body.appendChild(a);
    a.click();

    // 清理对象 URL
    window.URL.revokeObjectURL(downloadUrl);
    a.remove();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('下载文件失败：', error);
  }
};

/**
 * 加载受保护的图片为可预览的 Object URL
 * @param url - 受保护的图片地址
 * @returns Object URL 字符串，或 null（失败时）
 */
const loadImageAsObjectUrl = async (url: string): Promise<string | null> => {
  if (!url) return null;

  const token = getToken();
  const tenantId = getTenantId();

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    if (tenantId) {
      headers['X-Tenant-Id'] = tenantId;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    // 确保是图片类型
    if (!blob.type.startsWith('image/')) {
      return null;
    }

    return URL.createObjectURL(blob);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading image as object URL:', error);
    return null;
  }
};

/**
 * 专用下载函数集合
 */
const download = {
  /**
   * 下载 Excel 文件
   * @param data - Blob 数据
   * @param fileName - 文件名（不含扩展名）
   */
  excel: (data: Blob, fileName: string): void => {
    downloadFile(data, fileName, 'application/vnd.ms-excel');
  },

  /**
   * 下载 Word 文件
   * @param data - Blob 数据
   * @param fileName - 文件名（不含扩展名）
   */
  word: (data: Blob, fileName: string): void => {
    downloadFile(data, fileName, 'application/msword');
  },

  zip: (data: Blob, fileName: string): void => {
    downloadFile(data, fileName, 'application/zip');
  },
  /**
   * 通过 URL 下载文件
   * @param url - 文件下载地址
   * @param fileName - 文件名
   */
  url: (url: string, fileName: string) => {
    return downloadFileFromUrl(url, fileName);
  },
  /**
   * 加载受保护的图片为可预览的 Object URL
   * @param url - 受保护的图片地址
   * @returns Object URL 字符串，或 null（失败时）
   */

  image: (url: string): Promise<string | null> => {
    return loadImageAsObjectUrl(url);
  },
};

export default download;
