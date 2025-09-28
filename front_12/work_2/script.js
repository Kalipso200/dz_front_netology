// script.js - Регистрация и управление Service Worker

class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isUpdateAvailable = false;
    this.init();
  }

  async init() {
    if ('serviceWorker' in navigator) {
      try {
        await this.registerServiceWorker();
        this.setupUpdateListener();
        this.setupOfflineDetection();
      } catch (error) {
        console.error('❌ Ошибка инициализации Service Worker:', error);
      }
    } else {
      console.log('⚠️ Service Worker не поддерживается браузером');
    }
  }

  async registerServiceWorker() {
    this.registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    });

    console.log('✅ Service Worker зарегистрирован:', this.registration);

    // Слушаем обновления Service Worker
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('🔄 Доступна новая версия приложения!');
          this.showUpdateNotification();
        }
      });
    });
  }

  setupUpdateListener() {
    let refreshing = false;
    
    // Обновляем страницу когда новый Service Worker становится активным
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('🔄 Активирована новая версия Service Worker');
        window.location.reload();
      }
    });
  }

  setupOfflineDetection() {
    // Показываем офлайн-уведомление
    window.addEventListener('online', () => {
      this.showNotification('✅ Соединение восстановлено', 'success');
      this.syncData();
    });

    window.addEventListener('offline', () => {
      this.showNotification('🌐 Вы в офлайн-режиме', 'warning');
    });

    // Показываем начальный статус
    if (!navigator.onLine) {
      this.showNotification('🌐 Работаем в офлайн-режиме', 'info');
    }
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      cursor: pointer;
      animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.2em;">🔄</span>
        <div>
          <strong>Доступно обновление!</strong>
          <div style="font-size: 0.9em; opacity: 0.9;">Нажмите для обновления</div>
        </div>
      </div>
    `;

    notification.addEventListener('click', () => {
      this.updateApp();
      notification.remove();
    });

    document.body.appendChild(notification);

    // Автоматически скрыть через 10 секунд
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  async updateApp() {
    if (this.registration && this.registration.waiting) {
      console.log('🔄 Активируем новую версию Service Worker...');
      
      // Отправляем сообщение Service Worker для активации
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#4CAF50' : 
                    type === 'warning' ? '#FF9800' : 
                    type === 'error' ? '#f44336' : '#2196F3';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      animation: slideIn 0.3s ease;
      max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);

    // Автоматически скрыть через 5 секунд
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  async syncData() {
    try {
      // Синхронизируем данные при восстановлении соединения
      if (this.registration && this.registration.sync) {
        await this.registration.sync.register('background-sync');
        console.log('🔄 Фоновая синхронизация зарегистрирована');
      }
    } catch (error) {
      console.error('❌ Ошибка синхронизации:', error);
    }
  }

  // Метод для принудительного обновления кеша
  async updateCache() {
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage({ type: 'UPDATE_CACHE' });
      this.showNotification('🔄 Обновление кеша...', 'info');
    }
  }

  // Проверка статуса Service Worker
  getStatus() {
    return {
      isSupported: 'serviceWorker' in navigator,
      isControlled: !!navigator.serviceWorker.controller,
      isOnline: navigator.onLine,
      registration: this.registration
    };
  }
}

// Стили для анимаций
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.serviceWorkerManager = new ServiceWorkerManager();
  
  // Добавляем информацию о Service Worker в интерфейс
  if ('serviceWorker' in navigator) {
    const statusInfo = document.createElement('div');
    statusInfo.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 9998;
    `;
    
    statusInfo.innerHTML = `
      <div>SW: <span id="sw-status">✅ Активен</span></div>
      <div>Сеть: <span id="network-status">${navigator.onLine ? '✅ Онлайн' : '🌐 Офлайн'}</span></div>
    `;
    
    document.body.appendChild(statusInfo);

    // Обновляем статус сети
    window.addEventListener('online', () => {
      document.getElementById('network-status').textContent = '✅ Онлайн';
    });
    
    window.addEventListener('offline', () => {
      document.getElementById('network-status').textContent = '🌐 Офлайн';
    });
  }
});

// Функция для проверки обновлений
async function checkForUpdates() {
  if (window.serviceWorkerManager && window.serviceWorkerManager.registration) {
    try {
      await window.serviceWorkerManager.registration.update();
      console.log('🔍 Проверка обновлений завершена');
    } catch (error) {
      console.error('❌ Ошибка проверки обновлений:', error);
    }
  }
}

// Периодическая проверка обновлений (каждые 30 минут)
setInterval(checkForUpdates, 30 * 60 * 1000);