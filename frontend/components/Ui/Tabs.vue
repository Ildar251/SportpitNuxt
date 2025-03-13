<script setup lang="ts">
const props = defineProps<{
    tabs: Array<{ id: string, label: string, icon?: string }>
    tabsClass: string
    modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const setActiveTab = (tabId: string) => {
    emit('update:modelValue', tabId)
}
</script>

<template>
    <div :class="'tabs ' + props.tabsClass">
        <div v-for="tab in props.tabs" :key="tab.id" :class="'tabs__item ' + (modelValue === tab.id ? 'active' : '')"
            @click="setActiveTab(tab.id)">
            <NuxtIcon v-if="tab.icon" :name="tab.icon" />
            <span>{{ tab.label }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tabs {
    @include flex(row, flex-start, flex-start);
    gap: 12px;


    .tabs__item {
        @include flex(row, flex-start, center);
        gap: 24px;
        width: 100%;
        height: auto-clamp(58px, 80px);
        padding: auto-clamp(16px, 24px) auto-clamp(24px, 42px);
        font-size: auto-clamp(16px, 24px);
        font-weight: 700;
        border-right: 4px solid transparent;
        background-color: #FCFCFC;
        transition: $transition;
        cursor: pointer;

        .nuxt-icon {
            transition: none;
        }

        &:hover {
            color: $color-accent;
        }
    }

    .tabs__item.active {
        border-right: 4px solid $color-accent;
        background-color: $color-border;
    }
}
</style>