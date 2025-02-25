<script setup lang="ts">
import { NuxtImg } from '#components'
import { useModalStore } from '@/stores/useModalStore'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const modalStore = useModalStore()
const authStore = useAuthStore()

const authStep = ref<'login' | 'register' | 'confirm'>('login')
const changeStep = (step: 'login' | 'register' | 'confirm') => {
  authStep.value = step
  authStore.error = null
}
const email = ref('')
const password = ref('')
const fio = ref('')
const phone = ref('')
const confirmPassword = ref('')
const confirmationCode = ref('')

const login = async () => {
  try {
    await authStore.login(email.value, password.value)
    modalStore.close() // Закрываем модалку после успешного входа
  } catch (error) {
    toast.error('Ошибка входа', { autoClose: 3000 })
  }
}

const register = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error('Пароли не совпадают', { autoClose: 3000 })
    return
  }
  try {
    await authStore.register(fio.value, phone.value, email.value, password.value)
    authStep.value = 'confirm'
  } catch (error) {
    toast.error('Ошибка регистрации', { autoClose: 3000 })
  }
}

const confirmRegistration = async () => {
  try {
    await authStore.confirmEmail(confirmationCode.value, email.value) // Передаем email
    modalStore.close() // Закрываем модалку после успешного подтверждения
  } catch (error) {
    toast.error('Ошибка подтверждения email', { autoClose: 3000 })
  }
}
</script>

<template>
  <div v-if="modalStore.isOpen" class="modal">
    <div class="modal__content">
      <NuxtLink to="/">
        <NuxtImg src="/images/logo.svg" alt="logo" width="260" />
      </NuxtLink>
      <h2>
        {{
          authStep === 'login'
            ? 'Вход'
            : authStep === 'register'
              ? 'Регистрация'
              : 'Подтверждение'
        }}
      </h2>

      <form v-if="authStep === 'login'" @submit.prevent="login" class="form">
        <input type="email" v-model="email" placeholder="E-mail" required />
        <input type="password" v-model="password" placeholder="Пароль" required />
        <button type="submit">Войти</button>
        <button type="button" @click="changeStep('register')">
          Зарегистрироваться
        </button>
      </form>

      <form v-if="authStep === 'register'" @submit.prevent="register" class="form">
        <input type="text" v-model="fio" placeholder="ФИО" required />
        <input type="tel" v-model="phone" placeholder="Номер" required />
        <input type="email" v-model="email" placeholder="Почта" required />
        <input type="password" v-model="password" placeholder="Пароль" required />
        <input type="password" v-model="confirmPassword" placeholder="Подтверждение пароля" required />
        <button type="submit">Зарегистрироваться</button>
        <button type="button" @click="changeStep('login')">
          Уже есть аккаунт? Войти
        </button>
      </form>

      <form v-if="authStep === 'confirm'" @submit.prevent="confirmRegistration" class="form">
        <input type="text" v-model="confirmationCode" placeholder="Код подтверждения" required />
        <input type="hidden" v-model="email" />
        <button type="submit">Подтвердить</button>
      </form>

      <button @click="modalStore.close">Закрыть</button>
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
