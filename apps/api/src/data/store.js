import { v4 as uuid } from 'uuid';

export const store = {
  gallery: [
    { id: '1', filename: 'gallery-art.png', url: '/uploads/gallery-art.png', order: 0 },
  ],
  blogPosts: [
    { id: '1', title: '山海经异兽考', desc: '应龙、白泽与九尾狐的传说溯源', date: '2026-05-20', content: '', coverUrl: '', url: '#' },
    { id: '2', title: '水墨渲染算法笔记', desc: '基于 WebGL 的实时水墨扩散模拟', date: '2026-05-15', content: '', coverUrl: '', url: '#' },
    { id: '3', title: '前端动画性能优化', desc: '从 30fps 到 60fps 的逐帧分析', date: '2026-05-10', content: '', coverUrl: '', url: '#' },
    { id: '4', title: '聊城大学游记', desc: '东昌湖畔的四年春秋', date: '2026-04-28', content: '', coverUrl: '', url: '#' },
    { id: '5', title: 'Live2D 技术调研', desc: 'Cubism SDK 在 Web 端的集成方案', date: '2026-04-15', content: '', coverUrl: '', url: '#' },
    { id: '6', title: '古诗词数据集构建', desc: '十万首唐诗宋词的清洗与标注', date: '2026-04-02', content: '', coverUrl: '', url: '#' },
    { id: '7', title: 'Vue3 组合式 API 实践', desc: '从 Options 到 Composition 的迁移总结', date: '2026-03-20', content: '', coverUrl: '', url: '#' },
    { id: '8', title: '个人网站开发手记', desc: '从设计到上线的全流程记录', date: '2026-03-10', content: '', coverUrl: '', url: '#' },
    { id: '9', title: 'CSS Container Queries 入门', desc: '现代响应式布局的新范式', date: '2026-02-28', content: '', coverUrl: '', url: '#' },
    { id: '10', title: 'JavaScript 闭包深入理解', desc: '从作用域链到内存管理的完整解析', date: '2026-02-15', content: '', coverUrl: '', url: '#' },
    { id: '11', title: 'Web Worker 多线程实践', desc: '主线程卡顿的终极解决方案', date: '2026-02-01', content: '', coverUrl: '', url: '#' },
    { id: '12', title: 'Canvas 实现粒子特效', desc: '从零搭建烟花粒子系统', date: '2026-01-18', content: '', coverUrl: '', url: '#' },
    { id: '13', title: 'Git 工作流最佳实践', desc: '从 feature branch 到 CI/CD', date: '2026-01-05', content: '', coverUrl: '', url: '#' },
    { id: '14', title: 'HTTP/3 与 QUIC 协议浅析', desc: '新一代传输协议的技术内幕', date: '2025-12-20', content: '', coverUrl: '', url: '#' },
    { id: '15', title: 'TypeScript 类型体操入门', desc: '从泛型到条件类型的进阶之路', date: '2025-12-08', content: '', coverUrl: '', url: '#' },
    { id: '16', title: '2025 年度技术总结', desc: '这一年的成长与收获', date: '2025-12-01', content: '', coverUrl: '', url: '#' },
  ],
  sidebar: {
    name: 'Amadeus',
    motto: '笔落惊风雨，诗成泣鬼神',
    avatarUrl: '',
    icp: '666666666666',
  },
  about: {
    nickname: 'Amadeus',
    school: '聊城大学',
    githubUrl: 'https://github.com/13173251980ww-sys',
    csdnUrl: 'https://blog.csdn.net/amadeusCristina',
    social: 'B站 / QQ 1685736247',
    avatarUrl: '',
  },
  friends: [
    { id: '1', name: '派大星工作室', url: '#' },
  ],
  messages: [],
  projects: [
    { id: '1', name: 'Live2d面试官', desc: '智能虚拟面试官', url: '#' },
  ],
};

let nextId = 100;

export function newId() {
  return String(nextId++);
}
