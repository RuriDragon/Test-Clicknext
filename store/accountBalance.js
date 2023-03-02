import { defineStore } from 'pinia'

export const useAccountBalanceStore = defineStore({
  id: 'acount-balance-store',
  state: () => {
    return {
      amount: 1000000,
    }
  },
  actions: {
    deposit(amount){
      this.amount = this.amount + Number(amount)
    },
    withdraw(amount){
      this.amount = this.amount - Number(amount)
    },
    update(amount){
      this.amount = amount
    }
  },
  getters: {
    getAmount: state => state.amount
  },
})