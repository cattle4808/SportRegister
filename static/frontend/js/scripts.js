// frontend/static/frontend/js/scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Получение CSRF токена
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    // Инициализация Select2 для поля видов спорта и факультета
    $('#sports').select2({
        placeholder: "Выберите виды спорта",
        allowClear: true,
        ajax: {
            url: '/api/v1/sports/',
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                return {
                    results: data.results.map(function(sport) {
                        return {
                            id: sport.id,
                            text: sport.name
                        };
                    })
                };
            },
            cache: true
        }
    });

    $('#faculty').select2({
        placeholder: "Выберите факультет",
        allowClear: true,
        ajax: {
            url: '/api/v1/faculties/',
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                return {
                    results: data.results.map(function(faculty) {
                        return {
                            id: faculty.id,
                            text: faculty.name
                        };
                    })
                };
            },
            cache: true
        }
    });

    // Обработка отправки форм
    const studentForm = document.getElementById('student-form');
    if (studentForm) {
        studentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitForm('/api/v1/students/', studentForm, 'form-message');
        });
    }

    const regularPersonForm = document.getElementById('regular-person-form');
    if (regularPersonForm) {
        regularPersonForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Предполагается, что обычный пользователь создаётся через тот же эндпоинт, что и студент
            // При необходимости, создайте отдельный ViewSet и эндпоинт
            submitForm('/api/v1/regular_persons/', regularPersonForm, 'form-message');
        });
    }

    // Функция отправки формы
    function submitForm(url, form, messageElementId) {
        const formData = new FormData(form);
        const data = {};

        // Обработка полей формы
        formData.forEach((value, key) => {
            if (key === 'sports') {
                // Для Select2 multiple, данные уже в виде массива
                data[key] = Array.from(form.querySelector('#sports').selectedOptions).map(option => parseInt(option.value));
            } else {
                data[key] = value;
            }
        });

        console.log('Отправляемые данные:', data);  // Для отладки

        // Отправка данных через fetch
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(data),
            credentials: 'include'  // Если требуется аутентификация
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => { throw errData; });
            }
            return response.json();
        })
        .then(data => {
            document.getElementById(messageElementId).textContent = "Данные успешно сохранены!";
            form.reset();
            // Сброс Select2 полей
            $('#sports').val(null).trigger('change');
            $('#faculty').val(null).trigger('change');
        })
        .catch(error => {
            console.error('Произошла ошибка при сохранении данных:', error);
            let errorMsg = "Произошла ошибка при сохранении данных.";
            if (error && typeof error === 'object') {
                errorMsg = '';
                for (const [field, messages] of Object.entries(error)) {
                    errorMsg += `${field}: ${messages.join(' ')}\n`;
                }
            }
            document.getElementById(messageElementId).textContent = errorMsg;
        });
    }
});
