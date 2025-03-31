<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

// Реактивные переменные для данных формы
const formData = ref({
    name: '',
    phone: '',
    company: '',
})

// Реактивные переменные для ошибок
const errors = ref({
    name: '',
    phone: '',
    company: '',
})

// Реактивная переменная для состояния загрузки
const isSubmitting = ref(false)

// Валидация формы
const validateForm = () => {
    let isValid = true
    errors.value = { name: '', phone: '', company: '' } // Сбрасываем ошибки

    if (!formData.value.name.trim()) {
        errors.value.name = 'Пожалуйста, укажите ваше имя'
        isValid = false
    }

    if (!formData.value.phone.trim()) {
        errors.value.phone = 'Пожалуйста, укажите ваш телефон'
        isValid = false
    } else {
        // Простая проверка формата телефона
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/
        if (!phoneRegex.test(formData.value.phone)) {
            errors.value.phone = 'Пожалуйста, укажите корректный номер телефона'
            isValid = false
        }
    }

    return isValid
}

// Функция отправки формы
const submitForm = async (event: Event) => {
    event.preventDefault() // Предотвращаем стандартное поведение формы

    // Проверяем валидацию
    if (!validateForm()) {
        return
    }

    isSubmitting.value = true

    try {
        const response = await $fetch<{ success: boolean; message: string }>(
            'https://test.top-nnov.ru/api/contact',
            {
                method: 'POST',
                body: formData.value,
            }
        )

        if (response.success) {
            toast.success('Сообщение успешно отправлено!', { autoClose: 3000 })
            // Сбрасываем форму после успешной отправки
            formData.value = { name: '', phone: '', company: '' }
            errors.value = { name: '', phone: '', company: '' }
        } else {
            toast.error(response.message || 'Ошибка при отправке сообщения', { autoClose: 3000 })
        }
    } catch (error) {
        console.error('Ошибка при отправке формы:', error)
        toast.error('Произошла ошибка. Попробуйте снова', { autoClose: 3000 })
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <section class="section section-capture">
        <div class="container">
            <div class="capture">
                <div class="capture__image">
                    <NuxtImg src="/images/capture-image.png" />
                </div>

                <div class="capture__form">
                    <h2 class="h2">Ответим на все ваши вопросы</h2>
                    <form @submit="submitForm" class="form form-dark">
                        <UiInput v-model="formData.name" type="text" placeholder="Ваше имя" :error="errors.name"
                            :disabled="isSubmitting" />
                        <UiInput v-model="formData.phone" type="tel" placeholder="Ваш телефон" mask="+7 (###) ###-##-##"
                            :error="errors.phone" :disabled="isSubmitting" />
                        <UiInput v-model="formData.company" type="text" placeholder="Ваша компания"
                            :error="errors.company" :disabled="isSubmitting" />
                        <button class="btn" type="submit" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Отправка...' : 'Отправить' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.section-capture {
    .container {
        @media screen and (max-width: 768px) {
            padding: 0;
        }
    }
}

.capture {
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 100%;
    gap: 20px;
    color: $color-white;


    @media screen and (max-width: 1024px) {
        grid-template-columns: 1fr;

    }

    .capture__image {
        width: 100%;
        height: auto;

        @media screen and (max-width: 1024px) {
            display: none;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
        }
    }

    .capture__form {
        @include flex(column, flex-start, flex-start);
        background-color: $color-primary;
        height: auto;
        margin-top: 6%;
        padding: auto-clamp(36px, 72px) auto-clamp(30px, 120px);
        background-image: url(/images/capture_bg.png);
        background-repeat: no-repeat;
        background-position: center right 40px;

        @media screen and (max-width: 1024px) {
            margin-top: 0px;
            background-image: url('/public/images/bg_capture_mobile.jpg');
            background-size: cover;
            background-position: center;
        }

        .h2 {
            font-size: auto-clamp(32px, 42px);
        }

        .form {
            margin-top: 42px;
            width: 100%;

            .input-field {
                margin-bottom: 20px;
                width: 100%;
            }

            button {
                max-width: auto-clamp(320px, 420px);

                &:hover {
                    background-color: $color-white;
                    color: $color-accent;
                }
            }
        }
    }
}
</style>