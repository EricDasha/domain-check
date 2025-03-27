// 配置部分 - 直接修改这里的值即可
const CONFIG = {
  SITE_NAME: "我的域名管理",      // 网站标题
  SITE_ICON: "https://pan.811520.xyz/icon/domain.png",  // 网站图标
  BG_IMAGE: "https://bing.img.run/1920x1080.php",       // 背景图片
  DAYS_BEFORE_EXPIRE: 30,        // 提前多少天显示警告（黄色状态）
  
  // 域名数据 - 已填入您提供的域名
  DOMAINS: [
    { 
      domain: "example.comt", 
      registrationDate: "2022-2-22", 
      expirationDate: "2022-2-22", 
      system: "example.com",
      systemURL: "https://1145.com/" 
    },
    { 
      domain: "example.com", 
      registrationDate: "2022-2-22", 
      expirationDate: "2022-2-22", 
      system: "example.com",
      systemURL: "https://example.com" 
    }
  ]
};

// 主处理函数
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  try {
    const htmlContent = generateHTML();
    return new Response(htmlContent, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new Response("生成页面时出错: " + error.message, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// 生成HTML内容
function generateHTML() {
  const rows = CONFIG.DOMAINS.map(info => {
    const registrationDate = new Date(info.registrationDate);
    const expirationDate = new Date(info.expirationDate);
    const today = new Date();
    
    // 计算各种时间数据
    const totalDays = Math.ceil((expirationDate - registrationDate) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((today - registrationDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
    const progressPercentage = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
    
    // 确定域名状态
    let statusColor, statusText;
    if (today > expirationDate) {
      statusColor = '#e74c3c';  // 红色-已过期
      statusText = '已过期';
    } else if (daysRemaining <= CONFIG.DAYS_BEFORE_EXPIRE) {
      statusColor = '#f39c12';  // 黄色-即将过期
      statusText = '即将过期';
    } else {
      statusColor = '#2ecc71';  // 绿色-正常
      statusText = '正常';
    }
    
    // 生成表格行
    return `
      <tr>
        <td><span class="status-dot" style="background-color: ${statusColor};" title="${statusText}"></span></td>
        <td>${info.domain}</td>
        <td><a href="${info.systemURL}" target="_blank" rel="noopener noreferrer">${info.system}</a></td>
        <td>${formatDate(registrationDate)}</td>
        <td>${formatDate(expirationDate)}</td>
        <td class="${today > expirationDate ? 'expired' : 'active'}">
          ${today > expirationDate ? '已过期' : `${daysRemaining} 天`}
        </td>
        <td>
          <div class="progress-bar" title="已使用 ${Math.round(progressPercentage)}%">
            <div class="progress" style="width: ${progressPercentage}%;"></div>
            <div class="progress-text">${Math.round(progressPercentage)}%</div>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // 完整的HTML页面
  return `
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${CONFIG.SITE_NAME}</title>
    <link rel="icon" href="${CONFIG.SITE_ICON}" type="image/png">
    <style>
      :root {
        --primary-color: #3498db;
        --success-color: #2ecc71;
        --warning-color: #f39c12;
        --danger-color: #e74c3c;
        --text-color: #333;
        --light-bg: rgba(255, 255, 255, 0.85);
        --table-header-bg: rgba(242, 242, 242, 0.9);
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-image: url('${CONFIG.BG_IMAGE}');
        background-size: cover;
        background-attachment: fixed;
        color: var(--text-color);
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      
      .container {
        flex: 1;
        width: 95%;
        max-width: 1400px;
        margin: 20px auto;
        background-color: var(--light-bg);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
        backdrop-filter: blur(5px);
      }
      
      h1 {
        background-color: var(--primary-color);
        color: white;
        padding: 20px;
        margin: 0;
        font-size: 1.8rem;
        text-align: center;
      }
      
      .table-container {
        width: 100%;
        overflow-x: auto;
        padding: 10px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        white-space: nowrap;
        table-layout: fixed;
      }
      
      th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      
      th {
        background-color: var(--table-header-bg);
        font-weight: bold;
        position: sticky;
        top: 0;
      }
      
      .status-dot {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        vertical-align: middle;
      }
      
      .progress-bar {
        width: 100%;
        min-width: 120px;
        height: 25px;
        background-color: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
      }
      
      .progress {
        height: 100%;
        background-color: var(--primary-color);
        transition: width 0.3s ease;
      }
      
      .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.8rem;
        color: #333;
        font-weight: bold;
      }
      
      a {
        color: var(--primary-color);
        text-decoration: none;
        transition: color 0.2s;
      }
      
      a:hover {
        color: var(--warning-color);
        text-decoration: underline;
      }
      
      .expired {
        color: var(--danger-color);
        font-weight: bold;
      }
      
      .active {
        color: var(--success-color);
      }
      
      .footer {
        text-align: center;
        padding: 15px;
        background-color: var(--primary-color);
        color: white;
        font-size: 0.9rem;
        margin-top: auto;
      }
      
      .footer a {
        color: white;
        margin: 0 10px;
      }
      
      .footer a:hover {
        color: #f1c40f;
      }
      
      @media (max-width: 768px) {
        th, td {
          padding: 8px 10px;
          font-size: 0.9rem;
        }
        
        .progress-bar {
          height: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${CONFIG.SITE_NAME}</h1>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 50px;">状态</th>
              <th style="width: 200px;">域名</th>
              <th>注册商</th>
              <th style="width: 120px;">注册时间</th>
              <th style="width: 120px;">过期时间</th>
              <th style="width: 100px;">剩余天数</th>
              <th style="min-width: 150px;">使用进度</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
    <div class="footer">
      <span>© ${new Date().getFullYear()} 域名监控</span> | 
      <a href="https://github.com/EricDasha/domain-check" target="_blank" rel="noopener noreferrer">GitHub</a> | 
      <a href="https://github.com/EricDasha/domain-check" target="_blank" rel="noopener noreferrer">点点star🌟</a>
    </div>
  </body>
  </html>
  `;
}

// 辅助函数：格式化日期为 YYYY-MM-DD
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
