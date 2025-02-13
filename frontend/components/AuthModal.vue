<script lang="ts" setup>
import { useModalStore } from '@/stores/modal'
import { ref } from 'vue'

const modalStore = useModalStore()

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLogin = ref(true) // Переключатель между авторизацией и регистрацией

const closeModal = () => {
  modalStore.closeAuthModal()
}

// Логика для авторизации
const handleLoginSubmit = async (e: Event) => {
  e.preventDefault()

  if (!email.value || !password.value) {
    errorMessage.value = 'Пожалуйста, заполните все поля'
    return
  }

  try {
    const response = await fetch('https://test.top-nnov.ru/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const result = await response.json()

    if (result.success) {
      successMessage.value = 'Вход выполнен успешно'
      email.value = ''
      password.value = ''
      errorMessage.value = ''
      modalStore.closeAuthModal()
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = 'Произошла ошибка при авторизации'
  }
}

// Логика для регистрации
const handleRegisterSubmit = async (e: Event) => {
  e.preventDefault()

  // Простая валидация
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }

  if (!email.value || !username.value || !password.value) {
    errorMessage.value = 'Пожалуйста, заполните все поля'
    return
  }

  // Выполняем запрос на регистрацию
  try {
    const response = await fetch('https://test.top-nnov.ru/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        username: username.value,
        password: password.value,
      }),
    })

    const result = await response.json()

    if (result.success) {
      successMessage.value = 'Регистрация прошла успешно. Пожалуйста, подтвердите свой email.'
      email.value = ''
      username.value = ''
      password.value = ''
      confirmPassword.value = ''
      errorMessage.value = ''
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = 'Произошла ошибка при регистрации'
  }
}

// Переключение между авторизацией и регистрацией
const switchToRegister = () => {
  isLogin.value = false
  errorMessage.value = ''
  successMessage.value = ''
}

const switchToLogin = () => {
  isLogin.value = true
  errorMessage.value = ''
  successMessage.value = ''
}
</script>

<template>
  <div v-if="modalStore.isAuthModalOpen" class="modal">
    <div class="modal__overlay" @click="closeModal"></div>
    <div class="modal__content">
      <NuxtImg src="../public/images/logo.svg" alt="logo" width="260" />
      <button class="modal__close" @click="closeModal">&times;</button>

      <h2>{{ isLogin ? 'Личный кабинет' : 'Регистрация' }}</h2>

      <form @submit="isLogin ? handleLoginSubmit : handleRegisterSubmit">
        <input v-if="!isLogin" type="text" v-model="username" placeholder="Логин" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Пароль" required />
        <input v-if="!isLogin" type="password" v-model="confirmPassword" placeholder="Подтвердите пароль" required />

        <button type="submit">{{ isLogin ? 'Войти' : 'Зарегистрироваться' }}</button>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      </form>

      <div class="modal__actions">
        <button v-if="isLogin" @click="switchToRegister">Ещё нет аккаунта? Зарегистрироваться</button>
        <button v-if="isLogin">Забыли пароль?</button>
        <label v-if="isLogin">
          <input type="checkbox" />
          Создавая аккаунт, принимаю условия <a href="#">политики конфиденциальности</a> и <a href="#">пользовательского
            соглашения</a>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal__overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}

form {
  margin-top: 20px;
}

.modal__content {
  @include flex(column, flex-start, center);
  background: $color-white;
  padding: 40px 20px;
  position: relative;
  max-width: 600px;

  h2 {
    font-size: 42px;
    margin-top: 72px;
  }


  .error-message {
    color: red;
    margin-top: 10px;
  }

  .success-message {
    color: green;
    margin-top: 10px;
  }

  .modal__actions {
    margin-top: 20px;
    text-align: center;
  }

  .modal__actions button {
    background: none;
    color: #4caf50;
    border: none;
    cursor: pointer;
    text-decoration: underline;
  }

  label {
    margin-top: 10px;
    font-size: 14px;
  }
}

.modal__close {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
}
</style>
