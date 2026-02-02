 const appData = {
            // Массив экстренных контактов
            emergencyContacts: [
                { id: 1, service: "Экстренный телефон VDKTravel", number: "+7 (999) 111-22-33", icon: "📞" },
                { id: 2, service: "Медицинская помощь", number: "+7 (999) 444-55-66", icon: "🏥" },
                { id: 3, service: "Полиция", number: "102", icon: "🚓" },
                { id: 4, service: "Пожарная служба", number: "101", icon: "🚒" },
                { id: 5, service: "Скорая помощь", number: "103", icon: "🚑" },
                { id: 6, service: "Аварийная газовая служба", number: "104", icon: "⚠️" }
            ],
            
            // Массив доступных туров
            availableTours: [
                { id: 1, name: "Исторический тур по Владивостоку", price: 2500, duration: "4 часа", maxPeople: 15 },
                { id: 2, name: "Тур по мостам и набережной", price: 1800, duration: "3 часа", maxPeople: 20 },
                { id: 3, name: "Экскурсия на остров Русский", price: 3500, duration: "6 часов", maxPeople: 12 },
                { id: 4, name: "Вечерний тур с подсветкой", price: 2200, duration: "3 часа", maxPeople: 18 },
                { id: 5, name: "Гастрономический тур", price: 3200, duration: "5 часов", maxPeople: 10 }
            ],
            
            // Массив для хранения заявок
            submittedForms: [],
            
            // Счётчик для ID заявок
            formCounter: 0
        };

        // ============================================
        // 2. ФУНКЦИИ (требование 5)
        // ============================================
        
        // Функция для открытия модального окна экстренной связи
        function openEmergencyModal() {
            const modal = document.getElementById('emergencyModal');
            const contactsList = document.getElementById('emergencyContacts');
            
            // Очищаем список
            contactsList.innerHTML = '';
            
            // Заполняем список контактами из массива
            appData.emergencyContacts.forEach(contact => {
                const li = document.createElement('li');
                li.innerHTML = `${contact.icon} <strong>${contact.service}:</strong> ${contact.number}`;
                contactsList.appendChild(li);
            });
            
            // Показываем модальное окно
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Логируем событие
            console.log('Открыто модальное окно: Экстренная связь');
        }

        // Функция для открытия модального окна записи на тур
        function openScheduleModal() {
            const modal = document.getElementById('scheduleModal');
            const tourSelect = document.getElementById('tourType');
            
            // Очищаем select
            tourSelect.innerHTML = '<option value="">-- Выберите тур --</option>';
            
            // Заполняем select турами из массива
            appData.availableTours.forEach(tour => {
                const option = document.createElement('option');
                option.value = tour.id;
                option.textContent = `${tour.name} - ${tour.price} руб. (${tour.duration}, до ${tour.maxPeople} чел.)`;
                tourSelect.appendChild(option);
            });
            
            // Устанавливаем минимальную дату (сегодня)
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('tourDate').min = today;
            
            // Показываем модальное окно
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            console.log('Открыто модальное окно: Запись на тур');
        }

        // Функция для открытия модального окна для партнёров
        function openPartnersModal() {
            const modal = document.getElementById('partnersModal');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('Открыто модальное окно: Для партнёров');
        }

        // Функция для закрытия модального окна
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log(`Закрыто модальное окно: ${modalId}`);
        }

        // Функция для копирования текста в буфер обмена
        function copyToClipboard(elementId) {
            const text = document.getElementById(elementId).textContent;
            navigator.clipboard.writeText(text).then(() => {
                alert(`Скопировано: ${text}`);
                console.log(`Скопирован текст: ${text}`);
            }).catch(err => {
                console.error('Ошибка при копировании:', err);
                alert('Не удалось скопировать текст');
            });
        }

        // Функция отправки основной формы
        function submitMainForm(event) {
            event.preventDefault();
            
            // Получаем данные формы
            const formData = {
                id: ++appData.formCounter,
                type: 'main_form',
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                phone: document.getElementById('userPhone').value,
                message: document.getElementById('userMessage').value,
                timestamp: new Date().toISOString()
            };
            
            // ============================================
            // 3. УСЛОВНЫЕ КОНСТРУКЦИИ (требование 6)
            // ============================================
            
            // Проверка имени (должно быть не менее 2 символов)
            if (formData.name.length < 2) {
                alert('Имя должно содержать минимум 2 символа');
                return;
            }
            
            // Проверка email с использованием регулярного выражения
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Пожалуйста, введите корректный email адрес');
                return;
            }
            
            // Проверка телефона (должен содержать +7)
            if (!formData.phone.includes('+7')) {
                alert('Телефон должен начинаться с +7');
                return;
            }
            
            // Проверка сообщения (не менее 10 символов)
            if (formData.message.length < 10) {
                alert('Сообщение должно содержать минимум 10 символов');
                return;
            }
            
            // Проверка на спам (если сообщение слишком короткое или содержит спам-слова)
            const spamWords = ['casino', 'viagra', 'xxx', 'lottery'];
            let isSpam = false;
            
            for (let word of spamWords) {
                if (formData.message.toLowerCase().includes(word)) {
                    isSpam = true;
                    break;
                }
            }
            
            if (isSpam) {
                alert('Ваше сообщение содержит запрещённые слова');
                return;
            }
            
            // Сохраняем данные в массив
            appData.submittedForms.push(formData);
            
            // Определяем тип пользователя на основе имени
            let userType = 'обычный';
            if (formData.name.toLowerCase().includes('admin') || formData.name.toLowerCase().includes('админ')) {
                userType = 'администратор';
            } else if (formData.email.includes('@company.')) {
                userType = 'корпоративный';
            }
            
            // Показываем сообщение в зависимости от типа пользователя
            if (userType === 'администратор') {
                alert('Сообщение отправлено! Спасибо, администратор!');
            } else if (userType === 'корпоративный') {
                alert('Сообщение отправлено! Спасибо за обращение, корпоративный клиент!');
            } else {
                alert('Сообщение отправлено! Спасибо за ваше обращение!');
            }
            
            // Очищаем форму
            document.getElementById('mainContactForm').reset();
            
            // Логируем данные
            console.log('Отправлена основная форма:', formData);
            console.log('Всего заявок:', appData.submittedForms.length);
            console.log('Тип пользователя:', userType);
        }

        // Функция отправки формы записи на тур
        function submitTourForm(event) {
            event.preventDefault();
            
            const tourDate = document.getElementById('tourDate').value;
            const tourType = document.getElementById('tourType').value;
            const participants = parseInt(document.getElementById('tourParticipants').value);
            const notes = document.getElementById('tourNotes').value;
            
            // Проверка даты (нельзя выбрать прошедшую дату)
            const selectedDate = new Date(tourDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                alert('Нельзя выбрать прошедшую дату!');
                return;
            }
            
            // Проверка выбора тура
            if (!tourType) {
                alert('Пожалуйста, выберите тур');
                return;
            }
            
            // Находим выбранный тур в массиве
            const selectedTour = appData.availableTours.find(tour => tour.id == tourType);
            
            // Проверка количества участников
            if (participants < 1) {
                alert('Количество участников должно быть не менее 1');
                return;
            }
            
            if (participants > selectedTour.maxPeople) {
                alert(`Максимальное количество участников для этого тура: ${selectedTour.maxPeople}`);
                return;
            }
            
            // Рассчитываем стоимость
            const totalPrice = selectedTour.price * participants;
            
            // Определяем скидку в зависимости от количества участников
            let discount = 0;
            if (participants >= 10) {
                discount = 15;
            } else if (participants >= 5) {
                discount = 10;
            } else if (participants >= 3) {
                discount = 5;
            }
            
            const discountAmount = (totalPrice * discount) / 100;
            const finalPrice = totalPrice - discountAmount;
            
            // Создаем объект с данными заявки
            const tourRequest = {
                id: ++appData.formCounter,
                type: 'tour_booking',
                tourId: selectedTour.id,
                tourName: selectedTour.name,
                date: tourDate,
                participants: participants,
                notes: notes,
                originalPrice: totalPrice,
                discount: discount,
                discountAmount: discountAmount,
                finalPrice: finalPrice,
                timestamp: new Date().toISOString()
            };
            
            // Сохраняем в массив
            appData.submittedForms.push(tourRequest);
            
            // Показываем подтверждение с информацией о скидке
            let message = `Тур "${selectedTour.name}" успешно забронирован!\n`;
            message += `Дата: ${tourDate}\n`;
            message += `Количество участников: ${participants}\n`;
            message += `Стоимость: ${totalPrice} руб.\n`;
            
            if (discount > 0) {
                message += `Скидка ${discount}%: -${discountAmount} руб.\n`;
                message += `Итоговая стоимость: ${finalPrice} руб.`;
            } else {
                message += `Итоговая стоимость: ${totalPrice} руб.`;
            }
            
            alert(message);
            
            // Очищаем форму
            document.getElementById('tourForm').reset();
            
            // Закрываем модальное окно
            closeModal('scheduleModal');
            
            console.log('Забронирован тур:', tourRequest);
        }

        // Функция отправки запроса на партнёрство
        function sendPartnershipRequest() {
            const partnershipRequest = {
                id: ++appData.formCounter,
                type: 'partnership_request',
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            
            appData.submittedForms.push(partnershipRequest);
            
            alert('Запрос на сотрудничество отправлен! Мы свяжемся с вами в течение 2 рабочих дней.');
            closeModal('partnersModal');
            
            console.log('Отправлен запрос на партнёрство:', partnershipRequest);
        }

        // Функция для закрытия модальных окон при клике вне их
        function setupModalCloseOnClickOutside() {
            window.onclick = function(event) {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    if (event.target === modal) {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                });
            };
        }

        // Функция для закрытия модальных окон по клавише Escape
        function setupModalCloseOnEscape() {
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    const modals = document.querySelectorAll('.modal');
                    modals.forEach(modal => {
                        if (modal.style.display === 'flex') {
                            modal.style.display = 'none';
                            document.body.style.overflow = 'auto';
                        }
                    });
                }
            });
        }

        // Функция инициализации при загрузке страницы
        function init() {
            console.log('Страница контактов загружена');
            console.log('Доступные туры:', appData.availableTours.length);
            console.log('Экстренные контакты:', appData.emergencyContacts.length);
            
            setupModalCloseOnClickOutside();
            setupModalCloseOnEscape();
            
            // Показываем информацию о данных в консоли
            const totalTours = appData.availableTours.reduce((sum, tour) => sum + tour.maxPeople, 0);
            console.log(`Общая вместимость всех туров: ${totalTours} человек`);
            
            // Находим самый дорогой и самый дешёвый тур
            const prices = appData.availableTours.map(tour => tour.price);
            const maxPrice = Math.max(...prices);
            const minPrice = Math.min(...prices);
            console.log(`Самый дорогой тур: ${maxPrice} руб., самый дешёвый: ${minPrice} руб.`);
        }

        // Запускаем инициализацию при загрузке страницы
        document.addEventListener('DOMContentLoaded', init);