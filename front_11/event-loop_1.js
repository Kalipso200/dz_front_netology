// event-loop-demo.js

console.log('Синхронный код 1'); // 1️⃣ Выполняется первым

setTimeout(() => console.log('setTimeout 1'), 0); // 4️⃣ Выполняется четвертым

Promise.resolve().then(() => console.log('Promise 1')); // 3️⃣ Выполняется третьим

console.log('Синхронный код 2'); // 2️⃣ Выполняется вторым

// ДОПОЛНИТЕЛЬНЫЙ ПРИМЕР ДЛЯ ЛУЧШЕГО ПОНИМАНИЯ:

console.log('\n=== ДОПОЛНИТЕЛЬНЫЙ ПРИМЕР ===');

// Синхронный код - выполняется сразу
console.log('🔴 Синхронная задача 1');

// Microtask (Promise) - выполняется после синхронного кода, но до следующего макрозадания
Promise.resolve()
    .then(() => console.log('🟢 Microtask 1 (Promise)'));

// Macrotask (setTimeout) - выполняется после всех микрозадач
setTimeout(() => console.log('🔵 Macrotask 1 (setTimeout)'), 0);

// Еще синхронный код
console.log('🔴 Синхронная задача 2');

// Другой microtask
Promise.resolve()
    .then(() => {
        console.log('🟢 Microtask 2 (Promise)');
        // Внутри microtask можно создавать другие microtasks
        Promise.resolve().then(() => console.log('🟢 Microtask 3 (вложенный)'));
    });

// Другой macrotask
setTimeout(() => console.log('🔵 Macrotask 2 (setTimeout)'), 0);

console.log('🔴 Синхронная задача 3');

// ОБЪЯСНЕНИЕ ПОРЯДКА ВЫПОЛНЕНИЯ:

/**
 * 📋 ПОРЯДОК ВЫПОЛНЕНИЯ EVENT LOOP:
 * 
 * 1. 🔴 СИНХРОННЫЙ КОД: Выполняется сразу, по порядку
 *    - console.log('Синхронный код 1')
 *    - console.log('Синхронный код 2')
 * 
 * 2. 🟢 MICROTASKS (Микрозадачи): Выполняются ПОСЛЕ синхронного кода
 *    - Promise.then() callbacks
 *    - queueMicrotask()
 *    - process.nextTick() (в Node.js)
 * 
 * 3. 🔵 MACROTASKS (Макрозадачи): Выполняются ПОСЛЕ микрозадач
 *    - setTimeout()
 *    - setInterval()
 *    - setImmediate() (в Node.js)
 *    - I/O операции
 *    - UI rendering (в браузере)
 * 
 * 🔄 ЦИКЛ EVENT LOOP:
 * 1. Выполнить весь синхронный код до завершения
 * 2. Выполнить ВСЕ микрозадачи из очереди
 * 3. Выполнить ОДНУ макрозадачу из очереди
 * 4. Повторить с шага 2
 */

// ВИЗУАЛИЗАЦИЯ ОЧЕРЕДЕЙ:

console.log('\n=== ВИЗУАЛИЗАЦИЯ ОЧЕРЕДЕЙ ===');

console.log('📝 Начало выполнения');

// Этапы Event Loop:
setTimeout(() => {
    console.log('\n📊 ТЕКУЩЕЕ СОСТОЯНИЕ ОЧЕРЕДЕЙ:');
    console.log('1. Call Stack: [ ]');
    console.log('2. Microtask Queue: [ ]');
    console.log('3. Macrotask Queue: [ ]');
    console.log('✅ ВСЕ ЗАДАЧИ ВЫПОЛНЕНЫ!');
}, 100);

// Пример с асинхронной операцией
console.log('\n=== ПРИМЕР С ASYNC/AWAIT ===');

async function asyncExample() {
    console.log('🔶 Начало async функции');
    
    // await создает microtask
    await Promise.resolve();
    console.log('🟢 После await (microtask)');
    
    return 'Готово!';
}

asyncExample().then(result => {
    console.log('🟢 Результат async функции:', result);
});

console.log('🔴 Код после async вызова');

// ОЖИДАЕМЫЙ ВЫВОД ПРОГРАММЫ:
/**
 * 
 * ОЖИДАЕМЫЙ ПОРЯДОК ВЫВОДА:
 * 
 * Синхронный код 1
 * Синхронный код 2
 * 
 * === ДОПОЛНИТЕЛЬНЫЙ ПРИМЕР ===
 * 🔴 Синхронная задача 1
 * 🔴 Синхронная задача 2
 * 🔴 Синхронная задача 3
 * 
 * === ВИЗУАЛИЗАЦИЯ ОЧЕРЕДЕЙ ===
 * 📝 Начало выполнения
 * 
 * === ПРИМЕР С ASYNC/AWAIT ===
 * 🔶 Начало async функции
 * 🔴 Код после async вызова
 * 
 * 🟢 Microtask 1 (Promise)
 * 🟢 Microtask 2 (Promise)
 * 🟢 Microtask 3 (вложенный)
 * 🟢 После await (microtask)
 * 🟢 Результат async функции: Готово!
 * Promise 1
 * 
 * 🔵 Macrotask 1 (setTimeout)
 * 🔵 Macrotask 2 (setTimeout)
 * setTimeout 1
 * 
 * 📊 ТЕКУЩЕЕ СОСТОЯНИЕ ОЧЕРЕДЕЙ:
 * 1. Call Stack: [ ]
 * 2. Microtask Queue: [ ]
 * 3. Macrotask Queue: [ ]
 * ✅ ВСЕ ЗАДАЧИ ВЫПОЛНЕНЫ!
 */