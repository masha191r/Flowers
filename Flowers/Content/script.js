document.addEventListener("DOMContentLoaded", () => {
    // Об'єкт з масивом товарів

    const gallery = document.getElementById("gallery");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const applyFilter = document.getElementById("applyFilter");
    const subscriptionModal = document.getElementById("subscriptionModal");
    const adModal = document.getElementById("adModal");
    const subscribeBtn = document.getElementById("subscribe");
    const declineBtn = document.getElementById("decline");
    const closeAdBtn = document.getElementById("closeAd");
    const countdownSpan = document.getElementById("countdown");
    const products = JSON.parse(document.getElementById('jsonData').innerText);
    // Налаштування карточок
    function renderGallery(items) {
    
    const container = document.getElementById('gallery');

    products.forEach(item => {
       const card = `
           <div class="card">
               <a href="product.html?id=${item.Id}">
                   <img src="../${item.Img}" alt="${item.Name}">
               </a>
               <h3>${item.Name}</h3>
               <h3>${item.Category}</h3>
               <p class="price">Ціна: ${item.Price} грн</p>
               <button class="add-to-cart"
                       data-id="${item.Id}"
                       data-name="${item.Name}"
                       data-category="${item.Category}"
                       data-price="${item.Price}">+</button>
           </div>
       `;
       container.insertAdjacentHTML('beforeend', card);
    });
    }

    const categories = [...new Set(products.map(p => p.category))];
    categoryFilter.innerHTML = `<option value="">Всі</option>` + categories.map(c => `<option value="${c}">${c}</option>`).join("");

    applyFilter.addEventListener("click", () => {
        const selectedCategory = categoryFilter.value;
        const maxPrice = parseInt(priceFilter.value) || Infinity;
        const filtered = products.filter(p => (selectedCategory === "" || p.category === selectedCategory) && p.price <= maxPrice);
        renderGallery(filtered);
    });

    renderGallery(products);
});

document.addEventListener("DOMContentLoaded", () => {
    const scrollModal = document.getElementById("scrollModal");
    const closeBtn = document.getElementById("closeScrollModal");
    const countdownEl = document.getElementById("countdownTimer");

    let scrollTriggered = false;
    let countdown = 5;

    // Функція для показу модального вікна
    function showScrollModal() {
        // Модальне вікно де зберігає в localeStorage відповідь
        console.log("Модальне вікно показано"); // Перевірка, чи відкривається модальне вікно
        scrollModal.style.display = "block";

        let interval = setInterval(() => {
            countdown--; // Зменшуємо відлік на кожну секунду
            console.log(`Таймер: ${countdown}`); // Перевірка, чи змінюється відлік

            if (countdown > 0) {
                // Оновлюємо текст
                countdownEl.innerText = countdown;
                console.log("Оновлено текст: ", countdownEl.innerText); // Перевірка тексту
            } else {
                // Коли відлік досягне 0, зупиняємо таймер
                clearInterval(interval);
                console.log("Таймер завершено"); // Перевірка, чи зупиняється таймер

                // Змінюємо статус кнопки
                closeBtn.disabled = false;
                closeBtn.classList.add("enabled");
                closeBtn.innerText = "Закрити";
            }
        }, 1000);
    }

    // Подія скролу для показу модального вікна
    window.addEventListener("scroll", () => {
        if (!scrollTriggered) {
            scrollTriggered = true;
            showScrollModal(); // Викликаємо функцію, коли скролимось
        }
    });

    // Обробник події для кнопки "Закрити"
    closeBtn.addEventListener("click", () => {
        if (!closeBtn.disabled) {
            scrollModal.style.display = "none"; // Закриваємо модальне вікно
        }
    });

    //Перевірка підписки
    const subscriptionModal = document.getElementById("subscriptionModal");
    const subscribeBtn = document.getElementById("subscribe");
    const declineBtn = document.getElementById("decline");

    // Check localStorage
    const isSubscribed = localStorage.getItem("subscribed");

    // If not subscribed, show modal after 3 seconds
    if (isSubscribed !== "yes") {
        setTimeout(() => {
            subscriptionModal.style.display = "block";
        }, 3000);
    }

    // On "Так" click
    subscribeBtn.addEventListener("click", () => {
        alert("Дякуємо за підписку!");
        localStorage.setItem("subscribed", "yes"); // Save the answer
        subscriptionModal.style.display = "none";
    });

    // On "Ні" click
    declineBtn.addEventListener("click", () => {
        localStorage.setItem("subscribed", "no"); // Optionally save "no"
        subscriptionModal.style.display = "none";
    });

    // Змінено: використовуємо об'єкт для картItems, а не масив
    const cartItems = {};
    const cartTableBody = document.querySelector('#cartTable tbody');

    // Додаємо обробник для кнопок "додати в кошик"
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart')) {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            // Виправлено: зберігаємо категорію з data-атрибута
            const category = e.target.dataset.category;
            const price = e.target.dataset.price;
            
            // Перевіряємо, чи товар вже є в кошику
            if (cartItems[id]) {
                cartItems[id].count += 1;
            } else {
                // Зберігаємо разом з категорією
                cartItems[id] = { id, name, category, price, count: 1 };
            }

            // Оновлюємо таблицю і графік
            renderCartTable(cartItems);
            renderChart(document.getElementById("graphType").value);
        }
        
        // Обробка відкриття модального вікна кошика
        if (e.target.id === 'cartButton') {
            document.getElementById('cartModal').style.display = 'flex';
        }

        // Закриття модального
        if (e.target.classList.contains('close')) {
            document.getElementById('cartModal').style.display = 'none';
        }
    });

    // Функція для оновлення кількості товару
    window.updateItemCount = function(id, newCount) {
        if (cartItems[id]) {
            cartItems[id].count = parseInt(newCount, 10);
            renderCartTable(cartItems);
            renderChart(document.getElementById("graphType").value);
        }
    };

    // Функція для видалення товару з кошика
    window.removeItemFromCart = function(id) {
        delete cartItems[id];
        renderCartTable(cartItems);
        renderChart(document.getElementById("graphType").value);
    };

    // Функція відображення таблиці кошика
    function renderCartTable(items) {
        cartTableBody.innerHTML = '';
        var sum = 0;
        
        Object.values(items).forEach(item => {
            if (item) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.category}</td> <!-- Додано відображення категорії -->
                    <td>${item.price} грн</td>
                    <td><input type="number" value="${item.count}" min="1" onchange="updateItemCount('${item.id}', this.value)"></td>
                    <td><button onclick="removeItemFromCart('${item.id}')">Видалити</button></td>
                `;
                cartTableBody.appendChild(row);
                sum += parseInt(item.price) * parseInt(item.count);
            }
        });

        const rowSum = document.createElement('tr');
        rowSum.innerHTML = `<tr><td colspan="2"></td><td>Загальна вартість:</td><td>${sum}</td><td></td></tr>`;
        cartTableBody.appendChild(rowSum);
    }

    // Обробники сортування для таблиці кошика
    document.querySelectorAll('#cartTable thead th[data-column]').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            let order = header.getAttribute('data-order') || 'asc';

            // Toggle order
            order = (order === 'asc') ? 'desc' : 'asc';
            header.setAttribute('data-order', order);

            // Reset all arrows
            document.querySelectorAll('.sort-arrow').forEach(arrow => arrow.textContent = '');

            // Set current arrow
            const arrow = header.querySelector('.sort-arrow');
            if (arrow) {
                arrow.textContent = order === 'asc' ? '▲' : '▼';
            }
        });
    });

    //скролл блок
    window.addEventListener('scroll', function () {
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        const scrollPosition = window.scrollY;
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (scrollPosition > windowHeight * 2 / 3) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // графік
    const ctx = document.getElementById("chartCanvas").getContext("2d");
    let chart = null;

    // Змінено: функція для отримання статистики по категоріях
    function getCategoryStats() {
        const stats = {};
        
        // Підраховуємо кількість товарів у кожній категорії
        Object.values(cartItems).forEach(item => {
            if (item && item.category) {
                if (!stats[item.category]) {
                    stats[item.category] = 0;
                }
                stats[item.category] += parseInt(item.count);
            }
        });
        
        return stats;
    }

    // Змінено: функція рендерингу графіка на основі категорій
    window.renderChart = function(type) {
        const categoryStats = getCategoryStats();
        const labels = Object.keys(categoryStats);
        const data = Object.values(categoryStats);

        const backgroundColors = [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(161, 147, 87, 0.6)",
            "rgba(153, 102, 255, 0.6)"
        ];

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: "Кількість квітів за категоріями",
                    data: data,
                    backgroundColor: backgroundColors.slice(0, data.length),
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: type === "pie" ? {} : {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Кількість'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Категорії квітів'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: type === "pie"
                    },
                    title: {
                        display: true
                    }
                }
            }
        });
    };

    // Обробник кнопки оновлення графіка
    document.getElementById("updateGraph").addEventListener("click", () => {
        const selectedType = document.getElementById("graphType").value;
        renderChart(selectedType);
    });

    // Початковий графік
    renderChart("pie");
});