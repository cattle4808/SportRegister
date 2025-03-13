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







//
//
//
//function getCookie(name) {
//  let cookieValue = null
//  if (document.cookie && document.cookie !== '') {
//    const cookies = document.cookie.split(';')
//    for (let cookie of cookies) {
//      cookie = cookie.trim()
//      if (cookie.substring(0, name.length + 1) === (name + '=')) {
//        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
//        break
//      }
//    }
//  }
//  return cookieValue
//}
//
//function clearErrors(form) {
//  const errorSpans = form.querySelectorAll('.error-message')
//  errorSpans.forEach(span => {
//    span.textContent = ''
//  })
//  const inputs = form.querySelectorAll('input, select, textarea')
//  inputs.forEach(input => {
//    input.classList.remove('invalid')
//  })
//}
//
//function showError(element, message) {
//  element.classList.add('invalid')
//  const parent = element.closest('.input-group') || element.parentElement
//  const errorSpan = parent.querySelector('.error-message')
//  if (errorSpan) {
//    errorSpan.textContent = message
//  }
//}
//
//function fillStudentForm(data) {
//  const form = document.getElementById('student-form')
//  if (!form) return
//  form.querySelector('#name1_student').value = data.name1
//  form.querySelector('#name2_student').value = data.name2
//  form.querySelector('#name3_student').value = data.name3 || ''
//  form.querySelector('#age_student').value = data.age
//  form.querySelector('#telegram_student').value = data.telegram
//  form.querySelector('#degree_student').value = data.degree
//  form.querySelector('#faculty_student').value = data.faculty_id
//  if (Array.isArray(data.sports_ids)) {
//    data.sports_ids.forEach(id => {
//      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`)
//      if (checkbox) checkbox.checked = true
//    })
//  }
//  const phoneInput = form.querySelector('#phone_student')
//  if (phoneInput && data.phone) {
//    phoneInput.value = data.phone
//    if (window.itiStudent) {
//      window.itiStudent.setNumber(data.phone)
//    }
//  }
//}
//
//function fillUserForm(data) {
//  const form = document.getElementById('user-form')
//  if (!form) return
//  form.querySelector('#name1_user').value = data.name1
//  form.querySelector('#name2_user').value = data.name2
//  form.querySelector('#name3_user').value = data.name3 || ''
//  form.querySelector('#age_user').value = data.age
//  form.querySelector('#telegram_user').value = data.telegram
//  form.querySelector('#home_user').value = data.home
//  if (Array.isArray(data.sports_ids)) {
//    data.sports_ids.forEach(id => {
//      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`)
//      if (checkbox) checkbox.checked = true
//    })
//  }
//  const phoneInput = form.querySelector('#phone_user')
//  if (phoneInput && data.phone) {
//    phoneInput.value = data.phone
//    if (window.itiUser) {
//      window.itiUser.setNumber(data.phone)
//    }
//  }
//}
//
//async function handleFormSubmit(e, formType) {
//  e.preventDefault()
//  const form = e.target
//  clearErrors(form)
//
//  const messageDiv = document.getElementById('message')
//  if (messageDiv) {
//    messageDiv.textContent = ''
//    messageDiv.style.color = ''
//  }
//
//  const name1 = form.querySelector('[name="name1"]')
//  const name2 = form.querySelector('[name="name2"]')
//  const name3 = form.querySelector('[name="name3"]')
//  const age = form.querySelector('[name="age"]')
//  const sportsChecked = form.querySelectorAll('input[name="sports"]:checked')
//  const telegram = form.querySelector('[name="telegram"]')
//  const degree = form.querySelector('[name="degree"]')
//  const faculty = form.querySelector('[name="faculty"]')
//  const home = form.querySelector('[name="home"]')
//
//  // Получаем ссылку на поле телефона
//  let phoneInput
//  let itiInstance
//  if (formType === 'students') {
//    phoneInput = form.querySelector('#phone_student')
//    itiInstance = window.itiStudent
//  } else {
//    phoneInput = form.querySelector('#phone_user')
//    itiInstance = window.itiUser
//  }
//
//  // Локальные проверки
//  if (!name1.value || name1.value.trim().length < 3) {
//    showError(name1, "Ism kamida 3 ta belgi.")
//    return
//  }
//  if (!name2.value || name2.value.trim().length < 3) {
//    showError(name2, "Familya kamida 3 ta belgi.")
//    return
//  }
//  if (name3 && name3.value.trim() && name3.value.trim().length < 3) {
//    showError(name3, "Otasining ismi kamida 3 ta belgi.")
//    return
//  }
//  if (!age.value) {
//    showError(age, "Tug'ilgan sanani ko'rsating.")
//    return
//  }
//  if (sportsChecked.length === 0) {
//    const sc = form.querySelector('#sports-container') || form.querySelector('#sports-container-user')
//    showError(sc, "Hech bo'lmasa bitta sport tanlang.")
//    return
//  }
//  if (!telegram.value.trim()) {
//    showError(telegram, "Telegram yozing (masalan, @username).")
//    return
//  }
//
//  // Проверка intl-tel-input (если включено)
//  let phoneValue = phoneInput.value.trim()
//  if (itiInstance) {
//    if (!itiInstance.isValidNumber()) {
//      showError(phoneInput, "Telefon raqami noto'g'ri yoki to'liq emas.")
//      return
//    }
//    // Берём номер в полном формате +XXX ...
//    phoneValue = itiInstance.getNumber()
//  } else {
//    if (!phoneValue.startsWith("+998") || phoneValue.length < 13) {
//      showError(phoneInput, "Telefon raqami +998 ... formatida bo'lsin.")
//      return
//    }
//  }
//
//  if (formType === 'students') {
//    if (!degree.value) {
//      showError(degree, "Darajani tanlang.")
//      return
//    }
//    if (!faculty.value) {
//      showError(faculty, "Fakultetni tanlang.")
//      return
//    }
//  } else if (formType === 'regular_persons') {
//    if (home && !home.value.trim()) {
//      showError(home, "Yashash manzilingizni kiriting.")
//      return
//    }
//  }
//
//  // Формируем данные
//  const formData = new FormData(form)
//  formData.set('phone', phoneValue) // Заменим phone на форматированный
//
//  try {
//    const response = await fetch(`/api/v1/${formType}/`, {
//      method: 'POST',
//      headers: { 'X-CSRFToken': getCookie('csrftoken') },
//      body: formData
//    })
//    const result = await response.json()
//    if (response.ok) {
//      if (result.session_id) {
//        if (formType === 'students') {
//          localStorage.setItem('student_session_id', result.session_id)
//        } else if (formType === 'regular_persons') {
//          localStorage.setItem('regular_person_session_id', result.session_id)
//        }
//      }
//      window.location.href = '/thank_you/'
//    } else {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545'
//        if (result.error) {
//          let errMsg = ''
//          for (const field in result.error) {
//            errMsg += `${field}: ${result.error[field].join(', ')}\n`
//          }
//          messageDiv.textContent = errMsg || "Serverda xatolik."
//        } else {
//          messageDiv.textContent = "Serverda xatolik yuz berdi."
//        }
//      }
//    }
//  } catch (error) {
//    if (messageDiv) {
//      messageDiv.style.color = '#dc3545'
//      messageDiv.textContent = "Tarmoq xatosi, server mavjud emas."
//    }
//  }
//}
//
//async function checkSession() {
//  const messageDiv = document.getElementById('message')
//  const studentForm = document.getElementById('student-form')
//  const userForm = document.getElementById('user-form')
//
//  if (studentForm) {
//    const sid = localStorage.getItem('student_session_id')
//    if (!sid) {
//      if (messageDiv) {
//        messageDiv.textContent = "Iltimos, shaklni to'ldiring."
//        messageDiv.style.color = '#6c757d'
//      }
//      return
//    }
//    try {
//      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`)
//      const data = await resp.json()
//      if (resp.ok && data.students && data.students.length > 0) {
//        if (messageDiv) {
//          messageDiv.textContent = `Xush kelibsiz, ${data.students[0].name1}!`
//          messageDiv.style.color = '#28a745'
//        }
//        fillStudentForm(data.students[0])
//      }
//    } catch (err) {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545'
//        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi."
//      }
//    }
//  } else if (userForm) {
//    const sid = localStorage.getItem('regular_person_session_id')
//    if (!sid) {
//      if (messageDiv) {
//        messageDiv.textContent = "Iltimos, shaklni to'ldiring."
//        messageDiv.style.color = '#6c757d'
//      }
//      return
//    }
//    try {
//      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`)
//      const data = await resp.json()
//      if (resp.ok && data.regular_persons && data.regular_persons.length > 0) {
//        if (messageDiv) {
//          messageDiv.textContent = `Xush kelibsiz, ${data.regular_persons[0].name1}!`
//          messageDiv.style.color = '#28a745'
//        }
//        fillUserForm(data.regular_persons[0])
//      }
//    } catch (err) {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545'
//        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi."
//      }
//    }
//  }
//}
//
//document.addEventListener('DOMContentLoaded', () => {
//  // Инициализация intl-tel-input для студента
//  const phoneStudent = document.getElementById('phone_student')
//  if (phoneStudent) {
//    window.itiStudent = window.intlTelInput(phoneStudent, {
//      initialCountry: "uz",
//      // Если хотите авто-геолокацию:
//       geoIpLookup: (success, failure) => {...},
//      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
//    })
//  }
//
//  // Инициализация intl-tel-input для обычного пользователя
//  const phoneUser = document.getElementById('phone_user')
//  if (phoneUser) {
//    window.itiUser = window.intlTelInput(phoneUser, {
//      initialCountry: "uz",
//      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
//    })
//  }
//
//  const studentForm = document.getElementById('student-form')
//  if (studentForm) {
//    studentForm.addEventListener('submit', (e) => handleFormSubmit(e, 'students'))
//  }
//
//  const userForm = document.getElementById('user-form')
//  if (userForm) {
//    userForm.addEventListener('submit', (e) => handleFormSubmit(e, 'regular_persons'))
//  }
//
//  // Предпросмотр фото (студент)
//  const photoStudent = document.getElementById('photo_student')
//  const previewStudent = document.getElementById('photo_preview_student')
//  if (photoStudent && previewStudent) {
//    photoStudent.addEventListener('change', () => {
//      const file = photoStudent.files[0]
//      if (file) {
//        const reader = new FileReader()
//        reader.onload = ev => {
//          previewStudent.src = ev.target.result
//          previewStudent.style.display = 'block'
//        }
//        reader.readAsDataURL(file)
//      } else {
//        previewStudent.src = ''
//        previewStudent.style.display = 'none'
//      }
//    })
//  }
//
//  // Предпросмотр фото (обычный пользователь)
//  const photoUser = document.getElementById('photo_user')
//  const previewUser = document.getElementById('photo_preview_user')
//  if (photoUser && previewUser) {
//    photoUser.addEventListener('change', () => {
//      const file = photoUser.files[0]
//      if (file) {
//        const reader = new FileReader()
//        reader.onload = ev => {
//          previewUser.src = ev.target.result
//          previewUser.style.display = 'block'
//        }
//        reader.readAsDataURL(file)
//      } else {
//        previewUser.src = ''
//        previewUser.style.display = 'none'
//      }
//    })
//  }
//
//  checkSession()
//})
//























//
//
//
//
//
//function getCookie(name) {
//  let cookieValue = null
//  if (document.cookie && document.cookie !== '') {
//    const cookies = document.cookie.split(';').map(c => c.trim())
//    const cookiePrefix = name + '='
//    const foundCookie = cookies.find(c => c.startsWith(cookiePrefix))
//    if (foundCookie) {
//      cookieValue = decodeURIComponent(foundCookie.substring(cookiePrefix.length))
//    }
//  }
//  return cookieValue
//}
//
//function clearErrors(form) {
//  const errorSpans = form.querySelectorAll('.error-message')
//  errorSpans.forEach(span => {
//    span.textContent = ''
//  })
//  const inputs = form.querySelectorAll('input, select, textarea')
//  inputs.forEach(input => {
//    input.classList.remove('invalid')
//  })
//}
//
//function showError(element, message) {
//  element.classList.add('invalid')
//  const parent = element.closest('.input-group') || element.parentElement
//  const errorSpan = parent.querySelector('.error-message')
//  if (errorSpan) {
//    errorSpan.textContent = message
//  }
//}
//
///*------------------ ФУНКЦИИ ДЛЯ ЗАПОЛНЕНИЯ ФОРМ ------------------*/
//
//// Студент
//function fillStudentForm(data) {
//  const form = document.getElementById('student-form')
//  if (!form) return
//  form.querySelector('#name1_student').value = data.name1
//  form.querySelector('#name2_student').value = data.name2
//  form.querySelector('#name3_student').value = data.name3 || ''
//  form.querySelector('#age_student').value = data.age
//  form.querySelector('#telegram_student').value = data.telegram
//  form.querySelector('#degree_student').value = data.degree
//  form.querySelector('#faculty_student').value = data.faculty_id
//
//  if (Array.isArray(data.sports_ids)) {
//    data.sports_ids.forEach(id => {
//      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`)
//      if (checkbox) checkbox.checked = true
//    })
//  }
//  const phoneInput = form.querySelector('#phone_student')
//  if (phoneInput && data.phone && window.itiStudent) {
//    phoneInput.value = data.phone
//    window.itiStudent.setNumber(data.phone)
//  }
//}
//
//
//function fillUserForm(data) {
//  const form = document.getElementById('user-form')
//  if (!form) return
//  form.querySelector('#name1_user').value = data.name1
//  form.querySelector('#name2_user').value = data.name2
//  form.querySelector('#name3_user').value = data.name3 || ''
//  form.querySelector('#age_user').value = data.age
//  form.querySelector('#telegram_user').value = data.telegram
//  form.querySelector('#home_user').value = data.home
//
//  if (Array.isArray(data.sports_ids)) {
//    data.sports_ids.forEach(id => {
//      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`)
//      if (checkbox) checkbox.checked = true
//    })
//  }
//  const phoneInput = form.querySelector('#phone_user')
//  if (phoneInput && data.phone && window.itiUser) {
//    phoneInput.value = data.phone
//    window.itiUser.setNumber(data.phone)
//  }
//}
//
//// Академический сотрудник
//function fillAcademicForm(data) {
//  const form = document.getElementById('academic-person-form')
//  if (!form) return
//  form.querySelector('#name1_academic').value = data.name1
//  form.querySelector('#name2_academic').value = data.name2
//  form.querySelector('#name3_academic').value = data.name3 || ''
//  form.querySelector('#age_academic').value = data.age
//  form.querySelector('#telegram_academic').value = data.telegram
//  form.querySelector('#job_academic').value = data.job
//  form.querySelector('#position_academic').value = data.position
//
//  if (Array.isArray(data.sports_ids)) {
//    data.sports_ids.forEach(id => {
//      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`)
//      if (checkbox) checkbox.checked = true
//    })
//  }
//  const phoneInput = form.querySelector('#phone_academic')
//  if (phoneInput && data.phone && window.itiAcademic) {
//    phoneInput.value = data.phone
//    window.itiAcademic.setNumber(data.phone)
//  }
//}
//
///*--------------------------------------------------------------*/
//
//async function handleFormSubmit(e, formType) {
//  e.preventDefault()
//  const form = e.target
//  clearErrors(form)
//
//  const messageDiv = document.getElementById('message')
//  if (messageDiv) {
//    messageDiv.textContent = ''
//    messageDiv.style.color = ''
//  }
//
//  // Общие поля
//  const name1 = form.querySelector('[name="name1"]')
//  const name2 = form.querySelector('[name="name2"]')
//  const name3 = form.querySelector('[name="name3"]')
//  const age = form.querySelector('[name="age"]')
//  const sportsChecked = form.querySelectorAll('input[name="sports"]:checked')
//  const telegram = form.querySelector('[name="telegram"]')
//
//  // Для студента
//  const degree = form.querySelector('[name="degree"]')
//  const faculty = form.querySelector('[name="faculty"]')
//
//  // Для обычного пользователя
//  const home = form.querySelector('[name="home"]')
//
//  // Для академика
//  const job = form.querySelector('[name="job"]')
//  const position = form.querySelector('[name="position"]')
//
//  // Подготовка к проверке телефона
//  let phoneInput
//  let itiInstance
//
//  if (formType === 'students') {
//    phoneInput = form.querySelector('#phone_student')
//    itiInstance = window.itiStudent
//  } else if (formType === 'regular_persons') {
//    phoneInput = form.querySelector('#phone_user')
//    itiInstance = window.itiUser
//  } else if (formType === 'academic_persons') {
//    phoneInput = form.querySelector('#phone_academic')
//    itiInstance = window.itiAcademic
//  }
//
//  // Валидации
//  if (!name1.value || name1.value.trim().length < 3) {
//    showError(name1, "Ism kamida 3 ta belgi.")
//    return
//  }
//  if (!name2.value || name2.value.trim().length < 3) {
//    showError(name2, "Familya kamida 3 ta belgi.")
//    return
//  }
//  if (name3 && name3.value.trim() && name3.value.trim().length < 3) {
//    showError(name3, "Otasining ismi kamida 3 ta belgi.")
//    return
//  }
//  if (!age.value) {
//    showError(age, "Tug'ilgan sanani ko'rsating.")
//    return
//  }
//  if (sportsChecked.length === 0) {
//    // Найдём контейнер чекбоксов
//    const sc = form.querySelector('#sports-container') ||
//               form.querySelector('#sports-container-user') ||
//               form.querySelector('#sports-container-academic')
//    showError(sc, "Hech bo'lmasa bitta sport tanlang.")
//    return
//  }
//  if (!telegram.value.trim()) {
//    showError(telegram, "Telegram yozing (masalan, @username).")
//    return
//  }
//
//  // Проверка intl-tel-input, если он подключён
//  let phoneValue = phoneInput.value.trim()
//  if (itiInstance) {
//    if (!itiInstance.isValidNumber()) {
//      showError(phoneInput, "Telefon raqami noto'g'ri yoki to'liq emas.")
//      return
//    }
//    phoneValue = itiInstance.getNumber() // В формате +XXX
//  } else {
//    // fallback: простая проверка
//    if (!phoneValue.startsWith("+998") || phoneValue.length < 13) {
//      showError(phoneInput, "Telefon raqami +998 ... formatida bo'lsin.")
//      return
//    }
//  }
//
//  // Доп. валидация по типам
//  if (formType === 'students') {
//    if (!degree.value) {
//      showError(degree, "Darajani tanlang.")
//      return
//    }
//    if (!faculty.value) {
//      showError(faculty, "Fakultetni tanlang.")
//      return
//    }
//  } else if (formType === 'regular_persons') {
//    if (home && !home.value.trim()) {
//      showError(home, "Yashash manzilingizni kiriting.")
//      return
//    }
//  } else if (formType === 'academic_persons') {
//    if (job && !job.value.trim()) {
//      showError(job, "Ish joyingizni kiriting.")
//      return
//    }
//    if (position && !position.value.trim()) {
//      showError(position, "Lavozimingizni kiriting.")
//      return
//    }
//  }
//
//  // Собираем данные, подменяем телефон
//  const formData = new FormData(form)
//  formData.set('phone', phoneValue)
//
//  try {
//    const response = await fetch(`/api/v1/${formType}/`, {
//      method: 'POST',
//      headers: { 'X-CSRFToken': getCookie('csrftoken') },
//      body: formData
//    })
//    const result = await response.json()
//    if (response.ok) {
//      // session_id может прилететь
//      if (result.session_id) {
//        if (formType === 'students') {
//          localStorage.setItem('student_session_id', result.session_id)
//        } else if (formType === 'regular_persons') {
//          localStorage.setItem('regular_person_session_id', result.session_id)
//        } else if (formType === 'academic_persons') {
//          localStorage.setItem('academic_person_session_id', result.session_id)
//        }
//      }
//      // Переходим на страницу "спасибо"
//      window.location.href = '/thank_you/'
//    } else {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545'
//        if (result.error) {
//          let errMsg = ''
//          for (const field in result.error) {
//            errMsg += `${field}: ${result.error[field].join(', ')}\n`
//          }
//          messageDiv.textContent = errMsg || "Serverda xatolik."
//        } else {
//          messageDiv.textContent = "Serverda xatolik yuz berdi."
//        }
//      }
//    }
//  } catch (error) {
//    if (messageDiv) {
//      messageDiv.style.color = '#dc3545'
//      messageDiv.textContent = "Tarmoq xatosi, server mavjud emas."
//    }
//  }
//}
//
//async function checkSession() {
//  const messageDiv = document.getElementById('message')
//  const studentForm = document.getElementById('student-form')
//  const userForm = document.getElementById('user-form')
//  const academicForm = document.getElementById('academic-person-form')
//
//  // Студент
//  if (studentForm) {
//    const sid = localStorage.getItem('student_session_id')
//    if (!sid) {
//      if (messageDiv) {
//        messageDiv.textContent = "Iltimos, shaklni to'ldiring."
//        messageDiv.style.color = '#6c757d'
//      }
//      return
//    }
//    try {
//      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`)
//      const data = await resp.json()
//      if (resp.ok && data.students && data.students.length > 0) {
//        if (messageDiv) {
//          messageDiv.textContent = `Xush kelibsiz, ${data.students[0].name1}!`
//          messageDiv.style.color = '#28a745'
//        }
//        fillStudentForm(data.students[0])
//      }
//    } catch (err) {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545'
//        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi."
//      }
//    }
//    return
//  }
//
//  // Обычный пользователь
//  if (userForm) {
//    const sid = localStorage.getItem('regular_person_session_id')
//    if (!sid) {
//      if (messageDiv) {
//        messageDiv.textContent = "Iltimos, shaklni to'ldiring."
//        messageDiv.style.color = '#6c757d'
//      }
//      return
//    }
//    try {
//      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`)
//      const data = await resp.json()
//      if (resp.ok && data.regular_persons && data.regular_persons.length > 0) {
//        if (messageDiv) {
//          messageDiv.textContent = `Xush kelibsiz, ${data.regular_persons[0].name1}!`
//          messageDiv.style.color = '#28a745'
//        }
//        fillUserForm(data.regular_persons[0])
//      }
//    } catch (err) {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545'
//        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi."
//      }
//    }
//    return
//  }
//
//  // Академический сотрудник
//  if (academicForm) {
//    const sid = localStorage.getItem('academic_person_session_id')
//    if (!sid) {
//      if (messageDiv) {
//        messageDiv.textContent = "Iltimos, shaklni to'ldiring."
//        messageDiv.style.color = '#6c757d'
//      }
//      return
//    }
//    try {
//      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`)
//      const data = await resp.json()
//      if (resp.ok && data.academic_persons && data.academic_persons.length > 0) {
//        if (messageDiv) {
//          messageDiv.textContent = `Xush kelibsiz, ${data.academic_persons[0].name1}!`
//          messageDiv.style.color = '#28a745'
//        }
//        fillAcademicForm(data.academic_persons[0])
//      }
//    } catch (err) {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545'
//        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi."
//      }
//    }
//    return
//  }
//}
//
//document.addEventListener('DOMContentLoaded', () => {
//  // Инициализация intl-tel-input для студента
//  const phoneStudent = document.getElementById('phone_student')
//  if (phoneStudent) {
//    window.itiStudent = window.intlTelInput(phoneStudent, {
//      initialCountry: "uz",
//      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
//      // geoIpLookup: (success, failure) => { ... } // если нужно авто-определение
//    })
//  }
//
//  // Инициализация intl-tel-input для обычного пользователя
//  const phoneUser = document.getElementById('phone_user')
//  if (phoneUser) {
//    window.itiUser = window.intlTelInput(phoneUser, {
//      initialCountry: "uz",
//      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
//    })
//  }
//
//  // Инициализация intl-tel-input для академического сотрудника
//  const phoneAcademic = document.getElementById('phone_academic')
//  if (phoneAcademic) {
//    window.itiAcademic = window.intlTelInput(phoneAcademic, {
//      initialCountry: "uz",
//      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
//    })
//  }
//
//  // Студент
//  const studentForm = document.getElementById('student-form')
//  if (studentForm) {
//    studentForm.addEventListener('submit', (e) => handleFormSubmit(e, 'students'))
//  }
//
//  // Обычный пользователь
//  const userForm = document.getElementById('user-form')
//  if (userForm) {
//    userForm.addEventListener('submit', (e) => handleFormSubmit(e, 'regular_persons'))
//  }
//
//  // Академический сотрудник
//  const academicForm = document.getElementById('academic-person-form')
//  if (academicForm) {
//    academicForm.addEventListener('submit', (e) => handleFormSubmit(e, 'academic_persons'))
//  }
//
//  // Предпросмотр фото (студент)
//  const photoStudent = document.getElementById('photo_student')
//  const previewStudent = document.getElementById('photo_preview_student')
//  if (photoStudent && previewStudent) {
//    photoStudent.addEventListener('change', () => {
//      const file = photoStudent.files[0]
//      if (file) {
//        const reader = new FileReader()
//        reader.onload = ev => {
//          previewStudent.src = ev.target.result
//          previewStudent.style.display = 'block'
//        }
//        reader.readAsDataURL(file)
//      } else {
//        previewStudent.src = ''
//        previewStudent.style.display = 'none'
//      }
//    })
//  }
//
//  // Предпросмотр фото (обычный пользователь)
//  const photoUser = document.getElementById('photo_user')
//  const previewUser = document.getElementById('photo_preview_user')
//  if (photoUser && previewUser) {
//    photoUser.addEventListener('change', () => {
//      const file = photoUser.files[0]
//      if (file) {
//        const reader = new FileReader()
//        reader.onload = ev => {
//          previewUser.src = ev.target.result
//          previewUser.style.display = 'block'
//        }
//        reader.readAsDataURL(file)
//      } else {
//        previewUser.src = ''
//        previewUser.style.display = 'none'
//      }
//    })
//  }
//
//  // Предпросмотр фото (академик)
//  const photoAcademic = document.getElementById('photo_academic')
//  const previewAcademic = document.getElementById('photo_preview_academic')
//  if (photoAcademic && previewAcademic) {
//    photoAcademic.addEventListener('change', () => {
//      const file = photoAcademic.files[0]
//      if (file) {
//        const reader = new FileReader()
//        reader.onload = ev => {
//          previewAcademic.src = ev.target.result
//          previewAcademic.style.display = 'block'
//        }
//        reader.readAsDataURL(file)
//      } else {
//        previewAcademic.src = ''
//        previewAcademic.style.display = 'none'
//      }
//    })
//  }
//
//  // При загрузке страницы проверяем, не заполняли ли мы форму ранее
//  checkSession()
//})
//
//
//
//













//
//
//
//function getCookie(name) {
//  let cookieValue = null;
//  if (document.cookie && document.cookie !== '') {
//    const cookies = document.cookie.split(';');
//    for (let cookie of cookies) {
//      cookie = cookie.trim();
//      if (cookie.substring(0, name.length + 1) === (name + '=')) {
//        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//        break;
//      }
//    }
//  }
//  return cookieValue;
//}
//
//function clearErrors(form) {
//  const errorSpans = form.querySelectorAll('.error-message');
//  errorSpans.forEach(span => {
//    span.textContent = '';
//  });
//  const inputs = form.querySelectorAll('input, select, textarea');
//  inputs.forEach(input => {
//    input.classList.remove('invalid');
//  });
//}
//
//function showError(element, message) {
//  element.classList.add('invalid');
//  const parent = element.closest('.input-group') || element.parentElement;
//  const errorSpan = parent.querySelector('.error-message');
//  if (errorSpan) {
//    errorSpan.textContent = message;
//  }
//}
//
//function fillStudentForm(data) {
//  const form = document.getElementById('student-form');
//  if (!form) return;
//  form.querySelector('#name1_student').value = data.name1;
//  form.querySelector('#name2_student').value = data.name2;
//  form.querySelector('#name3_student').value = data.name3 || '';
//  form.querySelector('#age_student').value = data.age;
//  form.querySelector('#telegram_student').value = data.telegram;
//  form.querySelector('#degree_student').value = data.degree;
//  form.querySelector('#faculty_student').value = data.faculty_id;
//  if (Array.isArray(data.sports_ids)) {
//    data.sports_ids.forEach(id => {
//      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`);
//      if (checkbox) checkbox.checked = true;
//    });
//  }
//  const phoneInput = form.querySelector('#phone_student');
//  if (phoneInput && data.phone) {
//    phoneInput.value = data.phone;
//    if (window.itiStudent) {
//      window.itiStudent.setNumber(data.phone);
//    }
//  }
//}
//
//function fillUserForm(data) {
//  const form = document.getElementById('user-form');
//  if (!form) return;
//  form.querySelector('#name1_user').value = data.name1;
//  form.querySelector('#name2_user').value = data.name2;
//  form.querySelector('#name3_user').value = data.name3 || '';
//  form.querySelector('#age_user').value = data.age;
//  form.querySelector('#telegram_user').value = data.telegram;
//  form.querySelector('#home_user').value = data.home;
//  if (Array.isArray(data.sports_ids)) {
//    data.sports_ids.forEach(id => {
//      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`);
//      if (checkbox) checkbox.checked = true;
//    });
//  }
//  const phoneInput = form.querySelector('#phone_user');
//  if (phoneInput && data.phone) {
//    phoneInput.value = data.phone;
//    if (window.itiUser) {
//      window.itiUser.setNumber(data.phone);
//    }
//  }
//}
//
//function fillAcademicForm(data) {
//  const form = document.getElementById('academic-person-form');
//  if (!form) return;
//  form.querySelector('#name1_academic').value = data.name1;
//  form.querySelector('#name2_academic').value = data.name2;
//  form.querySelector('#name3_academic').value = data.name3 || '';
//  form.querySelector('#age_academic').value = data.age;
//  form.querySelector('#telegram_academic').value = data.telegram;
//  form.querySelector('#job_academic').value = data.job;
//  form.querySelector('#position_academic').value = data.position;
//  if (Array.isArray(data.sports_ids)) {
//    data.sports_ids.forEach(id => {
//      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`);
//      if (checkbox) checkbox.checked = true;
//    });
//  }
//  const phoneInput = form.querySelector('#phone_academic');
//  if (phoneInput && data.phone) {
//    phoneInput.value = data.phone;
//    if (window.itiAcademic) {
//      window.itiAcademic.setNumber(data.phone);
//    }
//  }
//}
//
//async function handleFormSubmit(e, formType) {
//  e.preventDefault();
//  const form = e.target;
//  clearErrors(form);
//
//  const messageDiv = document.getElementById('message');
//  if (messageDiv) {
//    messageDiv.textContent = '';
//    messageDiv.style.color = '';
//  }
//
//  // Общие поля
//  const name1 = form.querySelector('[name="name1"]');
//  const name2 = form.querySelector('[name="name2"]');
//  const name3 = form.querySelector('[name="name3"]');
//  const age = form.querySelector('[name="age"]');
//  const sportsChecked = form.querySelectorAll('input[name="sports"]:checked');
//  const telegram = form.querySelector('[name="telegram"]');
//
//  // Для студентов
//  const degree = form.querySelector('[name="degree"]');
//  const faculty = form.querySelector('[name="faculty"]');
//
//  // Для обычных пользователей
//  const home = form.querySelector('[name="home"]');
//
//  // Для академиков
//  const job = form.querySelector('[name="job"]');
//  const position = form.querySelector('[name="position"]');
//
//  // Подготовка к проверке телефона
//  let phoneInput;
//  let itiInstance;
//  if (formType === 'students') {
//    phoneInput = form.querySelector('#phone_student');
//    itiInstance = window.itiStudent;
//  } else if (formType === 'regular_persons') {
//    phoneInput = form.querySelector('#phone_user');
//    itiInstance = window.itiUser;
//  } else if (formType === 'academic_persons') {
//    phoneInput = form.querySelector('#phone_academic');
//    itiInstance = window.itiAcademic;
//  }
//
//  // Валидация
//  if (!name1.value || name1.value.trim().length < 3) {
//    showError(name1, "Ism kamida 3 ta belgi.");
//    return;
//  }
//  if (!name2.value || name2.value.trim().length < 3) {
//    showError(name2, "Familya kamida 3 ta belgi.");
//    return;
//  }
//  if (name3 && name3.value.trim() && name3.value.trim().length < 3) {
//    showError(name3, "Otasining ismi kamida 3 ta belgi.");
//    return;
//  }
//  if (!age.value) {
//    showError(age, "Tug'ilgan sanani ko'rsating.");
//    return;
//  }
//  if (sportsChecked.length === 0) {
//    const sc = form.querySelector('#sports-container') ||
//               form.querySelector('#sports-container-user') ||
//               form.querySelector('#sports-container-academic');
//    showError(sc, "Hech bo'lmasa bitta sport tanlang.");
//    return;
//  }
//  if (!telegram.value.trim()) {
//    showError(telegram, "Telegram yozing (masalan, @username).");
//    return;
//  }
//
//  // Проверка телефона через intl-tel-input, если используется
//  let phoneValue = phoneInput.value.trim();
//  if (itiInstance) {
//    if (!itiInstance.isValidNumber()) {
//      showError(phoneInput, "Telefon raqami noto'g'ri yoki to'liq emas.");
//      return;
//    }
//    phoneValue = itiInstance.getNumber();
//  } else {
//    if (!phoneValue.startsWith("+998") || phoneValue.length < 13) {
//      showError(phoneInput, "Telefon raqami +998 ... formatida bo'lsin.");
//      return;
//    }
//  }
//
//  // Дополнительные проверки по типам форм
//  if (formType === 'students') {
//    if (!degree.value) {
//      showError(degree, "Darajani tanlang.");
//      return;
//    }
//    if (!faculty.value) {
//      showError(faculty, "Fakultetni tanlang.");
//      return;
//    }
//  } else if (formType === 'regular_persons') {
//    if (home && !home.value.trim()) {
//      showError(home, "Yashash manzilingizni kiriting.");
//      return;
//    }
//  } else if (formType === 'academic_persons') {
//    if (job && !job.value.trim()) {
//      showError(job, "Ish joyingizni kiriting.");
//      return;
//    }
//    if (position && !position.value.trim()) {
//      showError(position, "Lavozimingizni kiriting.");
//      return;
//    }
//  }
//
//  // Формирование данных для отправки
//  const formData = new FormData(form);
//  formData.set('phone', phoneValue);
//
//  try {
//    const response = await fetch(`/api/v1/${formType}/`, {
//      method: 'POST',
//      headers: { 'X-CSRFToken': getCookie('csrftoken') },
//      body: formData
//    });
//    const result = await response.json();
//    if (response.ok) {
//      if (result.session_id) {
//        if (formType === 'students') {
//          localStorage.setItem('student_session_id', result.session_id);
//        } else if (formType === 'regular_persons') {
//          localStorage.setItem('regular_person_session_id', result.session_id);
//        } else if (formType === 'academic_persons') {
//          localStorage.setItem('academic_person_session_id', result.session_id);
//        }
//      }
//      window.location.href = '/thank_you/';
//    } else {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545';
//        if (result.error) {
//          let errMsg = '';
//          for (const field in result.error) {
//            errMsg += `${field}: ${result.error[field].join(', ')}\n`;
//          }
//          messageDiv.textContent = errMsg || "Serverda xatolik.";
//        } else {
//          messageDiv.textContent = "Serverda xatolik yuz berdi.";
//        }
//      }
//    }
//  } catch (error) {
//    if (messageDiv) {
//      messageDiv.style.color = '#dc3545';
//      messageDiv.textContent = "Tarmoq xatosi, server mavjud emas.";
//    }
//  }
//}
//
//async function checkSession() {
//  const messageDiv = document.getElementById('message');
//  const studentForm = document.getElementById('student-form');
//  const userForm = document.getElementById('user-form');
//  const academicForm = document.getElementById('academic-person-form');
//
//  if (studentForm) {
//    const sid = localStorage.getItem('student_session_id');
//    if (!sid) {
//      if (messageDiv) {
//        messageDiv.textContent = "Iltimos, shaklni to'ldiring.";
//        messageDiv.style.color = '#6c757d';
//      }
//      return;
//    }
//    try {
//      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`);
//      const data = await resp.json();
//      if (resp.ok && data.students && data.students.length > 0) {
//        if (messageDiv) {
//          messageDiv.textContent = `Xush kelibsiz, ${data.students[0].name1}!`;
//          messageDiv.style.color = '#28a745';
//        }
//        fillStudentForm(data.students[0]);
//      }
//    } catch (err) {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545';
//        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi.";
//      }
//    }
//    return;
//  }
//
//  if (userForm) {
//    const sid = localStorage.getItem('regular_person_session_id');
//    if (!sid) {
//      if (messageDiv) {
//        messageDiv.textContent = "Iltimos, shaklni to'ldiring.";
//        messageDiv.style.color = '#6c757d';
//      }
//      return;
//    }
//    try {
//      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`);
//      const data = await resp.json();
//      if (resp.ok && data.regular_persons && data.regular_persons.length > 0) {
//        if (messageDiv) {
//          messageDiv.textContent = `Xush kelibsiz, ${data.regular_persons[0].name1}!`;
//          messageDiv.style.color = '#28a745';
//        }
//        fillUserForm(data.regular_persons[0]);
//      }
//    } catch (err) {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545';
//        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi.";
//      }
//    }
//    return;
//  }
//
//  if (academicForm) {
//    const sid = localStorage.getItem('academic_person_session_id');
//    if (!sid) {
//      if (messageDiv) {
//        messageDiv.textContent = "Iltimos, shaklni to'ldiring.";
//        messageDiv.style.color = '#6c757d';
//      }
//      return;
//    }
//    try {
//      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`);
//      const data = await resp.json();
//      if (resp.ok && data.academic_persons && data.academic_persons.length > 0) {
//        if (messageDiv) {
//          messageDiv.textContent = `Xush kelibsiz, ${data.academic_persons[0].name1}!`;
//          messageDiv.style.color = '#28a745';
//        }
//        fillAcademicForm(data.academic_persons[0]);
//      }
//    } catch (err) {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545';
//        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi.";
//      }
//    }
//    return;
//  }
//}
//
//document.addEventListener('DOMContentLoaded', () => {
//  // Инициализация intl-tel-input для студента
//  const phoneStudent = document.getElementById('phone_student');
//  if (phoneStudent) {
//    window.itiStudent = window.intlTelInput(phoneStudent, {
//      initialCountry: "uz",
//      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
//    });
//  }
//
//  // Инициализация intl-tel-input для обычного пользователя
//  const phoneUser = document.getElementById('phone_user');
//  if (phoneUser) {
//    window.itiUser = window.intlTelInput(phoneUser, {
//      initialCountry: "uz",
//      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
//    });
//  }
//
//  // Инициализация intl-tel-input для академика
//  const phoneAcademic = document.getElementById('phone_academic');
//  if (phoneAcademic) {
//    window.itiAcademic = window.intlTelInput(phoneAcademic, {
//      initialCountry: "uz",
//      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
//    });
//  }
//
//  // Предпросмотр фото (студент)
//  const photoStudent = document.getElementById('photo_student');
//  const previewStudent = document.getElementById('photo_preview_student');
//  if (photoStudent && previewStudent) {
//    photoStudent.addEventListener('change', () => {
//      const file = photoStudent.files[0];
//      if (file) {
//        const reader = new FileReader();
//        reader.onload = ev => {
//          previewStudent.src = ev.target.result;
//          previewStudent.style.display = 'block';
//        };
//        reader.readAsDataURL(file);
//      } else {
//        previewStudent.src = '';
//        previewStudent.style.display = 'none';
//      }
//    });
//  }
//
//  // Предпросмотр фото (обычный пользователь)
//  const photoUser = document.getElementById('photo_user');
//  const previewUser = document.getElementById('photo_preview_user');
//  if (photoUser && previewUser) {
//    photoUser.addEventListener('change', () => {
//      const file = photoUser.files[0];
//      if (file) {
//        const reader = new FileReader();
//        reader.onload = ev => {
//          previewUser.src = ev.target.result;
//          previewUser.style.display = 'block';
//        };
//        reader.readAsDataURL(file);
//      } else {
//        previewUser.src = '';
//        previewUser.style.display = 'none';
//      }
//    });
//  }
//
//  // Предпросмотр фото (академик)
//  const photoAcademic = document.getElementById('photo_academic');
//  const previewAcademic = document.getElementById('photo_preview_academic');
//  if (photoAcademic && previewAcademic) {
//    photoAcademic.addEventListener('change', () => {
//      const file = photoAcademic.files[0];
//      if (file) {
//        const reader = new FileReader();
//        reader.onload = ev => {
//          previewAcademic.src = ev.target.result;
//          previewAcademic.style.display = 'block';
//        };
//        reader.readAsDataURL(file);
//      } else {
//        previewAcademic.src = '';
//        previewAcademic.style.display = 'none';
//      }
//    });
//  }
//
//  // Назначаем обработчики на формы
//  const studentForm = document.getElementById('student-form');
//  if (studentForm) {
//    studentForm.addEventListener('submit', (e) => handleFormSubmit(e, 'students'));
//  }
//
//  const userForm = document.getElementById('user-form');
//  if (userForm) {
//    userForm.addEventListener('submit', (e) => handleFormSubmit(e, 'regular_persons'));
//  }
//
//  const academicForm = document.getElementById('academic-person-form');
//  if (academicForm) {
//    academicForm.addEventListener('submit', (e) => handleFormSubmit(e, 'academic_persons'));
//  }
//
//  // Проверка сессии при загрузке страницы
//  checkSession();
//});
//
//












//
//// Получение CSRF-токена из cookie
//function getCookie(name) {
//  let cookieValue = null;
//  if (document.cookie && document.cookie !== '') {
//    const cookies = document.cookie.split(';');
//    for (let cookie of cookies) {
//      cookie = cookie.trim();
//      if (cookie.substring(0, name.length + 1) === (name + '=')) {
//        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//        break;
//      }
//    }
//  }
//  return cookieValue;
//}
//
//// Очистка сообщений об ошибках
//function clearErrors(form) {
//  const errorSpans = form.querySelectorAll('.error-message');
//  errorSpans.forEach(span => {
//    span.textContent = '';
//  });
//  const inputs = form.querySelectorAll('input, select, textarea');
//  inputs.forEach(input => {
//    input.classList.remove('invalid');
//  });
//}
//
//// Отображение ошибки для конкретного элемента
//function showError(element, message) {
//  element.classList.add('invalid');
//  const parent = element.closest('.input-group') || element.parentElement;
//  const errorSpan = parent.querySelector('.error-message');
//  if (errorSpan) {
//    errorSpan.textContent = message;
//  }
//}
//
//// Функция заполнения формы для студента
//function fillStudentForm(data) {
//  const form = document.getElementById('student-form');
//  if (!form) return;
//  form.querySelector('#name1_student').value = data.name1;
//  form.querySelector('#name2_student').value = data.name2;
//  form.querySelector('#name3_student').value = data.name3 || '';
//  form.querySelector('#age_student').value = data.age;
//  form.querySelector('#telegram_student').value = data.telegram;
//  form.querySelector('#degree_student').value = data.degree;
//  form.querySelector('#faculty_student').value = data.faculty_id;
//  if (Array.isArray(data.sports_ids)) {
//    data.sports_ids.forEach(id => {
//      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`);
//      if (checkbox) checkbox.checked = true;
//    });
//  }
//  const phoneInput = form.querySelector('#phone_student');
//  if (phoneInput && data.phone) {
//    phoneInput.value = data.phone;
//    if (window.itiStudent) {
//      window.itiStudent.setNumber(data.phone);
//    }
//  }
//}
//
//// Функция заполнения формы для обычного пользователя
//function fillUserForm(data) {
//  const form = document.getElementById('user-form');
//  if (!form) return;
//  form.querySelector('#name1_user').value = data.name1;
//  form.querySelector('#name2_user').value = data.name2;
//  form.querySelector('#name3_user').value = data.name3 || '';
//  form.querySelector('#age_user').value = data.age;
//  form.querySelector('#telegram_user').value = data.telegram;
//  form.querySelector('#home_user').value = data.home;
//  if (Array.isArray(data.sports_ids)) {
//    data.sports_ids.forEach(id => {
//      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`);
//      if (checkbox) checkbox.checked = true;
//    });
//  }
//  const phoneInput = form.querySelector('#phone_user');
//  if (phoneInput && data.phone) {
//    phoneInput.value = data.phone;
//    if (window.itiUser) {
//      window.itiUser.setNumber(data.phone);
//    }
//  }
//}
//
//// Функция заполнения формы для академика
//function fillAcademicForm(data) {
//  const form = document.getElementById('academic-person-form');
//  if (!form) return;
//  form.querySelector('#name1_academic').value = data.name1;
//  form.querySelector('#name2_academic').value = data.name2;
//  form.querySelector('#name3_academic').value = data.name3 || '';
//  form.querySelector('#age_academic').value = data.age;
//  form.querySelector('#telegram_academic').value = data.telegram;
//  form.querySelector('#job_academic').value = data.job;
//  form.querySelector('#position_academic').value = data.position;
//  if (Array.isArray(data.sports_ids)) {
//    data.sports_ids.forEach(id => {
//      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`);
//      if (checkbox) checkbox.checked = true;
//    });
//  }
//  const phoneInput = form.querySelector('#phone_academic');
//  if (phoneInput && data.phone) {
//    phoneInput.value = data.phone;
//    if (window.itiAcademic) {
//      window.itiAcademic.setNumber(data.phone);
//    }
//  }
//}
//
//// Обработка отправки формы с учётом типа формы
//async function handleFormSubmit(e, formType) {
//  e.preventDefault();
//  const form = e.target;
//  clearErrors(form);
//
//  const messageDiv = document.getElementById('message');
//  if (messageDiv) {
//    messageDiv.textContent = '';
//    messageDiv.style.color = '';
//  }
//
//  // Общие поля
//  const name1 = form.querySelector('[name="name1"]');
//  const name2 = form.querySelector('[name="name2"]');
//  const name3 = form.querySelector('[name="name3"]');
//  const age = form.querySelector('[name="age"]');
//  const sportsChecked = form.querySelectorAll('input[name="sports"]:checked');
//  const telegram = form.querySelector('[name="telegram"]');
//
//  // Для студентов
//  const degree = form.querySelector('[name="degree"]');
//  const faculty = form.querySelector('[name="faculty"]');
//
//  // Для обычных пользователей
//  const home = form.querySelector('[name="home"]');
//
//  // Для академиков
//  const job = form.querySelector('[name="job"]');
//  const position = form.querySelector('[name="position"]');
//
//  // Подготовка проверки телефона
//  let phoneInput;
//  let itiInstance;
//  if (formType === 'students') {
//    phoneInput = form.querySelector('#phone_student');
//    itiInstance = window.itiStudent;
//  } else if (formType === 'regular_persons') {
//    phoneInput = form.querySelector('#phone_user');
//    itiInstance = window.itiUser;
//  } else if (formType === 'academic_persons') {
//    phoneInput = form.querySelector('#phone_academic');
//    itiInstance = window.itiAcademic;
//  }
//
//  // Валидация
//  if (!name1.value || name1.value.trim().length < 3) {
//    showError(name1, "Ism kamida 3 ta belgi.");
//    return;
//  }
//  if (!name2.value || name2.value.trim().length < 3) {
//    showError(name2, "Familya kamida 3 ta belgi.");
//    return;
//  }
//  if (name3 && name3.value.trim() && name3.value.trim().length < 3) {
//    showError(name3, "Otasining ismi kamida 3 ta belgi.");
//    return;
//  }
//  if (!age.value) {
//    showError(age, "Tug'ilgan sanani ko'rsating.");
//    return;
//  }
//  if (sportsChecked.length === 0) {
//    const sc = form.querySelector('#sports-container') ||
//               form.querySelector('#sports-container-user') ||
//               form.querySelector('#sports-container-academic');
//    showError(sc, "Hech bo'lmasa bitta sport tanlang.");
//    return;
//  }
//  if (!telegram.value.trim()) {
//    showError(telegram, "Telegram yozing (masalan, @username).");
//    return;
//  }
//
//  // Проверка телефона через intl-tel-input (если используется)
//  let phoneValue = phoneInput.value.trim();
//  if (itiInstance) {
//    if (!itiInstance.isValidNumber()) {
//      showError(phoneInput, "Telefon raqami noto'g'ri yoki to'liq emas.");
//      return;
//    }
//    phoneValue = itiInstance.getNumber();
//  } else {
//    if (!phoneValue.startsWith("+998") || phoneValue.length < 13) {
//      showError(phoneInput, "Telefon raqami +998 ... formatida bo'lsin.");
//      return;
//    }
//  }
//
//  // Дополнительная проверка по типу формы
//  if (formType === 'students') {
//    if (!degree.value) {
//      showError(degree, "Darajani tanlang.");
//      return;
//    }
//    if (!faculty.value) {
//      showError(faculty, "Fakultetni tanlang.");
//      return;
//    }
//  } else if (formType === 'regular_persons') {
//    if (home && !home.value.trim()) {
//      showError(home, "Yashash manzilingizni kiriting.");
//      return;
//    }
//  } else if (formType === 'academic_persons') {
//    if (job && !job.value.trim()) {
//      showError(job, "Ish joyingizni kiriting.");
//      return;
//    }
//    if (position && !position.value.trim()) {
//      showError(position, "Lavozimingizni kiriting.");
//      return;
//    }
//  }
//
//  // Формирование данных для отправки
//  const formData = new FormData(form);
//  formData.set('phone', phoneValue);
//
//  try {
//    const response = await fetch(`/api/v1/${formType}/`, {
//      method: 'POST',
//      headers: { 'X-CSRFToken': getCookie('csrftoken') },
//      body: formData
//    });
//    const result = await response.json();
//    if (response.ok) {
//      if (result.session_id) {
//        if (formType === 'students') {
//          localStorage.setItem('student_session_id', result.session_id);
//        } else if (formType === 'regular_persons') {
//          localStorage.setItem('regular_person_session_id', result.session_id);
//        } else if (formType === 'academic_persons') {
//          localStorage.setItem('academic_person_session_id', result.session_id);
//        }
//      }
//      // Сохраняем тип последней изменённой формы
//      localStorage.setItem('lastFormType', formType);
//      window.location.href = '/thank_you/';
//    } else {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545';
//        if (result.error) {
//          let errMsg = '';
//          for (const field in result.error) {
//            errMsg += `${field}: ${result.error[field].join(', ')}\n`;
//          }
//          messageDiv.textContent = errMsg || "Serverda xatolik.";
//        } else {
//          messageDiv.textContent = "Serverda xatolik yuz berdi.";
//        }
//      }
//    }
//  } catch (error) {
//    if (messageDiv) {
//      messageDiv.style.color = '#dc3545';
//      messageDiv.textContent = "Tarmoq xatosi, server mavjud emas.";
//    }
//  }
//}
//
//// Проверка сессии и заполнение формы в зависимости от последнего изменённого типа
//async function checkSession() {
//  const messageDiv = document.getElementById('message');
//  const lastFormType = localStorage.getItem('lastFormType');
//
//  if (lastFormType === 'academic_persons') {
//    const academicForm = document.getElementById('academic-person-form');
//    if (!academicForm) return;
//    const sid = localStorage.getItem('academic_person_session_id');
//    if (!sid) {
//      if (messageDiv) {
//        messageDiv.textContent = "Iltimos, shaklni to'ldiring.";
//        messageDiv.style.color = '#6c757d';
//      }
//      return;
//    }
//    try {
//      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`);
//      const data = await resp.json();
//      if (resp.ok && data.academic_persons && data.academic_persons.length > 0) {
//        if (messageDiv) {
//          messageDiv.textContent = `Xush kelibsiz, ${data.academic_persons[0].name1}!`;
//          messageDiv.style.color = '#28a745';
//        }
//        fillAcademicForm(data.academic_persons[0]);
//      }
//    } catch (err) {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545';
//        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi.";
//      }
//    }
//    return;
//  }
//
//  if (lastFormType === 'students') {
//    const studentForm = document.getElementById('student-form');
//    if (!studentForm) return;
//    const sid = localStorage.getItem('student_session_id');
//    if (!sid) {
//      if (messageDiv) {
//        messageDiv.textContent = "Iltimos, shaklni to'ldiring.";
//        messageDiv.style.color = '#6c757d';
//      }
//      return;
//    }
//    try {
//      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`);
//      const data = await resp.json();
//      if (resp.ok && data.students && data.students.length > 0) {
//        if (messageDiv) {
//          messageDiv.textContent = `Xush kelibsiz, ${data.students[0].name1}!`;
//          messageDiv.style.color = '#28a745';
//        }
//        fillStudentForm(data.students[0]);
//      }
//    } catch (err) {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545';
//        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi.";
//      }
//    }
//    return;
//  }
//
//  if (lastFormType === 'regular_persons') {
//    const userForm = document.getElementById('user-form');
//    if (!userForm) return;
//    const sid = localStorage.getItem('regular_person_session_id');
//    if (!sid) {
//      if (messageDiv) {
//        messageDiv.textContent = "Iltimos, shaklni to'ldiring.";
//        messageDiv.style.color = '#6c757d';
//      }
//      return;
//    }
//    try {
//      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`);
//      const data = await resp.json();
//      if (resp.ok && data.regular_persons && data.regular_persons.length > 0) {
//        if (messageDiv) {
//          messageDiv.textContent = `Xush kelibsiz, ${data.regular_persons[0].name1}!`;
//          messageDiv.style.color = '#28a745';
//        }
//        fillUserForm(data.regular_persons[0]);
//      }
//    } catch (err) {
//      if (messageDiv) {
//        messageDiv.style.color = '#dc3545';
//        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi.";
//      }
//    }
//    return;
//  }
//}
//
//// Инициализация после загрузки DOM
//document.addEventListener('DOMContentLoaded', () => {
//  // Инициализация intl-tel-input для студента
//  const phoneStudent = document.getElementById('phone_student');
//  if (phoneStudent) {
//    window.itiStudent = window.intlTelInput(phoneStudent, {
//      initialCountry: "uz",
//      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
//    });
//  }
//
//  // Инициализация intl-tel-input для обычного пользователя
//  const phoneUser = document.getElementById('phone_user');
//  if (phoneUser) {
//    window.itiUser = window.intlTelInput(phoneUser, {
//      initialCountry: "uz",
//      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
//    });
//  }
//
//  // Инициализация intl-tel-input для академика
//  const phoneAcademic = document.getElementById('phone_academic');
//  if (phoneAcademic) {
//    window.itiAcademic = window.intlTelInput(phoneAcademic, {
//      initialCountry: "uz",
//      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
//    });
//  }
//
//  // Предпросмотр фото (студент)
//  const photoStudent = document.getElementById('photo_student');
//  const previewStudent = document.getElementById('photo_preview_student');
//  if (photoStudent && previewStudent) {
//    photoStudent.addEventListener('change', () => {
//      const file = photoStudent.files[0];
//      if (file) {
//        const reader = new FileReader();
//        reader.onload = ev => {
//          previewStudent.src = ev.target.result;
//          previewStudent.style.display = 'block';
//        };
//        reader.readAsDataURL(file);
//      } else {
//        previewStudent.src = '';
//        previewStudent.style.display = 'none';
//      }
//    });
//  }
//
//  // Предпросмотр фото (обычный пользователь)
//  const photoUser = document.getElementById('photo_user');
//  const previewUser = document.getElementById('photo_preview_user');
//  if (photoUser && previewUser) {
//    photoUser.addEventListener('change', () => {
//      const file = photoUser.files[0];
//      if (file) {
//        const reader = new FileReader();
//        reader.onload = ev => {
//          previewUser.src = ev.target.result;
//          previewUser.style.display = 'block';
//        };
//        reader.readAsDataURL(file);
//      } else {
//        previewUser.src = '';
//        previewUser.style.display = 'none';
//      }
//    });
//  }
//
//  // Предпросмотр фото (академик)
//  const photoAcademic = document.getElementById('photo_academic');
//  const previewAcademic = document.getElementById('photo_preview_academic');
//  if (photoAcademic && previewAcademic) {
//    photoAcademic.addEventListener('change', () => {
//      const file = photoAcademic.files[0];
//      if (file) {
//        const reader = new FileReader();
//        reader.onload = ev => {
//          previewAcademic.src = ev.target.result;
//          previewAcademic.style.display = 'block';
//        };
//        reader.readAsDataURL(file);
//      } else {
//        previewAcademic.src = '';
//        previewAcademic.style.display = 'none';
//      }
//    });
//  }
//
//  // Назначаем обработчики для форм
//  const studentForm = document.getElementById('student-form');
//  if (studentForm) {
//    studentForm.addEventListener('submit', (e) => handleFormSubmit(e, 'students'));
//  }
//  const userForm = document.getElementById('user-form');
//  if (userForm) {
//    userForm.addEventListener('submit', (e) => handleFormSubmit(e, 'regular_persons'));
//  }
//  const academicForm = document.getElementById('academic-person-form');
//  if (academicForm) {
//    academicForm.addEventListener('submit', (e) => handleFormSubmit(e, 'academic_persons'));
//  }
//
//  // Проверка сессии при загрузке страницы
//  checkSession();
//});


