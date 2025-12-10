export const variables = {
  navHeight: '60px', // 导航栏高度
  tabsHeight: '33px', // 标签栏高度
  breadcrumbHeight: '24px', // 面包屑高度
  footerHeight: '30px', // 底部高度
  basePadding: '10px', // 基础padding
  borderRadius: '4px', // 圆角

  headerBoxHeight: '50px', // zs-container布局中header-box-height高度
  footerBoxHeight: '50px', // zs-container布局中footer-box-height高度
  rightMainHeaderHeight: '40px', // zs-container布局中right-main-header高度
};

export const setCssVariables = () => {
  const rootStyle = document.documentElement.style;

  Object.entries(variables).forEach(([key, value]) => {
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    rootStyle.setProperty(cssVarName, value);
  });
};
