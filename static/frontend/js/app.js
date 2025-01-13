function getCookie(name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

function clearErrors(form) {
  const errorSpans = form.querySelectorAll('.error-message')
  errorSpans.forEach(span => {
    span.textContent = ''
  })
  const inputs = form.querySelectorAll('input, select, textarea')
  inputs.forEach(input => {
    input.classList.remove('invalid')
  })
}

function showError(element, message) {
  element.classList.add('invalid')
  const parent = element.closest('.input-group') || element.parentElement
  const errorSpan = parent.querySelector('.error-message')
  if (errorSpan) {
    errorSpan.textContent = message
  }
}

function fillStudentForm(data) {
  const form = document.getElementById('student-form')
  if (!form) return
  form.querySelector('#name1_student').value = data.name1
  form.querySelector('#name2_student').value = data.name2
  form.querySelector('#name3_student').value = data.name3 || ''
  form.querySelector('#age_student').value = data.age
  form.querySelector('#telegram_student').value = data.telegram
  form.querySelector('#degree_student').value = data.degree
  form.querySelector('#faculty_student').value = data.faculty_id
  if (Array.isArray(data.sports_ids)) {
    data.sports_ids.forEach(id => {
      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`)
      if (checkbox) checkbox.checked = true
    })
  }
  const phoneInput = form.querySelector('#phone_student')
  if (phoneInput && data.phone) {
    phoneInput.value = data.phone
    if (window.itiStudent) {
      window.itiStudent.setNumber(data.phone)
    }
  }
}

function fillUserForm(data) {
  const form = document.getElementById('user-form')
  if (!form) return
  form.querySelector('#name1_user').value = data.name1
  form.querySelector('#name2_user').value = data.name2
  form.querySelector('#name3_user').value = data.name3 || ''
  form.querySelector('#age_user').value = data.age
  form.querySelector('#telegram_user').value = data.telegram
  form.querySelector('#home_user').value = data.home
  if (Array.isArray(data.sports_ids)) {
    data.sports_ids.forEach(id => {
      const checkbox = form.querySelector(`input[name="sports"][value="${id}"]`)
      if (checkbox) checkbox.checked = true
    })
  }
  const phoneInput = form.querySelector('#phone_user')
  if (phoneInput && data.phone) {
    phoneInput.value = data.phone
    if (window.itiUser) {
      window.itiUser.setNumber(data.phone)
    }
  }
}

async function handleFormSubmit(e, formType) {
  e.preventDefault()
  const form = e.target
  clearErrors(form)

  const messageDiv = document.getElementById('message')
  if (messageDiv) {
    messageDiv.textContent = ''
    messageDiv.style.color = ''
  }

  const name1 = form.querySelector('[name="name1"]')
  const name2 = form.querySelector('[name="name2"]')
  const name3 = form.querySelector('[name="name3"]')
  const age = form.querySelector('[name="age"]')
  const sportsChecked = form.querySelectorAll('input[name="sports"]:checked')
  const telegram = form.querySelector('[name="telegram"]')
  const degree = form.querySelector('[name="degree"]')
  const faculty = form.querySelector('[name="faculty"]')
  const home = form.querySelector('[name="home"]')

  // Получаем ссылку на поле телефона
  let phoneInput
  let itiInstance
  if (formType === 'students') {
    phoneInput = form.querySelector('#phone_student')
    itiInstance = window.itiStudent
  } else {
    phoneInput = form.querySelector('#phone_user')
    itiInstance = window.itiUser
  }

  // Локальные проверки
  if (!name1.value || name1.value.trim().length < 3) {
    showError(name1, "Ism kamida 3 ta belgi.")
    return
  }
  if (!name2.value || name2.value.trim().length < 3) {
    showError(name2, "Familya kamida 3 ta belgi.")
    return
  }
  if (name3 && name3.value.trim() && name3.value.trim().length < 3) {
    showError(name3, "Otasining ismi kamida 3 ta belgi.")
    return
  }
  if (!age.value) {
    showError(age, "Tug'ilgan sanani ko'rsating.")
    return
  }
  if (sportsChecked.length === 0) {
    const sc = form.querySelector('#sports-container') || form.querySelector('#sports-container-user')
    showError(sc, "Hech bo'lmasa bitta sport tanlang.")
    return
  }
  if (!telegram.value.trim()) {
    showError(telegram, "Telegram yozing (masalan, @username).")
    return
  }

  // Проверка intl-tel-input (если включено)
  let phoneValue = phoneInput.value.trim()
  if (itiInstance) {
    if (!itiInstance.isValidNumber()) {
      showError(phoneInput, "Telefon raqami noto'g'ri yoki to'liq emas.")
      return
    }
    // Берём номер в полном формате +XXX ...
    phoneValue = itiInstance.getNumber()
  } else {
    if (!phoneValue.startsWith("+998") || phoneValue.length < 13) {
      showError(phoneInput, "Telefon raqami +998 ... formatida bo'lsin.")
      return
    }
  }

  if (formType === 'students') {
    if (!degree.value) {
      showError(degree, "Darajani tanlang.")
      return
    }
    if (!faculty.value) {
      showError(faculty, "Fakultetni tanlang.")
      return
    }
  } else if (formType === 'regular_persons') {
    if (home && !home.value.trim()) {
      showError(home, "Yashash manzilingizni kiriting.")
      return
    }
  }

  // Формируем данные
  const formData = new FormData(form)
  formData.set('phone', phoneValue) // Заменим phone на форматированный

  try {
    const response = await fetch(`/api/v1/${formType}/`, {
      method: 'POST',
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      body: formData
    })
    const result = await response.json()
    if (response.ok) {
      if (result.session_id) {
        if (formType === 'students') {
          localStorage.setItem('student_session_id', result.session_id)
        } else if (formType === 'regular_persons') {
          localStorage.setItem('regular_person_session_id', result.session_id)
        }
      }
      window.location.href = '/thank_you/'
    } else {
      if (messageDiv) {
        messageDiv.style.color = '#dc3545'
        if (result.error) {
          let errMsg = ''
          for (const field in result.error) {
            errMsg += `${field}: ${result.error[field].join(', ')}\n`
          }
          messageDiv.textContent = errMsg || "Serverda xatolik."
        } else {
          messageDiv.textContent = "Serverda xatolik yuz berdi."
        }
      }
    }
  } catch (error) {
    if (messageDiv) {
      messageDiv.style.color = '#dc3545'
      messageDiv.textContent = "Tarmoq xatosi, server mavjud emas."
    }
  }
}

async function checkSession() {
  const messageDiv = document.getElementById('message')
  const studentForm = document.getElementById('student-form')
  const userForm = document.getElementById('user-form')

  if (studentForm) {
    const sid = localStorage.getItem('student_session_id')
    if (!sid) {
      if (messageDiv) {
        messageDiv.textContent = "Iltimos, shaklni to'ldiring."
        messageDiv.style.color = '#6c757d'
      }
      return
    }
    try {
      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`)
      const data = await resp.json()
      if (resp.ok && data.students && data.students.length > 0) {
        if (messageDiv) {
          messageDiv.textContent = `Xush kelibsiz, ${data.students[0].name1}!`
          messageDiv.style.color = '#28a745'
        }
        fillStudentForm(data.students[0])
      }
    } catch (err) {
      if (messageDiv) {
        messageDiv.style.color = '#dc3545'
        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi."
      }
    }
  } else if (userForm) {
    const sid = localStorage.getItem('regular_person_session_id')
    if (!sid) {
      if (messageDiv) {
        messageDiv.textContent = "Iltimos, shaklni to'ldiring."
        messageDiv.style.color = '#6c757d'
      }
      return
    }
    try {
      const resp = await fetch(`/api/v1/session-info/?session_id=${sid}`)
      const data = await resp.json()
      if (resp.ok && data.regular_persons && data.regular_persons.length > 0) {
        if (messageDiv) {
          messageDiv.textContent = `Xush kelibsiz, ${data.regular_persons[0].name1}!`
          messageDiv.style.color = '#28a745'
        }
        fillUserForm(data.regular_persons[0])
      }
    } catch (err) {
      if (messageDiv) {
        messageDiv.style.color = '#dc3545'
        messageDiv.textContent = "Sessiyani tekshirishda xatolik yuz berdi."
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Инициализация intl-tel-input для студента
  const phoneStudent = document.getElementById('phone_student')
  if (phoneStudent) {
    window.itiStudent = window.intlTelInput(phoneStudent, {
      initialCountry: "uz",
      // Если хотите авто-геолокацию:
      // geoIpLookup: (success, failure) => {...},
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
    })
  }

  // Инициализация intl-tel-input для обычного пользователя
  const phoneUser = document.getElementById('phone_user')
  if (phoneUser) {
    window.itiUser = window.intlTelInput(phoneUser, {
      initialCountry: "uz",
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
    })
  }

  const studentForm = document.getElementById('student-form')
  if (studentForm) {
    studentForm.addEventListener('submit', (e) => handleFormSubmit(e, 'students'))
  }

  const userForm = document.getElementById('user-form')
  if (userForm) {
    userForm.addEventListener('submit', (e) => handleFormSubmit(e, 'regular_persons'))
  }

  // Предпросмотр фото (студент)
  const photoStudent = document.getElementById('photo_student')
  const previewStudent = document.getElementById('photo_preview_student')
  if (photoStudent && previewStudent) {
    photoStudent.addEventListener('change', () => {
      const file = photoStudent.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = ev => {
          previewStudent.src = ev.target.result
          previewStudent.style.display = 'block'
        }
        reader.readAsDataURL(file)
      } else {
        previewStudent.src = ''
        previewStudent.style.display = 'none'
      }
    })
  }

  // Предпросмотр фото (обычный пользователь)
  const photoUser = document.getElementById('photo_user')
  const previewUser = document.getElementById('photo_preview_user')
  if (photoUser && previewUser) {
    photoUser.addEventListener('change', () => {
      const file = photoUser.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = ev => {
          previewUser.src = ev.target.result
          previewUser.style.display = 'block'
        }
        reader.readAsDataURL(file)
      } else {
        previewUser.src = ''
        previewUser.style.display = 'none'
      }
    })
  }

  checkSession()
})
