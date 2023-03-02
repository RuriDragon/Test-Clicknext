import { defineStore } from 'pinia'
export const useLoginStore = defineStore({
  id: 'login-store',
  state: () => {
    return {
      isLogin: false,
    }
  },
  actions: {
    initLogin(status){
      this.isLogin = status ? status : this.isLogin
    },
    logout() {
      this.isLogin = false;
      const getCookieLogin = useCookie('isLogin');
      getCookieLogin.value = this.isLogin
      return navigateTo('/') 
    },
    login() {
      // ...process
      this.isLogin = true;
      return navigateTo('/dashboard/home') 
    }
  },
  getters: {
    getStatus: state => state.isLogin,
  },
})