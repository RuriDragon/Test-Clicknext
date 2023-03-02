import { defineStore } from 'pinia'

export const useAlertStore = defineStore({
  id: 'alert-store',
  state: () => {
    return {
      isAlert: false,
      message: '',
      error:false,
      timeout:2000
    }
  },
  actions: {
    newAlert(msg,isErr){
        this.error = isErr;
        this.message = msg;
        this.isAlert = true;
        setTimeout(() => {
            this.closeAlert();
        }, this.timeout);
    },
    closeAlert(){
        this.isAlert = false;
        this.message = '';
        this.error = false;
    }
    // deposit(amount){
    //   this.amount = this.amount + amount
    // },
    // withdraw(amount){
    //   if(this.amount === 0 ) { return }
    //   this.amount = this.amount - amount
    // }
  },
//   getters: {
//     getAmount: state => state.amount
//   },
})