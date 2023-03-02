<script setup>

    const props = defineProps({
      modelValue: String,
      maxCash:Number,
      minCash:Number
      // modelModifiers: { default: () => ({}) }
    })
    
    const emit = defineEmits(['update:modelValue'])

    const rules = {
        required: value => !!value && value > 0 || 'กรุณาใส่จำนวนเงิน',
    }
    // const maxCash = 100000;
    // const minCash = 0;
    const cashInput = ref(null);

    const cash = computed({
      // getter
      get() {
        return Number(props.modelValue)
      },
      // setter
      set() {
        return Number(props.modelValue)
      }
    })

    const min = computed(()=>{
      return props.minCash ? props.minCash : 0
    })

    const max = computed(()=>{
      return props.maxCash ? props.maxCash : 999999
    })

    function limitCash(e){
      
        const currentCash = Number(e.target.value)

        if(currentCash > max.value){
          nextTick(()=>{
            emit('update:modelValue', max.value)
          })
        } else if(currentCash <= min.value){
          emit('update:modelValue', min.value)
        } else {
          emit('update:modelValue', e.target.value)
        }
    }

    function onlyNumber ($event) {
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
        if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { 
            $event.preventDefault();
        }
    }

    // onMounted(()=>{
    //   const cashInputElement = cashInput.value.$el.querySelector('input')
    //   cashInputElement.min = minCash
    //   cashInputElement.max = maxCash
    // })

</script>
<template>
    <div>
      <h5 class="text-start justify-start mb-2">
        จำนวนเงิน *
      </h5>
      <v-text-field
          ref="cashInput"
          v-model.number="cash"
          :rules="[rules.required]"
          @input="limitCash"
          type="number"
          @keypress="onlyNumber"
          @paste.prevent
          density="compact"
          variant="outlined"
          clearable
          @click:clear="emit('update:modelValue','')"
          single-line
      ></v-text-field>
    </div>
</template>