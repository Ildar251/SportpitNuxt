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
	password: yup
		.string()
		.min(6, 'Минимум 6 символов')
		.required('Обязательное поле'),
})

const confirmSchema = yup.object({
	confirmationCode: yup.string().required('Введите код подтверждения'),
})

// Базовая схема регистрации
const baseRegisterSchema = {
	surname: yup
		.string()
		.min(2, 'Некорректная фамилия')
		.required('Заполните фамилию'),
	name: yup.string().min(2, 'Некорректное имя').required('Заполните имя'),
	phone: yup
		.string()
		.transform(value => value.replace(/\D/g, ''))
		.matches(/^\+?\d{11,12}$/, 'Некорректный номер')
		.required('Введите телефон'),
	email: yup.string().email('Некорректный email').required('Обязательное поле'),
	password: yup
		.string()
		.min(6, 'Минимум 6 символов')
		.required('Обязательное поле'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'Пароли не совпадают')
		.required('Подтвердите пароль'),
}

// Динамическая схема для регистрации
const registerSchema = (isLegalEntity: boolean) =>
	yup.object({
		...baseRegisterSchema,
		inn: isLegalEntity
			? yup
				.string()
				.matches(/^\d{10}$/, 'ИНН должен содержать 10 цифр')
				.required('Введите ИНН')
			: yup.string().notRequired(),
	})

const tabs = [
	{ id: 'fizical', label: 'Физическое лицо' },
	{ id: 'legal', label: 'Юридическое лицо' },
]

const activeTab = ref(tabs[0].id)

// Выбираем нужную схему в зависимости от шага и activeTab
const validationSchema = computed(() => {
	if (authStep.value === 'login') return loginSchema
	if (authStep.value === 'confirm') return confirmSchema
	return registerSchema(activeTab.value === 'legal')
})

// Инициализация формы с начальными значениями для всех полей
const { handleSubmit, errors, setFieldValue, resetForm, setTouched } = useForm({
	validationSchema,
	initialValues: {
		email: '',
		password: '',
		surname: '',
		name: '',
		phone: '',
		confirmPassword: '',
		confirmationCode: '',
		inn: '',
	},
	validateOnMount: false,
})

// Поля формы
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: surname } = useField<string>('surname')
const { value: name } = useField<string>('name')
const { value: phone } = useField<string>('phone')
const { value: confirmPassword } = useField<string>('confirmPassword')
const { value: confirmationCode } = useField<string>(
	'confirmationCode',
	undefined,
	{
		validateOnMount: false,
	}
)
const { value: inn } = useField<string>('inn')

const registeredEmail = ref('')
const attemptsLeft = ref(5)

// Обработчики отправки
const login = handleSubmit(async values => {
	try {
		await authStore.login(values.email, values.password)
		console.log('Closing modal after successful login')
		modalStore.close()
	} catch {
		toast.error('Ошибка входа', { autoClose: 3000 })
	}
})
const register = handleSubmit(async values => {
	try {
		const isLegalEntity = activeTab.value === 'legal'
		const response = await authStore.register(
			values.surname,
			values.name,
			values.phone,
			values.email,
			values.password,
			values.inn || '',
			isLegalEntity
		)

		if (!response.success) {
			toast.error(response.message, { autoClose: 3000 })
			return
		}

		// Если success: true, переходим к confirm
		registeredEmail.value = values.email
		attemptsLeft.value = 5
		authStep.value = 'confirm'
	} catch (error: any) {
		toast.error(error.message, { autoClose: 3000 })
		return // Останавливаем выполнение
	}
})

const confirmRegistration = handleSubmit(async values => {
	if (attemptsLeft.value <= 0) {
		try {
			await authStore.deleteUser(registeredEmail.value)
		} catch (error: any) {
			console.error('Error deleting user:', error)
		}
		authStep.value = 'register'
		attemptsLeft.value = 5
		return
	}

	try {
		console.log(
			'Attempting to confirm email with code:',
			values.confirmationCode
		)
		await authStore.confirmEmail(registeredEmail.value, values.confirmationCode)

		toast.success('Email подтверждён! Теперь войдите в аккаунт.', {
			autoClose: 3000,
		})

		// Переключаемся на авторизацию только при успешном подтверждении
		authStep.value = 'login'
		modalStore.close()
	} catch (error: any) {
		console.error('Error during email confirmation:', error)

		// Уменьшаем количество попыток
		attemptsLeft.value -= 1

		if (attemptsLeft.value > 0) {
			toast.error(`Неверный код. Осталось попыток: ${attemptsLeft.value}`, {
				autoClose: 3000,
			})
		} else {
			try {
				await authStore.deleteUser(registeredEmail.value)
			} catch (deleteError: any) {
				console.error('Error deleting user:', deleteError)
			}
			toast.error(
				'Вы исчерпали все попытки. Пожалуйста, зарегистрируйтесь заново.',
				{ autoClose: 3000 }
			)
			authStep.value = 'register'
			attemptsLeft.value = 5
		}
	}
})

const changeStep = (step: 'login' | 'register' | 'confirm') => {
	console.log('Changing step to:', step)
	authStep.value = step
	authStore.error = undefined

	resetForm({
		values: {
			email: '',
			password: '',
			surname: '',
			name: '',
			phone: '',
			confirmPassword: '',
			confirmationCode: '',
			inn: '',
		},
		errors: {},
		touched: {},
	})

	setTouched({ confirmationCode: false })
}

// Очищаем поле ИНН при переключении на физическое лицо
watch(activeTab, newTab => {
	if (newTab === 'fizical') {
		setFieldValue('inn', '')
	}
})

// Логируем изменения состояния модального окна
watch(
	() => modalStore.isOpen,
	newValue => {
		console.log('Modal isOpen changed to:', newValue)
	}
)
</script>

<template>
	<Transition name="fade">
		<div v-if="modalStore.isOpen" class="modal modal-auth">
			<div class="modal__content">
				<div class="modal__left">
					<NuxtImg src="/images/logo.svg" alt="logo" sizes="250px  md:320px" />
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
							<div class="modal__link">
								<span>Ещё нет аккаунта?</span>
								<span class="link" @click="changeStep('register')">Зарегистрироваться</span>
							</div>
						</div>
					</form>

					<form class="form" v-else-if="authStep === 'register'" @submit="register">
						<h2 class="h2">Регистрация</h2>
						<UiTabs v-model="activeTab" :tabsClass="'tabs-auth'" :tabs="tabs" />
						<div class="form__grid">
							<UiInput v-model="surname" type="text" placeholder="Фамилия" :error="errors.surname" />
							<UiInput v-model="name" type="text" placeholder="Имя" :error="errors.name" />
							<UiInput v-model="phone" mask="+7 (###) ###-##-##" type="tel" placeholder="Номер"
								:error="errors.phone" />
							<UiInput v-model="email" type="email" placeholder="Почта" :error="errors.email" />
							<UiInput v-model="password" type="password" placeholder="Пароль" :error="errors.password" />
							<UiInput v-model="confirmPassword" type="password" placeholder="Подтверждение пароля"
								:error="errors.confirmPassword" />
							<Transition name="slide-input">
								<UiInput v-model="inn" type="text" mask="##########" placeholder="ИНН"
									v-show="activeTab === 'legal'" :error="errors.inn" />
							</Transition>
						</div>

						<div class="modal__bottom">
							<button type="submit">Зарегистрироваться</button>
							<span class="modal__policy">
								Создавая аккаунт, принимаю условия
								<NuxtLink to="/policy">политики</NuxtLink> и
								<NuxtLink to="/policy">пользовательского соглашения</NuxtLink>
							</span>
						</div>

						<div class="modal__link">
							<span>Уже есть аккаунт?</span>
							<span class="link" @click="changeStep('login')">Войти</span>
						</div>
					</form>

					<form class="form" v-else-if="authStep === 'confirm'" @submit="confirmRegistration">
						<h2 class="h2">Подтвердите email</h2>
						<UiInput v-model="registeredEmail" type="hidden" />
						<UiInput v-model="confirmationCode" type="text" placeholder="Код подтверждения"
							:error="errors.confirmationCode" :disabled="attemptsLeft <= 0" />
						<p v-if="attemptsLeft < 5" style="margin-top: 10px">
							Осталось попыток: {{ attemptsLeft }}
						</p>
						<p v-if="attemptsLeft <= 0" style="margin-top: 10px">
							Попытки закончились. Пожалуйста, зарегистрируйтесь заново.
						</p>
						<div class="form__elems">
							<button type="submit" :disabled="attemptsLeft <= 0">
								Подтвердить
							</button>
						</div>
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
	max-height: 95svh;

	&.modal-auth {
		background: $color-white;
		color: $color-primary;
		padding: auto-clamp(20px, 72px);
		position: relative;
		max-width: 1400px;
		width: 90%;
		overflow-x: hidden;
		overflow-y: auto;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 120;
		transition: $transition;

		.modal__content {
			width: 100%;
			@include flex(row, center, stretch);
			gap: auto-clamp(42px, 84px);

			@media screen and (max-width: 768px) {
				flex-direction: column;
			}

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
					right: calc(auto-clamp(21px, 42px) * -1);

					@media screen and (max-width: 768px) {
						display: none;
					}
				}

				.modal__img {
					margin-top: auto-clamp(30px, 60px);

					@media screen and (max-width: 768px) {
						display: none;
					}
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

.slide-input-enter-active,
.slide-input-leave-active {
	transition: all 0.3s ease;
	overflow: hidden;
	/* Скрываем содержимое во время анимации */
}

.slide-input-enter-from,
.slide-input-leave-to {
	opacity: 0;
	height: 0;
}

.slide-input-enter-to,
.slide-input-leave-from {
	opacity: 1;
	height: 62px;
}

.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.25s ease-out;
}

.slide-up-enter-from {
	opacity: 0;
	transform: translateY(30px);
}

.slide-up-leave-to {
	opacity: 0;
	transform: translateY(-30px);
}
</style>
