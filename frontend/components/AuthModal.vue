<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useModalStore } from '@/stores/useModalStore'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue3-toastify'
import * as yup from 'yup'
const modalStore = useModalStore()
const authStore = useAuthStore()
const authStep = ref<'login' | 'register' | 'confirm'>('login')

// Схемы валидации
const loginSchema = yup.object({
  email: yup.string().email('Некорректный email').required('Обязательное поле'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Обязательное поле'),
})

const registerSchema = yup.object({
  fio: yup.string().min(2, 'Некорректное ФИО').required('Введите ФИО'),
  phone: yup.string().transform((value) => value.replace(/\D/g, '')).matches(/^\+?\d{11,12}$/, 'Некорректный номер').required('Введите телефон'),
  email: yup.string().email('Некорректный email').required('Обязательное поле'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Обязательное поле'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
    .required('Подтвердите пароль'),
})

const confirmSchema = yup.object({
  confirmationCode: yup.string().required('Введите код подтверждения'),
})

// Выбираем нужную схему в зависимости от шага
const validationSchema = computed(() => {
  return authStep.value === 'login'
    ? loginSchema
    : authStep.value === 'register'
      ? registerSchema
      : confirmSchema
})

// Инициализация формы
const { handleSubmit, errors } = useForm({ validationSchema })

// Поля формы
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: fio } = useField<string>('fio')
const { value: phone } = useField<string>('phone')
const { value: confirmPassword } = useField<string>('confirmPassword')
const { value: confirmationCode } = useField<string>('confirmationCode')

const registeredEmail = ref('')

// Обработчики отправки
const login = handleSubmit(async (values) => {
  try {
    await authStore.login(values.email, values.password)
    modalStore.close()
  } catch {
    toast.error('Ошибка входа', { autoClose: 3000 })
  }
})

const register = handleSubmit(async (values) => {
  try {
    await authStore.register(values.fio, values.phone, values.email, values.password)
    registeredEmail.value = values.email
    console.log(registeredEmail.value)

    authStep.value = 'confirm'
  } catch {
    toast.error('Ошибка регистрации', { autoClose: 3000 })
  }
})

const confirmRegistration = handleSubmit(async (values) => {
  try {
    await authStore.confirmEmail(registeredEmail.value, values.confirmationCode)
    modalStore.close()
  } catch {
    toast.error('Ошибка подтверждения email', { autoClose: 3000 })
  }
})

const changeStep = (step: 'login' | 'register' | 'confirm') => {
  authStep.value = step
  authStore.error = null
}
</script>

<template>
  <Transition name="fade">
    <div v-if="modalStore.isOpen" class="modal">

      <div class="modal__content">
        <NuxtImg src="/images/logo.svg" alt="logo" width="260" />
        <Transition name="slide-up" mode="out-in">
          <h2 class="h2" v-if="authStep === 'login'">Вход</h2>
          <h2 class="h2" v-else-if="authStep === 'confirm'">Подтвердите email</h2>
          <h2 class="h2" v-else-if="authStep === 'register'">Регистрация</h2>
        </Transition>

        <Transition name="slide-up" mode="out-in">
          <form class="form" v-if="authStep === 'login'" @submit="login">
            <UiInput v-model="email" type="email" placeholder="E-mail" :error="errors.email" />
            <UiInput v-model="password" type="password" placeholder="Пароль" :error="errors.password" />
            <button type="submit">Войти</button>
            <div class="modal__link"><span>Ещё нет аккаунта?</span> <span class="link"
                @click="changeStep('register')">Зарегистрироваться</span></div>
          </form>

          <form class="form" v-else-if="authStep === 'register'" @submit="register">
            <UiInput v-model="fio" type="text" placeholder="ФИО" :error="errors.fio" />
            <UiInput v-model="phone" mask="+7 (###) ###-##-##" type="tel" placeholder="Номер" :error="errors.phone" />
            <UiInput v-model="email" type="email" placeholder="Почта" :error="errors.email" />
            <UiInput v-model="password" type="password" placeholder="Пароль" :error="errors.password" />
            <UiInput v-model="confirmPassword" type="password" placeholder="Подтверждение пароля"
              :error="errors.confirmPassword" />
            <button type="submit">Зарегистрироваться</button>
            <span class="modal__policy">Создавая аккаунт, принимаю условия <NuxtLink to="/policy">политики</NuxtLink> и
              <NuxtLink to="/policy">
                пользовательского
                соглашения</NuxtLink>
            </span>
            <div class="modal__link"><span>Уже есть аккаунт?</span> <span class="link"
                @click="changeStep('login')">Войти</span></div>
          </form>

          <form class="form" v-else-if="authStep === 'confirm'" @submit="confirmRegistration">
            <UiInput v-model="registeredEmail" type="hidden" />
            <UiInput v-model="confirmationCode" type="text" placeholder="Код подтверждения"
              :error="errors.confirmationCode" />
            <button type="submit">Подтвердить</button>
          </form>
        </Transition>
        <button @click="modalStore.close" class="modal__close">
          <NuxtIcon name="close" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal__link {
  margin-top: 30px;
  @include flex(row, space-between, center);
  width: 100%;
  color: $color-primary;
  cursor: pointer;

  .link {
    font-size: 16px;

    &:not(:hover) {
      color: inherit;
    }
  }

}

.modal__policy {
  display: inline-block;
  margin-top: 30px;
  color: $color-gray;

  a {
    text-decoration: underline;
  }
}

.modal {
  background: $color-white;
  color: $color-primary;
  padding: 40px 30px;
  position: relative;
  max-width: 600px;
  width: 100%;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 120;
  transition: $transition;

  .modal__content {
    width: 100%;
    @include flex(column, center, center);
  }

  h2 {
    font-size: 42px;
    margin-top: 32px;
  }

  .form {
    margin-top: 20px;
    width: 100%;

    &>.input-field:not(:first-child) {
      margin-top: 12px;
    }
  }

}

.modal__close {
  position: absolute;
  top: 20px;
  right: 20px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: $color-primary;
}
</style>