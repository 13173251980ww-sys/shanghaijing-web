// 加载 .env 环境变量
import 'dotenv/config';
import app from './app.js';

// 服务端口，默认 3000
const port = process.env.PORT || 3000;

// 启动 HTTP 服务
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
