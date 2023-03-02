import { defineStore } from 'pinia'
import { useAccountBalanceStore } from './accountBalance'

export const useTransactionStore = defineStore({
  id: 'transaction-store',
  state: () => {
    return {
      transactions: [],
    }
  },
  actions: {
    findIndexTransaction(id){
      return this.transactions.findIndex( e => e.id === id)
    },
    saveTransaction(payload) {
        this.transactions.push(payload)
    },
    editTransaction(id,amount){
        const index = this.findIndexTransaction(id)
        if(index != -1){
            this.transactions[index].amount = amount  
        }
    },
    deleteTransaction(id,amount){
        const index = this.findIndexTransaction(id)
        if(index != -1){
          this.transactions.splice(index,1)
        }
    }
  },
  getters: {
    getTransaction: state => state.transactions,
    getLenTransaction: state => state.transactions.length
  },
})