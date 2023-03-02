<script setup>
  import { storeToRefs } from 'pinia'
  import { useAccountBalanceStore } from '~/store/accountBalance'
  import { useTransactionStore } from '~/store/transaction'

  definePageMeta({
    layout: "dashboard",
    middleware: ["auth"]
  });

  const accountBalanceStore = useAccountBalanceStore()
  const transactionStore = useTransactionStore()

  const { amount } = storeToRefs(accountBalanceStore)

  const rules = {
    required: value => !!value && value > 0 || 'กรุณาใส่จำนวนเงิน',
  }
  const loading = ref(false)
  const minCash = 0
  const maxCash = 100000
  const cash = ref(null)
  const dialog = ref(false)
  const transactionType = ref(null)

  function onlyNumber ($event) {
   let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
   if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { 
      $event.preventDefault();
   }
  }

  function timeStamp(){
    const nuxtApp = useNuxtApp()
    const timestamp = nuxtApp.$dayjs(new Date()).format('DD/MM/YYYY HH:mm')
    return timestamp
  }

  function clearCash(){
    cash.value = null
  }

  function limitCash(e){
    const currentCash = Number(e.target.value)
    if(currentCash > maxCash){
      cash.value = maxCash
    } else if (currentCash < minCash) {
      cash.value = minCash
    }
  }

  function selectTransaction(type){
    transactionType.value = type
    setTimeout(() => {
      dialog.value = true
    }, 300);
  }

  async function transactionConfirm(){

    if(loading.value) return

    loading.value = true

    const payload = {
      id: transactionStore.getLenTransaction + 1,
      amount:Number(cash.value),
      timeStamp: await timeStamp(),
      status: transactionType.value,
      email: 'email@gmail.com' //hardcode
    }

    if(transactionType.value === 'deposit'){
      accountBalanceStore.deposit(cash.value)
      transactionStore.saveTransaction(payload)
    }
    if(transactionType.value === 'withdraw'){
      accountBalanceStore.withdraw(cash.value)
      transactionStore.saveTransaction(payload)
    }

    setTimeout(() => {
      clearCash()
      loading.value = false
      dialog.value = false
    }, 1000);

  }

</script>
<template>
  <div>
  <v-row>
    <v-col cols="12" lg="4" md="6" offset-md="3" offset-lg="4">
      <h3 class="text-center mb-2">
        จำนวนเงินคงเหลือ {{ amount.toLocaleString() }}
      </h3>
      <v-row>
        <v-col cols="12">
          <h5 class="text-start justify-start mb-2">
            จำนวนเงิน *
          </h5>
          <v-text-field
              v-model.number="cash"
              :rules="[rules.required]"
              @input="limitCash"
              @keypress="onlyNumber($event)"
              @paste.prevent
              density="compact"
              variant="outlined"
              clearable
              single-line
          ></v-text-field>
          <v-row>
            <v-col cols="6">
              <!-- accountBalanceStore.deposit(Number(cash)) -->
              <v-btn @click="selectTransaction('deposit')" :disabled="!cash" color="green" variant="tonal" block>
                ฝาก
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn @click="selectTransaction('withdraw')" :disabled="!cash" color="red" variant="tonal" block>
                ถอน
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <v-dialog
    v-model="dialog"
    persistent
    width="450"
  >
    <v-card class="pa-4">
        <v-card-title class="text-h6">
            ยืนยันการฝาก-ถอน
        </v-card-title>
        <v-card-text v-html="'จำนวนเงิน '+ Number(cash).toLocaleString() + ' บาท'">
        </v-card-text>
        <v-card-actions>
          <v-btn
              color="green"
              variant="flat"
              @click="transactionConfirm"
              :loading="loading"
          >
              ยืนยัน
          </v-btn>
          <v-btn
              color="red"
              variant="text"
              @click="dialog = false"
          >
              ยกเลิก
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
    </v-card>
    </v-dialog>

  </div>
</template>