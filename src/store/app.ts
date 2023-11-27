// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: {email: "", id: 0, name: "", status: "", access_token: ""}
  }),
  actions: {
    saveUser(userData: any) {
      this.user = userData;
    },
    signOut() {
      this.user = {email: "", id: 0, name: "", status: "", access_token: ""}
    }
  }
})
