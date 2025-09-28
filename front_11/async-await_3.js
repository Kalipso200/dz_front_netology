// async-await.js

/**
 * Функция для создания задержки
 * @param {number} ms - Задержка в миллисекундах
 * @returns {Promise} - Promise, который разрешится после задержки
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Функция для имитации запроса к API с использованием async/await
 * @param {string} url - URL эндпоинта
 * @param {number} delayMs - Задержка в миллисекундах
 * @returns {Promise} - Promise с данными
 */
async function fetchData(url, delayMs = 2000) {
    console.log(`🔄 Начало запроса к: ${url}`);
    
    // Имитация задержки сети
    await delay(delayMs);
    
    // Имитация различных ответов в зависимости от URL
    if (url === '/api/users') {
        console.log('✅ Запрос пользователей выполнен');
        return {
            status: 'success',
            data: [
                { id: 1, name: 'Иван Иванов', email: 'ivan@example.com' },
                { id: 2, name: 'Петр Петров', email: 'petr@example.com' },
                { id: 3, name: 'Мария Сидорова', email: 'maria@example.com' }
            ]
        };
    } else if (url.startsWith('/api/users/')) {
        const userId = url.split('/').pop();
        console.log(`✅ Запрос информации о пользователе ${userId} выполнен`);
        
        // Имитация разных данных для разных пользователей
        const userData = {
            '1': {
                id: 1,
                name: 'Иван Иванов',
                email: 'ivan@example.com',
                age: 28,
                city: 'Москва',
                registrationDate: '2020-05-15',
                role: 'Администратор'
            },
            '2': {
                id: 2,
                name: 'Петр Петров', 
                email: 'petr@example.com',
                age: 32,
                city: 'Санкт-Петербург',
                registrationDate: '2019-08-22',
                role: 'Модератор'
            },
            '3': {
                id: 3,
                name: 'Мария Сидорova',
                email: 'maria@example.com', 
                age: 25,
                city: 'Казань',
                registrationDate: '2021-01-10',
                role: 'Пользователь'
            }
        };
        
        if (userData[userId]) {
            return {
                status: 'success',
                data: userData[userId]
            };
        } else {
            throw new Error(`Пользователь с ID ${userId} не найден`);
        }
    } else if (url === '/api/error') {
        // Имитация ошибки
        console.log('❌ Имитация ошибки в запросе');
        throw new Error('Сервер недоступен. Пожалуйста, попробуйте позже.');
    } else {
        throw new Error(`Неизвестный endpoint: ${url}`);
    }
}

/**
 * Функция для отображения информации о пользователе
 * @param {Object} user - Объект пользователя
 */
function displayUserInfo(user) {
    console.log('┌─────────────────────────────────────');
    console.log('│ 👤 ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ');
    console.log('├─────────────────────────────────────');
    console.log(`│ ID: ${user.id}`);
    console.log(`│ Имя: ${user.name}`);
    console.log(`│ Email: ${user.email}`);
    console.log(`│ Возраст: ${user.age}`);
    console.log(`│ Город: ${user.city}`);
    console.log(`│ Роль: ${user.role}`);
    console.log(`│ Дата регистрации: ${user.registrationDate}`);
    console.log('└─────────────────────────────────────');
}

/**
 * Дополнительная обработка данных пользователя
 * @param {Object} user - Объект пользователя
 * @returns {Promise} - Promise с обработанными данными
 */
async function processUserData(user) {
    console.log('🔄 Обработка данных пользователя...');
    await delay(1000);
    
    return {
        ...user,
        processedAt: new Date().toISOString(),
        isActive: true,
        profileComplete: user.age && user.city ? 100 : 50,
        lastLogin: new Date().toLocaleDateString()
    };
}

/**
 * Основная функция с использованием async/await
 */
async function main() {
    console.log('🚀 ЗАПУСК ОСНОВНОЙ ФУНКЦИИ С ASYNC/AWAIT\n');
    
    try {
        // Шаг 1: Получаем список пользователей
        console.log('1. 📋 Запрашиваем список пользователей...');
        const usersResponse = await fetchData('/api/users');
        console.log('✅ Список пользователей получен:', usersResponse.data.map(u => u.name));
        
        // Добавляем задержку между запросами
        await delay(500);
        console.log('\n⏳ Задержка между запросами...\n');
        
        // Шаг 2: Получаем информацию о первом пользователе
        console.log('2. 🔍 Запрашиваем информацию о первом пользователе...');
        const firstUser = usersResponse.data[0];
        const userResponse = await fetchData(`/api/users/${firstUser.id}`);
        
        // Шаг 3: Отображаем информацию
        console.log('\n3. 👤 Отображаем информацию о пользователе:');
        displayUserInfo(userResponse.data);
        
        // Шаг 4: Обрабатываем данные
        console.log('\n4. 🔄 Обрабатываем данные пользователя...');
        const processedData = await processUserData(userResponse.data);
        
        // Шаг 5: Показываем результат
        console.log('\n5. ✅ ОБРАБОТАННЫЕ ДАННЫЕ:');
        console.log('   - Время обработки:', processedData.processedAt);
        console.log('   - Статус активности:', processedData.isActive ? 'Активен' : 'Неактивен');
        console.log('   - Заполненность профиля:', processedData.profileComplete + '%');
        console.log('   - Последний вход:', processedData.lastLogin);
        
        console.log('\n🎯 ОСНОВНАЯ ЦЕПОЧКА УСПЕШНО ЗАВЕРШЕНА!');
        
    } catch (error) {
        console.error('\n❌ ОШИБКА В ОСНОВНОЙ ФУНКЦИИ:');
        console.error('   Тип ошибки:', error.name);
        console.error('   Сообщение:', error.message);
        console.error('   Время ошибки:', new Date().toLocaleTimeString());
    } finally {
        console.log('\n🏁 БЛОК FINALLY: Основная функция завершена');
    }
}

/**
 * Пример с последовательными запросами с задержками
 */
async function sequentialRequests() {
    console.log('\n\n🔄 ПРИМЕР С ПОСЛЕДОВАТЕЛЬНЫМИ ЗАПРОСАМИ\n');
    
    try {
        // Получаем всех пользователей по очереди с задержками
        const usersResponse = await fetchData('/api/users');
        
        for (let i = 0; i < usersResponse.data.length; i++) {
            const user = usersResponse.data[i];
            console.log(`\n📥 Запрашиваем данные пользователя ${i + 1}: ${user.name}`);
            
            const userDetails = await fetchData(`/api/users/${user.id}`, 1000);
            displayUserInfo(userDetails.data);
            
            // Задержка между запросами разных пользователей
            if (i < usersResponse.data.length - 1) {
                console.log('\n⏸️  Задержка перед следующим пользователем...');
                await delay(1500);
            }
        }
        
        console.log('\n✅ Все пользователи обработаны!');
        
    } catch (error) {
        console.error('❌ Ошибка в последовательных запросах:', error.message);
    }
}

/**
 * Пример с параллельными запросами
 */
async function parallelRequests() {
    console.log('\n\n⚡ ПРИМЕР С PARALLEL ЗАПРОСАМИ\n');
    
    try {
        console.log('Запускаем 3 параллельных запроса...');
        
        // Запускаем запросы параллельно
        const [user1, user2, user3] = await Promise.all([
            fetchData('/api/users/1', 1500),
            fetchData('/api/users/2', 2000),
            fetchData('/api/users/3', 1000)
        ]);
        
        console.log('\n✅ ВСЕ PARALLEL ЗАПРОСЫ ВЫПОЛНЕНЫ:');
        console.log(`   - ${user1.data.name}: ${user1.data.role}`);
        console.log(`   - ${user2.data.name}: ${user2.data.role}`);
        console.log(`   - ${user3.data.name}: ${user3.data.role}`);
        
    } catch (error) {
        console.error('❌ Ошибка в parallel запросах:', error.message);
    }
}

/**
 * Пример с обработкой ошибок
 */
async function errorHandlingExample() {
    console.log('\n\n🚨 ПРИМЕР С ОБРАБОТКОЙ ОШИБОК\n');
    
    try {
        console.log('1. Пытаемся выполнить запрос с ошибкой...');
        await fetchData('/api/error');
        
    } catch (error) {
        console.error('2. ❌ ОШИБКА ПЕРЕХВАЧЕНА:');
        console.error('   - Сообщение:', error.message);
        console.error('   - Время:', new Date().toLocaleTimeString());
        
        // Продолжаем выполнение с запасным вариантом
        console.log('\n3. 🔄 Используем запасные данные...');
        await delay(1000);
        
        const fallbackData = {
            status: 'success',
            data: {
                id: 0,
                name: 'Гостевой пользователь',
                email: 'guest@example.com',
                age: null,
                city: 'Не указан',
                role: 'Гость',
                registrationDate: new Date().toISOString()
            }
        };
        
        console.log('4. ✅ ЗАПАСНЫЕ ДАННЫЕ ЗАГРУЖЕНЫ:');
        displayUserInfo(fallbackData.data);
    }
}

/**
 * Пример с вложенными async/await функциями
 */
async function nestedAsyncExample() {
    console.log('\n\n🏗️ ПРИМЕР С ВЛОЖЕННЫМИ ASYNC ФУНКЦИЯМИ\n');
    
    async function getUserProfile(userId) {
        console.log(`🔍 Получаем профиль пользователя ${userId}...`);
        await delay(800);
        return await fetchData(`/api/users/${userId}`);
    }
    
    async function getUserPermissions(userId) {
        console.log(`🔐 Получаем права пользователя ${userId}...`);
        await delay(600);
        return {
            canRead: true,
            canWrite: userId === '1',
            canDelete: userId === '1'
        };
    }
    
    try {
        const [profile, permissions] = await Promise.all([
            getUserProfile('1'),
            getUserPermissions('1')
        ]);
        
        console.log('\n✅ ПРОФИЛЬ И ПРАВА ПОЛУЧЕНЫ:');
        console.log('   - Имя:', profile.data.name);
        console.log('   - Права на запись:', permissions.canWrite ? 'Да' : 'Нет');
        console.log('   - Права на удаление:', permissions.canDelete ? 'Да' : 'Нет');
        
    } catch (error) {
        console.error('❌ Ошибка при получении профиля:', error.message);
    }
}

// Запуск всех примеров
async function runAllExamples() {
    console.log('🌟 ДЕМОНСТРАЦИЯ ASYNC/AWAIT С ЗАДЕРЖКАМИ\n');
    
    // Основной пример
    await main();
    
    // Другие примеры с задержками между ними
    await delay(2000);
    await sequentialRequests();
    
    await delay(2000);
    await parallelRequests();
    
    await delay(2000);
    await errorHandlingExample();
    
    await delay(2000);
    await nestedAsyncExample();
    
    console.log('\n\n🎉 ВСЕ ПРИМЕРЫ ЗАВЕРШЕНЫ!');
    console.log('Async/await делает асинхронный код читаемым и управляемым!');
}

// Запуск программы
runAllExamples().catch(error => {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА:', error);
});

// ДОПОЛНИТЕЛЬНЫЙ ПРИМЕР: Ожидание нескольких операций с таймаутом
async function withTimeoutExample() {
    console.log('\n\n⏰ ПРИМЕР С ТАЙМАУТОМ\n');
    
    function withTimeout(promise, ms) {
        return Promise.race([
            promise,
            delay(ms).then(() => { throw new Error('Таймаут операции') })
        ]);
    }
    
    try {
        console.log('Запускаем операцию с таймаутом 3 секунды...');
        const result = await withTimeout(fetchData('/api/users/1', 5000), 3000);
        console.log('✅ Результат:', result.data.name);
    } catch (error) {
        console.error('❌ Ошибка (таймаут):', error.message);
    }
}

// Запуск примера с таймаутом
setTimeout(() => {
    withTimeoutExample();
}, 25000);