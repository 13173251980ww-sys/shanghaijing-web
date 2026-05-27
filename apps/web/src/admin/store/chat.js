import { defineStore } from 'pinia';
import { nodeHttp } from '@/services/http/http.js';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    isStreaming: false,
    isPanelOpen: false,
    currentEmotion: 'neutral',
    affection: 0,
    affectionLevel: 1,
    affectionTitle: '初识',
    _controller: null,
  }),

  actions: {
    togglePanel() {
      this.isPanelOpen = !this.isPanelOpen;
    },

    openPanel() {
      this.isPanelOpen = true;
    },

    closePanel() {
      this.isPanelOpen = false;
    },

    loadAffection(success, fail) {
      nodeHttp.get('/admin/affection', {},
        (res) => {
          if (res.data) {
            this.affection = res.data.affection;
            this.affectionLevel = res.data.level;
            this.affectionTitle = res.data.title;
          }
          if (success) success(res);
        },
        (err) => { if (fail) fail(err); }
      );
    },

    sendMessage(text, success, fail) {
      if (!text || !text.trim()) return;
      if (this.isStreaming) return;

      this.isStreaming = true;
      this.messages.push({ role: 'user', content: text });
      this.messages.push({ role: 'assistant', content: '' });
      const assistantIndex = this.messages.length - 1;

      const controller = new AbortController();
      this._controller = controller;

      const baseUrl = import.meta.env.VITE_NODE_API_BASE_URL || '/api';
      const token = localStorage.getItem('admin_token') || '';

      fetch(`${baseUrl}/admin/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text, sessionId: 'admin-main' }),
        signal: controller.signal,
      }).then((response) => {
        if (!response.ok) {
          this.isStreaming = false;
          if (fail) fail(new Error('请求失败'));
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const readNext = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              this.isStreaming = false;
              this._controller = null;
              if (success) success(this.messages[assistantIndex]);
              return;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const dataStr = line.slice(6);
              let json;
              try { json = JSON.parse(dataStr); } catch { continue; }

              if (json.error) {
                this.isStreaming = false;
                if (fail) fail(new Error(json.error));
                return;
              }

              if (json.text !== undefined) {
                this.messages[assistantIndex].content = json.text;
                this.currentEmotion = json.emotion || 'neutral';
              }

              if (json.done) {
                this.isStreaming = false;
                this._controller = null;
                if (success) success(this.messages[assistantIndex]);
                return;
              }
            }

            readNext();
          }).catch(() => {
            this.isStreaming = false;
          });
        };

        readNext();
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          this.isStreaming = false;
          if (fail) fail(err);
        }
      });
    },

    clearMessages() {
      if (this._controller) {
        this._controller.abort();
        this._controller = null;
      }
      this.messages = [];
      this.isStreaming = false;
      this.currentEmotion = 'neutral';
    },
  },
});
