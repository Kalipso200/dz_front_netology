// promise-chain.js

/**
 * Функция для имитации запроса к API
 * @param {string} url - URL эндпоинта
 * @param {number} delay - Задержка в миллисекундах
 * @returns {Promise} - Promise с данными
 */
function fetchData(url, delay = 2000) {
    console.log(`🔄 Начало запроса к: ${url}`);
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Имитация различных ответов в зависимости от URL
            if (url === '/api/users') {
                console.log('✅ Запрос пользователей выполнен');
                resolve({
                    status: 'success',
                    data: [
                        { id: 1, name: 'Иван Иванов', email: 'ivan@example.com' },
                        { id: 2, name: 'Петр Петров', email: 'petr@example.com' },
                        { id: 3, name: 'Мария Сидорова', email: 'maria@example.com' }
                    ]
                });
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
                        registrationDate: '2020-05-15'
                    },
                    '2': {
                        id: 2,
                        name: 'Петр Петров', 
                        email: 'petr@example.com',
                        age: 32,
                        city: 'Санкт-Петербург',
                        registrationDate: '2019-08-22'
                    },
                    '3': {
                        id: 3,
                        name: 'Мария Сидорова',
                        email: 'maria@example.com', 
                        age: 25,
                        city: 'Казань',
                        registrationDate: '2021-01-10'
                    }
                };
                
                if (userData[userId]) {
                    resolve({
                        status: 'success',
                        data: userData[userId]
                    });
                } else {
                    reject(new Error(`Пользователь с ID ${userId} не найден`));
                }
            } else if (url === '/api/error') {
                // Имитация ошибки
                console.log('❌ Имитация ошибки в запросе');
                reject(new Error('Сервер недоступен'));
            } else {
                reject(new Error(`Неизвестный endpoint: ${url}`));
            }
        }, delay);
    });
}

/**
 * Основная цепочка Promise
 */
function main() {
    console.log('🚀 ЗАПУСК ЦЕПОЧКИ PROMISE\n');
    
    // Цепочка асинхронных операций
    fetchData('/api/users')
        .then(response => {
            console.log('\n📋 ПОЛУЧЕН СПИСОК ПОЛЬЗОВАТЕЛЕЙ:');
            console.log(response.data);
            
            // Получаем ID первого пользователя
            const firstUserId = response.data[0].id;
            console.log(`\n🔍 Запрашиваем информацию о пользователе с ID: ${firstUserId}`);
            
            // Возвращаем следующий Promise в цепочке
            return fetchData(`/api/users/${firstUserId}`);
        })
        .then(userResponse => {
            console.log('\n👤 ИНФОРМАЦИЯ О ПЕРВОМ ПОЛЬЗОВАТЕЛЕ:');
            displayUserInfo(userResponse.data);
            
            // Можно продолжить цепочку с другими операциями
            console.log('\n📝 Выполняем дополнительные операции...');
            return processUserData(userResponse.data);
        })
        .then(processedData => {
            console.log('\n✅ ОБРАБОТАННЫЕ ДАННЫЕ:');
            console.log(processedData);
            
            console.log('\n🎯 ЦЕПОЧКА PROMISE УСПЕШНО ЗАВЕРШЕНА!');
        })
        .catch(error => {
            console.error('\n❌ ОШИБКА В ЦЕПОЧКЕ:');
            console.error('Сообщение:', error.message);
            console.error('Стек:', error.stack);
        })
        .finally(() => {
            console.log('\n🏁 БЛОК FINALLY: Операция завершена (успешно или с ошибкой)');
        });
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
    console.log(`│ Дата регистрации: ${user.registrationDate}`);
    console.log('└─────────────────────────────────────');
}

/**
 * Дополнительная обработка данных пользователя
 * @param {Object} user - Объект пользователя
 * @returns {Promise} - Promise с обработанными данными
 */
function processUserData(user) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const processedData = {
                ...user,
                processedAt: new Date().toISOString(),
                isActive: true,
                profileComplete: user.age && user.city ? 100 : 50
            };
            resolve(processedData);
        }, 1000);
    });
}

/**
 * Пример с обработкой ошибок
 */
function errorExample() {
    console.log('\n\n🚨 ПРИМЕР С ОБРАБОТКОЙ ОШИБОК\n');
    
    fetchData('/api/error')
        .then(response => {
            console.log('Этот код не выполнится из-за ошибки');
            return response;
        })
        .catch(error => {
            console.error('❌ ПЕРЕХВАЧЕНА ОШИБКА:');
            console.error('Тип:', error.name);
            console.error('Сообщение:', error.message);
            
            // Можно вернуть значение по умолчанию или пробросить ошибку дальше
            return { status: 'error', message: 'Используем запасные данные' };
        })
        .then(result => {
            console.log('\n📊 РЕЗУЛЬТАТ ПОСЛЕ ОБРАБОТКИ ОШИБКИ:');
            console.log(result);
        });
}

/**
 * Пример с Promise.all для параллельных запросов
 */
function parallelExample() {
    console.log('\n\n🔄 ПРИМЕР С PARALLEL ЗАПРОСАМИ (Promise.all)\n');
    
    const userRequests = [
        fetchData('/api/users/1', 1500),
        fetchData('/api/users/2', 1000),
        fetchData('/api/users/3', 2000)
    ];
    
    Promise.all(userRequests)
        .then(responses => {
            console.log('\n✅ ВСЕ PARALLEL ЗАПРОСЫ ВЫПОЛНЕНЫ:');
            responses.forEach((response, index) => {
                console.log(`\nПользователь ${index + 1}:`, response.data.name);
            });
        })
        .catch(error => {
            console.error('❌ ОШИБКА В PARALLEL ЗАПРОСАХ:', error.message);
        });
}

/**
 * Пример с Promise.race
 */
function raceExample() {
    console.log('\n\n🏎️ ПРИМЕР С Promise.race\n');
    
    const fastRequest = fetchData('/api/users/1', 500);
    const slowRequest = fetchData('/api/users/2', 3000);
    
    Promise.race([fastRequest, slowRequest])
        .then(winner => {
            console.log('🎉 ПОБЕДИТЕЛЬ Promise.race:');
            console.log('Данные:', winner.data);
        })
        .catch(error => {
            console.error('Ошибка в Promise.race:', error.message);
        });
}

// Запуск примеров
console.log('🌟 ДЕМОНСТРАЦИЯ РАБОТЫ С PROMISE\n');

// Основная цепочка
main();

// После завершения основной цепочки запускаем другие примеры
setTimeout(() => {
    errorExample();
}, 8000);

setTimeout(() => {
    parallelExample();
}, 12000);

setTimeout(() => {
    raceExample();
}, 16000);

// ДОПОЛНИТЕЛЬНЫЕ ПРИМЕРЫ:

/**
 * Пример с async/await (современный синтаксис)
 */
async function asyncAwaitExample() {
    console.log('\n\n⏳ ЗАПУСК ASYNC/AWAIT ПРИМЕРА\n');
    
    try {
        console.log('1. Запрашиваем список пользователей...');
        const usersResponse = await fetchData('/api/users');
        
        console.log('2. Получаем информацию о втором пользователе...');
        const userResponse = await fetchData(`/api/users/${usersResponse.data[1].id}`);
        
        console.log('3. Обрабатываем данные...');
        const processedData = await processUserData(userResponse.data);
        
        console.log('\n✅ ASYNC/AWAIT РЕЗУЛЬТАТ:');
        displayUserInfo(processedData);
        
    } catch (error) {
        console.error('❌ ОШИБКА В ASYNC/AWAIT:', error.message);
    }
}

// Запуск async/await примера
setTimeout(() => {
    asyncAwaitExample();
}, 20000);

/**
 * ОЖИДАЕМЫЙ ВЫВОД ПРОГРАММЫ:
 * 
 * 🚀 ЗАПУСК ЦЕПОЧКИ PROMISE
 * 🔄 Начало запроса к: /api/users
 * ✅ Запрос пользователей выполнен
 * 
 * 📋 ПОЛУЧЕН СПИСОК ПОЛЬЗОВАТЕЛЕЙ:
 * [...]
 * 🔍 Запрашиваем информацию о пользователе с ID: 1
 * 🔄 Начало запроса к: /api/users/1
 * ✅ Запрос информации о пользователе 1 выполнен
 * 
 * 👤 ИНФОРМАЦИЯ О ПЕРВОМ ПОЛЬЗОВАТЕЛЕ:
 * ┌─────────────────────────────────────
 * │ 👤 ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ
 * ├─────────────────────────────────────
 * │ ID: 1
 * │ Имя: Иван Иванов
 * │ Email: ivan@example.com
 * │ Возраст: 28
 * │ Город: Москва
 * │ Дата регистрации: 2020-05-15
 * └─────────────────────────────────────
 * 
 * 📝 Выполняем дополнительные операции...
 * ✅ ОБРАБОТАННЫЕ ДАННЫЕ:
 * { ... }
 * 
 * 🎯 ЦЕПОЧКА PROMISE УСПЕШНО ЗАВЕРШЕНА!
 * 🏁 БЛОК FINALLY: Операция завершена (успешно или с ошибкой)
 */