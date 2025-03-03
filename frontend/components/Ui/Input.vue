<script setup lang="ts">
import { vMaska } from 'maska/vue'

defineProps({
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
        default: '',
    },
    modelValue: {
        type: String,
        default: '',
    },
    error: {
        type: String,
        default: '',
    },
    mask: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}
</script>

<template>
    <div class="input-field">
        <input :type="type" :placeholder="placeholder" :value="modelValue" @input="handleInput"
            v-maska="mask ? { mask } : undefined" />
        <Transition name="slide-left">
            <span v-if="error" class="error">{{ error }}</span>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.input-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;
}

.error {
    position: absolute;
    bottom: -20px;
    color: $color-red;
    font-size: 12px;
    text-align: left;
}
</style>
