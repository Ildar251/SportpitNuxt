<script setup lang="ts">
import { useMenuStore } from '~/stores/useMenuStore'
import { useMobileMenuStore } from '~/stores/useMobileMenuStore'
import { useModalStore } from "~/stores/useModalStore"

const menuStore = useMenuStore()
const mobileMenuStore = useMobileMenuStore()
const modalStore = useModalStore()

const { isOpen: isMenuOpen } = storeToRefs(menuStore)
const { isOpen: isMobileMenuOpen } = storeToRefs(mobileMenuStore)
const { isOpen: isModalOpen } = storeToRefs(modalStore)

const isVisible = computed(() => isMenuOpen.value || isMobileMenuOpen.value || isModalOpen.value)

const closeAll = () => {
    menuStore.close()
    mobileMenuStore.close()
    modalStore.close()
}
</script>
<template>
    <Transition name="fade">
        <div v-if="isVisible" class="overlay" @click="closeAll"
            :style="{ 'z-index': modalStore.isOpen == true ? '110' : '50' }"></div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 50;
}
</style>