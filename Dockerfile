# 指定我们的基础镜像是node，版本是v9.4.0
FROM node:9.4.0
# 指定制作我们的镜像的联系人信息（镜像创建者）
MAINTAINER moyumin

# 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的app文件夹下
COPY . /frontend/
# cd到app文件夹下
WORKDIR /frontend

# 安装项目依赖包
RUN npm install
RUN npm run build
# 配置环境变量
ENV HOST 0.0.0.0
ENV PORT 8080

# 容器对外暴露的端口号
EXPOSE 8080

# 容器启动时执行的命令，类似npm run start
CMD ["npm", "start"]
