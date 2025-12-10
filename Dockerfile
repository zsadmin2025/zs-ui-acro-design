FROM registry.cn-beijing.aliyuncs.com/my-admin/zs-nginx:1.26.2

# 删除默认的Nginx配置文件
RUN rm /etc/nginx/conf.d/default.conf
# 打包文件放置docker目录下
COPY ./zs-acro.conf /etc/nginx/conf.d/zs-acro.conf

COPY ./dist /usr/share/nginx/html/