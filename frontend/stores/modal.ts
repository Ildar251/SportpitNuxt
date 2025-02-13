import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    isAuthModalOpen: false
  }),
  actions: {
    openAuthModal() {
      this.isAuthModalOpen = true
    },
    closeAuthModal() {
      this.isAuthModalOpen = false
    }
  }
})
