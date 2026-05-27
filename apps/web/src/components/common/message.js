/**
 * @file 全局消息提示工具 —— 动态创建 Message 组件实例并管理弹窗显示
 *
 * 关键依赖：
 *   Vue 3 (MIT) —— createVNode / render API 动态渲染组件
 */

import { createVNode, render } from "vue";
import MessageBox from "@/components/common/MessageBox.vue";
let api = null;
let host = null;
let vnode = null;

function ensureApi() {
  if (api) return api;
  if (typeof window === "undefined") {
    return {
      success() {},
      error() {},
      warning() {},
      info() {},
      setPosition() {},
    };
  }
  host = document.createElement("div");
  document.body.appendChild(host);

  vnode = createVNode(MessageBox);
  render(vnode, host);

  api = vnode.component?.exposed?.Message;
  if (!api) {
    // 组件还没挂好时兜底：把调用排到微任务之后再重试
    api = {
      success: (t, d) => queueMicrotask(() => ensureApi().success(t, d)),
      error: (t, d) => queueMicrotask(() => ensureApi().error(t, d)),
      warning: (t, d) => queueMicrotask(() => ensureApi().warning(t, d)),
      info: (t, d) => queueMicrotask(() => ensureApi().info(t, d)),
      // 仅右上角支持，可传 offset 调整
      setPosition: (...args) =>
        queueMicrotask(() => ensureApi().setPosition(...args)),
    };
  }
  return api;
}

const Message = {
  /**
   * 弹出成功弹窗
   *
   * @param t 成功弹窗展示的文本
   * @param d 弹窗显示多少毫秒
   * @returns {*}
   */
  success: (t, d) => ensureApi().success(t, d),
  error: (t, d) => ensureApi().error(t, d),
  warning: (t, d) => ensureApi().warning(t, d),
  info: (t, d) => ensureApi().info(t, d),
  /**
   * 仅支持 'top-right'，placement 参数将被忽略；
   * 可以传 offset，如：{ top: 24, right: 24 }
   */
  setPosition: (_placement, offset) =>
    ensureApi().setPosition("top-right", offset),
};
export default Message;

export function destroyMessage() {
  if (host) {
    render(null, host);
    host.parentNode?.removeChild(host);
  }
  api = null;
  host = null;
  vnode = null;
}
