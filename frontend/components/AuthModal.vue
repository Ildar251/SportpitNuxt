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
  surname: yup.string().min(2, 'Некорректная фамилия').required('Заполните фамилию'),
  name: yup.string().min(2, 'Некорректное имя').required('Заполните имя'),
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
const { value: surname } = useField<string>('surname')
const { value: name } = useField<string>('name')
const { value: phone } = useField<string>('phone')
const { value: confirmPassword } = useField<string>('confirmPassword')
const { value: confirmationCode } = useField<string>('confirmationCode')
const { value: inn } = useField<string>('inn')

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
    await authStore.register(values.name, values.surname, values.phone, values.email, values.password, values.inn)
    registeredEmail.value = values.email

    authStep.value = 'confirm'
  } catch {
    toast.error('Ошибка регистрации', { autoClose: 3000 })
  }
})

const confirmRegistration = handleSubmit(async (values) => {
  try {
    await authStore.confirmEmail(registeredEmail.value, values.confirmationCode)
    authStep.value = 'login'
    modalStore.close()
  } catch {
    toast.error('Ошибка подтверждения email', { autoClose: 3000 })
  }
})

const changeStep = (step: 'login' | 'register' | 'confirm') => {
  authStep.value = step
  authStore.error = null
}

const tabs = [
  { id: 'fizical', label: 'Физическое лицо' },
  { id: 'legal', label: 'Юридическое лицо' }
]

const activeTab = ref(tabs[0].id)
</script>

<template>
  <Transition name="fade">
    <div v-if="modalStore.isOpen" class="modal modal-auth">

      <div class="modal__content ">
        <div class="modal__left">
          <NuxtImg src="/images/logo.svg" alt="logo" width="320" />
          <h2 class="h2">Личный кабинет</h2>

          <NuxtImg src="/images/auth-img.jpg" alt="img" width="380" class="modal__img" />
        </div>

        <Transition name="slide-up" mode="out-in">
          <form class="form form--auth" v-if="authStep === 'login'" @submit="login">
            <h2 class="h2">Авторизация</h2>
            <UiInput v-model="email" type="email" placeholder="E-mail" :error="errors.email" />
            <UiInput v-model="password" type="password" placeholder="Пароль" :error="errors.password" />
            <div class="form__elems">
              <button type="submit">Войти в аккаунт</button>
              <div class="modal__link"><span>Ещё нет аккаунта?</span> <span class="link"
                  @click="changeStep('register')">Зарегистрироваться</span></div>
            </div>
          </form>

          <form class="form" v-else-if="authStep === 'register'" @submit="register">
            <h2 class="h2">Регистрация</h2>
            <UiTabs v-model="activeTab" :tabsClass="'tabs-lk'" :tabs="tabs" />
            <div class="form__grid">
              <UiInput v-model="surname" type="text" placeholder="Фамилия" :error="errors.surname" />
              <UiInput v-model="name" type="text" placeholder="Имя" :error="errors.name" />
              <UiInput v-model="phone" mask="+7 (###) ###-##-##" type="tel" placeholder="Номер" :error="errors.phone" />
              <UiInput v-model="email" type="email" placeholder="Почта" :error="errors.email" />
              <UiInput v-model="password" type="password" placeholder="Пароль" :error="errors.password" />
              <UiInput v-model="confirmPassword" type="password" placeholder="Подтверждение пароля"
                :error="errors.confirmPassword" />
              <Transition name="slide-down">
                <UiInput v-model="inn" type="password" placeholder="Инн" v-if="activeTab === 'legal'"
                  :error="errors.inn" />
              </Transition>
            </div>

            <div class="modal__bottom">
              <button type="submit">Зарегистрироваться</button>
              <span class="modal__policy">Создавая аккаунт, принимаю условия <NuxtLink to="/policy">политики</NuxtLink>
                и
                <NuxtLink to="/policy">
                  пользовательского
                  соглашения</NuxtLink>
              </span>
            </div>

            <div class="modal__link"><span>Уже есть аккаунт?</span> <span class="link"
                @click="changeStep('login')">Войти</span></div>
          </form>

          <form class="form" v-else-if="authStep === 'confirm'" @submit="confirmRegistration">
            <h2 class="h2">Подтвердите email</h2>
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
.modal {
  &.modal-auth {
    background: $color-white;
    color: $color-primary;
    padding: auto-clamp(34px, 72px);
    position: relative;
    max-width: 1400px;
    width: 90%;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 120;
    transition: $transition;

    .modal__content {
      width: 100%;
      @include flex(row, center, stretch);
      gap: 84px;

      .modal__left {
        @include flex(column, center, center);
        position: relative;
        flex: 1;

        .h2 {
          margin-top: 24px;
          margin-bottom: 0;
        }

        &::after {
          content: '';
          display: block;
          width: 2px;
          height: 100%;
          background-color: $color-border;
          position: absolute;
          right: -42px;
        }

        .modal__img {
          margin-top: auto-clamp(30px, 60px);
        }
      }
    }

    .tabs {
      margin-bottom: auto-clamp(24px, 42px);
    }

    .h2 {
      font-size: auto-clamp(24px, 42px);
      margin-bottom: auto-clamp(24px, 42px);
    }

    .form {
      flex: 2;
      @include flex(column, stretch, stretch);
      height: auto;

      &--auth {
        gap: auto-clamp(24px, 42px);
      }

      .form__elems {
        margin-top: auto-clamp(24px, 42px);
      }

      .form__grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: auto-clamp(24px, 42px);
        margin-bottom: auto-clamp(24px, 42px);
      }

      .modal__bottom {
        @include flex(row, space-between, center);
        margin-top: auto;
        gap: auto-clamp(24px, 42px);
      }
    }
  }

}
</style>