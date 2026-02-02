// Инициализация AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
});

// Данные приложения
const appData = {
    emergencyContacts: [
        { id: 1, service: "Экстренный телефон VDKTravel", number: "+7 (999) 111-22-33", icon: "📞" },
        { id: 2, service: "Медицинская помощь", number: "+7 (999) 444-55-66", icon: "🏥" },
        { id: 3, service: "Полиция", number: "102", icon: "🚓" },
        { id: 4, service: "Пожарная служба", number: "101", icon: "🚒" },
        { id: 5, service: "Скорая помощь", number: "103", icon: "🚑" },
        { id: 6, service: "Аварийная газовая служба", number: "104", icon: "⚠️" }
    ],
    
    availableTours: [
        { id: 1, name: "Исторический тур по Владивостоку", price: 2500, duration: "4 часа", maxPeople: 15 },
        { id: 2, name: "Тур по мостам и набережной", price: 1800, duration: "3 часа", maxPeople: 20 },
        { id: 3, name: "Экскурсия на остров Русский", price: 3500, duration: "6 часов", maxPeople: 12 },
        { id: 4, name: "Вечерний тур с подсветкой", price: 2200, duration: "3 часа", maxPeople: 18 },
        { id: 5, name: "Гастрономический тур", price: 3200, duration: "5 часов", maxPeople: 10 }
    ],
    
    submittedForms: [],
    formCounter: 0
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница контактов загружена');
    
    // Инициализация IMask для телефона
    initPhoneMask();
    
    // Инициализация Tippy.js
    initTippyTooltips();
    
    // Инициализация обработчиков форм
    initFormHandlers();
});

// Функция инициализации маски телефона
function initPhoneMask() {
    const phoneElement = document.getElementById('userPhone');
    
    if (phoneElement) {
        const maskOptions = {
            mask: '+{7}(000)000-00-00',
            lazy: false,
            placeholderChar: '_',
            definitions: {
                '0': {
                    pattern: /[0-9]/
                }
            }
        };
        
        try {
            const mask = IMask(phoneElement, maskOptions);
            console.log('✅ IMask успешно инициализирован для телефона');
            
            // Для отладки
            mask.on('accept', () => {
                console.log('Введён телефон:', mask.value);
            });
            
        } catch (error) {
            console.error('❌ Ошибка при инициализации IMask:', error);
        }
    } else {
        console.error('❌ Элемент userPhone не найден в DOM');
    }
}

// Функция инициализации Tippy.js
function initTippyTooltips() {
    // Настройка темы для Tippy
    const customTheme = {
        'custom': {
            backgroundColor: '#7601ac',
            color: 'white',
            arrow: true,
            animation: 'scale',
            placement: 'top',
            delay: [100, 50],
        }
    };
    
    // Инициализация Tippy для всех элементов с data-tippy-content
    tippy('[data-tippy-content]', {
        theme: 'custom',
        animation: 'scale',
        arrow: true,
        placement: 'top',
        delay: [100, 50],
        duration: 200,
    });
    
    // Специальный Tippy для кнопки отправки
    tippy('#submitBtn', {
        content: "📨 Нажмите для отправки сообщения",
        theme: 'custom',
        animation: 'scale',
        placement: 'top',
        arrow: true,
        onShow(instance) {
            console.log('Показана подсказка для кнопки отправки');
        }
    });
    
    console.log('✅ Tippy.js инициализирован');
}

// Функция инициализации обработчиков форм
function initFormHandlers() {
    // Основная форма обратной связи
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitContactForm();
        });
    }
    
    // Форма записи на тур
    const tourForm = document.getElementById('tourForm');
    if (tourForm) {
        tourForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitTourForm();
        });
    }
}

// Функция отправки контактной формы
function submitContactForm() {
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    
    // Получаем данные формы
    const formData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value,
        message: document.getElementById('userMessage').value
    };
    
    console.log('Отправка формы:', formData);
    
    // Меняем текст кнопки
    submitBtn.textContent = "Отправка...";
    submitBtn.disabled = true;
    
    // Показываем временный tooltip
    const instance = tippy('#submitBtn');
    instance.setContent("✅ Сообщение отправлено!");
    
    // Имитация отправки на сервер
    setTimeout(() => {
        // Добавляем форму в историю
        appData.submittedForms.push({
            id: ++appData.formCounter,
            ...formData,
            date: new Date().toISOString()
        });
        
        // Возвращаем исходное состояние
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Сбрасываем форму
        document.getElementById('contactForm').reset();
        
        // Возвращаем оригинальный tooltip через 3 секунды
        setTimeout(() => {
            instance.setContent("📨 Нажмите для отправки сообщения");
        }, 3000);
        
        console.log('✅ Форма успешно отправлена. Всего форм:', appData.submittedForms.length);
        
        // Показываем уведомление
        showNotification('Сообщение успешно отправлено!', 'success');
        
    }, 2000);
}

// Функция отправки формы тура
function submitTourForm() {
    const tourDate = document.getElementById('tourDate').value;
    const tourType = document.getElementById('tourType').value;
    const participants = document.getElementById('tourParticipants').value;
    const notes = document.getElementById('tourNotes').value;
    
    // Находим выбранный тур
    const selectedTour = appData.availableTours.find(tour => tour.id == tourType);
    
    if (!selectedTour) {
        showNotification('Пожалуйста, выберите тур', 'error');
        return;
    }
    
    console.log('Бронирование тура:', {
        tour: selectedTour.name,
        date: tourDate,
        participants: participants,
        notes: notes
    });
    
    // Закрываем модальное окно
    closeModal('scheduleModal');
    
    // Показываем уведомление
    showNotification(`Тур "${selectedTour.name}" забронирован на ${tourDate}`, 'success');
}

// Функция показа уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#7601ac'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Функция копирования в буфер обмена
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        // Показываем временный tooltip
        const button = event.target;
        const instance = tippy(button, {
            content: "✅ Скопировано!",
            theme: 'custom',
            trigger: 'manual',
        }).show();
        
        // Скрываем tooltip через 2 секунды
        setTimeout(() => {
            instance.hide();
        }, 2000);
        
        console.log(`📋 Скопировано: ${text}`);
        
        // Показываем уведомление
        showNotification('Текст скопирован в буфер обмена', 'success');
        
    }).catch(err => {
        console.error('Ошибка при копировании:', err);
        showNotification('Ошибка при копировании', 'error');
    });
}

// Функция отправки запроса партнёрства
function sendPartnershipRequest() {
    console.log('Отправка запроса на партнёрство');
    
    // Показываем уведомление
    showNotification('Запрос на партнёрство отправлен!', 'success');
    
    // Закрываем модальное окно
    setTimeout(() => {
        closeModal('partnersModal');
    }, 1500);
}

// Функции для модальных окон (оставляем как были)
function openEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    const contactsList = document.getElementById('emergencyContacts');
    
    contactsList.innerHTML = '';
    
    appData.emergencyContacts.forEach(contact => {
        const li = document.createElement('li');
        li.innerHTML = `${contact.icon} <strong>${contact.service}:</strong> ${contact.number}`;
        contactsList.appendChild(li);
    });
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    console.log('Открыто модальное окно: Экстренная связь');
}

function openScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    const tourSelect = document.getElementById('tourType');
    
    tourSelect.innerHTML = '<option value="">-- Выберите тур --</option>';
    
    appData.availableTours.forEach(tour => {
        const option = document.createElement('option');
        option.value = tour.id;
        option.textContent = `${tour.name} - ${tour.price} руб. (${tour.duration}, до ${tour.maxPeople} чел.)`;
        tourSelect.appendChild(option);
    });
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tourDate').min = today;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    console.log('Открыто модальное окно: Запись на тур');
}

function openPartnersModal() {
    const modal = document.getElementById('partnersModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    console.log('Открыто модальное окно: Для партнёров');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
    console.log(`Закрыто модальное окно: ${modalId}`);
}
 
 
 
 
 
 
 
 
 
 
 
 
 