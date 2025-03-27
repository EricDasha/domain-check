# domain-check
这是一个简洁高效的域名可视化展示面板，基于Cloudflare Workers构建，它提供了一个直观的界面，让用户能够一目了然地查看他们域名的状态、注册商、注册日期、过期日期和使用进度

## 部署方法

**worker 部署**

在cf中创建一个workers，复制`_worker.js`中的代码到workers中，点击保存并部署

[![快速部署到 CF Worker](https://deploy.workers.cloudflare.com/button)](https://dash.cloudflare.com/)


## 域名信息
因为原项目json识别老是无法识别，所以干脆就直接内置了，直接进`_worker.js`里改吧(

**示例**
```
    { 
      domain: "example.comt", 
      registrationDate: "2022-2-22", 
      expirationDate: "2022-2-22", 
      system: "1145.com",
      systemURL: "https://1145.com/" 
    },
    { 
      domain: "example.com", 
      registrationDate: "2022-2-22", 
      expirationDate: "2022-2-22", 
      system: "1145.com",
      systemURL: "https://1145.com" 
    }
```
## 致谢
[yutian81](https://github.com/yutian81)
[ypq123456789](https://github.com/ypq123456789/domainkeeper)
