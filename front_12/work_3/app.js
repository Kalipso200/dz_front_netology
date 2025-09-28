// app.js - Управление статусами и уведомлениями

class StatusManager {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        this.setupNetworkListener();
        this.setupAuthListener();
        this.updateTime();
        this.checkInitialStatus();
    }

    // Управление сетевым статусом
    setupNetworkListener() {
        window.addEventListener('online', () => {
            this.handleOnline();
        });

        window.addEventListener('offline', () => {
            this.handleOffline();
        });

        // Обновляем начальный статус
        this.updateNetworkStatus(navigator.onLine);
    }

    updateNetworkStatus(isOnline) {
        const networkStatus = document.getElementById('network-status');
        const globalStatus = document.getElementById('global-status');

        if (isOnline) {
            networkStatus.className = 'status-indicator online';
            networkStatus.innerHTML = `
                <span class="status-indicator__icon">🌐</span>
                <span class="status-indicator__text">Онлайн</span>
            `;
            globalStatus.textContent = 'Онлайн';
            globalStatus.style.color = 'var(--color-success)';
        } else {
            networkStatus.className = 'status-indicator offline';
            networkStatus.innerHTML = `
                <span class="status-indicator__icon">📴</span>
                <span class="status-indicator__text">Офлайн</span>
            `;
            globalStatus.textContent = 'Офлайн';
            globalStatus.style.color = 'var(--color-error)';
        }
    }

    handleOnline() {
        this.updateNetworkStatus(true);
        this.showNotification({
            title: 'Соединение восстановлено',
            message: 'Приложение снова в сети и синхронизирует данные',
            type: 'success',
            icon: '✅'
        });
        
        // Синхронизируем данные при восстановлении соединения
        this.syncData();
    }

    handleOffline() {
        this.updateNetworkStatus(false);
        this.showNotification({
            title: 'Офлайн режим',
            message: 'Вы работаете без подключения к интернету',
            type: 'warning',
            icon: '🌐'
        });
    }

    // Управление статусом авторизации
    setupAuthListener() {
        this.updateAuthStatus();
        
        // Слушаем изменения в localStorage для синхронизации между вкладками
        window.addEventListener('storage', (e) => {
            if (e.key === 'auth_token' || e.key === 'user_data') {
                this.updateAuthStatus();
            }
        });
    }

    updateAuthStatus() {
        const token = this.getToken();
        const user = this.getUser();
        const isAuthenticated = !!(token && user);

        const guestIndicator = document.getElementById('guest-indicator');
        const userIndicator = document.getElementById('user-indicator');
        const userName = document.getElementById('user-name');
        const contentPage = document.getElementById('content-page');
        const loginPage = document.getElementById('login-page');

        if (isAuthenticated) {
            // Показываем информацию пользователя
            guestIndicator.classList.add('hidden');
            userIndicator.classList.remove('hidden');
            userName.textContent = user.name || user.email;
            
            // Показываем основной контент
            contentPage.classList.remove('hidden');
            loginPage.classList.add('hidden');
            
            console.log('✅ Пользователь авторизован:', user.email);
        } else {
            // Показываем кнопку входа
            guestIndicator.classList.remove('hidden');
            userIndicator.classList.add('hidden');
            
            // Показываем страницу логина если не авторизованы
            contentPage.classList.add('hidden');
            loginPage.classList.remove('hidden');
            
            console.log('🔐 Пользователь не авторизован');
        }
    }

    // Управление уведомлениями
    showNotification({ title, message, type = 'info', icon = 'ℹ️', duration = 5000 }) {
        const notificationsContainer = document.getElementById('notifications');
        const notificationId = Date.now().toString();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.id = `notification-${notificationId}`;
        
        notification.innerHTML = `
            <div class="notification__icon">${icon}</div>
            <div class="notification__content">
                <div class="notification__title">${title}</div>
                <div class="notification__message">${message}</div>
            </div>
        `;
        
        notificationsContainer.appendChild(notification);
        
        // Автоматическое скрытие
        setTimeout(() => {
            this.hideNotification(notificationId);
        }, duration);
        
        // Сохраняем ссылку на уведомление
        this.notifications.push(notificationId);
        
        return notificationId;
    }

    hideNotification(notificationId) {
        const notification = document.getElementById(`notification-${notificationId}`);
        if (notification) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                // Удаляем из массива
                this.notifications = this.notifications.filter(id => id !== notificationId);
            }, 300);
        }
    }

    // Вспомогательные методы
    getToken() {
        return localStorage.getItem('auth_token');
    }

    getUser() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    }

    saveAuthData(token, user) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        this.updateAuthStatus();
    }

    clearAuthData() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        this.updateAuthStatus();
    }

    // Синхронизация данных
    async syncData() {
        // Здесь может быть логика синхронизации данных с сервером
        console.log('🔄 Синхронизация данных...');
        this.showNotification({
            title: 'Синхронизация',
            message: 'Данные синхронизируются с сервером',
            type: 'info',
            icon: '🔄'
        });
    }

    // Обновление времени в статус-баре
    updateTime() {
        const timeElement = document.getElementById('current-time');
        const updateTime = () => {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('ru-RU');
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Проверка начального статуса
    checkInitialStatus() {
        this.updateNetworkStatus(navigator.onLine);
        this.updateAuthStatus();
        
        if (!navigator.onLine) {
            this.handleOffline();
        }
    }
}

// Инициализация менеджера статусов
const statusManager = new StatusManager();

// Функции для демонстрации
function simulateNetworkChange() {
    const isOnline = navigator.onLine;
    
    if (isOnline) {
        // Имитируем отключение сети
        statusManager.handleOffline();
    } else {
        // Имитируем подключение к сети
        statusManager.handleOnline();
    }
}

function checkAuthStatus() {
    const token = statusManager.getToken();
    const user = statusManager.getUser();
    
    if (token && user) {
        statusManager.showNotification({
            title: 'Статус авторизации',
            message: `Вы авторизованы как ${user.email}`,
            type: 'success',
            icon: '✅'
        });
    } else {
        statusManager.showNotification({
            title: 'Статус авторизации',
            message: 'Вы не авторизованы в системе',
            type: 'warning',
            icon: '🔐'
        });
    }
}

function showLogin() {
    document.getElementById('content-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
}

function logout() {
    statusManager.clearAuthData();
    statusManager.showNotification({
        title: 'Выход из системы',
        message: 'Вы успешно вышли из системы',
        type: 'info',
        icon: '🚪'
    });
}

// Обработка формы авторизации
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('login-btn');
    const loading = document.getElementById('loading');
    
    // Валидация
    if (!validateEmail(email)) {
        showError('email-error', 'Введите корректный email адрес');
        return;
    }
    
    if (password.length < 6) {
        showError('password-error', 'Пароль должен содержать не менее 6 символов');
        return;
    }
    
    // Показываем состояние загрузки
    loginBtn.disabled = true;
    loading.classList.remove('hidden');
    
    try {
        // Имитация API запроса
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (email === 'demo@example.com' && password === '123456') {
            // Успешная авторизация
            const userData = {
                id: 1,
                email: email,
                name: 'Demo User'
            };
            
            const token = 'demo_jwt_token_' + Date.now();
            
            statusManager.saveAuthData(token, userData);
            
            statusManager.showNotification({
                title: 'Успешный вход',
                message: `Добро пожаловать, ${userData.name}!`,
                type: 'success',
                icon: '🎉'
            });
        } else {
            throw new Error('Неверный email или пароль');
        }
    } catch (error) {
        statusManager.showNotification({
            title: 'Ошибка входа',
            message: error.message,
            type: 'error',
            icon: '❌'
        });
    } finally {
        loginBtn.disabled = false;
        loading.classList.add('hidden');
    }
});

// Вспомогательные функции
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';
}

// Real-time валидация
document.getElementById('email').addEventListener('input', () => {
    hideError('email-error');
});

document.getElementById('password').addEventListener('input', () => {
    hideError('password-error');
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Приложение инициализировано');
});