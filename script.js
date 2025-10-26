class WeChatLoginSystem {
    constructor() {
        this.init();
        this.loadConfig();
    }

    init() {
        // 绑定事件监听器
        this.bindEvents();
        
        // 初始化状态
        this.updateUI();
    }

    bindEvents() {
        // 生成授权链接按钮
        document.getElementById('generateAuthUrl').addEventListener('click', () => {
            this.generateAuthUrl();
        });

        // 模拟登录流程按钮
        document.getElementById('simulateLogin').addEventListener('click', () => {
            this.simulateLoginProcess();
        });

        // 清除配置按钮
        document.getElementById('clearConfig').addEventListener('click', () => {
            this.clearConfig();
        });

        // 设置相关事件
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            this.hideSettings();
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        // 自动保存配置变更
        ['appId', 'appSecret', 'redirectUri', 'state'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                if (document.getElementById('autoSave').checked) {
                    this.saveConfig();
                }
            });
        });
    }

    generateAuthUrl() {
        const appId = document.getElementById('appId').value.trim();
        const redirectUri = document.getElementById('redirectUri').value.trim();
        const state = document.getElementById('state').value.trim() || this.generateRandomState();

        if (!appId) {
            this.showError('请填写AppID');
            return;
        }

        if (!redirectUri) {
            this.showError('请填写回调地址');
            return;
        }

        // 构建微信授权URL
        const baseUrl = 'https://open.weixin.qq.com/connect/qrconnect'; // 修正1：去掉多余的空格
        const params = new URLSearchParams({
            appid: appId,
            redirect_uri: encodeURIComponent(redirectUri),
            response_type: 'code',
            scope: 'snsapi_login',
            state: state
        });

        const authUrl = `${baseUrl}?${params.toString()}#wechat_redirect`;
        
        // 显示授权URL
        document.getElementById('authUrl').textContent = authUrl;
        document.getElementById('authUrlSection').classList.remove('hidden');
        document.getElementById('authUrlSection').classList.add('fade-in');
        
        this.showSuccess('授权链接生成成功！');
    }

    simulateLoginProcess() {
        const appId = document.getElementById('appId').value.trim();
        const appSecret = document.getElementById('appSecret').value.trim();
        
        if (!appId || !appSecret) {
            this.showError('请填写完整的AppID和AppSecret');
            return;
        }

        this.showLoading('开始模拟微信登录流程...');

        // 模拟完整登录流程
        setTimeout(() => {
            this.showLoading('第一步：请求授权码...');
            
            setTimeout(() => {
                const mockCode = this.generateMockCode();
                this.showLoading('第二步：使用授权码换取access_token...');
                
                setTimeout(() => {
                    this.showLoading('第三步：获取用户信息...');
                    
                    setTimeout(() => {
                        this.displayMockUserInfo();
                        this.showSuccess('微信登录成功！');
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 500);
    }

    generateMockCode() {
        return 'mock_' + Math.random().toString(36).substr(2, 15);
    }

    displayMockUserInfo() {
        const mockUser = {
            openid: 'o6_bmjrPTlm6_2sgVt7hMZOPfL2M', // 修正2：去掉多余的分号
            nickname: '微信用户_' + Math.floor(Math.random() * 10000),
            avatar: 'https://picsum.photos/100/100?random=' + Math.random(),
            gender: Math.random() > 0.5 ? '男' : '女',
            country: '中国',
            province: '广东'
        };

        document.getElementById('userOpenId').textContent = mockUser.openid;
        document.getElementById('userNickname').textContent = mockUser.nickname;
        document.getElementById('userAvatar').src = mockUser.avatar;
        document.getElementById('userAvatar').alt = mockUser.nickname + '的头像';
        document.getElementById('userGender').textContent = mockUser.gender;
        document.getElementById('userCountry').textContent = mockUser.country;
        document.getElementById('userProvince').textContent = mockUser.province;
        
        document.getElementById('userInfoSection').classList.remove('hidden');
        document.getElementById('userInfoSection').classList.add('fade-in');
    }

    generateRandomState() {
        return 'state_' + Math.random().toString(36).substr(2, 9);
    }

    loadConfig() {
        const savedConfig = localStorage.getItem('wechatLoginConfig');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            Object.keys(config).forEach(key => {
                const element = document.getElementById(key);
                if (element) element.value = config[key];
            });
        }

        const savedSettings = localStorage.getItem('wechatLoginSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            Object.keys(settings).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = settings[key];
                    } else {
                        element.value = settings[key];
                    }
                }
            });
        }
    }

    saveConfig() {
        const config = {
            appId: document.getElementById('appId').value,
            appSecret: document.getElementById('appSecret').value,
            redirectUri: document.getElementById('redirectUri').value,
            state: document.getElementById('state').value
        };

        localStorage.setItem('wechatLoginConfig', JSON.stringify(config));
    }

    clearConfig() {
        localStorage.removeItem('wechatLoginConfig');
        ['appId', 'appSecret', 'redirectUri', 'state'].forEach(id => {
            document.getElementById(id).value = '';
        });
        
        this.showSuccess('配置已清除');
    }

    showSettings() {
        document.getElementById('settingsModal').classList.remove('hidden');
        document.getElementById('settingsModal').classList.add('flex');
    }

    hideSettings() {
        document.getElementById('settingsModal').classList.add('hidden');
        document.getElementById('settingsModal').classList.remove('flex');
    }

    saveSettings() {
        const settings = {
            themeColor: document.getElementById('themeColor').value,
            autoSave: document.getElementById('autoSave').checked
        };

        localStorage.setItem('wechatLoginSettings', JSON.stringify(settings));
        this.hideSettings();
        this.showSuccess('设置已保存');
    }

    showLoading(message) {
        this.showMessage(message, 'blue');
    }

    showSuccess(message) {
        this.showMessage(message, 'green');
    }

    showError(message) {
        this.showMessage(message, 'red');
    }

    showMessage(message, type = 'blue') {
        // 移除现有消息
        const existingMessage = document.querySelector('.message-toast');
        if (existingMessage) {
            existingMessage.remove();
        }

        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 bg-${type}-500 text-white px-6 py-3 rounded-lg shadow-lg message-toast fade-in z-50`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'blue' ? 'info-circle' : type === 'green' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    updateUI() {
        // 更新UI状态
        const config = this.getCurrentConfig();
        const hasConfig = config.appId && config.appSecret;
        
        if (hasConfig) {
            document.getElementById('simulateLogin').disabled = false;
        } else {
            document.getElementById('simulateLogin').disabled = true;
        }
    }

    getCurrentConfig() {
        return {
            appId: document.getElementById('appId').value,
            appSecret: document.getElementById('appSecret').value
        };
    }
}

// 初始化系统
document.addEventListener('DOMContentLoaded', () => {
    new WeChatLoginSystem();
});

// 微信OAuth 2.0 API调用函数
class WeChatOAuthAPI {
    static async getAccessToken(appId, appSecret, code) {
        const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取access_token失败:', error);
            throw error;
        }
    }

    static async getUserInfo(accessToken, openid) {
        const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}&lang=zh_CN`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();        return data;
        } catch (error) {
            console.error('获取用户信息失败:', error);
            throw error;
        }
    }
    
    static async refreshToken(appId, refreshToken) {
        const url = `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${appId}&grant_type=refresh_token&refresh_token=${refreshToken}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('刷新token失败:', error);
            throw error;
        }
    }}
    // 工具函数
    const Utils = {
    // URL参数解析
    parseUrlParams(url) {
    const params = {};
    new URL(url).searchParams.forEach((value, key) => {
    params[key] = value;
    });
    return params;
    },
    // 验证配置完整性
validateConfig(config) {
    const required = ['appId', 'appSecret', 'redirectUri'];
    const missing = required.filter(field => !config[field]);
    
    if (missing.length > 0) {
        throw new Error(`缺少必要配置: ${missing.join(', ')}`);
    }
},

// 安全的本地存储
secureStorage: {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('本地存储失败:', error);
        }
    },

    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('本地存储读取失败:', error);
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('本地存储删除失败:', error);
        }
    }
}};