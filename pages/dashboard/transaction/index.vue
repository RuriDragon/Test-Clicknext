<script setup>
import { useAccountBalanceStore } from '~/store/accountBalance'
import { useTransactionStore } from '~/store/transaction'
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"]
});

const accountBalanceStore = useAccountBalanceStore()
const transactionStore = useTransactionStore()

const itemsPerPage = ref(5)
const headers = ref([
  { title: 'Datetime', align: 'start', key: 'timeStamp' },
  { title: 'Amount', align: 'center', key: 'amount' },
  { title: 'Status', align: 'center', key: 'status' },
  { title: 'Email', align: 'start', key: 'email' },
  { title: 'Action', align: 'center', key: 'action' },
]);
const transaction = ref(transactionStore.getTransaction)
const loading = ref(false)
const dialog = ref(false)
const action = ref(null)
const editItem = ref(null)
const cash = ref(null)
const minCash = 0
const maxCash = 100000
const updateBalance = ref(null)
const rules = {
  required: value => !!value && value > 0 || 'กรุณาใส่จำนวนเงิน',
}

function onlyNumber ($event) {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { 
    $event.preventDefault();
  }
}

function limitCash(e){
  const currentCash = Number(e.target.value)
  if(currentCash > maxCash){
    cash.value = maxCash
  } else if (currentCash < minCash) {
    cash.value = minCash
  }
}

function edit(item){
  action.value = 'edit'
  editItem.value = item
  dialog.value = true
}

function deleteTransaction(item){
  action.value = 'delete'
  editItem.value = item
  dialog.value = true
}

function transactionConfirm(){

  if(loading.value) return

  loading.value = true

  const currentBalance = accountBalanceStore.getAmount
  
  if(action.value === 'edit'){
    updateBalance.value = (currentBalance - editItem.value.amount) + cash.value
    transactionStore.editTransaction(editItem.value.id,cash.value)
  }
  
  if(action.value === 'delete'){
    updateBalance.value = currentBalance + editItem.value.amount
    transactionStore.deleteTransaction(editItem.value.id,cash.value)
  }

  accountBalanceStore.update(updateBalance.value) 
  setTimeout(() => {
    loading.value = false
    dialog.value = false
  }, 1000);

}

</script>
<template>
<div>
  <h3 class="mb-2">
    ประวัติรายการฝากถอน
  </h3>
  <v-data-table
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="transaction"
    item-value="name"
    class="elevation-1"
  >
  <template v-slot:item.status="{ item }">
    <span v-if="item.raw.status === 'deposit'" class="text-green">ฝาก</span>
    <span v-if="item.raw.status === 'withdraw'" class="text-red">ถอน</span>
  </template>
  <template v-slot:item.action="{ item }">
    <v-btn v-if="item.raw.status === 'deposit'" @click="edit(item.raw)" variant="tonal">
      Edit
    </v-btn>
    <v-btn v-if="item.raw.status === 'withdraw'" @click="deleteTransaction(item.raw)" variant="tonal">
      Delete
    </v-btn>
    </template>
    <template v-slot:no-data>
      <div class="pa-4 text-grey-lighten-1">
        no data
      </div>
  </template>
  </v-data-table>

  <v-dialog
    v-model="dialog"
    persistent
    width="450"
  >
    <v-card class="pa-4">
        <v-card-title class="text-h6 pa-2">
          <template v-if="action === 'edit'">
            แก้ไขจำนวนเงินฝาก
          </template>
          <template v-if="action === 'delete'">
            ยืนยันการถอน
          </template>
        </v-card-title>
        <v-card-text class="pa-2">
          <template v-if="action === 'edit'">
            <span>
              ของวันที่ {{ editItem.timeStamp }}
              <br/>
              จากอีเมล {{ editItem.email }}
            </span>
            <div class="pt-4">
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
            <!-- <CashInput v-model="cash" :minCash="0" :maxCash="100000" /> -->  
            </div>
          </template>
          <template v-if="action === 'delete'">
            <span>
              จำนวนเงินถอน {{ editItem.amount.toLocaleString() }}
              <br/>
              ของวันที่ {{ editItem.timeStamp }}
              <br/>
              จากอีเมล {{ editItem.email }}
            </span>
          </template>
        </v-card-text>
        <v-card-actions>
          <template v-if="action === 'edit'">
            <v-btn
              color="green"
              variant="flat"
              @click="transactionConfirm"
              :disabled="!cash"
              :loading="loading"
            >
                ยืนยัน
            </v-btn>
          </template>
          <template v-if="action === 'delete'">
            <v-btn
              color="green"
              variant="flat"
              @click="transactionConfirm"
              :loading="loading"
            >
                ยืนยัน
            </v-btn>
          </template>
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