import { defineStore } from 'pinia';
import * as neteaseApi from '@/services/api/netease.js';

export const useNeteaseStore = defineStore('netease', {
  state: () => ({
    isLoggedIn: false,
    profile: null,
    qrKey: '',
    qrDataUrl: '',
    qrStatusText: '',
    isQrLoading: false,
    isLoading: false,
    pollingTimer: null,
    playlists: [],
    likelistSongs: [],
    currentSongs: [],
    selectedIds: new Set(),
    activeTab: 'liked',
    showQrModal: false,
  }),

  getters: {
    selectedCount: (state) => state.selectedIds.size,
  },

  actions: {
    checkStatus() {
      neteaseApi.getLoginStatus(
        (res) => {
          if (res.data && res.data.loggedIn) {
            this.isLoggedIn = res.data.loggedIn;
            this.profile = res.data.profile || null;
          }
        },
        () => {},
      );
    },

    startQrLogin() {
      this.isQrLoading = true;
      this.showQrModal = true;
      this.qrStatusText = '正在生成二维码…';
      neteaseApi.getQrKey(
        (res) => {
          this.qrKey = res.data.key;
          this.qrDataUrl = res.data.qrDataUrl;
          this.qrStatusText = '请使用网易云音乐 APP 扫码';
          this.isQrLoading = false;
          this._startPolling();
        },
        () => {
          this.qrStatusText = '二维码生成失败，请重试';
          this.isQrLoading = false;
        },
      );
    },

    _startPolling() {
      this.stopPolling();
      this.pollingTimer = setInterval(() => {
        if (!this.qrKey) return;
        neteaseApi.checkQrStatus(this.qrKey,
          (res) => {
            const code = res.data.code;
            if (code === 803) {
              this.stopPolling();
              this.qrStatusText = '登录成功！';
              this.showQrModal = false;
              this.isLoggedIn = true;
              this._loadProfile();
              setTimeout(() => {
                this.loadLikelist();
                this.loadPlaylists();
              }, 500);
            } else if (code === 802) {
              this.qrStatusText = '已扫码，请在手机上确认…';
            } else if (code === 801) {
              this.qrStatusText = '请使用网易云音乐 APP 扫码';
            } else if (code === 800) {
              this.stopPolling();
              this.qrStatusText = '二维码已过期，请刷新重试';
            }
          },
          () => {},
        );
      }, 2000);
    },

    stopPolling() {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }
    },

    _loadProfile() {
      neteaseApi.getLoginStatus(
        (res) => {
          if (res.data) {
            this.isLoggedIn = res.data.loggedIn;
            this.profile = res.data.profile || null;
          }
        },
        () => {},
      );
    },

    loadLikelist() {
      this.isLoading = true;
      neteaseApi.getLikelist(
        (res) => {
          this.likelistSongs = (res.data && res.data.songs) || [];
          this.isLoading = false;
        },
        () => { this.isLoading = false; },
      );
    },

    loadPlaylists() {
      this.isLoading = true;
      neteaseApi.getPlaylists(
        (res) => {
          this.playlists = (res.data && res.data.playlists) || [];
          this.isLoading = false;
        },
        () => { this.isLoading = false; },
      );
    },

    browsePlaylist(id) {
      this.isLoading = true;
      this.activeTab = 'playlist';
      neteaseApi.getPlaylistSongs(id,
        (res) => {
          this.currentSongs = (res.data && res.data.songs) || [];
          this.selectedIds = new Set();
          this.isLoading = false;
        },
        () => { this.isLoading = false; },
      );
    },

    showLiked() {
      this.activeTab = 'liked';
      this.currentSongs = [];
      this.selectedIds = new Set();
    },

    toggleSong(id) {
      const next = new Set(this.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      this.selectedIds = next;
    },

    selectAll() {
      const songs = this.activeTab === 'liked' ? this.likelistSongs : this.currentSongs;
      if (this.selectedIds.size === songs.length) {
        this.selectedIds = new Set();
      } else {
        this.selectedIds = new Set(songs.map(s => s.id));
      }
    },

    doImport() {
      const songs = this.activeTab === 'liked' ? this.likelistSongs : this.currentSongs;
      const selected = songs.filter(s => this.selectedIds.has(s.id));
      if (selected.length === 0) return;

      this.isLoading = true;
      neteaseApi.importSongs(selected,
        () => {
          this.selectedIds = new Set();
          this.isLoading = false;
          alert(`已导入 ${selected.length} 首歌曲`);
        },
        () => {
          this.isLoading = false;
          alert('导入失败，请重试');
        },
      );
    },

    doLogout() {
      neteaseApi.neteaseLogout(
        () => {
          this.isLoggedIn = false;
          this.profile = null;
          this.qrKey = '';
          this.qrDataUrl = '';
          this.playlists = [];
          this.likelistSongs = [];
          this.currentSongs = [];
          this.selectedIds = new Set();
          this.activeTab = 'liked';
          this.showQrModal = false;
        },
        () => {},
      );
    },

    closeQrModal() {
      this.stopPolling();
      this.showQrModal = false;
    },
  },
});
